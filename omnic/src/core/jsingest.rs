//! JavaScript/TypeScript Ingestion - Convert JS/TS to Omni
//!
//! Parses JavaScript/TypeScript code and converts it to Omni syntax.

use std::fs;
use std::path::Path;
use anyhow::{Result, Context};
use colored::*;

/// JS/TS token types
#[derive(Debug, Clone, PartialEq)]
pub enum JsToken {
    // Literals
    String(String),
    Number(String),
    Boolean(bool),
    Null,
    Undefined,
    
    // Keywords
    Function,
    Const,
    Let,
    Var,
    Return,
    If,
    Else,
    While,
    For,
    Class,
    Export,
    Import,
    From,
    Async,
    Await,
    Arrow,      // =>
    
    // Operators
    Assign,
    Plus, Minus, Star, Slash,
    Eq, Ne, Lt, Gt, Le, Ge,
    And, Or, Not,
    
    // Punctuation
    LParen, RParen,
    LBrace, RBrace,
    LBracket, RBracket,
    Semicolon, Comma, Colon, Dot,
    
    // Other
    Identifier(String),
    TypeAnnotation(String),
    Comment(String),
    Eof,
}

/// JavaScript Lexer
pub struct JsLexer {
    input: Vec<char>,
    pos: usize,
}

impl JsLexer {
    pub fn new(input: &str) -> Self {
        Self {
            input: input.chars().collect(),
            pos: 0,
        }
    }

    fn peek(&self) -> Option<char> {
        self.input.get(self.pos).copied()
    }

    fn peek_next(&self) -> Option<char> {
        self.input.get(self.pos + 1).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let ch = self.peek();
        self.pos += 1;
        ch
    }

    fn skip_whitespace(&mut self) {
        while self.peek().map_or(false, |c| c.is_whitespace()) {
            self.advance();
        }
    }

