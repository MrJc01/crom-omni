//! Native Sandbox - Isolate Native Blocks
//!
//! Security layer for executing native code blocks in a restricted environment.

use std::collections::HashSet;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use colored::*;

/// Sandbox permission levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Permission {
    /// Allow reading files
    FileRead,
    /// Allow writing files
    FileWrite,
    /// Allow network access
    Network,
    /// Allow shell command execution
    Shell,
    /// Allow environment variable access
    Environment,
    /// Allow process spawning
    Process,
    /// Allow FFI calls
    Ffi,
}

impl Permission {
    pub fn all() -> HashSet<Permission> {
        use Permission::*;
        [FileRead, FileWrite, Network, Shell, Environment, Process, Ffi]
            .into_iter().collect()
    }

    pub fn safe() -> HashSet<Permission> {
        use Permission::*;
        [FileRead, Environment].into_iter().collect()
    }

    pub fn none() -> HashSet<Permission> {
        HashSet::new()
    }
}

/// Sandbox configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SandboxConfig {
    /// Allowed permissions
    pub permissions: HashSet<Permission>,
    /// Allowed file paths for read
    pub allowed_read_paths: Vec<PathBuf>,
    /// Allowed file paths for write
    pub allowed_write_paths: Vec<PathBuf>,
    /// Allowed network hosts
    pub allowed_hosts: Vec<String>,
    /// Maximum execution time in seconds
    pub timeout_secs: u32,
    /// Maximum memory in MB
    pub max_memory_mb: u32,
}

impl Default for SandboxConfig {
    fn default() -> Self {
        Self {
            permissions: Permission::safe(),
            allowed_read_paths: vec![],
            allowed_write_paths: vec![],
            allowed_hosts: vec![],
            timeout_secs: 30,
            max_memory_mb: 256,
        }
    }
}

impl SandboxConfig {
    /// Create a permissive sandbox (for development)
    pub fn permissive() -> Self {
        Self {
            permissions: Permission::all(),
            allowed_read_paths: vec![PathBuf::from(".")],
            allowed_write_paths: vec![PathBuf::from("./dist")],
            allowed_hosts: vec!["*".to_string()],
            timeout_secs: 300,
            max_memory_mb: 1024,
        }
    }

    /// Create a strict sandbox (for untrusted code)
    pub fn strict() -> Self {
        Self {
            permissions: Permission::none(),
            allowed_read_paths: vec![],
            allowed_write_paths: vec![],
            allowed_hosts: vec![],
            timeout_secs: 5,
            max_memory_mb: 64,
        }
    }

    /// Check if a permission is allowed
    pub fn has_permission(&self, perm: Permission) -> bool {
        self.permissions.contains(&perm)
    }

    /// Add a permission
    pub fn allow(&mut self, perm: Permission) -> &mut Self {
        self.permissions.insert(perm);
        self
    }

    /// Remove a permission
    pub fn deny(&mut self, perm: Permission) -> &mut Self {
        self.permissions.remove(&perm);
        self
    }

    /// Allow reading from a path
    pub fn allow_read(&mut self, path: PathBuf) -> &mut Self {
        self.allowed_read_paths.push(path);
        self
    }

    /// Allow writing to a path
    pub fn allow_write(&mut self, path: PathBuf) -> &mut Self {
        self.allowed_write_paths.push(path);
        self
    }

    /// Allow a network host
    pub fn allow_host(&mut self, host: &str) -> &mut Self {
        self.allowed_hosts.push(host.to_string());
        self
    }
}

/// Sandbox violation error
#[derive(Debug, Clone)]
pub struct SandboxViolation {
    pub permission: Permission,
    pub action: String,
    pub context: Option<String>,
}

impl std::fmt::Display for SandboxViolation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Sandbox violation: {:?} - {}", self.permission, self.action)?;
        if let Some(ctx) = &self.context {
            write!(f, " ({})", ctx)?;
        }
        Ok(())
    }
}

/// Native code sandbox executor
pub struct Sandbox {
    config: SandboxConfig,
    violations: Vec<SandboxViolation>,
}

impl Sandbox {
    pub fn new(config: SandboxConfig) -> Self {
        Self {
            config,
            violations: Vec::new(),
        }
    }

    /// Check and record a permission request
    pub fn check_permission(&mut self, perm: Permission, action: &str) -> Result<(), SandboxViolation> {
        if self.config.has_permission(perm) {
            Ok(())
        } else {
            let violation = SandboxViolation {
                permission: perm,
                action: action.to_string(),
                context: None,
            };
            self.violations.push(violation.clone());
            Err(violation)
        }
    }

    /// Check file read permission
    pub fn check_read(&mut self, path: &std::path::Path) -> Result<(), SandboxViolation> {
        self.check_permission(Permission::FileRead, &format!("read {}", path.display()))?;
        
        // Check allowed paths
        let allowed = self.config.allowed_read_paths.iter()
            .any(|p| path.starts_with(p));
        
        if allowed || self.config.allowed_read_paths.is_empty() {
            Ok(())
        } else {
            let violation = SandboxViolation {
                permission: Permission::FileRead,
                action: format!("read {}", path.display()),
                context: Some("path not in allowed list".to_string()),
            };
            self.violations.push(violation.clone());
            Err(violation)
        }
    }

    /// Check file write permission
    pub fn check_write(&mut self, path: &std::path::Path) -> Result<(), SandboxViolation> {
        self.check_permission(Permission::FileWrite, &format!("write {}", path.display()))?;
        
        let allowed = self.config.allowed_write_paths.iter()
            .any(|p| path.starts_with(p));
        
        if allowed || self.config.allowed_write_paths.is_empty() {
            Ok(())
        } else {
            let violation = SandboxViolation {
                permission: Permission::FileWrite,
                action: format!("write {}", path.display()),
                context: Some("path not in allowed list".to_string()),
            };
            self.violations.push(violation.clone());
            Err(violation)
        }
    }

    /// Get all violations
    pub fn violations(&self) -> &[SandboxViolation] {
        &self.violations
    }

    /// Report violations
    pub fn report(&self) {
        if self.violations.is_empty() {
            println!("{} No sandbox violations", "✓".green());
        } else {
            println!("{} {} sandbox violations:", "⚠".yellow(), self.violations.len());
            for v in &self.violations {
                println!("  - {}", v);
            }
        }
    }
}

/// Validate native block against sandbox policy
pub fn validate_native_block(code: &str, config: &SandboxConfig) -> Vec<String> {
    let mut warnings = Vec::new();

    // Check for dangerous patterns
    if code.contains("require('child_process')") || code.contains("spawn(") || code.contains("exec(") {
        if !config.has_permission(Permission::Process) {
            warnings.push("Native block uses child_process without Process permission".to_string());
        }
    }

    if code.contains("require('fs')") || code.contains("readFile") || code.contains("writeFile") {
        if !config.has_permission(Permission::FileRead) && !config.has_permission(Permission::FileWrite) {
            warnings.push("Native block uses fs without File permissions".to_string());
        }
    }

    if code.contains("require('http')") || code.contains("fetch(") || code.contains("axios") {
        if !config.has_permission(Permission::Network) {
            warnings.push("Native block uses network without Network permission".to_string());
        }
    }

    if code.contains("process.env") || code.contains("getenv") {
        if !config.has_permission(Permission::Environment) {
            warnings.push("Native block accesses environment without Environment permission".to_string());
        }
    }

    warnings
}
