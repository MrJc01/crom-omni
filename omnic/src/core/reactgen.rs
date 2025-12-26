//! React Generator - React/JSX Generation
//!
//! Transforms Omni components to React components.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// React component type
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ReactComponentType {
    Functional,
    ClassBased,
    Hook,
}

/// React prop
#[derive(Debug, Clone)]
pub struct ReactProp {
    pub name: String,
    pub prop_type: String,
    pub required: bool,
    pub default: Option<String>,
}

/// React hook usage
#[derive(Debug, Clone)]
pub struct ReactHook {
    pub name: String,
    pub initial_value: String,
}

/// React component
#[derive(Debug, Clone)]
pub struct ReactComponent {
    pub name: String,
    pub component_type: ReactComponentType,
    pub props: Vec<ReactProp>,
    pub state: Vec<ReactHook>,
    pub jsx: String,
}

impl ReactComponent {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            component_type: ReactComponentType::Functional,
            props: Vec::new(),
            state: Vec::new(),
            jsx: String::new(),
        }
    }

    /// Generate TypeScript/JSX code
    pub fn to_react(&self) -> String {
        let mut output = String::new();
        
        // Imports
        output.push_str("import React");
        if !self.state.is_empty() {
            output.push_str(", { useState }");
        }
        output.push_str(" from 'react';\n\n");

        // Props interface
        if !self.props.is_empty() {
            output.push_str(&format!("interface {}Props {{\n", self.name));
            for prop in &self.props {
                let optional = if prop.required { "" } else { "?" };
                output.push_str(&format!("  {}{}: {};\n", prop.name, optional, prop.prop_type));
            }
            output.push_str("}\n\n");
        }

        // Component
        let props_type = if self.props.is_empty() {
            String::new()
        } else {
            format!(": React.FC<{}Props>", self.name)
        };

        output.push_str(&format!("export const {}{} = (", self.name, props_type));
        
        if !self.props.is_empty() {
            let prop_names: Vec<_> = self.props.iter().map(|p| p.name.clone()).collect();
            output.push_str(&format!("{{ {} }}", prop_names.join(", ")));
        }
        output.push_str(") => {\n");

        // State hooks
        for hook in &self.state {
            output.push_str(&format!(
                "  const [{}, set{}] = useState({});\n",
                hook.name,
                capitalize(&hook.name),
                hook.initial_value
            ));
        }

        if !self.state.is_empty() {
            output.push('\n');
        }

        // Return JSX
        output.push_str("  return (\n");
        if self.jsx.is_empty() {
            output.push_str("    <div>\n");
            output.push_str(&format!("      <h1>{}</h1>\n", self.name));
            output.push_str("    </div>\n");
        } else {
            output.push_str(&self.jsx);
        }
        output.push_str("  );\n");
        output.push_str("};\n");

        output
    }
}

fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        None => String::new(),
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
    }
}

/// Extract React components from Omni code
pub fn extract_from_omni(code: &str) -> Vec<ReactComponent> {
    let mut components = Vec::new();
    let mut current: Option<ReactComponent> = None;

    for line in code.lines() {
        let trimmed = line.trim();

        // Look for @component or UI structs
        if trimmed.starts_with("@component") || trimmed.starts_with("@view") {
            // Next struct is a component
        }

        // Extract component from struct
        if trimmed.starts_with("struct ") && trimmed.contains("View") {
            if let Some(comp) = current.take() {
                components.push(comp);
            }

            let name = trimmed[7..].split('{').next()
                .unwrap_or("Component")
                .trim()
                .to_string();

            current = Some(ReactComponent::new(&name));
        }

        // Extract props
        if let Some(ref mut comp) = current {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let prop_type = match parts[1].trim().trim_end_matches(',') {
                        "String" => "string",
                        "Int" => "number",
                        "Bool" => "boolean",
                        _ => "any",
                    };

                    comp.props.push(ReactProp {
                        name,
                        prop_type: prop_type.to_string(),
                        required: !parts[1].contains('?'),
                        default: None,
                    });
                }
            }
        }

        if trimmed == "}" {
            if let Some(comp) = current.take() {
                if !comp.props.is_empty() || comp.name.contains("View") {
                    components.push(comp);
                }
            }
        }
    }

    components
}

/// Generate React components from Omni code
pub fn generate_react(code: &str, output_dir: &Path) -> Result<()> {
    println!("{}", "⚛️ Generating React components...".cyan().bold());

    let components = extract_from_omni(code);
    
    for comp in &components {
        let filename = format!("{}.tsx", comp.name);
        let filepath = output_dir.join(&filename);
        let content = comp.to_react();
        
        fs::write(&filepath, content)?;
        println!("  {} {}", "✓".green(), filename);
    }

    println!("{} Generated {} components", "✓".green(), components.len());

    Ok(())
}
