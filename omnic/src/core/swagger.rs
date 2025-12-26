//! Swagger/OpenAPI Generator - API Documentation
//!
//! Generates OpenAPI/Swagger specs from Omni code.

use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use colored::*;

/// HTTP methods
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum HttpMethod {
    Get,
    Post,
    Put,
    Patch,
    Delete,
}

/// API parameter
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiParam {
    pub name: String,
    #[serde(rename = "in")]
    pub location: String, // "path", "query", "header", "body"
    pub required: bool,
    #[serde(rename = "type")]
    pub param_type: String,
    pub description: Option<String>,
}

/// API response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiResponse {
    pub status: u16,
    pub description: String,
    pub schema: Option<String>,
}

/// API endpoint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiEndpoint {
    pub path: String,
    pub method: HttpMethod,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub tags: Vec<String>,
    pub parameters: Vec<ApiParam>,
    pub responses: Vec<ApiResponse>,
}

/// Schema definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemaProperty {
    pub name: String,
    #[serde(rename = "type")]
    pub prop_type: String,
    pub required: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Schema {
    pub name: String,
    pub properties: Vec<SchemaProperty>,
}

/// OpenAPI spec
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenApiSpec {
    pub openapi: String,
    pub info: ApiInfo,
    pub servers: Vec<ApiServer>,
    pub paths: Vec<ApiEndpoint>,
    pub components: ApiComponents,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiInfo {
    pub title: String,
    pub version: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiServer {
    pub url: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiComponents {
    pub schemas: Vec<Schema>,
}

impl OpenApiSpec {
    pub fn new(title: &str, version: &str) -> Self {
        Self {
            openapi: "3.0.3".to_string(),
            info: ApiInfo {
                title: title.to_string(),
                version: version.to_string(),
                description: None,
            },
            servers: vec![ApiServer {
                url: "http://localhost:3000".to_string(),
                description: Some("Development server".to_string()),
            }],
            paths: Vec::new(),
            components: ApiComponents { schemas: Vec::new() },
        }
    }

    /// Add an endpoint
    pub fn add_endpoint(&mut self, endpoint: ApiEndpoint) {
        self.paths.push(endpoint);
    }

    /// Add a schema
    pub fn add_schema(&mut self, schema: Schema) {
        self.components.schemas.push(schema);
    }

    /// Generate to JSON
    pub fn to_json(&self) -> Result<String> {
        Ok(serde_json::to_string_pretty(self)?)
    }

    /// Generate to YAML-like format
    pub fn to_yaml_like(&self) -> String {
        let mut output = String::new();
        
        output.push_str(&format!("openapi: \"{}\"\n", self.openapi));
        output.push_str("info:\n");
        output.push_str(&format!("  title: \"{}\"\n", self.info.title));
        output.push_str(&format!("  version: \"{}\"\n", self.info.version));
        
        if !self.servers.is_empty() {
            output.push_str("servers:\n");
            for server in &self.servers {
                output.push_str(&format!("  - url: \"{}\"\n", server.url));
            }
        }
        
        if !self.paths.is_empty() {
            output.push_str("paths:\n");
            for endpoint in &self.paths {
                output.push_str(&format!("  {}:\n", endpoint.path));
                output.push_str(&format!("    {:?}:\n", endpoint.method).to_lowercase());
                if let Some(ref summary) = endpoint.summary {
                    output.push_str(&format!("      summary: \"{}\"\n", summary));
                }
                if !endpoint.tags.is_empty() {
                    output.push_str(&format!("      tags: {:?}\n", endpoint.tags));
                }
            }
        }
        
        output
    }
}

/// Extract API endpoints from Omni code
pub fn extract_from_omni(code: &str) -> Vec<ApiEndpoint> {
    let mut endpoints = Vec::new();
    
    for line in code.lines() {
        let trimmed = line.trim();
        
        // Look for @route annotations
        if trimmed.starts_with("@route(") || trimmed.starts_with("@get(") || 
           trimmed.starts_with("@post(") || trimmed.starts_with("@put(") ||
           trimmed.starts_with("@delete(") {
            
            let (method, path) = if trimmed.starts_with("@route") {
                (HttpMethod::Get, extract_string_arg(trimmed))
            } else if trimmed.starts_with("@get") {
                (HttpMethod::Get, extract_string_arg(trimmed))
            } else if trimmed.starts_with("@post") {
                (HttpMethod::Post, extract_string_arg(trimmed))
            } else if trimmed.starts_with("@put") {
                (HttpMethod::Put, extract_string_arg(trimmed))
            } else {
                (HttpMethod::Delete, extract_string_arg(trimmed))
            };
            
            endpoints.push(ApiEndpoint {
                path,
                method,
                summary: None,
                description: None,
                tags: vec![],
                parameters: vec![],
                responses: vec![ApiResponse {
                    status: 200,
                    description: "Success".to_string(),
                    schema: None,
                }],
            });
        }
    }
    
    endpoints
}

fn extract_string_arg(s: &str) -> String {
    s.split('"')
        .nth(1)
        .unwrap_or("/")
        .to_string()
}

/// Generate OpenAPI spec from Omni files
pub fn generate_swagger(name: &str, version: &str, code: &str, output: &Path) -> Result<()> {
    println!("{}", "📄 Generating OpenAPI spec...".cyan().bold());
    
    let mut spec = OpenApiSpec::new(name, version);
    let endpoints = extract_from_omni(code);
    
    for ep in endpoints {
        spec.add_endpoint(ep);
    }
    
    let json = spec.to_json()?;
    fs::write(output, &json)?;
    
    println!("{} Generated {} endpoints", "✓".green(), spec.paths.len());
    println!("{} Saved to {}", "✓".green(), output.display());
    
    Ok(())
}
