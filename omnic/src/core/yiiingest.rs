//! Yii2 Ingestion - Yii2 to Omni Conversion
//!
//! Maps Yii2 Active Record patterns to Omni.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// Yii2 model attribute
#[derive(Debug, Clone)]
pub struct YiiAttribute {
    pub name: String,
    pub type_hint: String,
    pub rules: Vec<String>,
}

/// Yii2 relation
#[derive(Debug, Clone)]
pub struct YiiRelation {
    pub name: String,
    pub rel_type: String, // hasOne, hasMany
    pub target_class: String,
    pub link: Vec<(String, String)>,
}

/// Yii2 ActiveRecord model
#[derive(Debug, Clone)]
pub struct YiiActiveRecord {
    pub name: String,
    pub table_name: String,
    pub attributes: Vec<YiiAttribute>,
    pub relations: Vec<YiiRelation>,
    pub behaviors: Vec<String>,
}

impl YiiActiveRecord {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            table_name: to_snake_case(name),
            attributes: Vec::new(),
            relations: Vec::new(),
            behaviors: Vec::new(),
        }
    }
}

fn to_snake_case(s: &str) -> String {
    let mut result = String::new();
    for (i, c) in s.chars().enumerate() {
        if c.is_uppercase() && i > 0 {
            result.push('_');
        }
        result.push(c.to_lowercase().next().unwrap());
    }
    result
}

/// Parse Yii2 model file
pub fn parse_yii_model(content: &str, name: &str) -> YiiActiveRecord {
    let mut model = YiiActiveRecord::new(name);
    
    for line in content.lines() {
        let trimmed = line.trim();
        
        // tableName() method
        if trimmed.contains("tableName()") || trimmed.contains("return '{{%") {
            if let Some(start) = trimmed.find("{{%") {
                let rest = &trimmed[start + 3..];
                if let Some(end) = rest.find("}}") {
                    model.table_name = rest[..end].to_string();
                }
            }
        }
        
        // rules() - validation rules
        if trimmed.contains("'required'") {
            // Extract field names for required rule
            model.attributes.push(YiiAttribute {
                name: "field".to_string(),
                type_hint: "String".to_string(),
                rules: vec!["required".to_string()],
            });
        }
        
        // Relations: hasOne, hasMany
        if trimmed.contains("hasOne(") || trimmed.contains("hasMany(") {
            let rel_type = if trimmed.contains("hasOne") { "hasOne" } else { "hasMany" };
            
            if let Some(class_start) = trimmed.find("::class") {
                let before_class = &trimmed[..class_start];
                let class_name = before_class
                    .rsplit("\\")
                    .next()
                    .or_else(|| before_class.rsplit('(').next())
                    .unwrap_or("Related")
                    .trim();
                
                if let Some(func_name) = extract_function_name(trimmed) {
                    model.relations.push(YiiRelation {
                        name: func_name,
                        rel_type: rel_type.to_string(),
                        target_class: class_name.to_string(),
                        link: vec![],
                    });
                }
            }
        }
        
        // Behaviors: TimestampBehavior, BlameableBehavior
        if trimmed.contains("Behavior::class") || trimmed.contains("Behavior'") {
            if trimmed.contains("Timestamp") {
                model.behaviors.push("timestamp".to_string());
            }
            if trimmed.contains("Blameable") {
                model.behaviors.push("blameable".to_string());
            }
        }
    }
    
    model
}

fn extract_function_name(line: &str) -> Option<String> {
    // get + Name pattern: getUser -> user
    if line.contains("function get") {
        let parts: Vec<&str> = line.split("function get").collect();
        if parts.len() > 1 {
            let name = parts[1].split('(').next()?;
            let name = name.trim();
            // Convert PascalCase to camelCase
            let mut result = String::new();
            for (i, c) in name.chars().enumerate() {
                if i == 0 {
                    result.push(c.to_lowercase().next().unwrap());
                } else {
                    result.push(c);
                }
            }
            return Some(result);
        }
    }
    None
}

/// Convert Yii2 model to Omni struct
pub fn yii_to_omni(model: &YiiActiveRecord) -> String {
    let mut output = format!("@table(\"{}\")\n", model.table_name);
    
    // Add behaviors as decorators
    for behavior in &model.behaviors {
        output.push_str(&format!("@{}\n", behavior));
    }
    
    output.push_str(&format!("struct {} {{\n", model.name));
    
    output.push_str("    id: Int,\n");
    
    for attr in &model.attributes {
        let optional = if attr.rules.contains(&"required".to_string()) { "" } else { "?" };
        output.push_str(&format!("    {}: {}{},\n", attr.name, attr.type_hint, optional));
    }
    
    if model.behaviors.contains(&"timestamp".to_string()) {
        output.push_str("    created_at: DateTime?,\n");
        output.push_str("    updated_at: DateTime?,\n");
    }
    
    output.push_str("}\n\n");
    
    // Relations as impl
    if !model.relations.is_empty() {
        output.push_str(&format!("impl {} {{\n", model.name));
        for rel in &model.relations {
            let return_type = if rel.rel_type == "hasMany" {
                format!("List<{}>", rel.target_class)
            } else {
                format!("{}?", rel.target_class)
            };
            output.push_str(&format!("    fn {}() -> {} {{\n", rel.name, return_type));
            output.push_str("        // Yii2 relation converted\n");
            output.push_str("    }\n\n");
        }
        output.push_str("}\n");
    }
    
    output
}

/// Ingest Yii2 project
pub fn ingest_yii2(project_path: &Path, output_dir: &Path) -> Result<()> {
    println!("{}", "🟦 Ingesting Yii2 project...".cyan().bold());
    
    let mut models_found = 0;
    let models_dir = project_path.join("models");
    
    if models_dir.exists() {
        println!("  {} Scanning models directory...", "→".cyan());
        // Would iterate models
        models_found = 0; // Placeholder
    }
    
    fs::create_dir_all(output_dir)?;
    
    println!("{} Ingested {} ActiveRecord models", "✓".green(), models_found);
    
    Ok(())
}
