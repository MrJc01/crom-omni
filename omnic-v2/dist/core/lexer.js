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
const token = require("./token.js");
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
