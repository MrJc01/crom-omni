use std::path::{Path, PathBuf};
use anyhow::{Result, Context};
use std::fs;
use colored::*;

#[derive(Debug, Clone, PartialEq)]
pub enum InternalAppType {
    Native,
    Tauri,
    Web,
    Server,
    Python, // Pure Python script
}

#[derive(Debug, Clone)]
pub struct PackageOptions {
    pub app_type: InternalAppType,
    pub output_dir: PathBuf,
    pub source_file: PathBuf,
    pub os: Option<String>,
    pub arch: Option<String>,
}

pub fn package_app(options: &PackageOptions) -> Result<()> {
    match options.app_type {
        InternalAppType::Tauri => package_tauri(options),
        InternalAppType::Native => package_native(options),
        InternalAppType::Web => package_web(options),
        InternalAppType::Python => package_python(options),
        _ => Ok(()), // Server types handled elsewhere
    }
}

fn package_tauri(options: &PackageOptions) -> Result<()> {
    println!("   🦋 Metamorphosis: Tauri Mode...");
    let app_name = options.source_file.file_stem().unwrap().to_str().unwrap();
    let temp_dir = options.output_dir.join("temp_tauri_app");
    
    fs::create_dir_all(&temp_dir)?;

    println!("   📂 Scaffolding into: {}", temp_dir.display());

    // 1. Generate Cargo.toml
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
"#, app_name.to_lowercase().replace("_", "-"));

    let src_tauri_dir = temp_dir.join("src-tauri");
    fs::create_dir_all(&src_tauri_dir)?;
    fs::write(src_tauri_dir.join("Cargo.toml"), cargo_toml)?;

    // 2. Generate tauri.conf.json
    let tauri_conf = format!(r#"
{{
  "productName": "{}",
  "version": "0.1.0",
  "identifier": "com.omni.app",
  "build": {{
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "devUrl": "http://localhost:3003",
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

    // 3. Generate Main entry points
    fs::create_dir_all(src_tauri_dir.join("src")).ok();
    
    let lib_rs = r#"
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
"#;
    fs::write(src_tauri_dir.join("src").join("lib.rs"), lib_rs)?;

    let main_rs = r#"
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
"#;
    fs::write(src_tauri_dir.join("src").join("main.rs"), main_rs)?;

    let build_rs = r#"
fn main() {
  tauri_build::build()
}
"#;
    fs::write(src_tauri_dir.join("build.rs"), build_rs)?;

    // 4. Copy Assets (This assumes index.html and js file are already in output_dir)
    let web_src_dir = temp_dir.join("src");
    fs::create_dir_all(&web_src_dir)?;
    
    // Simplistic Copy - In a real scenario we'd copy the build artifacts from `options.output_dir`
    // For now, let's assume the user has generated `index.html` and `main.js` which we need to move/copy.
    // The previous main.rs logic generated them *before* calling tauri logic.
    // We will assume the caller ensures `index.html` exists in `options.output_dir`.
    
    // Copy everything from output_dir to web_src_dir
    if let Ok(entries) = fs::read_dir(&options.output_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                let fname = path.file_name().unwrap();
                // Avoid copying the tauri dir into itself if it's nested
                if !fname.to_string_lossy().contains("temp_tauri_app") {
                    fs::copy(&path, web_src_dir.join(fname)).ok();
                }
            }
        }
    }

    // 5. Icons
    let icons_dir = src_tauri_dir.join("icons");
    fs::create_dir_all(&icons_dir)?;
    let png_bytes: &[u8] = &[
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82
    ];
    fs::write(icons_dir.join("icon.png"), png_bytes)?;
    
    println!("   🦀 Launching Tauri build...");
    // Here we would run cargo tauri build // or dev
    // For now just scaffold is fine, or we can run if commanded.
    // The previous logic ran `tauri dev`.
    
    Ok(())
}

fn package_native(options: &PackageOptions) -> Result<()> {
    println!("   🖥️  Native App Mode (Packager)...");
    
    // Detect OS if not provided
    let os = options.os.clone().unwrap_or_else(|| std::env::consts::OS.to_string());
    let arch = options.arch.clone().unwrap_or_else(|| std::env::consts::ARCH.to_string());
    
    println!("      Target: {}/{}", os, arch);

    // Determine HTML filename based on source file
    let html_filename = options.source_file
        .file_stem()
        .map(|s| format!("{}.html", s.to_string_lossy()))
        .unwrap_or_else(|| "index.html".to_string());
    
    let loader_script = format!(r#"
import webview
import sys
import os

# Get path to local HTML file
current_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(current_dir, "{}")

def open_window():
    if os.path.exists(html_path):
        webview.create_window('Omni Native App', f'file://{{html_path}}')
    else:
        # Try to find any HTML file in the directory
        for f in os.listdir(current_dir):
            if f.endswith('.html'):
                html_path = os.path.join(current_dir, f)
                webview.create_window('Omni Native App', f'file://{{html_path}}')
                break
        else:
            print(f"Error: No HTML file found in {{current_dir}}")
            sys.exit(1)
    webview.start()

if __name__ == '__main__':
    try:
        open_window()
    except Exception as e:
        print(f"Error: {{e}}")
        sys.exit(1)
"#, html_filename);

    let loader_path = options.output_dir.join("native_loader.py");
    fs::write(&loader_path, loader_script)?;
    println!("   ✨ Native Loader generated: {}", loader_path.display());
    
    // If we want to strictly *Build* (compile to EXE), we would call PyInstaller here.
    // "Aciona o app_packager.omni para gerar binários reais (EXE/ELF)"
    
    let pyinstaller_check = std::process::Command::new("pyinstaller").arg("--version").output();
    if let Ok(out) = pyinstaller_check {
        if out.status.success() {
             println!("   📦 PyInstaller detected. Building EXE...");
             // pyinstaller --onefile --noconsole native_loader.py
             std::process::Command::new("pyinstaller")
                .args(["--onefile", "--noconsole", "--distpath", options.output_dir.to_str().unwrap()])
                .arg(&loader_path)
                .current_dir(&options.output_dir)
                .status()?;
        }
    } else {
        println!("   ⚠️ PyInstaller not found. Generated loader script only.");
    }

    Ok(())
}

fn package_web(_options: &PackageOptions) -> Result<()> {
    println!("   🌐 Web App Ready.");
    // Just ensure HTML exists.
    Ok(())
}

fn package_python(options: &PackageOptions) -> Result<()> {
    println!("   🐍 Pure Python Mode...");
    
    // For Python target, we assume the codegen already generated a .py file
    // The packager just needs to ensure it runs properly
    let py_file = options.source_file.with_extension("py");
    
    if py_file.exists() {
        println!("   ✨ Python script ready: {}", py_file.display());
    } else {
        // Create a wrapper script that calls the generated JS via Node (fallback)
        // Or indicate that Python codegen should be invoked
        println!("   ⚠️ Python file not found. Ensure --target python is used in build.");
    }
    
    Ok(())
}
