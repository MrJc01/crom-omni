// OMNI v1.2.0 - Unified Bundle
const OMNI = {};
const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

var exports = module.exports; // Shared exports object

// === Module: core/token ===
BlockLoop: 66 (return)
const TOKEN_EOF = 0;
const TOKEN_ILLEGAL = 1;
const TOKEN_IDENTIFIER = 10;
const TOKEN_INT = 11;
const TOKEN_STRING = 12;
const TOKEN_ASSIGN = 20;
const TOKEN_PLUS = 21;
const TOKEN_MINUS = 22;
const TOKEN_BANG = 23;
const TOKEN_ASTERISK = 24;
const TOKEN_SLASH = 25;
const TOKEN_LT = 26;
const TOKEN_GT = 27;
const TOKEN_EQ = 28;
const TOKEN_NOT_EQ = 29;
const TOKEN_COLON = 30;
const TOKEN_DOT = 31;
const TOKEN_AND = 32;
const TOKEN_OR = 33;
const TOKEN_LE = 34;
const TOKEN_GE = 35;
const TOKEN_COMMA = 40;
const TOKEN_SEMICOLON = 41;
const TOKEN_LPAREN = 42;
const TOKEN_RPAREN = 43;
const TOKEN_LBRACE = 44;
const TOKEN_RBRACE = 45;
const TOKEN_LBRACKET = 46;
const TOKEN_RBRACKET = 47;
const TOKEN_FN = 60;
const TOKEN_LET = 61;
const TOKEN_TRUE = 62;
const TOKEN_FALSE = 63;
const TOKEN_IF = 64;
const TOKEN_ELSE = 65;
const TOKEN_RETURN = 66;
const TOKEN_WHILE = 67;
const TOKEN_STRUCT = 70;
const TOKEN_NATIVE = 80;
const TOKEN_IMPORT = 90;
const TOKEN_PACKAGE = 91;
const TOKEN_EXPORT = 92;
const TOKEN_AT = 95;
class Token {
    constructor(data = {}) {
        this.kind = data.kind;
        this.lexeme = data.lexeme;
        this.line = data.line;
        this.start = data.start;
        this.end = data.end;
    }
}
function new_token(kind, lexeme, line) {
    return new Token({ kind: kind, lexeme: lexeme, line: line, start: 0, end: 0 });
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_token = new_token;
    exports.Token = Token;
    exports.TOKEN_EOF = TOKEN_EOF;
    exports.TOKEN_ILLEGAL = TOKEN_ILLEGAL;
    exports.TOKEN_IDENTIFIER = TOKEN_IDENTIFIER;
    exports.TOKEN_INT = TOKEN_INT;
    exports.TOKEN_STRING = TOKEN_STRING;
    exports.TOKEN_ASSIGN = TOKEN_ASSIGN;
    exports.TOKEN_PLUS = TOKEN_PLUS;
    exports.TOKEN_MINUS = TOKEN_MINUS;
    exports.TOKEN_BANG = TOKEN_BANG;
    exports.TOKEN_ASTERISK = TOKEN_ASTERISK;
    exports.TOKEN_SLASH = TOKEN_SLASH;
    exports.TOKEN_LT = TOKEN_LT;
    exports.TOKEN_GT = TOKEN_GT;
    exports.TOKEN_EQ = TOKEN_EQ;
    exports.TOKEN_NOT_EQ = TOKEN_NOT_EQ;
    exports.TOKEN_COLON = TOKEN_COLON;
    exports.TOKEN_DOT = TOKEN_DOT;
    exports.TOKEN_AND = TOKEN_AND;
    exports.TOKEN_OR = TOKEN_OR;
    exports.TOKEN_LE = TOKEN_LE;
    exports.TOKEN_GE = TOKEN_GE;
    exports.TOKEN_COMMA = TOKEN_COMMA;
    exports.TOKEN_SEMICOLON = TOKEN_SEMICOLON;
    exports.TOKEN_LPAREN = TOKEN_LPAREN;
    exports.TOKEN_RPAREN = TOKEN_RPAREN;
    exports.TOKEN_LBRACE = TOKEN_LBRACE;
    exports.TOKEN_RBRACE = TOKEN_RBRACE;
    exports.TOKEN_LBRACKET = TOKEN_LBRACKET;
    exports.TOKEN_RBRACKET = TOKEN_RBRACKET;
    exports.TOKEN_FN = TOKEN_FN;
    exports.TOKEN_LET = TOKEN_LET;
    exports.TOKEN_TRUE = TOKEN_TRUE;
    exports.TOKEN_FALSE = TOKEN_FALSE;
    exports.TOKEN_IF = TOKEN_IF;
    exports.TOKEN_ELSE = TOKEN_ELSE;
    exports.TOKEN_RETURN = TOKEN_RETURN;
    exports.TOKEN_WHILE = TOKEN_WHILE;
    exports.TOKEN_STRUCT = TOKEN_STRUCT;
    exports.TOKEN_NATIVE = TOKEN_NATIVE;
    exports.TOKEN_IMPORT = TOKEN_IMPORT;
    exports.TOKEN_PACKAGE = TOKEN_PACKAGE;
    exports.TOKEN_EXPORT = TOKEN_EXPORT;
    exports.TOKEN_AT = TOKEN_AT;
}


// === Module: core/lexer ===
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 10 (Lexer_read_char)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 35 (>=)
BlockLoop: 11 (999999)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (ch)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (ch)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (position)
BlockLoop: 31 (.)
BlockLoop: 10 (read_position)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (read_position)
BlockLoop: 31 (.)
BlockLoop: 10 (read_position)
BlockLoop: 21 (+)
BlockLoop: 11 (1)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 67 (while)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (\n)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (line)
BlockLoop: 31 (.)
BlockLoop: 10 (line)
BlockLoop: 21 (+)
BlockLoop: 11 (1)
BlockLoop: 10 (Lexer_read_char)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (position)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (ch)
BlockLoop: 43 ())
BlockLoop: 33 (||)
BlockLoop: 10 (is_digit)
BlockLoop: 42 (()
BlockLoop: 10 (ch)
BlockLoop: 43 ())
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Lexer_read_char)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (position)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (ch)
BlockLoop: 43 ())
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Lexer_read_char)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 66 (return)
BlockLoop: 10 (Lexer_skip_whitespace)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (/)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (input)
BlockLoop: 40 (,)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (read_position)
BlockLoop: 43 ())
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 67 (while)
BlockLoop: 29 (!=)
BlockLoop: 12 (\n)
BlockLoop: 32 (&&)
BlockLoop: 10 (l)
BlockLoop: 31 (.)
BlockLoop: 10 (ch)
BlockLoop: 29 (!=)
BlockLoop: 12 (\0)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Lexer_read_char)
BlockLoop: 42 (()
var token = exports;
function char_at(s, i) {
    
        if (i >= s.length) return "\0";
        return s.charAt(i);
    
}
function is_letter(ch) {
     return /[a-zA-Z_]/.test(ch); 
}
function is_digit(ch) {
     return /\d/.test(ch); 
}
function is_quote(ch) {
     return ch === String.fromCharCode(34); 
}
class Lexer {
    constructor(data = {}) {
        this.input = data.input;
        this.position = data.position;
        this.read_position = data.read_position;
        this.ch = data.ch;
        this.line = data.line;
    }
}
function new_lexer(input) {
    const l = new Lexer({ input: input, position: 0, read_position: 0, ch: "\0", line: 1 });
    Lexer_read_char;
    l;
    return l;
}
function Lexer_read_char(l) {
    if (l) {
    read_position;
}
    // Unknown stmt kind: 0
    999999;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    l;
    // Unknown stmt kind: 0
    ch = "\0";
}
// Unknown stmt kind: undefined
const is_eof = false;
 is_eof = l.ch === "\0"; 
if (is_eof) {
    l;
    // Unknown stmt kind: 0
    ch = "\0";
} else {
    l;
    // Unknown stmt kind: 0
    position = l;
    // Unknown stmt kind: 0
    read_position;
    l;
    // Unknown stmt kind: 0
    read_position = l;
    // Unknown stmt kind: 0
    read_position;
    // Unknown stmt kind: 0
    1;
}
// Unknown stmt kind: undefined
function Lexer_skip_whitespace(l) {
    const is_ws = false;
    
        is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
    
    while (is_ws) {
    if (l) {
    ch;
}
    // Unknown stmt kind: 0
    "\n";
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    l;
    // Unknown stmt kind: 0
    line = l;
    // Unknown stmt kind: 0
    line;
    // Unknown stmt kind: 0
    1;
}
    Lexer_read_char;
    l;
    
             is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
        
}
// Unknown stmt kind: undefined
function Lexer_read_identifier(l) {
    const start_pos = l;
    // Unknown stmt kind: 0
    position;
    while (is_letter) {
    l;
}
    // Unknown stmt kind: 0
    ch;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    is_digit;
    l;
    ch;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Lexer_read_char;
    l;
}
const ident = "";

        ident = l.input.substring(Number(start_pos), Number(l.position));
    
return ident;
// Unknown stmt kind: undefined
function Lexer_read_number(l) {
    const start_pos = l;
    // Unknown stmt kind: 0
    position;
    while (is_digit) {
    l;
}
    // Unknown stmt kind: 0
    ch;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Lexer_read_char;
    l;
}
const num_str = "";

        num_str = l.input.substring(Number(start_pos), Number(l.position));
    
return num_str;
// Unknown stmt kind: undefined
function Lexer_lookup_ident(ident) {
    if (ident) {
    "fn";
}
    // Unknown stmt kind: 0
    return TOKEN_FN;
    if (ident) {
    "let";
}
    // Unknown stmt kind: 0
    return TOKEN_LET;
    if (ident) {
    "struct";
}
    // Unknown stmt kind: 0
    return TOKEN_STRUCT;
    if (ident) {
    "if";
}
    // Unknown stmt kind: 0
    return TOKEN_IF;
    if (ident) {
    "else";
}
    // Unknown stmt kind: 0
    return TOKEN_ELSE;
    if (ident) {
    "return";
}
    // Unknown stmt kind: 0
    return TOKEN_RETURN;
    if (ident) {
    "true";
}
    // Unknown stmt kind: 0
    return TOKEN_TRUE;
    if (ident) {
    "false";
}
    // Unknown stmt kind: 0
    return TOKEN_FALSE;
    if (ident) {
    "native";
}
    // Unknown stmt kind: 0
    return TOKEN_NATIVE;
    if (ident) {
    "import";
}
    // Unknown stmt kind: 0
    return 90;
    if (ident) {
    "package";
}
    // Unknown stmt kind: 0
    return 91;
    if (ident) {
    "export";
}
    // Unknown stmt kind: 0
    return 92;
    if (ident) {
    "while";
}
    // Unknown stmt kind: 0
    return TOKEN_WHILE;
    return TOKEN_IDENTIFIER;
}
function Lexer_next_token(l) {
    Lexer_skip_whitespace;
    l;
    if (l) {
    ch;
}
    // Unknown stmt kind: 0
    "/";
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const peek = char_at;
    l;
    input;
    // Unknown stmt kind: 0
    l;
    // Unknown stmt kind: 0
    read_position;
    // Unknown stmt kind: 0
    if (peek) {
    "/";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    while (l) {
    ch;
}
    // Unknown stmt kind: 0
    "\n";
    // Unknown stmt kind: 0
    l;
    // Unknown stmt kind: 0
    ch;
    // Unknown stmt kind: 0
    "\0";
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Lexer_read_char;
    l;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
const tok = new_token;
if (l) {
    ch;
}
return tok;
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_eq = char_at;
if (peek_eq) {
    "=";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_bang = char_at;
if (peek_bang) {
    "=";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_arrow = char_at;
if (peek_arrow) {
    ">";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_slash = char_at;
if (peek_slash) {
    "/";
}
while (l) {
    ch;
}
// Unknown stmt kind: undefined
return Lexer_next_token;
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (is_quote) {
    l;
}
const str_val = "";
const start = l;
while (is_quote) {
    l;
}
// Unknown stmt kind: undefined
const end = l;

            str_val = l.input.substring(Number(start), Number(end));
        
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_and = char_at;
if (peek_and) {
    "&";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_or = char_at;
if (peek_or) {
    "|";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_lt = char_at;
if (peek_lt) {
    "=";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (l) {
    ch;
}
// Unknown stmt kind: undefined
if (l) {
    ch;
}
const peek_gt = char_at;
if (peek_gt) {
    "=";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (is_letter) {
    l;
}
const literal = Lexer_read_identifier;
return tok;
// Unknown stmt kind: undefined
if (is_digit) {
    l;
}
return tok;
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
return tok;
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.char_at = char_at;
    exports.is_letter = is_letter;
    exports.is_digit = is_digit;
    exports.is_quote = is_quote;
    exports.new_lexer = new_lexer;
    exports.Lexer_read_char = Lexer_read_char;
    exports.Lexer_skip_whitespace = Lexer_skip_whitespace;
    exports.Lexer_read_identifier = Lexer_read_identifier;
    exports.Lexer_read_number = Lexer_read_number;
    exports.Lexer_lookup_ident = Lexer_lookup_ident;
    exports.Lexer_next_token = Lexer_next_token;
    exports.Lexer = Lexer;
}


// === Module: core/parser ===
BlockLoop: 61 (let)
BlockLoop: 60 (fn)
BlockLoop: 61 (let)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_EOF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 64 (if)
BlockLoop: 29 (!=)
BlockLoop: 11 (0)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 11 (95)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 11 (95)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_SEMICOLON)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_SEMICOLON)
BlockLoop: 32 (&&)
BlockLoop: 10 (p)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_EOF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 11 (30)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_SEMICOLON)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_RPAREN)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 11 (30)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_RBRACE)
BlockLoop: 32 (&&)
BlockLoop: 10 (p)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_EOF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_RBRACE)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_STRING)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (lang)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_LBRACE)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_RBRACE)
BlockLoop: 32 (&&)
BlockLoop: 10 (p)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_EOF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_SEMICOLON)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_ASSIGN)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 64 (if)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_NOT_EQ)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (left)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 64 (if)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_GT)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_LE)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_GE)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (left)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 64 (if)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_OR)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (left)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 64 (if)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_MINUS)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (left)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 64 (if)
BlockLoop: 32 (&&)
BlockLoop: 10 (k)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_SLASH)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (break)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (left)
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_INT)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (node)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 11 (31)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (node)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_ELSE)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_IF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (alt)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_LPAREN)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 67 (while)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_RPAREN)
BlockLoop: 32 (&&)
BlockLoop: 10 (p)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 29 (!=)
BlockLoop: 10 (TOKEN_EOF)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_IDENTIFIER)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 64 (if)
BlockLoop: 31 (.)
BlockLoop: 10 (kind)
BlockLoop: 28 (==)
BlockLoop: 10 (TOKEN_ASSIGN)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (is_named)
BlockLoop: 10 (arg_name)
BlockLoop: 31 (.)
BlockLoop: 10 (cur_token)
BlockLoop: 31 (.)
BlockLoop: 10 (lexeme)
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (Parser_next_token)
BlockLoop: 42 (()
BlockLoop: 10 (arg_val)
BlockLoop: 42 (()
BlockLoop: 10 (arg_val)
BlockLoop: 42 (()
var lexer = exports;
var token = exports;
var ast = exports;
class Parser {
    constructor(data = {}) {
        this.lexer = data.lexer;
        this.cur_token = data.cur_token;
        this.peek_token = data.peek_token;
    }
}
function new_parser(l) {
    const p = new Parser({ lexer: l, cur_token: new_token, (: null, : 0, ): peek_token, :: 0, : 0, ): null, Parser_next_token: p, ): Parser_next_token, (: null, ;: p, ;: null, Parser_next_token: p, :: null, {: null, cur_token: p, .: null, p: peek_token = Lexer_next_token, (: null, lexer: null });
    function Parser_parse_program(p) {
    const stmts = [];
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_EOF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const stmt = Parser_parse_statement;
    p;
    if (stmt) {
    0;
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    if (stmt) {
    kind;
}
    // Unknown stmt kind: 0
    0;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
     stmts.push(stmt); 
}
}
// Unknown stmt kind: undefined
return new Program({ statements: stmts });
// Unknown stmt kind: undefined
function Parser_parse_statement(p) {
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    95;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const decorators = [];
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    95;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
     decorators.push(Parser_parse_decorator(p)); 
}
const stmt = Parser_parse_statement;
 if (stmt) stmt.decorators = decorators; 
return stmt;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
const stmt = Parser_parse_statement;
 if (stmt) stmt.is_exported = true; 
return stmt;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_package;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_import;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return 0;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_if;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_while;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_let;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_fn;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_struct;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_return;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
return Parser_parse_native_block;
// Unknown stmt kind: undefined
return Parser_parse_expr_stmt;
// Unknown stmt kind: undefined
function Parser_parse_import(p) {
    Parser_next_token;
    p;
    const path = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_SEMICOLON;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
}
return new ImportDecl({ kind: NODE_IMPORT, path: path });
// Unknown stmt kind: undefined
function Parser_parse_package(p) {
    Parser_next_token;
    p;
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_SEMICOLON;
    // Unknown stmt kind: 0
    p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_EOF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
}
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
function Parser_parse_let(p) {
    Parser_next_token;
    p;
    const name = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    30;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    Parser_next_token;
    p;
}
const val = Parser_parse_expression;
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
return new LetStmt({ kind: NODE_LET, name: name, value: val, is_exported: false });
// Unknown stmt kind: undefined
function Parser_parse_return(p) {
    Parser_next_token;
    p;
    const val = Parser_parse_expression;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_SEMICOLON;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
}
return new ReturnStmt({ kind: NODE_RETURN, value: val });
// Unknown stmt kind: undefined
function Parser_parse_fn(p) {
    Parser_next_token;
    p;
    const name = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    Parser_next_token;
    p;
    const params = [];
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_RPAREN;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
     params.push(p.cur_token.lexeme); 
    Parser_next_token;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    30;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    Parser_next_token;
    p;
}
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
const body = Parser_parse_block;
return new FunctionDecl({ kind: NODE_FUNCTION, name: name, params: params, body: body, is_exported: false, decorators: [] });
// Unknown stmt kind: undefined
function Parser_parse_struct(p) {
    Parser_next_token;
    p;
    const name = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    Parser_next_token;
    p;
    const fields = [];
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_RBRACE;
    // Unknown stmt kind: 0
    p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_EOF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_RBRACE;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
const field_name = p;
const field_type = p;
const f = new_struct_field;
 fields.push(f); 
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
return new StructDecl({ kind: NODE_STRUCT, name: name, fields: fields, is_exported: false, decorators: [] });
// Unknown stmt kind: undefined
function Parser_parse_native_block(p) {
    Parser_next_token;
    p;
    const lang = "js";
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_STRING;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    lang = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
}
if (p) {
    cur_token;
}
return new NativeStmt({ kind: 0, lang: "", code: "" });
// Unknown stmt kind: undefined
const start_pos = p;
const code = "";
const end_pos = 0;

        const input = p.lexer.input;
        let pos = Number(start_pos) + 1;
        let brace_count = 1;
        let start_extract = pos;
        
        while (pos < input.length && brace_count > 0) {
            const char = input[pos];
            if (char === '{') brace_count++;
            if (char === '}') brace_count--;
            pos++;
        }
        
        end_pos = pos;
        if (brace_count == 0) {
            code = input.substring(start_extract, pos - 1);
        }
        p.lexer.read_position = end_pos;
        Lexer_read_char(p.lexer);
        p.cur_token = Lexer_next_token(p.lexer);
        p.peek_token = Lexer_next_token(p.lexer);
    
return new NativeStmt({ kind: NODE_NATIVE, lang: lang, code: code });
// Unknown stmt kind: undefined
function Parser_parse_block(p) {
    const stmts = [];
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_LBRACE;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_RBRACE;
    // Unknown stmt kind: 0
    p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_EOF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
     console.log("BlockLoop: " + p.cur_token.kind + " (" + p.cur_token.lexeme + ")"); 
    const stmt = Parser_parse_statement;
    p;
     stmts.push(stmt); 
}
// Unknown stmt kind: undefined
const stmt = Parser_parse_statement;
 stmts.push(stmt); 
// Unknown stmt kind: undefined
return new Block({ kind: NODE_BLOCK, statements: stmts });
// Unknown stmt kind: undefined
function Parser_parse_expr_stmt(p) {
    const expr = Parser_parse_expression;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_SEMICOLON;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
}
return new ExpressionStmt({ kind: 0, expr: expr });
// Unknown stmt kind: undefined
function Parser_parse_expression(p) {
    return Parser_parse_assignment;
    p;
}
function Parser_parse_assignment(p) {
    const left = Parser_parse_logic;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_ASSIGN;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    const right = Parser_parse_assignment;
    p;
    return new AssignmentExpr({ kind: NODE_ASSIGNMENT, left: left, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_equality(p) {
    const left = Parser_parse_relational;
    p;
    while (true) {
    const k = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    if (k) {
    TOKEN_EQ;
}
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_NOT_EQ;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
    const op = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const right = Parser_parse_relational;
    p;
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_relational(p) {
    const left = Parser_parse_term;
    p;
    while (true) {
    const k = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    if (k) {
    TOKEN_LT;
}
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_GT;
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_LE;
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_GE;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
    const op = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const right = Parser_parse_term;
    p;
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_logic(p) {
    const left = Parser_parse_equality;
    p;
    while (true) {
    const k = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    if (k) {
    TOKEN_AND;
}
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_OR;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
    const op = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const right = Parser_parse_equality;
    p;
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_term(p) {
    const left = Parser_parse_multiplication;
    p;
    while (true) {
    const k = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    if (k) {
    TOKEN_PLUS;
}
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_MINUS;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
    const op = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const right = Parser_parse_multiplication;
    p;
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_multiplication(p) {
    const left = Parser_parse_factor;
    p;
    while (true) {
    const k = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    if (k) {
    TOKEN_ASTERISK;
}
    // Unknown stmt kind: 0
    k;
    // Unknown stmt kind: 0
    TOKEN_SLASH;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    break;
}
    const op = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const right = Parser_parse_factor;
    p;
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
return left;
// Unknown stmt kind: undefined
function Parser_parse_factor(p) {
    const node = 0;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_INT;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const val = 0;
     val = parseInt(p.cur_token.lexeme); 
    node = new IntegerLiteral({ kind: NODE_LITERAL, value: val });
    Parser_next_token;
    p;
}
if (p) {
    cur_token;
}
const name = p;
if (p) {
    cur_token;
}
const init_fields = [];
while (p) {
    cur_token;
}
const field_name = p;
const field_val = Parser_parse_expression;
const field = new StructInitField({ name: field_name, value: field_val });
 init_fields.push(field); 
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
const str_val = p;
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
if (p) {
    cur_token;
}
const elements = [];
while (p) {
    cur_token;
}
 elements.push(Parser_parse_expression(p)); 
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
 node = { kind: NODE_ARRAY, elements: elements }; 
// Unknown stmt kind: undefined
 console.error("Unexpected token in expression: Kind " + p.cur_token.kind + ", Lexeme: " + p.cur_token.lexeme); 
return 0;
// Unknown stmt kind: undefined
const continue_loop = true;
while (continue_loop) {
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    31;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    const prop = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    node = new MemberExpr({ kind: NODE_MEMBER, target: node, property: prop });
}
if (p) {
    cur_token;
}
const args = [];
while (p) {
    cur_token;
}
 args.push(Parser_parse_expression(p)); 
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
return node;
// Unknown stmt kind: undefined
function Parser_parse_if(p) {
    Parser_next_token;
    p;
    const cond = Parser_parse_expression;
    p;
    const cons = Parser_parse_block;
    p;
    const alt = 0;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_ELSE;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_IF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const if_stmt = Parser_parse_if;
    p;
    const stmts = [];
     stmts.push(if_stmt); 
    alt = new Block({ kind: NODE_BLOCK, statements: stmts });
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
return new IfStmt({ kind: NODE_IF, condition: cond, consequence: cons, alternative: alt });
// Unknown stmt kind: undefined
function Parser_parse_while(p) {
    Parser_next_token;
    p;
    const cond = Parser_parse_expression;
    p;
    const body = Parser_parse_block;
    p;
    return new WhileStmt({ kind: NODE_WHILE, condition: cond, body: body });
}
function Parser_parse_decorator(p) {
    Parser_next_token;
    p;
    const name = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    const args = [];
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_LPAREN;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    Parser_next_token;
    p;
    while (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_RPAREN;
    // Unknown stmt kind: 0
    p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_EOF;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const arg_name = "";
    const arg_val = 0;
    const is_named = false;
    if (p) {
    cur_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_IDENTIFIER;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    if (p) {
    peek_token;
}
    // Unknown stmt kind: 0
    kind;
    // Unknown stmt kind: 0
    TOKEN_ASSIGN;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    is_named = true;
}
// Unknown stmt kind: undefined
if (is_named) {
    arg_name = p;
    // Unknown stmt kind: 0
    cur_token;
    // Unknown stmt kind: 0
    lexeme;
    Parser_next_token;
    p;
    Parser_next_token;
    p;
    arg_val = Parser_parse_expression;
    p;
} else {
    arg_val = Parser_parse_expression;
    p;
}
const field = new StructInitField({ name: arg_name, value: arg_val });
 args.push(field); 
if (p) {
    cur_token;
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
return new Decorator({ name: name, args: args });
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_parser = new_parser;
    exports.Parser_next_token = Parser_next_token;
    exports.Parser_parse_program = Parser_parse_program;
    exports.Parser_parse_statement = Parser_parse_statement;
    exports.Parser_parse_import = Parser_parse_import;
    exports.Parser_parse_package = Parser_parse_package;
    exports.Parser_parse_let = Parser_parse_let;
    exports.Parser_parse_return = Parser_parse_return;
    exports.Parser_parse_fn = Parser_parse_fn;
    exports.Parser_parse_struct = Parser_parse_struct;
    exports.Parser_parse_native_block = Parser_parse_native_block;
    exports.Parser_parse_block = Parser_parse_block;
    exports.Parser_parse_expr_stmt = Parser_parse_expr_stmt;
    exports.Parser_parse_expression = Parser_parse_expression;
    exports.Parser_parse_assignment = Parser_parse_assignment;
    exports.Parser_parse_equality = Parser_parse_equality;
    exports.Parser_parse_relational = Parser_parse_relational;
    exports.Parser_parse_logic = Parser_parse_logic;
    exports.Parser_parse_term = Parser_parse_term;
    exports.Parser_parse_multiplication = Parser_parse_multiplication;
    exports.Parser_parse_factor = Parser_parse_factor;
    exports.Parser_parse_if = Parser_parse_if;
    exports.Parser_parse_while = Parser_parse_while;
    exports.Parser_parse_decorator = Parser_parse_decorator;
    exports.Parser = Parser;
}


// === Module: core/ast ===
BlockLoop: 66 (return)
const NODE_PROGRAM = 1;
const NODE_LET = 2;
const NODE_LITERAL = 3;
const NODE_FUNCTION = 4;
const NODE_BLOCK = 5;
const NODE_CALL = 6;
const NODE_RETURN = 7;
const NODE_BINARY = 8;
const NODE_MEMBER = 9;
const NODE_IMPORT = 10;
const NODE_ARRAY = 11;
const NODE_STRUCT_INIT = 12;
const NODE_IF = 13;
const NODE_WHILE = 14;
const NODE_IDENTIFIER = 15;
const NODE_ASSIGNMENT = 16;
const NODE_STRING = 17;
const NODE_BOOL = 18;
const NODE_STRUCT = 70;
const NODE_NATIVE = 80;
class Program {
    constructor(data = {}) {
        this.statements = data.statements;
    }
}
class AssignmentExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.right = data.right;
    }
}
class NativeStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.lang = data.lang;
        this.code = data.code;
    }
}
class LetStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.value = data.value;
        this.is_exported = data.is_exported;
    }
}
class ImportDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.path = data.path;
    }
}
class ExpressionStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.expr = data.expr;
    }
}
class IntegerLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class StringLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class BoolLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class StructInitExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
    }
}
class StructInitField {
    constructor(data = {}) {
        this.name = data.name;
        this.value = data.value;
    }
}
class BinaryExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.op = data.op;
        this.right = data.right;
    }
}
class MemberExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.target = data.target;
        this.property = data.property;
    }
}
class FunctionDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.params = data.params;
        this.body = data.body;
        this.is_exported = data.is_exported;
        this.decorators = data.decorators;
    }
}
class Block {
    constructor(data = {}) {
        this.kind = data.kind;
        this.statements = data.statements;
    }
}
class CallExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.function = data.function;
        this.args = data.args;
    }
}
class ReturnStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class IfStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.consequence = data.consequence;
        this.alternative = data.alternative;
    }
}
class WhileStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.body = data.body;
    }
}
class StructDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
        this.is_exported = data.is_exported;
        this.decorators = data.decorators;
    }
}
class StructField {
    constructor(data = {}) {
        this.name = data.name;
        this.typename = data.typename;
    }
}
class Decorator {
    constructor(data = {}) {
        this.name = data.name;
        this.args = data.args;
    }
}
function new_struct_field(name, typename) {
    return new StructField({ name: name, typename: typename });
}
class Identifier {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_struct_field = new_struct_field;
    exports.Program = Program;
    exports.AssignmentExpr = AssignmentExpr;
    exports.NativeStmt = NativeStmt;
    exports.LetStmt = LetStmt;
    exports.ImportDecl = ImportDecl;
    exports.ExpressionStmt = ExpressionStmt;
    exports.IntegerLiteral = IntegerLiteral;
    exports.StringLiteral = StringLiteral;
    exports.BoolLiteral = BoolLiteral;
    exports.StructInitExpr = StructInitExpr;
    exports.StructInitField = StructInitField;
    exports.BinaryExpr = BinaryExpr;
    exports.MemberExpr = MemberExpr;
    exports.FunctionDecl = FunctionDecl;
    exports.Block = Block;
    exports.CallExpr = CallExpr;
    exports.ReturnStmt = ReturnStmt;
    exports.IfStmt = IfStmt;
    exports.WhileStmt = WhileStmt;
    exports.StructDecl = StructDecl;
    exports.StructField = StructField;
    exports.Decorator = Decorator;
    exports.Identifier = Identifier;
    exports.NODE_PROGRAM = NODE_PROGRAM;
    exports.NODE_LET = NODE_LET;
    exports.NODE_LITERAL = NODE_LITERAL;
    exports.NODE_FUNCTION = NODE_FUNCTION;
    exports.NODE_BLOCK = NODE_BLOCK;
    exports.NODE_CALL = NODE_CALL;
    exports.NODE_RETURN = NODE_RETURN;
    exports.NODE_BINARY = NODE_BINARY;
    exports.NODE_MEMBER = NODE_MEMBER;
    exports.NODE_IMPORT = NODE_IMPORT;
    exports.NODE_ARRAY = NODE_ARRAY;
    exports.NODE_STRUCT_INIT = NODE_STRUCT_INIT;
    exports.NODE_IF = NODE_IF;
    exports.NODE_WHILE = NODE_WHILE;
    exports.NODE_IDENTIFIER = NODE_IDENTIFIER;
    exports.NODE_ASSIGNMENT = NODE_ASSIGNMENT;
    exports.NODE_STRING = NODE_STRING;
    exports.NODE_BOOL = NODE_BOOL;
    exports.NODE_STRUCT = NODE_STRUCT;
    exports.NODE_NATIVE = NODE_NATIVE;
}


