use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct OmniConfig {
    pub project: ProjectConfig,
    pub targets: HashMap<String, TargetConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectConfig {
    pub name: String,
    pub version: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TargetConfig {
    pub format: String, // "js", "python", "c", etc.
    pub output: String, // "dist/api"
    // Opcional: source specific for this target, defaults to main if project level?
    pub source: Option<String>,
    // Flag para empacotamento (Phase 6)
    pub bundle: Option<bool>,
}
