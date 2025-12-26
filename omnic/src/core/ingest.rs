//! Unified Ingest Command - Universal Code Ingestion
//!
//! Single entry point for ingesting PHP, JavaScript, Python, and other legacy code.

use std::path::{Path, PathBuf};
use std::fs;
use anyhow::{Result, Context, bail};
use colored::*;

use crate::core::phpingest;
use crate::core::jsingest;
use crate::core::pyingest;
use crate::core::typeinfer;

/// Supported source languages for ingestion
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SourceLanguage {
    Php,
    JavaScript,
    TypeScript,
    Python,
    Unknown,
}

impl SourceLanguage {
    /// Detect language from file extension
    pub fn from_extension(ext: &str) -> Self {
        match ext.to_lowercase().as_str() {
            "php" => SourceLanguage::Php,
            "js" | "mjs" | "cjs" => SourceLanguage::JavaScript,
            "ts" | "tsx" => SourceLanguage::TypeScript,
            "py" => SourceLanguage::Python,
            _ => SourceLanguage::Unknown,
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            SourceLanguage::Php => "PHP",
            SourceLanguage::JavaScript => "JavaScript",
            SourceLanguage::TypeScript => "TypeScript",
            SourceLanguage::Python => "Python",
            SourceLanguage::Unknown => "Unknown",
        }
    }
}

/// Ingestion options
#[derive(Debug, Clone, Default)]
pub struct IngestOptions {
    /// Add type annotations
    pub infer_types: bool,
    /// Show diff after conversion
    pub show_diff: bool,
    /// Preserve comments
    pub preserve_comments: bool,
    /// Target output path
    pub output: Option<PathBuf>,
    /// Force overwrite
    pub force: bool,
}

/// Ingestion result
#[derive(Debug)]
pub struct IngestResult {
    pub source: PathBuf,
    pub output: PathBuf,
    pub language: SourceLanguage,
    pub original_lines: usize,
    pub converted_lines: usize,
    pub success: bool,
    pub error: Option<String>,
}

/// Universal ingester
pub struct Ingester {
    options: IngestOptions,
}

impl Ingester {
    pub fn new(options: IngestOptions) -> Self {
        Self { options }
    }

    /// Ingest a single file
    pub fn ingest_file(&self, path: &Path) -> Result<IngestResult> {
        let ext = path.extension()
            .and_then(|e| e.to_str())
            .unwrap_or("");
        
        let language = SourceLanguage::from_extension(ext);
        
        if language == SourceLanguage::Unknown {
            bail!("Unsupported file type: {}", ext);
        }

        println!("{} {} file: {}", 
            "📥".cyan(),
            language.name(),
            path.display()
        );

        // Read source
        let source_code = fs::read_to_string(path)
            .with_context(|| format!("Failed to read {}", path.display()))?;
        let original_lines = source_code.lines().count();

        // Convert based on language
        let mut omni_code = match language {
            SourceLanguage::Php => phpingest::php_to_omni(&source_code),
            SourceLanguage::JavaScript | SourceLanguage::TypeScript => {
                jsingest::js_to_omni(&source_code)
            }
            SourceLanguage::Python => pyingest::py_to_omni(&source_code),
            SourceLanguage::Unknown => bail!("Unsupported language"),
        };

        // Optionally add type annotations
        if self.options.infer_types {
            omni_code = typeinfer::annotate_types(&omni_code);
        }

        let converted_lines = omni_code.lines().count();

        // Determine output path
        let output_path = self.options.output.clone()
            .unwrap_or_else(|| path.with_extension("omni"));

        // Check if output exists
        if output_path.exists() && !self.options.force {
            bail!("Output file exists: {}. Use --force to overwrite.", 
                output_path.display());
        }

        // Write output
        fs::write(&output_path, &omni_code)?;

        println!("{} Converted {} -> {}", 
            "✓".green(),
            path.display(),
            output_path.display()
        );
        println!("  {} lines -> {} lines", original_lines, converted_lines);

        Ok(IngestResult {
            source: path.to_path_buf(),
            output: output_path,
            language,
            original_lines,
            converted_lines,
            success: true,
            error: None,
        })
    }

    /// Ingest multiple files
    pub fn ingest_many(&self, paths: &[PathBuf]) -> Vec<IngestResult> {
        paths.iter()
            .map(|p| {
                self.ingest_file(p).unwrap_or_else(|e| IngestResult {
                    source: p.clone(),
                    output: PathBuf::new(),
                    language: SourceLanguage::Unknown,
                    original_lines: 0,
                    converted_lines: 0,
                    success: false,
                    error: Some(e.to_string()),
                })
            })
            .collect()
    }

    /// Ingest a directory recursively
    pub fn ingest_directory(&self, dir: &Path) -> Result<Vec<IngestResult>> {
        let mut results = Vec::new();
        
        for entry in fs::read_dir(dir)? {
            let path = entry?.path();
            
            if path.is_dir() {
                results.extend(self.ingest_directory(&path)?);
            } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if SourceLanguage::from_extension(ext) != SourceLanguage::Unknown {
                    results.push(self.ingest_file(&path).unwrap_or_else(|e| IngestResult {
                        source: path.clone(),
                        output: PathBuf::new(),
                        language: SourceLanguage::Unknown,
                        original_lines: 0,
                        converted_lines: 0,
                        success: false,
                        error: Some(e.to_string()),
                    }));
                }
            }
        }
        
        Ok(results)
    }
}

/// Display ingestion summary
pub fn display_summary(results: &[IngestResult]) {
    let success = results.iter().filter(|r| r.success).count();
    let failed = results.len() - success;
    
    let total_original: usize = results.iter().map(|r| r.original_lines).sum();
    let total_converted: usize = results.iter().map(|r| r.converted_lines).sum();

    println!();
    println!("{}", "═══ Ingestion Summary ═══".bold());
    println!("  {} files converted", format!("{}", success).green());
    if failed > 0 {
        println!("  {} files failed", format!("{}", failed).red());
    }
    println!("  {} total lines processed", total_original);
    println!("  {} total lines generated", total_converted);
    
    // By language
    let mut by_lang = std::collections::HashMap::new();
    for r in results {
        *by_lang.entry(r.language).or_insert(0) += 1;
    }
    
    println!();
    println!("By language:");
    for (lang, count) in by_lang {
        println!("  {}: {}", lang.name(), count);
    }
}

/// Run unified ingest command
pub fn run_ingest(path: &Path, options: IngestOptions) -> Result<()> {
    let ingester = Ingester::new(options);
    
    let results = if path.is_dir() {
        ingester.ingest_directory(path)?
    } else {
        vec![ingester.ingest_file(path)?]
    };
    
    display_summary(&results);
    
    Ok(())
}
