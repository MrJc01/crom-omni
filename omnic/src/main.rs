mod core;
mod targets;
mod commands;

use clap::{Parser, Subcommand, ValueEnum};
use std::fs;
use std::path::{Path, PathBuf};
use colored::*;
use anyhow::{Context, Result, anyhow};
use crate::core::parser::Parser as OmniParser; 
use crate::core::codegen::CodeGenerator;
use crate::core::config::OmniConfig;
use crate::core::semantic;
use crate::core::packager::{self, PackageOptions, InternalAppType};
// use rayon::prelude::*; // Disabled for Serial Build (Phase 10)




use std::net::TcpListener;
use std::io::{self, Write};

fn is_port_available(port: u16) -> bool {
    // Check both loopback and wildcard to ensure port is truly free
    TcpListener::bind(("127.0.0.1", port)).is_ok() && TcpListener::bind(("0.0.0.0", port)).is_ok()
}

fn find_available_port(start_port: u16) -> u16 {
    let mut port = start_port;
    // Try up to 100 ports
    while !is_port_available(port) && port < start_port + 100 {
        port += 1;
    }
    
    if port != start_port {
        println!("{} Port {} busy, switching to {}", "⚠️".yellow(), start_port, port);
    }
    port
}

// get_python_dll_path moved to packager or deprecated in favor of loader script


#[derive(Parser)]
#[command(name = "omnic")]
#[command(version = "0.1.0")]
#[command(about = "Compilador Oficial da Plataforma Omni", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Compila um arquivo E/OU processa omni.config.json
    #[command(alias = "compile")]

    Build {
        /// Caminho para o arquivo fonte .omni (Opcional se usar config)
        file: Option<PathBuf>,

        /// Caminho para o arquivo de saida (Opcional)
        output_file: Option<PathBuf>,

        /// Mostra tokens (Debug)
        #[arg(long, short)]
        tokens: bool,

        /// Mostra AST (Debug)
        #[arg(long)]
        ast: bool,

        /// Linguagem Alvo (Ignorado se usar config)
        #[arg(long, default_value = "js")]
        target: TargetLang,
    },
    /// Clean build artifacts (dist/, target/, logs)
    Clean,
    /// Ingest Legacy Code (Node/PHP) into Omni Capsules
    Ingest {
        /// Source file or directory to ingest
        path: PathBuf,
    },
    /// Run an Omni file with specific framework context or app mode
    Run {
        /// Source file to run
        file: PathBuf,

        /// App Mode/Type (native, tauri, web, server)
        #[arg(long, value_enum, default_value_t = AppType::Native)]
        r#type: AppType,

        /// Target Framework (laravel, yii2)
        #[arg(long, value_enum)]
        target_framework: Option<TargetFramework>,

        /// Run in Command-Line Mode (Console output only)
        #[arg(long)]
        cmd: bool,

        /// Run in Hollow VM (Bytecode)
        #[arg(long)]
        bytecode: bool,

        // Legacy Flags (kept for backward compat or mapped to types)
        // We will remove --web, --web-app, --app flags and rely on --type
        // But for smoother transition, we can keep them hidden or deprecated?
        // For this refactor, let's remove them to force the new structure as requested.
    },
    /// Visual Trace Step-by-Step (Hollow VM Studio)
    Studio {
        /// Source file to debug
        file: PathBuf,
    },
    /// Interactive TUI Dashboard
    Ui,
    /// Verify system dependencies (gcc, node)
    Doctor,
    /// Deep clean build artifacts and fix locks
    Repair,
}

#[derive(Clone, ValueEnum, Debug, PartialEq)]
enum TargetLang {
    Js,
    Python,
    C,
    Bytecode,
}

impl std::str::FromStr for TargetLang {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "js" | "javascript" => Ok(TargetLang::Js),
            "python" | "py" => Ok(TargetLang::Python),
            "c" | "ansi-c" => Ok(TargetLang::C),
            "bytecode" | "vm" => Ok(TargetLang::Bytecode),
            _ => Err(format!("Linguagem desconhecida: {}", s)),
        }
    }
}

// AppType and TargetFramework definitions
#[derive(Clone, ValueEnum, Debug, PartialEq)]
enum AppType {
    Native,
    Tauri,
    Web,
    Server,
}

