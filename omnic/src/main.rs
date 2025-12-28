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



fn get_available_port(start: u16) -> Option<u16> {
    (start..=9000).find(|port| is_port_available(*port))
}

fn is_port_available(port: u16) -> bool {
    std::net::TcpListener::bind(("127.0.0.1", port)).is_ok()
}

fn kill_process_on_port(port: u16) {
    #[cfg(target_os = "windows")]
    {
        // Find PID: netstat -ano | findstr :PORT
        // This is complex to do purely with std::command properly parsing, 
        // a simpler nuclear option for dev env:
        // Use powershell to kill listener.
        let output = std::process::Command::new("powershell")
            .args(["-Command", &format!("Get-NetTCPConnection -LocalPort {} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object {{ Stop-Process -Id $_ -Force }}", port)])
            .output();
        // Ignore output errors, it might fail if no process etc.
    }
}

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
                 let serve_dir = file.parent().unwrap_or(Path::new("."));

                 if *web_app {
                     println!("   🦋 Metamorphosis: Tauri Mode...");
                     
                     // 1. Create scaffolding directory
                     let app_name = file.file_stem().unwrap().to_str().unwrap();
                     let temp_dir = serve_dir.join("temp_tauri_app");
                     // DISABLED: Do not wipe temp dir, to allow incremental compilation (saves time & RAM)
                     // if temp_dir.exists() {
                     //     fs::remove_dir_all(&temp_dir).context("Failed to clean temp tauri dir")?;
                     // }
                     fs::create_dir_all(&temp_dir)?;

                     println!("   📂 Scaffolding into: {}", temp_dir.display());

                     // 2. Generate Cargo.toml
                     let cargo_toml = format!(r#"
[package]
name = "{}"
version = "0.1.0"
description = "Omni Generated App"
edition = "2021"

[build-dependencies]
tauri-build = {{ version = "2", features = [] }}

[dependencies]
tauri = {{ version = "2", features = [] }}
serde = {{ version = "1.0", features = ["derive"] }}
serde_json = "1.0"
"#, app_name.to_lowercase().replace("_", "-")); // valid cargo package name
                     
                     let src_tauri_dir = temp_dir.join("src-tauri");
                     fs::create_dir_all(&src_tauri_dir)?;
                     // Only write Cargo.toml if changed? For now just write it, cargo handles timestamps.
                     fs::write(src_tauri_dir.join("Cargo.toml"), cargo_toml)?;

                     // 3. Generate tauri.conf.json (V2 Schema)
                     // Using port 8080 as we will start a server there
                     let tauri_conf = format!(r#"
{{
  "productName": "{}",
  "version": "0.1.0",
  "identifier": "com.omni.app",
  "build": {{
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "devUrl": "http://localhost:8080",
    "frontendDist": "../src"
  }},
  "app": {{
    "windows": [
      {{
        "title": "Omni App - {}",
        "width": 800,
        "height": 600
      }}
    ],
    "security": {{
      "csp": null
    }}
  }},
  "bundle": {{
    "active": true,
    "targets": "all",
    "icon": []
  }}
}}
"#, app_name, app_name);
                     fs::write(src_tauri_dir.join("tauri.conf.json"), tauri_conf)?;

                     // 4. Generate src-tauri/src/lib.rs (V2 Entry Point)
                     let lib_rs_tauri = r#"
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
"#;
                     fs::create_dir_all(src_tauri_dir.join("src")).ok();
                     fs::write(src_tauri_dir.join("src").join("lib.rs"), lib_rs_tauri)?;

                     // 5. Generate src-tauri/src/main.rs (V2 Binary Entry Point)
                     let main_rs_tauri = r#"
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() {
    // calling lib.rs run function
    // For simplicity in this generated code, we just inline or need to mod lib?
    // Cargo default bin structure:
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
"#;
                     fs::write(src_tauri_dir.join("src").join("main.rs"), main_rs_tauri)?;
                     
                     // 6. Generate build.rs
                     let build_rs = r#"
fn main() {
  tauri_build::build()
}
"#;
                     fs::write(src_tauri_dir.join("build.rs"), build_rs)?;

                     // 7. Copy Web Assets -> temp/src
                     let web_src_dir = temp_dir.join("src");
                     fs::create_dir_all(&web_src_dir)?;
                     
                     let dest_html = web_src_dir.join("index.html");
                     fs::copy(&html_file, &dest_html)?;
                     
                     let dest_js = web_src_dir.join(js_name);
                     fs::copy(&out_file, &dest_js)?;
                     
                     let dest_js = web_src_dir.join(js_name);
                     fs::copy(&out_file, &dest_js)?;

                     // 7.5 Generate Icons (Required for Windows build)
                     let icons_dir = src_tauri_dir.join("icons");
                     fs::create_dir_all(&icons_dir)?;
                     
                     // Minimal 1x1 Transparent PNG bytes
                     let png_bytes: &[u8] = &[
                        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
                        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
                        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
                        0x42, 0x60, 0x82
                     ];
                     fs::write(icons_dir.join("icon.png"), png_bytes)?;
                     fs::write(icons_dir.join("32x32.png"), png_bytes)?;
                     fs::write(icons_dir.join("128x128.png"), png_bytes)?;
                     
                     // Construct minimal ICO
                     let png_len = png_bytes.len() as u32;
                     let mut ico_bytes = Vec::new();
                     // Header: Reserved(2) + Type(2=1) + Count(2=1)
                     ico_bytes.extend_from_slice(&[0, 0, 1, 0, 1, 0]); 
                     // Dir Entry: W(1) + H(1) + Col(1) + Res(1) + Planes(2) + BPP(2) + Size(4) + Offset(4)
                     ico_bytes.extend_from_slice(&[1, 1, 0, 0, 1, 0, 32, 0]);
                     ico_bytes.extend_from_slice(&png_len.to_le_bytes());
                     ico_bytes.extend_from_slice(&(22u32).to_le_bytes()); // 6+16=22
                     // Data
                     ico_bytes.extend_from_slice(png_bytes);
                     fs::write(icons_dir.join("icon.ico"), &ico_bytes)?;
                     
                     // 8. Start Python HTTP Server for "devUrl"
                     // Interactive Port Logic requested by user
                     let mut port = 8080;
                     if !is_port_available(port) {
                         println!("⚠️  Port {} is in use.", port);
                         println!("   (k) Kill process on port {}", port);
                         println!("   (n) switch to New available port");
                         print!("   Select [k/N]: ");
                         use std::io::{self, Write};
                         io::stdout().flush().unwrap();
                         
                         let mut input = String::new();
                         io::stdin().read_line(&mut input).unwrap();
                         let choice = input.trim().to_lowercase();
                         
                         if choice == "k" || choice == "s" || choice == "y" { // s/y from user request context (sim/yes)
                             println!("   🔪 Killing process on port {}...", port);
                             kill_process_on_port(port);
                             std::thread::sleep(std::time::Duration::from_millis(1000));
                         } else {
                             port = get_available_port(8081).unwrap_or(8081);
                             println!("   twisted_rightwards_arrows: Switched to port {}", port);
                         }
                     }

                     println!("   🚀 Starting Backend Server on port {}...", port);
                     
                     let mut server_process = std::process::Command::new("python")
                         .args(["-m", "http.server", &port.to_string()])
                         .current_dir(serve_dir)
                         .stdout(std::process::Stdio::null()) 
                         .stderr(std::process::Stdio::null())
                         .spawn()
                         .context("Failed to start python http server")?;
                         
                     // Update tauri.conf.json with correct port
                     let tauri_conf_path = src_tauri_dir.join("tauri.conf.json");
                     let conf_content = fs::read_to_string(&tauri_conf_path)?;
                     // Regex or simple replace could fail if previous run changed it. 
                     // Ideally parse JSON, but replace is safer if we know structure.
                     // We generated it with 8080 unless it was modified.
                     // Let's replace "localhost:XXXX" just to be sure if we can regex, but replace simple is fine for now if we assume clean gen?
                     // Actually, we regenerate tauri.conf.json EVERY RUN in step 3. So it is always 8080 initially.
                     let new_conf = conf_content.replace("http://localhost:8080", &format!("http://localhost:{}", port));
                     fs::write(&tauri_conf_path, new_conf)?;

                     // Wait for server warm-up
                     std::thread::sleep(std::time::Duration::from_millis(1000));

                     println!("   🦀 Launching Tauri 2.0 Dev (Jobs Limited to 2 for RAM protection)...");
                     let status = std::process::Command::new("cargo")
                         .arg("tauri")
                         .arg("dev")
                         .env("CARGO_BUILD_JOBS", "2") // LOWER MEMORY USAGE
                         .current_dir(&src_tauri_dir)
                         .status()
                         .context("Failed to run cargo tauri dev");

                     // Kill server when tauri exits
                     let _ = server_process.kill();
                     
                     if let Err(e) = status {
                        println!("   ❌ Tauri dev failed: {}", e);
                     } else if !status.unwrap().success() {
                         println!("   ❌ Tauri dev failed (exit code).");
                     }
                     
                     return Ok(());
                 }
                 
                 if *app {
                     println!("   🖥️  Native App Mode (WebView2/Python)...");
                     
                     let mut port = 8080;
                     // Only check port if we are creating a fresh server? 
                     // Assuming Internal Server strategy for --app too.
                     if !is_port_available(port) {
                         // Default to auto-switch for --app or ask? strict parity: ask.
                         // But --app is less "setup heavy" than tauri. Let's ask.
                         println!("⚠️  Port {} is in use.", port);
                         println!("   (k) Kill process on port {}", port);
                         println!("   (n) switch to New available port");
                         print!("   Select [k/N]: ");
                         use std::io::{self, Write};
                         io::stdout().flush().unwrap();
                         
                         let mut input = String::new();
                         io::stdin().read_line(&mut input).unwrap();
                         let choice = input.trim().to_lowercase();
                         
                         if choice == "k" || choice == "s" || choice == "y" {
                             println!("   🔪 Killing process on port {}...", port);
                             kill_process_on_port(port);
                             std::thread::sleep(std::time::Duration::from_millis(1000));
                         } else {
                             port = get_available_port(8081).unwrap_or(8081);
                             println!("   twisted_rightwards_arrows: Switched to port {}", port);
                         }
                     }

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
                     let status_result = std::process::Command::new("python")
                         .arg(&loader_path)
                         .status();
                         
                     // Cleanup
                     let _ = server_process.kill();
                     
                     match status_result {
                         Ok(s) => {
                             if !s.success() {
                                 println!("   ❌ Python webview process crashed.");
                                 println!("      Check if 'pythonnet' is compatible with your Python version.");
                                 println!("      Suggestions:");
                                 println!("        1. Use --web-app instead (Tauri Native).");
                                 println!("        2. Downgrade Python to 3.12 or 3.13.");
                                 println!("        3. Run 'pip install pywebview[cef]'");
                             }
                         }
                         Err(e) => {
                             println!("   ❌ Failed to launch python: {}", e);
                         }
                     }

                     return Ok(());

                 } else {
                     // Web Mode
                     let port = get_available_port(3000).unwrap_or(3000);
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
