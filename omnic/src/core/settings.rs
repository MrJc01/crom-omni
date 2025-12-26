//! Global Configuration Center
//!
//! Manages global and project-level settings for the Omni compiler.
//! Supports `omni config --set key=value` and `omni config --get key`.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};

/// Global settings file name
const GLOBAL_CONFIG_FILE: &str = ".omni_settings.json";
/// Project-level settings file name
const PROJECT_CONFIG_FILE: &str = "omni.settings.json";

/// Settings structure
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Settings {
    /// Package registry URL
    #[serde(default)]
    pub registry: String,
    
    /// Default target language
    #[serde(default)]
    pub default_target: String,
    
    /// Enable verbose output
    #[serde(default)]
    pub verbose: bool,
    
    /// Enable colored output
    #[serde(default = "default_colors")]
    pub colors: bool,
    
    /// Development mode
    #[serde(default)]
    pub dev_mode: bool,
    
    /// Custom key-value pairs
    #[serde(default)]
    pub custom: HashMap<String, String>,
}

fn default_colors() -> bool { true }

impl Settings {
    /// Load settings from a file
    pub fn load(path: &Path) -> Result<Self> {
        if path.exists() {
            let content = fs::read_to_string(path)
                .with_context(|| format!("Failed to read settings from {}", path.display()))?;
            serde_json::from_str(&content)
                .with_context(|| format!("Failed to parse settings from {}", path.display()))
        } else {
            Ok(Self::default())
        }
    }

    /// Save settings to a file
    pub fn save(&self, path: &Path) -> Result<()> {
        let content = serde_json::to_string_pretty(self)?;
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                fs::create_dir_all(parent)?;
            }
        }
        fs::write(path, content)?;
        Ok(())
    }

    /// Get a setting value by key
    pub fn get(&self, key: &str) -> Option<String> {
        match key {
            "registry" => Some(self.registry.clone()),
            "default_target" => Some(self.default_target.clone()),
            "verbose" => Some(self.verbose.to_string()),
            "colors" => Some(self.colors.to_string()),
            "dev_mode" => Some(self.dev_mode.to_string()),
            _ => self.custom.get(key).cloned(),
        }
    }

    /// Set a setting value by key
    pub fn set(&mut self, key: &str, value: &str) -> Result<()> {
        match key {
            "registry" => self.registry = value.to_string(),
            "default_target" => self.default_target = value.to_string(),
            "verbose" => self.verbose = value.parse().unwrap_or(false),
            "colors" => self.colors = value.parse().unwrap_or(true),
            "dev_mode" => self.dev_mode = value.parse().unwrap_or(false),
            _ => { self.custom.insert(key.to_string(), value.to_string()); }
        }
        Ok(())
    }

    /// List all settings as key-value pairs
    pub fn list(&self) -> Vec<(String, String)> {
        let mut pairs = vec![
            ("registry".to_string(), self.registry.clone()),
            ("default_target".to_string(), self.default_target.clone()),
            ("verbose".to_string(), self.verbose.to_string()),
            ("colors".to_string(), self.colors.to_string()),
            ("dev_mode".to_string(), self.dev_mode.to_string()),
        ];
        for (k, v) in &self.custom {
            pairs.push((k.clone(), v.clone()));
        }
        pairs
    }
}

/// Config manager - handles loading/saving from global and project locations
pub struct ConfigManager {
    global_path: PathBuf,
    project_path: Option<PathBuf>,
}

impl ConfigManager {
    /// Create a new config manager
    pub fn new() -> Self {
        let home = dirs_home();
        let global_path = home.join(GLOBAL_CONFIG_FILE);
        
        // Look for project config in current directory
        let project_path = std::env::current_dir()
            .map(|p| p.join(PROJECT_CONFIG_FILE))
            .ok()
            .filter(|p| p.exists());
        
        Self { global_path, project_path }
    }

    /// Load merged settings (project overrides global)
    pub fn load(&self) -> Result<Settings> {
        let mut settings = Settings::load(&self.global_path)?;
        
        if let Some(ref project_path) = self.project_path {
            let project = Settings::load(project_path)?;
            // Merge project settings into global
            if !project.registry.is_empty() { settings.registry = project.registry; }
            if !project.default_target.is_empty() { settings.default_target = project.default_target; }
            if project.verbose { settings.verbose = true; }
            if !project.colors { settings.colors = false; }
            if project.dev_mode { settings.dev_mode = true; }
            for (k, v) in project.custom {
                settings.custom.insert(k, v);
            }
        }
        
        Ok(settings)
    }

    /// Save settings to global config
    pub fn save_global(&self, settings: &Settings) -> Result<()> {
        settings.save(&self.global_path)
    }

    /// Save settings to project config
    pub fn save_project(&self, settings: &Settings) -> Result<()> {
        let path = self.project_path.clone()
            .unwrap_or_else(|| std::env::current_dir().unwrap().join(PROJECT_CONFIG_FILE));
        settings.save(&path)
    }
}

/// Get home directory
fn dirs_home() -> PathBuf {
    std::env::var("HOME")
        .or_else(|_| std::env::var("USERPROFILE"))
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("."))
}

/// CLI handler for `omni config` command
pub fn handle_config_command(args: &[String]) -> Result<()> {
    let manager = ConfigManager::new();
    let mut settings = manager.load()?;

    if args.is_empty() {
        // List all settings
        println!("Current settings:");
        for (key, value) in settings.list() {
            if !value.is_empty() {
                println!("  {} = {}", key, value);
            }
        }
        return Ok(());
    }

    match args[0].as_str() {
        "--set" | "-s" => {
            if args.len() < 2 {
                return Err(anyhow::anyhow!("Usage: omni config --set key=value"));
            }
            let kv = &args[1];
            if let Some(eq_pos) = kv.find('=') {
                let key = &kv[..eq_pos];
                let value = &kv[eq_pos + 1..];
                settings.set(key, value)?;
                manager.save_global(&settings)?;
                println!("Set {} = {}", key, value);
            } else {
                return Err(anyhow::anyhow!("Invalid format. Use: key=value"));
            }
        }
        "--get" | "-g" => {
            if args.len() < 2 {
                return Err(anyhow::anyhow!("Usage: omni config --get key"));
            }
            let key = &args[1];
            match settings.get(key) {
                Some(value) => println!("{}", value),
                None => println!("(not set)"),
            }
        }
        "--list" | "-l" => {
            for (key, value) in settings.list() {
                println!("{} = {}", key, value);
            }
        }
        _ => {
            println!("Usage:");
            println!("  omni config              List all settings");
            println!("  omni config --set k=v    Set a setting");
            println!("  omni config --get key    Get a setting");
            println!("  omni config --list       List all settings");
        }
    }

    Ok(())
}
