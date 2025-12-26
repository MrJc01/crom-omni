//! Docstring Extraction - Documentation Comment Extraction
//!
//! Extracts documentation comments from source code.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// Documentation item type
#[derive(Debug, Clone)]
pub enum DocItemType {
    Module,
    Function,
    Struct,
    Field,
    Enum,
    Variant,
    Constant,
}

/// Extracted documentation item
#[derive(Debug, Clone)]
pub struct DocItem {
    pub name: String,
    pub item_type: DocItemType,
    pub summary: String,
    pub description: Option<String>,
    pub params: Vec<(String, String)>, // name, description
    pub returns: Option<String>,
    pub examples: Vec<String>,
    pub tags: Vec<(String, String)>, // @tag value
}

impl DocItem {
    pub fn new(name: &str, item_type: DocItemType) -> Self {
        Self {
            name: name.to_string(),
            item_type,
            summary: String::new(),
            description: None,
            params: Vec::new(),
            returns: None,
            examples: Vec::new(),
            tags: Vec::new(),
        }
    }
}

/// Extract docstrings from Omni code
pub fn extract_omni_docs(content: &str) -> Vec<DocItem> {
    let mut items = Vec::new();
    let mut current_doc = String::new();
    
    for line in content.lines() {
        let trimmed = line.trim();
        
        // Collect doc comments: /// or /** */
        if trimmed.starts_with("///") {
            current_doc.push_str(&trimmed[3..].trim());
            current_doc.push('\n');
            continue;
        }
        
        if trimmed.starts_with("/**") {
            current_doc.push_str(&trimmed[3..].trim_end_matches("*/").trim());
            current_doc.push('\n');
            continue;
        }
        
        // Apply doc to next item
        if !current_doc.is_empty() {
            // Function
            if trimmed.starts_with("fn ") || trimmed.starts_with("pub fn ") {
                let name = trimmed
                    .trim_start_matches("pub ")
                    .trim_start_matches("fn ")
                    .split('(')
                    .next()
                    .unwrap_or("func")
                    .trim();
                
                let mut item = DocItem::new(name, DocItemType::Function);
                parse_doc_content(&current_doc, &mut item);
                items.push(item);
            }
            
            // Struct
            if trimmed.starts_with("struct ") || trimmed.starts_with("pub struct ") {
                let name = trimmed
                    .trim_start_matches("pub ")
                    .trim_start_matches("struct ")
                    .split('{')
                    .next()
                    .unwrap_or("Struct")
                    .trim();
                
                let mut item = DocItem::new(name, DocItemType::Struct);
                parse_doc_content(&current_doc, &mut item);
                items.push(item);
            }
            
            // Enum
            if trimmed.starts_with("enum ") || trimmed.starts_with("pub enum ") {
                let name = trimmed
                    .trim_start_matches("pub ")
                    .trim_start_matches("enum ")
                    .split('{')
                    .next()
                    .unwrap_or("Enum")
                    .trim();
                
                let mut item = DocItem::new(name, DocItemType::Enum);
                parse_doc_content(&current_doc, &mut item);
                items.push(item);
            }
            
            current_doc.clear();
        }
    }
    
    items
}

fn parse_doc_content(doc: &str, item: &mut DocItem) {
    let mut in_example = false;
    let mut current_example = String::new();
    
    for line in doc.lines() {
        let trimmed = line.trim();
        
        // @param name description
        if trimmed.starts_with("@param ") {
            let rest = &trimmed[7..];
            let parts: Vec<&str> = rest.splitn(2, ' ').collect();
            if parts.len() == 2 {
                item.params.push((parts[0].to_string(), parts[1].to_string()));
            }
            continue;
        }
        
        // @returns description
        if trimmed.starts_with("@returns ") || trimmed.starts_with("@return ") {
            let rest = if trimmed.starts_with("@returns ") {
                &trimmed[9..]
            } else {
                &trimmed[8..]
            };
            item.returns = Some(rest.to_string());
            continue;
        }
        
        // @example
        if trimmed.starts_with("@example") {
            in_example = true;
            continue;
        }
        
        // Other @ tags
        if trimmed.starts_with("@") {
            if in_example {
                in_example = false;
                if !current_example.is_empty() {
                    item.examples.push(current_example.clone());
                    current_example.clear();
                }
            }
            
            let parts: Vec<&str> = trimmed[1..].splitn(2, ' ').collect();
            if !parts.is_empty() {
                let value = parts.get(1).unwrap_or(&"").to_string();
                item.tags.push((parts[0].to_string(), value));
            }
            continue;
        }
        
        // Example content
        if in_example {
            current_example.push_str(trimmed);
            current_example.push('\n');
            continue;
        }
        
        // Summary/description
        if item.summary.is_empty() {
            item.summary = trimmed.to_string();
        } else if item.description.is_none() && !trimmed.is_empty() {
            item.description = Some(trimmed.to_string());
        }
    }
    
    if !current_example.is_empty() {
        item.examples.push(current_example);
    }
}

/// Generate markdown documentation from items
pub fn docs_to_markdown(items: &[DocItem]) -> String {
    let mut output = String::new();
    
    output.push_str("# API Documentation\n\n");
    
    for item in items {
        let type_name = match item.item_type {
            DocItemType::Function => "Function",
            DocItemType::Struct => "Struct",
            DocItemType::Enum => "Enum",
            _ => "Item",
        };
        
        output.push_str(&format!("## {} `{}`\n\n", type_name, item.name));
        output.push_str(&format!("{}\n\n", item.summary));
        
        if let Some(ref desc) = item.description {
            output.push_str(&format!("{}\n\n", desc));
        }
        
        if !item.params.is_empty() {
            output.push_str("### Parameters\n\n");
            for (name, desc) in &item.params {
                output.push_str(&format!("- `{}`: {}\n", name, desc));
            }
            output.push('\n');
        }
        
        if let Some(ref ret) = item.returns {
            output.push_str(&format!("### Returns\n\n{}\n\n", ret));
        }
        
        if !item.examples.is_empty() {
            output.push_str("### Examples\n\n```omni\n");
            for ex in &item.examples {
                output.push_str(ex);
            }
            output.push_str("```\n\n");
        }
    }
    
    output
}

/// Extract docs from file
pub fn extract_docs_from_file(path: &Path, output: &Path) -> Result<()> {
    println!("{}", "📝 Extracting documentation...".cyan().bold());
    
    let content = fs::read_to_string(path)?;
    let items = extract_omni_docs(&content);
    let markdown = docs_to_markdown(&items);
    
    fs::write(output, markdown)?;
    
    println!("{} Extracted {} doc items", "✓".green(), items.len());
    
    Ok(())
}
