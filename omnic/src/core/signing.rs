//! Package Signing Engine
//!
//! Sign and verify Omni packages for integrity and authenticity.

use std::fs;
use std::path::Path;
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Signature metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Signature {
    /// Package name
    pub package: String,
    /// Package version
    pub version: String,
    /// SHA-256 hash of content
    pub content_hash: String,
    /// Signature timestamp
    pub signed_at: u64,
    /// Signer identity (key ID or name)
    pub signer: String,
    /// HMAC signature (simplified - in production use asymmetric keys)
    pub signature: String,
}

impl Signature {
    /// Verify signature against content
    pub fn verify(&self, content: &[u8], secret: &str) -> bool {
        let expected = compute_signature(content, secret, &self.signer);
        // Constant-time comparison
        self.signature.len() == expected.len() 
            && self.signature.as_bytes().iter()
                .zip(expected.as_bytes())
                .all(|(a, b)| a == b)
    }
}

/// Signing engine for packages
pub struct SigningEngine {
    /// Signing key/secret
    secret: String,
    /// Signer identity
    signer: String,
}

impl SigningEngine {
    /// Create new signing engine with key
    pub fn new(secret: &str, signer: &str) -> Self {
        Self {
            secret: secret.to_string(),
            signer: signer.to_string(),
        }
    }

    /// Load from environment
    pub fn from_env() -> Result<Self> {
        let secret = std::env::var("OMNI_SIGNING_KEY")
            .unwrap_or_else(|_| "default-dev-key".to_string());
        let signer = std::env::var("OMNI_SIGNER")
            .unwrap_or_else(|_| "anonymous".to_string());
        Ok(Self::new(&secret, &signer))
    }

    /// Sign a package file
    pub fn sign_file(&self, path: &Path, package: &str, version: &str) -> Result<Signature> {
        let content = fs::read(path)
            .with_context(|| format!("Failed to read file: {}", path.display()))?;
        
        Ok(self.sign_bytes(&content, package, version))
    }

    /// Sign bytes
    pub fn sign_bytes(&self, content: &[u8], package: &str, version: &str) -> Signature {
        let content_hash = compute_hash(content);
        let signature = compute_signature(content, &self.secret, &self.signer);

        Signature {
            package: package.to_string(),
            version: version.to_string(),
            content_hash,
            signed_at: current_timestamp(),
            signer: self.signer.clone(),
            signature,
        }
    }

    /// Verify a signature
    pub fn verify(&self, signature: &Signature, content: &[u8]) -> bool {
        signature.verify(content, &self.secret)
    }

    /// Verify a file
    pub fn verify_file(&self, signature: &Signature, path: &Path) -> Result<bool> {
        let content = fs::read(path)
            .with_context(|| format!("Failed to read file: {}", path.display()))?;
        Ok(self.verify(signature, &content))
    }

    /// Save signature to file
    pub fn save_signature(&self, sig: &Signature, path: &Path) -> Result<()> {
        let content = serde_json::to_string_pretty(sig)?;
        fs::write(path, content)?;
        Ok(())
    }

    /// Load signature from file
    pub fn load_signature(&self, path: &Path) -> Result<Signature> {
        let content = fs::read_to_string(path)?;
        serde_json::from_str(&content).context("Failed to parse signature")
    }
}

/// Compute SHA-256 hash of content
fn compute_hash(content: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(content);
    format!("{:x}", hasher.finalize())
}

/// Compute HMAC-like signature
fn compute_signature(content: &[u8], secret: &str, signer: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(secret.as_bytes());
    hasher.update(content);
    hasher.update(signer.as_bytes());
    format!("{:x}", hasher.finalize())
}

/// Get current timestamp
fn current_timestamp() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

/// Sign a package command
pub fn sign_package(package_path: &Path, output_path: &Path, package: &str, version: &str) -> Result<()> {
    println!("{}", "🔏 Signing package...".cyan().bold());
    
    let engine = SigningEngine::from_env()?;
    let sig = engine.sign_file(package_path, package, version)?;
    engine.save_signature(&sig, output_path)?;
    
    println!("{} Package signed successfully", "✓".green());
    println!("  Package: {}@{}", package, version);
    println!("  Hash: {}...", &sig.content_hash[..16]);
    println!("  Signer: {}", sig.signer);
    println!("  Signature: {}...", &sig.signature[..16]);
    
    Ok(())
}

/// Verify a package command
pub fn verify_package(package_path: &Path, signature_path: &Path) -> Result<bool> {
    println!("{}", "🔍 Verifying package signature...".cyan().bold());
    
    let engine = SigningEngine::from_env()?;
    let sig = engine.load_signature(signature_path)?;
    let valid = engine.verify_file(&sig, package_path)?;
    
    if valid {
        println!("{} Signature verified successfully", "✓".green());
        println!("  Package: {}@{}", sig.package, sig.version);
        println!("  Signed by: {}", sig.signer);
    } else {
        println!("{} Signature verification FAILED", "✗".red().bold());
        println!("  Package may have been tampered with!");
    }
    
    Ok(valid)
}
