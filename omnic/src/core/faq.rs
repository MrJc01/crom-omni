//! FAQ System - Common Issues and Solutions
//!
//! Searchable FAQ for Omni migration and ingestion problems.

use serde::{Deserialize, Serialize};
use colored::*;

/// FAQ category
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum FaqCategory {
    Ingestion,
    Compilation,
    Runtime,
    Syntax,
    MultiTarget,
    Performance,
    General,
}

impl FaqCategory {
    pub fn emoji(&self) -> &'static str {
        match self {
            FaqCategory::Ingestion => "📥",
            FaqCategory::Compilation => "🔨",
            FaqCategory::Runtime => "▶",
            FaqCategory::Syntax => "📝",
            FaqCategory::MultiTarget => "🎯",
            FaqCategory::Performance => "⚡",
            FaqCategory::General => "❓",
        }
    }
}

/// Single FAQ entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FaqEntry {
    pub id: String,
    pub category: FaqCategory,
    pub question: String,
    pub answer: String,
    pub code_example: Option<String>,
    pub keywords: Vec<String>,
    pub related: Vec<String>,
}

/// FAQ database
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FaqDatabase {
    pub entries: Vec<FaqEntry>,
}

impl FaqDatabase {
    /// Create default FAQ database with common questions
    pub fn default_faqs() -> Self {
        Self {
            entries: vec![
                FaqEntry {
                    id: "ing-001".to_string(),
                    category: FaqCategory::Ingestion,
                    question: "How do I convert PHP code to Omni?".to_string(),
                    answer: "Use `omni ingest --php path/to/file.php` to automatically convert PHP to Omni. The tool preserves logic while adapting syntax.".to_string(),
                    code_example: Some("omni ingest --php old_code.php -o new_code.omni".to_string()),
                    keywords: vec!["php".into(), "convert".into(), "migrate".into(), "ingest".into()],
                    related: vec!["ing-002".into()],
                },
                FaqEntry {
                    id: "ing-002".to_string(),
                    category: FaqCategory::Ingestion,
                    question: "What PHP features are supported?".to_string(),
                    answer: "Omni supports classes, functions, arrays, loops, conditionals, and most standard PHP constructs. Native PHP extensions and some dynamic features may require manual adaptation.".to_string(),
                    code_example: None,
                    keywords: vec!["php".into(), "features".into(), "support".into()],
                    related: vec!["ing-001".into()],
                },
                FaqEntry {
                    id: "syn-001".to_string(),
                    category: FaqCategory::Syntax,
                    question: "Why do I get 'unexpected token' errors?".to_string(),
                    answer: "Omni uses a clean syntax similar to Rust/TypeScript. Common issues: use 'fn' instead of 'function', 'let' for variables, and explicit type annotations for function parameters.".to_string(),
                    code_example: Some("// Wrong\nfunction add(a, b) { return a + b; }\n\n// Correct\nfn add(a: Int, b: Int) -> Int { return a + b; }".to_string()),
                    keywords: vec!["syntax".into(), "error".into(), "token".into(), "function".into()],
                    related: vec!["syn-002".into()],
                },
                FaqEntry {
                    id: "syn-002".to_string(),
                    category: FaqCategory::Syntax,
                    question: "How do I declare types in Omni?".to_string(),
                    answer: "Types are declared after a colon: `let x: Int = 5`. For functions: `fn foo(a: String) -> Bool`. Common types: Int, Float, String, Bool, List<T>, Map<K,V>.".to_string(),
                    code_example: Some("let name: String = \"Omni\";\nlet count: Int = 42;\nlet items: List<String> = [\"a\", \"b\"];".to_string()),
                    keywords: vec!["type".into(), "declare".into(), "int".into(), "string".into()],
                    related: vec!["syn-001".into()],
                },
                FaqEntry {
                    id: "cmp-001".to_string(),
                    category: FaqCategory::Compilation,
                    question: "Build fails with 'undefined function' error".to_string(),
                    answer: "Ensure the function is defined before use, or import it correctly. Check for typos in function names. Standard library functions are available via `import @std/...`.".to_string(),
                    code_example: Some("import @std/io;\n\nfn main() {\n    io.println(\"Hello\");\n}".to_string()),
                    keywords: vec!["undefined".into(), "function".into(), "import".into(), "error".into()],
                    related: vec![],
                },
                FaqEntry {
                    id: "mt-001".to_string(),
                    category: FaqCategory::MultiTarget,
                    question: "How do I compile to different languages?".to_string(),
                    answer: "Use target flags: `omni build file.omni --js` for JavaScript, `--php` for PHP, `--py` for Python. You can also set defaults in omni.config.json.".to_string(),
                    code_example: Some("omni build main.omni --js --php  # Both targets".to_string()),
                    keywords: vec!["target".into(), "javascript".into(), "php".into(), "python".into()],
                    related: vec!["mt-002".into()],
                },
                FaqEntry {
                    id: "mt-002".to_string(),
                    category: FaqCategory::MultiTarget,
                    question: "Output differs between JS and PHP".to_string(),
                    answer: "Use `omni test-all` to run parity tests. Differences often stem from: floating point handling, array indexing, or string operations. Use the std library for consistent behavior.".to_string(),
                    code_example: None,
                    keywords: vec!["parity".into(), "difference".into(), "js".into(), "php".into()],
                    related: vec!["mt-001".into()],
                },
                FaqEntry {
                    id: "run-001".to_string(),
                    category: FaqCategory::Runtime,
                    question: "How do I run an Omni file directly?".to_string(),
                    answer: "Use `omni run file.omni` for JIT-like execution. This compiles to a temp file and runs immediately.".to_string(),
                    code_example: Some("omni run hello.omni  # Compile and run".to_string()),
                    keywords: vec!["run".into(), "execute".into(), "jit".into()],
                    related: vec![],
                },
                FaqEntry {
                    id: "perf-001".to_string(),
                    category: FaqCategory::Performance,
                    question: "How can I optimize my Omni code?".to_string(),
                    answer: "Enable optimizations with `--optimize` flag. Use const for compile-time values. Avoid unnecessary allocations in loops. The compiler performs constant folding and dead code elimination automatically.".to_string(),
                    code_example: Some("omni build main.omni --optimize".to_string()),
                    keywords: vec!["optimize".into(), "performance".into(), "fast".into()],
                    related: vec![],
                },
            ],
        }
    }

