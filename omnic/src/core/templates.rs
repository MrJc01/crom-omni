//! Template Generator - Project Scaffolding
//!
//! Generates project templates for new Omni projects.

use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Project template types
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TemplateType {
    Basic,          // Simple hello world
    Library,        // Reusable library
    WebApp,         // Web application
    Api,            // REST API
    Cli,            // Command-line tool
    FullStack,      // Web + API + shared
}

impl TemplateType {
    pub fn name(&self) -> &'static str {
        match self {
            TemplateType::Basic => "basic",
            TemplateType::Library => "library",
            TemplateType::WebApp => "webapp",
            TemplateType::Api => "api",
            TemplateType::Cli => "cli",
            TemplateType::FullStack => "fullstack",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            TemplateType::Basic => "Simple hello world project",
            TemplateType::Library => "Reusable library package",
            TemplateType::WebApp => "Web application with UI",
            TemplateType::Api => "REST API server",
            TemplateType::Cli => "Command-line application",
            TemplateType::FullStack => "Full-stack web application",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "basic" | "hello" => Some(TemplateType::Basic),
            "lib" | "library" => Some(TemplateType::Library),
            "web" | "webapp" => Some(TemplateType::WebApp),
            "api" | "rest" => Some(TemplateType::Api),
            "cli" | "console" => Some(TemplateType::Cli),
            "fullstack" | "full" => Some(TemplateType::FullStack),
            _ => None,
        }
    }
}

/// Template file entry
#[derive(Debug, Clone)]
pub struct TemplateFile {
    pub path: String,
    pub content: String,
}

/// Project template
pub struct ProjectTemplate {
    pub template_type: TemplateType,
    pub files: Vec<TemplateFile>,
}

impl ProjectTemplate {
    /// Create basic template
    pub fn basic(name: &str) -> Self {
        Self {
            template_type: TemplateType::Basic,
            files: vec![
                TemplateFile {
                    path: "src/main.omni".to_string(),
                    content: format!(r#"// {} - Main entry point
                    
fn main() {{
    println("Hello from {}!");
}}
"#, name, name),
                },
                TemplateFile {
                    path: "omni.config.json".to_string(),
                    content: format!(r#"{{
    "name": "{}",
    "version": "0.1.0",
    "targets": ["js", "php", "py"],
    "entry": "src/main.omni"
}}"#, name),
                },
                TemplateFile {
                    path: "README.md".to_string(),
                    content: format!("# {}\n\nAn Omni project.\n\n## Build\n\n```bash\nomni build\n```\n", name),
                },
            ],
        }
    }

    /// Create library template
    pub fn library(name: &str) -> Self {
        Self {
            template_type: TemplateType::Library,
            files: vec![
                TemplateFile {
                    path: "src/lib.omni".to_string(),
                    content: format!(r#"// {} Library

/// Add two numbers
pub fn add(a: Int, b: Int) -> Int {{
    return a + b;
}}

/// Subtract two numbers
pub fn subtract(a: Int, b: Int) -> Int {{
    return a - b;
}}
"#, name),
                },
                TemplateFile {
                    path: "src/index.omni".to_string(),
                    content: format!("// {} - Public exports\n\nexport {{ add, subtract }} from \"./lib.omni\";\n", name),
                },
                TemplateFile {
                    path: "tests/lib_test.omni".to_string(),
                    content: r#"import { add, subtract } from "../src/lib.omni";

fn test_add() {
    assert(add(2, 3) == 5);
    assert(add(-1, 1) == 0);
}

fn test_subtract() {
    assert(subtract(5, 3) == 2);
}
"#.to_string(),
                },
                TemplateFile {
                    path: "omni.config.json".to_string(),
                    content: format!(r#"{{
    "name": "{}",
    "version": "0.1.0",
    "type": "library",
    "targets": ["js", "php", "py"],
    "entry": "src/index.omni"
}}"#, name),
                },
            ],
        }
    }

