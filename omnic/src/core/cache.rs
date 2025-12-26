//! Offline Mode - Library Cache System
//!
//! Complete caching of libraries for offline compilation.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Default cache directory name
const CACHE_DIR: &str = ".omni_cache";

/// Cache entry metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheEntry {
    /// Package name
    pub name: String,
    /// Package version
    pub version: String,
    /// Source URL or path
    pub source: String,
    /// SHA-256 checksum
    pub checksum: String,
    /// Cached timestamp
    pub cached_at: u64,
    /// File size in bytes
    pub size: u64,
}

/// Cache index containing all cached packages
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CacheIndex {
    /// Schema version
    pub version: u32,
    /// All cached entries
    pub entries: HashMap<String, CacheEntry>,
}

impl CacheIndex {
    pub fn new() -> Self {
        Self {
            version: 1,
            entries: HashMap::new(),
        }
    }

    /// Load index from cache directory
    pub fn load(cache_dir: &Path) -> Result<Self> {
        let index_path = cache_dir.join("index.json");
        if index_path.exists() {
            let content = fs::read_to_string(&index_path)?;
            serde_json::from_str(&content).context("Failed to parse cache index")
        } else {
            Ok(Self::new())
        }
    }

    /// Save index to cache directory
    pub fn save(&self, cache_dir: &Path) -> Result<()> {
        let index_path = cache_dir.join("index.json");
        let content = serde_json::to_string_pretty(self)?;
        fs::write(index_path, content)?;
        Ok(())
    }

    /// Check if a package is cached
    pub fn has(&self, name: &str, version: &str) -> bool {
        let key = format!("{}@{}", name, version);
        self.entries.contains_key(&key)
    }

    /// Get a cached entry
    pub fn get(&self, name: &str, version: &str) -> Option<&CacheEntry> {
        let key = format!("{}@{}", name, version);
        self.entries.get(&key)
    }

    /// Add an entry to cache
    pub fn add(&mut self, entry: CacheEntry) {
        let key = format!("{}@{}", entry.name, entry.version);
        self.entries.insert(key, entry);
    }

    /// Remove an entry from cache
    pub fn remove(&mut self, name: &str, version: &str) {
        let key = format!("{}@{}", name, version);
        self.entries.remove(&key);
    }

    /// Get total cache size
    pub fn total_size(&self) -> u64 {
        self.entries.values().map(|e| e.size).sum()
    }
}

/// Cache manager for offline mode
pub struct CacheManager {
    cache_dir: PathBuf,
    index: CacheIndex,
}

