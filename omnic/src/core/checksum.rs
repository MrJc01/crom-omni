//! Checksum Validation - Package Integrity
//!
//! SHA-256 checksum generation and validation for omni.lock file.

use std::collections::HashMap;
use std::fs;
use std::io::Read;
use std::path::{Path, PathBuf};
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};

/// Lock file name
const LOCK_FILE: &str = "omni.lock";

/// Entry in the lock file
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LockEntry {
    /// Package name or file path
    pub name: String,
    /// Version if applicable
    pub version: Option<String>,
    /// SHA-256 checksum
    pub checksum: String,
    /// Source (file, registry, git)
    pub source: String,
}

/// The omni.lock file structure
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct LockFile {
    /// Lock file version
    pub version: u32,
    /// All locked entries
    pub entries: HashMap<String, LockEntry>,
}

impl LockFile {
    /// Create a new empty lock file
    pub fn new() -> Self {
        Self {
            version: 1,
            entries: HashMap::new(),
        }
    }

    /// Load lock file from project directory
    pub fn load(project_dir: &Path) -> Result<Self> {
        let path = project_dir.join(LOCK_FILE);
        if path.exists() {
            let content = fs::read_to_string(&path)
                .with_context(|| format!("Failed to read {}", path.display()))?;
            serde_json::from_str(&content)
                .with_context(|| format!("Failed to parse {}", path.display()))
        } else {
            Ok(Self::new())
        }
    }

    /// Save lock file to project directory
    pub fn save(&self, project_dir: &Path) -> Result<()> {
        let path = project_dir.join(LOCK_FILE);
        let content = serde_json::to_string_pretty(self)?;
        fs::write(&path, content)?;
        Ok(())
    }

    /// Add or update an entry
    pub fn add_entry(&mut self, name: &str, entry: LockEntry) {
        self.entries.insert(name.to_string(), entry);
    }

    /// Get an entry by name
    pub fn get_entry(&self, name: &str) -> Option<&LockEntry> {
        self.entries.get(name)
    }

    /// Verify all entries have matching checksums
    pub fn verify_all(&self, project_dir: &Path) -> Result<Vec<String>> {
        let mut failures = Vec::new();
        
        for (name, entry) in &self.entries {
            if entry.source == "file" {
                let path = project_dir.join(name);
                if path.exists() {
                    let actual = compute_file_checksum(&path)?;
                    if actual != entry.checksum {
                        failures.push(format!("{}: expected {} got {}", name, entry.checksum, actual));
                    }
                } else {
                    failures.push(format!("{}: file not found", name));
                }
            }
        }
        
        Ok(failures)
    }
}

/// Compute SHA-256 checksum of a file
pub fn compute_file_checksum(path: &Path) -> Result<String> {
    let mut file = fs::File::open(path)
        .with_context(|| format!("Failed to open file: {}", path.display()))?;
    
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 8192];
    
    loop {
        let bytes_read = file.read(&mut buffer)?;
        if bytes_read == 0 {
            break;
        }
        hasher.update(&buffer[..bytes_read]);
    }
    
    Ok(format!("{:x}", hasher.finalize()))
}

/// Compute SHA-256 checksum of a string
pub fn compute_string_checksum(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    format!("{:x}", hasher.finalize())
}

/// Lock all source files in a project
pub fn lock_project_files(project_dir: &Path) -> Result<LockFile> {
    let mut lock = LockFile::load(project_dir)?;
    
    // Find all .omni files
    let omni_files = find_omni_files(project_dir)?;
    
    for file in omni_files {
        let relative = file.strip_prefix(project_dir)
            .unwrap_or(&file)
            .to_string_lossy()
            .to_string();
        
        let checksum = compute_file_checksum(&file)?;
        
        lock.add_entry(&relative, LockEntry {
            name: relative.clone(),
            version: None,
            checksum,
            source: "file".to_string(),
        });
    }
    
    lock.save(project_dir)?;
    Ok(lock)
}

/// Find all .omni files in a directory recursively
fn find_omni_files(dir: &Path) -> Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                // Skip hidden directories and node_modules
                let name = path.file_name().unwrap_or_default().to_string_lossy();
                if !name.starts_with('.') && name != "node_modules" && name != "dist" {
                    files.extend(find_omni_files(&path)?);
                }
            } else if path.extension().map_or(false, |e| e == "omni") {
                files.push(path);
            }
        }
    }
    
    Ok(files)
}

/// Verify project integrity
pub fn verify_project_integrity(project_dir: &Path) -> Result<bool> {
    let lock = LockFile::load(project_dir)?;
    let failures = lock.verify_all(project_dir)?;
    
    if failures.is_empty() {
        println!("✓ All checksums verified");
        Ok(true)
    } else {
        println!("✗ Checksum verification failed:");
        for failure in &failures {
            println!("  - {}", failure);
        }
        Ok(false)
    }
}
