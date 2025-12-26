//! QA Test Suite Runner - Parity Testing System
//!
//! Tests that Omni programs produce identical output across all target languages.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::fs;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};
use colored::*;

/// Test result status
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TestStatus {
    Pass,
    Fail,
    Skip,
    Error,
}

/// Single test case
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestCase {
    /// Test name
    pub name: String,
    /// Source file path
    pub source: PathBuf,
    /// Expected output
    pub expected: Option<String>,
    /// Input to provide
    pub input: Option<String>,
    /// Targets to test
    pub targets: Vec<String>,
}

/// Result of running a test
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestResult {
    pub name: String,
    pub status: TestStatus,
    pub target: String,
    pub actual: Option<String>,
    pub expected: Option<String>,
    pub error: Option<String>,
    pub duration_ms: u64,
}

/// Complete test suite
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestSuite {
    pub name: String,
    pub tests: Vec<TestCase>,
}

impl TestSuite {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            tests: Vec::new(),
        }
    }

    pub fn add(&mut self, test: TestCase) {
        self.tests.push(test);
    }

    /// Load test suite from directory
    pub fn from_directory(dir: &Path) -> Result<Self> {
        let name = dir.file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();
        
        let mut suite = Self::new(&name);

        // Find all .omni files in test directory
        for entry in fs::read_dir(dir)? {
            let path = entry?.path();
            if path.extension().map_or(false, |e| e == "omni") {
                let test_name = path.file_stem()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();
                
                // Check for expected output file
                let expected_path = path.with_extension("expected");
                let expected = if expected_path.exists() {
                    Some(fs::read_to_string(&expected_path)?)
                } else {
                    None
                };

                suite.add(TestCase {
                    name: test_name,
                    source: path,
                    expected,
                    input: None,
                    targets: vec!["js".to_string(), "php".to_string()],
                });
            }
        }

        Ok(suite)
    }
}

/// Test runner for parity testing
pub struct TestRunner {
    omni_path: PathBuf,
    results: Vec<TestResult>,
}

impl TestRunner {
    pub fn new() -> Self {
        Self {
            omni_path: PathBuf::from("omni"),
            results: Vec::new(),
        }
    }

    pub fn with_omni_path(mut self, path: PathBuf) -> Self {
        self.omni_path = path;
        self
    }

    /// Run all tests in a suite
    pub fn run_suite(&mut self, suite: &TestSuite) -> Vec<TestResult> {
        println!("{}", format!("🧪 Running test suite: {}", suite.name).cyan().bold());
        println!();

        for test in &suite.tests {
            for target in &test.targets {
                let result = self.run_test(test, target);
                self.print_result(&result);
                self.results.push(result);
            }
        }

        self.results.clone()
    }

    /// Run a single test
    fn run_test(&self, test: &TestCase, target: &str) -> TestResult {
        let start = std::time::Instant::now();
        
        // Compile
        let compile_result = Command::new(&self.omni_path)
            .args(["build", &test.source.to_string_lossy(), &format!("--{}", target)])
            .output();

        match compile_result {
            Err(e) => TestResult {
                name: test.name.clone(),
                status: TestStatus::Error,
                target: target.to_string(),
                actual: None,
                expected: test.expected.clone(),
                error: Some(format!("Compile error: {}", e)),
                duration_ms: start.elapsed().as_millis() as u64,
            },
            Ok(output) if !output.status.success() => {
                TestResult {
                    name: test.name.clone(),
                    status: TestStatus::Error,
                    target: target.to_string(),
                    actual: None,
                    expected: test.expected.clone(),
                    error: Some(String::from_utf8_lossy(&output.stderr).to_string()),
                    duration_ms: start.elapsed().as_millis() as u64,
                }
            }
            Ok(_) => {
                // Run the compiled program
                self.run_compiled(test, target, start)
            }
        }
    }

