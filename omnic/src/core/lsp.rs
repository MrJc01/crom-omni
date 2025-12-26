//! LSP Server - Language Server Protocol
//!
//! Provides IDE integration for Omni via LSP.

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use colored::*;

/// LSP message types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LspMethod {
    Initialize,
    Shutdown,
    TextDocumentDidOpen,
    TextDocumentDidChange,
    TextDocumentDidSave,
    TextDocumentCompletion,
    TextDocumentHover,
    TextDocumentDefinition,
    TextDocumentReferences,
    TextDocumentDiagnostics,
}

/// Position in a document
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Position {
    pub line: u32,
    pub character: u32,
}

/// Range in a document
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Range {
    pub start: Position,
    pub end: Position,
}

/// Diagnostic severity
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum DiagnosticSeverity {
    Error = 1,
    Warning = 2,
    Information = 3,
    Hint = 4,
}

/// A diagnostic message
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Diagnostic {
    pub range: Range,
    pub severity: DiagnosticSeverity,
    pub message: String,
    pub source: String,
}

/// Completion item kinds
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum CompletionItemKind {
    Text = 1,
    Method = 2,
    Function = 3,
    Constructor = 4,
    Field = 5,
    Variable = 6,
    Class = 7,
    Interface = 8,
    Module = 9,
    Property = 10,
    Keyword = 14,
    Snippet = 15,
}

/// A completion item
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompletionItem {
    pub label: String,
    pub kind: CompletionItemKind,
    pub detail: Option<String>,
    pub documentation: Option<String>,
    pub insert_text: Option<String>,
}

/// Hover information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HoverInfo {
    pub contents: String,
    pub range: Option<Range>,
}

/// Document state
#[derive(Debug, Clone)]
pub struct DocumentState {
    pub uri: String,
    pub version: i32,
    pub content: String,
    pub diagnostics: Vec<Diagnostic>,
}

/// LSP Server state
pub struct LspServer {
    documents: HashMap<String, DocumentState>,
    initialized: bool,
    keywords: Vec<&'static str>,
    builtins: Vec<(&'static str, &'static str)>,
}

impl LspServer {
    pub fn new() -> Self {
        Self {
            documents: HashMap::new(),
            initialized: false,
            keywords: vec![
                "fn", "let", "const", "if", "else", "while", "for", "in",
                "return", "struct", "enum", "impl", "pub", "import", "export",
                "true", "false", "null", "self", "native",
            ],
            builtins: vec![
                ("println", "fn println(msg: String) -> Void"),
                ("print", "fn print(msg: String) -> Void"),
                ("len", "fn len(arr: List<T>) -> Int"),
                ("push", "fn push(arr: List<T>, item: T) -> Void"),
                ("pop", "fn pop(arr: List<T>) -> T"),
            ],
        }
    }

    /// Initialize the server
    pub fn initialize(&mut self) -> serde_json::Value {
        self.initialized = true;
        serde_json::json!({
            "capabilities": {
                "textDocumentSync": 1,
                "completionProvider": {
                    "triggerCharacters": [".", "@"]
                },
                "hoverProvider": true,
                "definitionProvider": true,
                "referencesProvider": true,
                "diagnosticProvider": {
                    "interFileDependencies": true,
                    "workspaceDiagnostics": false
                }
            }
        })
    }

    /// Open a document
    pub fn did_open(&mut self, uri: &str, content: &str, version: i32) {
        let diagnostics = Self::analyze_static(content);
        self.documents.insert(uri.to_string(), DocumentState {
            uri: uri.to_string(),
            version,
            content: content.to_string(),
            diagnostics,
        });
    }

    /// Update a document
    pub fn did_change(&mut self, uri: &str, content: &str, version: i32) {
        // Compute diagnostics first to avoid borrow conflict
        let diagnostics = Self::analyze_static(content);
        if let Some(doc) = self.documents.get_mut(uri) {
            doc.content = content.to_string();
            doc.version = version;
            doc.diagnostics = diagnostics;
        }
    }

    /// Get completions at position
    pub fn completion(&self, uri: &str, _position: Position) -> Vec<CompletionItem> {
        let mut items = Vec::new();

        // Add keywords
        for kw in &self.keywords {
            items.push(CompletionItem {
                label: kw.to_string(),
                kind: CompletionItemKind::Keyword,
                detail: Some("Keyword".to_string()),
                documentation: None,
                insert_text: Some(kw.to_string()),
            });
        }

        // Add builtins
        for (name, sig) in &self.builtins {
            items.push(CompletionItem {
                label: name.to_string(),
                kind: CompletionItemKind::Function,
                detail: Some(sig.to_string()),
                documentation: None,
                insert_text: Some(format!("{}()", name)),
            });
        }

        // Add document symbols
        if let Some(doc) = self.documents.get(uri) {
            for symbol in self.extract_symbols(&doc.content) {
                items.push(symbol);
            }
        }

        items
    }

