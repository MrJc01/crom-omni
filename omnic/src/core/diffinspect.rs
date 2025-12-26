//! Diff Inspector - Code Comparison for Ingestion
//!
//! Compares original legacy code with converted Omni code.

use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Type of diff change
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum DiffType {
    Added,
    Removed,
    Modified,
    Unchanged,
}

/// A single diff hunk
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiffHunk {
    pub old_start: usize,
    pub old_count: usize,
    pub new_start: usize,
    pub new_count: usize,
    pub changes: Vec<DiffLine>,
}

/// A single line in a diff
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiffLine {
    pub diff_type: DiffType,
    pub old_line_num: Option<usize>,
    pub new_line_num: Option<usize>,
    pub content: String,
}

/// Complete diff between two files
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Diff {
    pub old_file: String,
    pub new_file: String,
    pub hunks: Vec<DiffHunk>,
    pub stats: DiffStats,
}

/// Diff statistics
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct DiffStats {
    pub added: usize,
    pub removed: usize,
    pub modified: usize,
    pub unchanged: usize,
}

impl Diff {
    /// Generate diff between two strings
    pub fn from_strings(old: &str, new: &str, old_name: &str, new_name: &str) -> Self {
        let old_lines: Vec<&str> = old.lines().collect();
        let new_lines: Vec<&str> = new.lines().collect();
        
        let mut hunks = Vec::new();
        let mut stats = DiffStats::default();
        let mut changes = Vec::new();
        
        let mut old_idx = 0;
        let mut new_idx = 0;
        
        // Simple line-by-line diff
        while old_idx < old_lines.len() || new_idx < new_lines.len() {
            let old_line = old_lines.get(old_idx);
            let new_line = new_lines.get(new_idx);
            
            match (old_line, new_line) {
                (Some(o), Some(n)) if o == n => {
                    // Unchanged
                    changes.push(DiffLine {
                        diff_type: DiffType::Unchanged,
                        old_line_num: Some(old_idx + 1),
                        new_line_num: Some(new_idx + 1),
                        content: o.to_string(),
                    });
                    stats.unchanged += 1;
                    old_idx += 1;
                    new_idx += 1;
                }
                (Some(o), Some(_)) => {
                    // Modified (simplified: treat as remove + add)
                    changes.push(DiffLine {
                        diff_type: DiffType::Removed,
                        old_line_num: Some(old_idx + 1),
                        new_line_num: None,
                        content: o.to_string(),
                    });
                    stats.removed += 1;
                    old_idx += 1;
                }
                (Some(o), None) => {
                    // Removed
                    changes.push(DiffLine {
                        diff_type: DiffType::Removed,
                        old_line_num: Some(old_idx + 1),
                        new_line_num: None,
                        content: o.to_string(),
                    });
                    stats.removed += 1;
                    old_idx += 1;
                }
                (None, Some(n)) => {
                    // Added
                    changes.push(DiffLine {
                        diff_type: DiffType::Added,
                        old_line_num: None,
                        new_line_num: Some(new_idx + 1),
                        content: n.to_string(),
                    });
                    stats.added += 1;
                    new_idx += 1;
                }
                (None, None) => break,
            }
        }

        // Create a single hunk for now
        if !changes.is_empty() {
            hunks.push(DiffHunk {
                old_start: 1,
                old_count: old_lines.len(),
                new_start: 1,
                new_count: new_lines.len(),
                changes,
            });
        }

        Self {
            old_file: old_name.to_string(),
            new_file: new_name.to_string(),
            hunks,
            stats,
        }
    }

    /// Generate diff between two files
    pub fn from_files(old_path: &Path, new_path: &Path) -> Result<Self> {
        let old_content = fs::read_to_string(old_path)
            .with_context(|| format!("Failed to read {}", old_path.display()))?;
        let new_content = fs::read_to_string(new_path)
            .with_context(|| format!("Failed to read {}", new_path.display()))?;
        
        Ok(Self::from_strings(
            &old_content,
            &new_content,
            &old_path.display().to_string(),
            &new_path.display().to_string(),
        ))
    }

    /// Display diff in terminal
    pub fn display(&self) {
        println!("{}", format!("--- {}", self.old_file).red());
        println!("{}", format!("+++ {}", self.new_file).green());
        println!();

        for hunk in &self.hunks {
            println!("{}", format!("@@ -{},{} +{},{} @@",
                hunk.old_start, hunk.old_count,
                hunk.new_start, hunk.new_count
            ).cyan());

            for line in &hunk.changes {
                match line.diff_type {
                    DiffType::Added => {
                        println!("{}", format!("+{}", line.content).green());
                    }
                    DiffType::Removed => {
                        println!("{}", format!("-{}", line.content).red());
                    }
                    DiffType::Unchanged => {
                        println!(" {}", line.content);
                    }
                    DiffType::Modified => {
                        println!("{}", format!("~{}", line.content).yellow());
                    }
                }
            }
        }

        println!();
        self.display_stats();
    }

    /// Display statistics
    pub fn display_stats(&self) {
        println!("{}", "Stats:".bold());
        println!("  {} added", format!("+{}", self.stats.added).green());
        println!("  {} removed", format!("-{}", self.stats.removed).red());
        println!("  {} unchanged", self.stats.unchanged);
    }

    /// Generate unified diff format
    pub fn to_unified(&self) -> String {
        let mut output = String::new();
        
        output.push_str(&format!("--- {}\n", self.old_file));
        output.push_str(&format!("+++ {}\n", self.new_file));

        for hunk in &self.hunks {
            output.push_str(&format!("@@ -{},{} +{},{} @@\n",
                hunk.old_start, hunk.old_count,
                hunk.new_start, hunk.new_count
            ));

            for line in &hunk.changes {
                match line.diff_type {
                    DiffType::Added => output.push_str(&format!("+{}\n", line.content)),
                    DiffType::Removed => output.push_str(&format!("-{}\n", line.content)),
                    DiffType::Unchanged => output.push_str(&format!(" {}\n", line.content)),
                    DiffType::Modified => output.push_str(&format!("~{}\n", line.content)),
                }
            }
        }

        output
    }
}

/// Inspect ingestion conversion
pub struct IngestInspector;

impl IngestInspector {
    /// Compare original and converted code
    pub fn inspect(original: &Path, converted: &Path) -> Result<Diff> {
        println!("{}", "🔍 Inspecting ingestion conversion...".cyan().bold());
        
        let diff = Diff::from_files(original, converted)?;
        diff.display();
        
        Ok(diff)
    }

    /// Show conversion summary
    pub fn summary(original_lines: usize, converted_lines: usize, diff: &Diff) {
        println!("{}", "═══ Ingestion Summary ═══".bold());
        println!("  Original: {} lines", original_lines);
        println!("  Converted: {} lines", converted_lines);
        println!("  Added: {}", diff.stats.added);
        println!("  Removed: {}", diff.stats.removed);
        
        let similarity = if original_lines > 0 {
            (diff.stats.unchanged as f32 / original_lines as f32) * 100.0
        } else {
            0.0
        };
        
        println!("  Similarity: {:.1}%", similarity);
    }
}

/// Run diff inspection command
pub fn run_diff(old_path: &Path, new_path: &Path) -> Result<()> {
    let diff = Diff::from_files(old_path, new_path)?;
    diff.display();
    Ok(())
}