    fn run_compiled(&self, test: &TestCase, target: &str, start: std::time::Instant) -> TestResult {
        let output_path = test.source.with_extension(target_extension(target));
        
        let run_result = match target {
            "js" => Command::new("node").arg(&output_path).output(),
            "php" => Command::new("php").arg(&output_path).output(),
            "py" => Command::new("python").arg(&output_path).output(),
            _ => return TestResult {
                name: test.name.clone(),
                status: TestStatus::Skip,
                target: target.to_string(),
                actual: None,
                expected: test.expected.clone(),
                error: Some(format!("Unknown target: {}", target)),
                duration_ms: start.elapsed().as_millis() as u64,
            },
        };

        match run_result {
            Err(e) => TestResult {
                name: test.name.clone(),
                status: TestStatus::Error,
                target: target.to_string(),
                actual: None,
                expected: test.expected.clone(),
                error: Some(format!("Run error: {}", e)),
                duration_ms: start.elapsed().as_millis() as u64,
            },
            Ok(output) => {
                let actual = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let status = if let Some(ref expected) = test.expected {
                    if actual.trim() == expected.trim() {
                        TestStatus::Pass
                    } else {
                        TestStatus::Fail
                    }
                } else {
                    // No expected output, just check it runs
                    if output.status.success() {
                        TestStatus::Pass
                    } else {
                        TestStatus::Fail
                    }
                };

                TestResult {
                    name: test.name.clone(),
                    status,
                    target: target.to_string(),
                    actual: Some(actual),
                    expected: test.expected.clone(),
                    error: None,
                    duration_ms: start.elapsed().as_millis() as u64,
                }
            }
        }
    }

    fn print_result(&self, result: &TestResult) {
        let icon = match result.status {
            TestStatus::Pass => "✓".green(),
            TestStatus::Fail => "✗".red(),
            TestStatus::Skip => "○".yellow(),
            TestStatus::Error => "!".red().bold(),
        };
        
        println!("  {} {} [{}] ({}ms)", 
            icon, 
            result.name, 
            result.target,
            result.duration_ms
        );

        if result.status == TestStatus::Fail {
            if let (Some(expected), Some(actual)) = (&result.expected, &result.actual) {
                println!("    Expected: {}", expected.dimmed());
                println!("    Actual:   {}", actual.red());
            }
        }

        if let Some(error) = &result.error {
            println!("    Error: {}", error.red());
        }
    }

    /// Print summary
    pub fn summary(&self) {
        let pass = self.results.iter().filter(|r| r.status == TestStatus::Pass).count();
        let fail = self.results.iter().filter(|r| r.status == TestStatus::Fail).count();
        let error = self.results.iter().filter(|r| r.status == TestStatus::Error).count();
        let skip = self.results.iter().filter(|r| r.status == TestStatus::Skip).count();
        let total = self.results.len();

        println!();
        println!("{}", "═══ Test Summary ═══".bold());
        println!("  {} passed", format!("{}", pass).green());
        println!("  {} failed", format!("{}", fail).red());
        println!("  {} errors", format!("{}", error).red());
        println!("  {} skipped", format!("{}", skip).yellow());
        println!("  {} total", total);

        if fail == 0 && error == 0 {
            println!("{}", "\n✓ All tests passed!".green().bold());
        } else {
            println!("{}", format!("\n✗ {} tests failed", fail + error).red().bold());
        }
    }

    /// Check parity across targets
    pub fn check_parity(&self) -> bool {
        let mut by_test: HashMap<String, Vec<&TestResult>> = HashMap::new();
        
        for result in &self.results {
            by_test.entry(result.name.clone()).or_default().push(result);
        }

        let mut all_parity = true;
        for (name, results) in &by_test {
            let outputs: Vec<_> = results.iter()
                .filter_map(|r| r.actual.as_ref())
                .collect();
            
            let first = outputs.first();
            let parity = outputs.iter().all(|o| Some(o) == first);
            
            if !parity {
                println!("{} Parity failure for: {}", "⚠".yellow(), name);
                all_parity = false;
            }
        }

        all_parity
    }
}

impl Default for TestRunner {
    fn default() -> Self {
        Self::new()
    }
}

fn target_extension(target: &str) -> &'static str {
    match target {
        "js" => "js",
        "php" => "php",
        "py" => "py",
        _ => "out",
    }
}

/// Run test-all command
pub fn run_test_all(test_dir: &Path) -> Result<bool> {
    let suite = TestSuite::from_directory(test_dir)?;
    let mut runner = TestRunner::new();
    runner.run_suite(&suite);
    runner.summary();
    let parity = runner.check_parity();
    Ok(parity)
}
