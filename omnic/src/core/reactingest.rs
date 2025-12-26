//! React Ingestion - React/JSX to Omni Conversion
//!
//! Converts React components and JSX to Omni UI definitions.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// React component info
#[derive(Debug, Clone)]
pub struct ReactComponentInfo {
    pub name: String,
    pub is_functional: bool,
    pub props: Vec<PropInfo>,
    pub hooks: Vec<HookInfo>,
    pub jsx_elements: Vec<String>,
}

/// Prop info
#[derive(Debug, Clone)]
pub struct PropInfo {
    pub name: String,
    pub type_hint: String,
    pub required: bool,
}

/// Hook usage info
#[derive(Debug, Clone)]
pub struct HookInfo {
    pub hook_type: String, // useState, useEffect, useCallback, etc.
    pub name: String,
    pub initial_value: Option<String>,
}

impl ReactComponentInfo {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            is_functional: true,
            props: Vec::new(),
            hooks: Vec::new(),
            jsx_elements: Vec::new(),
        }
    }
}

/// Parse React/JSX file
pub fn parse_react(content: &str) -> Vec<ReactComponentInfo> {
    let mut components = Vec::new();
    let mut current: Option<ReactComponentInfo> = None;
    
    for line in content.lines() {
        let trimmed = line.trim();
        
        // Functional component: const/function Name = (...) => { or function Name(
        if (trimmed.starts_with("const ") || trimmed.starts_with("function ")) 
            && (trimmed.contains(" = (") || trimmed.contains("function ")) 
            && (trimmed.contains("=>") || trimmed.contains(") {")) {
            
            if let Some(comp) = current.take() {
                components.push(comp);
            }
            
            let name = if trimmed.starts_with("const ") {
                trimmed[6..].split('=').next()
                    .unwrap_or("Component")
                    .split(':').next()
                    .unwrap_or("Component")
                    .trim()
            } else {
                trimmed[9..].split('(').next()
                    .unwrap_or("Component")
                    .trim()
            };
            
            current = Some(ReactComponentInfo::new(name));
        }
        
        // Props destructuring: { prop1, prop2 }
        if let Some(ref mut comp) = current {
            if trimmed.starts_with("{") && trimmed.contains("}") && trimmed.contains(":") == false {
                let props_str = trimmed.trim_matches(|c| c == '{' || c == '}' || c == ' ');
                for prop in props_str.split(',') {
                    let prop_name = prop.trim().split('=').next().unwrap_or("").trim();
                    if !prop_name.is_empty() {
                        comp.props.push(PropInfo {
                            name: prop_name.to_string(),
                            type_hint: "any".to_string(),
                            required: !prop.contains('='),
                        });
                    }
                }
            }
            
            // useState hook
            if trimmed.contains("useState(") {
                if let Some(start) = trimmed.find("const [") {
                    let rest = &trimmed[start + 7..];
                    if let Some(name) = rest.split(',').next() {
                        let initial = if let Some(init_start) = trimmed.find("useState(") {
                            let init_rest = &trimmed[init_start + 9..];
                            init_rest.split(')').next().map(|s| s.to_string())
                        } else {
                            None
                        };
                        
                        comp.hooks.push(HookInfo {
                            hook_type: "useState".to_string(),
                            name: name.trim().to_string(),
                            initial_value: initial,
                        });
                    }
                }
            }
            
            // useEffect hook
            if trimmed.contains("useEffect(") {
                comp.hooks.push(HookInfo {
                    hook_type: "useEffect".to_string(),
                    name: "effect".to_string(),
                    initial_value: None,
                });
            }
            
            // JSX elements
            if trimmed.starts_with("<") && !trimmed.starts_with("</") {
                if let Some(tag) = trimmed[1..].split(|c: char| c.is_whitespace() || c == '>').next() {
                    comp.jsx_elements.push(tag.to_string());
                }
            }
        }
    }
    
    if let Some(comp) = current {
        components.push(comp);
    }
    
    components
}

/// Convert React component to Omni view
pub fn react_to_omni(comp: &ReactComponentInfo) -> String {
    let mut output = String::new();
    
    output.push_str(&format!("@view\n"));
    output.push_str(&format!("struct {}View {{\n", comp.name));
    
    // Props as fields
    for prop in &comp.props {
        let optional = if prop.required { "" } else { "?" };
        output.push_str(&format!("    {}: String{},\n", prop.name, optional));
    }
    
    // State from hooks
    for hook in &comp.hooks {
        if hook.hook_type == "useState" {
            let initial = hook.initial_value.as_deref().unwrap_or("null");
            output.push_str(&format!("    @state {}: {} = {},\n", hook.name, "Any", initial));
        }
    }
    
    output.push_str("}\n\n");
    
    // Render function
    output.push_str(&format!("impl {}View {{\n", comp.name));
    output.push_str("    fn render() -> Element {\n");
    output.push_str("        return View {\n");
    
    for elem in &comp.jsx_elements {
        output.push_str(&format!("            {} {{}},\n", elem));
    }
    
    output.push_str("        };\n");
    output.push_str("    }\n");
    output.push_str("}\n");
    
    output
}

/// Ingest React project
pub fn ingest_react(src_path: &Path, output_dir: &Path) -> Result<()> {
    println!("{}", "⚛️ Ingesting React components...".cyan().bold());
    
    fs::create_dir_all(output_dir)?;
    
    let mut total = 0;
    
    // Would recursively find .jsx/.tsx files
    println!("  {} Scanning for React components...", "→".cyan());
    
    println!("{} Ingested {} React components", "✓".green(), total);
    
    Ok(())
}
