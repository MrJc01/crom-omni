//! Python Ingestion - Convert Python to Omni
//!
//! Parses Python 3 code and converts it to Omni syntax.

use std::fs;
use std::path::Path;
use anyhow::{Result, Context};
use colored::*;

/// Python token types
#[derive(Debug, Clone, PartialEq)]
pub enum PyToken {
    // Literals
    String(String),
    Number(String),
    Boolean(bool),
    None,
    
    // Keywords
    Def,
    Class,
    Return,
    If,
    Elif,
    Else,
    While,
    For,
    In,
    Import,
    From,
    As,
    Try,
    Except,
    Finally,
    With,
    Lambda,
    Async,
    Await,
    
    // Operators
    Assign,
    Plus, Minus, Star, Slash, DoubleStar,
    Eq, Ne, Lt, Gt, Le, Ge,
    And, Or, Not,
    Colon,
    Arrow,  // ->
    
    // Punctuation
    LParen, RParen,
    LBracket, RBracket,
    LBrace, RBrace,
    Comma, Dot,
    
    // Structure
    Indent(usize),
    Dedent,
    Newline,
    
    // Other
    Identifier(String),
    Comment(String),
    Decorator(String),
    Eof,
}

/// Python Lexer
pub struct PyLexer {
    input: Vec<char>,
    pos: usize,
    indent_stack: Vec<usize>,
}

impl PyLexer {
    pub fn new(input: &str) -> Self {
        Self {
            input: input.chars().collect(),
            pos: 0,
            indent_stack: vec![0],
        }
    }

    fn peek(&self) -> Option<char> {
        self.input.get(self.pos).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let ch = self.peek();
        self.pos += 1;
        ch
    }

    fn skip_spaces(&mut self) {
        while self.peek() == Some(' ') || self.peek() == Some('\t') {
            self.advance();
        }
    }

    pub fn tokenize(&mut self) -> Vec<PyToken> {
        let mut tokens = Vec::new();
        
        while let Some(ch) = self.peek() {
            // Handle newlines and indentation
            if ch == '\n' {
                tokens.push(PyToken::Newline);
                self.advance();
                // Count indentation
                let mut indent = 0;
                while self.peek() == Some(' ') {
                    indent += 1;
                    self.advance();
                }
                if self.peek() != Some('\n') && self.peek().is_some() {
                    tokens.push(PyToken::Indent(indent));
                }
                continue;
            }

            // Skip spaces (not at line start)
            if ch == ' ' || ch == '\t' {
                self.skip_spaces();
                continue;
            }

            // Comments
            if ch == '#' {
                let comment = self.read_line_comment();
                tokens.push(PyToken::Comment(comment));
                continue;
            }

            // Decorators
            if ch == '@' {
                self.advance();
                let name = self.read_identifier();
                tokens.push(PyToken::Decorator(name));
                continue;
            }

            // Strings
            if ch == '"' || ch == '\'' {
                // Check for triple quotes
                let s = self.read_string(ch);
                tokens.push(PyToken::String(s));
                continue;
            }

            // Numbers
            if ch.is_ascii_digit() {
                let num = self.read_number();
                tokens.push(PyToken::Number(num));
                continue;
            }

            // Identifiers and keywords
            if ch.is_alphabetic() || ch == '_' {
                let ident = self.read_identifier();
                let token = match ident.as_str() {
                    "def" => PyToken::Def,
                    "class" => PyToken::Class,
                    "return" => PyToken::Return,
                    "if" => PyToken::If,
                    "elif" => PyToken::Elif,
                    "else" => PyToken::Else,
                    "while" => PyToken::While,
                    "for" => PyToken::For,
                    "in" => PyToken::In,
                    "import" => PyToken::Import,
                    "from" => PyToken::From,
                    "as" => PyToken::As,
                    "try" => PyToken::Try,
                    "except" => PyToken::Except,
                    "finally" => PyToken::Finally,
                    "with" => PyToken::With,
                    "lambda" => PyToken::Lambda,
                    "async" => PyToken::Async,
                    "await" => PyToken::Await,
                    "and" => PyToken::And,
                    "or" => PyToken::Or,
                    "not" => PyToken::Not,
                    "True" => PyToken::Boolean(true),
                    "False" => PyToken::Boolean(false),
                    "None" => PyToken::None,
                    _ => PyToken::Identifier(ident),
                };
                tokens.push(token);
                continue;
            }

            // Operators and punctuation
            let token = match ch {
                '(' => { self.advance(); PyToken::LParen }
                ')' => { self.advance(); PyToken::RParen }
                '[' => { self.advance(); PyToken::LBracket }
                ']' => { self.advance(); PyToken::RBracket }
                '{' => { self.advance(); PyToken::LBrace }
                '}' => { self.advance(); PyToken::RBrace }
                ',' => { self.advance(); PyToken::Comma }
                '.' => { self.advance(); PyToken::Dot }
                '+' => { self.advance(); PyToken::Plus }
                '-' => {
                    self.advance();
                    if self.peek() == Some('>') {
                        self.advance();
                        PyToken::Arrow
                    } else {
                        PyToken::Minus
                    }
                }
                '/' => { self.advance(); PyToken::Slash }
                '*' => {
                    self.advance();
                    if self.peek() == Some('*') {
                        self.advance();
                        PyToken::DoubleStar
                    } else {
                        PyToken::Star
                    }
                }
                ':' => { self.advance(); PyToken::Colon }
                '=' => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        PyToken::Eq
                    } else {
                        PyToken::Assign
                    }
                }
                '<' => { self.advance(); PyToken::Lt }
                '>' => { self.advance(); PyToken::Gt }
                '!' => {
                    self.advance();
                    if self.peek() == Some('=') {
                        self.advance();
                        PyToken::Ne
                    } else {
                        continue;
                    }
                }
                _ => { self.advance(); continue; }
            };
            tokens.push(token);
        }

        tokens.push(PyToken::Eof);
        tokens
    }

    fn read_string(&mut self, quote: char) -> String {
        self.advance();
        let mut s = String::new();
        while let Some(ch) = self.peek() {
            if ch == quote {
                self.advance();
                break;
            }
            if ch == '\\' {
                self.advance();
                if let Some(escaped) = self.advance() {
                    s.push(escaped);
                }
            } else {
                s.push(ch);
                self.advance();
            }
        }
        s
    }

    fn read_number(&mut self) -> String {
        let mut num = String::new();
        while self.peek().map_or(false, |c| c.is_ascii_digit() || c == '.') {
            num.push(self.advance().unwrap());
        }
        num
    }

    fn read_identifier(&mut self) -> String {
        let mut ident = String::new();
        while self.peek().map_or(false, |c| c.is_alphanumeric() || c == '_') {
            ident.push(self.advance().unwrap());
        }
        ident
    }

    fn read_line_comment(&mut self) -> String {
        let mut comment = String::new();
        while self.peek().map_or(false, |c| c != '\n') {
            comment.push(self.advance().unwrap());
        }
        comment
    }
}