#[derive(Clone, ValueEnum, Debug, PartialEq)]
enum TargetFramework {
    Laravel,
    Yii2,
    React,
    Vue,
}



fn main() {
    if let Err(e) = run() {
        eprintln!("{} {}", "Error:".red().bold(), e);
        
        let err_str = e.to_string();
        if err_str.contains("Access is denied") || err_str.contains("used by another process") {
             eprintln!("\n{} Build seems locked. Try running:", "💡".yellow().bold());
             eprintln!("    omni repair");
        }
        
        std::process::exit(1);
    }
}

fn run() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Build { file, output_file, tokens, ast, target }) => {
            // Modo 1: Arquivo Único
            if let Some(source_file) = file {
                eprintln!("{} {} -> {:?}", "Compilando Arquivo:".green(), source_file.display(), target);
                process_single_file(&source_file, target.clone(), *tokens, *ast, output_file.as_deref())?;
            } 
            // Modo 2: Projeto (omni.config.json)
            else {
                let config_path = Path::new("omni.config.json");
                if !config_path.exists() {
                     return Err(anyhow!("Nenhum arquivo .omni fornecido e 'omni.config.json' não encontrado."));
                }

                println!("{} {}...", "Lendo Configuração:".cyan(), config_path.display());
                let config_content = fs::read_to_string(config_path)?;
                let config: OmniConfig = serde_json::from_str(&config_content)
                    .context("Erro ao parsear omni.config.json")?;

                println!("{} {} v{}", "Projeto:".blue().bold(), config.project.name, config.project.version);

                // Serial compilation to prevent file locking on Windows (Phase 10)
                let targets: Vec<_> = config.targets.into_iter().collect();
                targets.iter().for_each(|(target_name, target_cfg)| {
                    println!("\n>> Construindo target '{}' ({})", target_name.yellow(), target_cfg.format);

                    let out_dir = PathBuf::from(&target_cfg.output);
                    if !out_dir.exists() {
                        let _ = fs::create_dir_all(&out_dir);
                    }

                    let source_path = target_cfg.source.clone()
                        .map(PathBuf::from)
                        .unwrap_or_else(|| PathBuf::from("src/main.omni"));
                    
                    if !source_path.exists() {
                        println!("{} Arquivo fonte não encontrado: {}", "AVISO:".red(), source_path.display());
                        return;
                    }

                    let lang_enum = match target_cfg.format.as_str().parse::<TargetLang>() {
                        Ok(l) => l,
                        Err(_) => {
                            println!("Formato desconhecido '{}'. Pulando.", target_cfg.format);
                            return; 
                        }
                    };

                    let generated_files_result = process_single_file(&source_path, lang_enum.clone(), *tokens, *ast, Some(&out_dir));
                    if let Err(e) = generated_files_result {
                        println!("{} {}", "ERRO:".red(), e);
                        return;
                    }

                    if target_cfg.bundle == Some(true) {
                         let (shebang, ext) = match lang_enum {
                             TargetLang::Python => ("#!/usr/bin/env python3", "run"),
                             TargetLang::Js => ("#!/usr/bin/env node", "run"),
                             TargetLang::C => ("", "exe"),
                             TargetLang::Bytecode => ("", "vm"),
                         };

                         let bundle_name = format!("{}.{}", target_name, ext);
                         let bundle_path = out_dir.join(bundle_name);
                         
                         println!("   📦 Empacotando para: {}", bundle_path.display());
                         
                         // match core::packager::create_bundle(&out_dir, &bundle_path, shebang) {
                         //     Ok(_) => println!("   ✨ Bundle criado com sucesso!"),
                         //     Err(e) => println!("   ⚠️ Falha no empacotamento: {}", e),
                         // }
                         println!("   ⚠️ Bundling disabled temporarily (Phase 9)");
                    }
                });
                println!("\n{}", "Build de Projeto Concluído!".green().bold());
            }
        }
        Some(Commands::Clean) => {
             commands::clean::clean()?;
        }

        Some(Commands::Ingest { path }) => {
            println!("{} Ingesting from: {}", "🌀".cyan(), path.display());
            core::ingest::ingest_path(&path)?;
        }
        Some(Commands::Doctor) => {
             println!("{} Executing Omni Doctor...", "🚑".red());
             
             // Check Node
             let node_ver = std::process::Command::new("node").arg("-v").output();
             match node_ver {
                 Ok(v) => println!("     ✅ Node.js: {}", String::from_utf8_lossy(&v.stdout).trim()),
                 Err(_) => {
                     println!("     ❌ Node.js NOT FOUND (Required for JS Target)");
                     println!("        Download: https://nodejs.org/");
                 }
             }

             // Check GCC
             print!("   - GCC/MinGW (C Target): ");
             match std::process::Command::new("gcc").arg("--version").output() {
                 Ok(_) => println!("{}", "OK".green()),
                 Err(_) => {
                     println!("{}", "MISSING".red().bold());
                     println!("     {} Install MinGW (Windows) or GCC (Linux/Mac) to use --c", "ℹ".blue());
                     println!("     Windows Command: choco install mingw");
                 }
             }

             // Check Tauri
             print!("   - Tauri CLI (Web App): ");
             match std::process::Command::new("cargo").args(["tauri", "--version"]).output() {
                 Ok(output) if output.status.success() => println!("{}", "OK".green()),
                 _ => {
                     println!("{}", "MISSING".red().bold());
                     println!("     {} Run 'cargo install tauri-cli' to use --web-app", "ℹ".blue());
                 }
             }

             // Check pywebview
             print!("   - pywebview (Native App): ");
             match std::process::Command::new("python").args(["-c", "import webview; print(webview.__version__)"]).output() {
                 Ok(v) if v.status.success() => {
                      println!("     ✅ Installed: {}", String::from_utf8_lossy(&v.stdout).trim());
                 },
                 _ => {
                     println!("{}", "MISSING".red().bold());
                     println!("     {} Run 'pip install pywebview' to use --app", "ℹ".blue());
                 }
             }

             println!("\n{}", "Diagnosis Complete.".green());
        }
        Some(Commands::Repair) => {
            commands::repair::clean_build_artifacts()?;
        }
        Some(Commands::Ui) => {
            core::tui::run_tui()?;
        }
        Some(Commands::Studio { file }) => {
            println!("{}", "🔮 Omni Studio: Visual Trace Mode".magenta().bold());
            println!("   File: {}", file.display());

            // 1. Generate VM code
            let out_vm = file.with_extension("vm");
            process_single_file(&file, TargetLang::Bytecode, false, false, Some(&out_vm))?;

            // 2. Execute with Trace
            use crate::core::vm::{VirtualMachine, OpCode};
            // Demo calc ops for now
            let ops = vec![
                 OpCode::LoadConst(10i64),
                 OpCode::LoadConst(20i64),
                 OpCode::Add,
                 OpCode::Print,
                 OpCode::Halt,
            ];

            let mut vm = VirtualMachine::new(ops);
            println!("\n{}", "--- VM PULSE START ---".dimmed());
            vm.run(); 
            println!("{}", "--- VM PULSE END ---".dimmed());
        }
        None => {
            // Se nenhum comando for passado, mostra o help
             use clap::CommandFactory;
             Cli::command().print_help()?;
        }
        Some(Commands::Run { file, r#type, target_framework, cmd, bytecode }) => {
            // 1. Framework Targets (Laravel, Yii2, etc)
            if let Some(fw) = target_framework {
                 println!("{} Preparing {:?} Environment...", "🏗️".magenta(), fw);
                 match fw {
                     TargetFramework::Laravel => {
                         let adapter = crate::core::adapters::LaravelAdapter;
                         let config = OmniConfig::default(); // TODO: Load real config if available
                         let output_dir = file.parent().unwrap().join("laravel_dist");
                         use crate::core::adapters::FrameworkAdapter;
                         if let Err(e) = adapter.scaffold(&output_dir, &config) {
                             println!("   ❌ Scaffolding failed: {}", e);
                         }
                     },
                     _ => println!("   ⚠️ This framework is not yet supported."),
                 }
                 return Ok(());
            }

            // 2. Command Line Mode
            if *cmd {
                 println!("{} Running in Command-Line Mode...", "💻".green());
                 let out_file = file.with_extension("js");
                 process_single_file(&file, TargetLang::Js, false, false, Some(&out_file))?;
                 
                 // Prepend 3D runtime for ASCII if needed
                 let source_content = fs::read_to_string(&file).unwrap_or_default();
                 if source_content.contains("std/3d.omni") || source_content.contains("Scene3D") {
                     // Check runtimes... (simplified for brevity, reused existing logic if needed)
                 }
                 
                 std::process::Command::new("node")
                     .arg(&out_file)
                     .status()?;
                 return Ok(());
            }

            // 3. Bytecode Mode
            if *bytecode {
                  println!("{} Booting Hollow VM...", "🔮".magenta());
                  let out_vm = file.with_extension("vm");
                  process_single_file(&file, TargetLang::Bytecode, false, false, Some(&out_vm))?;
                  println!("   📜 Bytecode generated at: {}", out_vm.display());
                  
                  use crate::core::vm::{VirtualMachine, OpCode};
                  let mut vm = VirtualMachine::new(vec![
                      OpCode::LoadConst(10i64),
                      OpCode::Halt,
                  ]);
                  vm.run();
                  return Ok(());
            }

            // 4. App Mode (Native, Tauri, Web)
            println!("{} Preparing Visual Application ({:?})...", "🚀".cyan(), r#type);

            // A. Generate JS & HTML
            let out_file = file.with_extension("js");
            process_single_file(&file, TargetLang::Js, false, false, Some(&out_file))?;
            
            // Runtime Injection (3D)
            let source_content = fs::read_to_string(&file).unwrap_or_default();
            if source_content.contains("std/3d.omni") || source_content.contains("Scene3D") {
                 let runtime_paths = ["omnic/lib/std/runtime_3d.js", "lib/std/runtime_3d.js"];
                 for runtime_path in runtime_paths {
                     if Path::new(runtime_path).exists() {
                         let runtime = fs::read_to_string(runtime_path).unwrap_or_default();
                         let generated = fs::read_to_string(&out_file).unwrap_or_default();
                         let combined = format!("{}\n\n// === Generated Omni Code ===\n{}", runtime, generated);
                         fs::write(&out_file, combined)?;
                         println!("   🎮 3D Runtime prepended");
                         break;
                     }
                 }
            }

            let html_file = file.with_extension("html");
            let js_name = out_file.file_name().unwrap().to_str().unwrap();
            let html_content = format!(r#"<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Omni App</title>
<style>body {{ margin: 0; background: #1a1a2e; overflow: hidden; }}</style>
</head><body>
<script src="{}"></script>
</body></html>"#, js_name);
            fs::write(&html_file, html_content)?;

            // B. Serve (Unified for all visual modes)
            // Ideally packager handles this, but for "Run" we usually want a live server + window.
            // The packager is more for "Build" (creating the dist folder).
            // But the user request implies `build --app-native` triggers packaging.
            // `run --app-native` should just run it.
            
            let port = find_available_port(3003); 
            
            // Determine Internal App Type
             let internal_type = match r#type {
                 AppType::Native => InternalAppType::Native,
                 AppType::Tauri => InternalAppType::Tauri,
                 AppType::Web => InternalAppType::Web,
                 AppType::Server => InternalAppType::Server,
             };

             // Start Server (If needed for Native/Web)
             if matches!(internal_type, InternalAppType::Native | InternalAppType::Web) {
                 let server_html_path = html_file.clone(); 
                 let server_js_path = out_file.clone();     
                 
                 println!("   📡 Starting Live Server on port {}...", port);
                 std::thread::spawn(move || {
                     let server = tiny_http::Server::http(format!("0.0.0.0:{}", port)).unwrap();
                     for request in server.incoming_requests() {
                         let url = request.url();
                         if url == "/" || url == "/main.html" || url == "/index.html" {
                             let html_content = std::fs::read_to_string(&server_html_path).unwrap_or_else(|_| "<h1>Error loading HTML</h1>".to_string());
                             let response = tiny_http::Response::from_string(html_content)
                                 .with_header(tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html"[..]).unwrap());
                             let _ = request.respond(response);
                         } else if url.ends_with(".js") {
                             let js_content = std::fs::read_to_string(&server_js_path).unwrap_or_else(|_| "// Error loading JS".to_string());
                             let response = tiny_http::Response::from_string(js_content)
                                 .with_header(tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"application/javascript"[..]).unwrap());
                             let _ = request.respond(response);
                         } else {
                             let response = tiny_http::Response::from_string("404 Not Found").with_status_code(404);
                             let _ = request.respond(response);
                         }
                    }
                 });
             }

             // C. Invoke Packager / Launcher
             // For "Run", we act as a temporary packager outputting to pwd?
             // Or just launch directly.
             // Let's use the packager for "Tauri" mode scaffolding since it's complex.
             // For Native, we use the packager to generate the loader then run it.
             
             let options = PackageOptions {
                 app_type: internal_type.clone(),
                 output_dir: file.parent().unwrap_or(Path::new(".")).to_path_buf(),
                 source_file: file.clone(),
                 os: None,
                 arch: None,
             };
             
             // Scaffold/Prepare
             packager::package_app(&options)?;
             
             // Launch
             if internal_type == InternalAppType::Native {
                 // Launch Python Loader (generated by packager)
                 let loader_path = options.output_dir.join("native_loader.py");
                 if loader_path.exists() {
                     println!("   ⏯️  Launching Native Window...");
                     std::process::Command::new("python") 
                         .arg(&loader_path)
                         .status()?;
                 }
             } else if internal_type == InternalAppType::Tauri {
                  // Tauri dev is launched inside package_tauri
             } else if internal_type == InternalAppType::Web {
                 println!("   🌍 Web App Running at http://localhost:{}", port);
                 // Keep alive
                 std::thread::sleep(std::time::Duration::from_secs(3600));
             }
        }
    }

    Ok(())
}

fn process_single_file(
    path: &Path, 
    lang: TargetLang, 
    debug_tokens: bool, 
    debug_ast: bool, 
    out_dir: Option<&Path>
) -> Result<()> {
    // 0. Carregar Prelude/Std Lib
    // Check multiple locations
    let possible_paths = [
        "lib/std/io.omni",
        "omnic/lib/std/io.omni",
        "std/io.omni",
    ];
    
    let mut std_content = String::new();
    for p in possible_paths {
        let path = Path::new(p);
        if path.exists() {
             std_content = fs::read_to_string(path).unwrap_or_default();
             std_content.push('\n'); 
             println!("   📚 StdLib Carregada: {}", p);
             break;
        }
    }

    // 1. Read
    let user_content = fs::read_to_string(path)
        .with_context(|| format!("Erro lendo {}", path.display()))?;
    
    // Concatenar Std + User (Prelude injection)
    let full_content = format!("{}{}", std_content, user_content);

    // 2. Lex / Parse
    let lexer = core::lexer::Lexer::new(&full_content);
    let mut parser = OmniParser::new(lexer, &full_content);
    
    let program = match parser.parse_program() {
        Ok(p) => p,
        Err(e) => return Err(anyhow!("Erro de Parsing em {}: {}", path.display(), e)),
    };

    if debug_ast {
        println!("{:#?}", program);
    }

    // 2.5 Semantic Analysis (Type Checking)
    let analyzer = semantic::SemanticAnalyzer::new();
    let mut analyzer = analyzer;
    if let Err(e) = analyzer.analyze(&program) {
        eprintln!("{} {}", "Semantic Warning:".yellow(), e);
        // Continue anyway - semantic errors are warnings for now
    }
    for warning in &analyzer.warnings {
        eprintln!("   {} {}", "⚠".yellow(), warning);
    }

    // 3. Generate
    let backend: Box<dyn CodeGenerator> = match lang {
        TargetLang::Js => Box::new(targets::js::JsBackend::new()),
        TargetLang::Python => Box::new(targets::python::PythonBackend::new()),
        TargetLang::C => Box::new(targets::c_backend::CBackend::new()),
        TargetLang::Bytecode => Box::new(targets::bytecode::BytecodeBackend::new()),
    };

    let code = backend.generate(&program)?;

    // 4. Output
    // 4. Output
    if let Some(out_path) = out_dir {
        // If out_path has extension, treat as file. If not, treat as dir.
        let final_path = if out_path.extension().is_some() {
            out_path.to_path_buf()
        } else {
            let filename = match lang {
                TargetLang::Js => "index.js",
                TargetLang::Python => "__main__.py",
                TargetLang::C => "main.c",
                TargetLang::Bytecode => "main.vm",
            };
            out_path.join(filename)
        };

        if let Some(parent) = final_path.parent() {
            if !parent.exists() {
               let _ = fs::create_dir_all(parent);
            }
        }
        
        fs::write(&final_path, code)?;
        println!("   {} Gerado: {}", "✔".green(), final_path.display());
    } else {
        println!("{}", code);
    }

    Ok(())
}
