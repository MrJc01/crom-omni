use std::path::{Path, PathBuf};
use std::fs;
use anyhow::{Result, anyhow};
use regex::Regex;

pub fn ingest_path(path: &Path) -> Result<()> {
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                ingest_file(&path)?;
            }
        }
    } else {
        ingest_file(path)?;
    }
    Ok(())
}

fn ingest_file(path: &Path) -> Result<()> {
    let content = fs::read_to_string(path)?;
    let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
    
    let omni_code = match ext {
        "php" => ingest_php(&content, path),
        "js" | "ts" => ingest_node(&content, path),
        _ => return Ok(()), // Skip unknown extensions
    };
    
    if let Ok(code) = omni_code {
        let out_path = path.with_extension("omni");
        fs::write(&out_path, code)?;
        println!("   ✨ Ingested: {} -> {}", path.display(), out_path.display());
    }
    
    Ok(())
}

fn ingest_php(content: &str, path: &Path) -> Result<String> {
    let file_stem = path.file_stem().unwrap().to_string_lossy();
    let capsule_name = capitalize(&file_stem);
    
    // Simple regex heuristics for PHP
    // 1. Detect Functions: function name(...)
    let re_func = Regex::new(r"function\s+(\w+)\s*\(([^)]*)\)").unwrap();
    
    let mut flows = String::new();
    
    // 2. Detect Classes: class Name extends Model
    let re_class = Regex::new(r"class\s+(\w+)\s+extends\s+Model").unwrap();

    let mut flows = String::new();
    let mut decorators = String::new();

    for cap in re_class.captures_iter(content) {
        let class_name = &cap[1];
        decorators.push_str("@entity\n"); // Add entity decorator
        // We could also rename the capsule to match the model if strictly 1 file = 1 model
    }
    
    for cap in re_func.captures_iter(content) {
        let name = &cap[1];
        let args = &cap[2]; // $a, $b
        
        // Convert $arg to arg: Any
        let omni_args = args.split(',')
            .filter(|s| !s.trim().is_empty())
            .map(|s| format!("{}: Any", s.trim().trim_start_matches('$')))
            .collect::<Vec<_>>()
            .join(", ");
            
        flows.push_str(&format!("\n    flow {}({}) {{\n        native \"php\" {{\n            // Originally: function {}(...)\n            // Logic preserved for manual review\n        }}\n    }}\n", name, omni_args, name));
    }
    
    Ok(format!("{}capsule {} {{{}\n}}\n", decorators, capsule_name, flows))
}

fn ingest_node(content: &str, path: &Path) -> Result<String> {
    let file_stem = path.file_stem().unwrap().to_string_lossy();
    let capsule_name = capitalize(&file_stem);
    
    // JS Heuristics
    // const x = ...
    // function x(...)
    let re_func = Regex::new(r"function\s+(\w+)\s*\(([^)]*)\)").unwrap();
    let re_const = Regex::new(r"const\s+(\w+)\s*=").unwrap();
    
    let mut items = String::new();
    
    for cap in re_const.captures_iter(content) {
         items.push_str(&format!("\n    // Ingested constant\n    let {} = native \"js\" {{ return ...; }};\n", &cap[1]));
    }
    
    for cap in re_func.captures_iter(content) {
        let name = &cap[1];
        let args = &cap[2].trim();
        let omni_args = if args.is_empty() { String::new() } else {
            args.split(',')
                .map(|s| format!("{}: Any", s.trim()))
                .collect::<Vec<_>>()
                .join(", ")
        };
        
        items.push_str(&format!("\n    flow {}({}) {{\n        native \"js\"`\n            // Original JS function {}\n        `\n    }}\n", name, omni_args, name));
    }

    Ok(format!("capsule {} {{{}\n}}\n", capsule_name, items))
}

fn capitalize(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}
