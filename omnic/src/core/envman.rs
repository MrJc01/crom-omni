//! Environment Manager - Runtime Version Management
//!
//! Manages Node, PHP, Python runtime versions for Omni projects.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Supported runtime types
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Runtime {
    Node,
    Python,
    Php,
    Rust,
}

impl Runtime {
    pub fn name(&self) -> &'static str {
        match self {
            Runtime::Node => "node",
            Runtime::Python => "python",
            Runtime::Php => "php",
            Runtime::Rust => "rust",
        }
    }

    pub fn version_command(&self) -> (&'static str, &'static [&'static str]) {
        match self {
            Runtime::Node => ("node", &["--version"]),
            Runtime::Python => ("python", &["--version"]),
            Runtime::Php => ("php", &["--version"]),
            Runtime::Rust => ("rustc", &["--version"]),
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "node" | "nodejs" => Some(Runtime::Node),
            "python" | "python3" => Some(Runtime::Python),
            "php" => Some(Runtime::Php),
            "rust" | "rustc" => Some(Runtime::Rust),
            _ => None,
        }
    }
}

/// Runtime version info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuntimeInfo {
    pub runtime: Runtime,
    pub version: Option<String>,
    pub path: Option<PathBuf>,
    pub available: bool,
}

/// Project environment requirements
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct EnvRequirements {
    pub node: Option<String>,
    pub python: Option<String>,
    pub php: Option<String>,
    pub rust: Option<String>,
}

impl EnvRequirements {
    /// Load from omni.config.json
    pub fn from_config(config: &serde_json::Value) -> Self {
        let env = config.get("env").or_else(|| config.get("environment"));
        
        if let Some(env) = env {
            Self {
                node: env.get("node").and_then(|v| v.as_str()).map(String::from),
                python: env.get("python").and_then(|v| v.as_str()).map(String::from),
                php: env.get("php").and_then(|v| v.as_str()).map(String::from),
                rust: env.get("rust").and_then(|v| v.as_str()).map(String::from),
            }
        } else {
            Self::default()
        }
    }
}

/// Environment manager
pub struct EnvManager {
    cache: HashMap<Runtime, RuntimeInfo>,
}

impl EnvManager {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    /// Detect installed version of a runtime
    pub fn detect(&mut self, runtime: Runtime) -> RuntimeInfo {
        if let Some(cached) = self.cache.get(&runtime) {
            return cached.clone();
        }

        let (cmd, args) = runtime.version_command();
        let result = Command::new(cmd)
            .args(args)
            .output();

        let info = match result {
            Ok(output) if output.status.success() => {
                let version_str = String::from_utf8_lossy(&output.stdout);
                let version = parse_version(&version_str);
                
                // Try to find path
                let path = which_path(cmd);
                
                RuntimeInfo {
                    runtime,
                    version: Some(version),
                    path,
                    available: true,
                }
            }
            _ => RuntimeInfo {
                runtime,
                version: None,
                path: None,
                available: false,
            },
        };

        self.cache.insert(runtime, info.clone());
        info
    }

    /// Detect all runtimes
    pub fn detect_all(&mut self) -> Vec<RuntimeInfo> {
        vec![
            self.detect(Runtime::Node),
            self.detect(Runtime::Python),
            self.detect(Runtime::Php),
            self.detect(Runtime::Rust),
        ]
    }

    /// Check if requirements are satisfied
    pub fn check_requirements(&mut self, req: &EnvRequirements) -> Vec<(Runtime, bool, String)> {
        let mut results = Vec::new();

        if let Some(ref needed) = req.node {
            let info = self.detect(Runtime::Node);
            let ok = check_version_match(&info.version, needed);
            results.push((Runtime::Node, ok, needed.clone()));
        }

        if let Some(ref needed) = req.python {
            let info = self.detect(Runtime::Python);
            let ok = check_version_match(&info.version, needed);
            results.push((Runtime::Python, ok, needed.clone()));
        }

        if let Some(ref needed) = req.php {
            let info = self.detect(Runtime::Php);
            let ok = check_version_match(&info.version, needed);
            results.push((Runtime::Php, ok, needed.clone()));
        }

        if let Some(ref needed) = req.rust {
            let info = self.detect(Runtime::Rust);
            let ok = check_version_match(&info.version, needed);
            results.push((Runtime::Rust, ok, needed.clone()));
        }

        results
    }

    /// Display environment status
    pub fn display_status(&mut self) {
        println!("{}", "🔧 Environment Status".cyan().bold());
        println!();
        
        for info in self.detect_all() {
            let status = if info.available { "✓".green() } else { "✗".red() };
            let version = info.version.as_deref().unwrap_or("not found");
            println!("  {} {}: {}", status, info.runtime.name(), version);
        }
    }
}

impl Default for EnvManager {
    fn default() -> Self {
        Self::new()
    }
}

/// Parse version from command output
fn parse_version(output: &str) -> String {
    // Extract version number (e.g., "v20.10.0", "Python 3.11.0", "PHP 8.2.0")
    let output = output.trim();
    
    // Try to find version pattern
    for word in output.split_whitespace() {
        let word = word.trim_start_matches('v');
        if word.chars().next().map_or(false, |c| c.is_ascii_digit()) {
            return word.to_string();
        }
    }
    
    output.to_string()
}

/// Try to find executable path
fn which_path(cmd: &str) -> Option<PathBuf> {
    #[cfg(windows)]
    let which = Command::new("where").arg(cmd).output();
    
    #[cfg(not(windows))]
    let which = Command::new("which").arg(cmd).output();
    
    which.ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).lines().next().unwrap_or("").to_string())
        .filter(|s| !s.is_empty())
        .map(PathBuf::from)
}

/// Check if installed version matches requirement
fn check_version_match(installed: &Option<String>, required: &str) -> bool {
    match installed {
        None => false,
        Some(ver) => {
            // Simple prefix match for now
            // ">=18" or "18.x" patterns could be added
            if required.starts_with(">=") {
                // TODO: semantic version comparison
                true
            } else if required.ends_with(".x") {
                ver.starts_with(&required[..required.len()-2])
            } else {
                ver.starts_with(required) || ver == required
            }
        }
    }
}

/// Run environment check command
pub fn run_env_check() -> Result<()> {
    let mut manager = EnvManager::new();
    manager.display_status();
    Ok(())
}
