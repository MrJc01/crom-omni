use logos::Logos;
use std::fmt;

/// Definição completa dos Tokens da linguagem Omni (Estilo A+C)
/// Usamos a crate `logos` para gerar o lexer automaticamente via Regex.
#[derive(Logos, Debug, PartialEq, Clone)]
#[logos(skip r"[ \t\n\f]+")] // Ignora espaços em branco
#[logos(skip r"//[^\n]*")]   // Ignora comentários de linha //
#[logos(skip r"/\*([^*]|\*[^/])*\*/")] // Ignora comentários de bloco /* */
pub enum Token {
    // --- Palavras-Chave (Keywords) ---
    
    #[token("fn")]
    Fn,

    #[token("struct")]
    Struct,

    #[token("let")]
    Let,

    #[token("mut")]
    Mut,

    #[token("if")]
    If,

    #[token("else")]
    Else,

    #[token("return")]
    Return,

    #[token("package")]
    Package,

    #[token("import")]
    Import,

    #[token("true")]
    True,

    #[token("false")]
    False,

    #[token("native")]
    Native, // Túnel nativo

    #[token("fallback")]
    Fallback,

    #[token("spawn")]
    Spawn, // Concorrência

    // --- Símbolos e Pontuação ---

    #[token("{")]
    BraceOpen,

    #[token("}")]
    BraceClose,

    #[token("(")]
    ParenOpen,

    #[token(")")]
    ParenClose,

    #[token("[")]
    BracketOpen,

    #[token("]")]
    BracketClose,

    #[token(":")]
    Colon,

    #[token(";")]
    Semicolon,

    #[token(",")]
    Comma,

    #[token(".")]
    Dot,

    #[token("->")]
    Arrow,

    #[token("=")]
    Assign,

    #[token("==")]
    Equals,

    #[token("!=")]
    NotEquals,

    #[token("+")]
    Plus,

    #[token("-")]
    Minus,

    #[token("*")]
    Star,

    #[token("/")]
    Slash,

    // --- Literais e Identificadores ---

    // Identificadores: Começa com letra/_ e segue com alfanumérico
    #[regex("[a-zA-Z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    Identifier(String),

    // Atributos/Decorators: @route, @entity
    // Captura o @ e o nome junto, ex: "@route"
    #[regex("@[a-zA-Z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    Attribute(String),

    // Strings: Aspas duplas
    #[regex(r#""([^"\\]|\\["\\bnfrt]|u[a-fA-F0-9]{4})*""#, |lex| lex.slice().trim_matches('"').to_string())]
    StringLiteral(String),

    // Inteiros: 123, 0xFF
    #[regex(r"[0-9]+", |lex| lex.slice().parse().ok())]
    #[regex(r"0x[0-9a-fA-F]+", |lex| i64::from_str_radix(&lex.slice()[2..], 16).ok())]
    IntegerLiteral(i64),

    // Floats (Simplificado para MVP): 10.5
    #[regex(r"[0-9]+\.[0-9]+", |lex| lex.slice().parse().ok())]
    FloatLiteral(f64),
}

// Implementação de Display para debug bonito no terminal
impl fmt::Display for Token {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}