    /// Create API template
    pub fn api(name: &str) -> Self {
        Self {
            template_type: TemplateType::Api,
            files: vec![
                TemplateFile {
                    path: "src/main.omni".to_string(),
                    content: format!(r#"// {} API Server

import @std/http;

@route("/")
fn index() -> Response {{
    return Json({{ "message": "Welcome to {} API" }});
}}

@route("/health")
fn health() -> Response {{
    return Json({{ "status": "ok" }});
}}

fn main() {{
    let server = http.Server(3000);
    println("API running on http://localhost:3000");
    server.listen();
}}
"#, name, name),
                },
                TemplateFile {
                    path: "omni.config.json".to_string(),
                    content: format!(r#"{{
    "name": "{}",
    "version": "0.1.0",
    "type": "application",
    "targets": ["js"],
    "entry": "src/main.omni",
    "dependencies": {{
        "@std/http": "^1.0.0"
    }}
}}"#, name),
                },
            ],
        }
    }

    /// Create CLI template
    pub fn cli(name: &str) -> Self {
        Self {
            template_type: TemplateType::Cli,
            files: vec![
                TemplateFile {
                    path: "src/main.omni".to_string(),
                    content: format!(r#"// {} CLI

import @std/args;
import @std/io;

fn main() {{
    let args = args.parse();
    
    if args.has("--help") {{
        println("{} - A CLI tool");
        println("");
        println("Usage: {} [options]");
        println("");
        println("Options:");
        println("  --help    Show this help");
        println("  --version Show version");
        return;
    }}
    
    if args.has("--version") {{
        println("{} v0.1.0");
        return;
    }}
    
    println("Hello from {} CLI!");
}}
"#, name, name, name, name, name),
                },
                TemplateFile {
                    path: "omni.config.json".to_string(),
                    content: format!(r#"{{
    "name": "{}",
    "version": "0.1.0",
    "type": "cli",
    "targets": ["js"],
    "entry": "src/main.omni",
    "bin": "{}"
}}"#, name, name),
                },
            ],
        }
    }

    /// Generate project in directory
    pub fn generate(&self, base_path: &Path) -> Result<()> {
        fs::create_dir_all(base_path)?;
        
        for file in &self.files {
            let full_path = base_path.join(&file.path);
            
            // Create parent directories
            if let Some(parent) = full_path.parent() {
                fs::create_dir_all(parent)?;
            }
            
            fs::write(&full_path, &file.content)?;
            println!("  {} {}", "✓".green(), file.path);
        }
        
        Ok(())
    }
}

/// List available templates
pub fn list_templates() {
    println!("{}", "📦 Available Templates".cyan().bold());
    println!();
    
    let templates = [
        TemplateType::Basic,
        TemplateType::Library,
        TemplateType::WebApp,
        TemplateType::Api,
        TemplateType::Cli,
        TemplateType::FullStack,
    ];
    
    for t in templates {
        println!("  {} - {}", t.name().green().bold(), t.description());
    }
    
    println!();
    println!("Usage: omni new <project-name> --template <template>");
}

/// Create new project
pub fn create_project(name: &str, template_type: TemplateType, path: &Path) -> Result<()> {
    println!("{} Creating {} project '{}'...", 
        "🚀".cyan(),
        template_type.name(),
        name
    );
    
    let template = match template_type {
        TemplateType::Basic => ProjectTemplate::basic(name),
        TemplateType::Library => ProjectTemplate::library(name),
        TemplateType::Api => ProjectTemplate::api(name),
        TemplateType::Cli => ProjectTemplate::cli(name),
        _ => ProjectTemplate::basic(name), // Fallback
    };
    
    template.generate(path)?;
    
    println!();
    println!("{} Project created at {}", "✓".green().bold(), path.display());
    println!();
    println!("Next steps:");
    println!("  cd {}", name);
    println!("  omni build");
    
    Ok(())
}
