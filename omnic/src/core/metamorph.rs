//! Metamorphosis - Framework Adapters
//!
//! Adapts Omni code to work with popular frameworks like Laravel, Express, React.

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use colored::*;

/// Supported frameworks
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Framework {
    // PHP Frameworks
    Laravel,
    Symfony,
    // JS Frameworks
    Express,
    Fastify,
    React,
    Vue,
    // Python Frameworks
    Django,
    Flask,
    FastApi,
}

impl Framework {
    pub fn name(&self) -> &'static str {
        match self {
            Framework::Laravel => "Laravel",
            Framework::Symfony => "Symfony",
            Framework::Express => "Express.js",
            Framework::Fastify => "Fastify",
            Framework::React => "React",
            Framework::Vue => "Vue.js",
            Framework::Django => "Django",
            Framework::Flask => "Flask",
            Framework::FastApi => "FastAPI",
        }
    }

    pub fn target(&self) -> &'static str {
        match self {
            Framework::Laravel | Framework::Symfony => "php",
            Framework::Express | Framework::Fastify | Framework::React | Framework::Vue => "js",
            Framework::Django | Framework::Flask | Framework::FastApi => "py",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            Framework::Laravel => "PHP web framework with elegant syntax",
            Framework::Symfony => "PHP framework for enterprise applications",
            Framework::Express => "Minimal Node.js web framework",
            Framework::Fastify => "Fast, low overhead Node.js framework",
            Framework::React => "UI library for building user interfaces",
            Framework::Vue => "Progressive JavaScript framework",
            Framework::Django => "Python web framework with batteries included",
            Framework::Flask => "Lightweight Python WSGI framework",
            Framework::FastApi => "Modern Python web framework for APIs",
        }
    }
}

/// Adapter pattern for a framework
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdapterPattern {
    pub name: String,
    pub description: String,
    pub omni_code: String,
    pub generated_code: String,
}

/// Framework adapter configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameworkAdapter {
    pub framework: Framework,
    pub patterns: Vec<AdapterPattern>,
    pub imports: Vec<String>,
    pub boilerplate: Option<String>,
}

impl FrameworkAdapter {
    /// Create Laravel adapter
    pub fn laravel() -> Self {
        Self {
            framework: Framework::Laravel,
            patterns: vec![
                AdapterPattern {
                    name: "Controller".to_string(),
                    description: "HTTP request handler".to_string(),
                    omni_code: r#"@controller
struct UserController {
    fn index() -> Response {
        return View::render("users.index");
    }
}"#.to_string(),
                    generated_code: r#"class UserController extends Controller {
    public function index() {
        return view('users.index');
    }
}"#.to_string(),
                },
                AdapterPattern {
                    name: "Model".to_string(),
                    description: "Eloquent model".to_string(),
                    omni_code: r#"@model
struct User {
    id: Int,
    name: String,
    email: String,
}"#.to_string(),
                    generated_code: r#"class User extends Model {
    protected $fillable = ['name', 'email'];
}"#.to_string(),
                },
            ],
            imports: vec![
                "use Illuminate\\Http\\Request;".into(),
                "use Illuminate\\Support\\Facades\\View;".into(),
            ],
            boilerplate: Some("<?php\n\nnamespace App\\Http\\Controllers;".into()),
        }
    }

    /// Create Express adapter
    pub fn express() -> Self {
        Self {
            framework: Framework::Express,
            patterns: vec![
                AdapterPattern {
                    name: "Route Handler".to_string(),
                    description: "Express route handler".to_string(),
                    omni_code: r#"@route("/users")
fn get_users(req: Request) -> Response {
    return Json(users);
}"#.to_string(),
                    generated_code: r#"app.get('/users', (req, res) => {
    res.json(users);
});"#.to_string(),
                },
                AdapterPattern {
                    name: "Middleware".to_string(),
                    description: "Express middleware".to_string(),
                    omni_code: r#"@middleware
fn auth_check(req: Request, next: NextFn) {
    if !req.is_authenticated() {
        return Unauthorized();
    }
    return next();
}"#.to_string(),
                    generated_code: r#"const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }
    next();
};"#.to_string(),
                },
            ],
            imports: vec![
                "const express = require('express');".into(),
            ],
            boilerplate: Some("const app = express();".into()),
        }
    }

    /// Create FastAPI adapter
    pub fn fastapi() -> Self {
        Self {
            framework: Framework::FastApi,
            patterns: vec![
                AdapterPattern {
                    name: "API Endpoint".to_string(),
                    description: "FastAPI route".to_string(),
                    omni_code: r#"@api("/users")
fn list_users() -> List<User> {
    return db.get_all_users();
}"#.to_string(),
                    generated_code: r#"@app.get("/users")
async def list_users():
    return db.get_all_users()"#.to_string(),
                },
            ],
            imports: vec![
                "from fastapi import FastAPI".into(),
            ],
            boilerplate: Some("app = FastAPI()".into()),
        }
    }
}

/// Adapter registry
pub struct AdapterRegistry {
    adapters: HashMap<Framework, FrameworkAdapter>,
}

impl AdapterRegistry {
    pub fn new() -> Self {
        let mut adapters = HashMap::new();
        adapters.insert(Framework::Laravel, FrameworkAdapter::laravel());
        adapters.insert(Framework::Express, FrameworkAdapter::express());
        adapters.insert(Framework::FastApi, FrameworkAdapter::fastapi());
        Self { adapters }
    }

    pub fn get(&self, framework: &Framework) -> Option<&FrameworkAdapter> {
        self.adapters.get(framework)
    }

    pub fn list_frameworks(&self) -> Vec<&Framework> {
        self.adapters.keys().collect()
    }

    /// Display adapter info
    pub fn display_adapter(adapter: &FrameworkAdapter) {
        println!("{}", format!("🔄 {} Adapter", adapter.framework.name()).cyan().bold());
        println!("   Target: {}", adapter.framework.target());
        println!("   {}", adapter.framework.description());
        println!();
        
        println!("{}", "Patterns:".yellow());
        for pattern in &adapter.patterns {
            println!("  • {} - {}", pattern.name.green(), pattern.description);
        }
    }
}

impl Default for AdapterRegistry {
    fn default() -> Self {
        Self::new()
    }
}

/// Display metamorphosis help
pub fn show_metamorphosis_help() {
    println!("{}", "🦋 Metamorphosis - Framework Adapters".cyan().bold());
    println!();
    println!("Transform Omni code to work with popular frameworks:");
    println!();
    
    let registry = AdapterRegistry::new();
    for framework in registry.list_frameworks() {
        println!("  {} {} ({})", 
            "•".green(),
            framework.name(),
            framework.target()
        );
    }
    
    println!();
    println!("Usage:");
    println!("  omni build main.omni --framework laravel");
    println!("  omni metamorph --show express");
}

/// Apply framework adapter to code
pub fn apply_adapter(framework: &Framework, code: &str) -> String {
    let registry = AdapterRegistry::new();
    
    if let Some(adapter) = registry.get(framework) {
        let mut result = String::new();
        
        // Add boilerplate
        if let Some(ref bp) = adapter.boilerplate {
            result.push_str(bp);
            result.push_str("\n\n");
        }
        
        // Add imports
        for import in &adapter.imports {
            result.push_str(import);
            result.push('\n');
        }
        result.push('\n');
        
        // Add transformed code (placeholder - real implementation would parse and transform)
        result.push_str("// Transformed code:\n");
        result.push_str(code);
        
        result
    } else {
        code.to_string()
    }
}
