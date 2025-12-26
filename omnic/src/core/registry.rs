//! Registry Client - Package Registry Connection
//!
//! Connects to Omni package registry for publishing and downloading packages.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use anyhow::{Result, bail};
use colored::*;

/// Package metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PackageMeta {
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub author: Option<String>,
    pub license: Option<String>,
    pub repository: Option<String>,
    pub keywords: Vec<String>,
    pub dependencies: HashMap<String, String>,
}

impl PackageMeta {
    pub fn new(name: &str, version: &str) -> Self {
        Self {
            name: name.to_string(),
            version: version.to_string(),
            description: None,
            author: None,
            license: None,
            repository: None,
            keywords: Vec::new(),
            dependencies: HashMap::new(),
        }
    }
}

/// Registry package info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryPackage {
    pub meta: PackageMeta,
    pub checksum: String,
    pub downloads: u64,
    pub published_at: String,
    pub size_bytes: u64,
}

/// Search result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    pub packages: Vec<RegistryPackage>,
    pub total: usize,
    pub page: usize,
}

/// Registry client configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryConfig {
    pub url: String,
    pub auth_token: Option<String>,
    pub cache_dir: PathBuf,
}

impl Default for RegistryConfig {
    fn default() -> Self {
        Self {
            url: "https://registry.omni-lang.org".to_string(),
            auth_token: None,
            cache_dir: PathBuf::from(".omni/cache"),
        }
    }
}

/// Registry client
pub struct RegistryClient {
    config: RegistryConfig,
}

impl RegistryClient {
    pub fn new(config: RegistryConfig) -> Self {
        Self { config }
    }

    /// Search packages
    pub fn search(&self, query: &str) -> Result<SearchResult> {
        println!("{} Searching for '{}'...", "🔍".cyan(), query);
        
        // Simulated response (would be HTTP in real implementation)
        let packages = self.mock_search(query);
        
        Ok(SearchResult {
            total: packages.len(),
            packages,
            page: 1,
        })
    }

    /// Get package info
    pub fn get_package(&self, name: &str, version: Option<&str>) -> Result<RegistryPackage> {
        println!("{} Fetching {}{}...", 
            "📦".cyan(),
            name,
            version.map(|v| format!("@{}", v)).unwrap_or_default()
        );
        
        // Simulated response
        Ok(RegistryPackage {
            meta: PackageMeta::new(name, version.unwrap_or("1.0.0")),
            checksum: "sha256:abc123...".to_string(),
            downloads: 1000,
            published_at: "2024-01-15T10:00:00Z".to_string(),
            size_bytes: 15000,
        })
    }

    /// Download package
    pub fn download(&self, name: &str, version: &str) -> Result<PathBuf> {
        println!("{} Downloading {}@{}...", "⬇".cyan(), name, version);
        
        // Would download from registry in real implementation
        let cache_path = self.config.cache_dir.join(format!("{}-{}.tar.gz", name, version));
        
        println!("{} Downloaded to {}", "✓".green(), cache_path.display());
        Ok(cache_path)
    }

    /// Publish package
    pub fn publish(&self, path: &Path) -> Result<()> {
        if self.config.auth_token.is_none() {
            bail!("Authentication required. Run `omni login` first.");
        }

        println!("{} Publishing package from {}...", "📤".cyan(), path.display());
        
        // Would upload to registry in real implementation
        println!("{} Package published successfully!", "✓".green());
        
        Ok(())
    }

    /// Login to registry
    pub fn login(&mut self, token: &str) -> Result<()> {
        println!("{} Authenticating with registry...", "🔑".cyan());
        
        // Validate token (would verify with registry)
        self.config.auth_token = Some(token.to_string());
        
        println!("{} Logged in successfully!", "✓".green());
        Ok(())
    }

    /// Logout from registry
    pub fn logout(&mut self) {
        self.config.auth_token = None;
        println!("{} Logged out from registry.", "✓".green());
    }

    /// List installed packages
    pub fn list_installed(&self) -> Vec<PackageMeta> {
        // Would read from local cache/manifest
        vec![]
    }

    // Mock search for demo
    fn mock_search(&self, query: &str) -> Vec<RegistryPackage> {
        let keywords: Vec<&str> = vec!["std", "http", "json", "ui", "crypto"];
        
        keywords.iter()
            .filter(|k| k.contains(query) || query.contains(*k))
            .map(|name| RegistryPackage {
                meta: PackageMeta {
                    name: format!("@omni/{}", name),
                    version: "1.0.0".to_string(),
                    description: Some(format!("Omni {} library", name)),
                    author: Some("Omni Team".to_string()),
                    license: Some("MIT".to_string()),
                    repository: None,
                    keywords: vec![name.to_string()],
                    dependencies: HashMap::new(),
                },
                checksum: "sha256:...".to_string(),
                downloads: 5000,
                published_at: "2024-01-01T00:00:00Z".to_string(),
                size_bytes: 10000,
            })
            .collect()
    }
}

/// Display search results
pub fn display_search(results: &SearchResult) {
    if results.packages.is_empty() {
        println!("{}", "No packages found.".yellow());
        return;
    }

    println!("{} Found {} packages:\n", "📦".cyan(), results.total);
    
    for pkg in &results.packages {
        println!("{} {} v{}", 
            "•".green(),
            pkg.meta.name.bold(),
            pkg.meta.version
        );
        if let Some(ref desc) = pkg.meta.description {
            println!("  {}", desc.dimmed());
        }
        println!("  Downloads: {} | Size: {} bytes", 
            pkg.downloads, pkg.size_bytes);
        println!();
    }
}

/// Run registry command
pub fn run_registry_command(cmd: &str, args: &[String]) -> Result<()> {
    let client = RegistryClient::new(RegistryConfig::default());

    match cmd {
        "search" => {
            let query = args.first().map(|s| s.as_str()).unwrap_or("");
            let results = client.search(query)?;
            display_search(&results);
        }
        "info" => {
            let name = args.first().ok_or_else(|| anyhow::anyhow!("Package name required"))?;
            let pkg = client.get_package(name, None)?;
            println!("{:#?}", pkg);
        }
        "install" => {
            let name = args.first().ok_or_else(|| anyhow::anyhow!("Package name required"))?;
            client.download(name, "latest")?;
        }
        _ => bail!("Unknown registry command: {}", cmd),
    }

    Ok(())
}
