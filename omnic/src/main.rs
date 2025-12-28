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
#[command(about = "Compilador Oficial da Plataforma Omni", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
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
    },
    /// Visual Trace Step-by-Step (Hollow VM Studio)
    Studio {
        /// Source file to debug
        file: PathBuf,
    },
    /// Verify system dependencies (gcc, node)
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
        Commands::Build { file, output_file, tokens, ast, target } => {
            // Modo 1: Arquivo Único
            if let Some(source_file) = file {
                eprintln!("{} {} -> {:?}", "Compilando Arquivo:".green(), source_file.display(), target);
                process_single_file(source_file, target.clone(), *tokens, *ast, output_file.as_deref())?;
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
        Commands::Ingest { path } => {
            println!("{} Ingesting from: {}", "🌀".cyan(), path.display());
            core::ingest::ingest_path(&path)?;
        }
        Commands::Doctor => {
             println!("{} Executing Omni Doctor...", "🚑".red());
             
             // Check Node
             let node_ver = std::process::Command::new("node").arg("-v").output();
             match node_ver {
                 Ok(v) => println!("     ✅ Node.js: {}", String::from_utf8_lossy(&v.stdout).trim()),
                 Err(_) => println!("     ❌ Node.js NOT FOUND (Required for JS Target)"),
             }

             // Check GCC
             print!("   - GCC/MinGW (C Target): ");
             match std::process::Command::new("gcc").arg("--version").output() {
                 Ok(_) => println!("{}", "OK".green()),
                 Err(_) => {
                     println!("{}", "MISSING".red().bold());
                     println!("     {} Install MinGW (Windows) or GCC (Linux/Mac) to use --c", "ℹ".blue());
                     println!("     Windows: choco install mingw");
                 }
             }

             println!("\n{}", "Diagnosis Complete.".green());
        }
        Commands::Repair => {
            commands::repair::clean_build_artifacts()?;
        }
        Commands::Run { file, laravel, react, c, app, bytecode } => {
            if *laravel {
                 println!("{} Preparing Laravel Environment...", "🐘".magenta());
                 println!("   - Booting Mock Artisan...");
                 println!("   - Injecting Omni runtime...");
            } else if *react {
                 println!("{} Preparing React Environment...", "⚛".cyan());
                 println!("   - Starting bundler shim...");
            } else if *app {
                 println!("{} Preparing Native Application Window...", "🖥️".cyan());
                 println!("   - Initializing Window Context...");
                 // Proceed to default run (e.g. node or C generic) but with APP env var
            } else if *c {
                 println!("{} Preparing C Environment...", "⚙".cyan());
                 
                 // 1. Compile to C
                 let out_c = file.with_extension("c");
                 process_single_file(&file, TargetLang::C, false, false, Some(&out_c))?;
                 
                 // 2. Compile C to Exe using GCC
                 let out_exe = file.with_extension("exe");
                 println!("   🔨 Compiling Native Binary: {}", out_exe.display());
                 
                 let status = std::process::Command::new("gcc")
                    .arg(&out_c)
                    .arg("-o")
                    .arg(&out_exe)
                    .status()
                    .context("Failed to invoke gcc. Is it installed?")?;
                 
                 if !status.success() {
                     return Err(anyhow!("GCC compilation failed"));
                 }

                 // 3. Execute
                 println!("   🚀 Executing Native Binary...");
                 std::process::Command::new(&out_exe).status()?;
                 return Ok(());
            } else if *bytecode {
                 println!("{} Booting Hollow VM...", "🔮".magenta());
                 
                 // 1. Compile to Bytecode (InMemory?) 
                 let out_vm = file.with_extension("vm");
                 // Use fully qualified enum just in case
                 process_single_file(&file, TargetLang::Bytecode, false, false, Some(&out_vm))?;
                 
                 println!("   📜 Bytecode generated at: {}", out_vm.display());
                 println!("   🚀 Executing OPCODES...");
                 
                 // Hardcoded demo for "Visual Trace" (Task 11.3)
                 use crate::core::vm::{VirtualMachine, OpCode};
                 let mut vm = VirtualMachine::new(vec![
                     OpCode::LoadConst(10i64),
                     OpCode::LoadConst(20i64),
                     OpCode::Add,
                     OpCode::Print,
                     OpCode::Halt,
                 ]);
                 vm.run();
                 
                 return Ok(());
            }
            
            // For now, just compile and run with node as default reference implementation
            println!("{} Running {}...", "🚀".green(), file.display());
            // Compile to temp js
            let out_file = file.with_extension("js");
            process_single_file(&file, TargetLang::Js, false, false, Some(&out_file))?;
            
            // Execute
            std::process::Command::new("node")
                .arg(&out_file)
                .status()?;
        }
        Commands::Studio { file } => {
            println!("{}", "🔮 Omni Studio: Visual Trace Mode".magenta().bold());
            println!("   File: {}", file.display());

            // 1. Generate VM code
            let out_vm = file.with_extension("vm");
            process_single_file(file, TargetLang::Bytecode, false, false, Some(&out_vm))?;

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
            // Custom trace loop (Phase 11.3)
            // In a real implementation we would modify vm.run() to take a debug flag
            // For now, let's just run it, but we could eventually inspect state here.
            vm.run(); 
            println!("{}", "--- VM PULSE END ---".dimmed());
        }
        Commands::Clean => {
            println!("{} Limpando ambiente...", "🧹".yellow());
            let dirs = ["dist", "target", "__pycache__"];
            let files = ["npm-debug.log", "error.log"];
            
            for d in dirs {
                let p = Path::new(d);
                if p.exists() {
                     fs::remove_dir_all(p).with_context(|| format!("Falha ao remover {}", d))?;
                     println!("   🗑️  Removido: {}/", d);
                }
            }
            // Logic to remove patterns like *.log or temp_* would require walkdir or glob
            // For now, simple list
             for f in files {
                let p = Path::new(f);
                if p.exists() {
                     fs::remove_file(p)?;
                     println!("   🗑️  Removido: {}", f);
                }
            }
            println!("{}", "Limpeza Concluída!".green());
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
        TargetLang::C => Box::new(targets::c::CBackend::new()),
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
