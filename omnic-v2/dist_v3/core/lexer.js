const token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
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
    Lexer_read_char(l);
    return l;
}
function Lexer_read_char(l) {
    if (l.read_position >= 999999) {
    l.ch = "\0";
} else {
    l.ch = char_at(l.input, l.read_position);
}
    const is_eof = false;
     is_eof = l.ch === "\0"; 
    if (is_eof) {
    l.ch = "\0";
} else {
    l.position = l.read_position;
    l.read_position = l.read_position + 1;
}
}
function Lexer_skip_whitespace(l) {
    const is_ws = false;
    
        is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
    
    while (is_ws) {
    if (l.ch == "\n") {
    l.line = l.line + 1;
}
    Lexer_read_char(l);
    
             is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
        
}
}
function Lexer_read_identifier(l) {
    const start_pos = l.position;
    while (is_letter(l.ch) || is_digit(l.ch)) {
    Lexer_read_char(l);
}
    const ident = "";
    
        ident = l.input.substring(Number(start_pos), Number(l.position));
    
    return ident;
}
function Lexer_read_number(l) {
    const start_pos = l.position;
    while (is_digit(l.ch)) {
    Lexer_read_char(l);
}
    const num_str = "";
    
        num_str = l.input.substring(Number(start_pos), Number(l.position));
    
    return num_str;
}
function Lexer_lookup_ident(ident) {
    if (ident == "fn") {
    return TOKEN_FN;
}
    if (ident == "let") {
    return TOKEN_LET;
}
    if (ident == "struct") {
    return TOKEN_STRUCT;
}
    if (ident == "if") {
    return TOKEN_IF;
}
    if (ident == "else") {
    return TOKEN_ELSE;
}
    if (ident == "return") {
    return TOKEN_RETURN;
}
    if (ident == "true") {
    return TOKEN_TRUE;
}
    if (ident == "false") {
    return TOKEN_FALSE;
}
    if (ident == "native") {
    return TOKEN_NATIVE;
}
    if (ident == "import") {
    return 90;
}
    if (ident == "package") {
    return 91;
}
    if (ident == "while") {
    return TOKEN_WHILE;
}
    return TOKEN_IDENTIFIER;
}
function Lexer_next_token(l) {
    Lexer_skip_whitespace(l);
    if (l.ch == "/") {
    const peek = char_at(l.input, l.read_position);
    if (peek == "/") {
    while (l.ch != "\n" && l.ch != "\0") {
    Lexer_read_char(l);
}
    Lexer_skip_whitespace(l);
}
}
    const tok = new_token(TOKEN_ILLEGAL, l.ch, l.line);
    tok.start = l.position;
    if (l.ch == "\0") {
    tok.kind = TOKEN_EOF;
    tok.lexeme = "";
    return tok;
}
    if (l.ch == "=") {
    const peek_eq = char_at(l.input, l.read_position);
    if (peek_eq == "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_EQ;
    tok.lexeme = "==";
} else {
    tok.kind = TOKEN_ASSIGN;
    tok.lexeme = "=";
}
} else {
    if (l.ch == "!") {
    const peek_bang = char_at(l.input, l.read_position);
    if (peek_bang == "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_NOT_EQ;
    tok.lexeme = "!=";
} else {
    tok.kind = TOKEN_BANG;
    tok.lexeme = "!";
}
} else {
    if (l.ch == ";") {
    tok.kind = TOKEN_SEMICOLON;
    tok.lexeme = ";";
} else {
    if (l.ch == "(") {
    tok.kind = TOKEN_LPAREN;
    tok.lexeme = "(";
} else {
    if (l.ch == ")") {
    tok.kind = TOKEN_RPAREN;
    tok.lexeme = ")";
} else {
    if (l.ch == "{") {
    tok.kind = TOKEN_LBRACE;
    tok.lexeme = "{";
} else {
    if (l.ch == "}") {
    tok.kind = TOKEN_RBRACE;
    tok.lexeme = "}";
} else {
    if (l.ch == ",") {
    tok.kind = TOKEN_COMMA;
    tok.lexeme = ",";
} else {
    if (l.ch == ":") {
    tok.kind = 30;
    tok.lexeme = ":";
} else {
    if (l.ch == ".") {
    tok.kind = 31;
    tok.lexeme = ".";
} else {
    if (l.ch == "[") {
    tok.kind = TOKEN_LBRACKET;
    tok.lexeme = "[";
} else {
    if (l.ch == "]") {
    tok.kind = TOKEN_RBRACKET;
    tok.lexeme = "]";
} else {
    if (l.ch == "+") {
    tok.kind = TOKEN_PLUS;
    tok.lexeme = "+";
} else {
    if (l.ch == "/") {
    const peek_slash = char_at(l.input, l.read_position);
    if (peek_slash == "/") {
    Lexer_read_char(l);
    Lexer_read_char(l);
    while (l.ch != "\n" && l.ch != "\0") {
    Lexer_read_char(l);
}
    return Lexer_next_token(l);
} else {
    tok.kind = TOKEN_SLASH;
    tok.lexeme = "/";
}
} else {
    if (is_quote(l.ch)) {
    const str_val = "";
    Lexer_read_char(l);
    const start = l.position;
    while (is_quote(l.ch) == false) {
    Lexer_read_char(l);
}
    const end = l.position;
    
            str_val = l.input.substring(Number(start), Number(end));
        
    tok.kind = TOKEN_STRING;
    tok.lexeme = str_val;
} else {
    if (l.ch == "&") {
    const peek_and = char_at(l.input, l.read_position);
    if (peek_and == "&") {
    Lexer_read_char(l);
    tok.kind = TOKEN_AND;
    tok.lexeme = "&&";
} else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "&";
}
} else {
    if (l.ch == "|") {
    const peek_or = char_at(l.input, l.read_position);
    if (peek_or == "|") {
    Lexer_read_char(l);
    tok.kind = TOKEN_OR;
    tok.lexeme = "||";
} else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "|";
}
} else {
    if (l.ch == "<") {
    const peek_lt = char_at(l.input, l.read_position);
    if (peek_lt == "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_LE;
    tok.lexeme = "<=";
} else {
    tok.kind = TOKEN_LT;
    tok.lexeme = "<";
}
} else {
    if (l.ch == ">") {
    const peek_gt = char_at(l.input, l.read_position);
    if (peek_gt == "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_GE;
    tok.lexeme = ">=";
} else {
    tok.kind = TOKEN_GT;
    tok.lexeme = ">";
}
} else {
    if (is_letter(l.ch)) {
    const literal = Lexer_read_identifier(l);
    tok.kind = Lexer_lookup_ident(literal);
    tok.lexeme = literal;
    return tok;
} else {
    if (is_digit(l.ch)) {
    tok.kind = TOKEN_INT;
    tok.lexeme = Lexer_read_number(l);
    return tok;
} else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = l.ch;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
    Lexer_read_char(l);
    return tok;
}

module.exports = { Lexer };
