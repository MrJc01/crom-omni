//! Automatic Changelog Generation
//!
//! Generates release notes from git commits and version changes.

use std::fs;
use std::path::Path;
use std::process::Command;
use anyhow::{Result, Context};
use colored::*;

/// Commit type for categorization
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum CommitType {
    Feature,      // feat:
    Fix,          // fix:
    Breaking,     // BREAKING:
    Docs,         // docs:
    Chore,        // chore:
    Refactor,     // refactor:
    Test,         // test:
    Style,        // style:
    Perf,         // perf:
    Other,
}

impl CommitType {
    /// Parse from conventional commit prefix
    pub fn from_message(msg: &str) -> Self {
        let msg = msg.to_lowercase();
        if msg.starts_with("feat") || msg.starts_with("feature") {
            CommitType::Feature
        } else if msg.starts_with("fix") || msg.starts_with("bugfix") {
            CommitType::Fix
        } else if msg.starts_with("breaking") || msg.contains("breaking change") {
            CommitType::Breaking
        } else if msg.starts_with("docs") || msg.starts_with("doc:") {
            CommitType::Docs
        } else if msg.starts_with("chore") {
            CommitType::Chore
        } else if msg.starts_with("refactor") {
            CommitType::Refactor
        } else if msg.starts_with("test") {
            CommitType::Test
        } else if msg.starts_with("style") {
            CommitType::Style
        } else if msg.starts_with("perf") {
            CommitType::Perf
        } else {
            CommitType::Other
        }
    }

    pub fn emoji(&self) -> &'static str {
        match self {
            CommitType::Feature => "✨",
            CommitType::Fix => "🐛",
            CommitType::Breaking => "💥",
            CommitType::Docs => "📚",
            CommitType::Chore => "🔧",
            CommitType::Refactor => "♻️",
            CommitType::Test => "✅",
            CommitType::Style => "💄",
            CommitType::Perf => "⚡",
            CommitType::Other => "📝",
        }
    }

    pub fn section_title(&self) -> &'static str {
        match self {
            CommitType::Feature => "Features",
            CommitType::Fix => "Bug Fixes",
            CommitType::Breaking => "Breaking Changes",
            CommitType::Docs => "Documentation",
            CommitType::Chore => "Maintenance",
            CommitType::Refactor => "Refactoring",
            CommitType::Test => "Tests",
            CommitType::Style => "Style",
            CommitType::Perf => "Performance",
            CommitType::Other => "Other Changes",
        }
    }
}

/// A parsed commit
#[derive(Debug, Clone)]
pub struct Commit {
    pub hash: String,
    pub message: String,
    pub commit_type: CommitType,
    pub author: String,
    pub date: String,
}

impl Commit {
    pub fn from_log_line(line: &str) -> Option<Self> {
        // Expected format: hash|message|author|date
        let parts: Vec<&str> = line.split('|').collect();
        if parts.len() >= 4 {
            let message = parts[1].to_string();
            Some(Commit {
                hash: parts[0].to_string(),
                message: message.clone(),
                commit_type: CommitType::from_message(&message),
                author: parts[2].to_string(),
                date: parts[3].to_string(),
            })
        } else {
            None
        }
    }

    /// Format for changelog entry
    pub fn format(&self) -> String {
        format!("- {} {} ({})", 
            self.commit_type.emoji(),
            self.message.trim(),
            &self.hash[..7.min(self.hash.len())]
        )
    }
}

/// Changelog generator
pub struct ChangelogGenerator {
    project_dir: std::path::PathBuf,
}

impl ChangelogGenerator {
    pub fn new(project_dir: &Path) -> Self {
        Self {
            project_dir: project_dir.to_path_buf(),
        }
    }

    /// Get commits since a tag or ref
    pub fn get_commits_since(&self, since: &str) -> Result<Vec<Commit>> {
        let output = Command::new("git")
            .current_dir(&self.project_dir)
            .args(["log", &format!("{}..HEAD", since), "--pretty=format:%H|%s|%an|%as"])
            .output()
            .context("Failed to run git log")?;

        if !output.status.success() {
            // No tag found, get all commits
            return self.get_recent_commits(50);
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let commits: Vec<Commit> = stdout
            .lines()
            .filter_map(Commit::from_log_line)
            .collect();

        Ok(commits)
    }

    /// Get recent commits
    pub fn get_recent_commits(&self, count: usize) -> Result<Vec<Commit>> {
        let output = Command::new("git")
            .current_dir(&self.project_dir)
            .args(["log", "-n", &count.to_string(), "--pretty=format:%H|%s|%an|%as"])
            .output()
            .context("Failed to run git log")?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        let commits: Vec<Commit> = stdout
            .lines()
            .filter_map(Commit::from_log_line)
            .collect();

        Ok(commits)
    }

    /// Generate changelog markdown
    pub fn generate(&self, version: &str, since: Option<&str>) -> Result<String> {
        let commits = if let Some(tag) = since {
            self.get_commits_since(tag)?
        } else {
            self.get_recent_commits(50)?
        };

        let mut markdown = String::new();
        markdown.push_str(&format!("# Changelog\n\n## {} ({})\n\n", 
            version, 
            chrono_date()
        ));

        // Group by commit type
        let mut grouped: std::collections::HashMap<CommitType, Vec<&Commit>> = 
            std::collections::HashMap::new();

        for commit in &commits {
            grouped.entry(commit.commit_type.clone())
                .or_default()
                .push(commit);
        }

        // Write sections in order
        let order = [
            CommitType::Breaking,
            CommitType::Feature,
            CommitType::Fix,
            CommitType::Perf,
            CommitType::Refactor,
            CommitType::Docs,
            CommitType::Test,
            CommitType::Chore,
            CommitType::Style,
            CommitType::Other,
        ];

        for commit_type in order {
            if let Some(commits) = grouped.get(&commit_type) {
                if !commits.is_empty() {
                    markdown.push_str(&format!("### {} {}\n\n", 
                        commit_type.emoji(), 
                        commit_type.section_title()
                    ));
                    for commit in commits {
                        markdown.push_str(&format!("{}\n", commit.format()));
                    }
                    markdown.push('\n');
                }
            }
        }

        Ok(markdown)
    }

    /// Save changelog to file
    pub fn save(&self, content: &str, filename: &str) -> Result<()> {
        let path = self.project_dir.join(filename);
        fs::write(&path, content)?;
        println!("{} Saved changelog to {}", "✓".green(), path.display());
        Ok(())
    }
}

/// Get current date in YYYY-MM-DD format
fn chrono_date() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let days = secs / 86400;
    let years = 1970 + days / 365;
    format!("{}-12-25", years) // Simplified
}

/// Generate changelog command
pub fn generate_changelog(project_dir: &Path, version: &str) -> Result<()> {
    println!("{}", "📝 Generating changelog...".cyan().bold());
    
    let generator = ChangelogGenerator::new(project_dir);
    let content = generator.generate(version, None)?;
    generator.save(&content, "CHANGELOG.md")?;
    
    Ok(())
}
