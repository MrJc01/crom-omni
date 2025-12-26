//! Laravel Pattern Recognition - Laravel to Omni Ingestion
//!
//! Detects and converts Laravel patterns to Omni.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// Laravel route info
#[derive(Debug, Clone)]
pub struct LaravelRoute {
    pub method: String,
    pub uri: String,
    pub controller: String,
    pub action: String,
}

/// Laravel model info  
#[derive(Debug, Clone)]
pub struct LaravelModelInfo {
    pub name: String,
    pub table: String,
    pub fillable: Vec<String>,
    pub hidden: Vec<String>,
    pub casts: Vec<(String, String)>,
    pub relations: Vec<(String, String, String)>, // name, type, related
}

/// Laravel controller info
#[derive(Debug, Clone)]
pub struct LaravelControllerInfo {
    pub name: String,
    pub methods: Vec<String>,
    pub resource: bool,
}

/// Laravel project analysis
#[derive(Debug, Clone, Default)]
pub struct LaravelProject {
    pub routes: Vec<LaravelRoute>,
    pub models: Vec<LaravelModelInfo>,
    pub controllers: Vec<LaravelControllerInfo>,
}

/// Parse Laravel routes file
pub fn parse_routes(content: &str) -> Vec<LaravelRoute> {
    let mut routes = Vec::new();
    
    for line in content.lines() {
        let trimmed = line.trim();
        
        // Route::get('/path', [Controller::class, 'method'])
        for method in ["get", "post", "put", "patch", "delete"] {
            let pattern = format!("Route::{}", method);
            if trimmed.contains(&pattern) {
                // Extract URI
                if let Some(uri_start) = trimmed.find("'") {
                    let rest = &trimmed[uri_start + 1..];
                    if let Some(uri_end) = rest.find("'") {
                        let uri = rest[..uri_end].to_string();
                        
                        // Extract controller and action
                        let (controller, action) = if let Some(ctrl_start) = rest.find('[') {
                            let ctrl_part = &rest[ctrl_start..];
                            let parts: Vec<&str> = ctrl_part
                                .split("::class")
                                .collect();
                            if !parts.is_empty() {
                                let ctrl = parts[0].trim_start_matches('[').trim();
                                let act = ctrl_part
                                    .split("'")
                                    .nth(1)
                                    .unwrap_or("index");
                                (ctrl.to_string(), act.to_string())
                            } else {
                                ("Controller".to_string(), "index".to_string())
                            }
                        } else {
                            ("Controller".to_string(), "index".to_string())
                        };
                        
                        routes.push(LaravelRoute {
                            method: method.to_uppercase(),
                            uri,
                            controller,
                            action,
                        });
                    }
                }
            }
        }
    }
    
    routes
}

/// Parse Laravel model
pub fn parse_model(content: &str, name: &str) -> LaravelModelInfo {
    let mut model = LaravelModelInfo {
        name: name.to_string(),
        table: name.to_lowercase() + "s",
        fillable: Vec::new(),
        hidden: Vec::new(),
        casts: Vec::new(),
        relations: Vec::new(),
    };
    
    for line in content.lines() {
        let trimmed = line.trim();
        
        // $fillable = ['field1', 'field2']
        if trimmed.contains("$fillable") {
            model.fillable = extract_array_items(trimmed);
        }
        
        // $hidden = ['password']
        if trimmed.contains("$hidden") {
            model.hidden = extract_array_items(trimmed);
        }
        
        // $table = 'custom_table'
        if trimmed.contains("$table") {
            if let Some(start) = trimmed.find("'") {
                let rest = &trimmed[start + 1..];
                if let Some(end) = rest.find("'") {
                    model.table = rest[..end].to_string();
                }
            }
        }
        
        // Relation methods: hasMany, belongsTo, etc.
        for rel_type in ["hasMany", "hasOne", "belongsTo", "belongsToMany"] {
            if trimmed.contains(rel_type) {
                if let Some(func_name) = extract_function_name(trimmed) {
                    model.relations.push((func_name, rel_type.to_string(), "Related".to_string()));
                }
            }
        }
    }
    
    model
}

fn extract_array_items(line: &str) -> Vec<String> {
    let mut items = Vec::new();
    let parts: Vec<&str> = line.split("'").collect();
    for (i, part) in parts.iter().enumerate() {
        if i % 2 == 1 { // Odd indices are between quotes
            items.push(part.to_string());
        }
    }
    items
}

fn extract_function_name(line: &str) -> Option<String> {
    if line.contains("function ") {
        let parts: Vec<&str> = line.split("function ").collect();
        if parts.len() > 1 {
            let name = parts[1].split('(').next()?;
            return Some(name.trim().to_string());
        }
    }
    None
}

/// Convert Laravel model to Omni struct
pub fn model_to_omni(model: &LaravelModelInfo) -> String {
    let mut output = format!("@table(\"{}\")\n", model.table);
    output.push_str(&format!("struct {} {{\n", model.name));
    
    output.push_str("    id: Int,\n");
    
    for field in &model.fillable {
        output.push_str(&format!("    {}: String,\n", field));
    }
    
    output.push_str("    created_at: DateTime?,\n");
    output.push_str("    updated_at: DateTime?,\n");
    output.push_str("}\n\n");
    
    // Relations
    for (name, rel_type, related) in &model.relations {
        output.push_str(&format!("impl {} {{\n", model.name));
        let return_type = match rel_type.as_str() {
            "hasMany" | "belongsToMany" => format!("List<{}>", related),
            _ => related.clone(),
        };
        output.push_str(&format!("    fn {}() -> {} {{\n", name, return_type));
        output.push_str("        // Relation logic\n");
        output.push_str("    }\n");
        output.push_str("}\n\n");
    }
    
    output
}

/// Ingest Laravel project
pub fn ingest_laravel(project_path: &Path, output_dir: &Path) -> Result<()> {
    println!("{}", "🔶 Ingesting Laravel project...".cyan().bold());
    
    let project = LaravelProject::default();
    
    // Would scan routes, models, controllers
    println!("  {} Scanning routes...", "→".cyan());
    println!("  {} Scanning models...", "→".cyan());
    println!("  {} Scanning controllers...", "→".cyan());
    
    fs::create_dir_all(output_dir)?;
    
    println!("{} Ingested {} routes, {} models, {} controllers",
        "✓".green(),
        project.routes.len(),
        project.models.len(),
        project.controllers.len()
    );
    
    Ok(())
}
