//! PHP Ingestion - Convert PHP Code to Omni
//!
//! Parses PHP 7/8 code and converts it to Omni syntax.

use std::fs;
use std::path::Path;
use anyhow::{Result, Context};
use colored::*;

/// PHP token types (simplified)
#[derive(Debug, Clone, PartialEq)]
pub enum PhpToken {
    // Literals
    String(String),
    Number(String),
    Variable(String),
    
    // Keywords
    Function,
    Class,
    Public,
    Private,
    Protected,
    Static,
    Return,
    If,
    Else,
    ElseIf,
    While,
    For,
    Foreach,
    Echo,
    New,
    
    // Operators
    Arrow,      // ->
    DoubleArrow, // =>
    Assign,     // =
    Plus, Minus, Star, Slash,
    
    // Punctuation
    LParen, RParen,
    LBrace, RBrace,
    LBracket, RBracket,
    Semicolon, Comma, Colon,
    
    // Other
    Identifier(String),
    PhpOpen,    // <?php
    PhpClose,   // ?>
    Comment(String),
    Whitespace,
    Eof,
}

/// PHP Lexer
pub struct PhpLexer {
    input: Vec<char>,
    pos: usize,
}

impl PhpLexer {
    pub fn new(input: &str) -> Self {
        Self {
            input: input.chars().collect(),
            pos: 0,
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

    fn skip_whitespace(&mut self) {
        while self.peek().map_or(false, |c| c.is_whitespace()) {
            self.advance();
        }
    }

    pub fn tokenize(&mut self) -> Vec<PhpToken> {
        let mut tokens = Vec::new();
        
        while let Some(ch) = self.peek() {
            // Skip whitespace
            if ch.is_whitespace() {
                self.skip_whitespace();
                continue;
            }

            // Comments
            if ch == '/' {
                if self.input.get(self.pos + 1) == Some(&'/') {
                    let comment = self.read_line_comment();
                    tokens.push(PhpToken::Comment(comment));
                    continue;
                }
            }

            // Strings
            if ch == '"' || ch == '\'' {
                let s = self.read_string(ch);
                tokens.push(PhpToken::String(s));
                continue;
            }

            // Numbers
            if ch.is_ascii_digit() {
                let num = self.read_number();
                tokens.push(PhpToken::Number(num));
                continue;
            }

            // Variables $var
            if ch == '$' {
                self.advance();
                let name = self.read_identifier();
                tokens.push(PhpToken::Variable(name));
                continue;
            }

            // Identifiers and keywords
            if ch.is_alphabetic() || ch == '_' {
                let ident = self.read_identifier();
                let token = match ident.as_str() {
                    "function" => PhpToken::Function,
                    "class" => PhpToken::Class,
                    "public" => PhpToken::Public,
                    "private" => PhpToken::Private,
                    "protected" => PhpToken::Protected,
                    "static" => PhpToken::Static,
                    "return" => PhpToken::Return,
                    "if" => PhpToken::If,
                    "else" => PhpToken::Else,
                    "elseif" => PhpToken::ElseIf,
                    "while" => PhpToken::While,
                    "for" => PhpToken::For,
                    "foreach" => PhpToken::Foreach,
                    "echo" => PhpToken::Echo,
                    "new" => PhpToken::New,
                    _ => PhpToken::Identifier(ident),
                };
                tokens.push(token);
                continue;
            }

            // Operators and punctuation
            let token = match ch {
                '(' => { self.advance(); PhpToken::LParen }
                ')' => { self.advance(); PhpToken::RParen }
                '{' => { self.advance(); PhpToken::LBrace }
                '}' => { self.advance(); PhpToken::RBrace }
                '[' => { self.advance(); PhpToken::LBracket }
                ']' => { self.advance(); PhpToken::RBracket }
                ';' => { self.advance(); PhpToken::Semicolon }
                ',' => { self.advance(); PhpToken::Comma }
                ':' => { self.advance(); PhpToken::Colon }
                '+' => { self.advance(); PhpToken::Plus }
                '*' => { self.advance(); PhpToken::Star }
                '/' => { self.advance(); PhpToken::Slash }
                '-' => {
                    self.advance();
                    if self.peek() == Some('>') {
                        self.advance();
                        PhpToken::Arrow
                    } else {
                        PhpToken::Minus
                    }
                }
                '=' => {
                    self.advance();
                    if self.peek() == Some('>') {
                        self.advance();
                        PhpToken::DoubleArrow
                    } else {
                        PhpToken::Assign
                    }
                }
                '<' => {
                    // Check for <?php
                    if self.check_phpopen() {
                        tokens.push(PhpToken::PhpOpen);
                        continue;
                    }
                    self.advance();
                    continue;
                }
                '?' => {
                    if self.input.get(self.pos + 1) == Some(&'>') {
                        self.pos += 2;
                        PhpToken::PhpClose
                    } else {
                        self.advance();
                        continue;
                    }
                }
                _ => {
                    self.advance();
                    continue;
                }
            };
            tokens.push(token);
        }

        tokens.push(PhpToken::Eof);
        tokens
    }

    fn read_string(&mut self, quote: char) -> String {
        self.advance(); // skip opening quote
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

    fn check_phpopen(&mut self) -> bool {
        let remaining: String = self.input[self.pos..].iter().take(5).collect();
        if remaining.starts_with("<?php") {
            self.pos += 5;
            true
        } else {
            false
        }
    }
}

/// Convert PHP to Omni
pub fn php_to_omni(php_code: &str) -> String {
    let mut lexer = PhpLexer::new(php_code);
    let tokens = lexer.tokenize();
    
    let mut output = String::new();
    let mut i = 0;

    while i < tokens.len() {
        match &tokens[i] {
            PhpToken::Function => {
                // function name(params) { body }
                i += 1;
                if let PhpToken::Identifier(name) = &tokens[i] {
                    output.push_str(&format!("fn {}(", name));
                    i += 1;
                    // Skip to params
                    if tokens[i] == PhpToken::LParen {
                        i += 1;
                        let mut params = Vec::new();
                        while i < tokens.len() && tokens[i] != PhpToken::RParen {
                            if let PhpToken::Variable(var) = &tokens[i] {
                                params.push(format!("{}: Any", var));
                            }
                            i += 1;
                        }
                        output.push_str(&params.join(", "));
                        output.push_str(") {\n");
                        i += 1;
                    }
                }
            }
            PhpToken::Echo => {
                i += 1;
                output.push_str("    println(");
                // Simple: just copy until semicolon
                while i < tokens.len() && tokens[i] != PhpToken::Semicolon {
                    match &tokens[i] {
                        PhpToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                        PhpToken::Variable(v) => output.push_str(v),
                        PhpToken::Plus => output.push_str(" + "),
                        _ => {}
                    }
                    i += 1;
                }
                output.push_str(");\n");
            }
            PhpToken::Variable(v) => {
                output.push_str(&format!("    let {} = ", v));
                i += 1;
                if tokens[i] == PhpToken::Assign {
                    i += 1;
                    while i < tokens.len() && tokens[i] != PhpToken::Semicolon {
                        match &tokens[i] {
                            PhpToken::String(s) => output.push_str(&format!("\"{}\"", s)),
                            PhpToken::Number(n) => output.push_str(n),
                            _ => {}
                        }
                        i += 1;
                    }
                    output.push_str(";\n");
                }
            }
            PhpToken::RBrace => {
                output.push_str("}\n\n");
                i += 1;
            }
            _ => i += 1,
        }
    }

    output
}

/// Ingest PHP file
pub fn ingest_php_file(input: &Path, output: &Path) -> Result<()> {
    println!("{}", "📥 Ingesting PHP file...".cyan().bold());
    
    let php_code = fs::read_to_string(input)
        .with_context(|| format!("Failed to read {}", input.display()))?;
    
    let omni_code = php_to_omni(&php_code);
    
    fs::write(output, &omni_code)?;
    
    println!("{} Converted {} -> {}", "✓".green(), 
        input.display(), output.display());
    
    Ok(())
}