    pub fn tokenize(&mut self) -> Vec<JsToken> {
        let mut tokens = Vec::new();
        
        while let Some(ch) = self.peek() {
            if ch.is_whitespace() {
                self.skip_whitespace();
                continue;
            }

            // Comments
            if ch == '/' {
                if self.peek_next() == Some('/') {
                    let comment = self.read_line_comment();
                    tokens.push(JsToken::Comment(comment));
                    continue;
                }
                if self.peek_next() == Some('*') {
                    let comment = self.read_block_comment();
                    tokens.push(JsToken::Comment(comment));
                    continue;
                }
            }

            // Strings
            if ch == '"' || ch == '\'' || ch == '`' {
                let s = self.read_string(ch);
                tokens.push(JsToken::String(s));
                continue;
            }

            // Numbers
            if ch.is_ascii_digit() {
                let num = self.read_number();
                tokens.push(JsToken::Number(num));
                continue;
            }

            // Identifiers and keywords
            if ch.is_alphabetic() || ch == '_' || ch == '$' {
                let ident = self.read_identifier();
                let token = match ident.as_str() {
                    "function" => JsToken::Function,
                    "const" => JsToken::Const,
                    "let" => JsToken::Let,
                    "var" => JsToken::Var,
                    "return" => JsToken::Return,
                    "if" => JsToken::If,
                    "else" => JsToken::Else,
                    "while" => JsToken::While,
                    "for" => JsToken::For,
                    "class" => JsToken::Class,
                    "export" => JsToken::Export,
                    "import" => JsToken::Import,
                    "from" => JsToken::From,
                    "async" => JsToken::Async,
                    "await" => JsToken::Await,
                    "true" => JsToken::Boolean(true),
                    "false" => JsToken::Boolean(false),
                    "null" => JsToken::Null,
                    "undefined" => JsToken::Undefined,
                    _ => JsToken::Identifier(ident),
                };
                tokens.push(token);
                continue;
            }

            // Operators and punctuation
            let token = match ch {
                '(' => { self.advance(); JsToken::LParen }
                ')' => { self.advance(); JsToken::RParen }
                '{' => { self.advance(); JsToken::LBrace }
                '}' => { self.advance(); JsToken::RBrace }
                '[' => { self.advance(); JsToken::LBracket }
                ']' => { self.advance(); JsToken::RBracket }
                ';' => { self.advance(); JsToken::Semicolon }
                ',' => { self.advance(); JsToken::Comma }
                ':' => { self.advance(); JsToken::Colon }
                '.' => { self.advance(); JsToken::Dot }
                '+' => { self.advance(); JsToken::Plus }
                '-' => { self.advance(); JsToken::Minus }
                '*' => { self.advance(); JsToken::Star }
                '/' => { self.advance(); JsToken::Slash }
                '!' => { self.advance(); JsToken::Not }
                '<' => { self.advance(); JsToken::Lt }
                '>' => { self.advance(); JsToken::Gt }
                '=' => {
                    self.advance();
                    if self.peek() == Some('>') {
                        self.advance();
                        JsToken::Arrow
                    } else if self.peek() == Some('=') {
                        self.advance();
                        if self.peek() == Some('=') {
                            self.advance();
                        }
                        JsToken::Eq
                    } else {
                        JsToken::Assign
                    }
                }
                '&' => {
                    self.advance();
                    if self.peek() == Some('&') { self.advance(); }
                    JsToken::And
                }
                '|' => {
                    self.advance();
                    if self.peek() == Some('|') { self.advance(); }
                    JsToken::Or
                }
                _ => {
                    self.advance();
                    continue;
                }
            };
            tokens.push(token);
        }

        tokens.push(JsToken::Eof);
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
        while self.peek().map_or(false, |c| c.is_alphanumeric() || c == '_' || c == '$') {
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

    fn read_block_comment(&mut self) -> String {
        self.advance(); self.advance(); // skip /*
        let mut comment = String::new();
        while self.pos < self.input.len() - 1 {
            if self.peek() == Some('*') && self.peek_next() == Some('/') {
                self.advance(); self.advance();
                break;
            }
            comment.push(self.advance().unwrap());
        }
        comment
    }
}

/// Convert JavaScript to Omni
pub fn js_to_omni(js_code: &str) -> String {
    let mut lexer = JsLexer::new(js_code);
    let tokens = lexer.tokenize();
    
    let mut output = String::new();
    let mut i = 0;

    while i < tokens.len() {
        match &tokens[i] {
            JsToken::Function => {
                i += 1;
                if let JsToken::Identifier(name) = &tokens[i] {
                    output.push_str(&format!("fn {}(", name));
                    i += 1;
                    if tokens[i] == JsToken::LParen {
                        i += 1;
                        let mut params = Vec::new();
                        while i < tokens.len() && tokens[i] != JsToken::RParen {
                            if let JsToken::Identifier(param) = &tokens[i] {
                                params.push(format!("{}: Any", param));
                            }
                            i += 1;
                        }
                        output.push_str(&params.join(", "));
                        output.push_str(") {\n");
                        i += 1;
                    }
                }
            }
            JsToken::Const | JsToken::Let | JsToken::Var => {
                i += 1;
                if let JsToken::Identifier(name) = &tokens[i] {
                    output.push_str(&format!("    let {} = ", name));
                    i += 1;
                    if tokens[i] == JsToken::Assign {
                        i += 1;
                        while i < tokens.len() && tokens[i] != JsToken::Semicolon {
                            match &tokens[i] {
                                JsToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                                JsToken::Number(n) => output.push_str(n),
                                JsToken::Boolean(b) => output.push_str(&b.to_string()),
                                JsToken::Identifier(id) => output.push_str(id),
                                _ => {}
                            }
                            i += 1;
                        }
                        output.push_str(";\n");
                    }
                }
            }
            JsToken::Return => {
                i += 1;
                output.push_str("    return ");
                while i < tokens.len() && tokens[i] != JsToken::Semicolon {
                    match &tokens[i] {
                        JsToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                        JsToken::Number(n) => output.push_str(n),
                        JsToken::Identifier(id) => output.push_str(id),
                        JsToken::Plus => output.push_str(" + "),
                        _ => {}
                    }
                    i += 1;
                }
                output.push_str(";\n");
            }
            JsToken::RBrace => {
                output.push_str("}\n\n");
                i += 1;
            }
            _ => i += 1,
        }
    }

    output
}

/// Ingest JavaScript file
pub fn ingest_js_file(input: &Path, output: &Path) -> Result<()> {
    println!("{}", "📥 Ingesting JavaScript file...".cyan().bold());
    
    let js_code = fs::read_to_string(input)
        .with_context(|| format!("Failed to read {}", input.display()))?;
    
    let omni_code = js_to_omni(&js_code);
    
    fs::write(output, &omni_code)?;
    
    println!("{} Converted {} -> {}", "✓".green(), 
        input.display(), output.display());
    
    Ok(())
}