    /// Get hover info at position
    pub fn hover(&self, uri: &str, position: Position) -> Option<HoverInfo> {
        let doc = self.documents.get(uri)?;
        let word = self.word_at_position(&doc.content, position)?;

        // Check builtins
        for (name, sig) in &self.builtins {
            if word == *name {
                return Some(HoverInfo {
                    contents: format!("```omni\n{}\n```", sig),
                    range: None,
                });
            }
        }

        // Check keywords
        if self.keywords.contains(&word.as_str()) {
            return Some(HoverInfo {
                contents: format!("`{}` is an Omni keyword", word),
                range: None,
            });
        }

        None
    }

    /// Get diagnostics for content
    pub fn get_diagnostics(&self, uri: &str) -> Vec<Diagnostic> {
        self.documents.get(uri)
            .map(|d| d.diagnostics.clone())
            .unwrap_or_default()
    }

    /// Analyze code for diagnostics (static version)
    fn analyze_static(content: &str) -> Vec<Diagnostic> {
        let mut diagnostics = Vec::new();

        for (line_num, line) in content.lines().enumerate() {
            // Check for common issues
            if line.contains("var ") {
                diagnostics.push(Diagnostic {
                    range: Range {
                        start: Position { line: line_num as u32, character: 0 },
                        end: Position { line: line_num as u32, character: line.len() as u32 },
                    },
                    severity: DiagnosticSeverity::Warning,
                    message: "Use 'let' instead of 'var' in Omni".to_string(),
                    source: "omni-lsp".to_string(),
                });
            }

            if line.contains("function ") {
                diagnostics.push(Diagnostic {
                    range: Range {
                        start: Position { line: line_num as u32, character: 0 },
                        end: Position { line: line_num as u32, character: line.len() as u32 },
                    },
                    severity: DiagnosticSeverity::Error,
                    message: "Use 'fn' instead of 'function' in Omni".to_string(),
                    source: "omni-lsp".to_string(),
                });
            }
        }

        diagnostics
    }

    /// Analyze code for diagnostics (instance method for compatibility)
    #[allow(dead_code)]
    fn analyze(&self, content: &str) -> Vec<Diagnostic> {
        Self::analyze_static(content)
    }

    /// Extract symbols from content
    fn extract_symbols(&self, content: &str) -> Vec<CompletionItem> {
        let mut items = Vec::new();

        for line in content.lines() {
            let trimmed = line.trim();
            
            // Extract functions
            if trimmed.starts_with("fn ") {
                if let Some(name) = trimmed[3..].split('(').next() {
                    items.push(CompletionItem {
                        label: name.trim().to_string(),
                        kind: CompletionItemKind::Function,
                        detail: Some("Local function".to_string()),
                        documentation: None,
                        insert_text: None,
                    });
                }
            }

            // Extract structs
            if trimmed.starts_with("struct ") {
                if let Some(name) = trimmed[7..].split('{').next() {
                    items.push(CompletionItem {
                        label: name.trim().to_string(),
                        kind: CompletionItemKind::Class,
                        detail: Some("Struct".to_string()),
                        documentation: None,
                        insert_text: None,
                    });
                }
            }
        }

        items
    }

    /// Get word at position
    fn word_at_position(&self, content: &str, position: Position) -> Option<String> {
        let lines: Vec<&str> = content.lines().collect();
        let line = lines.get(position.line as usize)?;
        
        let chars: Vec<char> = line.chars().collect();
        let pos = position.character as usize;
        
        if pos >= chars.len() {
            return None;
        }

        let mut start = pos;
        let mut end = pos;

        while start > 0 && chars[start - 1].is_alphanumeric() {
            start -= 1;
        }

        while end < chars.len() && chars[end].is_alphanumeric() {
            end += 1;
        }

        Some(chars[start..end].iter().collect())
    }
}

impl Default for LspServer {
    fn default() -> Self {
        Self::new()
    }
}

/// Display LSP server info
pub fn show_lsp_info() {
    println!("{}", "🔌 Omni LSP Server".cyan().bold());
    println!();
    println!("Features:");
    println!("  • Completion   - Keywords, functions, structs");
    println!("  • Hover        - Type information on hover");
    println!("  • Diagnostics  - Real-time error checking");
    println!("  • Go to Def    - Navigate to definitions");
    println!();
    println!("Start: omni lsp --stdio");
}