impl CacheManager {
    /// Create cache manager with default location
    pub fn new() -> Result<Self> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .unwrap_or_else(|_| ".".to_string());
        let cache_dir = PathBuf::from(home).join(CACHE_DIR);
        Self::with_dir(&cache_dir)
    }

    /// Create cache manager with specific directory
    pub fn with_dir(cache_dir: &Path) -> Result<Self> {
        if !cache_dir.exists() {
            fs::create_dir_all(cache_dir)?;
        }
        let index = CacheIndex::load(cache_dir)?;
        Ok(Self {
            cache_dir: cache_dir.to_path_buf(),
            index,
        })
    }

    /// Get cache directory path
    pub fn cache_dir(&self) -> &Path {
        &self.cache_dir
    }

    /// Check if a package is cached
    pub fn is_cached(&self, name: &str, version: &str) -> bool {
        if self.index.has(name, version) {
            // Verify file exists
            let path = self.package_path(name, version);
            path.exists()
        } else {
            false
        }
    }

    /// Get path to cached package
    pub fn package_path(&self, name: &str, version: &str) -> PathBuf {
        self.cache_dir.join(format!("{}@{}", name, version))
    }

    /// Cache a package from bytes
    pub fn cache_package(&mut self, name: &str, version: &str, source: &str, data: &[u8]) -> Result<()> {
        let path = self.package_path(name, version);
        fs::write(&path, data)?;

        // Compute checksum
        use sha2::{Sha256, Digest};
        let mut hasher = Sha256::new();
        hasher.update(data);
        let checksum = format!("{:x}", hasher.finalize());

        let entry = CacheEntry {
            name: name.to_string(),
            version: version.to_string(),
            source: source.to_string(),
            checksum,
            cached_at: current_timestamp(),
            size: data.len() as u64,
        };

        self.index.add(entry);
        self.index.save(&self.cache_dir)?;

        Ok(())
    }

    /// Get cached package data
    pub fn get_package(&self, name: &str, version: &str) -> Result<Option<Vec<u8>>> {
        if self.is_cached(name, version) {
            let path = self.package_path(name, version);
            let data = fs::read(&path)?;
            Ok(Some(data))
        } else {
            Ok(None)
        }
    }

    /// Remove a package from cache
    pub fn remove_package(&mut self, name: &str, version: &str) -> Result<()> {
        let path = self.package_path(name, version);
        if path.exists() {
            fs::remove_file(&path)?;
        }
        self.index.remove(name, version);
        self.index.save(&self.cache_dir)?;
        Ok(())
    }

    /// Clear all cached packages
    pub fn clear(&mut self) -> Result<usize> {
        let count = self.index.entries.len();
        for entry in self.index.entries.values() {
            let path = self.package_path(&entry.name, &entry.version);
            if path.exists() {
                let _ = fs::remove_file(&path);
            }
        }
        self.index.entries.clear();
        self.index.save(&self.cache_dir)?;
        Ok(count)
    }

    /// List all cached packages
    pub fn list(&self) -> Vec<&CacheEntry> {
        self.index.entries.values().collect()
    }

    /// Get cache statistics
    pub fn stats(&self) -> CacheStats {
        CacheStats {
            total_packages: self.index.entries.len(),
            total_size: self.index.total_size(),
            cache_dir: self.cache_dir.clone(),
        }
    }
}

impl Default for CacheManager {
    fn default() -> Self {
        Self::new().unwrap_or_else(|_| Self {
            cache_dir: PathBuf::from(".omni_cache"),
            index: CacheIndex::new(),
        })
    }
}

/// Cache statistics
pub struct CacheStats {
    pub total_packages: usize,
    pub total_size: u64,
    pub cache_dir: PathBuf,
}

impl CacheStats {
    pub fn display(&self) {
        println!("{}", "📦 Cache Statistics".cyan().bold());
        println!("  Location: {}", self.cache_dir.display());
        println!("  Packages: {}", self.total_packages);
        println!("  Size: {}", format_size(self.total_size));
    }
}

/// Format bytes as human readable
fn format_size(bytes: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;

    if bytes >= GB {
        format!("{:.2} GB", bytes as f64 / GB as f64)
    } else if bytes >= MB {
        format!("{:.2} MB", bytes as f64 / MB as f64)
    } else if bytes >= KB {
        format!("{:.2} KB", bytes as f64 / KB as f64)
    } else {
        format!("{} bytes", bytes)
    }
}

/// Get current timestamp
fn current_timestamp() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

/// Run cache command
pub fn run_cache_command(args: &[String]) -> Result<()> {
    let mut manager = CacheManager::new()?;

    if args.is_empty() {
        manager.stats().display();
        return Ok(());
    }

    match args[0].as_str() {
        "list" | "ls" => {
            println!("{}", "Cached packages:".cyan());
            for entry in manager.list() {
                println!("  {}@{} ({})", entry.name, entry.version, format_size(entry.size));
            }
        }
        "clear" => {
            let count = manager.clear()?;
            println!("{} Cleared {} packages from cache", "✓".green(), count);
        }
        "stats" => {
            manager.stats().display();
        }
        _ => {
            println!("Usage: omni cache [list|clear|stats]");
        }
    }

    Ok(())
}
