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
// use rayon::prelude::*; // Disabled for Serial Build (Phase 10)

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
    /// Run an Omni file with specific framework context
    Run {
        /// Source file to run
        file: PathBuf,

        /// Run in Laravel context
        #[arg(long)]
        laravel: bool,

        /// Run in React context
        #[arg(long)]
        react: bool,

        /// Run as C Native Binary
        #[arg(long)]
        c: bool,

        /// Run as Native App Window
        #[arg(long)]
        app: bool,

        /// Run in Hollow VM (Bytecode)
        #[arg(long)]
        bytecode: bool,

        /// Run as Web App (alias for --react)
        #[arg(long)]
        web: bool,

        /// Run as Web App (Explicit)
        #[arg(long, alias = "web-app")]
        web_app: bool,

        /// Run in Command-Line Mode (Console output only)
        #[arg(long)]
        cmd: bool,
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
    Bytecode, // Hollow VM
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
                 Ok(_) => println!("{}", "OK".green()),
                 Err(_) => {
                     println!("{}", "MISSING".red().bold());
                     println!("     {} Run 'cargo install tauri-cli' to use --web-app", "ℹ".blue());
                 }
             }

             // Check pywebview
             print!("   - pywebview (Native App): ");
             match std::process::Command::new("python").args(["-c", "import webview; print(webview.__version__)"]).output() {
                 Ok(v) => println!("     ✅ Installed: {}", String::from_utf8_lossy(&v.stdout).trim()),
                 Err(_) => {
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
        Some(Commands::Run { file, laravel, react, c, app, bytecode, web, web_app, cmd }) => {
            if *laravel {
                 println!("{} Preparing Laravel Environment...", "🐘".magenta());
            } else if *react || *web || *web_app || *app {
                 println!("{} Preparing Visual Environment...", "🌐".cyan());
                 
                 // 1. Generate JS file
                 let out_file = file.with_extension("js");
                 process_single_file(&file, TargetLang::Js, false, false, Some(&out_file))?;
                 
                 // 2. Prepend 3D runtime if needed
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
                 
                 // 3. Create HTML wrapper
                 let html_file = file.with_extension("html");
                 let js_name = out_file.file_name().unwrap().to_str().unwrap();
                 let html_content = format!(r#"<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Omni App - {}</title>
<style>body {{ margin: 0; background: #1a1a2e; overflow: hidden; }}</style>
</head><body>
<script src="{}"></script>
</body></html>"#, js_name, js_name);
                 fs::write(&html_file, html_content)?;
                 
                 // 4. Determine Mode
                 if *web_app {
                     println!("   🦋 Metamorphosis: Tauri Mode...");
                     // TODO: Implement Tauri Scaffolding in /temp
                     println!("   ⚠️ Tauri Scaffolding not yet implemented (Phase 14.1) - Falling back to Web");
                 }
                 
                 if *app {
                     println!("   🖥️  Native App Mode (WebView2/Python)...");
                     
                     let port = 8080;
                     let serve_dir = file.parent().unwrap_or(Path::new("."));
                     
                     // A. Start Python HTTP Server
                     println!("   🚀 Starting Internal Server on port {}...", port);
                     let mut server_process = std::process::Command::new("python")
                         .args(["-m", "http.server", &port.to_string()])
                         .current_dir(serve_dir)
                         .stdout(std::process::Stdio::null()) 
                         .stderr(std::process::Stdio::null())
                         .spawn()
                         .context("Failed to start python http server")?;

                     // A.1 Wait for server
                     std::thread::sleep(std::time::Duration::from_millis(500)); 
                     
                     // B. Generate Loader Script (Python + pywebview)
                     // If pywebview is not installed, the user needs `pip install pywebview`
                     let loader_script = format!(r#"
import webview
import time
import sys

def open_window():
    webview.create_window('Omni Native App', 'http://localhost:{}/{}')
    webview.start()

if __name__ == '__main__':
    try:
        open_window()
    except Exception as e:
        print(f"Error: {{e}}")
        sys.exit(1)
"#, port, html_file.file_name().unwrap().to_str().unwrap());

                     let loader_path = file.with_extension("loader.py");
                     fs::write(&loader_path, loader_script)?;
                     
                     println!("   ⏯️  Launching Native Window...");
                     let status = std::process::Command::new("python")
                         .arg(&loader_path)
                         .status();
                         
                     // Cleanup
                     let _ = server_process.kill();
                     
                     if let Err(_) = status {
                         println!("   ❌ Failed to launch python webview. Ensure 'pip install pywebview' is run.");
                         println!("   fallback: Opening in browser...");
                         let _ = std::process::Command::new("explorer").arg(&html_file).spawn();
                     }

                     return Ok(());

                 } else {
                     // Web Mode
                     let port = 3000;
                     println!("   🚀 Starting server at http://localhost:{}", port);
                     println!("   📌 Open: http://localhost:{}/{}", port, html_file.file_name().unwrap().to_str().unwrap());
                     
                     std::process::Command::new("python")
                         .args(["-m", "http.server", &port.to_string()])
                         .current_dir(file.parent().unwrap_or(Path::new(".")))
                         .status()?;
                 }

            } else if *cmd {
                 println!("{} Running in Command-Line Mode...", "💻".green());
                 // Just compile to JS and run with node (with ASCII animation support)
                 let out_file = file.with_extension("js");
                 process_single_file(&file, TargetLang::Js, false, false, Some(&out_file))?;
                 
                 // Prepend 3D runtime for ASCII if needed
                 let source_content = fs::read_to_string(&file).unwrap_or_default();
                 if source_content.contains("std/3d.omni") || source_content.contains("Scene3D") {
                     let runtime_paths = ["omnic/lib/std/runtime_3d.js", "lib/std/runtime_3d.js"];
                     for p in runtime_paths {
                         if Path::new(p).exists() {
                             let runtime = fs::read_to_string(p).unwrap_or_default();
                             let generated = fs::read_to_string(&out_file).unwrap_or_default();
                             // ASCII mode needs special flag handling in runtime if not browser?
                             // runtime_3d.js handles `_isBrowser` check.
                             let combined = format!("{}\n\n// === Generated Omni Code ===\n{}", runtime, generated);
                             fs::write(&out_file, combined)?;
                             break;
                         }
                     }
                 }
                 
                 std::process::Command::new("node")
                     .arg(&out_file)
                     .status()?;
             } else if *bytecode {
                 // ... existing bytecode logic ...
                  println!("{} Booting Hollow VM...", "🔮".magenta());
                  let out_vm = file.with_extension("vm");
                  process_single_file(&file, TargetLang::Bytecode, false, false, Some(&out_vm))?;
                  println!("   📜 Bytecode generated at: {}", out_vm.display());
                  // ... run vm ...
                  use crate::core::vm::{VirtualMachine, OpCode};
                  let mut vm = VirtualMachine::new(vec![
                      OpCode::LoadConst(10i64),
                      OpCode::Halt,
                  ]);
                  vm.run();
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
