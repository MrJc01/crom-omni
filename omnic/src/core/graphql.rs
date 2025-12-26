//! GraphQL Adapter - Schema Generation
//!
//! Generates GraphQL schemas from Omni code.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// GraphQL field type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GqlType {
    Int,
    Float,
    String,
    Boolean,
    ID,
    List(Box<GqlType>),
    NonNull(Box<GqlType>),
    Custom(String),
}

impl GqlType {
    pub fn to_gql(&self) -> String {
        match self {
            GqlType::Int => "Int".to_string(),
            GqlType::Float => "Float".to_string(),
            GqlType::String => "String".to_string(),
            GqlType::Boolean => "Boolean".to_string(),
            GqlType::ID => "ID".to_string(),
            GqlType::List(inner) => format!("[{}]", inner.to_gql()),
            GqlType::NonNull(inner) => format!("{}!", inner.to_gql()),
            GqlType::Custom(name) => name.clone(),
        }
    }

    pub fn from_omni(omni_type: &str) -> Self {
        match omni_type {
            "Int" | "i32" | "i64" => GqlType::Int,
            "Float" | "f32" | "f64" => GqlType::Float,
            "String" | "str" => GqlType::String,
            "Bool" | "bool" => GqlType::Boolean,
            t if t.starts_with("List<") => {
                let inner = t.trim_start_matches("List<").trim_end_matches('>');
                GqlType::List(Box::new(Self::from_omni(inner)))
            }
            t => GqlType::Custom(t.to_string()),
        }
    }
}

/// GraphQL field
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GqlField {
    pub name: String,
    pub field_type: GqlType,
    pub description: Option<String>,
    pub arguments: Vec<GqlArgument>,
}

/// GraphQL argument
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GqlArgument {
    pub name: String,
    pub arg_type: GqlType,
    pub default_value: Option<String>,
}

/// GraphQL type definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GqlTypeDef {
    pub name: String,
    pub description: Option<String>,
    pub fields: Vec<GqlField>,
}

impl GqlTypeDef {
    pub fn to_schema(&self) -> String {
        let mut output = String::new();
        
        if let Some(ref desc) = self.description {
            output.push_str(&format!("\"\"\"{}\"\"\"\n", desc));
        }
        
        output.push_str(&format!("type {} {{\n", self.name));
        
        for field in &self.fields {
            if let Some(ref desc) = field.description {
                output.push_str(&format!("  \"\"\"{}\"\"\"", desc));
            }
            
            let args = if field.arguments.is_empty() {
                String::new()
            } else {
                let args_str: Vec<_> = field.arguments.iter()
                    .map(|a| format!("{}: {}", a.name, a.arg_type.to_gql()))
                    .collect();
                format!("({})", args_str.join(", "))
            };
            
            output.push_str(&format!("  {}{}: {}\n", field.name, args, field.field_type.to_gql()));
        }
        
        output.push_str("}\n");
        output
    }
}

/// GraphQL schema
#[derive(Debug, Clone, Default)]
pub struct GqlSchema {
    pub types: Vec<GqlTypeDef>,
    pub queries: Vec<GqlField>,
    pub mutations: Vec<GqlField>,
}

impl GqlSchema {
    pub fn new() -> Self {
        Self {
            types: Vec::new(),
            queries: Vec::new(),
            mutations: Vec::new(),
        }
    }

    pub fn add_type(&mut self, typedef: GqlTypeDef) {
        self.types.push(typedef);
    }

    pub fn add_query(&mut self, field: GqlField) {
        self.queries.push(field);
    }

    pub fn add_mutation(&mut self, field: GqlField) {
        self.mutations.push(field);
    }

    pub fn to_schema(&self) -> String {
        let mut output = String::new();

        // Types
        for typedef in &self.types {
            output.push_str(&typedef.to_schema());
            output.push('\n');
        }

        // Query type
        if !self.queries.is_empty() {
            output.push_str("type Query {\n");
            for q in &self.queries {
                output.push_str(&format!("  {}: {}\n", q.name, q.field_type.to_gql()));
            }
            output.push_str("}\n\n");
        }

        // Mutation type
        if !self.mutations.is_empty() {
            output.push_str("type Mutation {\n");
            for m in &self.mutations {
                output.push_str(&format!("  {}: {}\n", m.name, m.field_type.to_gql()));
            }
            output.push_str("}\n");
        }

        output
    }
}

/// Extract GraphQL schema from Omni code
pub fn extract_from_omni(code: &str) -> GqlSchema {
    let mut schema = GqlSchema::new();
    let mut current_struct: Option<GqlTypeDef> = None;
    
    for line in code.lines() {
        let trimmed = line.trim();
        
        // Find struct definitions
        if trimmed.starts_with("struct ") {
            if let Some(typedef) = current_struct.take() {
                schema.add_type(typedef);
            }
            
            let name = trimmed[7..].split('{').next()
                .unwrap_or("Unknown")
                .trim()
                .to_string();
            
            current_struct = Some(GqlTypeDef {
                name,
                description: None,
                fields: Vec::new(),
            });
        }
        
        // Find struct fields
        if let Some(ref mut typedef) = current_struct {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let field_type = parts[1].trim()
                        .trim_end_matches(',')
                        .to_string();
                    
                    typedef.fields.push(GqlField {
                        name,
                        field_type: GqlType::from_omni(&field_type),
                        description: None,
                        arguments: Vec::new(),
                    });
                }
            }
        }
        
        // Find @query annotations
        if trimmed.starts_with("@query") {
            // Next line is a function
        }
        
        // End of struct
        if trimmed == "}" {
            if let Some(typedef) = current_struct.take() {
                if !typedef.fields.is_empty() {
                    schema.add_type(typedef);
                }
            }
        }
    }
    
    schema
}

/// Generate GraphQL schema from Omni files
pub fn generate_graphql(code: &str, output: &Path) -> Result<()> {
    println!("{}", "🔮 Generating GraphQL schema...".cyan().bold());
    
    let schema = extract_from_omni(code);
    let schema_str = schema.to_schema();
    
    fs::write(output, &schema_str)?;
    
    println!("{} Generated {} types", "✓".green(), schema.types.len());
    println!("{} Saved to {}", "✓".green(), output.display());
    
    Ok(())
}
