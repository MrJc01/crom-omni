//! AI-Ready Documentation Indexer
//!
//! Creates structured documentation index for AI assistants.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Documentation entry type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DocType {
    Module,
    Function,
    Struct,
    Enum,
    Constant,
    Example,
    Guide,
}

/// A documentation entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocEntry {
    /// Entry name/identifier
    pub name: String,
    /// Entry type
    pub doc_type: DocType,
    /// File path
    pub path: PathBuf,
    /// Line number
    pub line: Option<usize>,
    /// Brief description
    pub summary: String,
    /// Full documentation text
    pub content: String,
    /// Related keywords for search
    pub keywords: Vec<String>,
    /// Related entries
    pub related: Vec<String>,
}

/// Documentation index for a project
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocIndex {
    /// Project name
    pub project: String,
    /// Index version
    pub version: String,
    /// Build timestamp
    pub built_at: u64,
    /// All documentation entries
    pub entries: Vec<DocEntry>,
    /// Keyword to entry index
    pub keyword_index: HashMap<String, Vec<usize>>,
}

impl DocIndex {
    pub fn new(project: &str, version: &str) -> Self {
        Self {
            project: project.to_string(),
            version: version.to_string(),
            built_at: current_timestamp(),
            entries: Vec::new(),
            keyword_index: HashMap::new(),
        }
    }

    /// Add an entry
    pub fn add(&mut self, entry: DocEntry) {
        let idx = self.entries.len();
        
        // Index by keywords
        for keyword in &entry.keywords {
            self.keyword_index
                .entry(keyword.to_lowercase())
                .or_default()
                .push(idx);
        }
        
        // Index by name
        self.keyword_index
            .entry(entry.name.to_lowercase())
            .or_default()
            .push(idx);
        
        self.entries.push(entry);
    }

    /// Search entries by keyword
    pub fn search(&self, query: &str) -> Vec<&DocEntry> {
        let query = query.to_lowercase();
        let mut results = Vec::new();
        let mut seen = std::collections::HashSet::new();

        // Exact keyword match
        if let Some(indices) = self.keyword_index.get(&query) {
            for &idx in indices {
                if seen.insert(idx) {
                    results.push(&self.entries[idx]);
                }
            }
        }

        // Partial match
        for (keyword, indices) in &self.keyword_index {
            if keyword.contains(&query) {
                for &idx in indices {
                    if seen.insert(idx) {
                        results.push(&self.entries[idx]);
                    }
                }
            }
        }

        results
    }

    /// Get entry by name
    pub fn get(&self, name: &str) -> Option<&DocEntry> {
        self.entries.iter().find(|e| e.name == name)
    }

    /// Save index to JSON file
    pub fn save(&self, path: &Path) -> Result<()> {
        let content = serde_json::to_string_pretty(self)?;
        fs::write(path, content)?;
        println!("{} Saved doc index to {}", "✓".green(), path.display());
        Ok(())
    }

    /// Load index from JSON file
    pub fn load(path: &Path) -> Result<Self> {
        let content = fs::read_to_string(path)?;
        serde_json::from_str(&content).context("Failed to parse doc index")
    }

    /// Generate AI-friendly prompt context
    pub fn generate_context(&self, topic: &str, max_entries: usize) -> String {
        let entries = self.search(topic);
        let mut context = String::new();

        context.push_str(&format!("# {} Documentation\n\n", self.project));
        
        for (i, entry) in entries.iter().take(max_entries).enumerate() {
            context.push_str(&format!("## {}. {}\n", i + 1, entry.name));
            context.push_str(&format!("Type: {:?}\n", entry.doc_type));
            context.push_str(&format!("Path: {}\n", entry.path.display()));
            context.push_str(&format!("\n{}\n\n", entry.summary));
            if !entry.content.is_empty() {
                context.push_str(&format!("Details:\n{}\n\n", entry.content));
            }
        }

        context
    }
}

/// Documentation indexer
pub struct DocIndexer {
    project_dir: PathBuf,
}

impl DocIndexer {
    pub fn new(project_dir: &Path) -> Self {
        Self {
            project_dir: project_dir.to_path_buf(),
        }
    }

    /// Index all .omni files in project
    pub fn index(&self, project: &str, version: &str) -> Result<DocIndex> {
        let mut index = DocIndex::new(project, version);
        
        self.index_directory(&self.project_dir, &mut index)?;
        
        println!("{} Indexed {} entries", "✓".green(), index.entries.len());
        Ok(index)
    }

