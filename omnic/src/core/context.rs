//! Context Persistence - Project State Management
//!
//! Manages OMNI_CONTEXT.json for session state, project metadata,
//! and development context persistence.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context as AnyhowContext};
use std::time::{SystemTime, UNIX_EPOCH};

/// Context file name
const CONTEXT_FILE: &str = "OMNI_CONTEXT.json";

/// Build information
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BuildInfo {
    /// Last build timestamp
    pub last_build: u64,
    /// Build target
    pub target: String,
    /// Was build successful
    pub success: bool,
    /// Build duration in milliseconds
    pub duration_ms: u64,
    /// Number of files compiled
    pub files_compiled: usize,
}

/// Session information
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionInfo {
    /// Session start time
    pub started_at: u64,
    /// Last activity time
    pub last_activity: u64,
    /// Number of compilations
    pub compilation_count: u32,
    /// Current working file
    pub current_file: Option<String>,
}

/// Project metadata
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ProjectMeta {
    /// Project name
    pub name: String,
    /// Project version
    pub version: String,
    /// Main entry point
    pub entry_point: String,
    /// Source directory
    pub src_dir: String,
    /// Output directory
    pub out_dir: String,
}

/// The OMNI_CONTEXT.json structure
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OmniContext {
    /// Schema version
    pub version: u32,
    /// Project metadata
    pub project: ProjectMeta,
    /// Current session info
    pub session: SessionInfo,
    /// Last build info
    pub last_build: BuildInfo,
    /// Custom key-value data
    pub data: HashMap<String, String>,
    /// Recent files accessed
    pub recent_files: Vec<String>,
    /// Error history (last 10)
    pub error_history: Vec<String>,
}

impl OmniContext {
    /// Create a new empty context
    pub fn new() -> Self {
        Self {
            version: 1,
            session: SessionInfo {
                started_at: current_timestamp(),
                last_activity: current_timestamp(),
                compilation_count: 0,
                current_file: None,
            },
            ..Default::default()
        }
    }

    /// Load context from project directory
    pub fn load(project_dir: &Path) -> Result<Self> {
        let path = project_dir.join(CONTEXT_FILE);
        if path.exists() {
            let content = fs::read_to_string(&path)
                .with_context(|| format!("Failed to read {}", path.display()))?;
            serde_json::from_str(&content)
                .with_context(|| format!("Failed to parse {}", path.display()))
        } else {
            Ok(Self::new())
        }
    }

    /// Save context to project directory
    pub fn save(&self, project_dir: &Path) -> Result<()> {
        let path = project_dir.join(CONTEXT_FILE);
        let content = serde_json::to_string_pretty(self)?;
        fs::write(&path, content)?;
        Ok(())
    }

    /// Update last activity timestamp
    pub fn touch(&mut self) {
        self.session.last_activity = current_timestamp();
    }

    /// Record a build
    pub fn record_build(&mut self, target: &str, success: bool, duration_ms: u64, files: usize) {
        self.last_build = BuildInfo {
            last_build: current_timestamp(),
            target: target.to_string(),
            success,
            duration_ms,
            files_compiled: files,
        };
        self.session.compilation_count += 1;
        self.touch();
    }

    /// Record an error
    pub fn record_error(&mut self, error: &str) {
        self.error_history.push(format!(
            "[{}] {}", 
            current_timestamp(),
            error
        ));
        // Keep only last 10 errors
        if self.error_history.len() > 10 {
            self.error_history.remove(0);
        }
        self.touch();
    }

    /// Add a file to recent files
    pub fn add_recent_file(&mut self, file: &str) {
        // Remove if already present
        self.recent_files.retain(|f| f != file);
        // Add to front
        self.recent_files.insert(0, file.to_string());
        // Keep only last 20
        self.recent_files.truncate(20);
        self.session.current_file = Some(file.to_string());
        self.touch();
    }

    /// Get custom data
    pub fn get(&self, key: &str) -> Option<&String> {
        self.data.get(key)
    }

    /// Set custom data
    pub fn set(&mut self, key: &str, value: &str) {
        self.data.insert(key.to_string(), value.to_string());
        self.touch();
    }
}

/// Get current Unix timestamp
fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

/// Context manager for convenient access
pub struct ContextManager {
    context: OmniContext,
    project_dir: PathBuf,
}

impl ContextManager {
    /// Load or create context for a project
    pub fn new(project_dir: &Path) -> Result<Self> {
        let context = OmniContext::load(project_dir)?;
        Ok(Self {
            context,
            project_dir: project_dir.to_path_buf(),
        })
    }

    /// Get read access to context
    pub fn get(&self) -> &OmniContext {
        &self.context
    }

    /// Get mutable access to context
    pub fn get_mut(&mut self) -> &mut OmniContext {
        &mut self.context
    }

    /// Save context
    pub fn save(&self) -> Result<()> {
        self.context.save(&self.project_dir)
    }

    /// Update and save
    pub fn update<F>(&mut self, f: F) -> Result<()>
    where
        F: FnOnce(&mut OmniContext),
    {
        f(&mut self.context);
        self.save()
    }
}

/// Initialize context for a new project
pub fn init_context(project_dir: &Path, name: &str, version: &str) -> Result<OmniContext> {
    let mut ctx = OmniContext::new();
    ctx.project = ProjectMeta {
        name: name.to_string(),
        version: version.to_string(),
        entry_point: "src/main.omni".to_string(),
        src_dir: "src".to_string(),
        out_dir: "dist".to_string(),
    };
    ctx.save(project_dir)?;
    Ok(ctx)
}
