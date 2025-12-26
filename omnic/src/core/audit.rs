//! Audit Tool - Security and Code Quality Scanner
//!
//! Implements `omni audit` command to scan for security issues,
//! deprecated patterns, and code quality concerns.

use std::path::{Path, PathBuf};
use std::fs;
use colored::*;
use anyhow::Result;

/// Audit severity levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Severity {
    Info,
    Low,
    Medium,
    High,
    Critical,
}

impl Severity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Severity::Info => "INFO",
            Severity::Low => "LOW",
            Severity::Medium => "MEDIUM",
            Severity::High => "HIGH",
            Severity::Critical => "CRITICAL",
        }
    }

    pub fn colored(&self) -> ColoredString {
        match self {
            Severity::Info => "INFO".dimmed(),
            Severity::Low => "LOW".blue(),
            Severity::Medium => "MEDIUM".yellow(),
            Severity::High => "HIGH".red(),
            Severity::Critical => "CRITICAL".red().bold(),
        }
    }
}

/// A single audit finding
#[derive(Debug, Clone)]
pub struct AuditFinding {
    pub severity: Severity,
    pub category: String,
    pub message: String,
    pub file: Option<PathBuf>,
    pub line: Option<usize>,
    pub suggestion: Option<String>,
}

impl AuditFinding {
    pub fn new(severity: Severity, category: &str, message: &str) -> Self {
        Self {
            severity,
            category: category.to_string(),
            message: message.to_string(),
            file: None,
            line: None,
            suggestion: None,
        }
    }

    pub fn with_location(mut self, file: PathBuf, line: usize) -> Self {
        self.file = Some(file);
        self.line = Some(line);
        self
    }

    pub fn with_suggestion(mut self, suggestion: &str) -> Self {
        self.suggestion = Some(suggestion.to_string());
        self
    }

    pub fn display(&self) {
        print!("[{}] ", self.severity.colored());
        print!("{}: ", self.category.cyan());
        println!("{}", self.message);
        
        if let (Some(file), Some(line)) = (&self.file, self.line) {
            println!("    at {}:{}", file.display(), line);
        }
        
        if let Some(suggestion) = &self.suggestion {
            println!("    💡 {}", suggestion.green());
        }
    }
}

/// Audit report containing all findings
#[derive(Debug, Default)]
pub struct AuditReport {
    pub findings: Vec<AuditFinding>,
    pub files_scanned: usize,
    pub duration_ms: u64,
}

impl AuditReport {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add(&mut self, finding: AuditFinding) {
        self.findings.push(finding);
    }

    pub fn count_by_severity(&self, severity: Severity) -> usize {
        self.findings.iter().filter(|f| f.severity == severity).count()
    }

    pub fn has_critical(&self) -> bool {
        self.findings.iter().any(|f| f.severity == Severity::Critical)
    }

    pub fn has_high(&self) -> bool {
        self.findings.iter().any(|f| f.severity >= Severity::High)
    }

    pub fn display_summary(&self) {
        println!("\n{}", "═══ Audit Summary ═══".bold());
        println!("Files scanned: {}", self.files_scanned);
        println!("Total findings: {}", self.findings.len());
        println!();
        println!("  {} Critical", self.count_by_severity(Severity::Critical));
        println!("  {} High", self.count_by_severity(Severity::High));
        println!("  {} Medium", self.count_by_severity(Severity::Medium));
        println!("  {} Low", self.count_by_severity(Severity::Low));
        println!("  {} Info", self.count_by_severity(Severity::Info));
        
        if self.has_critical() {
            println!("\n{}", "⚠ Critical issues found! Address immediately.".red().bold());
        } else if self.has_high() {
            println!("\n{}", "⚠ High severity issues found.".yellow());
        } else {
            println!("\n{}", "✓ No critical issues found.".green());
        }
    }
}

/// Auditor - performs security and quality scans
pub struct Auditor {
    project_dir: PathBuf,
}

impl Auditor {
    pub fn new(project_dir: &Path) -> Self {
        Self {
            project_dir: project_dir.to_path_buf(),
        }
    }