// === Module: core/codegen ===
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (python)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 42 (()
BlockLoop: 10 (program)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 11 (91)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_LITERAL)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (true)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (false)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (null)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 66 (return)
BlockLoop: 31 (.)
BlockLoop: 10 (value)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_IMPORT)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 42 (()
BlockLoop: 10 (stmt)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (path)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (name)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 21 (+)
BlockLoop: 10 (name)
BlockLoop: 21 (+)
BlockLoop: 12 ( {\n    constructor(data = {}) {\n)
BlockLoop: 21 (+)
BlockLoop: 10 (assignments)
BlockLoop: 21 (+)
BlockLoop: 12 (    }\n})
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (out)
BlockLoop: 21 (+)
BlockLoop: 12 (})
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_LITERAL)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 31 (.)
BlockLoop: 10 (value)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_STRING)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 21 (+)
BlockLoop: 10 (expr)
BlockLoop: 31 (.)
BlockLoop: 10 (value)
BlockLoop: 21 (+)
BlockLoop: 12 (')
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
var ast = exports;
var token = exports;
class CodeGenerator {
    constructor(data = {}) {
        this.target = data.target;
        this.indent = data.indent;
    }
}
function new_code_generator(target) {
    return new CodeGenerator({ target: target, indent: 0 });
}
function CodeGenerator_generate(self, program) {
    if (self) {
    target;
}
    // Unknown stmt kind: 0
    "python";
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return CodeGenerator_generate_python;
    self;
    program;
    // Unknown stmt kind: 0
}
const output = "";

        if (program && program.statements) {
            for (const stmt of program.statements) {
                output = output + CodeGenerator_gen_statement(self, stmt) + "\n";
            }
        }
    
const exports = [];

        if (program && program.statements) {
             for (const stmt of program.statements) {
                 if (stmt.is_exported && stmt.name) {
                     exports.push(stmt.name);
                 }
             }
        }
        if (exports.length > 0) {
            output += "\n\n";
        }
    
return output;
// Unknown stmt kind: undefined
function CodeGenerator_generate_python(self, program) {
    const output = "";
    
        output = "# Generated by Omni Compiler\n\n";
        output += "# Decorator stubs\n";
        output += "def entity(cls):\n    return cls\n\n";
        output += "def ui(*args, **kwargs):\n    def decorator(func):\n        return func\n    return decorator\n\n";
    
    
        if (program && program.statements) {
            for (const stmt of program.statements) {
                self.indent = 0; // Reset indent for each top-level statement
                output = output + CodeGenerator_gen_stmt_py(self, stmt) + "\n";
            }
        }
    
    const py_exports = [];
    
        if (program && program.statements) {
             for (const stmt of program.statements) {
                 if (stmt.is_exported && stmt.name) {
                     py_exports.push("'" + stmt.name + "'");
                 }
             }
        }
        if (py_exports.length > 0) {
            output += "\n__all__ = [" + py_exports.join(", ") + "]\n";
        }
    
    return output;
}
function CodeGenerator_gen_stmt_py(self, stmt) {
    const indent_str = "";
     indent_str = "    ".repeat(self.indent); 
    if (stmt) {
    kind;
}
    // Unknown stmt kind: 0
    91;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return "";
}
if (stmt) {
    kind;
}
const path = stmt;
const name = "";

             path = path.replace(".omni", "");
             path = path.replace(/\//g, "."); // core/token -> core.token
             if (path.startsWith(".")) path = path.substring(1); // ./core -> /core -> core (fix logic later if needed)
             if (path.startsWith(".")) path = path.substring(1);
             name = path.split(".").pop();
        
return indent_str;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
if (stmt) {
    lang;
}
return stmt;
// Unknown stmt kind: undefined
return "";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return indent_str;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return indent_str;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const decorators = CodeGenerator_gen_decorators_py;
const params = "";
 params = stmt.params.join(", "); 
const decl = indent_str;
const body = CodeGenerator_gen_block_py;
return decorators;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const decorators = CodeGenerator_gen_decorators_py;
const decl = indent_str;
const init_indent = "";
 init_indent = "    ".repeat(self.indent); 
const assignments = "";

             if (stmt.fields.length == 0) {
                 assignments = init_indent + "    pass";
             } else {
                 for(let f of stmt.fields) {
                     assignments += init_indent + "    self." + f.name + " = data.get('" + f.name + "')\n";
                 }
             }
        
const init_fn = init_indent;
return decorators;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expr_py;
const out = indent_str;
if (stmt) {
    alternative;
}
// Unknown stmt kind: undefined
return out;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expr_py;
const out = indent_str;
return out;
// Unknown stmt kind: undefined
if (stmt) {
    expr;
}
return indent_str;
// Unknown stmt kind: undefined
return indent_str;
// Unknown stmt kind: undefined
function CodeGenerator_gen_decorators_py(self, decorators) {
    const out = "";
    const indent_str = "";
     indent_str = "    ".repeat(self.indent); 
    
        if (decorators && decorators.length > 0) {
             for (let d of decorators) {
                 let args = "";
                 if (d.args && d.args.length > 0) {
                     let arg_list = [];
                     for (let a of d.args) {
                         // struct init fields: {name: "x", value: expr}
                         let val = CodeGenerator_gen_expr_py(self, a.value);
                         if (a.name && a.name !== "") {
                             arg_list.push(a.name + "=" + val);
                         } else {
                             arg_list.push(val);
                         }
                     }
                     args = "(" + arg_list.join(", ") + ")";
                 }
                 out += indent_str + "@" + d.name + args + "\n";
             }
        }
    
    return out;
}
function CodeGenerator_gen_block_py(self, block) {
    const out = "";
    
        if (!block.statements || block.statements.length == 0) {
             out = "    ".repeat(self.indent) + "pass";
        } else {
             for (const s of block.statements) {
                  out = out + CodeGenerator_gen_stmt_py(self, s) + "\n";
             }
        }
    
    return out;
}
function CodeGenerator_gen_expr_py(self, expr) {
    if (expr) {
    0;
}
    // Unknown stmt kind: 0
    return "None";
    if (expr) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_LITERAL;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    if (expr) {
    value;
}
    // Unknown stmt kind: 0
    "true";
    // Unknown stmt kind: 0
    return "True";
    if (expr) {
    value;
}
    // Unknown stmt kind: 0
    "false";
    // Unknown stmt kind: 0
    return "False";
    if (expr) {
    value;
}
    // Unknown stmt kind: 0
    "null";
    // Unknown stmt kind: 0
    return "None";
    return expr;
    // Unknown stmt kind: 0
    value;
}
if (expr) {
    kind;
}
return "'";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
if (expr) {
    value;
}
return "True";
// Unknown stmt kind: undefined
return "False";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const op = expr;
if (op) {
    "&&";
}
if (op) {
    "||";
}
if (op) {
    "!";
}
return CodeGenerator_gen_expr_py;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const callee = CodeGenerator_gen_expr_py;
const args = "";

            let list = [];
            for(let a of expr.args) list.push(CodeGenerator_gen_expr_py(self, a));
            args = list.join(", ");
        
return callee;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return CodeGenerator_gen_expr_py;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const fields = "";

              let list = [];
              for(let f of expr.fields) {
                   list.push("'" + f.name + "': " + CodeGenerator_gen_expr_py(self, f.value));
              }
              fields = list.join(", ");
         
return expr;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const elems = "";

             let list = [];
             for (let e of expr.elements) list.push(CodeGenerator_gen_expr_py(self, e));
             elems = list.join(", ");
         
return "[";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return expr;
if (expr) {
    kind;
}
return CodeGenerator_gen_expr_py;
// Unknown stmt kind: undefined
 if (typeof(expr) == "string") return expr; 
return "None";
// Unknown stmt kind: undefined
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_IMPORT;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return CodeGenerator_gen_import;
    self;
    stmt;
    // Unknown stmt kind: 0
}
if (stmt) {
    kind;
}
if (stmt) {
    lang;
}
return stmt;
// Unknown stmt kind: undefined
return "";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return "let ";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return "return ";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const params = "";
 params = stmt.params.join(", "); 
const body = CodeGenerator_gen_block;
const decl = "function ";
const decorators_code = CodeGenerator_gen_decorators;
if (decorators_code) {
    "";
}
// Unknown stmt kind: undefined
return decl;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const decl = CodeGenerator_gen_struct;
const decorators_code = CodeGenerator_gen_decorators;
if (decorators_code) {
    "";
}
// Unknown stmt kind: undefined
return decl;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expression;
const cons = CodeGenerator_gen_block;
const alt = "";
if (stmt) {
    alternative;
}
// Unknown stmt kind: undefined
return "if (";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expression;
const body = CodeGenerator_gen_block;
return "while (";
// Unknown stmt kind: undefined
if (stmt) {
    expr;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
return "// Unknown stmt kind: ";
// Unknown stmt kind: undefined
function CodeGenerator_gen_import(self, stmt) {
    const path = stmt;
    // Unknown stmt kind: 0
    path;
    
        path = path.replace(".omni", ".js");
        if (path.startsWith(".") == false) path = "./" + path;
        // Extrai nome do arquivo para variável: "./core/token.js" -> "token"
        let name = path.split("/").pop().replace(".js", "");
        // Gera: var token = exports;
        return "const " + name + " = require(\"" + path + "\");\n" +
               "if (typeof global !== 'undefined') Object.assign(global, " + name + ");";
    
    return "";
}
function CodeGenerator_gen_struct(self, stmt) {
    const name = stmt;
    // Unknown stmt kind: 0
    name;
    const assignments = "";
    
        for (const field of stmt.fields) {
             assignments = assignments + "        this." + field.name + " = data." + field.name + ";\n";
        }
    
    return "class ";
    // Unknown stmt kind: 0
    name;
    // Unknown stmt kind: 0
    " {\n    constructor(data = {}) {\n";
    // Unknown stmt kind: 0
    assignments;
    // Unknown stmt kind: 0
    "    }\n}";
}
function CodeGenerator_gen_block(self, block) {
    const out = "{\n";
    
        if (block && block.statements) {
            for (const s of block.statements) {
                out = out + "    " + CodeGenerator_gen_statement(self, s) + "\n";
            }
        }
    
    out = out;
    // Unknown stmt kind: 0
    "}";
    return out;
}
function CodeGenerator_gen_expression(self, expr) {
    if (expr) {
    0;
}
    // Unknown stmt kind: 0
    return "null";
    if (expr) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_LITERAL;
    // Unknown stmt kind: 0
    return expr;
    // Unknown stmt kind: 0
    value;
    if (expr) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_STRING;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return "'";
    // Unknown stmt kind: 0
    expr;
    // Unknown stmt kind: 0
    value;
    // Unknown stmt kind: 0
    "'";
}
if (expr) {
    kind;
}
if (expr) {
    value;
}
return "true";
// Unknown stmt kind: undefined
return "false";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const args = "";

             let list = [];
             for(let a of expr.args) list.push(CodeGenerator_gen_expression(self, a));
             args = list.join(", ");
         
const callee = CodeGenerator_gen_expression;
const is_class = false;

             if (typeof expr.function.value === 'string') {
                 let val = expr.function.value;
                 let first = val.charAt(0);
                 is_class = (first >= "A" && first <= "Z") && (val.indexOf("_") == -1);
             }
         
if (is_class) {
    return "new ";
}
return callee;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const fields = "";

            let list = [];
            for(let f of expr.fields) {
                list.push(f.name + ": " + CodeGenerator_gen_expression(self, f.value));
            }
            fields = list.join(", ");
        
return "new ";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const elems = "";

            let list = [];
            for (let e of expr.elements) {
                list.push(CodeGenerator_gen_expression(self, e));
            }
            elems = list.join(", ");
        
return "[";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return expr;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const left = CodeGenerator_gen_expression;
const right = CodeGenerator_gen_expression;
const code = "";
 code = left + " = " + right; 
return code;
// Unknown stmt kind: undefined
 if (typeof(expr) == "string") return expr; 
return expr;
// Unknown stmt kind: undefined
function CodeGenerator_gen_decorators(self, target_name, decorators) {
    const out = "";
    
        if (decorators && decorators.length > 0) {
             let dec_list = [];
             for (let d of decorators) {
                 let args = "[]";
                 if (d.args && d.args.length > 0) {
                     let arg_list = [];
                     for (let a of d.args) {
                         // struct init fields: {name: "x", value: expr}
                         let val = CodeGenerator_gen_expression(self, a.value);
                         if (a.name && a.name !== "") {
                             arg_list.push('{ name: "' + a.name + '", value: ' + val + ' }');
                         } else {
                             arg_list.push('{ value: ' + val + ' }');
                         }
                     }
                     args = "[" + arg_list.join(", ") + "]";
                 }
                 dec_list.push('{ name: "' + d.name + '", args: ' + args + ' }');
             }
             out = target_name + ".decorators = [" + dec_list.join(", ") + "];";
        }
    
    return out;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_code_generator = new_code_generator;
    exports.CodeGenerator_generate = CodeGenerator_generate;
    exports.CodeGenerator_generate_python = CodeGenerator_generate_python;
    exports.CodeGenerator_gen_stmt_py = CodeGenerator_gen_stmt_py;
    exports.CodeGenerator_gen_decorators_py = CodeGenerator_gen_decorators_py;
    exports.CodeGenerator_gen_block_py = CodeGenerator_gen_block_py;
    exports.CodeGenerator_gen_expr_py = CodeGenerator_gen_expr_py;
    exports.CodeGenerator_gen_statement = CodeGenerator_gen_statement;
    exports.CodeGenerator_gen_import = CodeGenerator_gen_import;
    exports.CodeGenerator_gen_struct = CodeGenerator_gen_struct;
    exports.CodeGenerator_gen_block = CodeGenerator_gen_block;
    exports.CodeGenerator_gen_expression = CodeGenerator_gen_expression;
    exports.CodeGenerator_gen_decorators = CodeGenerator_gen_decorators;
    exports.CodeGenerator = CodeGenerator;
}


// === Module: core/vm ===
BlockLoop: 61 (let)
BlockLoop: 40 (,)
BlockLoop: 10 (functions)
BlockLoop: 30 (:)
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
var ast = exports;
var token = exports;
class VMEnvironment {
    constructor(data = {}) {
        this.variables = data.variables;
        this.functions = data.functions;
        this.parent = data.parent;
        this.call_stack = data.call_stack;
    }
}
function VMEnvironment_new(parent) {
    const env = new VMEnvironment({ variables: null });
    // Unknown stmt kind: 0
    functions;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined

        env.functions['print'] = (...args) => { console.log(...args); return null; };
        env.functions['read_file'] = (path) => {
            // const fs = require('fs'); (hoisted)
            return fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '';
        };
        env.functions['write_file'] = (path, content) => {
            // const fs = require('fs'); (hoisted)
            fs.writeFileSync(path, content);
            return null;
        };
        env.functions['len'] = (arr) => Array.isArray(arr) ? arr.length : 0;
        env.functions['push'] = (arr, val) => { arr.push(val); return arr; };
        env.functions['pop'] = (arr) => arr.pop();
        env.functions['keys'] = (obj) => Object.keys(obj);
        env.functions['values'] = (obj) => Object.values(obj);
        env.functions['typeof'] = (val) => typeof val;
        env.functions['parseInt'] = (s) => parseInt(s, 10);
        env.functions['parseFloat'] = (s) => parseFloat(s);
        env.functions['toString'] = (val) => String(val);
        env.functions['JSON_parse'] = (s) => JSON.parse(s);
        env.functions['JSON_stringify'] = (obj) => JSON.stringify(obj);
    
return env;
// Unknown stmt kind: undefined
function VMEnvironment_get(self, name) {
    const result = 0;
    
        if (self.variables.hasOwnProperty(name)) {
            result = self.variables[name];
        } else if (self.parent) {
            result = VMEnvironment_get(self.parent, name);
        } else {
            result = undefined;
        }
    
    return result;
}
function VMEnvironment_set(self, name, value) {
    
        self.variables[name] = value;
    
}
function VMEnvironment_get_function(self, name) {
    const result = 0;
    
        if (self.functions.hasOwnProperty(name)) {
            result = self.functions[name];
        } else if (self.parent) {
            result = VMEnvironment_get_function(self.parent, name);
        } else {
            result = null;
        }
    
    return result;
}
function VMEnvironment_set_function(self, name, func) {
    
        self.functions[name] = func;
    
}
class OmniVM {
    constructor(data = {}) {
        this.env = data.env;
        this.trace = data.trace;
        this.step_count = data.step_count;
    }
}
function OmniVM_new() {
    const env = VMEnvironment_new;
    0;
    return new OmniVM({ env: env, trace: false, step_count: 0 });
}
function OmniVM_run(self, program) {
    const result = 0;
    
        if (!program || !program.statements) {
            console.error("[vm] Invalid program");
            return null;
        }
        
        console.log("[vm] Starting execution...");
        const startTime = Date.now();
        
        try {
            // Execute all statements
            for (const stmt of program.statements) {
                self.step_count++;
                result = OmniVM_exec_statement(self, stmt);
            }
            
            // Call main() if exists
            const mainFn = VMEnvironment_get_function(self.env, 'main');
            if (mainFn && typeof mainFn === 'object' && mainFn._omni_fn) {
                result = OmniVM_call_function(self, mainFn, []);
            }
            
            const elapsed = Date.now() - startTime;
            console.log("[vm] Execution completed in " + elapsed + "ms");
            console.log("[vm] Steps executed: " + self.step_count);
            
        } catch (e) {
            console.error("[vm] Runtime error:", e.message);
            if (self.trace) {
                console.error(e.stack);
            }
        }
    
    return result;
}
function OmniVM_exec_statement(self, stmt) {
    const result = 0;
    
        if (self.trace) {
            console.log("[vm:trace] Executing stmt kind:", stmt.kind);
        }
        
        // Function declaration
        if (stmt.kind === 4) { // NODE_FUNCTION
            const fn = {
                _omni_fn: true,
                name: stmt.name,
                params: stmt.params || [],
                body: stmt.body
            };
            VMEnvironment_set_function(self.env, stmt.name, fn);
            return null;
        }
        
        // Struct declaration
        if (stmt.kind === 70) { // NODE_STRUCT
            const structDef = {
                _omni_struct: true,
                name: stmt.name,
                fields: stmt.fields || []
            };
            VMEnvironment_set(self.env, stmt.name, structDef);
            return null;
        }
        
        // Let declaration
        if (stmt.kind === 2) { // NODE_LET
            const value = OmniVM_eval_expression(self, stmt.value);
            VMEnvironment_set(self.env, stmt.name, value);
            return null;
        }
        
        // Return statement
        if (stmt.kind === 7) { // NODE_RETURN
            const value = OmniVM_eval_expression(self, stmt.value);
            throw { _omni_return: true, value: value };
        }
        
        // If statement
        if (stmt.kind === 13) { // NODE_IF
            const condition = OmniVM_eval_expression(self, stmt.condition);
            if (condition) {
                return OmniVM_exec_block(self, stmt.consequence);
            } else if (stmt.alternative) {
                return OmniVM_exec_block(self, stmt.alternative);
            }
            return null;
        }
        
        // While statement
        if (stmt.kind === 14) { // NODE_WHILE
            let loopResult = null;
            while (OmniVM_eval_expression(self, stmt.condition)) {
                loopResult = OmniVM_exec_block(self, stmt.body);
                self.step_count++;
                // Safety limit
                if (self.step_count > 1000000) {
                    throw new Error("Infinite loop detected");
                }
            }
            return loopResult;
        }
        
        // Assignment
        if (stmt.kind === 16) { // NODE_ASSIGNMENT
            const value = OmniVM_eval_expression(self, stmt.value);
            VMEnvironment_set(self.env, stmt.name, value);
            return null;
        }
        
        // Call as statement
        if (stmt.kind === 6) { // NODE_CALL
            return OmniVM_eval_expression(self, stmt);
        }
        
        // Import (skip for VM)
        if (stmt.kind === 10) { // NODE_IMPORT
            return null;
        }
        
        // Native block (skip for VM)
        if (stmt.kind === 80) { // NODE_NATIVE
            return null;
        }
        
        // Capsule (register flows)
        if (stmt.kind === 93) { // NODE_CAPSULE
            const capsule = {
                _omni_capsule: true,
                name: stmt.name,
                flows: {}
            };
            for (const flow of (stmt.flows || [])) {
                capsule.flows[flow.name] = {
                    params: flow.params,
                    body: flow.body
                };
            }
            VMEnvironment_set(self.env, stmt.name, capsule);
            return null;
        }
        
        console.warn("[vm] Unknown statement kind:", stmt.kind);
        return null;
    
    return result;
}
function OmniVM_exec_block(self, block) {
    const result = 0;
    
        if (!block) return null;
        
        const statements = Array.isArray(block) ? block : (block.statements || []);
        
        for (const stmt of statements) {
            self.step_count++;
            result = OmniVM_exec_statement(self, stmt);
        }
    
    return result;
}
function OmniVM_eval_expression(self, expr) {
    const result = 0;
    
        if (!expr) return null;
        
        // Literal
        if (expr.kind === 3) { // NODE_LITERAL
            const val = expr.value;
            if (val === 'true') return true;
            if (val === 'false') return false;
            if (val === 'null') return null;
            return isNaN(Number(val)) ? val : Number(val);
        }
        
        // String
        if (expr.kind === 17) { // NODE_STRING
            return expr.value;
        }
        
        // Boolean
        if (expr.kind === 18) { // NODE_BOOL
            return expr.value;
        }
        
        // Identifier
        if (expr.kind === 15) { // NODE_IDENTIFIER
            const name = expr.value || expr.name;
            return VMEnvironment_get(self.env, name);
        }
        
        // Binary expression
        if (expr.kind === 8) { // NODE_BINARY
            const left = OmniVM_eval_expression(self, expr.left);
            const right = OmniVM_eval_expression(self, expr.right);
            const op = expr.op;
            
            switch (op) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '%': return left % right;
                case '==': return left === right;
                case '!=': return left !== right;
                case '<': return left < right;
                case '<=': return left <= right;
                case '>': return left > right;
                case '>=': return left >= right;
                case '&&': return left && right;
                case '||': return left || right;
                default: throw new Error("Unknown operator: " + op);
            }
        }
        
        // Call expression
        if (expr.kind === 6) { // NODE_CALL
            const fnName = expr.name || (expr.callee ? expr.callee.value : '');
            const args = (expr.args || []).map(a => OmniVM_eval_expression(self, a));
            
            // Check builtin
            const builtin = VMEnvironment_get_function(self.env, fnName);
            if (builtin && typeof builtin === 'function') {
                return builtin(...args);
            }
            
            // Check user function
            if (builtin && builtin._omni_fn) {
                return OmniVM_call_function(self, builtin, args);
            }
            
            throw new Error("Function not found: " + fnName);
        }
        
        // Member access
        if (expr.kind === 9) { // NODE_MEMBER
            const obj = OmniVM_eval_expression(self, expr.object);
            return obj ? obj[expr.member] : undefined;
        }
        
        // Array literal
        if (expr.kind === 11) { // NODE_ARRAY
            return (expr.elements || []).map(e => OmniVM_eval_expression(self, e));
        }
        
        // Struct init
        if (expr.kind === 12) { // NODE_STRUCT_INIT
            const obj = {};
            if (expr.fields) {
                for (const [k, v] of Object.entries(expr.fields)) {
                    obj[k] = OmniVM_eval_expression(self, v);
                }
            }
            return obj;
        }
        
        return expr.value;
    
    return result;
}
function OmniVM_call_function(self, func, args) {
    const result = 0;
    
        // Create new environment for function scope
        const prevEnv = self.env;
        self.env = VMEnvironment_new(prevEnv);
        
        // Bind parameters
        for (let i = 0; i < func.params.length; i++) {
            const paramName = typeof func.params[i] === 'string' ? func.params[i] : func.params[i].name;
            VMEnvironment_set(self.env, paramName, args[i]);
        }
        
        try {
            result = OmniVM_exec_block(self, func.body);
        } catch (e) {
            if (e._omni_return) {
                result = e.value;
            } else {
                throw e;
            }
        }
        
        // Restore environment
        self.env = prevEnv;
    
    return result;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.VMEnvironment_new = VMEnvironment_new;
    exports.VMEnvironment_get = VMEnvironment_get;
    exports.VMEnvironment_set = VMEnvironment_set;
    exports.VMEnvironment_get_function = VMEnvironment_get_function;
    exports.VMEnvironment_set_function = VMEnvironment_set_function;
    exports.OmniVM_new = OmniVM_new;
    exports.OmniVM_run = OmniVM_run;
    exports.OmniVM_exec_statement = OmniVM_exec_statement;
    exports.OmniVM_exec_block = OmniVM_exec_block;
    exports.OmniVM_eval_expression = OmniVM_eval_expression;
    exports.OmniVM_call_function = OmniVM_call_function;
    exports.VMEnvironment = VMEnvironment;
    exports.OmniVM = OmniVM;
}


// === Module: core/framework_adapter ===
BlockLoop: 66 (return)
BlockLoop: 40 (,)
BlockLoop: 10 (server_templates)
BlockLoop: 30 (:)
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
var ast = exports;
class FrameworkAdapter {
    constructor(data = {}) {
        this.name = data.name;
        this.language = data.language;
        this.ui_templates = data.ui_templates;
        this.server_templates = data.server_templates;
        this.structure = data.structure;
    }
}
function FrameworkAdapter_new(name) {
    return new FrameworkAdapter({ name: name, language: "javascript", ui_templates: null });
    // Unknown stmt kind: 0
    server_templates;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
function FrameworkAdapter_nextjs() {
    const adapter = FrameworkAdapter_new;
    "nextjs";
    
        adapter.language = "typescript";
        
        // UI Templates
        adapter.ui_templates = {
            page: `// Generated by Omni Compiler
import { Suspense } from 'react';

export default function {name}Page() {
    return (
        <main className="container mx-auto p-4">
            {content}
        </main>
    );
}`,
            
            component: `'use client';

import { useState } from 'react';

export function {name}({props}) {
    {body}
}`,
            
            button: `<button
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onClick={{action}}
>
    {label}
</button>`,
            
            input: `<input
    type="{type}"
    className="border rounded px-3 py-2"
    placeholder="{placeholder}"
    onChange={(e) => {onChange}(e.target.value)}
/>`,
            
            list: `<div className="space-y-2">
    {{items}.map((item, index) => (
        <div key={index}>
            {renderItem}
        </div>
    ))}
</div>`,

            card: `<div className="bg-white rounded-lg shadow p-4">
    {content}
</div>`
        };
        
        // Server Templates
        adapter.server_templates = {
            route: `// Generated by Omni Compiler
import { NextRequest, NextResponse } from 'next/server';

export async function {method}(request: NextRequest) {
    try {
        {body}
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}`,
            
            middleware: `// Generated by Omni Compiler
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    {body}
    return NextResponse.next();
}

export const config = {
    matcher: '{matcher}',
};`
        };
        
        // Project Structure
        adapter.structure = {
            'app/layout.tsx': `// Generated by Omni Compiler
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '{projectName}',
    description: 'Generated by Omni Compiler',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}`,
            
            'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
            
            'tailwind.config.ts': `import type { Config } from 'tailwindcss';

export default {
    content: ['./app/**/*.{js,ts,jsx,tsx}'],
    theme: { extend: {} },
    plugins: [],
} satisfies Config;`
        };
    
    return adapter;
}
function FrameworkAdapter_laravel() {
    const adapter = FrameworkAdapter_new;
    "laravel";
    
        adapter.language = "php";
        
        // UI Templates (Blade)
        adapter.ui_templates = {
            page: `{{-- Generated by Omni Compiler --}}
@extends('layouts.app')

@section('title', '{title}')

@section('content')
<div class="container mx-auto px-4 py-8">
    {content}
</div>
@endsection`,
            
            component: `{{-- Component: {name} --}}
<div class="component-{name}">
    {content}
</div>`,
            
            button: `<button 
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onclick="{action}"
>
    {label}
</button>`,
            
            list: `@foreach({items} as $item)
    <div class="p-2">
        {renderItem}
    </div>
@endforeach`,

            card: `<div class="bg-white rounded-lg shadow p-4">
    {content}
</div>`
        };
        
        // Server Templates
        adapter.server_templates = {
            controller: `<?php
// Generated by Omni Compiler

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class {name}Controller extends Controller
{
    {methods}
}`,
            
            route_get: `Route::get('{path}', [{controller}::class, '{method}']);`,
            route_post: `Route::post('{path}', [{controller}::class, '{method}']);`,
            
            controller_method: `
    public function {name}(Request $request): JsonResponse
    {
        {body}
        return response()->json(['success' => true, 'data' => $result]);
    }`,
            
            middleware: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class {name}Middleware
{
    public function handle(Request $request, Closure $next)
    {
        {body}
        return $next($request);
    }
}`
        };
        
        // Project Structure
        adapter.structure = {
            'routes/api.php': `<?php
// Generated by Omni Compiler

use Illuminate\\Support\\Facades\\Route;

{routes}`,
            
            'resources/views/layouts/app.blade.php': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', '{projectName}')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @yield('content')
</body>
</html>`
        };
    
    return adapter;
}
function FrameworkAdapter_android() {
    const adapter = FrameworkAdapter_new;
    "android";
    
        adapter.language = "kotlin";
        
        // UI Templates (Jetpack Compose)
        adapter.ui_templates = {
            screen: `// Generated by Omni Compiler
package {package}

import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier

@Composable
fun {name}Screen(
    onNavigate: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp)
    ) {
        {content}
    }
}`,
            
            button: `Button(
    onClick = { {action} },
    modifier = Modifier.fillMaxWidth()
) {
    Text("{label}")
}`,
            
            input: `var {name} by remember { mutableStateOf("") }
OutlinedTextField(
    value = {name},
    onValueChange = { {name} = it },
    label = { Text("{label}") },
    modifier = Modifier.fillMaxWidth()
)`,
            
            list: `LazyColumn {
    items({items}) { item ->
        {renderItem}
    }
}`,
            
            card: `Card(
    modifier = Modifier.fillMaxWidth().padding(8.dp)
) {
    Column(modifier = Modifier.padding(16.dp)) {
        {content}
    }
}`
        };
        
        // Server Templates (Ktor client)
        adapter.server_templates = {
            api_call: `suspend fun {name}({params}): Result<{returnType}> {
    return try {
        val response = httpClient.{method}("{url}") {
            contentType(ContentType.Application.Json)
            {body}
        }
        Result.success(response.body())
    } catch (e: Exception) {
        Result.failure(e)
    }
}`,
            
            repository: `// Generated by Omni Compiler
package {package}

import io.ktor.client.*
import io.ktor.client.request.*
import kotlinx.coroutines.*

class {name}Repository(
    private val httpClient: HttpClient
) {
    {methods}
}`
        };
    
    return adapter;
}
class FrameworkGenerator {
    constructor(data = {}) {
        this.adapter = data.adapter;
        this.output_dir = data.output_dir;
        this.files = data.files;
    }
}
function FrameworkGenerator_new(framework, output_dir) {
    const adapter = FrameworkAdapter_new;
    framework;
    
        switch (framework) {
            case 'nextjs':
            case 'next':
                adapter = FrameworkAdapter_nextjs();
                break;
            case 'laravel':
                adapter = FrameworkAdapter_laravel();
                break;
            case 'android':
            case 'kotlin':
                adapter = FrameworkAdapter_android();
                break;
            default:
                console.warn("[adapter] Unknown framework:", framework);
        }
    
    return new FrameworkGenerator({ adapter: adapter, output_dir: output_dir, files: null });
}
// Unknown stmt kind: undefined
function FrameworkGenerator_generate_structure(self, project_name) {
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Create base directory
        if (!fs.existsSync(self.output_dir)) {
            fs.mkdirSync(self.output_dir, { recursive: true });
        }
        
        // Generate structure files
        for (const [filePath, template] of Object.entries(self.adapter.structure)) {
            const fullPath = path.join(self.output_dir, filePath);
            const dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            const content = template
                .replace(/\{projectName\}/g, project_name)
                .replace(/\{package\}/g, 'com.omni.' + project_name.toLowerCase());
            
            fs.writeFileSync(fullPath, content);
            console.log("[adapter] Created:", filePath);
        }
    
}
function FrameworkGenerator_generate_ui(self, name, annotation) {
    const result = "";
    
        const templateName = annotation.type || 'component';
        const template = self.adapter.ui_templates[templateName];
        
        if (!template) {
            result = "/* UI template not found: " + templateName + " */";
            return;
        }
        
        result = template
            .replace(/\{name\}/g, name)
            .replace(/\{label\}/g, annotation.label || name)
            .replace(/\{action\}/g, annotation.action || 'onClick')
            .replace(/\{content\}/g, annotation.content || '')
            .replace(/\{props\}/g, annotation.props || '');
    
    return result;
}
function FrameworkGenerator_generate_server(self, capsule) {
    const result = "";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const capsuleName = capsule.name;
        const flows = capsule.flows || [];
        
        if (self.adapter.name === 'nextjs') {
            // Generate API routes for Next.js
            for (const flow of flows) {
                const serverAttr = flow.attributes?.find(a => a.name.startsWith('server.'));
                if (serverAttr) {
                    const method = serverAttr.name.split('.')[1].toUpperCase();
                    const routePath = serverAttr.args?.[0] || '/' + capsuleName.toLowerCase() + '/' + flow.name;
                    
                    const template = self.adapter.server_templates.route;
                    const code = template
                        .replace(/\{method\}/g, method)
                        .replace(/\{body\}/g, 'const result = await ' + capsuleName + '.' + flow.name + '();');
                    
                    // Write route file
                    const routeDir = path.join(self.output_dir, 'app/api', capsuleName.toLowerCase(), flow.name);
                    if (!fs.existsSync(routeDir)) {
                        fs.mkdirSync(routeDir, { recursive: true });
                    }
                    fs.writeFileSync(path.join(routeDir, 'route.ts'), code);
                    console.log("[adapter] Created: app/api/" + capsuleName.toLowerCase() + "/" + flow.name + "/route.ts");
                }
            }
        } else if (self.adapter.name === 'laravel') {
            // Generate Controller for Laravel
            let methods = '';
            let routes = '';
            
            for (const flow of flows) {
                const serverAttr = flow.attributes?.find(a => a.name.startsWith('server.'));
                if (serverAttr) {
                    const httpMethod = serverAttr.name.split('.')[1];
                    const routePath = serverAttr.args?.[0] || '/' + capsuleName.toLowerCase() + '/' + flow.name;
                    
                    methods += self.adapter.server_templates.controller_method
                        .replace(/\{name\}/g, flow.name)
                        .replace(/\{body\}/g, '$result = null; // TODO: implement');
                    
                    const routeTemplate = httpMethod === 'get' 
                        ? self.adapter.server_templates.route_get 
                        : self.adapter.server_templates.route_post;
                    routes += routeTemplate
                        .replace(/\{path\}/g, routePath)
                        .replace(/\{controller\}/g, capsuleName + 'Controller')
                        .replace(/\{method\}/g, flow.name) + '\n';
                }
            }
            
            const controller = self.adapter.server_templates.controller
                .replace(/\{name\}/g, capsuleName)
                .replace(/\{methods\}/g, methods);
            
            // Write controller
            const controllerDir = path.join(self.output_dir, 'app/Http/Controllers');
            if (!fs.existsSync(controllerDir)) {
                fs.mkdirSync(controllerDir, { recursive: true });
            }
            fs.writeFileSync(path.join(controllerDir, capsuleName + 'Controller.php'), controller);
            console.log("[adapter] Created: app/Http/Controllers/" + capsuleName + "Controller.php");
            
            result = routes;
        }
    
    return result;
}
function FrameworkGenerator_add_file(self, path, content) {
    
        self.files[path] = content;
    
}
function FrameworkGenerator_write_all(self) {
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        for (const [filePath, content] of Object.entries(self.files)) {
            const fullPath = path.join(self.output_dir, filePath);
            const dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(fullPath, content);
            console.log("[adapter] Written:", filePath);
        }
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.FrameworkAdapter_new = FrameworkAdapter_new;
    exports.FrameworkAdapter_nextjs = FrameworkAdapter_nextjs;
    exports.FrameworkAdapter_laravel = FrameworkAdapter_laravel;
    exports.FrameworkAdapter_android = FrameworkAdapter_android;
    exports.FrameworkGenerator_new = FrameworkGenerator_new;
    exports.FrameworkGenerator_generate_structure = FrameworkGenerator_generate_structure;
    exports.FrameworkGenerator_generate_ui = FrameworkGenerator_generate_ui;
    exports.FrameworkGenerator_generate_server = FrameworkGenerator_generate_server;
    exports.FrameworkGenerator_add_file = FrameworkGenerator_add_file;
    exports.FrameworkGenerator_write_all = FrameworkGenerator_write_all;
    exports.FrameworkAdapter = FrameworkAdapter;
    exports.FrameworkGenerator = FrameworkGenerator;
}


// === Module: core/ingestion ===
BlockLoop: 66 (return)
BlockLoop: 61 (let)
var ast = exports;
var token = exports;
class CanonicalPattern {
    constructor(data = {}) {
        this.name = data.name;
        this.language = data.language;
        this.signature = data.signature;
        this.omni_equivalent = data.omni_equivalent;
        this.confidence = data.confidence;
    }
}
function CanonicalPattern_new(name, lang, sig, omni) {
    return new CanonicalPattern({ name: name, language: lang, signature: sig, omni_equivalent: omni, confidence: 100 });
}
class PatternDatabase {
    constructor(data = {}) {
        this.patterns = data.patterns;
    }
}
function PatternDatabase_new() {
    const db = new PatternDatabase({ patterns: null });
}



// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CanonicalPattern_new = CanonicalPattern_new;
    exports.PatternDatabase_new = PatternDatabase_new;
    exports.IngestionEngine_new = IngestionEngine_new;
    exports.IngestionEngine_detect_language = IngestionEngine_detect_language;
    exports.IngestionEngine_analyze = IngestionEngine_analyze;
    exports.IngestionEngine_generate_omni = IngestionEngine_generate_omni;
    exports.IngestionEngine_report = IngestionEngine_report;
    exports.cmd_ingest = cmd_ingest;
    exports.CanonicalPattern = CanonicalPattern;
    exports.PatternDatabase = PatternDatabase;
    exports.IngestionEngine = IngestionEngine;
}


// === Module: core/package_manager ===
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (cmd_install_from_lock)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_step)
BlockLoop: 42 (()
BlockLoop: 11 (3)
BlockLoop: 40 (,)
BlockLoop: 12 (Updating lock file...)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (LockFile_add)
BlockLoop: 42 (()
BlockLoop: 10 (pkg)
BlockLoop: 43 ())
BlockLoop: 10 (LockFile_save)
BlockLoop: 42 (()
BlockLoop: 10 (cwd)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_step)
BlockLoop: 42 (()
BlockLoop: 11 (3)
BlockLoop: 40 (,)
BlockLoop: 12 (Done!)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_success)
BlockLoop: 42 (()
BlockLoop: 10 (pkg)
BlockLoop: 31 (.)
BlockLoop: 10 (name)
BlockLoop: 43 ())
BlockLoop: 80 (native)
BlockLoop: 10 (CLI_error)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (CLI_error)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (LockFile_save)
BlockLoop: 42 (()
BlockLoop: 10 (cwd)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_success)
BlockLoop: 42 (()
BlockLoop: 10 (package_name)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_error)
BlockLoop: 42 (()
BlockLoop: 10 (package_name)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
var cli = exports;
class GitPackage {
    constructor(data = {}) {
        this.name = data.name;
        this.provider = data.provider;
        this.owner = data.owner;
        this.repo = data.repo;
        this.full_url = data.full_url;
        this.commit = data.commit;
        this.branch = data.branch;
        this.local_path = data.local_path;
    }
}
function GitPackage_parse(spec) {
    const pkg = new GitPackage({ name: "", provider: "github", owner: "", repo: "", full_url: "", commit: "", branch: "main", local_path: "" });
    
        // const path = require('path'); (hoisted)
        
        // Parse different formats:
        // github:user/repo
        // gitlab:user/repo
        // https://github.com/user/repo
        // user/repo (default to github)
        
        let input = spec.trim();
        
        if (input.startsWith('github:')) {
            pkg.provider = 'github';
            input = input.substring(7);
        } else if (input.startsWith('gitlab:')) {
            pkg.provider = 'gitlab';
            input = input.substring(7);
        } else if (input.startsWith('https://github.com/')) {
            pkg.provider = 'github';
            input = input.substring(19);
        } else if (input.startsWith('https://gitlab.com/')) {
            pkg.provider = 'gitlab';
            input = input.substring(19);
        } else if (input.startsWith('http://') || input.startsWith('https://')) {
            pkg.provider = 'url';
            pkg.full_url = input;
            // Extract name from URL
            const parts = input.split('/');
            pkg.name = parts.slice(-2).join('/');
            pkg.owner = parts[parts.length - 2];
            pkg.repo = parts[parts.length - 1].replace('.git', '');
        }
        
        // Parse owner/repo format
        if (!pkg.full_url && input.includes('/')) {
            const parts = input.split('/');
            pkg.owner = parts[0];
            pkg.repo = parts[1].replace('.git', '');
            pkg.name = pkg.owner + '/' + pkg.repo;
            
            if (pkg.provider === 'github') {
                pkg.full_url = 'https://github.com/' + pkg.owner + '/' + pkg.repo;
            } else if (pkg.provider === 'gitlab') {
                pkg.full_url = 'https://gitlab.com/' + pkg.owner + '/' + pkg.repo;
            }
        }
        
        // Set local path
        pkg.local_path = path.join('packages', pkg.owner, pkg.repo);
    
    return pkg;
}
function GitPackage_get_zip_url(pkg) {
    const url = "";
    
        if (pkg.provider === 'github') {
            // GitHub archive URL (no git required)
            const branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/archive/refs/heads/' + branch + '.zip';
        } else if (pkg.provider === 'gitlab') {
            const branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/-/archive/' + branch + '/' + pkg.repo + '-' + branch + '.zip';
        } else {
            url = pkg.full_url;
        }
    
    return url;
}
function GitPackage_get_api_url(pkg) {
    const url = "";
    
        if (pkg.provider === 'github') {
            url = 'https://api.github.com/repos/' + pkg.owner + '/' + pkg.repo;
        } else if (pkg.provider === 'gitlab') {
            url = 'https://gitlab.com/api/v4/projects/' + encodeURIComponent(pkg.owner + '/' + pkg.repo);
        }
    
    return url;
}
class LockEntry {
    constructor(data = {}) {
        this.name = data.name;
        this.url = data.url;
        this.commit = data.commit;
        this.installed_at = data.installed_at;
    }
}
class LockFile {
    constructor(data = {}) {
        this.version = data.version;
        this.packages = data.packages;
    }
}
function LockFile_load(project_dir) {
    const lock = new LockFile({ version: "1.0", packages: null });
}

        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const lockPath = path.join(project_dir, 'omni.lock');
        
        if (fs.existsSync(lockPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
                lock.version = data.version || '1.0';
                lock.packages = data.packages || {};
            } catch (e) {
                console.error('[lock] Failed to parse omni.lock: ' + e.message);
            }
        }
    
return lock;
// Unknown stmt kind: undefined
function LockFile_save(lock, project_dir) {
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const lockPath = path.join(project_dir, 'omni.lock');
        
        fs.writeFileSync(lockPath, JSON.stringify({
            version: lock.version,
            packages: lock.packages
        }, null, 2));
        
        console.log(CLI_COLORS.green + 'ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“' + CLI_COLORS.reset + ' Updated omni.lock');
    
}
function LockFile_add(lock, pkg) {
    
        lock.packages[pkg.name] = {
            name: pkg.name,
            url: pkg.full_url,
            commit: pkg.commit,
            installed_at: new Date().toISOString()
        };
    
}
function LockFile_get(lock, name) {
    const entry = new LockEntry({ name: "", url: "", commit: "", installed_at: "" });
    
        if (lock.packages[name]) {
            entry = lock.packages[name];
        }
    
    return entry;
}
function LockFile_remove(lock, name) {
    
        delete lock.packages[name];
    
}
function git_get_latest_commit(pkg) {
    const commit = "";
    
        const https = require('https');
        
        // Use GitHub API to get latest commit
        if (pkg.provider === 'github') {
            const apiUrl = 'https://api.github.com/repos/' + pkg.owner + '/' + pkg.repo + '/commits?per_page=1';
            
            console.log(CLI_COLORS.dim + '  Fetching latest commit...' + CLI_COLORS.reset);
            
            // Sync HTTP request (simplified for demo)
            const { execSync } = require('child_process');
            try {
                const result = execSync(
                    'curl -s -H "Accept: application/vnd.github.v3+json" "' + apiUrl + '"',
                    { encoding: 'utf-8' }
                );
                const data = JSON.parse(result);
                if (data && data[0] && data[0].sha) {
                    commit = data[0].sha;
                }
            } catch (e) {
                console.error(CLI_COLORS.dim + '  Could not fetch commit, using HEAD' + CLI_COLORS.reset);
            }
        }
    
    return commit;
}
function git_clone(pkg, target_dir) {
    const success = false;
    
        const { execSync, exec } = require('child_process');
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Ensure parent directory exists
        const parentDir = path.dirname(target_dir);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        
        // Remove existing directory
        if (fs.existsSync(target_dir)) {
            fs.rmSync(target_dir, { recursive: true });
        }
        
        console.log(CLI_COLORS.cyan + '  Cloning: ' + CLI_COLORS.reset + pkg.full_url);
        
        try {
            // Try git clone first (depth 1 for speed)
            execSync(
                'git clone --depth 1 --quiet "' + pkg.full_url + '.git" "' + target_dir + '"',
                { stdio: 'pipe' }
            );
            success = true;
        } catch (e) {
            // Fallback to ZIP download
            console.log(CLI_COLORS.dim + '  Git not available, using ZIP download...' + CLI_COLORS.reset);
            
            const zipUrl = GitPackage_get_zip_url(pkg);
            const zipPath = path.join(parentDir, pkg.repo + '.zip');
            
            try {
                // Download ZIP
                execSync('curl -sL "' + zipUrl + '" -o "' + zipPath + '"');
                
                // Extract
                if (process.platform === 'win32') {
                    execSync('powershell -Command "Expand-Archive -Path \'' + zipPath + '\' -DestinationPath \'' + parentDir + '\' -Force"');
                } else {
                    execSync('unzip -q "' + zipPath + '" -d "' + parentDir + '"');
                }
                
                // Rename extracted folder
                const entries = fs.readdirSync(parentDir);
                for (const entry of entries) {
                    if (entry.startsWith(pkg.repo + '-') && fs.statSync(path.join(parentDir, entry)).isDirectory()) {
                        fs.renameSync(path.join(parentDir, entry), target_dir);
                        break;
                    }
                }
                
                // Cleanup ZIP
                fs.unlinkSync(zipPath);
                
                success = true;
            } catch (e2) {
                CLI_error('Failed to download package: ' + e2.message);
            }
        }
    
    return success;
}
function cmd_install(package_spec) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Package Installer";
    if (package_spec) {
    "";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    cmd_install_from_lock;
    // Unknown stmt kind: 0
    return null;
}
const pkg = GitPackage_parse;
if (pkg) {
    name;
}
return null;
// Unknown stmt kind: undefined
const commit = git_get_latest_commit;
if (commit) {
    "";
}
// Unknown stmt kind: undefined
const cwd = "";
 cwd = process.cwd(); 
const target = "";

        // const path = require('path'); (hoisted)
        target = path.join(cwd, pkg.local_path);
    
const success = git_clone;
if (success) {
    CLI_step;
    2;
    3;
    // Unknown stmt kind: 0
    "Updating lock file...";
    // Unknown stmt kind: 0
    const lock = LockFile_load;
    cwd;
    LockFile_add;
    lock;
    pkg;
    // Unknown stmt kind: 0
    LockFile_save;
    lock;
    cwd;
    // Unknown stmt kind: 0
    CLI_step;
    3;
    3;
    // Unknown stmt kind: 0
    "Done!";
    // Unknown stmt kind: 0
    CLI_success;
    "Installed: ";
    pkg;
    // Unknown stmt kind: 0
    name;
    // Unknown stmt kind: 0
    
            console.log("");
            console.log(CLI_COLORS.cyan + "  Usage:" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + '    import "' + pkg.owner + '/' + pkg.repo + '/src/main.omni";' + CLI_COLORS.reset);
        
} else {
    CLI_error;
    "Failed to install package";
}
// Unknown stmt kind: undefined
function cmd_install_from_lock() {
    CLI_info;
    "Installing packages from omni.lock...";
    const cwd = "";
     cwd = process.cwd(); 
    const lock = LockFile_load;
    cwd;
    
        // const path = require('path'); (hoisted)
        const packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            CLI_info("No packages in omni.lock");
            return;
        }
        
        console.log(CLI_COLORS.dim + "  Found " + packages.length + " packages" + CLI_COLORS.reset);
        
        for (const entry of packages) {
            const pkg = GitPackage_parse(entry.url);
            pkg.commit = entry.commit;
            
            const target = path.join(cwd, pkg.local_path);
            
            console.log(CLI_COLORS.cyan + "  Installing: " + CLI_COLORS.reset + pkg.name);
            git_clone(pkg, target);
        }
        
        CLI_success("All packages installed!");
    
}
function cmd_uninstall(package_name) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Package Uninstaller";
    if (package_name) {
    "";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    CLI_error;
    "Usage: omni uninstall <package>";
    return null;
}
const cwd = "";
 cwd = process.cwd(); 
const lock = LockFile_load;
const found = false;

        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Find package in lock
        for (const [name, entry] of Object.entries(lock.packages)) {
            if (name === package_name || name.endsWith('/' + package_name)) {
                found = true;
                
                // Remove directory
                const pkg = GitPackage_parse(entry.url);
                const targetDir = path.join(cwd, pkg.local_path);
                
                if (fs.existsSync(targetDir)) {
                    fs.rmSync(targetDir, { recursive: true });
                    console.log(CLI_COLORS.dim + "  Removed: " + targetDir + CLI_COLORS.reset);
                }
                
                // Remove from lock
                LockFile_remove(lock, name);
                break;
            }
        }
    
if (found) {
    LockFile_save;
    lock;
    cwd;
    // Unknown stmt kind: 0
    CLI_success;
    "Uninstalled: ";
    package_name;
    // Unknown stmt kind: 0
} else {
    CLI_error;
    "Package not found: ";
    package_name;
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined
function cmd_list() {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Installed Packages";
    const cwd = "";
     cwd = process.cwd(); 
    const lock = LockFile_load;
    cwd;
    
        const packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            CLI_info("No packages installed.");
            console.log("");
            CLI_info("Install packages with: omni install github:user/repo");
            return;
        }
        
        console.log("");
        console.log(CLI_COLORS.cyan + "  " + packages.length + " packages installed:" + CLI_COLORS.reset);
        console.log("");
        
        for (const pkg of packages) {
            const commit = pkg.commit ? pkg.commit.substring(0, 8) : 'HEAD';
            console.log("  ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset + 
                        CLI_COLORS.dim + " @ " + commit + CLI_COLORS.reset);
            console.log("     " + CLI_COLORS.dim + pkg.url + CLI_COLORS.reset);
        }
        
        console.log("");
    
}
function cmd_update(package_name) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Package Updater";
    const cwd = "";
     cwd = process.cwd(); 
    const lock = LockFile_load;
    cwd;
    
        // const path = require('path'); (hoisted)
        let packagesToUpdate = Object.values(lock.packages);
        
        if (package_name) {
            packagesToUpdate = packagesToUpdate.filter(p => 
                p.name === package_name || p.name.endsWith('/' + package_name)
            );
        }
        
        if (packagesToUpdate.length === 0) {
            CLI_info("No packages to update");
            return;
        }
        
        console.log(CLI_COLORS.dim + "  Updating " + packagesToUpdate.length + " packages..." + CLI_COLORS.reset);
        
        for (const entry of packagesToUpdate) {
            const pkg = GitPackage_parse(entry.url);
            
            console.log(CLI_COLORS.cyan + "  Updating: " + CLI_COLORS.reset + pkg.name);
            
            // Get latest commit
            const newCommit = git_get_latest_commit(pkg);
            
            if (newCommit && newCommit !== entry.commit) {
                console.log(CLI_COLORS.dim + "    " + entry.commit.substring(0, 8) + " ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ " + newCommit.substring(0, 8) + CLI_COLORS.reset);
                
                pkg.commit = newCommit;
                const target = path.join(cwd, pkg.local_path);
                git_clone(pkg, target);
                
                LockFile_add(lock, pkg);
            } else {
                console.log(CLI_COLORS.dim + "    Already up to date" + CLI_COLORS.reset);
            }
        }
        
        LockFile_save(lock, cwd);
        CLI_success("Update complete!");
    
}
function cmd_doctor() {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Doctor - System Health Check";
    
        const { execSync } = require('child_process');
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let allOk = true;
        
        // Check git
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking tools:" + CLI_COLORS.reset);
        
        const tools = [
            { name: 'git', cmd: 'git --version' },
            { name: 'node', cmd: 'node --version' },
            { name: 'curl', cmd: 'curl --version' }
        ];
        
        for (const tool of tools) {
            try {
                const version = execSync(tool.cmd, { encoding: 'utf-8' }).trim().split('\n')[0];
                console.log("  " + CLI_COLORS.green + "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“" + CLI_COLORS.reset + " " + tool.name + ": " + CLI_COLORS.dim + version + CLI_COLORS.reset);
            } catch (e) {
                console.log("  " + CLI_COLORS.red + "ÃƒÂ¢Ã…â€œÃ¢â‚¬â€" + CLI_COLORS.reset + " " + tool.name + ": not found");
                allOk = false;
            }
        }
        
        // Check omni.lock
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking project:" + CLI_COLORS.reset);
        
        const cwd = process.cwd();
        const files = [
            { name: 'omni.config.json', path: path.join(cwd, 'omni.config.json') },
            { name: 'omni.lock', path: path.join(cwd, 'omni.lock') },
            { name: 'packages/', path: path.join(cwd, 'packages') }
        ];
        
        for (const file of files) {
            if (fs.existsSync(file.path)) {
                console.log("  " + CLI_COLORS.green + "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“" + CLI_COLORS.reset + " " + file.name);
            } else {
                console.log("  " + CLI_COLORS.yellow + "ÃƒÂ¢Ã¢â‚¬â€Ã¢â‚¬Â¹" + CLI_COLORS.reset + " " + file.name + CLI_COLORS.dim + " (optional)" + CLI_COLORS.reset);
            }
        }
        
        console.log("");
        if (allOk) {
            CLI_success("All systems operational!");
        } else {
            CLI_warning("Some tools are missing. Git is recommended for package installation.");
        }
    
}
function cmd_search(query) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Package Search";
    
        const https = require('https');
        
        // Fetch from static registry JSON
        const registryUrl = 'https://raw.githubusercontent.com/crom-lang/registry/main/packages.json';
        
        console.log(CLI_COLORS.dim + "  Fetching registry..." + CLI_COLORS.reset);
        
        const { execSync } = require('child_process');
        
        try {
            const result = execSync('curl -sL "' + registryUrl + '"', { encoding: 'utf-8' });
            const registry = JSON.parse(result);
            
            let results = registry.packages || [];
            
            if (query) {
                const q = query.toLowerCase();
                results = results.filter(p => 
                    p.name.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)) ||
                    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
                );
            }
            
            console.log("");
            console.log(CLI_COLORS.cyan + "  Found " + results.length + " packages:" + CLI_COLORS.reset);
            console.log("");
            
            for (const pkg of results.slice(0, 20)) {
                console.log("  ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset);
                if (pkg.description) {
                    console.log("     " + CLI_COLORS.dim + pkg.description + CLI_COLORS.reset);
                }
                console.log("     " + CLI_COLORS.dim + "omni install github:" + pkg.repo + CLI_COLORS.reset);
                console.log("");
            }
        } catch (e) {
            CLI_warning("Could not fetch registry. You can still install packages directly:");
            console.log(CLI_COLORS.dim + "  omni install github:user/repo" + CLI_COLORS.reset);
        }
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.GitPackage_parse = GitPackage_parse;
    exports.GitPackage_get_zip_url = GitPackage_get_zip_url;
    exports.GitPackage_get_api_url = GitPackage_get_api_url;
    exports.LockFile_load = LockFile_load;
    exports.LockFile_save = LockFile_save;
    exports.LockFile_add = LockFile_add;
    exports.LockFile_get = LockFile_get;
    exports.LockFile_remove = LockFile_remove;
    exports.git_get_latest_commit = git_get_latest_commit;
    exports.git_clone = git_clone;
    exports.cmd_install = cmd_install;
    exports.cmd_install_from_lock = cmd_install_from_lock;
    exports.cmd_uninstall = cmd_uninstall;
    exports.cmd_list = cmd_list;
    exports.cmd_update = cmd_update;
    exports.cmd_doctor = cmd_doctor;
    exports.cmd_search = cmd_search;
    exports.GitPackage = GitPackage;
    exports.LockEntry = LockEntry;
    exports.LockFile = LockFile;
}


