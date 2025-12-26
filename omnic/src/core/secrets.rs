//! Secret Management - Secure .env Handling
//!
//! Manages environment variables and secrets with masking,
//! validation, and secure loading from .env files.

use std::collections::HashMap;
use std::fs;
use std::path::Path;
use anyhow::{Result, Context};

/// Secret value with masking support
#[derive(Debug, Clone)]
pub struct Secret {
    value: String,
    masked: bool,
}

impl Secret {
    pub fn new(value: &str) -> Self {
        Self {
            value: value.to_string(),
            masked: true,
        }
    }

    /// Get the raw value (use carefully!)
    pub fn expose(&self) -> &str {
        &self.value
    }

    /// Get masked representation for display
    pub fn masked(&self) -> String {
        if self.value.is_empty() {
            "(empty)".to_string()
        } else if self.value.len() <= 4 {
            "*".repeat(self.value.len())
        } else {
            format!("{}***", &self.value[..2])
        }
    }

    /// Get length without exposing value
    pub fn len(&self) -> usize {
        self.value.len()
    }

    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }
}

impl std::fmt::Display for Secret {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if self.masked {
            write!(f, "{}", self.masked())
        } else {
            write!(f, "{}", self.value)
        }
    }
}

/// Environment/Secrets manager
pub struct SecretManager {
    secrets: HashMap<String, Secret>,
    env_file: Option<String>,
}

impl SecretManager {
    pub fn new() -> Self {
        Self {
            secrets: HashMap::new(),
            env_file: None,
        }
    }

    /// Load secrets from .env file
    pub fn load_env(&mut self, path: &Path) -> Result<usize> {
        let content = fs::read_to_string(path)
            .with_context(|| format!("Failed to read {}", path.display()))?;
        
        self.env_file = Some(path.to_string_lossy().to_string());
        let mut count = 0;

        for line in content.lines() {
            let line = line.trim();
            
            // Skip empty lines and comments
            if line.is_empty() || line.starts_with('#') {
                continue;
            }

            // Parse KEY=value format
            if let Some(eq_pos) = line.find('=') {
                let key = line[..eq_pos].trim().to_string();
                let value = line[eq_pos + 1..].trim();
                
                // Remove surrounding quotes if present
                let value = if (value.starts_with('"') && value.ends_with('"'))
                    || (value.starts_with('\'') && value.ends_with('\''))
                {
                    &value[1..value.len() - 1]
                } else {
                    value
                };

                self.secrets.insert(key, Secret::new(value));
                count += 1;
            }
        }

        Ok(count)
    }

    /// Get a secret by key
    pub fn get(&self, key: &str) -> Option<&Secret> {
        self.secrets.get(key)
    }

    /// Get raw value (use carefully!)
    pub fn get_value(&self, key: &str) -> Option<&str> {
        self.secrets.get(key).map(|s| s.expose())
    }

    /// Set a secret
    pub fn set(&mut self, key: &str, value: &str) {
        self.secrets.insert(key.to_string(), Secret::new(value));
    }

    /// Check if a key exists
    pub fn has(&self, key: &str) -> bool {
        self.secrets.contains_key(key)
    }

    /// List all keys (values are masked)
    pub fn list_keys(&self) -> Vec<&String> {
        self.secrets.keys().collect()
    }

    /// List all keys with masked values
    pub fn list_masked(&self) -> Vec<(String, String)> {
        self.secrets
            .iter()
            .map(|(k, v)| (k.clone(), v.masked()))
            .collect()
    }

    /// Validate required secrets are present
    pub fn validate(&self, required: &[&str]) -> Result<Vec<String>> {
        let mut missing = Vec::new();
        
        for key in required {
            if !self.has(key) {
                missing.push(key.to_string());
            }
        }

        Ok(missing)
    }

    /// Save secrets back to .env file
    pub fn save(&self, path: &Path) -> Result<()> {
        let mut lines = Vec::new();
        
        for (key, secret) in &self.secrets {
            lines.push(format!("{}={}", key, secret.expose()));
        }

        fs::write(path, lines.join("\n"))?;
        Ok(())
    }

    /// Export to environment variables
    pub fn export_to_env(&self) {
        for (key, secret) in &self.secrets {
            std::env::set_var(key, secret.expose());
        }
    }

    /// Load from system environment
    pub fn load_from_env(&mut self, keys: &[&str]) {
        for key in keys {
            if let Ok(value) = std::env::var(key) {
                self.set(key, &value);
            }
        }
    }
}

impl Default for SecretManager {
    fn default() -> Self {
        Self::new()
    }
}

/// Load .env file from project directory
pub fn load_dotenv(project_dir: &Path) -> Result<SecretManager> {
    let mut manager = SecretManager::new();
    
    // Try .env file
    let env_path = project_dir.join(".env");
    if env_path.exists() {
        manager.load_env(&env_path)?;
    }
    
    // Also try .env.local for overrides
    let local_path = project_dir.join(".env.local");
    if local_path.exists() {
        manager.load_env(&local_path)?;
    }
    
    Ok(manager)
}

/// Check that .env is in .gitignore
pub fn check_gitignore(project_dir: &Path) -> bool {
    let gitignore = project_dir.join(".gitignore");
    if gitignore.exists() {
        if let Ok(content) = fs::read_to_string(&gitignore) {
            return content.lines().any(|line| {
                let line = line.trim();
                line == ".env" || line == ".env*" || line == "*.env"
            });
        }
    }
    false
}