    /// Run full audit
    pub fn audit(&self) -> Result<AuditReport> {
        let mut report = AuditReport::new();
        let start = std::time::Instant::now();

        // Find all .omni files
        let files = self.find_omni_files()?;
        report.files_scanned = files.len();

        for file in &files {
            self.audit_file(file, &mut report)?;
        }

        // Check for missing files
        self.check_project_structure(&mut report);
        
        // Check for security patterns
        self.check_security_patterns(&files, &mut report)?;

        report.duration_ms = start.elapsed().as_millis() as u64;
        Ok(report)
    }

    fn find_omni_files(&self) -> Result<Vec<PathBuf>> {
        let mut files = Vec::new();
        self.find_files_recursive(&self.project_dir, &mut files)?;
        Ok(files)
    }

    fn find_files_recursive(&self, dir: &Path, files: &mut Vec<PathBuf>) -> Result<()> {
        if dir.is_dir() {
            for entry in fs::read_dir(dir)? {
                let path = entry?.path();
                let name = path.file_name().unwrap_or_default().to_string_lossy();
                
                if path.is_dir() && !name.starts_with('.') && name != "node_modules" && name != "dist" {
                    self.find_files_recursive(&path, files)?;
                } else if path.extension().map_or(false, |e| e == "omni") {
                    files.push(path);
                }
            }
        }
        Ok(())
    }

    fn audit_file(&self, file: &Path, report: &mut AuditReport) -> Result<()> {
        let content = fs::read_to_string(file)?;
        
        for (line_num, line) in content.lines().enumerate() {
            let line_num = line_num + 1;
            
            // Check for unsafe patterns
            if line.contains("eval(") {
                report.add(
                    AuditFinding::new(Severity::Critical, "Security", "Use of eval() detected")
                        .with_location(file.to_path_buf(), line_num)
                        .with_suggestion("Remove eval() and use safer alternatives")
                );
            }

            // Check for hardcoded secrets
            if line.contains("password =") && line.contains("\"") {
                report.add(
                    AuditFinding::new(Severity::High, "Security", "Possible hardcoded password")
                        .with_location(file.to_path_buf(), line_num)
                        .with_suggestion("Use environment variables or secret management")
                );
            }

            // Check for TODO/FIXME comments
            if line.contains("TODO") || line.contains("FIXME") {
                report.add(
                    AuditFinding::new(Severity::Info, "Quality", "TODO/FIXME comment found")
                        .with_location(file.to_path_buf(), line_num)
                );
            }

            // Check for deprecated native blocks
            if line.contains("native \"shell\"") {
                report.add(
                    AuditFinding::new(Severity::Medium, "Security", "Shell native block detected")
                        .with_location(file.to_path_buf(), line_num)
                        .with_suggestion("Consider using safer API alternatives")
                );
            }
        }

        Ok(())
    }

    fn check_project_structure(&self, report: &mut AuditReport) {
        // Check for omni.config.json
        if !self.project_dir.join("omni.config.json").exists() {
            report.add(
                AuditFinding::new(Severity::Low, "Structure", "No omni.config.json found")
                    .with_suggestion("Run `omni init` to create project config")
            );
        }

        // Check for omni.lock
        if !self.project_dir.join("omni.lock").exists() {
            report.add(
                AuditFinding::new(Severity::Low, "Integrity", "No omni.lock file found")
                    .with_suggestion("Run `omni lock` to generate checksums")
            );
        }
    }

    fn check_security_patterns(&self, files: &[PathBuf], report: &mut AuditReport) -> Result<()> {
        for file in files {
            let content = fs::read_to_string(file)?;
            
            // Check for common security issues
            if content.contains("http://") && !content.contains("localhost") {
                report.add(
                    AuditFinding::new(Severity::Medium, "Security", "Insecure HTTP URL found")
                        .with_location(file.clone(), 0)
                        .with_suggestion("Use HTTPS for secure connections")
                );
            }
        }
        Ok(())
    }
}

/// Run audit command
pub fn run_audit(project_dir: &Path) -> Result<bool> {
    println!("{}", "🔍 Running Omni Audit...".cyan().bold());
    println!();

    let auditor = Auditor::new(project_dir);
    let report = auditor.audit()?;

    // Display all findings
    for finding in &report.findings {
        finding.display();
        println!();
    }

    report.display_summary();

    Ok(!report.has_critical())
}
