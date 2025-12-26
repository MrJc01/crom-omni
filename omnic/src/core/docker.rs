//! Docker Generator - Dockerfile Autogeneration
//!
//! Generates optimized Dockerfiles for Omni projects.

use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use colored::*;

/// Target runtime for Docker
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DockerTarget {
    Node,
    Php,
    Python,
    Multi,
}

impl DockerTarget {
    pub fn base_image(&self) -> &'static str {
        match self {
            DockerTarget::Node => "node:20-alpine",
            DockerTarget::Php => "php:8.3-apache",
            DockerTarget::Python => "python:3.12-slim",
            DockerTarget::Multi => "alpine:3.19",
        }
    }
}

/// Docker config
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DockerConfig {
    pub name: String,
    pub port: u16,
    pub entry: String,
    pub env_vars: Vec<(String, String)>,
    pub copy_files: Vec<String>,
}

impl Default for DockerConfig {
    fn default() -> Self {
        Self {
            name: "omni-app".to_string(),
            port: 3000,
            entry: "dist/main.js".to_string(),
            env_vars: vec![("NODE_ENV".to_string(), "production".to_string())],
            copy_files: vec!["dist/".to_string(), "package.json".to_string()],
        }
    }
}

/// Generate Dockerfile for Node.js
fn generate_node_dockerfile(config: &DockerConfig) -> String {
    format!(r#"# Omni App - Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
{}
{}
EXPOSE {}
CMD ["node", "{}"]
"#,
        config.copy_files.iter()
            .map(|f| format!("COPY {} ./", f))
            .collect::<Vec<_>>()
            .join("\n"),
        config.env_vars.iter()
            .map(|(k, v)| format!("ENV {}={}", k, v))
            .collect::<Vec<_>>()
            .join("\n"),
        config.port,
        config.entry,
    )
}

/// Generate Dockerfile for PHP
fn generate_php_dockerfile(config: &DockerConfig) -> String {
    format!(r#"# Omni App - PHP
FROM php:8.3-fpm-alpine AS base
RUN docker-php-ext-install pdo pdo_mysql opcache

FROM php:8.3-apache
WORKDIR /var/www/html
COPY --from=base /usr/local/lib/php/extensions /usr/local/lib/php/extensions
{}
{}
RUN a2enmod rewrite
EXPOSE {}
CMD ["apache2-foreground"]
"#,
        config.copy_files.iter()
            .map(|f| format!("COPY {} ./", f))
            .collect::<Vec<_>>()
            .join("\n"),
        config.env_vars.iter()
            .map(|(k, v)| format!("ENV {}={}", k, v))
            .collect::<Vec<_>>()
            .join("\n"),
        config.port,
    )
}

/// Generate Dockerfile for Python
fn generate_python_dockerfile(config: &DockerConfig) -> String {
    format!(r#"# Omni App - Python
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
{}
{}
EXPOSE {}
CMD ["python", "{}"]
"#,
        config.copy_files.iter()
            .map(|f| format!("COPY {} ./", f))
            .collect::<Vec<_>>()
            .join("\n"),
        config.env_vars.iter()
            .map(|(k, v)| format!("ENV {}={}", k, v))
            .collect::<Vec<_>>()
            .join("\n"),
        config.port,
        config.entry,
    )
}

/// Generate docker-compose.yml
fn generate_compose(config: &DockerConfig) -> String {
    format!(r#"version: '3.8'
services:
  app:
    build: .
    ports:
      - "{}:{}"
    environment:
{}
    restart: unless-stopped
"#,
        config.port,
        config.port,
        config.env_vars.iter()
            .map(|(k, v)| format!("      - {}={}", k, v))
            .collect::<Vec<_>>()
            .join("\n"),
    )
}

/// Generate .dockerignore
fn generate_dockerignore() -> String {
    r#"node_modules
.git
.gitignore
*.md
*.log
.env
.env.local
.DS_Store
Thumbs.db
coverage
.nyc_output
"#.to_string()
}

/// Docker generator
pub struct DockerGenerator {
    config: DockerConfig,
    target: DockerTarget,
}

impl DockerGenerator {
    pub fn new(config: DockerConfig, target: DockerTarget) -> Self {
        Self { config, target }
    }

    /// Generate all Docker files
    pub fn generate(&self, output_dir: &Path) -> Result<()> {
        println!("{}", "🐳 Generating Docker configuration...".cyan().bold());

        // Dockerfile
        let dockerfile = match self.target {
            DockerTarget::Node => generate_node_dockerfile(&self.config),
            DockerTarget::Php => generate_php_dockerfile(&self.config),
            DockerTarget::Python => generate_python_dockerfile(&self.config),
            DockerTarget::Multi => generate_node_dockerfile(&self.config),
        };
        
        let dockerfile_path = output_dir.join("Dockerfile");
        fs::write(&dockerfile_path, dockerfile)?;
        println!("  {} Dockerfile", "✓".green());

        // docker-compose.yml
        let compose = generate_compose(&self.config);
        let compose_path = output_dir.join("docker-compose.yml");
        fs::write(&compose_path, compose)?;
        println!("  {} docker-compose.yml", "✓".green());

        // .dockerignore
        let ignore = generate_dockerignore();
        let ignore_path = output_dir.join(".dockerignore");
        fs::write(&ignore_path, ignore)?;
        println!("  {} .dockerignore", "✓".green());

        println!();
        println!("{} Docker files generated!", "✓".green().bold());
        println!();
        println!("Build: docker build -t {} .", self.config.name);
        println!("Run:   docker run -p {}:{} {}", 
            self.config.port, self.config.port, self.config.name);

        Ok(())
    }
}

/// Run docker generation command
pub fn run_docker_gen(target: DockerTarget, output_dir: &Path) -> Result<()> {
    let config = DockerConfig::default();
    let generator = DockerGenerator::new(config, target);
    generator.generate(output_dir)
}