    fn index_directory(&self, dir: &Path, index: &mut DocIndex) -> Result<()> {
        if !dir.is_dir() {
            return Ok(());
        }

        for entry in fs::read_dir(dir)? {
            let path = entry?.path();
            let name = path.file_name().unwrap_or_default().to_string_lossy();
            
            if name.starts_with('.') || name == "node_modules" || name == "dist" {
                continue;
            }

            if path.is_dir() {
                self.index_directory(&path, index)?;
            } else if path.extension().map_or(false, |e| e == "omni") {
                self.index_file(&path, index)?;
            }
        }

        Ok(())
    }

    fn index_file(&self, path: &Path, index: &mut DocIndex) -> Result<()> {
        let content = fs::read_to_string(path)?;
        let relative = path.strip_prefix(&self.project_dir).unwrap_or(path);

        // Extract doc comments
        let mut current_doc = String::new();
        let mut line_num = 0;

        for (i, line) in content.lines().enumerate() {
            line_num = i + 1;
            let trimmed = line.trim();

            // Collect doc comments
            if trimmed.starts_with("///") || trimmed.starts_with("//!") {
                let doc_line = trimmed.trim_start_matches("///").trim_start_matches("//!").trim();
                current_doc.push_str(doc_line);
                current_doc.push('\n');
                continue;
            }

            // Function definition
            if trimmed.starts_with("fn ") || trimmed.starts_with("pub fn ") {
                if let Some(name) = extract_name(trimmed, "fn ") {
                    let entry = DocEntry {
                        name: name.clone(),
                        doc_type: DocType::Function,
                        path: relative.to_path_buf(),
                        line: Some(line_num),
                        summary: current_doc.lines().next().unwrap_or("").to_string(),
                        content: current_doc.clone(),
                        keywords: extract_keywords(&name, &current_doc),
                        related: Vec::new(),
                    };
                    index.add(entry);
                }
                current_doc.clear();
            }

            // Struct definition
            if trimmed.starts_with("struct ") {
                if let Some(name) = extract_name(trimmed, "struct ") {
                    let entry = DocEntry {
                        name: name.clone(),
                        doc_type: DocType::Struct,
                        path: relative.to_path_buf(),
                        line: Some(line_num),
                        summary: current_doc.lines().next().unwrap_or("").to_string(),
                        content: current_doc.clone(),
                        keywords: extract_keywords(&name, &current_doc),
                        related: Vec::new(),
                    };
                    index.add(entry);
                }
                current_doc.clear();
            }

            // Enum definition
            if trimmed.starts_with("enum ") {
                if let Some(name) = extract_name(trimmed, "enum ") {
                    let entry = DocEntry {
                        name: name.clone(),
                        doc_type: DocType::Enum,
                        path: relative.to_path_buf(),
                        line: Some(line_num),
                        summary: current_doc.lines().next().unwrap_or("").to_string(),
                        content: current_doc.clone(),
                        keywords: extract_keywords(&name, &current_doc),
                        related: Vec::new(),
                    };
                    index.add(entry);
                }
                current_doc.clear();
            }
        }

        Ok(())
    }
}

/// Extract name from definition line
fn extract_name(line: &str, prefix: &str) -> Option<String> {
    let after = line.split(prefix).nth(1)?;
    let name = after.split(|c: char| !c.is_alphanumeric() && c != '_')
        .next()?
        .to_string();
    if name.is_empty() { None } else { Some(name) }
}

/// Extract keywords from name and content
fn extract_keywords(name: &str, content: &str) -> Vec<String> {
    let mut keywords = Vec::new();
    
    // Add name parts
    for part in name.split('_') {
        if part.len() > 2 {
            keywords.push(part.to_lowercase());
        }
    }
    
    // Add words from content
    for word in content.split_whitespace() {
        let word = word.trim_matches(|c: char| !c.is_alphanumeric());
        if word.len() > 3 {
            keywords.push(word.to_lowercase());
        }
    }
    
    keywords.sort();
    keywords.dedup();
    keywords
}

/// Get current timestamp
fn current_timestamp() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

/// Generate documentation index command
pub fn generate_doc_index(project_dir: &Path, output: &Path) -> Result<()> {
    println!("{}", "📚 Generating AI-ready documentation index...".cyan().bold());
    
    let indexer = DocIndexer::new(project_dir);
    let index = indexer.index("omni", "0.1.0")?;
    index.save(output)?;
    
    println!("  Entries: {}", index.entries.len());
    println!("  Keywords: {}", index.keyword_index.len());
    
    Ok(())
}