/// Convert Python to Omni
pub fn py_to_omni(py_code: &str) -> String {
    let mut lexer = PyLexer::new(py_code);
    let tokens = lexer.tokenize();
    
    let mut output = String::new();
    let mut i = 0;

    while i < tokens.len() {
        match &tokens[i] {
            PyToken::Def => {
                i += 1;
                if let PyToken::Identifier(name) = &tokens[i] {
                    output.push_str(&format!("fn {}(", name));
                    i += 1;
                    if tokens[i] == PyToken::LParen {
                        i += 1;
                        let mut params = Vec::new();
                        while i < tokens.len() && tokens[i] != PyToken::RParen {
                            if let PyToken::Identifier(param) = &tokens[i] {
                                if param != "self" {
                                    params.push(format!("{}: Any", param));
                                }
                            }
                            i += 1;
                        }
                        output.push_str(&params.join(", "));
                        output.push_str(") {\n");
                        i += 1;
                    }
                }
            }
            PyToken::Return => {
                i += 1;
                output.push_str("    return ");
                while i < tokens.len() && tokens[i] != PyToken::Newline {
                    match &tokens[i] {
                        PyToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                        PyToken::Number(n) => output.push_str(n),
                        PyToken::Identifier(id) => output.push_str(id),
                        PyToken::Plus => output.push_str(" + "),
                        _ => {}
                    }
                    i += 1;
                }
                output.push_str(";\n");
            }
            PyToken::Identifier(name) if i + 1 < tokens.len() && tokens[i + 1] == PyToken::Assign => {
                output.push_str(&format!("    let {} = ", name));
                i += 2; // skip identifier and =
                while i < tokens.len() && tokens[i] != PyToken::Newline {
                    match &tokens[i] {
                        PyToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                        PyToken::Number(n) => output.push_str(n),
                        PyToken::Identifier(id) => output.push_str(id),
                        _ => {}
                    }
                    i += 1;
                }
                output.push_str(";\n");
            }
            PyToken::Indent(0) if output.ends_with("{\n") => {
                // End of function
                output.push_str("}\n\n");
                i += 1;
            }
            _ => i += 1,
        }
    }

    output
}

/// Ingest Python file
pub fn ingest_py_file(input: &Path, output: &Path) -> Result<()> {
    println!("{}", "📥 Ingesting Python file...".cyan().bold());
    
    let py_code = fs::read_to_string(input)
        .with_context(|| format!("Failed to read {}", input.display()))?;
    
    let omni_code = py_to_omni(&py_code);
    
    fs::write(output, &omni_code)?;
    
    println!("{} Converted {} -> {}", "✓".green(), 
        input.display(), output.display());
    
    Ok(())
}