// === Module: core/contracts ===
BlockLoop: 61 (let)
BlockLoop: 40 (,)
BlockLoop: 10 (implementations)
BlockLoop: 30 (:)
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
class CanonicalInterface {
    constructor(data = {}) {
        this.name = data.name;
        this.category = data.category;
        this.methods = data.methods;
        this.version = data.version;
    }
}
class ContractMethod {
    constructor(data = {}) {
        this.name = data.name;
        this.signature = data.signature;
        this.params = data.params;
        this.return_type = data.return_type;
        this.description = data.description;
    }
}
class ContractRegistry {
    constructor(data = {}) {
        this.interfaces = data.interfaces;
        this.implementations = data.implementations;
        this.active_target = data.active_target;
    }
}
function ContractRegistry_new() {
    const registry = new ContractRegistry({ interfaces: null });
    // Unknown stmt kind: 0
    implementations;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined

        // Define canonical interfaces
        registry.interfaces = {
            // ============================================================
            // std.io - Input/Output operations
            // ============================================================
            'std.io': {
                name: 'std.io',
                category: 'io',
                version: '1.0.0',
                methods: {
                    print: { signature: 'fn print(msg: string)', params: ['msg'], return_type: 'void' },
                    println: { signature: 'fn println(msg: string)', params: ['msg'], return_type: 'void' },
                    input: { signature: 'fn input(prompt: string) -> string', params: ['prompt'], return_type: 'string' },
                    error: { signature: 'fn error(msg: string)', params: ['msg'], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.fs - File System operations
            // ============================================================
            'std.fs': {
                name: 'std.fs',
                category: 'fs',
                version: '1.0.0',
                methods: {
                    read_file: { signature: 'fn read_file(path: string) -> string', params: ['path'], return_type: 'string' },
                    write_file: { signature: 'fn write_file(path: string, content: string)', params: ['path', 'content'], return_type: 'void' },
                    exists: { signature: 'fn exists(path: string) -> bool', params: ['path'], return_type: 'bool' },
                    delete: { signature: 'fn delete(path: string)', params: ['path'], return_type: 'void' },
                    list_dir: { signature: 'fn list_dir(path: string) -> string[]', params: ['path'], return_type: 'string[]' },
                    mkdir: { signature: 'fn mkdir(path: string)', params: ['path'], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.http - HTTP Client operations
            // ============================================================
            'std.http': {
                name: 'std.http',
                category: 'http',
                version: '1.0.0',
                methods: {
                    get: { signature: 'fn get(url: string) -> HttpResponse', params: ['url'], return_type: 'HttpResponse' },
                    post: { signature: 'fn post(url: string, body: any) -> HttpResponse', params: ['url', 'body'], return_type: 'HttpResponse' },
                    put: { signature: 'fn put(url: string, body: any) -> HttpResponse', params: ['url', 'body'], return_type: 'HttpResponse' },
                    delete: { signature: 'fn delete(url: string) -> HttpResponse', params: ['url'], return_type: 'HttpResponse' }
                }
            },
            
            // ============================================================
            // std.sql - Database operations
            // ============================================================
            'std.sql': {
                name: 'std.sql',
                category: 'sql',
                version: '1.0.0',
                methods: {
                    connect: { signature: 'fn connect(dsn: string) -> Connection', params: ['dsn'], return_type: 'Connection' },
                    query: { signature: 'fn query(conn: Connection, sql: string) -> Result[]', params: ['conn', 'sql'], return_type: 'Result[]' },
                    execute: { signature: 'fn execute(conn: Connection, sql: string) -> i64', params: ['conn', 'sql'], return_type: 'i64' },
                    close: { signature: 'fn close(conn: Connection)', params: ['conn'], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.3d - 3D Visual Sandbox
            // ============================================================
            'std.3d': {
                name: 'std.3d',
                category: '3d',
                version: '1.0.0',
                methods: {
                    Scene_new: { signature: 'fn Scene_new() -> Scene', params: [], return_type: 'Scene' },
                    Mesh_create_cube: { signature: 'fn Mesh_create_cube(size: f64) -> Mesh', params: ['size'], return_type: 'Mesh' },
                    Scene_add: { signature: 'fn Scene_add(scene: Scene, mesh: Mesh)', params: ['scene', 'mesh'], return_type: 'void' },
                    Mesh_set_position: { signature: 'fn Mesh_set_position(mesh: Mesh, x: f64, y: f64, z: f64)', params: ['mesh', 'x', 'y', 'z'], return_type: 'void' }
                }
            },

            // ============================================================
            // std.gui - Native App Windowing
            // ============================================================
            'std.gui': {
                name: 'std.gui',
                category: 'gui',
                version: '1.0.0',
                methods: {
                    Window_create: { signature: 'fn Window_create(title: string, width: i32, height: i32) -> Window', params: ['title', 'width', 'height'], return_type: 'Window' },
                    App_run: { signature: 'fn App_run()', params: [], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.json - JSON operations
            // ============================================================
            'std.json': {
                name: 'std.json',
                category: 'json',
                version: '1.0.0',
                methods: {
                    parse: { signature: 'fn parse(json: string) -> any', params: ['json'], return_type: 'any' },
                    stringify: { signature: 'fn stringify(obj: any) -> string', params: ['obj'], return_type: 'string' }
                }
            },
            
            // ============================================================
            // std.crypto - Cryptography operations
            // ============================================================
            'std.crypto': {
                name: 'std.crypto',
                category: 'crypto',
                version: '1.0.0',
                methods: {
                    hash_sha256: { signature: 'fn hash_sha256(data: string) -> string', params: ['data'], return_type: 'string' },
                    hash_md5: { signature: 'fn hash_md5(data: string) -> string', params: ['data'], return_type: 'string' },
                    random_bytes: { signature: 'fn random_bytes(len: i64) -> string', params: ['len'], return_type: 'string' }
                }
            },
            
            // ============================================================
            // std.time - Time operations
            // ============================================================
            'std.time': {
                name: 'std.time',
                category: 'time',
                version: '1.0.0',
                methods: {
                    now: { signature: 'fn now() -> i64', params: [], return_type: 'i64' },
                    sleep: { signature: 'fn sleep(ms: i64)', params: ['ms'], return_type: 'void' },
                    format: { signature: 'fn format(timestamp: i64, fmt: string) -> string', params: ['timestamp', 'fmt'], return_type: 'string' }
                }
            },
            
            // ============================================================
            // std.gui - Native GUI operations
            // ============================================================
            'std.gui': {
                name: 'std.gui',
                category: 'gui',
                version: '1.0.0',
                methods: {
                    create_window: { signature: 'fn create_window(title: string, width: i64, height: i64) -> Window', params: ['title', 'width', 'height'], return_type: 'Window' },
                    open_webview: { signature: 'fn open_webview(url: string, width: i64, height: i64)', params: ['url', 'width', 'height'], return_type: 'void' },
                    file_dialog: { signature: 'fn file_dialog(title: string, filter: string) -> string', params: ['title', 'filter'], return_type: 'string' },
                    folder_dialog: { signature: 'fn folder_dialog(title: string) -> string', params: ['title'], return_type: 'string' },
                    message_box: { signature: 'fn message_box(title: string, message: string, type: string)', params: ['title', 'message', 'type'], return_type: 'void' },
                    notification: { signature: 'fn notification(title: string, message: string)', params: ['title', 'message'], return_type: 'void' },
                    canvas_create: { signature: 'fn canvas_create(width: i64, height: i64) -> Canvas', params: ['width', 'height'], return_type: 'Canvas' },
                    canvas_draw_rect: { signature: 'fn canvas_draw_rect(canvas: Canvas, x: f64, y: f64, w: f64, h: f64, color: string)', params: ['canvas', 'x', 'y', 'w', 'h', 'color'], return_type: 'void' },
                    canvas_draw_text: { signature: 'fn canvas_draw_text(canvas: Canvas, text: string, x: f64, y: f64, size: i64)', params: ['canvas', 'text', 'x', 'y', 'size'], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.3d - 3D Graphics operations
            // ============================================================
            'std.3d': {
                name: 'std.3d',
                category: '3d',
                version: '1.0.0',
                methods: {
                    create_scene: { signature: 'fn create_scene(width: i64, height: i64) -> Scene', params: ['width', 'height'], return_type: 'Scene' },
                    add_cube: { signature: 'fn add_cube(scene: Scene, x: f64, y: f64, z: f64, size: f64, color: string) -> Object3D', params: ['scene', 'x', 'y', 'z', 'size', 'color'], return_type: 'Object3D' },
                    add_sphere: { signature: 'fn add_sphere(scene: Scene, x: f64, y: f64, z: f64, radius: f64, color: string) -> Object3D', params: ['scene', 'x', 'y', 'z', 'radius', 'color'], return_type: 'Object3D' },
                    add_plane: { signature: 'fn add_plane(scene: Scene, width: f64, height: f64, color: string) -> Object3D', params: ['scene', 'width', 'height', 'color'], return_type: 'Object3D' },
                    add_light: { signature: 'fn add_light(scene: Scene, type: string, intensity: f64, color: string) -> Light', params: ['scene', 'type', 'intensity', 'color'], return_type: 'Light' },
                    set_camera: { signature: 'fn set_camera(scene: Scene, x: f64, y: f64, z: f64)', params: ['scene', 'x', 'y', 'z'], return_type: 'void' },
                    rotate: { signature: 'fn rotate(obj: Object3D, rx: f64, ry: f64, rz: f64)', params: ['obj', 'rx', 'ry', 'rz'], return_type: 'void' },
                    animate: { signature: 'fn animate(scene: Scene, flow: fn())', params: ['scene', 'flow'], return_type: 'void' },
                    render: { signature: 'fn render(scene: Scene)', params: ['scene'], return_type: 'void' }
                }
            },
            
            // ============================================================
            // std.system - Native OS integration
            // ============================================================
            'std.system': {
                name: 'std.system',
                category: 'system',
                version: '1.0.0',
                methods: {
                    // Platform detection
                    get_platform: { signature: 'fn get_platform() -> string', params: [], return_type: 'string' },
                    get_arch: { signature: 'fn get_arch() -> string', params: [], return_type: 'string' },
                    get_home_dir: { signature: 'fn get_home_dir() -> string', params: [], return_type: 'string' },
                    get_temp_dir: { signature: 'fn get_temp_dir() -> string', params: [], return_type: 'string' },
                    
                    // Process control
                    exec: { signature: 'fn exec(command: string) -> string', params: ['command'], return_type: 'string' },
                    exec_async: { signature: 'fn exec_async(command: string) -> Process', params: ['command'], return_type: 'Process' },
                    exit: { signature: 'fn exit(code: i64)', params: ['code'], return_type: 'void' },
                    
                    // Environment
                    get_env: { signature: 'fn get_env(name: string) -> string', params: ['name'], return_type: 'string' },
                    set_env: { signature: 'fn set_env(name: string, value: string)', params: ['name', 'value'], return_type: 'void' },
                    
                    // Desktop integration
                    notify: { signature: 'fn notify(title: string, body: string, icon: string)', params: ['title', 'body', 'icon'], return_type: 'void' },
                    tray_create: { signature: 'fn tray_create(icon: string, tooltip: string) -> Tray', params: ['icon', 'tooltip'], return_type: 'Tray' },
                    tray_set_menu: { signature: 'fn tray_set_menu(tray: Tray, items: any)', params: ['tray', 'items'], return_type: 'void' },
                    
                    // Clipboard
                    clipboard_read: { signature: 'fn clipboard_read() -> string', params: [], return_type: 'string' },
                    clipboard_write: { signature: 'fn clipboard_write(text: string)', params: ['text'], return_type: 'void' },
                    
                    // Path manipulation
                    path_join: { signature: 'fn path_join(parts: any) -> string', params: ['parts'], return_type: 'string' },
                    path_resolve: { signature: 'fn path_resolve(path: string) -> string', params: ['path'], return_type: 'string' },
                    path_dirname: { signature: 'fn path_dirname(path: string) -> string', params: ['path'], return_type: 'string' },
                    path_basename: { signature: 'fn path_basename(path: string) -> string', params: ['path'], return_type: 'string' }
                }
            }
        };
        
        // Define target-specific implementations
        registry.implementations = {
            // ============================================================
            // JAVASCRIPT IMPLEMENTATIONS
            // ============================================================
            js: {
                'std.io.print': 'console.log({0})',
                'std.io.println': 'console.log({0})',
                'std.io.input': 'require("readline-sync").question({0})',
                'std.io.error': 'console.error({0})',
                
                'std.fs.read_file': 'require("fs").readFileSync({0}, "utf-8")',
                'std.fs.write_file': 'require("fs").writeFileSync({0}, {1})',
                'std.fs.exists': 'require("fs").existsSync({0})',
                'std.fs.delete': 'require("fs").unlinkSync({0})',
                'std.fs.list_dir': 'require("fs").readdirSync({0})',
                'std.fs.mkdir': 'require("fs").mkdirSync({0}, { recursive: true })',
                
                'std.http.get': 'await fetch({0}).then(r => r.json())',
                'std.http.post': 'await fetch({0}, { method: "POST", body: JSON.stringify({1}) }).then(r => r.json())',
                'std.http.put': 'await fetch({0}, { method: "PUT", body: JSON.stringify({1}) }).then(r => r.json())',
                'std.http.delete': 'await fetch({0}, { method: "DELETE" }).then(r => r.json())',
                
                'std.json.parse': 'JSON.parse({0})',
                'std.json.stringify': 'JSON.stringify({0})',
                
                'std.crypto.hash_sha256': 'require("crypto").createHash("sha256").update({0}).digest("hex")',
                'std.crypto.hash_md5': 'require("crypto").createHash("md5").update({0}).digest("hex")',
                'std.crypto.random_bytes': 'require("crypto").randomBytes({0}).toString("hex")',
                
                'std.time.now': 'Date.now()',
                'std.time.sleep': 'await new Promise(r => setTimeout(r, {0}))',
                'std.time.format': 'new Date({0}).toLocaleString()',
                
                'std.gui.create_window': '(console.log("[gui] Window not supported in Node.js"), null)',
                'std.gui.open_webview': 'require("open")({0})',
                'std.gui.file_dialog': '(console.log("[gui] File dialog not supported in Node.js"), "")',
                'std.gui.folder_dialog': '(console.log("[gui] Folder dialog not supported in Node.js"), "")',
                'std.gui.message_box': 'console.log("[" + {0} + "] " + {1})',
                'std.gui.notification': 'console.log("🔔 " + {0} + ": " + {1})',
                'std.gui.canvas_create': 'document.createElement("canvas")',
                'std.gui.canvas_draw_rect': '{0}.getContext("2d").fillRect({1}, {2}, {3}, {4})',
                'std.gui.canvas_draw_text': '{0}.getContext("2d").fillText({1}, {2}, {3})',
                
                'std.3d.create_scene': 'new THREE.Scene()',
                'std.3d.add_cube': '(() => { const g = new THREE.BoxGeometry({3}, {3}, {3}); const m = new THREE.MeshStandardMaterial({color: {4}}); const c = new THREE.Mesh(g, m); c.position.set({0}, {1}, {2}); {5}.add(c); return c; })()',
                'std.3d.add_sphere': '(() => { const g = new THREE.SphereGeometry({3}); const m = new THREE.MeshStandardMaterial({color: {4}}); const s = new THREE.Mesh(g, m); s.position.set({0}, {1}, {2}); {5}.add(s); return s; })()',
                'std.3d.add_plane': '(() => { const g = new THREE.PlaneGeometry({0}, {1}); const m = new THREE.MeshStandardMaterial({color: {2}}); const p = new THREE.Mesh(g, m); return p; })()',
                'std.3d.add_light': '(() => { const l = new THREE.DirectionalLight({2}, {1}); {0}.add(l); return l; })()',
                'std.3d.set_camera': 'camera.position.set({1}, {2}, {3})',
                'std.3d.rotate': '{0}.rotation.set({1}, {2}, {3})',
                'std.3d.animate': 'requestAnimationFrame(() => { {1}(); renderer.render({0}, camera); })',
                'std.3d.render': 'renderer.render({0}, camera)',
                
                'std.system.get_platform': 'process.platform',
                'std.system.get_arch': 'process.arch',
                'std.system.get_home_dir': 'require("os").homedir()',
                'std.system.get_temp_dir': 'require("os").tmpdir()',
                'std.system.exec': 'require("child_process").execSync({0}, { encoding: "utf-8" })',
                'std.system.exec_async': 'require("child_process").spawn({0}, { shell: true })',
                'std.system.exit': 'process.exit({0})',
                'std.system.get_env': 'process.env[{0}] || ""',
                'std.system.set_env': 'process.env[{0}] = {1}',
                'std.system.notify': 'console.log("🔔 " + {0} + ": " + {1})',
                'std.system.clipboard_read': '""',
                'std.system.clipboard_write': 'console.log("[clipboard] " + {0})',
                'std.system.path_join': 'require("path").join(...{0})',
                'std.system.path_resolve': 'require("path").resolve({0})',
                'std.system.path_dirname': 'require("path").dirname({0})',
                'std.system.path_basename': 'require("path").basename({0})'
            },
            
            // ============================================================
            // PYTHON IMPLEMENTATIONS
            // ============================================================
            python: {
                'std.io.print': 'print({0})',
                'std.io.println': 'print({0})',
                'std.io.input': 'input({0})',
                'std.io.error': 'print({0}, file=sys.stderr)',
                
                'std.fs.read_file': 'open({0}).read()',
                'std.fs.write_file': 'open({0}, "w").write({1})',
                'std.fs.exists': 'os.path.exists({0})',
                'std.fs.delete': 'os.remove({0})',
                'std.fs.list_dir': 'os.listdir({0})',
                'std.fs.mkdir': 'os.makedirs({0}, exist_ok=True)',
                
                'std.http.get': 'requests.get({0}).json()',
                'std.http.post': 'requests.post({0}, json={1}).json()',
                'std.http.put': 'requests.put({0}, json={1}).json()',
                'std.http.delete': 'requests.delete({0}).json()',
                
                'std.json.parse': 'json.loads({0})',
                'std.json.stringify': 'json.dumps({0})',
                
                'std.crypto.hash_sha256': 'hashlib.sha256({0}.encode()).hexdigest()',
                'std.crypto.hash_md5': 'hashlib.md5({0}.encode()).hexdigest()',
                'std.crypto.random_bytes': 'secrets.token_hex({0})',
                
                'std.time.now': 'int(time.time() * 1000)',
                'std.time.sleep': 'time.sleep({0} / 1000)',
                'std.time.format': 'datetime.fromtimestamp({0} / 1000).strftime({1})',
                
                'std.gui.create_window': 'webview.create_window({0}, width={1}, height={2})',
                'std.gui.open_webview': 'webbrowser.open({0})',
                'std.gui.file_dialog': 'tkinter.filedialog.askopenfilename(title={0}, filetypes={1})',
                'std.gui.folder_dialog': 'tkinter.filedialog.askdirectory(title={0})',
                'std.gui.message_box': 'tkinter.messagebox.showinfo({0}, {1})',
                'std.gui.notification': 'plyer.notification.notify(title={0}, message={1})'
            },
            
            // ============================================================
            // C NATIVE IMPLEMENTATIONS
            // ============================================================
            c_native: {
                'std.io.print': 'printf("%s", {0})',
                'std.io.println': 'printf("%s\\n", {0})',
                'std.io.input': 'fgets(buffer, sizeof(buffer), stdin)',
                'std.io.error': 'fprintf(stderr, "%s\\n", {0})',
                
                'std.fs.read_file': 'omni_read_file({0})',
                'std.fs.write_file': 'omni_write_file({0}, {1})',
                'std.fs.exists': 'access({0}, F_OK) == 0',
                'std.fs.delete': 'remove({0})',
                'std.fs.list_dir': 'omni_list_dir({0})',
                'std.fs.mkdir': 'mkdir({0}, 0755)',
                
                'std.http.get': 'curl_get({0})',
                'std.http.post': 'curl_post({0}, {1})',
                'std.http.put': 'curl_put({0}, {1})',
                'std.http.delete': 'curl_delete({0})',
                
                'std.json.parse': 'cJSON_Parse({0})',
                'std.json.stringify': 'cJSON_Print({0})',
                
                'std.crypto.hash_sha256': 'openssl_sha256({0})',
                'std.crypto.hash_md5': 'openssl_md5({0})',
                'std.crypto.random_bytes': 'omni_random_bytes({0})',
                
                'std.time.now': '(long long)(time(NULL) * 1000)',
                'std.time.sleep': 'usleep({0} * 1000)',
                'std.time.format': 'strftime(buffer, sizeof(buffer), {1}, localtime(&{0}))',
                
                'std.gui.create_window': 'webview_create({1}, {2}, {0})',
                'std.gui.open_webview': 'webview_navigate(wv, {0})',
                'std.gui.file_dialog': 'nfd_open_dialog({0}, {1})',
                'std.gui.folder_dialog': 'nfd_pick_folder({0})',
                'std.gui.message_box': 'MessageBox(NULL, {1}, {0}, MB_OK)',
                'std.gui.notification': 'omni_notify({0}, {1})'
            },
            
            // ============================================================
            // LUA IMPLEMENTATIONS
            // ============================================================
            lua: {
                'std.io.print': 'print({0})',
                'std.io.println': 'print({0})',
                'std.io.input': 'io.read()',
                'std.io.error': 'io.stderr:write({0})',
                
                'std.fs.read_file': 'io.open({0}, "r"):read("*a")',
                'std.fs.write_file': 'local f = io.open({0}, "w"); f:write({1}); f:close()',
                'std.fs.exists': 'io.open({0}, "r") ~= nil',
                'std.fs.delete': 'os.remove({0})',
                
                'std.json.parse': 'cjson.decode({0})',
                'std.json.stringify': 'cjson.encode({0})',
                
                'std.time.now': 'os.time() * 1000',
                'std.time.sleep': 'os.execute("sleep " .. ({0} / 1000))'
            }
        };
    
return registry;
// Unknown stmt kind: undefined
function ContractRegistry_set_target(self, target) {
    
        self.active_target = target;
        console.log("[contract] Active target: " + target);
    
}
function ContractRegistry_resolve(self, contract_path, args) {
    const result = "";
    
        const impl = self.implementations[self.active_target];
        if (!impl) {
            result = "/* UNKNOWN TARGET: " + self.active_target + " */";
            return;
        }
        
        let template = impl[contract_path];
        if (!template) {
            // Fallback to JS implementation
            template = self.implementations['js'][contract_path];
            if (!template) {
                result = "/* UNIMPLEMENTED: " + contract_path + " */";
                return;
            }
        }
        
        // Replace placeholders with arguments
        result = template;
        for (let i = 0; i < args.length; i++) {
            result = result.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
        }
    
    return result;
}
function ContractRegistry_list_interfaces(self) {
    
        console.log("\n┌─────────────────────────────────────────────────────────────┐");
        console.log("│              CANONICAL INTERFACES (Hollow Core)             │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        
        for (const [name, iface] of Object.entries(self.interfaces)) {
            const methodCount = Object.keys(iface.methods).length;
            console.log("│ " + name.padEnd(20) + " │ " + 
                        iface.category.padEnd(10) + " │ " +
                        (methodCount + " methods").padEnd(15) + " │");
        }
        
        console.log("└─────────────────────────────────────────────────────────────┘");
    
}
function ContractRegistry_verify_target(self, target) {
    const is_complete = true;
    const missing = 0;
    
        const impl = self.implementations[target];
        if (!impl) {
            CLI_error("Target '" + target + "' has no implementations");
            is_complete = false;
            return;
        }
        
        // Check all interfaces
        for (const [ifaceName, iface] of Object.entries(self.interfaces)) {
            for (const methodName of Object.keys(iface.methods)) {
                const contractPath = ifaceName + '.' + methodName;
                if (!impl[contractPath]) {
                    missing++;
                }
            }
        }
        
        if (missing > 0) {
            CLI_warning("Target '" + target + "' has " + missing + " missing implementations");
            is_complete = false;
        }
    
    return is_complete;
}
const GLOBAL_CONTRACTS = ContractRegistry_new;


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.ContractRegistry_new = ContractRegistry_new;
    exports.ContractRegistry_set_target = ContractRegistry_set_target;
    exports.ContractRegistry_resolve = ContractRegistry_resolve;
    exports.ContractRegistry_list_interfaces = ContractRegistry_list_interfaces;
    exports.ContractRegistry_verify_target = ContractRegistry_verify_target;
    exports.CanonicalInterface = CanonicalInterface;
    exports.ContractMethod = ContractMethod;
    exports.ContractRegistry = ContractRegistry;
    exports.GLOBAL_CONTRACTS = GLOBAL_CONTRACTS;
}


// === Module: core/ghost_writer ===
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
BlockLoop: 10 (input_file)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (GhostWriter_analyze)
BlockLoop: 42 (()
BlockLoop: 10 (program)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 10 (project_name)
BlockLoop: 43 ())
BlockLoop: 10 (write_file)
BlockLoop: 42 (()
BlockLoop: 10 (docs)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_success)
BlockLoop: 42 (()
BlockLoop: 10 (output_file)
BlockLoop: 43 ())
BlockLoop: 80 (native)
var ast = exports;
var cli = exports;
class CapsuleGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.flows = data.flows;
        this.entities = data.entities;
        this.dependencies = data.dependencies;
        this.attributes = data.attributes;
    }
}
class EntityGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.fields = data.fields;
        this.relations = data.relations;
    }
}
class FlowGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.params = data.params;
        this.return_type = data.return_type;
        this.calls = data.calls;
        this.attributes = data.attributes;
    }
}
class GhostWriter {
    constructor(data = {}) {
        this.capsules = data.capsules;
        this.entities = data.entities;
        this.functions = data.functions;
        this.imports = data.imports;
        this.call_graph = data.call_graph;
    }
}
function GhostWriter_new() {
    return new GhostWriter({ capsules: [], entities: [], functions: [], imports: [], call_graph: null });
}
// Unknown stmt kind: undefined
function GhostWriter_analyze(self, program) {
    
        if (!program || !program.statements) {
            console.error("[ghost] Invalid program");
            return;
        }
        
        for (const stmt of program.statements) {
            // Capsule
            if (stmt.kind === 93) { // NODE_CAPSULE
                const capsule = {
                    name: stmt.name,
                    flows: [],
                    entities: [],
                    dependencies: [],
                    attributes: stmt.attributes || []
                };
                
                for (const flow of (stmt.flows || [])) {
                    capsule.flows.push({
                        name: flow.name,
                        params: flow.params || [],
                        return_type: flow.return_type || 'void',
                        attributes: flow.attributes || []
                    });
                }
                
                self.capsules.push(capsule);
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                const entity = {
                    name: stmt.name,
                    fields: stmt.fields || [],
                    isEntity: (stmt.attributes || []).some(a => a.name === 'entity')
                };
                self.entities.push(entity);
            }
            
            // Function
            if (stmt.kind === 4) { // NODE_FUNCTION
                const fn = {
                    name: stmt.name,
                    params: stmt.params || [],
                    return_type: stmt.return_type || 'void',
                    calls: []
                };
                
                // Extract function calls from body
                const extractCalls = (node) => {
                    if (!node) return;
                    if (node.kind === 6) { // NODE_CALL
                        fn.calls.push(node.name || (node.callee && node.callee.value));
                    }
                    if (Array.isArray(node)) {
                        node.forEach(extractCalls);
                    }
                    if (node.statements) extractCalls(node.statements);
                    if (node.body) extractCalls(node.body);
                    if (node.consequence) extractCalls(node.consequence);
                    if (node.alternative) extractCalls(node.alternative);
                };
                
                extractCalls(stmt.body);
                self.functions.push(fn);
            }
            
            // Import
            if (stmt.kind === 10) { // NODE_IMPORT
                self.imports.push(stmt.path || stmt.value);
            }
        }
        
        // Build call graph
        for (const fn of self.functions) {
            self.call_graph[fn.name] = fn.calls.filter(c => c);
        }
    
}
function GhostWriter_gen_class_diagram(self) {
    const diagram = "";
    
        diagram = "```mermaid\nclassDiagram\n";
        
        // Entities
        for (const entity of self.entities) {
            diagram += "    class " + entity.name + " {\n";
            
            for (const field of entity.fields) {
                const fieldName = field.name || field;
                const fieldType = field.type || 'any';
                diagram += "        +" + fieldType + " " + fieldName + "\n";
            }
            
            diagram += "    }\n\n";
        }
        
        // Capsules as classes
        for (const capsule of self.capsules) {
            diagram += "    class " + capsule.name + " {\n";
            diagram += "        <<capsule>>\n";
            
            for (const flow of capsule.flows) {
                const params = (flow.params || []).map(p => 
                    typeof p === 'string' ? p : p.name
                ).join(', ');
                diagram += "        +" + flow.name + "(" + params + ") " + flow.return_type + "\n";
            }
            
            diagram += "    }\n\n";
        }
        
        // Relations (capsules using entities)
        for (const capsule of self.capsules) {
            for (const entity of self.entities) {
                // Check if capsule references entity
                const capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + " --> " + entity.name + " : uses\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_flowchart(self) {
    const diagram = "";
    
        diagram = "```mermaid\nflowchart TD\n";
        
        // Subgraphs for capsules
        for (const capsule of self.capsules) {
            diagram += "    subgraph " + capsule.name + "\n";
            
            for (const flow of capsule.flows) {
                const nodeId = capsule.name + "_" + flow.name;
                
                // Check for server attribute
                const serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    const method = serverAttr.name.split('.')[1].toUpperCase();
                    diagram += "        " + nodeId + "[(" + method + " " + flow.name + ")]\n";
                } else {
                    diagram += "        " + nodeId + "[" + flow.name + "]\n";
                }
            }
            
            diagram += "    end\n\n";
        }
        
        // Connect capsule flows
        for (const capsule of self.capsules) {
            for (let i = 0; i < capsule.flows.length - 1; i++) {
                const from = capsule.name + "_" + capsule.flows[i].name;
                const to = capsule.name + "_" + capsule.flows[i + 1].name;
                // diagram += "    " + from + " --> " + to + "\n";
            }
        }
        
        // External connections
        for (const entity of self.entities.filter(e => e.isEntity)) {
            diagram += "    DB[(" + entity.name + " DB)]\n";
            
            for (const capsule of self.capsules) {
                const capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + "_" + capsule.flows[0].name + " --> DB\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_sequence_diagram(self) {
    const diagram = "";
    
        diagram = "```mermaid\nsequenceDiagram\n";
        
        // Participants
        diagram += "    participant Client\n";
        
        for (const capsule of self.capsules) {
            diagram += "    participant " + capsule.name + "\n";
        }
        
        for (const entity of self.entities.filter(e => e.isEntity)) {
            diagram += "    participant " + entity.name + "DB as " + entity.name + " DB\n";
        }
        
        diagram += "\n";
        
        // Sequence for each flow
        for (const capsule of self.capsules) {
            for (const flow of capsule.flows) {
                const serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    const method = serverAttr.name.split('.')[1].toUpperCase();
                    diagram += "    Client->>+" + capsule.name + ": " + method + " /" + flow.name + "\n";
                    
                    // Check for entity access
                    for (const entity of self.entities.filter(e => e.isEntity)) {
                        const flowStr = JSON.stringify(flow);
                        if (flowStr.includes(entity.name) || flow.return_type === entity.name) {
                            diagram += "    " + capsule.name + "->>+" + entity.name + "DB: Query\n";
                            diagram += "    " + entity.name + "DB-->>-" + capsule.name + ": Results\n";
                        }
                    }
                    
                    diagram += "    " + capsule.name + "-->>-Client: Response\n\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_call_graph(self) {
    const diagram = "";
    
        diagram = "```mermaid\ngraph LR\n";
        
        // Function nodes
        for (const fn of self.functions) {
            diagram += "    " + fn.name + "[" + fn.name + "()]\n";
        }
        
        // Capsule flow nodes
        for (const capsule of self.capsules) {
            for (const flow of capsule.flows) {
                diagram += "    " + capsule.name + "_" + flow.name + "[" + capsule.name + "." + flow.name + "]\n";
            }
        }
        
        diagram += "\n";
        
        // Call edges
        for (const [caller, callees] of Object.entries(self.call_graph)) {
            for (const callee of callees) {
                if (callee) {
                    diagram += "    " + caller + " --> " + callee + "\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_generate_docs(self, project_name) {
    const doc = "";
    
        doc = "# " + project_name + " - Architecture Documentation\n\n";
        doc += "> Auto-generated by Omni Ghost Writer\n\n";
        doc += "---\n\n";
        
        // Overview
        doc += "## Overview\n\n";
        doc += "| Component | Count |\n";
        doc += "|-----------|-------|\n";
        doc += "| Capsules | " + self.capsules.length + " |\n";
        doc += "| Entities | " + self.entities.length + " |\n";
        doc += "| Functions | " + self.functions.length + " |\n";
        doc += "| Imports | " + self.imports.length + " |\n\n";
        
        // Class Diagram
        doc += "## Class Diagram\n\n";
        doc += GhostWriter_gen_class_diagram(self) + "\n";
        
        // Flowchart
        doc += "## System Flowchart\n\n";
        doc += GhostWriter_gen_flowchart(self) + "\n";
        
        // Sequence Diagram
        doc += "## Sequence Diagram\n\n";
        doc += GhostWriter_gen_sequence_diagram(self) + "\n";
        
        // Call Graph
        doc += "## Call Graph\n\n";
        doc += GhostWriter_gen_call_graph(self) + "\n";
        
        // API Reference
        doc += "## API Reference\n\n";
        
        for (const capsule of self.capsules) {
            doc += "### Capsule: " + capsule.name + "\n\n";
            
            for (const flow of capsule.flows) {
                const params = (flow.params || []).map(p => 
                    typeof p === 'string' ? p : (p.name + ': ' + (p.type || 'any'))
                ).join(', ');
                
                doc += "#### `" + flow.name + "(" + params + ") -> " + flow.return_type + "`\n\n";
                
                // Attributes
                for (const attr of flow.attributes) {
                    if (attr.name && attr.name.startsWith('server.')) {
                        const method = attr.name.split('.')[1].toUpperCase();
                        const path = attr.args && attr.args[0] ? attr.args[0] : '/' + flow.name;
                        doc += "- **Endpoint:** `" + method + " " + path + "`\n";
                    }
                }
                
                doc += "\n";
            }
        }
        
        // Entities
        doc += "## Data Entities\n\n";
        
        for (const entity of self.entities) {
            doc += "### " + (entity.isEntity ? "@entity " : "") + entity.name + "\n\n";
            doc += "| Field | Type |\n";
            doc += "|-------|------|\n";
            
            for (const field of entity.fields) {
                const name = field.name || field;
                const type = field.type || 'any';
                doc += "| " + name + " | " + type + " |\n";
            }
            
            doc += "\n";
        }
        
        doc += "---\n\n";
        doc += "*Generated by Omni Ghost Writer v1.0*\n";
    
    return doc;
}
function cmd_graph(input_file, output_file) {
    CLI_header;
    "Omni Ghost Writer";
    CLI_info;
    "Analyzing: ";
    input_file;
    // Unknown stmt kind: 0
    const source = read_file;
    input_file;
    const l = new_lexer;
    source;
    const p = new_parser;
    l;
    const program = Parser_parse_program;
    p;
    const writer = GhostWriter_new;
    // Unknown stmt kind: 0
    GhostWriter_analyze;
    writer;
    program;
    // Unknown stmt kind: 0
    const project_name = "";
    
        // const path = require('path'); (hoisted)
        project_name = path.basename(input_file, '.omni');
    
    const docs = GhostWriter_generate_docs;
    writer;
    project_name;
    // Unknown stmt kind: 0
    write_file;
    output_file;
    docs;
    // Unknown stmt kind: 0
    CLI_success;
    "Documentation generated: ";
    output_file;
    // Unknown stmt kind: 0
    
        console.log("");
        console.log(CLI_COLORS.bold + "Generated Diagrams:" + CLI_COLORS.reset);
        console.log("  • Class Diagram");
        console.log("  • System Flowchart");
        console.log("  • Sequence Diagram");
        console.log("  • Call Graph");
        console.log("");
        CLI_info("View the .md file in any Markdown viewer with Mermaid support");
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.GhostWriter_new = GhostWriter_new;
    exports.GhostWriter_analyze = GhostWriter_analyze;
    exports.GhostWriter_gen_class_diagram = GhostWriter_gen_class_diagram;
    exports.GhostWriter_gen_flowchart = GhostWriter_gen_flowchart;
    exports.GhostWriter_gen_sequence_diagram = GhostWriter_gen_sequence_diagram;
    exports.GhostWriter_gen_call_graph = GhostWriter_gen_call_graph;
    exports.GhostWriter_generate_docs = GhostWriter_generate_docs;
    exports.cmd_graph = cmd_graph;
    exports.CapsuleGraph = CapsuleGraph;
    exports.EntityGraph = EntityGraph;
    exports.FlowGraph = FlowGraph;
    exports.GhostWriter = GhostWriter;
}


// === Module: core/bootstrap ===
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
var cli = exports;
function get_c_runtime_header() {
    const header = "";
    
        header = `
// ============================================================================
// OMNI RUNTIME - C Native Bootstrap
// Generated by Omni Compiler v0.8.0
// ============================================================================

#ifndef OMNI_RUNTIME_H
#define OMNI_RUNTIME_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdint.h>
#include <time.h>

// ============================================================================
// MEMORY MANAGEMENT - Arena Allocator
// ============================================================================

#define ARENA_SIZE (1024 * 1024 * 16)  // 16MB default arena

typedef struct {
    char* buffer;
    size_t offset;
    size_t capacity;
} OmniArena;

static OmniArena* global_arena = NULL;

static void omni_arena_init() {
    if (global_arena) return;
    global_arena = (OmniArena*)malloc(sizeof(OmniArena));
    global_arena->buffer = (char*)malloc(ARENA_SIZE);
    global_arena->offset = 0;
    global_arena->capacity = ARENA_SIZE;
}

static void* omni_alloc(size_t size) {
    if (!global_arena) omni_arena_init();
    
    // Align to 8 bytes
    size = (size + 7) & ~7;
    
    if (global_arena->offset + size > global_arena->capacity) {
        fprintf(stderr, "[omni] Arena overflow! Requested %zu bytes\\n", size);
        exit(1);
    }
    
    void* ptr = global_arena->buffer + global_arena->offset;
    global_arena->offset += size;
    return ptr;
}

static void omni_arena_reset() {
    if (global_arena) {
        global_arena->offset = 0;
    }
}

static void omni_arena_destroy() {
    if (global_arena) {
        free(global_arena->buffer);
        free(global_arena);
        global_arena = NULL;
    }
}

// ============================================================================
// STRING TYPE
// ============================================================================

typedef struct {
    char* data;
    size_t len;
} OmniString;

static OmniString omni_string_new(const char* str) {
    OmniString s;
    s.len = strlen(str);
    s.data = (char*)omni_alloc(s.len + 1);
    strcpy(s.data, str);
    return s;
}

static OmniString omni_string_concat(OmniString a, OmniString b) {
    OmniString s;
    s.len = a.len + b.len;
    s.data = (char*)omni_alloc(s.len + 1);
    strcpy(s.data, a.data);
    strcat(s.data, b.data);
    return s;
}

#define STR(x) omni_string_new(x)
#define CONCAT(a, b) omni_string_concat(a, b)

// ============================================================================
// DYNAMIC ARRAY
// ============================================================================

typedef struct {
    void** items;
    size_t len;
    size_t capacity;
} OmniArray;

static OmniArray* omni_array_new() {
    OmniArray* arr = (OmniArray*)omni_alloc(sizeof(OmniArray));
    arr->capacity = 16;
    arr->len = 0;
    arr->items = (void**)omni_alloc(arr->capacity * sizeof(void*));
    return arr;
}

static void omni_array_push(OmniArray* arr, void* item) {
    if (arr->len >= arr->capacity) {
        arr->capacity *= 2;
        void** new_items = (void**)omni_alloc(arr->capacity * sizeof(void*));
        memcpy(new_items, arr->items, arr->len * sizeof(void*));
        arr->items = new_items;
    }
    arr->items[arr->len++] = item;
}

#define ARRAY_NEW() omni_array_new()
#define ARRAY_PUSH(arr, item) omni_array_push(arr, (void*)(item))
#define ARRAY_GET(arr, i, type) ((type)arr->items[i])
#define ARRAY_LEN(arr) (arr->len)

// ============================================================================
// STD.IO IMPLEMENTATION
// ============================================================================

#define print(msg) printf("%s", (msg).data)
#define println(msg) printf("%s\\n", (msg).data)

static OmniString omni_input(OmniString prompt) {
    printf("%s", prompt.data);
    char buffer[1024];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        buffer[strcspn(buffer, "\\n")] = 0;
        return omni_string_new(buffer);
    }
    return omni_string_new("");
}

// ============================================================================
// STD.FS IMPLEMENTATION
// ============================================================================

static OmniString omni_read_file(OmniString path) {
    FILE* f = fopen(path.data, "rb");
    if (!f) return omni_string_new("");
    
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char* buffer = (char*)omni_alloc(size + 1);
    fread(buffer, 1, size, f);
    buffer[size] = 0;
    fclose(f);
    
    OmniString s = { buffer, size };
    return s;
}

static void omni_write_file(OmniString path, OmniString content) {
    FILE* f = fopen(path.data, "wb");
    if (f) {
        fwrite(content.data, 1, content.len, f);
        fclose(f);
    }
}

static bool omni_file_exists(OmniString path) {
    FILE* f = fopen(path.data, "r");
    if (f) {
        fclose(f);
        return true;
    }
    return false;
}

// ============================================================================
// STD.TIME IMPLEMENTATION
// ============================================================================

static int64_t omni_time_now() {
    return (int64_t)(time(NULL) * 1000);
}

static void omni_sleep(int64_t ms) {
    #ifdef _WIN32
    Sleep(ms);
    #else
    usleep(ms * 1000);
    #endif
}

// ============================================================================
// STD.JSON IMPLEMENTATION (Simple)
// ============================================================================

// Minimal JSON - for full JSON use cJSON library
static OmniString omni_json_stringify_string(OmniString s) {
    size_t new_len = s.len + 3;
    char* buffer = (char*)omni_alloc(new_len);
    sprintf(buffer, "\\"%s\\"", s.data);
    return omni_string_new(buffer);
}

// ============================================================================
// TYPE ALIASES
// ============================================================================

typedef int64_t i64;
typedef int32_t i32;
typedef int16_t i16;
typedef int8_t i8;
typedef uint64_t u64;
typedef uint32_t u32;
typedef uint16_t u16;
typedef uint8_t u8;
typedef double f64;
typedef float f32;

#endif // OMNI_RUNTIME_H
`;
    
    return header;
}
function cmd_bootstrap() {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Bootstrap - Native Compilation";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        const omniDir = path.join(__dirname, '..');
        const srcDir = path.join(omniDir, 'src');
        const distDir = path.join(omniDir, 'dist');
        const bootstrapDir = path.join(omniDir, 'bootstrap');
        
        // Create bootstrap directory
        if (!fs.existsSync(bootstrapDir)) {
            fs.mkdirSync(bootstrapDir, { recursive: true });
        }
        
        CLI_step(1, 5, "Generating C runtime header...");
        
        // Write runtime header
        const runtimeHeader = get_c_runtime_header();
        fs.writeFileSync(path.join(bootstrapDir, 'omni_runtime.h'), runtimeHeader);
        CLI_success("Created: bootstrap/omni_runtime.h");
        
        CLI_step(2, 5, "Compiling Omni sources to C...");
        
        // List of core source files (order matters)
        const sourceFiles = [
            'core/token.omni',
            'core/ast.omni',
            'core/lexer.omni',
            'core/parser.omni',
            'core/codegen_hybrid.omni',
            'core/vm.omni',
            'lib/std.omni',
            'lib/cli.omni',
            'main.omni'
        ];
        
        let combinedC = '#include "omni_runtime.h"\n\n';
        
        for (const file of sourceFiles) {
            const fullPath = path.join(srcDir, file);
            if (fs.existsSync(fullPath)) {
                CLI_info("Processing: " + file);
                // In real implementation, would compile each file to C
                // For now, create placeholder
                combinedC += '// === ' + file + ' ===\n';
                combinedC += '// TODO: Transpiled C code for ' + file + '\n\n';
            }
        }
        
        // Write combined C file
        fs.writeFileSync(path.join(bootstrapDir, 'omni.c'), combinedC);
        CLI_success("Created: bootstrap/omni.c");
        
        CLI_step(3, 5, "Checking for C compiler...");
        
        let compiler = null;
        const compilers = ['gcc', 'clang', 'cl'];
        
        for (const cc of compilers) {
            try {
                execSync(cc + ' --version', { stdio: 'ignore' });
                compiler = cc;
                CLI_success("Found: " + cc);
                break;
            } catch (e) {
                // Not found
            }
        }
        
        if (!compiler) {
            CLI_warning("No C compiler found (gcc, clang, cl)");
            CLI_info("Install GCC or Clang to compile native binary");
            console.log("");
            CLI_info("To compile manually:");
            console.log(CLI_COLORS.dim + "  gcc -O2 -o omni bootstrap/omni.c" + CLI_COLORS.reset);
            return;
        }
        
        CLI_step(4, 5, "Compiling native binary...");
        
        const isWindows = process.platform === 'win32';
        const outputName = isWindows ? 'omni.exe' : 'omni';
        const outputPath = path.join(bootstrapDir, outputName);
        
        try {
            // Note: This would fail without actual C code
            // const compileCmd = compiler + ' -O2 -o ' + outputPath + ' ' + 
            //                    path.join(bootstrapDir, 'omni.c');
            // execSync(compileCmd, { stdio: 'inherit' });
            
            CLI_info("Compilation command prepared:");
            console.log(CLI_COLORS.dim + "  " + compiler + " -O2 -o " + outputPath + " bootstrap/omni.c" + CLI_COLORS.reset);
            
        } catch (e) {
            CLI_error("Compilation failed: " + e.message);
            return;
        }
        
        CLI_step(5, 5, "Bootstrap complete!");
        
        console.log("");
        console.log("┌─────────────────────────────────────────────────────────────┐");
        console.log("│                  BOOTSTRAP SUMMARY                          │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        console.log("│ Runtime Header: bootstrap/omni_runtime.h                    │");
        console.log("│ Generated C:    bootstrap/omni.c                            │");
        console.log("│ Compiler:       " + (compiler || 'Not Found').padEnd(43) + "│");
        console.log("└─────────────────────────────────────────────────────────────┘");
        
        console.log("");
        CLI_info("To complete native compilation:");
        console.log("");
        console.log(CLI_COLORS.cyan + "  cd bootstrap" + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + "  " + compiler + " -O2 -o omni omni.c" + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + "  ./omni --version" + CLI_COLORS.reset);
        console.log("");
        
        CLI_success("Bootstrap files generated successfully!");
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.get_c_runtime_header = get_c_runtime_header;
    exports.cmd_bootstrap = cmd_bootstrap;
}


// === Module: core/studio_engine ===
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 66 (return)
BlockLoop: 40 (,)
BlockLoop: 10 (output_buffer)
BlockLoop: 30 (:)
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 66 (return)
BlockLoop: 43 ())
BlockLoop: 10 (res)
BlockLoop: 31 (.)
BlockLoop: 10 (end)
BlockLoop: 42 (()
BlockLoop: 10 (stringify)
BlockLoop: 42 (()
BlockLoop: 10 (project)
BlockLoop: 43 ())
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (StudioServer_start)
BlockLoop: 42 (()
BlockLoop: 10 (cwd)
BlockLoop: 43 ())
var cli = exports;
var ghost_writer = exports;
class ProjectInfo {
    constructor(data = {}) {
        this.name = data.name;
        this.type = data.type;
        this.config_file = data.config_file;
        this.run_command = data.run_command;
        this.build_command = data.build_command;
        this.dev_command = data.dev_command;
    }
}
function detect_project(dir) {
    const info = new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" });
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        info.name = path.basename(dir);
        
        // Detection order (most specific first)
        const detectors = [
            {
                file: 'omni.config.json',
                type: 'omni',
                run: 'omni run main.omni',
                build: 'omni build',
                dev: 'omni studio'
            },
            {
                file: 'package.json',
                type: 'node',
                run: 'npm start',
                build: 'npm run build',
                dev: 'npm run dev'
            },
            {
                file: 'Cargo.toml',
                type: 'rust',
                run: 'cargo run',
                build: 'cargo build --release',
                dev: 'cargo watch -x run'
            },
            {
                file: 'composer.json',
                type: 'php',
                run: 'php artisan serve',
                build: 'composer install',
                dev: 'php artisan serve'
            },
            {
                file: 'requirements.txt',
                type: 'python',
                run: 'python main.py',
                build: 'pip install -r requirements.txt',
                dev: 'uvicorn app:main --reload'
            },
            {
                file: 'pyproject.toml',
                type: 'python',
                run: 'python -m app',
                build: 'pip install -e .',
                dev: 'uvicorn app:main --reload'
            },
            {
                file: 'go.mod',
                type: 'go',
                run: 'go run .',
                build: 'go build',
                dev: 'go run .'
            },
            {
                file: 'pom.xml',
                type: 'java',
                run: './mvnw spring-boot:run',
                build: './mvnw package',
                dev: './mvnw spring-boot:run'
            },
            {
                file: 'build.gradle',
                type: 'java',
                run: './gradlew bootRun',
                build: './gradlew build',
                dev: './gradlew bootRun'
            },
            {
                file: 'artisan',
                type: 'laravel',
                run: 'php artisan serve',
                build: 'composer install && npm run build',
                dev: 'php artisan serve'
            }
        ];
        
        for (const detector of detectors) {
            const configPath = path.join(dir, detector.file);
            if (fs.existsSync(configPath)) {
                info.type = detector.type;
                info.config_file = detector.file;
                info.run_command = detector.run;
                info.build_command = detector.build;
                info.dev_command = detector.dev;
                break;
            }
        }
    
    return info;
}
class CrossRunner {
    constructor(data = {}) {
        this.processes = data.processes;
        this.output_buffer = data.output_buffer;
    }
}
function CrossRunner_new() {
    return new CrossRunner({ processes: null });
    // Unknown stmt kind: 0
    output_buffer;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
function CrossRunner_run(self, name, command, cwd) {
    const success = true;
    
        const { spawn } = require('child_process');
        // const path = require('path'); (hoisted)
        
        console.log(CLI_COLORS.cyan + "[runner] " + CLI_COLORS.reset + "Starting: " + command);
        
        // Parse command
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        // Spawn process
        const proc = spawn(cmd, args, {
            cwd: cwd,
            shell: true,
            stdio: ['inherit', 'pipe', 'pipe']
        });
        
        self.processes[name] = proc;
        self.output_buffer[name] = [];
        
        proc.stdout.on('data', (data) => {
            const line = data.toString();
            self.output_buffer[name].push(line);
            process.stdout.write(CLI_COLORS.dim + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.stderr.on('data', (data) => {
            const line = data.toString();
            self.output_buffer[name].push(line);
            process.stderr.write(CLI_COLORS.red + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.on('close', (code) => {
            console.log(CLI_COLORS.yellow + "[runner] " + CLI_COLORS.reset + name + " exited with code " + code);
            delete self.processes[name];
        });
        
        proc.on('error', (err) => {
            CLI_error("Failed to start " + name + ": " + err.message);
            success = false;
        });
    
    return success;
}
function CrossRunner_stop(self, name) {
    
        const proc = self.processes[name];
        if (proc) {
            proc.kill('SIGTERM');
            console.log(CLI_COLORS.yellow + "[runner] " + CLI_COLORS.reset + "Stopped: " + name);
        }
    
}
function CrossRunner_stop_all(self) {
    
        for (const name of Object.keys(self.processes)) {
            CrossRunner_stop(self, name);
        }
    
}
class GraphNode {
    constructor(data = {}) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.position = data.position;
        this.ports = data.ports;
        this.attributes = data.attributes;
        this.ast_ref = data.ast_ref;
    }
}
class GraphEdge {
    constructor(data = {}) {
        this.id = data.id;
        this.source = data.source;
        this.target = data.target;
        this.edge_type = data.edge_type;
    }
}
class GraphState {
    constructor(data = {}) {
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.selected = data.selected;
        this.viewport = data.viewport;
    }
}
function GraphState_new() {
    return new GraphState({ nodes: [], edges: [], selected: [], viewport: null, x: 0, y: 0, zoom: 1 });
}
// Unknown stmt kind: undefined
function GraphState_from_ast(program) {
    const state = GraphState_new;
    // Unknown stmt kind: 0
    
        if (!program || !program.statements) return;
        
        let nodeId = 0;
        let y = 50;
        
        for (const stmt of program.statements) {
            const node = {
                id: 'node_' + (++nodeId),
                type: 'unknown',
                name: stmt.name || 'anonymous',
                position: { x: 100, y: y },
                ports: { inputs: [], outputs: [] },
                attributes: stmt.attributes || [],
                ast_ref: { kind: stmt.kind, line: stmt.line || 0 }
            };
            
            // Determine type
            if (stmt.kind === 93) {
                node.type = 'capsule';
                node.position.x = 50;
                
                // Add flows as child nodes
                for (const flow of (stmt.flows || [])) {
                    y += 60;
                    state.nodes.push({
                        id: 'node_' + (++nodeId),
                        type: 'flow',
                        name: flow.name,
                        position: { x: 150, y: y },
                        ports: {
                            inputs: (flow.params || []).map((p, i) => ({
                                id: 'port_in_' + nodeId + '_' + i,
                                name: typeof p === 'string' ? p : p.name,
                                type: typeof p === 'object' ? p.type : 'any'
                            })),
                            outputs: [{
                                id: 'port_out_' + nodeId,
                                name: 'return',
                                type: flow.return_type || 'void'
                            }]
                        },
                        attributes: flow.attributes || [],
                        ast_ref: { kind: 94, line: flow.line || 0 },
                        parent: node.id
                    });
                }
            } else if (stmt.kind === 70) {
                node.type = 'entity';
                node.ports.outputs = (stmt.fields || []).map((f, i) => ({
                    id: 'port_field_' + nodeId + '_' + i,
                    name: typeof f === 'string' ? f : f.name,
                    type: typeof f === 'object' ? f.type : 'any'
                }));
            } else if (stmt.kind === 4) {
                node.type = 'function';
                node.ports.inputs = (stmt.params || []).map((p, i) => ({
                    id: 'port_in_' + nodeId + '_' + i,
                    name: typeof p === 'string' ? p : p.name,
                    type: typeof p === 'object' ? p.type : 'any'
                }));
                node.ports.outputs = [{
                    id: 'port_out_' + nodeId,
                    name: 'return',
                    type: stmt.return_type || 'void'
                }];
            }
            
            state.nodes.push(node);
            y += 100;
        }
    
    return state;
}
function GraphState_to_json(self) {
    const json = "";
    
        json = JSON.stringify({
            nodes: self.nodes,
            edges: self.edges,
            viewport: self.viewport
        }, null, 2);
    
    return json;
}
class StudioServer {
    constructor(data = {}) {
        this.port = data.port;
        this.project = data.project;
        this.runner = data.runner;
        this.graph = data.graph;
    }
}
function StudioServer_new(port) {
    return new StudioServer({ port: port, project: new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" }), runner: CrossRunner_new, (: null, graph: GraphState_new, (: null, ;: null, StudioServer_start: self, :: null, dir: string, ): CLI_banner, (: null, CLI_header: "Omni Studio", ): self, .: null, detect_project: dir, ): CLI_info, (: null, self: project, .: null, ;: "Type: ", self: project, .: null, ;: "js", {: http = require, (: http, ': null, const: null, require: null, fs: null, ;: path = require, (: path, ': null, const: null, http: createServer, (: req, res: null, >: null, (: null, url: null, ': api, /: null, ): res, .: 200, {: Content, -: null, :: application, /: null });
    // Unknown stmt kind: 0
    res;
    // Unknown stmt kind: 0
    end;
    JSON;
    stringify;
    self;
    project;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return null;
}
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
function generate_studio_html(server) {
    const html = "";
    
        html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni Studio - ${server.project.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg-primary: #0d1117;
            --bg-secondary: #161b22;
            --bg-tertiary: #21262d;
            --border: #30363d;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --accent-blue: #58a6ff;
            --accent-green: #7ee787;
            --accent-purple: #a371f7;
            --accent-orange: #d29922;
            --accent-red: #f85149;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .header {
            background: var(--bg-secondary);
            padding: 10px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .logo { font-weight: bold; font-size: 18px; color: var(--accent-blue); }
        .project-info { color: var(--text-secondary); font-size: 14px; }
        .header-actions { margin-left: auto; display: flex; gap: 8px; }
        .btn {
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            border: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .btn-primary { background: #238636; color: white; }
        .btn-primary:hover { background: #2ea043; }
        .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border); }
        .btn-danger { background: #da3633; color: white; }
        
        .main { flex: 1; display: flex; overflow: hidden; }
        
        /* Sidebar */
        .sidebar {
            width: 260px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
        }
        .sidebar-section { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .sidebar-title { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
        .sidebar-item {
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 2px;
        }
        .sidebar-item:hover { background: var(--bg-tertiary); }
        .sidebar-item.active { background: var(--bg-tertiary); color: var(--accent-blue); }
        
        /* Node Palette */
        .node-palette { flex: 1; overflow-y: auto; }
        .palette-node {
            padding: 10px 12px;
            margin: 4px 12px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 6px;
            cursor: grab;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .palette-node:hover { border-color: var(--accent-blue); }
        .palette-node[data-type="capsule"] { border-left: 3px solid var(--accent-blue); }
        .palette-node[data-type="flow"] { border-left: 3px solid var(--accent-purple); }
        .palette-node[data-type="function"] { border-left: 3px solid var(--accent-orange); }
        .palette-node[data-type="entity"] { border-left: 3px solid var(--accent-green); }
        .palette-node[data-type="3d"] { border-left: 3px solid #ff6b6b; }
        
        /* Workspace */
        .workspace { flex: 1; display: flex; flex-direction: column; }
        .tabs { background: var(--bg-secondary); padding: 0 16px; display: flex; gap: 0; border-bottom: 1px solid var(--border); }
        .tab {
            padding: 12px 20px;
            cursor: pointer;
            font-size: 13px;
            border-bottom: 2px solid transparent;
            color: var(--text-secondary);
        }
        .tab:hover { color: var(--text-primary); }
        .tab.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
        
        /* Canvas */
        .canvas-container { flex: 1; position: relative; overflow: hidden; }
        #canvas {
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(var(--bg-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--bg-primary) 1px, transparent 1px);
            background-size: 20px 20px;
            background-color: #010409;
            position: relative;
        }
        
        /* Visual Nodes */
        .vnode {
            position: absolute;
            background: var(--bg-tertiary);
            border: 2px solid var(--border);
            border-radius: 8px;
            min-width: 180px;
            cursor: move;
            user-select: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .vnode.selected { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(88,166,255,0.3); }
        .vnode.capsule { border-color: var(--accent-blue); }
        .vnode.flow { border-color: var(--accent-purple); }
        .vnode.function { border-color: var(--accent-orange); }
        .vnode.entity { border-color: var(--accent-green); }
        .vnode-header {
            padding: 10px 12px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .vnode-type { font-size: 9px; text-transform: uppercase; color: var(--text-secondary); }
        .vnode-title { font-weight: 600; font-size: 13px; }
        .vnode-body { padding: 8px 12px; font-size: 12px; }
        .vnode-port {
            padding: 4px 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .port-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--border);
            border: 2px solid var(--bg-tertiary);
        }
        .port-in .port-dot { background: var(--accent-green); }
        .port-out .port-dot { background: var(--accent-orange); }
        
        /* Editor Panel */
        .editor-panel { display: none; height: 100%; }
        .editor-panel.active { display: flex; flex-direction: column; }
        #code-editor {
            flex: 1;
            background: var(--bg-primary);
            padding: 16px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.5;
            overflow: auto;
            white-space: pre;
            color: var(--text-primary);
        }
        
        /* Terminal Panel */
        .terminal-container {
            height: 200px;
            background: #010409;
            border-top: 1px solid var(--border);
            display: flex;
            flex-direction: column;
        }
        .terminal-tabs { display: flex; gap: 0; background: var(--bg-secondary); }
        .terminal-tab {
            padding: 8px 16px;
            font-size: 12px;
            cursor: pointer;
            color: var(--text-secondary);
            border-right: 1px solid var(--border);
        }
        .terminal-tab.active { background: #010409; color: var(--accent-green); }
        .terminal-tab .status { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-left: 6px; }
        .terminal-tab .status.running { background: var(--accent-green); }
        .terminal-tab .status.stopped { background: var(--text-secondary); }
        #terminal-output {
            flex: 1;
            padding: 12px;
            overflow-y: auto;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 12px;
            line-height: 1.4;
        }
        .terminal-line { padding: 2px 0; }
        .terminal-line.info { color: var(--accent-blue); }
        .terminal-line.success { color: var(--accent-green); }
        .terminal-line.error { color: var(--accent-red); }
        .terminal-line.warning { color: var(--accent-orange); }
        
        /* Right Panel - Cross-Runner */
        .right-panel {
            width: 280px;
            background: var(--bg-secondary);
            border-left: 1px solid var(--border);
            display: flex;
            flex-direction: column;
        }
        .runner-item {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
        }
        .runner-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .runner-name { font-weight: 600; font-size: 13px; }
        .runner-status { font-size: 11px; padding: 2px 8px; border-radius: 4px; }
        .runner-status.running { background: rgba(126,231,135,0.2); color: var(--accent-green); }
        .runner-status.stopped { background: rgba(139,148,158,0.2); color: var(--text-secondary); }
        .runner-cmd { font-size: 11px; color: var(--text-secondary); font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">◊ OMNI STUDIO</div>
        <div class="project-info">${server.project.name} <span style="color:var(--text-secondary)">(${server.project.type})</span></div>
        <div class="header-actions">
            <button class="btn btn-secondary" onclick="saveProject()">💾 Save</button>
            <button class="btn btn-primary" onclick="runProject()">▶ Run</button>
            <button class="btn btn-secondary" onclick="buildProject()">📦 Build</button>
            <button class="btn btn-secondary" onclick="openPreview()">🌐 Preview</button>
        </div>
    </div>
    
    <div class="main">
        <!-- Left Sidebar -->
        <div class="sidebar">
            <div class="sidebar-section">
                <div class="sidebar-title">Explorer</div>
                <div class="sidebar-item" onclick="loadFile('main.omni')">📄 main.omni</div>
                <div class="sidebar-item" onclick="loadFile('omni.config.json')">⚙️ omni.config.json</div>
            </div>
            
            <div class="sidebar-section">
                <div class="sidebar-title">Node Palette</div>
            </div>
            
            <div class="node-palette">
                <div class="palette-node" data-type="capsule" draggable="true">📦 Capsule</div>
                <div class="palette-node" data-type="flow" draggable="true">⚡ Flow</div>
                <div class="palette-node" data-type="function" draggable="true">ƒ Function</div>
                <div class="palette-node" data-type="entity" draggable="true">📋 Entity</div>
                <div class="palette-node" data-type="3d" draggable="true">🎮 3D Scene</div>
                <div class="palette-node" data-type="3d" draggable="true">🧊 3D Cube</div>
                <div class="palette-node" data-type="3d" draggable="true">🔵 3D Sphere</div>
                <div class="palette-node" data-type="3d" draggable="true">💡 3D Light</div>
            </div>
            
            <div class="sidebar-section">
                <div class="sidebar-title">Packages</div>
                <div class="sidebar-item" onclick="showPackages()">📦 Browse Registry</div>
            </div>
        </div>
        
        <!-- Workspace -->
        <div class="workspace">
            <div class="tabs">
                <div class="tab active" data-panel="graph" onclick="switchTab('graph')">🔗 Graph</div>
                <div class="tab" data-panel="editor" onclick="switchTab('editor')">📝 Editor</div>
                <div class="tab" data-panel="preview" onclick="switchTab('preview')">👁 Preview</div>
            </div>
            
            <div class="canvas-container">
                <div id="canvas"></div>
                <div class="editor-panel" id="editor-panel">
                    <div id="code-editor" contenteditable="true"></div>
                </div>
                <div class="editor-panel" id="preview-panel">
                    <iframe id="preview-frame" style="width:100%;height:100%;border:none;background:#fff"></iframe>
                </div>
            </div>
            
            <div class="terminal-container">
                <div class="terminal-tabs">
                    <div class="terminal-tab active">Output <span class="status running"></span></div>
                    <div class="terminal-tab">Problems</div>
                    <div class="terminal-tab">Debug</div>
                </div>
                <div id="terminal-output">
                    <div class="terminal-line info">◊ Omni Studio v1.1.0</div>
                    <div class="terminal-line">Project: ${server.project.name}</div>
                    <div class="terminal-line">Ready to run: ${server.project.run_command}</div>
                </div>
            </div>
        </div>
        
        <!-- Right Panel - Cross-Runner -->
        <div class="right-panel">
            <div class="sidebar-section">
                <div class="sidebar-title">Cross-Runner</div>
            </div>
            
            <div class="runner-item">
                <div class="runner-header">
                    <span class="runner-name">Main Process</span>
                    <span class="runner-status stopped">Stopped</span>
                </div>
                <div class="runner-cmd">${server.project.run_command}</div>
            </div>
            
            <div class="runner-item">
                <div class="runner-header">
                    <span class="runner-name">Dev Server</span>
                    <span class="runner-status stopped">Stopped</span>
                </div>
                <div class="runner-cmd">${server.project.dev_command}</div>
            </div>
            
            <div class="sidebar-section" style="margin-top:auto">
                <button class="btn btn-secondary" style="width:100%" onclick="packageApp('windows')">📦 Package Windows</button>
                <button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="packageApp('android')">📱 Package Android</button>
            </div>
        </div>
    </div>
    
    <script>
        let nodes = [];
        let selectedNode = null;
        let dragNode = null;
        let dragOffset = { x: 0, y: 0 };
        let codeContent = '';
        
        // Load initial graph
        async function loadGraph() {
            const res = await fetch('/api/graph');
            const graph = await res.json();
            nodes = graph.nodes || [];
            renderNodes();
        }
        
        function renderNodes() {
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '';
            
            for (const node of nodes) {
                const el = document.createElement('div');
                el.className = 'vnode ' + node.type;
                el.dataset.id = node.id;
                el.style.left = (node.position?.x || 100) + 'px';
                el.style.top = (node.position?.y || 100) + 'px';
                
                let portsHtml = '';
                if (node.ports?.inputs?.length) {
                    portsHtml += node.ports.inputs.map(p => 
                        '<div class="vnode-port port-in"><span class="port-dot"></span> ' + p.name + ': ' + p.type + '</div>'
                    ).join('');
                }
                if (node.ports?.outputs?.length) {
                    portsHtml += node.ports.outputs.map(p => 
                        '<div class="vnode-port port-out">' + p.name + ': ' + p.type + ' <span class="port-dot"></span></div>'
                    ).join('');
                }
                
                el.innerHTML = 
                    '<div class="vnode-header">' +
                        '<span class="vnode-type">' + node.type + '</span>' +
                        '<span class="vnode-title">' + node.name + '</span>' +
                    '</div>' +
                    '<div class="vnode-body">' + portsHtml + '</div>';
                
                el.addEventListener('mousedown', startDrag);
                el.addEventListener('click', selectNode);
                canvas.appendChild(el);
            }
        }
        
        function selectNode(e) {
            document.querySelectorAll('.vnode').forEach(n => n.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            selectedNode = nodes.find(n => n.id === e.currentTarget.dataset.id);
        }
        
        function startDrag(e) {
            dragNode = e.currentTarget;
            const rect = dragNode.getBoundingClientRect();
            dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function onDrag(e) {
            if (!dragNode) return;
            const canvas = document.getElementById('canvas');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - dragOffset.x;
            const y = e.clientY - rect.top - dragOffset.y;
            dragNode.style.left = x + 'px';
            dragNode.style.top = y + 'px';
            
            const node = nodes.find(n => n.id === dragNode.dataset.id);
            if (node) {
                node.position = { x, y };
            }
        }
        
        function stopDrag() {
            dragNode = null;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            syncToServer();
        }
        
        // Palette drag & drop
        document.querySelectorAll('.palette-node').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('nodeType', el.dataset.type);
            });
        });
        
        document.getElementById('canvas').addEventListener('dragover', e => e.preventDefault());
        document.getElementById('canvas').addEventListener('drop', e => {
            e.preventDefault();
            const type = e.dataTransfer.getData('nodeType');
            const rect = e.currentTarget.getBoundingClientRect();
            createNode(type, e.clientX - rect.left, e.clientY - rect.top);
        });
        
        function createNode(type, x, y) {
            const id = 'node_' + Date.now();
            const names = { capsule: 'NewCapsule', flow: 'newFlow', function: 'newFunction', entity: 'NewEntity', '3d': 'Scene3D' };
            nodes.push({
                id,
                type,
                name: names[type] || 'NewNode',
                position: { x, y },
                ports: { inputs: [], outputs: [{ id: 'out_' + id, name: 'return', type: 'void' }] },
                attributes: []
            });
            renderNodes();
            syncToServer();
            log('Created ' + type + ' node', 'success');
        }
        
        async function syncToServer() {
            await fetch('/api/graph/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes })
            });
        }
        
        function switchTab(panel) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.tab[data-panel="' + panel + '"]').classList.add('active');
            
            document.getElementById('canvas').style.display = panel === 'graph' ? 'block' : 'none';
            document.getElementById('editor-panel').classList.toggle('active', panel === 'editor');
            document.getElementById('preview-panel').classList.toggle('active', panel === 'preview');
        }
        
        function log(msg, type = '') {
            const output = document.getElementById('terminal-output');
            output.innerHTML += '<div class="terminal-line ' + type + '">> ' + msg + '</div>';
            output.scrollTop = output.scrollHeight;
        }
        
        async function runProject() {
            log('Running: ${server.project.run_command}', 'info');
            await fetch('/api/run', { method: 'POST' });
        }
        
        async function buildProject() {
            log('Building project...', 'info');
            await fetch('/api/build', { method: 'POST' });
        }
        
        function openPreview() {
            document.getElementById('preview-frame').src = 'http://localhost:${server.port + 1}';
            switchTab('preview');
        }
        
        async function saveProject() {
            log('Saving project...', 'info');
            await fetch('/api/save', { method: 'POST', body: JSON.stringify({ nodes }) });
            log('Project saved!', 'success');
        }
        
        function packageApp(target) {
            log('Packaging for ' + target + '...', 'info');
            fetch('/api/package?target=' + target, { method: 'POST' });
        }
        
        function showPackages() {
            log('Opening package registry...', 'info');
        }
        
        loadGraph();
    </script>
</body>
</html>`;
    
    return html;
}
function cmd_studio(port, open_app) {
    const cwd = "";
     cwd = process.cwd(); 
    const server = StudioServer_new;
    port;
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const mainFiles = ['main.omni', 'src/main.omni', 'app.omni'];
        for (const file of mainFiles) {
            const fullPath = path.join(cwd, file);
            if (fs.existsSync(fullPath)) {
                CLI_info("Loading: " + file);
                
                // Parse and create graph
                const source = fs.readFileSync(fullPath, 'utf-8');
                const lexer = new_lexer(source);
                const parser = new_parser(lexer);
                const program = Parser_parse_program(parser);
                
                server.graph = GraphState_from_ast(program);
                CLI_success("Graph generated: " + server.graph.nodes.length + " nodes");
                break;
            }
        }
    
    if (open_app) {
    CLI_info;
    "Opening native app (requires Tauri)...";
    
            const { exec } = require('child_process');
            const url = 'http://localhost:' + port;
            
            // Try to open browser as fallback
            const cmd = process.platform === 'win32' ? 'start' :
                        process.platform === 'darwin' ? 'open' : 'xdg-open';
            exec(cmd + ' ' + url);
        
}
    StudioServer_start;
    server;
    cwd;
    // Unknown stmt kind: 0
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.detect_project = detect_project;
    exports.CrossRunner_new = CrossRunner_new;
    exports.CrossRunner_run = CrossRunner_run;
    exports.CrossRunner_stop = CrossRunner_stop;
    exports.CrossRunner_stop_all = CrossRunner_stop_all;
    exports.GraphState_new = GraphState_new;
    exports.GraphState_from_ast = GraphState_from_ast;
    exports.GraphState_to_json = GraphState_to_json;
    exports.StudioServer_new = StudioServer_new;
    exports.StudioServer_start = StudioServer_start;
    exports.generate_studio_html = generate_studio_html;
    exports.cmd_studio = cmd_studio;
    exports.ProjectInfo = ProjectInfo;
    exports.CrossRunner = CrossRunner;
    exports.GraphNode = GraphNode;
    exports.GraphEdge = GraphEdge;
    exports.GraphState = GraphState;
    exports.StudioServer = StudioServer;
}


// === Module: core/studio_graph ===
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualNode)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualEdge)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualGraph)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualGraph_new)
BlockLoop: 10 (export)
BlockLoop: 10 (ast_to_graph)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_ast)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_code)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_json)
BlockLoop: 10 (export)
BlockLoop: 10 (json_to_graph)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_add_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_remove_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_move_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_add_edge)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_remove_edge)
var ast = exports;
var cli = exports;
class VisualNode {
    constructor(data = {}) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.ports_in = data.ports_in;
        this.ports_out = data.ports_out;
        this.attributes = data.attributes;
        this.properties = data.properties;
        this.parent_id = data.parent_id;
        this.ast_kind = data.ast_kind;
        this.ast_line = data.ast_line;
    }
}
class VisualEdge {
    constructor(data = {}) {
        this.id = data.id;
        this.source_node = data.source_node;
        this.source_port = data.source_port;
        this.target_node = data.target_node;
        this.target_port = data.target_port;
        this.edge_type = data.edge_type;
    }
}
class VisualGraph {
    constructor(data = {}) {
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.viewport = data.viewport;
        this.metadata = data.metadata;
    }
}
function VisualGraph_new() {
    return new VisualGraph({ nodes: [], edges: [], viewport: null, x: 0, y: 0, zoom: 1, .: null, metadata: null, version: "1.0", generated: "" });
}
// Unknown stmt kind: undefined
function ast_to_graph(program) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        graph.metadata.generated = new Date().toISOString();
        
        let nodeId = 0;
        let edgeId = 0;
        let y = 50;
        const NODE_HEIGHT = 80;
        const NODE_WIDTH = 200;
        const CAPSULE_PADDING = 40;
        
        // Helper to create node
        const createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
            return {
                id: 'node_' + (++nodeId),
                type: type,
                name: name,
                x: x,
                y: y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                ports_in: [],
                ports_out: [],
                attributes: [],
                properties: {},
                parent_id: parentId,
                ast_kind: astKind,
                ast_line: astLine || 0
            };
        };
        
        // Helper to create edge
        const createEdge = (srcNode, srcPort, tgtNode, tgtPort, type) => {
            return {
                id: 'edge_' + (++edgeId),
                source_node: srcNode,
                source_port: srcPort,
                target_node: tgtNode,
                target_port: tgtPort,
                edge_type: type
            };
        };
        
        // Process each statement
        for (const stmt of program.statements) {
            // Import
            if (stmt.kind === 10) { // NODE_IMPORT
                const node = createNode('import', stmt.path || stmt.value, 50, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                y += 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                const isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                const node = createNode(isEntity ? 'entity' : 'struct', stmt.name, 400, y, 70, stmt.line);
                
                // Add fields as ports
                for (const field of (stmt.fields || [])) {
                    const fieldName = typeof field === 'string' ? field : field.name;
                    const fieldType = typeof field === 'object' ? field.type : 'any';
                    node.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: fieldName,
                        type: fieldType
                    });
                }
                
                node.attributes = stmt.attributes || [];
                node.height = Math.max(NODE_HEIGHT, 40 + node.ports_out.length * 25);
                graph.nodes.push(node);
                y += node.height + 30;
                continue;
            }
            
            // Capsule
            if (stmt.kind === 93) { // NODE_CAPSULE
                const capsuleNode = createNode('capsule', stmt.name, 50, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + CAPSULE_PADDING;
                const flowNodes = [];
                
                // Process flows inside capsule
                for (const flow of (stmt.flows || [])) {
                    const flowNode = createNode('flow', flow.name, 70, innerY, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    // Input ports (params)
                    for (const param of (flow.params || [])) {
                        const paramName = typeof param === 'string' ? param : param.name;
                        const paramType = typeof param === 'object' ? param.type : 'any';
                        flowNode.ports_in.push({
                            id: 'port_' + (++nodeId),
                            name: paramName,
                            type: paramType
                        });
                    }
                    
                    // Output port (return)
                    flowNode.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: 'return',
                        type: flow.return_type || 'void'
                    });
                    
                    flowNode.attributes = flow.attributes || [];
                    flowNode.height = Math.max(60, 30 + Math.max(flowNode.ports_in.length, 1) * 25);
                    
                    graph.nodes.push(flowNode);
                    flowNodes.push(flowNode);
                    innerY += flowNode.height + 20;
                }
                
                // Set capsule height to contain all flows
                capsuleNode.height = innerY - y + CAPSULE_PADDING;
                graph.nodes.push(capsuleNode);
                
                // Create execution edges between flows
                for (let i = 0; i < flowNodes.length - 1; i++) {
                    const edge = createEdge(
                        flowNodes[i].id, 'exec_out',
                        flowNodes[i + 1].id, 'exec_in',
                        'execution'
                    );
                    graph.edges.push(edge);
                }
                
                y += capsuleNode.height + 50;
                continue;
            }
            
            // Function
            if (stmt.kind === 4) { // NODE_FUNCTION
                const node = createNode('function', stmt.name, 50, y, 4, stmt.line);
                
                // Input ports (params)
                for (const param of (stmt.params || [])) {
                    const paramName = typeof param === 'string' ? param : param.name;
                    const paramType = typeof param === 'object' ? param.type : 'any';
                    node.ports_in.push({
                        id: 'port_' + (++nodeId),
                        name: paramName,
                        type: paramType
                    });
                }
                
                // Output port (return)
                node.ports_out.push({
                    id: 'port_' + (++nodeId),
                    name: 'return',
                    type: stmt.return_type || 'void'
                });
                
                node.height = Math.max(NODE_HEIGHT, 40 + Math.max(node.ports_in.length, 1) * 25);
                graph.nodes.push(node);
                y += node.height + 30;
                continue;
            }
        }
    
    return graph;
}
function graph_to_ast(graph) {
    const program = null;
}

        program = {
            kind: 1, // NODE_PROGRAM
            statements: []
        };
        
        // Sort nodes by y position for correct order
        const sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group child nodes by parent
        const childrenMap = {};
        for (const node of sortedNodes) {
            if (node.parent_id) {
                if (!childrenMap[node.parent_id]) {
                    childrenMap[node.parent_id] = [];
                }
                childrenMap[node.parent_id].push(node);
            }
        }
        
        // Process top-level nodes only
        for (const node of sortedNodes) {
            if (node.parent_id) continue; // Skip children, processed with parent
            
            // Import
            if (node.type === 'import') {
                program.statements.push({
                    kind: 10,
                    path: node.name,
                    line: node.ast_line
                });
                continue;
            }
            
            // Struct / Entity
            if (node.type === 'struct' || node.type === 'entity') {
                const stmt = {
                    kind: 70,
                    name: node.name,
                    fields: node.ports_out.map(p => ({ name: p.name, type: p.type })),
                    attributes: node.type === 'entity' ? [{ name: 'entity' }] : [],
                    line: node.ast_line
                };
                program.statements.push(stmt);
                continue;
            }
            
            // Capsule
            if (node.type === 'capsule') {
                const flows = (childrenMap[node.id] || [])
                    .filter(n => n.type === 'flow')
                    .sort((a, b) => a.y - b.y)
                    .map(flowNode => ({
                        kind: 94,
                        name: flowNode.name,
                        params: flowNode.ports_in.map(p => ({ name: p.name, type: p.type })),
                        return_type: flowNode.ports_out[0]?.type || 'void',
                        attributes: flowNode.attributes,
                        body: { statements: [] },
                        line: flowNode.ast_line
                    }));
                
                program.statements.push({
                    kind: 93,
                    name: node.name,
                    flows: flows,
                    attributes: node.attributes,
                    line: node.ast_line
                });
                continue;
            }
            
            // Function
            if (node.type === 'function') {
                program.statements.push({
                    kind: 4,
                    name: node.name,
                    params: node.ports_in.map(p => ({ name: p.name, type: p.type })),
                    return_type: node.ports_out[0]?.type || 'void',
                    body: { statements: [] },
                    line: node.ast_line
                });
                continue;
            }
        }
    
return program;
// Unknown stmt kind: undefined
function graph_to_code(graph) {
    const code = "";
    
        const lines = [];
        lines.push("// Generated by Omni Studio Visual Editor");
        lines.push("// " + new Date().toISOString());
        lines.push("");
        
        // Sort nodes by y position
        const sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group children by parent
        const childrenMap = {};
        for (const node of sortedNodes) {
            if (node.parent_id) {
                if (!childrenMap[node.parent_id]) {
                    childrenMap[node.parent_id] = [];
                }
                childrenMap[node.parent_id].push(node);
            }
        }
        
        // Generate code for each top-level node
        for (const node of sortedNodes) {
            if (node.parent_id) continue;
            
            // Position comment (for round-trip)
            lines.push(`// @visual:position(${Math.round(node.x)}, ${Math.round(node.y)})`);
            
            // Import
            if (node.type === 'import') {
                lines.push(`import "${node.name}";`);
                lines.push("");
                continue;
            }
            
            // Entity / Struct
            if (node.type === 'entity' || node.type === 'struct') {
                if (node.type === 'entity') {
                    lines.push('@entity');
                }
                lines.push(`struct ${node.name} {`);
                for (const port of node.ports_out) {
                    lines.push(`    ${port.name}: ${port.type},`);
                }
                lines.push('}');
                lines.push("");
                continue;
            }
            
            // Capsule
            if (node.type === 'capsule') {
                lines.push(`capsule ${node.name} {`);
                
                const children = (childrenMap[node.id] || []).sort((a, b) => a.y - b.y);
                for (const child of children) {
                    if (child.type === 'flow') {
                        // Position comment
                        lines.push(`    // @visual:position(${Math.round(child.x)}, ${Math.round(child.y)})`);
                        
                        // Attributes
                        for (const attr of (child.attributes || [])) {
                            if (attr.name) {
                                const args = (attr.args || []).map(a => `"${a}"`).join(', ');
                                lines.push(`    @${attr.name}${args ? '(' + args + ')' : ''}`);
                            }
                        }
                        
                        // Flow signature
                        const params = child.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                        const returnType = child.ports_out[0]?.type || 'void';
                        const returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                        
                        lines.push(`    flow ${child.name}(${params})${returnStr} {`);
                        lines.push(`        // TODO: Implement`);
                        lines.push(`    }`);
                        lines.push("");
                    }
                }
                
                lines.push('}');
                lines.push("");
                continue;
            }
            
            // Function
            if (node.type === 'function') {
                const params = node.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                const returnType = node.ports_out[0]?.type || 'void';
                const returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                
                lines.push(`fn ${node.name}(${params})${returnStr} {`);
                lines.push(`    // TODO: Implement`);
                lines.push(`}`);
                lines.push("");
                continue;
            }
        }
        
        code = lines.join('\n');
    
    return code;
}
function graph_to_json(graph) {
    const json = "";
    
        json = JSON.stringify(graph, null, 2);
    
    return json;
}
function json_to_graph(json) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        try {
            const parsed = JSON.parse(json);
            graph.nodes = parsed.nodes || [];
            graph.edges = parsed.edges || [];
            graph.viewport = parsed.viewport || { x: 0, y: 0, zoom: 1.0 };
            graph.metadata = parsed.metadata || {};
        } catch (e) {
            console.error("[graph] Failed to parse JSON: " + e.message);
        }
    
    return graph;
}
function code_to_graph(source, program) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        // Parse @visual:position comments from source
        const positionMap = {};
        const lines = source.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(new RegExp("@visual:position\\((\\d+),\\s*(\\d+)\\)"));
            if (match) {
                // Position applies to next non-comment line
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                
                // Find next statement line
                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('@')) {
                        positionMap[j + 1] = { x, y }; // 1-indexed
                        break;
                    }
                }
            }
        }
        
        graph.metadata.generated = new Date().toISOString();
        graph.metadata.source = 'code';
        
        let nodeId = 0;
        let edgeId = 0;
        let defaultY = 50;
        const NODE_HEIGHT = 80;
        const NODE_WIDTH = 200;
        
        const createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
            return {
                id: 'node_' + (++nodeId),
                type: type,
                name: name,
                x: x,
                y: y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                ports_in: [],
                ports_out: [],
                attributes: [],
                properties: {},
                parent_id: parentId,
                ast_kind: astKind,
                ast_line: astLine || 0
            };
        };
        
        for (const stmt of program.statements) {
            // Get saved position or use default
            const savedPos = positionMap[stmt.line];
            const x = savedPos ? savedPos.x : 50;
            const y = savedPos ? savedPos.y : defaultY;
            
            // Import
            if (stmt.kind === 10) {
                const node = createNode('import', stmt.path || stmt.value, x, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                defaultY = y + 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) {
                const isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                const node = createNode(isEntity ? 'entity' : 'struct', stmt.name, x, y, 70, stmt.line);
                
                for (const field of (stmt.fields || [])) {
                    const fieldName = typeof field === 'string' ? field : field.name;
                    const fieldType = typeof field === 'object' ? field.type : 'any';
                    node.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: fieldName,
                        type: fieldType
                    });
                }
                
                node.attributes = stmt.attributes || [];
                node.height = Math.max(NODE_HEIGHT, 40 + node.ports_out.length * 25);
                graph.nodes.push(node);
                defaultY = y + node.height + 30;
                continue;
            }
            
            // Capsule
            if (stmt.kind === 93) {
                const capsuleNode = createNode('capsule', stmt.name, x, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + 40;
                
                for (const flow of (stmt.flows || [])) {
                    const flowPos = positionMap[flow.line];
                    const fx = flowPos ? flowPos.x : x + 20;
                    const fy = flowPos ? flowPos.y : innerY;
                    
                    const flowNode = createNode('flow', flow.name, fx, fy, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    for (const param of (flow.params || [])) {
                        const paramName = typeof param === 'string' ? param : param.name;
                        const paramType = typeof param === 'object' ? param.type : 'any';
                        flowNode.ports_in.push({
                            id: 'port_' + (++nodeId),
                            name: paramName,
                            type: paramType
                        });
                    }
                    
                    flowNode.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: 'return',
                        type: flow.return_type || 'void'
                    });
                    
                    flowNode.attributes = flow.attributes || [];
                    flowNode.height = Math.max(60, 30 + Math.max(flowNode.ports_in.length, 1) * 25);
                    
                    graph.nodes.push(flowNode);
                    innerY = fy + flowNode.height + 20;
                }
                
                capsuleNode.height = innerY - y + 40;
                graph.nodes.push(capsuleNode);
                defaultY = y + capsuleNode.height + 50;
                continue;
            }
            
            // Function
            if (stmt.kind === 4) {
                const node = createNode('function', stmt.name, x, y, 4, stmt.line);
                
                for (const param of (stmt.params || [])) {
                    const paramName = typeof param === 'string' ? param : param.name;
                    const paramType = typeof param === 'object' ? param.type : 'any';
                    node.ports_in.push({
                        id: 'port_' + (++nodeId),
                        name: paramName,
                        type: paramType
                    });
                }
                
                node.ports_out.push({
                    id: 'port_' + (++nodeId),
                    name: 'return',
                    type: stmt.return_type || 'void'
                });
                
                node.height = Math.max(NODE_HEIGHT, 40 + Math.max(node.ports_in.length, 1) * 25);
                graph.nodes.push(node);
                defaultY = y + node.height + 30;
                continue;
            }
        }
    
    return graph;
}
function get_installed_package_nodes() {
    const nodes = [];
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const packagesDir = path.join(process.cwd(), 'packages');
        if (!fs.existsSync(packagesDir)) {
            return;
        }
        
        const scanDir = (dir, pkgName = '') => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    const newPkgName = pkgName ? pkgName + '/' + entry.name : entry.name;
                    scanDir(fullPath, newPkgName);
                } else if (entry.name.endsWith('.omni')) {
                    try {
                        const source = fs.readFileSync(fullPath, 'utf-8');
                        
                        // Simple regex to find capsules and functions
                        const capsuleMatches = source.matchAll(new RegExp("capsule\\s+(\\w+)\\s*\\{", "g"));
                        for (const match of capsuleMatches) {
                            nodes.push({
                                type: 'package_capsule',
                                name: match[1],
                                package: pkgName,
                                file: entry.name,
                                import: pkgName + '/' + entry.name.replace('.omni', '')
                            });
                        }
                        
                        const fnMatches = source.matchAll(new RegExp("fn\\s+(\\w+)\\s*\\(", "g"));
                        for (const match of fnMatches) {
                            // Skip private functions (starting with _)
                            if (!match[1].startsWith('_')) {
                                nodes.push({
                                    type: 'package_function',
                                    name: match[1],
                                    package: pkgName,
                                    file: entry.name,
                                    import: pkgName + '/' + entry.name.replace('.omni', '')
                                });
                            }
                        }
                    } catch (e) {
                        // Skip files that can't be read
                    }
                }
            }
        };
        
        scanDir(packagesDir);
    }
    
    return nodes;

    function graph_add_node(graph, node_type, name, x, y) {
    const new_id = "";
    
        new_id = 'node_' + Date.now();
        
        const node = {
            id: new_id,
            type: node_type,
            name: name,
            x: x,
            y: y,
            width: 200,
            height: 80,
            ports_in: [],
            ports_out: [],
            attributes: [],
            properties: {},
            parent_id: null,
            ast_kind: 0,
            ast_line: 0
        };
        
        // Default ports based on type
        if (node_type === 'function' || node_type === 'flow') {
            node.ports_out.push({ id: 'port_ret_' + new_id, name: 'return', type: 'void' });
        }
        
        graph.nodes.push(node);
    
    return new_id;
}
    function graph_remove_node(graph, node_id) {
    
        // Remove node
        graph.nodes = graph.nodes.filter(n => n.id !== node_id);
        
        // Remove connected edges
        graph.edges = graph.edges.filter(e => 
            e.source_node !== node_id && e.target_node !== node_id
        );
        
        // Remove children
        graph.nodes = graph.nodes.filter(n => n.parent_id !== node_id);
    
}
    function graph_move_node(graph, node_id, x, y) {
    
        const node = graph.nodes.find(n => n.id === node_id);
        if (node) {
            const dx = x - node.x;
            const dy = y - node.y;
            node.x = x;
            node.y = y;
            
            // Move children too
            for (const child of graph.nodes) {
                if (child.parent_id === node_id) {
                    child.x += dx;
                    child.y += dy;
                }
            }
        }
    
}
    function graph_add_edge(graph, src_node, src_port, tgt_node, tgt_port) {
    const new_id = "";
    
        new_id = 'edge_' + Date.now();
        
        graph.edges.push({
            id: new_id,
            source_node: src_node,
            source_port: src_port,
            target_node: tgt_node,
            target_port: tgt_port,
            edge_type: 'data'
        });
    
    return new_id;
}
    function graph_remove_edge(graph, edge_id) {
    
        graph.edges = graph.edges.filter(e => e.id !== edge_id);
    
}
    export;
    VisualNode;
    export;
    VisualEdge;
    export;
    VisualGraph;
    export;
    VisualGraph_new;
    export;
    ast_to_graph;
    export;
    graph_to_ast;
    export;
    graph_to_code;
    export;
    graph_to_json;
    export;
    json_to_graph;
    export;
    graph_add_node;
    export;
    graph_remove_node;
    export;
    graph_move_node;
    export;
    graph_add_edge;
    export;
    graph_remove_edge;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.VisualGraph_new = VisualGraph_new;
    exports.ast_to_graph = ast_to_graph;
    exports.graph_to_ast = graph_to_ast;
    exports.graph_to_code = graph_to_code;
    exports.graph_to_json = graph_to_json;
    exports.json_to_graph = json_to_graph;
    exports.code_to_graph = code_to_graph;
    exports.get_installed_package_nodes = get_installed_package_nodes;
    exports.graph_add_node = graph_add_node;
    exports.graph_remove_node = graph_remove_node;
    exports.graph_move_node = graph_move_node;
    exports.graph_add_edge = graph_add_edge;
    exports.graph_remove_edge = graph_remove_edge;
    exports.VisualNode = VisualNode;
    exports.VisualEdge = VisualEdge;
    exports.VisualGraph = VisualGraph;
}


// === Module: core/app_packager ===
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
BlockLoop: 10 (target)
BlockLoop: 43 ())
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
BlockLoop: 10 (config)
BlockLoop: 31 (.)
BlockLoop: 10 (name)
BlockLoop: 21 (+)
BlockLoop: 12 ( v)
BlockLoop: 21 (+)
BlockLoop: 10 (config)
BlockLoop: 31 (.)
BlockLoop: 10 (version)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
var cli = exports;
class AppConfig {
    constructor(data = {}) {
        this.name = data.name;
        this.version = data.version;
        this.icon = data.icon;
        this.description = data.description;
        this.author = data.author;
        this.bundle_id = data.bundle_id;
    }
}
function AppConfig_default() {
    return new AppConfig({ name: "OmniApp", version: "1.0.0", icon: "", description: "Built with Omni", author: "Omni Developer", bundle_id: "org.omni.app" });
}
function detect_platform() {
    const platform = "unknown";
    
        platform = process.platform;
    
    return platform;
}
function detect_build_tools() {
    const tools = null;
}

        const { execSync } = require('child_process');
        
        tools = {
            gcc: false,
            clang: false,
            cargo: false,
            android_sdk: false,
            xcode: false,
            wix: false
        };
        
        const check = (cmd) => {
            try {
                execSync(cmd + ' --version', { stdio: 'ignore' });
                return true;
            } catch (e) {
                return false;
            }
        };
        
        tools.gcc = check('gcc');
        tools.clang = check('clang');
        tools.cargo = check('cargo');
        
        // Check for Android SDK
        tools.android_sdk = !!process.env.ANDROID_HOME;
        
        // Check for Xcode (macOS only)
        if (process.platform === 'darwin') {
            tools.xcode = check('xcodebuild');
        }
        
        // Check for WiX (Windows installer)
        if (process.platform === 'win32') {
            tools.wix = check('candle');
        }
    
return tools;
// Unknown stmt kind: undefined
function generate_tauri_config(config, is_studio) {
    const json = "";
    
        const tauriConfig = {
            "build": {
                "distDir": is_studio ? "../studio/dist" : "../dist",
                "devPath": is_studio ? "http://localhost:3000" : "http://localhost:8080"
            },
            "package": {
                "productName": config.name,
                "version": config.version
            },
            "tauri": {
                "bundle": {
                    "active": true,
                    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"],
                    "identifier": config.bundle_id,
                    "targets": ["msi", "appimage", "dmg"]
                },
                "windows": [{
                    "title": config.name,
                    "width": 1280,
                    "height": 800,
                    "minWidth": 800,
                    "minHeight": 600,
                    "resizable": true,
                    "fullscreen": false
                }],
                "allowlist": {
                    "shell": { "execute": true },
                    "fs": { "all": true },
                    "path": { "all": true },
                    "process": { "all": true },
                    "http": { "all": true }
                }
            }
        };
        
        json = JSON.stringify(tauriConfig, null, 2);
    
    return json;
}
function generate_capacitor_config(config) {
    const json = "";
    
        const capConfig = {
            "appId": config.bundle_id,
            "appName": config.name,
            "webDir": "dist",
            "server": {
                "androidScheme": "https"
            },
            "plugins": {
                "SplashScreen": {
                    "launchShowDuration": 2000,
                    "backgroundColor": "#0d1117"
                }
            }
        };
        
        json = JSON.stringify(capConfig, null, 2);
    
    return json;
}
function cmd_package_app(target, config) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni App Packager";
    CLI_info;
    "Target: ";
    target;
    // Unknown stmt kind: 0
    CLI_info;
    "App: ";
    config;
    // Unknown stmt kind: 0
    name;
    // Unknown stmt kind: 0
    " v";
    // Unknown stmt kind: 0
    config;
    // Unknown stmt kind: 0
    version;
    // Unknown stmt kind: 0
    const tools = detect_build_tools;
    // Unknown stmt kind: 0
    const platform = detect_platform;
    // Unknown stmt kind: 0
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        const omniDir = path.join(__dirname, '..');
        const buildDir = path.join(omniDir, 'build');
        const distDir = path.join(omniDir, 'dist', 'app');
        
        // Create build directories
        [buildDir, distDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        
        // ================================================================
        // WINDOWS BUILD
        // ================================================================
        if (target === 'windows' || target === 'win32' || target === 'exe') {
            CLI_step(1, 4, "Generating Windows project...");
            
            // Create Tauri project structure
            const tauriDir = path.join(buildDir, 'tauri');
            if (!fs.existsSync(tauriDir)) {
                fs.mkdirSync(tauriDir, { recursive: true });
            }
            
            // Write tauri.conf.json
            const tauriConfig = generate_tauri_config(config, true);
            fs.writeFileSync(path.join(tauriDir, 'tauri.conf.json'), tauriConfig);
            CLI_success("Generated: build/tauri/tauri.conf.json");
            
            CLI_step(2, 4, "Copying Studio UI...");
            
            // Copy Studio files
            const studioDistDir = path.join(tauriDir, 'studio', 'dist');
            if (!fs.existsSync(studioDistDir)) {
                fs.mkdirSync(studioDistDir, { recursive: true });
            }
            
            // Generate minimal index.html that loads Studio
            const indexHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${config.name}</title></head>
<body>
<script>
    // Omni Studio loads here
    window.location.href = 'http://localhost:3000';
</script>
</body>
</html>`;
            fs.writeFileSync(path.join(studioDistDir, 'index.html'), indexHtml);
            
            CLI_step(3, 4, "Checking Tauri...");
            
            if (!tools.cargo) {
                CLI_warning("Rust/Cargo not found. Required for Tauri builds.");
                CLI_info("Install Rust: https://rustup.rs/");
                console.log("");
                CLI_info("Manual build steps:");
                console.log(CLI_COLORS.dim + "  cd build/tauri" + CLI_COLORS.reset);
                console.log(CLI_COLORS.dim + "  cargo tauri build" + CLI_COLORS.reset);
                return;
            }
            
            CLI_step(4, 4, "Building...");
            
            console.log("");
            console.log(CLI_COLORS.yellow + "  To complete the Windows build:" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  cd build/tauri" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  cargo install tauri-cli" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  cargo tauri build" + CLI_COLORS.reset);
            console.log("");
            CLI_success("Windows project ready in build/tauri/");
            return;
        }
        
        // ================================================================
        // ANDROID BUILD
        // ================================================================
        if (target === 'android' || target === 'apk') {
            CLI_step(1, 5, "Generating Capacitor project...");
            
            const capDir = path.join(buildDir, 'capacitor');
            if (!fs.existsSync(capDir)) {
                fs.mkdirSync(capDir, { recursive: true });
            }
            
            // Write capacitor.config.json
            const capConfig = generate_capacitor_config(config);
            fs.writeFileSync(path.join(capDir, 'capacitor.config.json'), capConfig);
            CLI_success("Generated: build/capacitor/capacitor.config.json");
            
            // Create package.json
            const packageJson = {
                "name": config.bundle_id.replace(/\./g, '-'),
                "version": config.version,
                "scripts": {
                    "build": "echo 'Building...'",
                    "cap:add": "npx cap add android",
                    "cap:sync": "npx cap sync",
                    "cap:open": "npx cap open android"
                },
                "dependencies": {
                    "@capacitor/android": "^5.0.0",
                    "@capacitor/core": "^5.0.0",
                    "@capacitor/cli": "^5.0.0"
                }
            };
            fs.writeFileSync(path.join(capDir, 'package.json'), JSON.stringify(packageJson, null, 2));
            
            CLI_step(2, 5, "Creating dist folder...");
            
            const distFolder = path.join(capDir, 'dist');
            if (!fs.existsSync(distFolder)) {
                fs.mkdirSync(distFolder, { recursive: true });
            }
            
            // Create minimal index.html
            const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { text-align: center; padding: 20px; }
        h1 { font-size: 2rem; margin-bottom: 1rem; color: #58a6ff; }
        p { color: #8b949e; }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #238636;
            color: white;
            border-radius: 8px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>◊ ${config.name}</h1>
        <p>Built with Omni</p>
        <a href="#" class="btn" onclick="window.location.reload()">Start</a>
    </div>
</body>
</html>`;
            fs.writeFileSync(path.join(distFolder, 'index.html'), indexHtml);
            
            CLI_step(3, 5, "Checking Android SDK...");
            
            if (!tools.android_sdk) {
                CLI_warning("Android SDK not found (ANDROID_HOME not set)");
                CLI_info("Install Android Studio: https://developer.android.com/studio");
            }
            
            CLI_step(4, 5, "Generating build instructions...");
            
            console.log("");
            console.log(CLI_COLORS.yellow + "  To complete the Android build:" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  cd build/capacitor" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npm install" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap add android" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap sync" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap open android" + CLI_COLORS.reset);
            console.log("");
            
            CLI_step(5, 5, "Done!");
            CLI_success("Android project ready in build/capacitor/");
            return;
        }
        
        // ================================================================
        // LINUX BUILD
        // ================================================================
        if (target === 'linux' || target === 'appimage') {
            CLI_step(1, 3, "Generating Linux project...");
            
            const linuxDir = path.join(buildDir, 'linux');
            if (!fs.existsSync(linuxDir)) {
                fs.mkdirSync(linuxDir, { recursive: true });
            }
            
            // Write desktop file
            const desktopEntry = `[Desktop Entry]
Name=${config.name}
Comment=${config.description}
Exec=omni
Icon=omni
Type=Application
Categories=Development;IDE;
`;
            fs.writeFileSync(path.join(linuxDir, config.name + '.desktop'), desktopEntry);
            
            // Write AppImage recipe
            const appImageYml = `app: ${config.name}
ingredients:
  dist: omni-installer
  script:
    - echo "Building Omni AppImage"

script:
  - mkdir -p AppDir/usr/bin
  - cp omni AppDir/usr/bin/
  - cp -r studio AppDir/usr/share/omni/
`;
            fs.writeFileSync(path.join(linuxDir, 'AppImageBuilder.yml'), appImageYml);
            
            CLI_step(2, 3, "Generated Linux files");
            CLI_step(3, 3, "Done!");
            
            console.log("");
            CLI_info("To build AppImage:");
            console.log(CLI_COLORS.dim + "  cd build/linux" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + "  appimage-builder --recipe AppImageBuilder.yml" + CLI_COLORS.reset);
            
            CLI_success("Linux project ready in build/linux/");
            return;
        }
        
        // Unknown target
        CLI_error("Unknown target: " + target);
        CLI_info("Available targets: windows, android, linux");
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.AppConfig_default = AppConfig_default;
    exports.detect_platform = detect_platform;
    exports.detect_build_tools = detect_build_tools;
    exports.generate_tauri_config = generate_tauri_config;
    exports.generate_capacitor_config = generate_capacitor_config;
    exports.cmd_package_app = cmd_package_app;
    exports.AppConfig = AppConfig;
}


// === Module: core/tui ===
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 10 (tui_enable_raw_mode)
BlockLoop: 42 (()
BlockLoop: 10 (tui_hide_cursor)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 80 (native)
var cli = exports;
class TUIState {
    constructor(data = {}) {
        this.screen = data.screen;
        this.cursor = data.cursor;
        this.items = data.items;
        this.selected = data.selected;
        this.message = data.message;
        this.running = data.running;
    }
}
function TUIState_new() {
    return new TUIState({ screen: "main", cursor: 0, items: [], selected: [], message: "", running: true });
}
function tui_enable_raw_mode() {
    
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
    
}
function tui_disable_raw_mode() {
    
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
    
}
function tui_clear_screen() {
    
        console.clear();
        process.stdout.write('\x1B[2J\x1B[0f');
    
}
function tui_move_cursor(row, col) {
    
        process.stdout.write(`\x1B[${row};${col}H`);
    
}
function tui_hide_cursor() {
    
        process.stdout.write('\x1B[?25l');
    
}
function tui_show_cursor() {
    
        process.stdout.write('\x1B[?25h');
    
}
function tui_render_header(title, subtitle) {
    
        const width = process.stdout.columns || 80;
        const line = 'â•'.repeat(width - 2);
        
        console.log(CLI_COLORS.cyan + 'â•”' + line + 'â•—' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 'â•‘' + CLI_COLORS.reset + 
                    CLI_COLORS.bold + ' â—Š OMNI ' + title.padEnd(width - 12) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + 'â•‘' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 'â•‘' + CLI_COLORS.reset + 
                    CLI_COLORS.dim + '   ' + subtitle.padEnd(width - 6) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + 'â•‘' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 'â• ' + line + 'â•£' + CLI_COLORS.reset);
    
}
function tui_render_menu(state) {
    
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const selected = i === state.cursor;
            const prefix = selected ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            const suffix = CLI_COLORS.reset;
            
            if (selected) {
                console.log(prefix + CLI_COLORS.bold + item.label + suffix);
            } else {
                console.log(prefix + CLI_COLORS.dim + item.label + suffix);
            }
        }
    
}
function tui_render_footer(state) {
    
        const width = process.stdout.columns || 80;
        const line = 'â”€'.repeat(width - 2);
        
        console.log('');
        console.log(CLI_COLORS.dim + 'â”Œ' + line + 'â”' + CLI_COLORS.reset);
        
        if (state.message) {
            console.log(CLI_COLORS.dim + 'â”‚ ' + CLI_COLORS.reset + 
                        state.message.padEnd(width - 4) + 
                        CLI_COLORS.dim + ' â”‚' + CLI_COLORS.reset);
        }
        
        console.log(CLI_COLORS.dim + 'â”‚ â†‘/â†“ Navigate   Enter Select   q Quit' + 
                    ''.padEnd(width - 42) + ' â”‚' + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + 'â””' + line + 'â”˜' + CLI_COLORS.reset);
    
}
function tui_render_file_list(state) {
    
        console.log('');
        console.log(CLI_COLORS.cyan + '  Select files to convert:' + CLI_COLORS.reset);
        console.log('');
        
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const isSelected = state.selected.includes(i);
            const isCursor = i === state.cursor;
            
            const checkbox = isSelected ? CLI_COLORS.green + '[âœ“]' : CLI_COLORS.dim + '[ ]';
            const prefix = isCursor ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            
            console.log(prefix + checkbox + CLI_COLORS.reset + ' ' + 
                        (isCursor ? CLI_COLORS.bold : CLI_COLORS.dim) + 
                        item.name + CLI_COLORS.reset);
        }
    
}
function tui_render_target_select(state) {
    
        console.log('');
        console.log(CLI_COLORS.cyan + '  Select target language:' + CLI_COLORS.reset);
        console.log('');
        
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const isCursor = i === state.cursor;
            
            const prefix = isCursor ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            const icon = item.icon || 'ðŸŽ¯';
            
            console.log(prefix + icon + ' ' + 
                        (isCursor ? CLI_COLORS.bold : '') + 
                        item.label + CLI_COLORS.reset);
            
            if (isCursor && item.description) {
                console.log('      ' + CLI_COLORS.dim + item.description + CLI_COLORS.reset);
            }
        }
    
}
function tui_main_menu() {
    return [null, id, null, "convert", label, null, "ðŸ”„ Convert Legacy Code", description, null, "Transform PHP, Java, Python to Omni", null, null, id, null, "install", label, null, "ðŸ“¦ Install Package", description, null, "Install from GitHub", null, null, id, null, "studio", label, null, "ðŸŽ¨ Open Studio", description, null, "Visual programming environment", null, null, id, null, "build", label, null, "ðŸ”¨ Build Project", description, null, "Compile current project", null, null, id, null, "run", label, null, "â–¶ï¸  Run Project", description, null, "Execute main file", null, null, id, null, "doctor", label, null, "ðŸ©º System Doctor", description, null, "Check installation health", null, null, id, null, "quit", label, null, "âŒ Quit", description, null, "", null];
}
function tui_target_menu() {
    return [null, id, null, "js", label, null, "JavaScript (Node.js)", icon, null, "ðŸŸ¨", description, null, "CommonJS module", null, null, id, null, "python", label, null, "Python 3", icon, null, "ðŸ", description, null, "Python 3.8+ compatible", null, null, id, null, "c", label, null, "C Native", icon, null, "âš¡", description, null, "Portable C99 code", null, null, id, null, "lua", label, null, "Lua 5.4", icon, null, "ðŸŒ™", description, null, "Lua script", null, null, id, null, "wasm", label, null, "WebAssembly", icon, null, "ðŸ•¸ï¸", description, null, "WASM binary", null, null, id, null, "back", label, null, "â† Back", icon, null, "â—€ï¸", description, null, "", null];
}
function tui_scan_legacy_files(dir) {
    const files = [];
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        const extensions = ['.php', '.java', '.py', '.js', '.ts'];
        
        const scan = (d) => {
            try {
                const entries = fs.readdirSync(d, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
                    
                    const fullPath = path.join(d, entry.name);
                    
                    if (entry.isDirectory()) {
                        scan(fullPath);
                    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
                        files.push({
                            name: path.relative(dir, fullPath),
                            path: fullPath,
                            ext: path.extname(entry.name)
                        });
                    }
                }
            } catch (e) {
                // Skip inaccessible directories
            }
        };
        
        scan(dir);
    
    return files;
}
function cmd_tui() {
    const state = TUIState_new;
    // Unknown stmt kind: 0
    
        state.items = tui_main_menu();
    
    tui_enable_raw_mode;
    // Unknown stmt kind: 0
    tui_hide_cursor;
    // Unknown stmt kind: 0
    
        const readline = require('readline');
        
        const render = () => {
            tui_clear_screen();
            tui_render_header('INTERACTIVE', 'v1.1.0 - Use arrow keys to navigate');
            
            if (state.screen === 'main') {
                tui_render_menu(state);
            } else if (state.screen === 'files') {
                tui_render_file_list(state);
            } else if (state.screen === 'targets') {
                tui_render_target_select(state);
            }
            
            tui_render_footer(state);
        };
        
        const handleAction = (action) => {
            if (action === 'convert') {
                state.screen = 'files';
                state.items = tui_scan_legacy_files(process.cwd());
                state.cursor = 0;
                state.selected = [];
                state.message = 'Space to select, Enter to continue';
            } else if (action === 'install') {
                state.message = 'Use: omni install github:user/repo';
                setTimeout(() => { state.message = ''; render(); }, 2000);
            } else if (action === 'studio') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nStarting Omni Studio...');
                require('child_process').execSync('node dist/main.js studio', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'build') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nBuilding project...');
                require('child_process').execSync('node dist/main.js build', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'run') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nRunning project...');
                require('child_process').execSync('node dist/main.js run main.omni', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'doctor') {
                tui_show_cursor();
                tui_disable_raw_mode();
                cmd_doctor();
                process.exit(0);
            } else if (action === 'quit') {
                state.running = false;
            } else if (action === 'select_target') {
                state.screen = 'targets';
                state.items = tui_target_menu();
                state.cursor = 0;
                state.message = 'Select output target';
            } else if (action === 'back') {
                state.screen = 'main';
                state.items = tui_main_menu();
                state.cursor = 0;
            } else if (action.startsWith('target:')) {
                const target = action.split(':')[1];
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nConverting ' + state.selected.length + ' files to ' + target + '...');
                // Here would call ingest for each selected file
                process.exit(0);
            }
        };
        
        process.stdin.on('data', (key) => {
            // Handle key presses
            if (key === '\u001B[A') { // Up arrow
                state.cursor = Math.max(0, state.cursor - 1);
            } else if (key === '\u001B[B') { // Down arrow
                state.cursor = Math.min(state.items.length - 1, state.cursor + 1);
            } else if (key === ' ' && state.screen === 'files') { // Space - toggle select
                const idx = state.selected.indexOf(state.cursor);
                if (idx >= 0) {
                    state.selected.splice(idx, 1);
                } else {
                    state.selected.push(state.cursor);
                }
            } else if (key === '\r' || key === '\n') { // Enter
                const item = state.items[state.cursor];
                if (state.screen === 'main') {
                    handleAction(item.id);
                } else if (state.screen === 'files') {
                    if (state.selected.length > 0) {
                        handleAction('select_target');
                    } else {
                        state.message = 'Select at least one file';
                    }
                } else if (state.screen === 'targets') {
                    if (item.id === 'back') {
                        handleAction('back');
                    } else {
                        handleAction('target:' + item.id);
                    }
                }
            } else if (key === 'q' || key === '\u0003') { // q or Ctrl+C
                state.running = false;
            } else if (key === '\u001B' || key === 'b') { // Escape or b - back
                if (state.screen !== 'main') {
                    handleAction('back');
                }
            }
            
            if (state.running) {
                render();
            } else {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nGoodbye! ðŸ‘‹');
                process.exit(0);
            }
        });
        
        // Initial render
        render();
    
}
function tui_quick_convert(files, target) {
    
        console.log(CLI_COLORS.cyan + 'â—Š Quick Convert' + CLI_COLORS.reset);
        console.log('');
        
        for (const file of files) {
            console.log(CLI_COLORS.dim + '  Converting: ' + file + CLI_COLORS.reset);
            // Would call ingest here
        }
        
        CLI_success('Conversion complete!');
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.TUIState_new = TUIState_new;
    exports.tui_enable_raw_mode = tui_enable_raw_mode;
    exports.tui_disable_raw_mode = tui_disable_raw_mode;
    exports.tui_clear_screen = tui_clear_screen;
    exports.tui_move_cursor = tui_move_cursor;
    exports.tui_hide_cursor = tui_hide_cursor;
    exports.tui_show_cursor = tui_show_cursor;
    exports.tui_render_header = tui_render_header;
    exports.tui_render_menu = tui_render_menu;
    exports.tui_render_footer = tui_render_footer;
    exports.tui_render_file_list = tui_render_file_list;
    exports.tui_render_target_select = tui_render_target_select;
    exports.tui_main_menu = tui_main_menu;
    exports.tui_target_menu = tui_target_menu;
    exports.tui_scan_legacy_files = tui_scan_legacy_files;
    exports.cmd_tui = cmd_tui;
    exports.tui_quick_convert = tui_quick_convert;
    exports.TUIState = TUIState;
}


// === Module: lib/std ===
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
function print(msg) {
     console.log(msg); 
    
print(msg)

}
function read_file(path) {
    const content = "";
    
        // const fs = require("fs"); (hoisted)
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }
    
    
with open(path, "r") as f:
    content = f.read()

    return content;
}
function write_file(path, content) {
    
        // const fs = require("fs"); (hoisted)
        try {
            fs.writeFileSync(path, content);
        } catch (e) {
            console.error("Error writing file " + path + ": " + e.message);
            process.exit(1);
        }
    
    
with open(path, "w") as f:
    f.write(content)

}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.print = print;
    exports.read_file = read_file;
    exports.write_file = write_file;
}


// === Module: lib/cli ===
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (CLI_COLORS_CACHE)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_COLORS_INIT)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
class Colors {
    constructor(data = {}) {
        this.reset = data.reset;
        this.bold = data.bold;
        this.dim = data.dim;
        this.underline = data.underline;
        this.black = data.black;
        this.red = data.red;
        this.green = data.green;
        this.yellow = data.yellow;
        this.blue = data.blue;
        this.magenta = data.magenta;
        this.cyan = data.cyan;
        this.white = data.white;
        this.bg_black = data.bg_black;
        this.bg_red = data.bg_red;
        this.bg_green = data.bg_green;
        this.bg_yellow = data.bg_yellow;
        this.bg_blue = data.bg_blue;
        this.bg_magenta = data.bg_magenta;
        this.bg_cyan = data.bg_cyan;
        this.bg_white = data.bg_white;
    }
}
function Colors_new() {
    const c = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
    
        // Check if terminal supports colors
        const supportsColor = process.stdout.isTTY && 
            (process.env.TERM !== 'dumb') && 
            !process.env.NO_COLOR;
        
        if (supportsColor) {
            c.reset = '\x1b[0m';
            c.bold = '\x1b[1m';
            c.dim = '\x1b[2m';
            c.underline = '\x1b[4m';
            
            c.black = '\x1b[30m';
            c.red = '\x1b[31m';
            c.green = '\x1b[32m';
            c.yellow = '\x1b[33m';
            c.blue = '\x1b[34m';
            c.magenta = '\x1b[35m';
            c.cyan = '\x1b[36m';
            c.white = '\x1b[37m';
            
            c.bg_black = '\x1b[40m';
            c.bg_red = '\x1b[41m';
            c.bg_green = '\x1b[42m';
            c.bg_yellow = '\x1b[43m';
            c.bg_blue = '\x1b[44m';
            c.bg_magenta = '\x1b[45m';
            c.bg_cyan = '\x1b[46m';
            c.bg_white = '\x1b[47m';
        }
    
    return c;
}
const CLI_COLORS_INIT = false;
const CLI_COLORS_CACHE = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
function CLI_COLORS() {
    if (CLI_COLORS_INIT) {
    false;
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    CLI_COLORS_CACHE = Colors_new;
    // Unknown stmt kind: 0
    CLI_COLORS_INIT = true;
}
return CLI_COLORS_CACHE;
// Unknown stmt kind: undefined
function CLI_success(msg) {
    
        const c = CLI_COLORS();
        console.log(c.green + 'âœ“' + c.reset + ' ' + msg);
    
}
function CLI_error(msg) {
    
        const c = CLI_COLORS();
        console.error(c.red + 'âœ—' + c.reset + ' ' + msg);
    
}
function CLI_warning(msg) {
    
        const c = CLI_COLORS();
        console.log(c.yellow + 'âš ' + c.reset + ' ' + msg);
    
}
function CLI_info(msg) {
    
        const c = CLI_COLORS();
        console.log(c.blue + 'â„¹' + c.reset + ' ' + msg);
    
}
function CLI_step(step, total, msg) {
    
        const c = CLI_COLORS();
        const prefix = c.cyan + '[' + step + '/' + total + ']' + c.reset;
        console.log(prefix + ' ' + msg);
    
}
function CLI_header(title) {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + c.cyan + 'â•â•â• ' + title + ' â•â•â•' + c.reset);
        console.log('');
    
}
function CLI_dim(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.dim + msg + c.reset;
    
    return result;
}
function CLI_bold(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.bold + msg + c.reset;
    
    return result;
}
function CLI_green(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.green + msg + c.reset;
    
    return result;
}
function CLI_red(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.red + msg + c.reset;
    
    return result;
}
function CLI_yellow(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.yellow + msg + c.reset;
    
    return result;
}
function CLI_cyan(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.cyan + msg + c.reset;
    
    return result;
}
class Spinner {
    constructor(data = {}) {
        this.frames = data.frames;
        this.current = data.current;
        this.interval = data.interval;
        this.message = data.message;
        this.running = data.running;
    }
}
function Spinner_new(message) {
    const spinner = new Spinner({ frames: "â ‹â ™â ¹â ¸â ¼â ´â ¦â §â ‡â ", current: 0, interval: 0, message: message, running: false });
    return spinner;
}
function Spinner_start(self) {
    
        if (self.running) return;
        self.running = true;
        const frames = self.frames.split('');
        const c = CLI_COLORS();
        
        self.interval = setInterval(() => {
            process.stdout.write('\r' + c.cyan + 
                frames[self.current % frames.length] + c.reset + 
                ' ' + self.message);
            self.current = (self.current + 1) % frames.length;
        }, 80);
    
}
function Spinner_stop(self, success) {
    
        if (!self.running) return;
        
        clearInterval(self.interval);
        self.running = false;
        const c = CLI_COLORS();
        
        const icon = success 
            ? c.green + 'âœ“' + c.reset 
            : c.red + 'âœ—' + c.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
    
}
function CLI_progress_bar(current, total, width) {
    const result = "";
    
        const c = CLI_COLORS();
        const percent = Math.floor((current / total) * 100);
        const filled = Math.floor((current / total) * width);
        const empty = width - filled;
        
        const bar = c.green + 'â–ˆ'.repeat(filled) + 
                    c.dim + 'â–‘'.repeat(empty) + c.reset;
        
        result = bar + ' ' + percent + '%';
    
    return result;
}
class ParsedArgs {
    constructor(data = {}) {
        this.command = data.command;
        this.arg1 = data.arg1;
        this.arg2 = data.arg2;
        this.arg3 = data.arg3;
        this.flag_help = data.flag_help;
        this.flag_version = data.flag_version;
        this.flag_verbose = data.flag_verbose;
        this.flag_global = data.flag_global;
        this.flag_app = data.flag_app;
        this.flag_tui = data.flag_tui;
        this.opt_target = data.opt_target;
        this.opt_port = data.opt_port;
        this.opt_framework = data.opt_framework;
    }
}
function ParsedArgs_new() {
    const args = new ParsedArgs({ command: "", arg1: "", arg2: "", arg3: "", flag_help: false, flag_version: false, flag_verbose: false, flag_global: false, flag_app: false, flag_tui: false, opt_target: "js", opt_port: "3000", opt_framework: "" });
    
        const argv = process.argv.slice(2);
        
        let positional = [];
        for (let i = 0; i < argv.length; i++) {
            const arg = argv[i];
            
            if (arg === '--help' || arg === '-h') {
                args.flag_help = true;
            } else if (arg === '--version' || arg === '-v') {
                args.flag_version = true;
            } else if (arg === '--verbose' || arg === '-V') {
                args.flag_verbose = true;
            } else if (arg === '--global' || arg === '-g') {
                args.flag_global = true;
            } else if (arg === '--app') {
                args.flag_app = true;
            } else if (arg === '--tui') {
                args.flag_tui = true;
            } else if (arg === '--target' && argv[i + 1]) {
                args.opt_target = argv[++i];
            } else if (arg === '--port' && argv[i + 1]) {
                args.opt_port = argv[++i];
            } else if (arg === '--framework' && argv[i + 1]) {
                args.opt_framework = argv[++i];
            } else if (!arg.startsWith('-')) {
                positional.push(arg);
            }
        }
        
        args.command = positional[0] || '';
        args.arg1 = positional[1] || '';
        args.arg2 = positional[2] || '';
        args.arg3 = positional[3] || '';
    
    return args;
}
function CLI_table_simple(col1, col2) {
    
        const c = CLI_COLORS();
        console.log('  ' + c.cyan + col1.padEnd(20) + c.reset + col2);
    
}
function CLI_table_header(title) {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + title + c.reset);
        console.log('â”€'.repeat(50));
    
}
function CLI_banner() {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.cyan + c.bold + 
            '   ____  __  __ _   _ ___ ' + c.reset);
        console.log(c.cyan + 
            '  / __ \\|  \\/  | \\ | |_ _|' + c.reset);
        console.log(c.cyan + 
            ' | |  | | |\\/| |  \\| || | ' + c.reset);
        console.log(c.cyan + 
            ' | |__| | |  | | |\\  || | ' + c.reset);
        console.log(c.cyan + 
            '  \\____/|_|  |_|_| \\_|___|' + c.reset);
        console.log('');
        console.log(c.dim + 
            '  Hybrid Metamorphosis Compiler' + c.reset);
        console.log('');
    
}
function CLI_version() {
    return "1.2.0";
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.Colors_new = Colors_new;
    exports.CLI_COLORS = CLI_COLORS;
    exports.CLI_success = CLI_success;
    exports.CLI_error = CLI_error;
    exports.CLI_warning = CLI_warning;
    exports.CLI_info = CLI_info;
    exports.CLI_step = CLI_step;
    exports.CLI_header = CLI_header;
    exports.CLI_dim = CLI_dim;
    exports.CLI_bold = CLI_bold;
    exports.CLI_green = CLI_green;
    exports.CLI_red = CLI_red;
    exports.CLI_yellow = CLI_yellow;
    exports.CLI_cyan = CLI_cyan;
    exports.Spinner_new = Spinner_new;
    exports.Spinner_start = Spinner_start;
    exports.Spinner_stop = Spinner_stop;
    exports.CLI_progress_bar = CLI_progress_bar;
    exports.ParsedArgs_new = ParsedArgs_new;
    exports.CLI_table_simple = CLI_table_simple;
    exports.CLI_table_header = CLI_table_header;
    exports.CLI_banner = CLI_banner;
    exports.CLI_version = CLI_version;
    exports.Colors = Colors;
    exports.Spinner = Spinner;
    exports.ParsedArgs = ParsedArgs;
    exports.CLI_COLORS_INIT = CLI_COLORS_INIT;
    exports.CLI_COLORS_CACHE = CLI_COLORS_CACHE;
}


// === Module: commands/cmd_setup ===
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
var cli = exports;
function get_omni_home() {
    const home = "";
    
        // const path = require('path'); (hoisted)
        // const os = require('os'); (hoisted)
        
        // Priority 1: OMNI_HOME environment variable
        if (process.env.OMNI_HOME) {
            home = process.env.OMNI_HOME;
        }
        // Priority 2: Executable directory
        else if (__dirname) {
            home = path.dirname(__dirname);
        }
        // Priority 3: User's home directory
        else {
            const platform = os.platform();
            if (platform === 'win32') {
                home = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                home = path.join(os.homedir(), '.local', 'share', 'omni');
            }
        }
    
    return home;
}
function resolve_resource_path(name) {
    const resolved = "";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Strategy 1: Local project path (./targets/, ./packages/, ./patterns/)
        const localPath = path.join(process.cwd(), name);
        if (fs.existsSync(localPath)) {
            resolved = localPath;
            return;
        }
        
        // Strategy 2: Relative to executable (dist/../)
        const execPath = path.join(__dirname, '..', name);
        if (fs.existsSync(execPath)) {
            resolved = execPath;
            return;
        }
        
        // Strategy 3: OMNI_HOME
        const omniHome = get_omni_home();
        const homePath = path.join(omniHome, name);
        if (fs.existsSync(homePath)) {
            resolved = homePath;
            return;
        }
        
        // Strategy 4: Global installation
        // const os = require('os'); (hoisted)
        const platform = os.platform();
        let globalPath;
        
        if (platform === 'win32') {
            globalPath = path.join(os.homedir(), 'AppData', 'Local', 'Omni', name);
        } else {
            globalPath = path.join(os.homedir(), '.local', 'share', 'omni', name);
        }
        
        if (fs.existsSync(globalPath)) {
            resolved = globalPath;
            return;
        }
        
        // Not found - return local path for error messages
        resolved = localPath;
    
    return resolved;
}
function cmd_setup(is_global) {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Omni Setup";
    
        // const os = require('os'); (hoisted)
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        const platform = os.platform();
        const isWindows = platform === 'win32';
        const omniDir = path.dirname(path.dirname(__filename));
        
        CLI_info("Platform: " + platform + " (" + os.arch() + ")");
        CLI_info("Omni directory: " + omniDir);
        CLI_info("Mode: " + (is_global ? "GLOBAL" : "LOCAL"));
        
        console.log("");
        
        if (is_global) {
            // ============================================================
            // GLOBAL INSTALLATION
            // ============================================================
            CLI_step(1, 4, "Detecting global installation path...");
            
            let globalDir;
            if (isWindows) {
                // Windows: Use %AppData%\Omni
                globalDir = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                // Unix: Use ~/.local/bin or /usr/local/bin
                globalDir = path.join(os.homedir(), '.local', 'share', 'omni');
            }
            
            CLI_info("Global directory: " + globalDir);
            
            CLI_step(2, 4, "Copying Omni files...");
            
            // Ensure directory exists
            if (!fs.existsSync(globalDir)) {
                fs.mkdirSync(globalDir, { recursive: true });
            }
            
            // Copy dist folder
            const srcDist = path.join(omniDir, 'dist');
            const dstDist = path.join(globalDir, 'dist');
            
            if (fs.existsSync(srcDist)) {
                if (!fs.existsSync(dstDist)) {
                    fs.mkdirSync(dstDist, { recursive: true });
                }
                
                const files = fs.readdirSync(srcDist);
                for (const file of files) {
                    fs.copyFileSync(
                        path.join(srcDist, file),
                        path.join(dstDist, file)
                    );
                }
                CLI_success("Copied " + files.length + " files");
            }
            
            // Copy lib folder
            const srcLib = path.join(omniDir, 'src', 'lib');
            const dstLib = path.join(globalDir, 'lib');
            
            if (fs.existsSync(srcLib)) {
                if (!fs.existsSync(dstLib)) {
                    fs.mkdirSync(dstLib, { recursive: true });
                }
                
                const walkAndCopy = (src, dst) => {
                    const entries = fs.readdirSync(src, { withFileTypes: true });
                    for (const entry of entries) {
                        const srcPath = path.join(src, entry.name);
                        const dstPath = path.join(dst, entry.name);
                        if (entry.isDirectory()) {
                            if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);
                            walkAndCopy(srcPath, dstPath);
                        } else {
                            fs.copyFileSync(srcPath, dstPath);
                        }
                    }
                };
                walkAndCopy(srcLib, dstLib);
                CLI_success("Copied standard library");
            }
            
            CLI_step(3, 4, "Creating executable wrapper...");
            
            if (isWindows) {
                // Windows: Create batch and PowerShell wrappers
                const cmdContent = `@echo off
node "%~dp0dist\\main.js" %*`;
                fs.writeFileSync(path.join(globalDir, 'omni.cmd'), cmdContent);
                
                const ps1Content = `#!/usr/bin/env pwsh
node "$PSScriptRoot\\dist\\main.js" @args`;
                fs.writeFileSync(path.join(globalDir, 'omni.ps1'), ps1Content);
                
                CLI_success("Created omni.cmd and omni.ps1");
            } else {
                // Unix: Create shell script
                const shContent = `#!/usr/bin/env bash
OMNI_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
node "$OMNI_DIR/dist/main.js" "$@"`;
                const shPath = path.join(globalDir, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                
                CLI_success("Created omni executable");
            }
            
            CLI_step(4, 4, "Configuring PATH...");
            
            let binDir;
            if (isWindows) {
                binDir = globalDir;
                
                // Try to add to user PATH
                try {
                    const currentPath = execSync('echo %PATH%', { encoding: 'utf-8' }).trim();
                    if (!currentPath.includes(globalDir)) {
                        console.log("");
                        CLI_warning("Add this directory to your PATH:");
                        console.log(CLI_COLORS.cyan + "  " + globalDir + CLI_COLORS.reset);
                        console.log("");
                        console.log(CLI_COLORS.dim + "  PowerShell (admin):" + CLI_COLORS.reset);
                        console.log(CLI_COLORS.dim + "  [Environment]::SetEnvironmentVariable('Path', $env:Path + ';' + '" + globalDir + "', 'User')" + CLI_COLORS.reset);
                    } else {
                        CLI_success("Already in PATH");
                    }
                } catch (e) {}
            } else {
                binDir = path.join(os.homedir(), '.local', 'bin');
                
                // Create symlink in ~/.local/bin
                if (!fs.existsSync(binDir)) {
                    fs.mkdirSync(binDir, { recursive: true });
                }
                
                const linkPath = path.join(binDir, 'omni');
                try {
                    if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
                    fs.symlinkSync(path.join(globalDir, 'omni'), linkPath);
                    CLI_success("Linked: " + linkPath);
                } catch (e) {
                    CLI_warning("Could not create symlink: " + e.message);
                }
                
                // Check if ~/.local/bin is in PATH
                const shellPath = process.env.PATH || '';
                if (!shellPath.includes(binDir)) {
                    console.log("");
                    CLI_warning("Add to your shell profile (~/.bashrc or ~/.zshrc):");
                    console.log(CLI_COLORS.cyan + '  export PATH="$HOME/.local/bin:$PATH"' + CLI_COLORS.reset);
                }
            }
            
            console.log("");
            CLI_success("Global installation complete!");
            console.log("");
            console.log(CLI_COLORS.green + "  Try: omni --version" + CLI_COLORS.reset);
            
        } else {
            // ============================================================
            // LOCAL INSTALLATION (./omni in current project)
            // ============================================================
            CLI_step(1, 2, "Creating local wrapper...");
            
            const cwd = process.cwd();
            
            if (isWindows) {
                const cmdContent = `@echo off
node "${path.join(omniDir, 'dist', 'main.js')}" %*`;
                fs.writeFileSync(path.join(cwd, 'omni.cmd'), cmdContent);
                CLI_success("Created: omni.cmd");
            } else {
                const shContent = `#!/usr/bin/env bash
node "${path.join(omniDir, 'dist', 'main.js')}" "$@"`;
                const shPath = path.join(cwd, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                CLI_success("Created: ./omni");
            }
            
            CLI_step(2, 2, "Done!");
            
            console.log("");
            CLI_success("Local installation complete!");
            console.log("");
            if (isWindows) {
                console.log(CLI_COLORS.green + "  Try: .\\omni.cmd --version" + CLI_COLORS.reset);
            } else {
                console.log(CLI_COLORS.green + "  Try: ./omni --version" + CLI_COLORS.reset);
            }
        }
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.get_omni_home = get_omni_home;
    exports.resolve_resource_path = resolve_resource_path;
    exports.cmd_setup = cmd_setup;
}


// === Module: commands/cmd_run ===
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (CLI_error)
BlockLoop: 42 (()
BlockLoop: 66 (return)
var cli = exports;
var std = exports;
var lexer = exports;
var parser = exports;
var codegen_hybrid = exports;
var vm = exports;
function cmd_run() {
    const run_file = "";
    const is_app = false;
    const target = "js";
     
         run_file = process.argv[3] || ''; 
         if (process.argv.includes("--app")) {
             is_app = true;
             target = "python"; // Default Native App target
         }
         // Check custom target
         let t_idx = process.argv.indexOf("--target");
         if (t_idx > -1 && process.argv[t_idx+1]) {
             target = process.argv[t_idx+1];
         }
    
    if (run_file) {
    "";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    CLI_error;
    "Usage: omni run <file.omni> [--app] [--target python]";
    return true;
}
const source = read_file;
const l = new_lexer;
const p = new_parser;
const program = Parser_parse_program;
if (is_app) {
    target;
}
const gen = new_code_generator;
const code = CodeGenerator_generate;

             // const fs = require('fs'); (hoisted)
             // const path = require('path'); (hoisted)
             const { spawn } = require('child_process');
             
             const ext = target == "python" ? ".py" : ".js";
             const outFile = run_file.replace(".omni", ext); 
             fs.writeFileSync(outFile, code);
             
             let cmd = "node";
             let args = [outFile];
             if (target == "python") {
                 cmd = "python";
                 args = [outFile];
             }
             
             const proc = spawn(cmd, args, { stdio: 'inherit' });
             proc.on('close', (code) => {
                 // process.exit(code); // Optional
             });
         
return true;
// Unknown stmt kind: undefined
const vm = OmniVM_new;
return true;
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}


// === Module: commands/cmd_build ===
BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
var cli = exports;
function cmd_build() {
    CLI_info;
    "Building from omni.config.json...";
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_build = cmd_build;
}


// === Module: commands/cmd_test ===
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
var cli = exports;
var lexer = exports;
var parser = exports;
var codegen_hybrid = exports;
function cmd_test_all() {
    CLI_banner;
    // Unknown stmt kind: 0
    CLI_header;
    "Testing All Examples";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Find examples directory
        const possiblePaths = [
            path.join(process.cwd(), 'examples'),
            path.join(__dirname, '..', '..', 'examples'),
            path.join(__dirname, '..', 'examples')
        ];
        
        let examplesDir = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                examplesDir = p;
                break;
            }
        }
        
        if (!examplesDir) {
            CLI_error("Examples directory not found");
            CLI_info("Run from project root: .\\omni test-all");
            return 1;
        }
        
        CLI_info("Examples directory: " + examplesDir);
        console.log("");
        
        // Get all .omni files
        const files = fs.readdirSync(examplesDir)
            .filter(f => f.endsWith('.omni'))
            .sort();
        
        CLI_info("Found " + files.length + " example files");
        console.log("");
        
        let passed = 0;
        let failed = 0;
        const failures = [];
        
        for (const file of files) {
            const filePath = path.join(examplesDir, file);
            const outputPath = path.join(examplesDir, file.replace('.omni', '.test.js'));
            
            try {
                // Read and parse
                const source = fs.readFileSync(filePath, 'utf-8');
                const l = new_lexer(source);
                const p = new_parser(l);
                const program = Parser_parse_program(p);
                
                // Generate code
                const gen = HybridCodeGenerator_new('js');
                const code = HybridCodeGenerator_generate(gen, program);
                
                // Check if code was generated
                if (code && code.length > 0) {
                    passed++;
                    console.log(CLI_COLORS().green + "  ✓ " + CLI_COLORS().reset + file);
                } else {
                    failed++;
                    failures.push({ file, error: "Empty output" });
                    console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + file + CLI_COLORS().dim + " (empty output)" + CLI_COLORS().reset);
                }
            } catch (e) {
                failed++;
                failures.push({ file, error: e.message });
                console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + file + CLI_COLORS().dim + " (" + e.message.substring(0, 40) + ")" + CLI_COLORS().reset);
            }
        }
        
        console.log("");
        console.log("────────────────────────────────────────");
        console.log("Results: " + CLI_COLORS().green + passed + " passed" + CLI_COLORS().reset + ", " + 
            (failed > 0 ? CLI_COLORS().red + failed + " failed" + CLI_COLORS().reset : "0 failed"));
        console.log("");
        
        if (failed > 0) {
            CLI_warning("Some examples failed to compile");
            for (const f of failures) {
                console.log(CLI_COLORS().dim + "  " + f.file + ": " + f.error + CLI_COLORS().reset);
            }
            return 1;
        } else {
            CLI_success("All examples compiled successfully!");
            return 0;
        }
    
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_test_all = cmd_test_all;
}


// === Module: commands/cmd_package ===
BlockLoop: 10 (CLI_header)
BlockLoop: 42 (()
BlockLoop: 80 (native)
var cli = exports;
function cmd_package_self() {
    CLI_header;
    "Self-Package";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        const omniDir = path.dirname(path.dirname(__filename));
        const version = CLI_version();
        const platform = process.platform;
        
        CLI_step(1, 4, "Collecting source files...");
        
        // Files to include
        const distDir = path.join(omniDir, 'dist');
        const targetsDir = path.join(omniDir, 'targets');
        
        CLI_step(2, 4, "Creating package manifest...");
        
        const manifest = {
            name: 'omni-compiler',
            version: version,
            platform: platform,
            created: new Date().toISOString(),
            files: []
        };
        
        // List dist files
        if (fs.existsSync(distDir)) {
            const files = fs.readdirSync(distDir, { recursive: true });
            manifest.files.push(...files.map(f => 'dist/' + f));
        }
        
        // List target profiles
        if (fs.existsSync(targetsDir)) {
            const files = fs.readdirSync(targetsDir);
            manifest.files.push(...files.map(f => 'targets/' + f));
        }
        
        CLI_step(3, 4, "Writing package...");
        
        const packageName = `omni-${version}-${platform}`;
        const packageDir = path.join(omniDir, 'packages');
        
        if (!fs.existsSync(packageDir)) {
            fs.mkdirSync(packageDir, { recursive: true });
        }
        
        // Write manifest
        fs.writeFileSync(
            path.join(packageDir, packageName + '.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        CLI_step(4, 4, "Creating executable wrapper...");
        
        // Create .run file (Unix) or .cmd (Windows)
        if (platform === 'win32') {
            const runContent = `@echo off
set OMNI_HOME=%~dp0
node "%OMNI_HOME%dist\\main.js" %*`;
            fs.writeFileSync(path.join(packageDir, packageName + '.cmd'), runContent);
            CLI_success("Package created: packages/" + packageName + ".cmd");
        } else {
            const runContent = `#!/bin/bash
OMNI_HOME="$(dirname "$(readlink -f "$0")")"
node "$OMNI_HOME/dist/main.js" "$@"`;
            const runPath = path.join(packageDir, packageName + '.run');
            fs.writeFileSync(runPath, runContent);
            fs.chmodSync(runPath, '755');
            CLI_success("Package created: packages/" + packageName + ".run");
        }
        
        console.log("");
        CLI_info("Package manifest: packages/" + packageName + ".json");
        CLI_info("Total files: " + manifest.files.length);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_package_self = cmd_package_self;
}


// === Module: commands/cmd_registry ===
BlockLoop: 80 (native)
var contracts = exports;
function cmd_contracts() {
    
        const registry = ContractRegistry_new();
        ContractRegistry_list_interfaces(registry);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_contracts = cmd_contracts;
}


// === Module: commands/cmd_studio ===
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 10 (cmd_tui)
BlockLoop: 42 (()
BlockLoop: 10 (cmd_studio)
BlockLoop: 42 (()
BlockLoop: 10 (open_app)
BlockLoop: 43 ())
var studio_engine = exports;
var tui = exports;
function cmd_studio_cli() {
    const port = 3000;
    const open_app = false;
    const run_tui = false;
    
        // Parse port option
        for (let i = 3; i < process.argv.length; i++) {
            if (process.argv[i] === '--port' && process.argv[i + 1]) {
                port = parseInt(process.argv[i + 1]);
            }
            if (process.argv[i] === '--app') {
                open_app = true;
            }
            if (process.argv[i] === '--tui') {
                run_tui = true;
            }
        }
    
    if (run_tui) {
    cmd_tui;
    // Unknown stmt kind: 0
} else {
    cmd_studio;
    port;
    open_app;
    // Unknown stmt kind: 0
}
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_studio_cli = cmd_studio_cli;
}


// === Main Entry ===
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_version)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (cmd_setup)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (cmd_package_self)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 66 (return)
var token = exports;
var lexer = exports;
var parser = exports;
var codegen_hybrid = exports;
var vm = exports;
var framework_adapter = exports;
var ingestion = exports;
var package_manager = exports;
var contracts = exports;
var ghost_writer = exports;
var bootstrap = exports;
var studio_engine = exports;
var studio_graph = exports;
var app_packager = exports;
var tui = exports;
var std = exports;
var cli = exports;
var cmd_setup = exports;
var cmd_run = exports;
var cmd_build = exports;
var cmd_test = exports;
var cmd_package = exports;
var cmd_registry = exports;
var cmd_studio = exports;
function cmd_version() {
    CLI_banner;
    // Unknown stmt kind: 0
    print;
    "Version: ";
    CLI_version;
    // Unknown stmt kind: 0
    print;
    "";
    
        console.log(CLI_COLORS.dim + "Node.js: " + process.version + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Platform: " + process.platform + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Arch: " + process.arch + CLI_COLORS.reset);
    
}
function main() {
    const args_len = 0;
    
        args_len = process.argv.length;
    
    const command = "";
    
        command = process.argv[2] || '';
    
    if (command) {
    "setup";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const is_global = false;
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
        
    cmd_setup;
    is_global;
    return 0;
}
if (command) {
    "--version";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "package";
}
const self_package = false;
 self_package = process.argv[3] === '--self'; 
if (self_package) {
    cmd_package_self;
    // Unknown stmt kind: 0
    return 0;
}
// Unknown stmt kind: undefined
if (command) {
    "install";
}
const package_spec = "";
 package_spec = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "uninstall";
}
const package_name = "";
 package_name = process.argv[3] || ''; 
if (package_name) {
    "";
}
return 1;
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "list";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "update";
}
const package_name = "";
 package_name = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "search";
}
const query = "";
 query = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "doctor";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "contracts";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "graph";
}
const input_file = "";
const output_file = "";
 
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
if (input_file) {
    "";
}
return 1;
// Unknown stmt kind: undefined
if (output_file) {
    "";
}

                // const path = require('path'); (hoisted)
                output_file = path.basename(input_file, '.omni') + '_architecture.md';
            
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "bootstrap";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "studio";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "ui";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "package";
}
const target = "";

            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--app' && process.argv[i + 1]) {
                    target = process.argv[i + 1];
                }
            }
            if (!target) {
                const platform = process.platform;
                if (platform === 'win32') target = 'windows';
                else if (platform === 'darwin') target = 'macos';
                else if (platform === 'linux') target = 'linux';
                else target = 'windows';
            }
        
const config = AppConfig_default;

            // const fs = require('fs'); (hoisted)
            // const path = require('path'); (hoisted)
            const configPath = path.join(process.cwd(), 'omni.config.json');
            
            if (fs.existsSync(configPath)) {
                const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (cfg.app) {
                    config.name = cfg.app.name || config.name;
                    config.version = cfg.app.version || config.version;
                    config.bundle_id = cfg.app.bundle_id || config.bundle_id;
                    config.description = cfg.app.description || config.description;
                }
            }
        
return 0;
// Unknown stmt kind: undefined
if (command) {
    "ingest";
}
const input_file = "";
const output_file = "";
 
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
if (input_file) {
    "";
}
return 1;
// Unknown stmt kind: undefined
if (output_file) {
    "";
}

                // const path = require('path'); (hoisted)
                output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
            
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "run";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "build";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "test-all";
}
return 0;
// Unknown stmt kind: undefined
const show_help = false;
 
        show_help = command === 'help' || command === '--help' || command === '-h'; 
    
if (command) {
    "";
}
return 0;
// Unknown stmt kind: undefined
if (show_help) {
    CLI_banner;
    // Unknown stmt kind: 0
    print;
    "Commands:";
    print;
    "  setup                          Start Global Setup Wizard";
    print;
    "  run <file.omni>                Execute instantly via VM";
    print;
    "  build                          Build from omni.config.json";
    print;
    "  test-all                       Validate all examples compile";
    print;
    "  package --self                 Create self-contained package";
    print;
    "  <input> <output> [options]     Compile to target";
    print;
    "";
    print;
    "Options:";
    print;
    "  --target <lang>     Target language (js, python)";
    print;
    "  --package <path>    Load external language package (.omni-pkg)";
    print;
    "  --framework <name>  Framework adapter (nextjs, laravel, android)";
    print;
    "  --coverage          Show AST coverage report";
    print;
    "  --version, -v       Show version";
    print;
    "";
    return 0;
}
const input_path = "";
const output_path = "";
const target_lang = "js";
const package_path = "";
const framework = "";
const show_coverage = false;

        input_path = process.argv[2];
        output_path = process.argv[3];
        
        for (let i = 4; i < process.argv.length; i++) {
            const arg = process.argv[i];
            if (arg === "--target" && (i + 1 < process.argv.length)) {
                target_lang = process.argv[++i];
            } else if (arg === "--package" && (i + 1 < process.argv.length)) {
                package_path = process.argv[++i];
            } else if (arg === "--framework" && (i + 1 < process.argv.length)) {
                framework = process.argv[++i];
            } else if (arg === "--coverage") {
                show_coverage = true;
            }
        }
    

        if (package_path) {
            // const fs = require('fs'); (hoisted)
            // const path = require('path'); (hoisted)
            
            if (fs.existsSync(package_path)) {
                CLI_info("Loading package: " + package_path);
                
                const grammarPath = fs.statSync(package_path).isDirectory() 
                    ? path.join(package_path, 'grammar.json')
                    : package_path;
                    
                if (fs.existsSync(grammarPath)) {
                    const targetDir = path.join(__dirname, '..', 'targets');
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    const profile = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'));
                    const profileName = profile.name || path.basename(package_path, '.omni-pkg');
                    fs.writeFileSync(
                        path.join(targetDir, profileName + '.json'),
                        JSON.stringify(profile, null, 2)
                    );
                    
                    target_lang = profileName;
                    CLI_success("Loaded profile: " + profileName);
                }
            } else {
                CLI_warning("Package not found: " + package_path);
            }
        }
    
const source = read_file;
const l = new_lexer;
const p = new_parser;
const program = Parser_parse_program;
const gen = new_code_generator;

        if (framework) {
            gen.framework = framework;
        }
    
const code = CodeGenerator_generate;

        if (show_coverage || gen.ast_node_count > 0) {
            const coverage = gen.ast_node_count > 0 
                ? (gen.generated_count / gen.ast_node_count * 100).toFixed(1)
                : 100;
            CLI_info("AST Coverage: " + coverage + "% (" + 
                gen.generated_count + "/" + gen.ast_node_count + " nodes)");
                
            if (coverage < 100) {
                CLI_warning("Some AST nodes were not generated");
            }
        }
    
// Unknown stmt kind: undefined



// Expose all exports globally
if (typeof global !== 'undefined') Object.assign(global, exports);
console.log('Bundle exports:', Object.keys(exports));