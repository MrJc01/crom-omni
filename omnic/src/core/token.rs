use logos::Logos;
use std::fmt;

/// Definição completa dos Tokens da linguagem Omni (Estilo A+C)
/// Usamos a crate `logos` para gerar o lexer automaticamente via Regex.
#[derive(Logos, Debug, PartialEq, Clone)]
#[logos(skip r"[ \t\n\r\f]+")] // Ignora espaços em branco (incluindo \r de CRLF)
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

    #[token("while")]
    While,

    #[token("for")]
    For,

    #[token("in")]
    In,

    #[token("break")]
    Break,

    #[token("continue")]
    Continue,

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

    #[token("=>")]
    FatArrow, // JavaScript arrow functions

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

    #[token("<")]
    LessThan,

    #[token(">")]
    GreaterThan,

    #[token("<=")]
    LessEquals,

    #[token(">=")]
    GreaterEquals,

    #[token("&&")]
    LogicalAnd,

    #[token("||")]
    LogicalOr,

    // --- Additional ASCII Symbols (for native block support) ---

    #[token("\\")]
    Backslash,

    #[token("?")]
    Question,

    #[token("!")]
    Bang,

    #[token("^")]
    Caret,

    #[token("$")]
    Dollar,

    #[token("|")]
    Pipe,

    #[token("&")]
    Ampersand,

    #[token("%")]
    Percent,

    #[token("#")]
    Hash,

    #[token("~")]
    Tilde,

    #[token("`")]
    Backtick,

    // Note: SingleQuote now handled by SingleQuotedString regex
    // #[token("'")]
    // SingleQuote,

    // --- Literais e Identificadores ---

    // Identificadores: Começa com letra/_ e segue com alfanumérico
    #[regex("[a-zA-Z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    Identifier(String),

    // Atributos/Decorators: @route, @entity
    // Captura o @ e o nome junto, ex: "@route"
    #[regex("@[a-zA-Z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    Attribute(String),

    // Strings: Aspas duplas com escapes
    #[regex(r#""([^"\\]|\\.)*""#, |lex| lex.slice().trim_matches('"').to_string())]
    StringLiteral(String),

    // Strings com aspas simples (para native blocks com JS)
    #[regex(r#"'([^'\\]|\\.)*'"#, |lex| lex.slice().trim_matches('\'').to_string())]
    SingleQuotedString(String),

    // Template Literals (JS): `foo`
    #[regex(r#"`([^`\\]|\\.)*`"#, |lex| lex.slice().trim_matches('`').to_string())]
    TemplateStringLiteral(String),

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