    /// Search FAQs by keyword
    pub fn search(&self, query: &str) -> Vec<&FaqEntry> {
        let query_lower = query.to_lowercase();
        let query_words: Vec<&str> = query_lower.split_whitespace().collect();
        
        let mut results: Vec<(&FaqEntry, usize)> = self.entries.iter()
            .filter_map(|entry| {
                let mut score = 0;
                
                // Check question
                if entry.question.to_lowercase().contains(&query_lower) {
                    score += 10;
                }
                
                // Check keywords
                for keyword in &entry.keywords {
                    for word in &query_words {
                        if keyword.contains(*word) {
                            score += 5;
                        }
                    }
                }
                
                // Check answer
                for word in &query_words {
                    if entry.answer.to_lowercase().contains(*word) {
                        score += 1;
                    }
                }
                
                if score > 0 { Some((entry, score)) } else { None }
            })
            .collect();
        
        results.sort_by(|a, b| b.1.cmp(&a.1));
        results.into_iter().map(|(e, _)| e).collect()
    }

    /// Get entry by ID
    pub fn get(&self, id: &str) -> Option<&FaqEntry> {
        self.entries.iter().find(|e| e.id == id)
    }

    /// Get entries by category
    pub fn by_category(&self, category: FaqCategory) -> Vec<&FaqEntry> {
        self.entries.iter().filter(|e| e.category == category).collect()
    }

    /// Display an entry
    pub fn display_entry(entry: &FaqEntry) {
        println!();
        println!("{} {}", entry.category.emoji(), entry.question.cyan().bold());
        println!();
        println!("{}", entry.answer);
        
        if let Some(ref code) = entry.code_example {
            println!();
            println!("{}", "Example:".yellow());
            for line in code.lines() {
                println!("  {}", line);
            }
        }
        
        if !entry.related.is_empty() {
            println!();
            println!("{} Related: {}", "→".dimmed(), entry.related.join(", ").dimmed());
        }
    }
}

/// Run FAQ search
pub fn run_faq(query: Option<&str>) {
    let db = FaqDatabase::default_faqs();
    
    match query {
        Some(q) => {
            let results = db.search(q);
            if results.is_empty() {
                println!("{}", "No FAQs found for that query.".yellow());
            } else {
                println!("{}", format!("Found {} results:\n", results.len()).green());
                for entry in results.iter().take(5) {
                    FaqDatabase::display_entry(entry);
                }
            }
        }
        None => {
            println!("{}", "📚 Omni FAQ".cyan().bold());
            println!();
            println!("Categories:");
            println!("  {} Ingestion - Converting legacy code", FaqCategory::Ingestion.emoji());
            println!("  {} Compilation - Build errors", FaqCategory::Compilation.emoji());
            println!("  {} Runtime - Execution issues", FaqCategory::Runtime.emoji());
            println!("  {} Syntax - Language questions", FaqCategory::Syntax.emoji());
            println!("  {} Multi-Target - Output targets", FaqCategory::MultiTarget.emoji());
            println!();
            println!("Usage: omni faq \"your question\"");
        }
    }
}
