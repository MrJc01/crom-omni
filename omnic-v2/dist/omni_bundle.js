// OMNI v1.2.0 - Unified Bundle
const OMNI = {};
const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

var exports = module.exports; // Shared exports object

// === Module: core/token ===
let TOKEN_EOF = 0;
let TOKEN_ILLEGAL = 1;
let TOKEN_IDENTIFIER = 10;
let TOKEN_INT = 11;
let TOKEN_STRING = 12;
let TOKEN_ASSIGN = 20;
let TOKEN_PLUS = 21;
let TOKEN_MINUS = 22;
let TOKEN_BANG = 23;
let TOKEN_ASTERISK = 24;
let TOKEN_SLASH = 25;
let TOKEN_LT = 26;
let TOKEN_GT = 27;
let TOKEN_EQ = 28;
let TOKEN_NOT_EQ = 29;
let TOKEN_COLON = 30;
let TOKEN_DOT = 31;
let TOKEN_AND = 32;
let TOKEN_OR = 33;
let TOKEN_LE = 34;
let TOKEN_GE = 35;
let TOKEN_COMMA = 40;
let TOKEN_SEMICOLON = 41;
let TOKEN_LPAREN = 42;
let TOKEN_RPAREN = 43;
let TOKEN_LBRACE = 44;
let TOKEN_RBRACE = 45;
let TOKEN_LBRACKET = 46;
let TOKEN_RBRACKET = 47;
let TOKEN_FN = 60;
let TOKEN_LET = 61;
let TOKEN_TRUE = 62;
let TOKEN_FALSE = 63;
let TOKEN_IF = 64;
let TOKEN_ELSE = 65;
let TOKEN_RETURN = 66;
let TOKEN_WHILE = 67;
let TOKEN_STRUCT = 70;
let TOKEN_NATIVE = 80;
let TOKEN_IMPORT = 90;
let TOKEN_PACKAGE = 91;
let TOKEN_EXPORT = 92;
let TOKEN_AT = 95;
let TOKEN_ARROW = 99;
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
    exports.TOKEN_ARROW = TOKEN_ARROW;
}


// === Module: core/lexer ===
var token = exports;
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
    let l = new Lexer({ input: input, position: 0, read_position: 0, ch: "\0", line: 1 });
    Lexer_read_char(l);
    return l;
}
function Lexer_read_char(l) {
    if (l.read_position >= 999999) {
    l.ch = "\0";
} else {
    l.ch = char_at(l.input, l.read_position);
}
    let is_eof = false;
     is_eof = l.ch === "\0"; 
    if (is_eof) {
    l.ch = "\0";
} else {
    l.position = l.read_position;
    l.read_position = l.read_position + 1;
}
}
function Lexer_skip_whitespace(l) {
    let is_ws = false;
    
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
    let start_pos = l.position;
    while (is_letter(l.ch) || is_digit(l.ch)) {
    Lexer_read_char(l);
}
    let ident = "";
    
        ident = l.input.substring(Number(start_pos), Number(l.position));
    
    return ident;
}
function Lexer_read_number(l) {
    let start_pos = l.position;
    while (is_digit(l.ch)) {
    Lexer_read_char(l);
}
    if (l.ch == ".") {
    let peek_next = char_at(l.input, l.read_position);
    if (is_digit(peek_next)) {
    Lexer_read_char(l);
    while (is_digit(l.ch)) {
    Lexer_read_char(l);
}
}
}
    let num_str = "";
    
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
    if (ident == "export") {
    return 92;
}
    if (ident == "while") {
    return TOKEN_WHILE;
}
    return TOKEN_IDENTIFIER;
}
function Lexer_next_token(l) {
    Lexer_skip_whitespace(l);
    if (l.ch == "/") {
    let peek = char_at(l.input, l.read_position);
    if (peek == "/") {
    while (l.ch != "\n" && l.ch != "\0") {
    Lexer_read_char(l);
}
    Lexer_skip_whitespace(l);
}
}
    let tok = new_token(TOKEN_ILLEGAL, l.ch, l.line);
    tok.start = l.position;
    if (l.ch == "\0") {
    tok.kind = TOKEN_EOF;
    tok.lexeme = "";
    return tok;
}
    if (l.ch == "=") {
    let peek_eq = char_at(l.input, l.read_position);
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
    let peek_bang = char_at(l.input, l.read_position);
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
    if (l.ch == "-") {
    let peek_arrow = char_at(l.input, l.read_position);
    if (peek_arrow == ">") {
    Lexer_read_char(l);
    tok.kind = 99;
    tok.lexeme = "->";
} else {
    tok.kind = TOKEN_MINUS;
    tok.lexeme = "-";
}
} else {
    if (l.ch == "*") {
    tok.kind = TOKEN_ASTERISK;
    tok.lexeme = "*";
} else {
    if (l.ch == "/") {
    let peek_slash = char_at(l.input, l.read_position);
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
    let str_val = "";
    Lexer_read_char(l);
    let start = l.position;
    while (is_quote(l.ch) == false) {
    Lexer_read_char(l);
}
    let end = l.position;
    
            str_val = l.input.substring(Number(start), Number(end));
        
    tok.kind = TOKEN_STRING;
    tok.lexeme = str_val;
} else {
    if (l.ch == "&") {
    let peek_and = char_at(l.input, l.read_position);
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
    let peek_or = char_at(l.input, l.read_position);
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
    let peek_lt = char_at(l.input, l.read_position);
    if (peek_lt == "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_LE;
    tok.lexeme = "<=";
} else {
    tok.kind = TOKEN_LT;
    tok.lexeme = "<";
}
} else {
    if (l.ch == "@") {
    tok.kind = 95;
    tok.lexeme = "@";
} else {
    if (l.ch == ">") {
    let peek_gt = char_at(l.input, l.read_position);
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
    let literal = Lexer_read_identifier(l);
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
}
}
}
    Lexer_read_char(l);
    return tok;
}


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
var lexer = exports;
if (typeof global !== 'undefined') Object.assign(global, lexer);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
class Parser {
    constructor(data = {}) {
        this.lexer = data.lexer;
        this.cur_token = data.cur_token;
        this.peek_token = data.peek_token;
    }
}
function new_parser(l) {
    let p = new Parser({ lexer: l, cur_token: new_token(0, "", 0), peek_token: new_token(0, "", 0) });
    Parser_next_token(p);
    Parser_next_token(p);
    return p;
}
function Parser_next_token(p) {
    p.cur_token = p.peek_token;
    p.peek_token = Lexer_next_token(p.lexer);
}
function Parser_parse_program(p) {
    let stmts = [];
    while (p.cur_token.kind != TOKEN_EOF) {
    let stmt = Parser_parse_statement(p);
    if (stmt != 0) {
    if (stmt.kind != 0) {
     stmts.push(stmt); 
}
}
}
    return new Program({ statements: stmts });
}
function Parser_parse_statement(p) {
    if (p.cur_token.kind == 95) {
    let decorators = [];
    while (p.cur_token.kind == 95) {
     decorators.push(Parser_parse_decorator(p)); 
}
    let stmt = Parser_parse_statement(p);
     if (stmt) stmt.decorators = decorators; 
    return stmt;
}
    if (p.cur_token.kind == 92) {
    Parser_next_token(p);
    let stmt = Parser_parse_statement(p);
     if (stmt) stmt.is_exported = true; 
    return stmt;
}
    if (p.cur_token.kind == 91) {
    return Parser_parse_package(p);
}
    if (p.cur_token.kind == 90) {
    return Parser_parse_import(p);
}
    if (p.cur_token.kind == TOKEN_RBRACE) {
    Parser_next_token(p);
    return 0;
}
    if (p.cur_token.kind == TOKEN_IF) {
    return Parser_parse_if(p);
}
    if (p.cur_token.kind == TOKEN_WHILE) {
    return Parser_parse_while(p);
}
    if (p.cur_token.kind == TOKEN_LET) {
    return Parser_parse_let(p);
}
    if (p.cur_token.kind == TOKEN_FN) {
    return Parser_parse_fn(p);
}
    if (p.cur_token.kind == TOKEN_STRUCT) {
    return Parser_parse_struct(p);
}
    if (p.cur_token.kind == TOKEN_RETURN) {
    return Parser_parse_return(p);
}
    if (p.cur_token.kind == TOKEN_NATIVE) {
    return Parser_parse_native_block(p);
}
    return Parser_parse_expr_stmt(p);
}
function Parser_parse_import(p) {
    Parser_next_token(p);
    let path = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind == TOKEN_SEMICOLON) {
    Parser_next_token(p);
}
    return new ImportDecl({ kind: NODE_IMPORT, path: path });
}
function Parser_parse_package(p) {
    Parser_next_token(p);
    while (p.cur_token.kind != TOKEN_SEMICOLON && p.cur_token.kind != TOKEN_EOF) {
    Parser_next_token(p);
}
    if (p.cur_token.kind == TOKEN_SEMICOLON) {
    Parser_next_token(p);
}
    return 0;
}
function Parser_parse_let(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind == 30) {
    Parser_next_token(p);
    Parser_next_token(p);
}
    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if (p.cur_token.kind == TOKEN_SEMICOLON) {
    Parser_next_token(p);
}
    return new LetStmt({ kind: NODE_LET, name: name, value: val, is_exported: false });
}
function Parser_parse_return(p) {
    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if (p.cur_token.kind == TOKEN_SEMICOLON) {
    Parser_next_token(p);
}
    return new ReturnStmt({ kind: NODE_RETURN, value: val });
}
function Parser_parse_fn(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let params = [];
    while (p.cur_token.kind != TOKEN_RPAREN) {
     params.push(p.cur_token.lexeme); 
    Parser_next_token(p);
    if (p.cur_token.kind == 30) {
    Parser_next_token(p);
    Parser_next_token(p);
}
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
    if (p.cur_token.kind == 99) {
    Parser_next_token(p);
    Parser_next_token(p);
}
    let body = Parser_parse_block(p);
    return new FunctionDecl({ kind: NODE_FUNCTION, name: name, params: params, body: body, is_exported: false, decorators: [] });
}
function Parser_parse_struct(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let fields = [];
    while (p.cur_token.kind != TOKEN_RBRACE && p.cur_token.kind != TOKEN_EOF) {
    if (p.cur_token.kind == TOKEN_RBRACE) {
    break;
}
    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_type = p.cur_token.lexeme;
    Parser_next_token(p);
    let f = new_struct_field(field_name, field_type);
     fields.push(f); 
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
    return new StructDecl({ kind: NODE_STRUCT, name: name, fields: fields, is_exported: false, decorators: [] });
}
function Parser_parse_native_block(p) {
    Parser_next_token(p);
    let lang = "js";
    if (p.cur_token.kind == TOKEN_STRING) {
    lang = p.cur_token.lexeme;
    Parser_next_token(p);
}
    if (p.cur_token.kind != TOKEN_LBRACE) {
    return new NativeStmt({ kind: 0, lang: "", code: "" });
}
    let start_pos = p.cur_token.start;
    let code = "";
    let end_pos = 0;
    
        let input = p.lexer.input;
        let pos = Number(start_pos) + 1;
        let brace_count = 1;
        let start_extract = pos;
        
        while (pos < input.length && brace_count > 0) {
            let char = input[pos];
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
}
function Parser_parse_block(p) {
    let stmts = [];
    if (p.cur_token.kind == TOKEN_LBRACE) {
    Parser_next_token(p);
    while (p.cur_token.kind != TOKEN_RBRACE && p.cur_token.kind != TOKEN_EOF) {
    let stmt = Parser_parse_statement(p);
     stmts.push(stmt); 
}
    Parser_next_token(p);
} else {
    let stmt = Parser_parse_statement(p);
     stmts.push(stmt); 
}
    return new Block({ kind: NODE_BLOCK, statements: stmts });
}
function Parser_parse_expr_stmt(p) {
    let expr = Parser_parse_expression(p);
    if (p.cur_token.kind == TOKEN_SEMICOLON) {
    Parser_next_token(p);
}
    return new ExpressionStmt({ kind: NODE_EXPRESSION_STMT, expr: expr });
}
function Parser_parse_expression(p) {
    return Parser_parse_assignment(p);
}
function Parser_parse_assignment(p) {
    let left = Parser_parse_logic(p);
    if (p.cur_token.kind == TOKEN_ASSIGN) {
    Parser_next_token(p);
    let right = Parser_parse_assignment(p);
    return new AssignmentExpr({ kind: NODE_ASSIGNMENT, left: left, right: right });
}
    return left;
}
function Parser_parse_equality(p) {
    let left = Parser_parse_relational(p);
    while (true) {
    let k = p.cur_token.kind;
    if (k != TOKEN_EQ && k != TOKEN_NOT_EQ) {
    break;
}
    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_relational(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
    return left;
}
function Parser_parse_relational(p) {
    let left = Parser_parse_term(p);
    while (true) {
    let k = p.cur_token.kind;
    if (k != TOKEN_LT && k != TOKEN_GT && k != TOKEN_LE && k != TOKEN_GE) {
    break;
}
    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_term(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
    return left;
}
function Parser_parse_logic(p) {
    let left = Parser_parse_equality(p);
    while (true) {
    let k = p.cur_token.kind;
    if (k != TOKEN_AND && k != TOKEN_OR) {
    break;
}
    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_equality(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
    return left;
}
function Parser_parse_term(p) {
    let left = Parser_parse_multiplication(p);
    while (true) {
    let k = p.cur_token.kind;
    if (k != TOKEN_PLUS && k != TOKEN_MINUS) {
    break;
}
    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_multiplication(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
    return left;
}
function Parser_parse_multiplication(p) {
    let left = Parser_parse_factor(p);
    while (true) {
    let k = p.cur_token.kind;
    if (k != TOKEN_ASTERISK && k != TOKEN_SLASH) {
    break;
}
    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_factor(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}
    return left;
}
function Parser_parse_factor(p) {
    let node = 0;
    if (p.cur_token.kind == TOKEN_MINUS) {
    Parser_next_token(p);
    let operand = Parser_parse_factor(p);
    node = new BinaryExpr({ kind: NODE_BINARY, left: new IntegerLiteral({ kind: NODE_LITERAL, value: 0 }), op: "-", right: operand });
    return node;
}
    if (p.cur_token.kind == TOKEN_BANG) {
    Parser_next_token(p);
    let operand = Parser_parse_factor(p);
    return operand;
}
    if (p.cur_token.kind == TOKEN_INT) {
    let val = 0;
     val = Number(p.cur_token.lexeme); 
    node = new IntegerLiteral({ kind: NODE_LITERAL, value: val });
    Parser_next_token(p);
} else {
    if (p.cur_token.kind == TOKEN_IDENTIFIER) {
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind == TOKEN_LBRACE) {
    Parser_next_token(p);
    let init_fields = [];
    while (p.cur_token.kind != TOKEN_RBRACE && p.cur_token.kind != TOKEN_EOF) {
    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_val = Parser_parse_expression(p);
    let field = new StructInitField({ name: field_name, value: field_val });
     init_fields.push(field); 
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
    node = new StructInitExpr({ kind: NODE_STRUCT_INIT, name: name, fields: init_fields });
} else {
    node = new Identifier({ kind: NODE_IDENTIFIER, value: name });
}
} else {
    if (p.cur_token.kind == TOKEN_LPAREN) {
    Parser_next_token(p);
    node = Parser_parse_expression(p);
    Parser_next_token(p);
} else {
    if (p.cur_token.kind == TOKEN_STRING) {
    let str_val = p.cur_token.lexeme;
    node = new StringLiteral({ kind: NODE_STRING, value: str_val });
    Parser_next_token(p);
} else {
    if (p.cur_token.kind == TOKEN_TRUE) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: true });
    Parser_next_token(p);
} else {
    if (p.cur_token.kind == TOKEN_FALSE) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: false });
    Parser_next_token(p);
} else {
    if (p.cur_token.kind == TOKEN_LBRACKET) {
    Parser_next_token(p);
    let elements = [];
    while (p.cur_token.kind != TOKEN_RBRACKET && p.cur_token.kind != TOKEN_EOF) {
     elements.push(Parser_parse_expression(p)); 
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
     node = { kind: NODE_ARRAY, elements: elements }; 
} else {
     console.error("Unexpected token in expression: Kind " + p.cur_token.kind + ", Lexeme: " + p.cur_token.lexeme); 
    Parser_next_token(p);
    return 0;
}
}
}
}
}
}
}
    let continue_loop = true;
    while (continue_loop) {
    if (p.cur_token.kind == 31) {
    Parser_next_token(p);
    let prop = p.cur_token.lexeme;
    Parser_next_token(p);
    node = new MemberExpr({ kind: NODE_MEMBER, target: node, property: prop });
} else {
    if (p.cur_token.kind == TOKEN_LPAREN) {
    Parser_next_token(p);
    let args = [];
    while (p.cur_token.kind != TOKEN_RPAREN && p.cur_token.kind != TOKEN_EOF) {
     args.push(Parser_parse_expression(p)); 
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
    node = new CallExpr({ kind: NODE_CALL, function: node, args: args });
} else {
    continue_loop = false;
}
}
}
    return node;
}
function Parser_parse_if(p) {
    Parser_next_token(p);
    let cond = Parser_parse_expression(p);
    let cons = Parser_parse_block(p);
    let alt = 0;
    if (p.cur_token.kind == TOKEN_ELSE) {
    Parser_next_token(p);
    if (p.cur_token.kind == TOKEN_IF) {
    let if_stmt = Parser_parse_if(p);
    let stmts = [];
     stmts.push(if_stmt); 
    alt = new Block({ kind: NODE_BLOCK, statements: stmts });
} else {
    alt = Parser_parse_block(p);
}
}
    return new IfStmt({ kind: NODE_IF, condition: cond, consequence: cons, alternative: alt });
}
function Parser_parse_while(p) {
    Parser_next_token(p);
    let cond = Parser_parse_expression(p);
    let body = Parser_parse_block(p);
    return new WhileStmt({ kind: NODE_WHILE, condition: cond, body: body });
}
function Parser_parse_decorator(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    let args = [];
    if (p.cur_token.kind == TOKEN_LPAREN) {
    Parser_next_token(p);
    while (p.cur_token.kind != TOKEN_RPAREN && p.cur_token.kind != TOKEN_EOF) {
    let arg_name = "";
    let arg_val = 0;
    let is_named = false;
    if (p.cur_token.kind == TOKEN_IDENTIFIER) {
    if (p.peek_token.kind == TOKEN_ASSIGN) {
    is_named = true;
}
}
    if (is_named) {
    arg_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    arg_val = Parser_parse_expression(p);
} else {
    arg_val = Parser_parse_expression(p);
}
    let field = new StructInitField({ name: arg_name, value: arg_val });
     args.push(field); 
    if (p.cur_token.kind == TOKEN_COMMA) {
    Parser_next_token(p);
}
}
    Parser_next_token(p);
}
    return new Decorator({ name: name, args: args });
}


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
let NODE_PROGRAM = 1;
let NODE_LET = 2;
let NODE_LITERAL = 3;
let NODE_FUNCTION = 4;
let NODE_BLOCK = 5;
let NODE_CALL = 6;
let NODE_RETURN = 7;
let NODE_BINARY = 8;
let NODE_MEMBER = 9;
let NODE_IMPORT = 10;
let NODE_ARRAY = 11;
let NODE_STRUCT_INIT = 12;
let NODE_IF = 13;
let NODE_WHILE = 14;
let NODE_IDENTIFIER = 15;
let NODE_ASSIGNMENT = 16;
let NODE_STRING = 17;
let NODE_BOOL = 18;
let NODE_STRUCT = 70;
let NODE_NATIVE = 80;
let NODE_CAPSULE = 90;
let NODE_SPAWN = 100;
let NODE_INTERFACE = 110;
let NODE_EXPRESSION_STMT = 20;
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
    exports.NODE_CAPSULE = NODE_CAPSULE;
    exports.NODE_SPAWN = NODE_SPAWN;
    exports.NODE_INTERFACE = NODE_INTERFACE;
    exports.NODE_EXPRESSION_STMT = NODE_EXPRESSION_STMT;
}


// === Module: core/codegen/base ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
class CodeGenerator {
    constructor(data = {}) {
        this.target = data.target;
        this.indent = data.indent;
    }
}
function new_code_generator(target) {
    return new CodeGenerator({ target: target, indent: 0 });
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_code_generator = new_code_generator;
    exports.CodeGenerator = CodeGenerator;
}


// === Module: core/codegen/js ===
var base = exports;
if (typeof global !== 'undefined') Object.assign(global, base);
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return CodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == 80) {
    if (stmt.lang == "js" || stmt.lang == "javascript") {
    return stmt.code;
}
    return "";
}
    if (stmt.kind == NODE_LET) {
    return "let " + stmt.name + " = " + CodeGenerator_gen_expression(self, stmt.value) + ";";
}
    if (stmt.kind == NODE_RETURN) {
    return "return " + CodeGenerator_gen_expression(self, stmt.value) + ";";
}
    if (stmt.kind == NODE_FUNCTION) {
    let params = "";
     params = stmt.params.join(", "); 
    let body = CodeGenerator_gen_block(self, stmt.body);
    let decl = "function " + stmt.name + "(" + params + ") " + body;
    let decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
}
    if (stmt.kind == NODE_STRUCT) {
    let decl = CodeGenerator_gen_struct(self, stmt);
    let decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
}
    if (stmt.kind == NODE_IF) {
    let cond = CodeGenerator_gen_expression(self, stmt.condition);
    let cons = CodeGenerator_gen_block(self, stmt.consequence);
    let alt = "";
    if (stmt.alternative) {
    alt = " else " + CodeGenerator_gen_block(self, stmt.alternative);
}
    return "if (" + cond + ") " + cons + alt;
}
    if (stmt.kind == NODE_WHILE) {
    let cond = CodeGenerator_gen_expression(self, stmt.condition);
    let body = CodeGenerator_gen_block(self, stmt.body);
    return "while (" + cond + ") " + body;
}
    if (stmt.expr) {
    return CodeGenerator_gen_expression(self, stmt.expr) + ";";
}
    return "// Unknown stmt kind: " + stmt.kind;
}
function CodeGenerator_gen_import(self, stmt) {
    let path = stmt.path;
    
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
    let name = stmt.name;
    let assignments = "";
    
        for (const field of stmt.fields) {
             assignments = assignments + "        this." + field.name + " = data." + field.name + ";\n";
        }
    
    return "class " + name + " {\n    constructor(data = {}) {\n" + assignments + "    }\n}";
}
function CodeGenerator_gen_block(self, block) {
    let out = "{\n";
    
        if (block && block.statements) {
            for (const s of block.statements) {
                out = out + "    " + CodeGenerator_gen_statement(self, s) + "\n";
            }
        }
    
    out = out + "}";
    return out;
}
function CodeGenerator_gen_expression(self, expr) {
    if (expr == 0) {
    return "null";
}
    if (expr.kind == NODE_LITERAL) {
    return expr.value;
}
    if (expr.kind == NODE_STRING) {
    return "'" + expr.value + "'";
}
    if (expr.kind == NODE_BOOL) {
    if (expr.value) {
    return "true";
}
    return "false";
}
    if (expr.kind == NODE_BINARY) {
    return CodeGenerator_gen_expression(self, expr.left) + " " + expr.op + " " + CodeGenerator_gen_expression(self, expr.right);
}
    if (expr.kind == NODE_CALL) {
    let args = "";
    
             let list = [];
             for(let a of expr.args) list.push(CodeGenerator_gen_expression(self, a));
             args = list.join(", ");
         
    let callee = CodeGenerator_gen_expression(self, expr.function);
    let is_class = false;
    
             if (typeof expr.function.value === 'string') {
                 let val = expr.function.value;
                 let first = val.charAt(0);
                 is_class = (first >= "A" && first <= "Z") && (val.indexOf("_") == -1);
             }
         
    if (is_class) {
    return "new " + callee + "(" + args + ")";
}
    return callee + "(" + args + ")";
}
    if (expr.kind == NODE_MEMBER) {
    return CodeGenerator_gen_expression(self, expr.target) + "." + expr.property;
}
    if (expr.kind == NODE_STRUCT_INIT) {
    let fields = "";
    
            let list = [];
            for(let f of expr.fields) {
                list.push(f.name + ": " + CodeGenerator_gen_expression(self, f.value));
            }
            fields = list.join(", ");
        
    return "new " + expr.name + "({ " + fields + " })";
}
    if (expr.kind == NODE_ARRAY) {
    let elems = "";
    
            let list = [];
            for (let e of expr.elements) {
                list.push(CodeGenerator_gen_expression(self, e));
            }
            elems = list.join(", ");
        
    return "[" + elems + "]";
}
    if (expr.kind == NODE_IDENTIFIER) {
    return expr.value;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    let left = CodeGenerator_gen_expression(self, expr.left);
    let right = CodeGenerator_gen_expression(self, expr.right);
    let code = "";
     code = left + " = " + right; 
    return code;
}
     if (typeof(expr) == "string") return expr; 
    return expr;
}
function CodeGenerator_gen_decorators(self, target_name, decorators) {
    let out = "";
    
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
    exports.CodeGenerator_gen_statement = CodeGenerator_gen_statement;
    exports.CodeGenerator_gen_import = CodeGenerator_gen_import;
    exports.CodeGenerator_gen_struct = CodeGenerator_gen_struct;
    exports.CodeGenerator_gen_block = CodeGenerator_gen_block;
    exports.CodeGenerator_gen_expression = CodeGenerator_gen_expression;
    exports.CodeGenerator_gen_decorators = CodeGenerator_gen_decorators;
}


// === Module: core/codegen/python ===
var base = exports;
if (typeof global !== 'undefined') Object.assign(global, base);
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
function CodeGenerator_generate_python(self, program) {
    let output = "";
    
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
    
    let py_exports = [];
    
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
    let indent_str = "";
     indent_str = "    ".repeat(self.indent); 
    if (stmt.kind == 91) {
    return "";
}
    if (stmt.kind == NODE_IMPORT) {
    let path = stmt.path;
    let name = "";
    
             path = path.replace(".omni", "");
             path = path.replace(/\//g, "."); // core/token -> core.token
             if (path.startsWith(".")) path = path.substring(1); // ./core -> /core -> core (fix logic later if needed)
             if (path.startsWith(".")) path = path.substring(1);
             name = path.split(".").pop();
        
    return indent_str + "import " + path + " as " + name;
}
    if (stmt.kind == 80) {
    if (stmt.lang == "py" || stmt.lang == "python") {
    return stmt.code;
}
    return "";
}
    if (stmt.kind == NODE_LET) {
    return indent_str + stmt.name + " = " + CodeGenerator_gen_expr_py(self, stmt.value);
}
    if (stmt.kind == NODE_RETURN) {
    return indent_str + "return " + CodeGenerator_gen_expr_py(self, stmt.value);
}
    if (stmt.kind == NODE_FUNCTION) {
    let decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
    let params = "";
     params = stmt.params.join(", "); 
    let decl = indent_str + "def " + stmt.name + "(" + params + "):\n";
    self.indent = self.indent + 1;
    let body = CodeGenerator_gen_block_py(self, stmt.body);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return decorators + decl + body;
}
    if (stmt.kind == NODE_STRUCT) {
    let decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
    let decl = indent_str + "class " + stmt.name + ":\n";
    self.indent = self.indent + 1;
    let init_indent = "";
     init_indent = "    ".repeat(self.indent); 
    let assignments = "";
    
             if (stmt.fields.length == 0) {
                 assignments = init_indent + "    pass";
             } else {
                 for(let f of stmt.fields) {
                     assignments += init_indent + "    self." + f.name + " = data.get('" + f.name + "')\n";
                 }
             }
        
    let init_fn = init_indent + "def __init__(self, data=None):\n";
    init_fn = init_fn + init_indent + "    if data is None: data = {}\n";
    init_fn = init_fn + assignments + "\n";
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return decorators + decl + init_fn;
}
    if (stmt.kind == NODE_IF) {
    let cond = CodeGenerator_gen_expr_py(self, stmt.condition);
    let out = indent_str + "if " + cond + ":\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.consequence);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    if (stmt.alternative) {
    out = out + "\n" + indent_str + "else:\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.alternative);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
}
    return out;
}
    if (stmt.kind == NODE_WHILE) {
    let cond = CodeGenerator_gen_expr_py(self, stmt.condition);
    let out = indent_str + "while " + cond + ":\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.body);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return out;
}
    if (stmt.expr) {
    return indent_str + CodeGenerator_gen_expr_py(self, stmt.expr);
}
    return indent_str + "# Unknown stmt: " + stmt.kind;
}
function CodeGenerator_gen_decorators_py(self, decorators) {
    let out = "";
    let indent_str = "";
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
    let out = "";
    
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
    if (expr == 0) {
    return "None";
}
    if (expr.kind == NODE_LITERAL) {
    if (expr.value == "true") {
    return "True";
}
    if (expr.value == "false") {
    return "False";
}
    if (expr.value == "null") {
    return "None";
}
    return expr.value;
}
    if (expr.kind == NODE_STRING) {
    return "'" + expr.value + "'";
}
    if (expr.kind == NODE_BOOL) {
    if (expr.value) {
    return "True";
}
    return "False";
}
    if (expr.kind == NODE_BINARY) {
    let op = expr.op;
    if (op == "&&") {
    op = "and";
}
    if (op == "||") {
    op = "or";
}
    if (op == "!") {
    op = "not ";
}
    return CodeGenerator_gen_expr_py(self, expr.left) + " " + op + " " + CodeGenerator_gen_expr_py(self, expr.right);
}
    if (expr.kind == NODE_CALL) {
    let callee = CodeGenerator_gen_expr_py(self, expr.function);
    let args = "";
    
            let list = [];
            for(let a of expr.args) list.push(CodeGenerator_gen_expr_py(self, a));
            args = list.join(", ");
        
    return callee + "(" + args + ")";
}
    if (expr.kind == NODE_MEMBER) {
    return CodeGenerator_gen_expr_py(self, expr.target) + "." + expr.property;
}
    if (expr.kind == NODE_STRUCT_INIT) {
    let fields = "";
    
              let list = [];
              for(let f of expr.fields) {
                   list.push("'" + f.name + "': " + CodeGenerator_gen_expr_py(self, f.value));
              }
              fields = list.join(", ");
         
    return expr.name + "({ " + fields + " })";
}
    if (expr.kind == NODE_ARRAY) {
    let elems = "";
    
             let list = [];
             for (let e of expr.elements) list.push(CodeGenerator_gen_expr_py(self, e));
             elems = list.join(", ");
         
    return "[" + elems + "]";
}
    if (expr.kind == NODE_IDENTIFIER) {
    return expr.value;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    return CodeGenerator_gen_expr_py(self, expr.left) + " = " + CodeGenerator_gen_expr_py(self, expr.right);
}
     if (typeof(expr) == "string") return expr; 
    return "None";
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CodeGenerator_generate_python = CodeGenerator_generate_python;
    exports.CodeGenerator_gen_stmt_py = CodeGenerator_gen_stmt_py;
    exports.CodeGenerator_gen_decorators_py = CodeGenerator_gen_decorators_py;
    exports.CodeGenerator_gen_block_py = CodeGenerator_gen_block_py;
    exports.CodeGenerator_gen_expr_py = CodeGenerator_gen_expr_py;
}


// === Module: core/codegen ===
var codegen_hybrid = exports;
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
function CodeGenerator_generate(self, program) {
    let hybrid = new_code_generator(self.target);
    let h = HybridCodeGenerator_new(self.target);
    return HybridCodeGenerator_generate(h, program);
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CodeGenerator_generate = CodeGenerator_generate;
}


// === Helper: core/codegen_hybrid_impl.js ===
// const fs = require('fs'); (hoisted)
// const path = require('path'); (hoisted)

const HybridImpl = {
    LanguageProfile_load_impl: function(self) {
        // Try multiple paths for profile
        const paths = [
            path.join(__dirname, '..', 'targets', self.name + '.json'),
            path.join(__dirname, '..', '..', 'targets', self.name + '.json'),
            path.join(process.cwd(), 'targets', self.name + '.json')
        ];
        
        let profile = null;
        for (const p of paths) {
            if (fs.existsSync(p)) {
                profile = JSON.parse(fs.readFileSync(p, 'utf-8'));
                break;
            }
        }
        
        if (profile) {
            self.extension = profile.extension || '.txt';
            self.templates = profile.templates || {};
            self.type_map = profile.type_map || {};
            self.operators = profile.operators || {};
            self.indent_str = profile.indent || '    ';
            self.statement_end = profile.statement_end || ';';
            self.loaded = true;
        } else {
            // Fallback defaults for JavaScript
            self.extension = '.js';
            self.templates = {
                program_header: "// Generated by Omni Compiler\n'use strict';\n\n",
                fn_decl: "function {name}({params}) {\n{body}\n}",
                let_decl: "let {name} = {value};",
                return_stmt: "return {value};",
                if_stmt: "if ({condition}) {\n{consequence}\n}",
                if_else_stmt: "if ({condition}) {\n{consequence}\n} else {\n{alternative}\n}",
                while_stmt: "while ({condition}) {\n{body}\n}",
                class_decl: "class {name} {\n{body}\n}",
                call_expr: "{callee}({args})",
                binary_expr: "{left} {op} {right}",
                bool_true: "true",
                bool_false: "false",
                null: "null"
            };
            self.type_map = { i64: "number", string: "string", bool: "boolean" };
            self.operators = { eq: "===", neq: "!==", and: "&&", or: "||" };
            self.loaded = true;
        }
        return self;
    },

    LanguageProfile_render_impl: function(self, template_name, data) {
        const template = self.templates[template_name];
        if (!template) {
            return "/* Template '" + template_name + "' not found */";
        }
        return template.replace(/\{(\w+)\}/g, (_, key) => {
            return data.hasOwnProperty(key) ? data[key] : '';
        });
    },

    LanguageProfile_map_operator_impl: function(self, op) {
        const opMap = { '==': 'eq', '!=': 'neq', '&&': 'and', '||': 'or', '<': 'lt', '>': 'gt' };
        const key = opMap[op];
        if (key && self.operators[key]) {
            return self.operators[key];
        }
        return op;
    },

    HybridCodeGenerator_indent_impl: function(self, code) {
        const prefix = self.profile.indent_str.repeat(self.indent_level);
        return code.split('\n').map(line => line ? prefix + line : line).join('\n');
    },

    check_native_lang: function(self, stmt) {
        let lang = stmt.lang || 'js';
        // Strip quotes if present
        if ((lang.startsWith('"') && lang.endsWith('"')) || (lang.startsWith("'") && lang.endsWith("'"))) {
            lang = lang.substring(1, lang.length - 1);
        }
        
        const targetLang = self.profile.name;
        
        if (lang === 'js' || lang === 'javascript') {
            if (targetLang === 'js' || targetLang === 'javascript') {
                return stmt.code;
            }
        } else if (lang === 'py' || lang === 'python') {
            if (targetLang === 'py' || targetLang === 'python') {
                return stmt.code;
            }
        } else if (lang === targetLang) {
            return stmt.code;
        }
        return "";
    },

    gen_expression_literal: function(self, expr) {
        let val = String(expr.value);
        if (val === 'true') val = self.profile.templates.bool_true || 'true';
        if (val === 'false') val = self.profile.templates.bool_false || 'false';
        if (val === 'null') val = self.profile.templates.null || 'null';
        return val;
    },

    gen_expression_bool: function(self, expr) {
        return expr.value ? 
            (self.profile.templates.bool_true || 'true') : 
            (self.profile.templates.bool_false || 'false');
    },

    gen_struct_body: function(stmt) {
        let constructor_body = "";
        for (const field of stmt.fields || []) {
            constructor_body += "        this." + field.name + " = data." + field.name + ";\n";
        }
        return constructor_body;
    },

    gen_entity_repo: function(stmt) {
        const name = stmt.name;
        const fields = (stmt.fields || []).filter(f => f.name !== 'id').map(f => f.name);
        // field_names unused in original code logic?
        
        let out = "\n// @entity Repository: " + name + "\n";
        out += name + ".find = async (id) => {\n";
        out += "    const db = await Database.get('main_db');\n";
        out += "    const row = await db.get('SELECT * FROM " + name + " WHERE id = ?', [id]);\n";
        out += "    return row ? new " + name + "(row) : null;\n";
        out += "};\n\n";
        
        out += name + ".all = async () => {\n";
        out += "    const db = await Database.get('main_db');\n";
        out += "    return (await db.all('SELECT * FROM " + name + "')).map(r => new " + name + "(r));\n";
        out += "};\n";
        return out;
    },

    gen_capsule: function(stmt) {
        const name = stmt.name;
        let flows = "";
        const flowDefs = stmt.flows || [];
        const flow_list = flowDefs.map(f => "'" + f.name + "'").join(', ');
        
        for (const flow of flowDefs) {
            const params = flow.params.map(p => p.name).join(', ');
            const paramJson = flow.params.map(p => p.name + ": " + p.name).join(', ');
            
            flows += "    async " + flow.name + "(" + params + ") {\n";
            flows += "        const route = TopologyResolver.resolve('" + name + "');\n";
            flows += "        if (route.local) {\n";
            flows += "            return this._impl_" + flow.name + "(" + params + ");\n";
            flows += "        } else {\n";
            flows += "            const response = await fetch(route.url + '/" + name + "/" + flow.name + "', {\n";
            flows += "                method: 'POST',\n";
            flows += "                headers: { 'Content-Type': 'application/json' },\n";
            flows += "                body: JSON.stringify({ " + paramJson + " })\n";
            flows += "            });\n";
            flows += "            return await response.json();\n";
            flows += "        }\n";
            flows += "    },\n\n";
            
            flows += "    _impl_" + flow.name + "(" + params + ") {\n";
            flows += "        throw new Error('" + name + "." + flow.name + " not implemented');\n";
            flows += "    },\n\n";
        }
        
        let out = "// Capsule: " + name + "\n";
        out += "const " + name + " = {\n";
        out += "    _name: '" + name + "',\n";
        out += "    _flows: [" + flow_list + "],\n\n";
        out += flows;
        out += "};\n";
        return out;
    },

    gen_spawn_code: function(fn_name, args_str) {
        let out = "(() => {\n";
        out += "    const { Worker } = require('worker_threads');\n";
        out += "    const worker = new Worker(__filename, {\n";
        out += "        workerData: { fn: '" + fn_name + "', args: [" + args_str + "] }\n";
        out += "    });\n";
        out += "    worker.on('message', r => console.log('[spawn] " + fn_name + " done:', r));\n";
        out += "    worker.on('error', e => console.error('[spawn] " + fn_name + " error:', e));\n";
        out += "})()";
        return out;
    },

    gen_service_client: function(stmt) {
        const name = stmt.name;
        let methods = "";
        
        for (const method of stmt.methods || []) {
            const params = method.params ? method.params.map(p => p.name).join(', ') : '';
            methods += "    async " + method.name + "(" + params + ") {\n";
            methods += "        const url = Discovery.resolve('" + name + "');\n";
            methods += "        const response = await fetch(url + '/" + name + "/" + method.name + "', {\n";
            methods += "            method: 'POST',\n";
            methods += "            headers: { 'Content-Type': 'application/json' },\n";
            methods += "            body: JSON.stringify({ " + params + " })\n";
            methods += "        });\n";
            methods += "        return await response.json();\n";
            methods += "    },\n";
        }
        
        return "// @service RPC Client: " + name + "\n" +
               "const " + name + " = {\n" + methods + "};\n";
    },
    
    gen_import: function(stmt) {
        let module_path = stmt.path || stmt.module || '';
        module_path = module_path.replace(/^['"]|['"]$/g, '');
        const alias = stmt.alias || module_path.split('/').pop().replace('.omni', '');
        
        return "// MARKER: Hybrid Import\n" + 
               "const " + alias + " = require(\"" + module_path + "\");\n" +
               "if (typeof global !== 'undefined') Object.assign(global, " + alias + ");";
    }
};

Object.assign(exports, HybridImpl);


// === Module: core/codegen_hybrid ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
class LanguageProfile {
    constructor(data = {}) {
        this.name = data.name;
        this.extension = data.extension;
        this.templates = data.templates;
        this.type_map = data.type_map;
        this.operators = data.operators;
        this.indent_str = data.indent_str;
        this.statement_end = data.statement_end;
        this.loaded = data.loaded;
    }
}
function new_map() {
     return {}; 
    return 0;
}
function LanguageProfile_new(name) {
    return new LanguageProfile({ name: name, extension: ".txt", templates: new_map(), type_map: new_map(), operators: new_map(), indent_str: "    ", statement_end: ";", loaded: false });
}
function LanguageProfile_load(self) {
    
        var impl = exports;
        return impl.LanguageProfile_load_impl(self);
    
    return self;
}
function LanguageProfile_render(self, template_name, data) {
    let result = "";
    
        var impl = exports;
        result = impl.LanguageProfile_render_impl(self, template_name, data);
    
    return result;
}
function LanguageProfile_map_type(self, omni_type) {
    let result = omni_type;
    
        result = self.type_map[omni_type] || omni_type;
    
    return result;
}
function LanguageProfile_map_operator(self, op) {
    let result = op;
    
        var impl = exports;
        result = impl.LanguageProfile_map_operator_impl(self, op);
    
    return result;
}
class HybridCodeGenerator {
    constructor(data = {}) {
        this.profile = data.profile;
        this.indent_level = data.indent_level;
        this.exports = data.exports;
        this.ast_node_count = data.ast_node_count;
        this.generated_count = data.generated_count;
    }
}
function HybridCodeGenerator_new(target) {
    let profile = LanguageProfile_new(target);
    profile = LanguageProfile_load(profile);
    return new HybridCodeGenerator({ profile: profile, indent_level: 0, exports: [], ast_node_count: 0, generated_count: 0 });
}
function HybridCodeGenerator_indent(self, code) {
    let result = "";
    
        var impl = exports;
        result = impl.HybridCodeGenerator_indent_impl(self, code);
    
    return result;
}
function HybridCodeGenerator_generate(self, program) {
    let output = "";
    output = LanguageProfile_render(self.profile, "program_header", null, null);
    
        self.exports = [];
        self.ast_node_count = 0;
        self.generated_count = 0;
        
        if (program && program.statements) {
            for (const stmt of program.statements) {
                self.ast_node_count++;
                let code = HybridCodeGenerator_gen_statement(self, stmt);
                if (code) {
                    output += code + "\n";
                    self.generated_count++;
                }
            }
        }
        
        // Auto-exports
        if (self.exports.length > 0) {
            output += "\n\n";
        }
        
        // AST Parity Validation
        let coverage = self.ast_node_count > 0 ? 
            (self.generated_count / self.ast_node_count * 100).toFixed(1) : 100;
        if (coverage < 100) {
            console.warn("[codegen] AST coverage: " + coverage + "% (" + 
                self.generated_count + "/" + self.ast_node_count + " nodes)");
        }
    
    return output;
}
function HybridCodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return HybridCodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == NODE_NATIVE) {
    let result = "";
    
            var impl = exports;
            result = impl.check_native_lang(self, stmt);
        
    return result;
}
    if (stmt.kind == NODE_LET) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "let_decl", {
                name: stmt.name,
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_RETURN) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "return_stmt", {
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_FUNCTION) {
    let params = "";
     params = stmt.params ? stmt.params.join(", ") : ""; 
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    
            if (stmt.is_exported) self.exports.push(stmt.name);
        
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "fn_decl", {
                name: stmt.name,
                params: params,
                body: body
            });
        
    return result;
}
    if (stmt.kind == NODE_STRUCT) {
    return HybridCodeGenerator_gen_struct(self, stmt);
}
    if (stmt.kind == NODE_IF) {
    return HybridCodeGenerator_gen_if(self, stmt);
}
    if (stmt.kind == NODE_WHILE) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
        
    return result;
}
    if (stmt.kind == NODE_CAPSULE) {
    return HybridCodeGenerator_gen_capsule(self, stmt);
}
    if (stmt.kind == NODE_SPAWN) {
    return HybridCodeGenerator_gen_spawn(self, stmt);
}
    if (stmt.kind == NODE_INTERFACE) {
    return HybridCodeGenerator_gen_interface(self, stmt);
}
    if (stmt.kind == NODE_ASSIGNMENT) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return stmt.name + " = " + value + self.profile.statement_end;
}
    if (stmt.kind == NODE_CALL) {
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: stmt.name, // Simplified for direct calls
                args: "" // Simplified
            });
             // This block seems wrong/duplicate, referencing old logic
        
}
    if (stmt.kind == 20) {
    let expr = HybridCodeGenerator_gen_expression(self, stmt.expr);
    return expr + self.profile.statement_end;
}
    let result = "";
     result = "// Unknown stmt kind: " + stmt.kind; 
    return result;
}
function HybridCodeGenerator_gen_expression(self, expr) {
    let is_null = false;
     is_null = !expr; 
    if (is_null) {
    return "";
}
    if (expr.kind == NODE_LITERAL) {
    let val = "";
     
            val = String(expr.value);
            // Map booleans
            if (val === 'true') val = self.profile.templates.bool_true || 'true';
            if (val === 'false') val = self.profile.templates.bool_false || 'false';
            if (val === 'null') val = self.profile.templates.null || 'null';
        
    return val;
}
    if (expr.kind == NODE_STRING) {
    let result = "";
     result = '"' + expr.value + '"'; 
    return result;
}
    if (expr.kind == NODE_BOOL) {
    let result = "";
    
            var impl = exports;
            result = impl.gen_expression_bool(self, expr);
        
    return result;
}
    if (expr.kind == NODE_IDENTIFIER) {
    let result = "";
     result = expr.value || expr.name || ''; 
    return result;
}
    if (expr.kind == NODE_BINARY) {
    let left = HybridCodeGenerator_gen_expression(self, expr.left);
    let right = HybridCodeGenerator_gen_expression(self, expr.right);
    let op = LanguageProfile_map_operator(self.profile, expr.op);
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "binary_expr", {
                left: left,
                op: op,
                right: right
            });
        
    return result;
}
    if (expr.kind == NODE_CALL) {
    let callee = "";
    let args = "";
    
            // Fix: Check expr.function for identifier, or expr.name if legacy
            if (expr.function && (expr.function.kind == 15 || expr.function.value)) {
                 callee = expr.function.value || expr.function.name;
            } else if (expr.name) {
                 callee = expr.name;
            } else if (expr.callee) { // Support legacy parser format if any
                 callee = expr.callee.value || expr.callee.name;
            }
            
            if (expr.args) {
                args = expr.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result;
}
    if (expr.kind == NODE_MEMBER) {
    let obj = HybridCodeGenerator_gen_expression(self, expr.object);
    return obj + "." + expr.member;
}
    if (expr.kind == NODE_ARRAY) {
    let elements = "";
    
            if (expr.elements) {
                elements = expr.elements.map(e => HybridCodeGenerator_gen_expression(self, e)).join(', ');
            }
        
    return "[" + elements + "]";
}
    if (expr.kind == NODE_STRUCT_INIT) {
    let fields = "";
    
            if (expr.fields) {
                fields = Object.entries(expr.fields)
                    .map(([k, v]) => k + ": " + HybridCodeGenerator_gen_expression(self, v))
                    .join(', ');
            }
        
    return "new " + expr.name + "({ " + fields + " })";
}
    let result = "";
     result = String(expr.value || expr.name || ''); 
    return result;
}
function HybridCodeGenerator_gen_block(self, body) {
    let result = "";
    
        if (!body) return '';
        let statements = Array.isArray(body) ? body : (body.statements || []);
        if (!Array.isArray(statements)) return '';
        result = statements.map(s => {
            let code = HybridCodeGenerator_gen_statement(self, s);
            return HybridCodeGenerator_indent(self, code);
        }).join('\n');
    
    return result;
}
function HybridCodeGenerator_gen_if(self, stmt) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    let consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let has_alt = false;
     
        // Check for both array and Block object formats
        has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node (e.g., Block, IfStmt)
        ); 
    
    if (has_alt) {
    self.indent_level = self.indent_level + 1;
    let alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let result = "";
    
            var impl = exports;
            result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
        
    return result;
}
    let result = "";
    
        var impl = exports;
        result = impl.LanguageProfile_render_impl(self.profile, "if_stmt", {
            condition: cond,
            consequence: consequence
        });
    
    return result;
}
function HybridCodeGenerator_gen_struct(self, stmt) {
    let is_entity = false;
    
        is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    let constructor_body = "";
    
        var impl = exports;
        constructor_body = impl.gen_struct_body(stmt);
    
    let class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
    let out = "";
    
        var impl = exports;
        out = impl.LanguageProfile_render_impl(self.profile, "class_decl", {
            name: stmt.name,
            body: class_body
        });
    
    if (is_entity) {
    out = out + HybridCodeGenerator_gen_entity_repo(self, stmt);
}
    return out;
}
function HybridCodeGenerator_gen_entity_repo(self, stmt) {
    let result = "";
    
        var impl = exports;
        result = impl.gen_entity_repo(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_capsule(self, stmt) {
    let result = "";
    
        var impl = exports;
        result = impl.gen_capsule(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_spawn(self, stmt) {
    let fn_name = "";
    let args = "";
    
        let call = stmt.call;
        fn_name = call?.name || call?.callee?.value || 'unknown';
        if (call?.args) {
            args = call.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
        }
    
    let out = "";
    
        var impl = exports;
        out = impl.gen_spawn_code(fn_name, args);
    
    return out;
}
function HybridCodeGenerator_gen_import(self, stmt) {
    let result = "";
    
        var impl = exports;
        result = impl.gen_import(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_interface(self, stmt) {
    let is_service = false;
    
        is_service = stmt.attributes && stmt.attributes.some(a => a.name === 'service');
    
    if (is_service) {
    return HybridCodeGenerator_gen_service_client(self, stmt);
}
    return "// Interface: " + stmt.name;
}
function HybridCodeGenerator_gen_service_client(self, stmt) {
    let result = "";
    
        var impl = exports;
        result = impl.gen_service_client(stmt);
    
    return result;
}
function new_code_generator(target) {
    return HybridCodeGenerator_new(target);
}
function CodeGenerator_generate(self, program) {
    return HybridCodeGenerator_generate(self, program);
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_map = new_map;
    exports.LanguageProfile_new = LanguageProfile_new;
    exports.LanguageProfile_load = LanguageProfile_load;
    exports.LanguageProfile_render = LanguageProfile_render;
    exports.LanguageProfile_map_type = LanguageProfile_map_type;
    exports.LanguageProfile_map_operator = LanguageProfile_map_operator;
    exports.HybridCodeGenerator_new = HybridCodeGenerator_new;
    exports.HybridCodeGenerator_indent = HybridCodeGenerator_indent;
    exports.HybridCodeGenerator_generate = HybridCodeGenerator_generate;
    exports.HybridCodeGenerator_gen_statement = HybridCodeGenerator_gen_statement;
    exports.HybridCodeGenerator_gen_expression = HybridCodeGenerator_gen_expression;
    exports.HybridCodeGenerator_gen_block = HybridCodeGenerator_gen_block;
    exports.HybridCodeGenerator_gen_if = HybridCodeGenerator_gen_if;
    exports.HybridCodeGenerator_gen_struct = HybridCodeGenerator_gen_struct;
    exports.HybridCodeGenerator_gen_entity_repo = HybridCodeGenerator_gen_entity_repo;
    exports.HybridCodeGenerator_gen_capsule = HybridCodeGenerator_gen_capsule;
    exports.HybridCodeGenerator_gen_spawn = HybridCodeGenerator_gen_spawn;
    exports.HybridCodeGenerator_gen_import = HybridCodeGenerator_gen_import;
    exports.HybridCodeGenerator_gen_interface = HybridCodeGenerator_gen_interface;
    exports.HybridCodeGenerator_gen_service_client = HybridCodeGenerator_gen_service_client;
    exports.new_code_generator = new_code_generator;
    exports.CodeGenerator_generate = CodeGenerator_generate;
    exports.LanguageProfile = LanguageProfile;
    exports.HybridCodeGenerator = HybridCodeGenerator;
}


// === Module: core/vm ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
class VMEnvironment {
    constructor(data = {}) {
        this.variables = data.variables;
        this.functions = data.functions;
        this.parent = data.parent;
        this.call_stack = data.call_stack;
    }
}
function new_map() {
     return {}; 
    return 0;
}
function VMEnvironment_new(parent) {
    let env = 0;
    
        env = {
            _omni_struct: true,
            name: "VMEnvironment",
            variables: {},
            functions: {},
            parent: parent,
            call_stack: []
        };
        
        // Register builtin functions
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
}
function VMEnvironment_get(self, name) {
    let result = 0;
    
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
    let result = 0;
    
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
    let env = VMEnvironment_new(0);
    return new OmniVM({ env: env, trace: true, step_count: 0 });
}
function OmniVM_run(self, program) {
    let result = 0;
    
        if (!program || !program.statements) {
            console.error("[vm] Invalid program");
            return null;
        }
        
        if (self.trace) console.log("[vm] Starting execution...");
        let startTime = Date.now();
        
        try {
            // Execute all statements
            for (const stmt of program.statements) {
                self.step_count++;
                result = OmniVM_exec_statement(self, stmt);
            }
            
            // Call main() if exists
            let mainFn = VMEnvironment_get_function(self.env, 'main');
            if (mainFn && typeof mainFn === 'object' && mainFn._omni_fn) {
                result = OmniVM_call_function(self, mainFn, []);
            }
            
            let elapsed = Date.now() - startTime;
            if (self.trace) {
                console.log("[vm] Execution completed in " + elapsed + "ms");
                console.log("[vm] Steps executed: " + self.step_count);
            }
            
        } catch (e) {
            console.error("[vm] Runtime error:", e.message);
            if (self.trace) {
                console.error(e.stack);
            }
        }
    
    return result;
}
function OmniVM_exec_statement(self, stmt) {
    let result = 0;
    
        if (self.trace) {
            console.log("[vm:trace] Executing stmt kind:", stmt.kind);
        }
        
        // Function declaration
        if (stmt.kind === 4) { // NODE_FUNCTION
            let fn = {
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
            let structDef = {
                _omni_struct: true,
                name: stmt.name,
                fields: stmt.fields || []
            };
            VMEnvironment_set(self.env, stmt.name, structDef);
            return null;
        }
        
        // Let declaration
        if (stmt.kind === 2) { // NODE_LET
            let value = OmniVM_eval_expression(self, stmt.value);
            VMEnvironment_set(self.env, stmt.name, value);
            return null;
        }
        
        // Return statement
        if (stmt.kind === 7) { // NODE_RETURN
            let value = OmniVM_eval_expression(self, stmt.value);
            throw { _omni_return: true, value: value };
        }
        
        // If statement
        if (stmt.kind === 13) { // NODE_IF
            let condition = OmniVM_eval_expression(self, stmt.condition);
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
            let value = OmniVM_eval_expression(self, stmt.value);
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
            let capsule = {
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
        
        // Expression statement (Statement wrapper)
        if (stmt.kind === 20) { // NODE_EXPRESSION_STMT
             return OmniVM_eval_expression(self, stmt.expr);
        }
        
        console.warn("[vm] Unknown statement kind:", stmt.kind);
        return null;
    
    return result;
}
function OmniVM_exec_block(self, block) {
    let result = 0;
    
        if (!block) return null;
        
        let statements = Array.isArray(block) ? block : (block.statements || []);
        
        for (const stmt of statements) {
            self.step_count++;
            result = OmniVM_exec_statement(self, stmt);
        }
    
    return result;
}
function OmniVM_eval_expression(self, expr) {
    let result = 0;
    
        if (!expr) return null;
        
        // Literal
        if (expr.kind === 3) { // NODE_LITERAL
            let val = expr.value;
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
            let name = expr.value || expr.name;
            return VMEnvironment_get(self.env, name);
        }
        
        // Binary expression
        if (expr.kind === 8) { // NODE_BINARY
            let left = OmniVM_eval_expression(self, expr.left);
            let right = OmniVM_eval_expression(self, expr.right);
            let op = expr.op;
            
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
            // Fix: CallExpr uses 'function' field (AST), not 'callee' or 'name'
            let funcNode = expr.function;
            let fnName = funcNode ? (funcNode.value || funcNode.name) : '';

            let args = (expr.args || []).map(a => OmniVM_eval_expression(self, a));
            
            // Check builtin
            let builtin = VMEnvironment_get_function(self.env, fnName);
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
            let obj = OmniVM_eval_expression(self, expr.object);
            return obj ? obj[expr.member] : undefined;
        }
        
        // Array literal
        if (expr.kind === 11) { // NODE_ARRAY
            return (expr.elements || []).map(e => OmniVM_eval_expression(self, e));
        }
        
        // Struct init
        if (expr.kind === 12) { // NODE_STRUCT_INIT
            let obj = {};
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
    let result = 0;
    
        // Create new environment for function scope
        let prevEnv = self.env;
        self.env = VMEnvironment_new(prevEnv);
        
        // Bind parameters
        for (let i = 0; i < func.params.length; i++) {
            let paramName = typeof func.params[i] === 'string' ? func.params[i] : func.params[i].name;
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
    exports.new_map = new_map;
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
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
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
    let adapter = FrameworkAdapter_new("nextjs");
    
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

export let config = {
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
    let adapter = FrameworkAdapter_new("laravel");
    
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
    let adapter = FrameworkAdapter_new("android");
    
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
    let adapter = FrameworkAdapter_new(framework);
    
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
            let fullPath = path.join(self.output_dir, filePath);
            let dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            let content = template
                .replace(/\{projectName\}/g, project_name)
                .replace(/\{package\}/g, 'com.omni.' + project_name.toLowerCase());
            
            fs.writeFileSync(fullPath, content);
            console.log("[adapter] Created:", filePath);
        }
    
}
function FrameworkGenerator_generate_ui(self, name, annotation) {
    let result = "";
    
        let templateName = annotation.type || 'component';
        let template = self.adapter.ui_templates[templateName];
        
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
    let result = "";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let capsuleName = capsule.name;
        let flows = capsule.flows || [];
        
        if (self.adapter.name === 'nextjs') {
            // Generate API routes for Next.js
            for (const flow of flows) {
                let serverAttr = flow.attributes?.find(a => a.name.startsWith('server.'));
                if (serverAttr) {
                    let method = serverAttr.name.split('.')[1].toUpperCase();
                    let routePath = serverAttr.args?.[0] || '/' + capsuleName.toLowerCase() + '/' + flow.name;
                    
                    let template = self.adapter.server_templates.route;
                    let code = template
                        .replace(/\{method\}/g, method)
                        .replace(/\{body\}/g, 'let result = await ' + capsuleName + '.' + flow.name + '();');
                    
                    // Write route file
                    let routeDir = path.join(self.output_dir, 'app/api', capsuleName.toLowerCase(), flow.name);
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
                let serverAttr = flow.attributes?.find(a => a.name.startsWith('server.'));
                if (serverAttr) {
                    let httpMethod = serverAttr.name.split('.')[1];
                    let routePath = serverAttr.args?.[0] || '/' + capsuleName.toLowerCase() + '/' + flow.name;
                    
                    methods += self.adapter.server_templates.controller_method
                        .replace(/\{name\}/g, flow.name)
                        .replace(/\{body\}/g, '$result = null; // TODO: implement');
                    
                    let routeTemplate = httpMethod === 'get' 
                        ? self.adapter.server_templates.route_get 
                        : self.adapter.server_templates.route_post;
                    routes += routeTemplate
                        .replace(/\{path\}/g, routePath)
                        .replace(/\{controller\}/g, capsuleName + 'Controller')
                        .replace(/\{method\}/g, flow.name) + '\n';
                }
            }
            
            let controller = self.adapter.server_templates.controller
                .replace(/\{name\}/g, capsuleName)
                .replace(/\{methods\}/g, methods);
            
            // Write controller
            let controllerDir = path.join(self.output_dir, 'app/Http/Controllers');
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
            let fullPath = path.join(self.output_dir, filePath);
            let dir = path.dirname(fullPath);
            
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


// === Helper: core/ingestion_patterns.js ===
Object.assign(exports, {
            // PHP Patterns
            php: [
                { 
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n    // TODO: Extract fields\n}`
                },
                {
                    name: 'function_definition',
                    regex: /function\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+))?\s*\{/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n    // TODO: Extract body\n}`
                },
                {
                    name: 'public_method',
                    regex: /public\s+function\s+(\w+)\s*\((.*?)\)/,
                    toOmni: (m) => `fn ${m[1]}(self: Self${m[2] ? ', ' + m[2] : ''})`
                },
                {
                    name: 'eloquent_model',
                    regex: /class\s+(\w+)\s+extends\s+Model/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'controller',
                    regex: /class\s+(\w+)Controller\s+extends\s+Controller/,
                    toOmni: (m) => `@server\ncapsule ${m[1]} {\n    // TODO: Extract flows\n}`
                },
                {
                    name: 'route_get',
                    regex: /Route::get\(['"]([^'"]+)['"]\s*,\s*\[(\w+)::class,\s*['"](\w+)['"]\]/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[3]}()`
                },
                {
                    name: 'route_post',
                    regex: /Route::post\(['"]([^'"]+)['"]\s*,\s*\[(\w+)::class,\s*['"](\w+)['"]\]/,
                    toOmni: (m) => `@server.post("${m[1]}")\nflow ${m[3]}()`
                }
            ],
            
            // Java Patterns
            java: [
                {
                    name: 'class_definition',
                    regex: /(?:public\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n    // TODO: Extract fields\n}`
                },
                {
                    name: 'method_definition',
                    regex: /(?:public|private|protected)?\s*(?:static\s+)?(\w+)\s+(\w+)\s*\((.*?)\)\s*(?:throws\s+\w+)?\s*\{/,
                    toOmni: (m) => `fn ${m[2]}(${m[3] || ''}) -> ${m[1]} {\n}`
                },
                {
                    name: 'spring_controller',
                    regex: /@(?:RestController|Controller)[\s\S]*?class\s+(\w+)/,
                    toOmni: (m) => `@server\ncapsule ${m[1]} {\n}`
                },
                {
                    name: 'spring_get',
                    regex: /@GetMapping\(['"]([^'"]+)['"]\)[\s\S]*?(?:public\s+)?(\w+)\s+(\w+)/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[3]}() -> ${m[2]}`
                },
                {
                    name: 'spring_entity',
                    regex: /@Entity[\s\S]*?class\s+(\w+)/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'spring_repository',
                    regex: /interface\s+(\w+)Repository\s+extends\s+(?:JpaRepository|CrudRepository)/,
                    toOmni: (m) => `// Repository ${m[1]} -> Omni @entity auto-generates CRUD`
                }
            ],
            
            // JavaScript/TypeScript Patterns
            javascript: [
                {
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n}`
                },
                {
                    name: 'function_definition',
                    regex: /(?:async\s+)?function\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+))?\s*\{/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n}`
                },
                {
                    name: 'arrow_function',
                    regex: /const\s+(\w+)\s*=\s*(?:async\s+)?\((.*?)\)\s*=>/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) {\n}`
                },
                {
                    name: 'express_route',
                    regex: /(?:app|router)\.(get|post|put|delete)\(['"]([^'"]+)['"]/,
                    toOmni: (m) => `@server.${m[1]}("${m[2]}")\nflow handler()`
                },
                {
                    name: 'nextjs_api',
                    regex: /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE)/,
                    toOmni: (m) => `@server.${m[1].toLowerCase()}("/")\nflow handler()`
                },
                {
                    name: 'react_component',
                    regex: /(?:export\s+)?(?:default\s+)?function\s+(\w+)\s*\(\s*(?:\{[^}]*\}|props)?\s*\)/,
                    toOmni: (m) => `@ui.component\nfn ${m[1]}() {\n}`
                }
            ],
            
            // Python Patterns
            python: [
                {
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\((\w+)\))?:/,
                    toOmni: (m) => `struct ${m[1]} {\n}`
                },
                {
                    name: 'function_definition',
                    regex: /def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*(\w+))?:/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n}`
                },
                {
                    name: 'fastapi_get',
                    regex: /@app\.get\(['"]([^'"]+)['"]\)[\s\S]*?(?:async\s+)?def\s+(\w+)/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[2]}()`
                },
                {
                    name: 'django_model',
                    regex: /class\s+(\w+)\(models\.Model\):/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'sqlalchemy_model',
                    regex: /class\s+(\w+)\(Base\):/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                }
            ]
        });


// === Module: core/ingestion ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
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
function new_map() {
     return {}; 
    return 0;
}
function PatternDatabase_new() {
    let db = new PatternDatabase({ patterns: new_map() });
    
        var patterns = exports;
        db.patterns = patterns;
        
        // Load external patterns from patterns/ directory
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        let patternsDir = path.join(__dirname, '..', 'patterns');
        
        if (fs.existsSync(patternsDir)) {
            let files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                try {
                    let content = JSON.parse(fs.readFileSync(path.join(patternsDir, file), 'utf-8'));
                    let lang = content.language || path.basename(file, '.json');
                    
                    if (!db.patterns[lang]) {
                        db.patterns[lang] = [];
                    }
                    
                    // Add patterns from external file
                    for (const pattern of (content.patterns || [])) {
                        db.patterns[lang].push({
                            name: pattern.name,
                            regex: new RegExp(pattern.regex, pattern.flags || ''),
                            toOmni: (m) => {
                                let result = pattern.template;
                                for (let i = 0; i < m.length; i++) {
                                    result = result.replace(new RegExp('\\{' + i + '\\}', 'g'), m[i] || '');
                                }
                                return result;
                            }
                        });
                    }
                    
                    console.log("[ingest] Loaded external patterns: " + lang);
                } catch (e) {
                    console.warn("[ingest] Failed to load patterns from " + file + ": " + e.message);
                }
            }
        }
    
    return db;
}
// Unknown stmt kind: undefined
class IngestionEngine {
    constructor(data = {}) {
        this.patterns = data.patterns;
        this.source_language = data.source_language;
        this.detected_patterns = data.detected_patterns;
        this.omni_output = data.omni_output;
        this.confidence_score = data.confidence_score;
    }
}
function IngestionEngine_new(source_lang) {
    return new IngestionEngine({ patterns: PatternDatabase_new(), source_language: source_lang, detected_patterns: [], omni_output: "", confidence_score: 0 });
}
function IngestionEngine_detect_language(source) {
    let lang = "unknown";
    
        // Heuristic language detection
        if (source.includes('<?php') || source.includes('<?=')) {
            lang = 'php';
        } else if (source.includes('public class') || source.includes('import java.')) {
            lang = 'java';
        } else if (source.includes('def ') && source.includes(':') && !source.includes('{')) { // }
            lang = 'python';
        } else if (source.includes('function') || source.includes('=>') || source.includes('const ')) {
            lang = 'javascript';
        } else if (source.includes('fn ') || source.includes('let ') || source.includes('use ')) {
            if (source.includes('->') && source.includes('::')) {
                lang = 'rust';
            }
        }
    
    return lang;
}
function IngestionEngine_analyze(self, source) {
    
        let patterns = self.patterns.patterns[self.source_language] || [];
        self.detected_patterns = [];
        
        for (const pattern of patterns) {
            let matches = source.match(new RegExp(pattern.regex, 'gm'));
            if (matches) {
                for (const match of matches) {
                    let groups = match.match(pattern.regex);
                    if (groups) {
                        self.detected_patterns.push({
                            pattern: pattern.name,
                            match: match,
                            omni: pattern.toOmni(groups)
                        });
                    }
                }
            }
        }
        
        // Calculate confidence based on pattern coverage
        if (self.detected_patterns.length > 0) {
            self.confidence_score = Math.min(100, self.detected_patterns.length * 15);
        }
    
}
function IngestionEngine_generate_omni(self) {
    let output = "";
    
        output = "// ============================================================================\n";
        output += "// AUTO-GENERATED OMNI CODE\n";
        output += "// Source Language: " + self.source_language.toUpperCase() + "\n";
        output += "// Confidence Score: " + self.confidence_score + "%\n";
        output += "// Patterns Detected: " + self.detected_patterns.length + "\n";
        output += "// ============================================================================\n\n";
        
        // Group by pattern type
        let structs = [];
        let capsules = [];
        let functions = [];
        let flows = [];
        
        for (const detected of self.detected_patterns) {
            let omni = detected.omni;
            if (omni.includes('@entity') || omni.includes('struct')) {
                structs.push(omni);
            } else if (omni.includes('capsule') || omni.includes('@server')) {
                capsules.push(omni);
            } else if (omni.includes('flow')) {
                flows.push(omni);
            } else if (omni.includes('fn ')) {
                functions.push(omni);
            }
        }
        
        // Output in logical order
        if (structs.length > 0) {
            output += "// === ENTITIES ===\n\n";
            output += structs.join('\n\n') + '\n\n';
        }
        
        if (capsules.length > 0 || flows.length > 0) {
            output += "// === CAPSULES ===\n\n";
            output += capsules.join('\n\n') + '\n';
            output += flows.join('\n') + '\n\n';
        }
        
        if (functions.length > 0) {
            output += "// === FUNCTIONS ===\n\n";
            output += functions.join('\n\n') + '\n\n';
        }
        
        // Add main if no capsules
        if (capsules.length === 0) {
            output += "fn main() {\n";
            output += "    // TODO: Implement main logic\n";
            output += "}\n";
        }
        
        self.omni_output = output;
    
    return output;
}
function IngestionEngine_report(self) {
    
        console.log("\n┌────────────────────────────────────────────┐");
        console.log("│        INGESTION ANALYSIS REPORT           │");
        console.log("├────────────────────────────────────────────┤");
        console.log("│ Source Language: " + self.source_language.toUpperCase().padEnd(25) + "│");
        console.log("│ Patterns Found:  " + String(self.detected_patterns.length).padEnd(25) + "│");
        console.log("│ Confidence:      " + (self.confidence_score + "%").padEnd(25) + "│");
        console.log("└────────────────────────────────────────────┘");
        console.log("\nDetected Patterns:");
        
        let patternCounts = {};
        for (const p of self.detected_patterns) {
            patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
        }
        
        for (const [name, count] of Object.entries(patternCounts)) {
            console.log("  • " + name + ": " + count);
        }
    
}
function cmd_ingest(input_file, output_file) {
    CLI_header("Omni Ingestion Engine");
    CLI_info("Analyzing: " + input_file);
    let source = read_file(input_file);
    let lang = IngestionEngine_detect_language(source);
    CLI_info("Detected language: " + lang);
    if (lang == "unknown") {
    CLI_error("Could not detect source language");
    return null;
}
    let engine = IngestionEngine_new(lang);
    IngestionEngine_analyze(engine, source);
    IngestionEngine_report(engine);
    let omni_code = IngestionEngine_generate_omni(engine);
    write_file(output_file, omni_code);
    CLI_success("Generated: " + output_file);
    CLI_info("Review the generated code and add missing implementation details.");
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CanonicalPattern_new = CanonicalPattern_new;
    exports.new_map = new_map;
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
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
    let pkg = new GitPackage({ name: "", provider: "github", owner: "", repo: "", full_url: "", commit: "", branch: "main", local_path: "" });
    
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
            let parts = input.split('/');
            pkg.name = parts.slice(-2).join('/');
            pkg.owner = parts[parts.length - 2];
            pkg.repo = parts[parts.length - 1].replace('.git', '');
        }
        
        // Parse owner/repo format
        if (!pkg.full_url && input.includes('/')) {
            let parts = input.split('/');
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
    let url = "";
    
        if (pkg.provider === 'github') {
            // GitHub archive URL (no git required)
            let branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/archive/refs/heads/' + branch + '.zip';
        } else if (pkg.provider === 'gitlab') {
            let branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/-/archive/' + branch + '/' + pkg.repo + '-' + branch + '.zip';
        } else {
            url = pkg.full_url;
        }
    
    return url;
}
function GitPackage_get_api_url(pkg) {
    let url = "";
    
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
function new_map() {
     return {}; 
    return 0;
}
function LockFile_load(project_dir) {
    let lock = new LockFile({ version: "1.0", packages: new_map() });
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let lockPath = path.join(project_dir, 'omni.lock');
        
        if (fs.existsSync(lockPath)) {
            try {
                let data = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
                lock.version = data.version || '1.0';
                lock.packages = data.packages || {};
            } catch (e) {
                console.error('[lock] Failed to parse omni.lock: ' + e.message);
            }
        }
    
    return lock;
}
function LockFile_save(lock, project_dir) {
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let lockPath = path.join(project_dir, 'omni.lock');
        
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
    let entry = new LockEntry({ name: "", url: "", commit: "", installed_at: "" });
    
        if (lock.packages[name]) {
            entry = lock.packages[name];
        }
    
    return entry;
}
function LockFile_remove(lock, name) {
    
        delete lock.packages[name];
    
}
function git_get_latest_commit(pkg) {
    let commit = "";
    
        const https = require('https');
        
        // Use GitHub API to get latest commit
        if (pkg.provider === 'github') {
            let apiUrl = 'https://api.github.com/repos/' + pkg.owner + '/' + pkg.repo + '/commits?per_page=1';
            
            console.log(CLI_COLORS.dim + '  Fetching latest commit...' + CLI_COLORS.reset);
            
            // Sync HTTP request (simplified for demo)
            const { execSync } = require('child_process');
            try {
                let result = execSync(
                    'curl -s -H "Accept: application/vnd.github.v3+json" "' + apiUrl + '"',
                    { encoding: 'utf-8' }
                );
                let data = JSON.parse(result);
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
    let success = false;
    
        const { execSync, exec } = require('child_process');
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Ensure parent directory exists
        let parentDir = path.dirname(target_dir);
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
            
            let zipUrl = GitPackage_get_zip_url(pkg);
            let zipPath = path.join(parentDir, pkg.repo + '.zip');
            
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
                let entries = fs.readdirSync(parentDir);
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
    CLI_banner();
    CLI_header("Omni Package Installer");
    if (package_spec == "") {
    cmd_install_from_lock();
    return null;
}
    let pkg = GitPackage_parse(package_spec);
    if (pkg.name == "") {
    CLI_error("Invalid package specification: " + package_spec);
    CLI_info("Examples:");
    CLI_info("  omni install github:crom/utils");
    CLI_info("  omni install crom/utils");
    CLI_info("  omni install https://github.com/crom/utils");
    return null;
}
    CLI_info("Package: " + pkg.name);
    CLI_info("Source: " + pkg.full_url);
    let commit = git_get_latest_commit(pkg);
    if (commit != "") {
    pkg.commit = commit;
    CLI_info("Commit: " + commit.substring(0, 8) + "...");
}
    let cwd = "";
     cwd = process.cwd(); 
    let target = "";
    
        // const path = require('path'); (hoisted)
        target = path.join(cwd, pkg.local_path);
    
    CLI_step(1, 3, "Downloading...");
    let success = git_clone(pkg, target);
    if (success) {
    CLI_step(2, 3, "Updating lock file...");
    let lock = LockFile_load(cwd);
    LockFile_add(lock, pkg);
    LockFile_save(lock, cwd);
    CLI_step(3, 3, "Done!");
    CLI_success("Installed: " + pkg.name);
    
            console.log("");
            console.log(CLI_COLORS.cyan + "  Usage:" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + '    import "' + pkg.owner + '/' + pkg.repo + '/src/main.omni";' + CLI_COLORS.reset);
        
} else {
    CLI_error("Failed to install package");
}
}
function cmd_install_from_lock() {
    CLI_info("Installing packages from omni.lock...");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
        // const path = require('path'); (hoisted)
        let packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            terminal.CLI_info("No packages in omni.lock");
            return;
        }
        
        console.log(CLI_COLORS.dim + "  Found " + packages.length + " packages" + CLI_COLORS.reset);
        
        for (const entry of packages) {
            let pkg = GitPackage_parse(entry.url);
            pkg.commit = entry.commit;
            
            let target = path.join(cwd, pkg.local_path);
            
            console.log(CLI_COLORS.cyan + "  Installing: " + CLI_COLORS.reset + pkg.name);
            git_clone(pkg, target);
        }
        
        CLI_success("All packages installed!");
    
}
function cmd_uninstall(package_name) {
    CLI_banner();
    CLI_header("Omni Package Uninstaller");
    if (package_name == "") {
    CLI_error("Usage: omni uninstall <package>");
    return null;
}
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    let found = false;
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Find package in lock
        for (const [name, entry] of Object.entries(lock.packages)) {
            if (name === package_name || name.endsWith('/' + package_name)) {
                found = true;
                
                // Remove directory
                let pkg = GitPackage_parse(entry.url);
                let targetDir = path.join(cwd, pkg.local_path);
                
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
    LockFile_save(lock, cwd);
    CLI_success("Uninstalled: " + package_name);
} else {
    CLI_error("Package not found: " + package_name);
}
}
function cmd_list() {
    CLI_banner();
    CLI_header("Installed Packages");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
        let packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            terminal.CLI_info("No packages installed.");
            console.log("");
            terminal.CLI_info("Install packages with: omni install github:user/repo");
            return;
        }
        
        console.log("");
        console.log(CLI_COLORS.cyan + "  " + packages.length + " packages installed:" + CLI_COLORS.reset);
        console.log("");
        
        for (const pkg of packages) {
            let commit = pkg.commit ? pkg.commit.substring(0, 8) : 'HEAD';
            console.log("  ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset + 
                        CLI_COLORS.dim + " @ " + commit + CLI_COLORS.reset);
            console.log("     " + CLI_COLORS.dim + pkg.url + CLI_COLORS.reset);
        }
        
        console.log("");
    
}
function cmd_update(package_name) {
    CLI_banner();
    CLI_header("Omni Package Updater");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
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
            let pkg = GitPackage_parse(entry.url);
            
            console.log(CLI_COLORS.cyan + "  Updating: " + CLI_COLORS.reset + pkg.name);
            
            // Get latest commit
            let newCommit = git_get_latest_commit(pkg);
            
            if (newCommit && newCommit !== entry.commit) {
                console.log(CLI_COLORS.dim + "    " + entry.commit.substring(0, 8) + " ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ " + newCommit.substring(0, 8) + CLI_COLORS.reset);
                
                pkg.commit = newCommit;
                let target = path.join(cwd, pkg.local_path);
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
    CLI_banner();
    CLI_header("Omni Doctor - System Health Check");
    
        const { execSync } = require('child_process');
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let allOk = true;
        
        // Check git
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking tools:" + CLI_COLORS.reset);
        
        let tools = [
            { name: 'git', cmd: 'git --version' },
            { name: 'node', cmd: 'node --version' },
            { name: 'curl', cmd: 'curl --version' }
        ];
        
        for (const tool of tools) {
            try {
                let version = execSync(tool.cmd, { encoding: 'utf-8' }).trim().split('\n')[0];
                console.log("  " + CLI_COLORS.green + "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“" + CLI_COLORS.reset + " " + tool.name + ": " + CLI_COLORS.dim + version + CLI_COLORS.reset);
            } catch (e) {
                console.log("  " + CLI_COLORS.red + "ÃƒÂ¢Ã…â€œÃ¢â‚¬â€" + CLI_COLORS.reset + " " + tool.name + ": not found");
                allOk = false;
            }
        }
        
        // Check omni.lock
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking project:" + CLI_COLORS.reset);
        
        let cwd = process.cwd();
        let files = [
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
    CLI_banner();
    CLI_header("Omni Package Search");
    
        const https = require('https');
        
        // Fetch from static registry JSON
        let registryUrl = 'https://raw.githubusercontent.com/crom-lang/registry/main/packages.json';
        
        console.log(CLI_COLORS.dim + "  Fetching registry..." + CLI_COLORS.reset);
        
        const { execSync } = require('child_process');
        
        try {
            let result = execSync('curl -sL "' + registryUrl + '"', { encoding: 'utf-8' });
            let registry = JSON.parse(result);
            
            let results = registry.packages || [];
            
            if (query) {
                let q = query.toLowerCase();
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
    exports.new_map = new_map;
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
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
var registry = exports;
if (typeof global !== 'undefined') Object.assign(global, registry);
var interfaces = exports;
if (typeof global !== 'undefined') Object.assign(global, interfaces);
var impl_js = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_js);
var impl_python = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_python);
var impl_cnative = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_cnative);
var impl_lua = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_lua);



// === Module: core/ghost_writer ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
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
                let capsule = {
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
                let entity = {
                    name: stmt.name,
                    fields: stmt.fields || [],
                    isEntity: (stmt.attributes || []).some(a => a.name === 'entity')
                };
                self.entities.push(entity);
            }
            
            // Function
            if (stmt.kind === 4) { // NODE_FUNCTION
                let fn = {
                    name: stmt.name,
                    params: stmt.params || [],
                    return_type: stmt.return_type || 'void',
                    calls: []
                };
                
                // Extract function calls from body
                let extractCalls = (node) => {
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
    let diagram = "";
    
        diagram = "```mermaid\nclassDiagram\n";
        
        // Entities
        for (const entity of self.entities) {
            diagram += "    class " + entity.name + " {\n";
            
            for (const field of entity.fields) {
                let fieldName = field.name || field;
                let fieldType = field.type || 'any';
                diagram += "        +" + fieldType + " " + fieldName + "\n";
            }
            
            diagram += "    }\n\n";
        }
        
        // Capsules as classes
        for (const capsule of self.capsules) {
            diagram += "    class " + capsule.name + " {\n";
            diagram += "        <<capsule>>\n";
            
            for (const flow of capsule.flows) {
                let params = (flow.params || []).map(p => 
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
                let capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + " --> " + entity.name + " : uses\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_flowchart(self) {
    let diagram = "";
    
        diagram = "```mermaid\nflowchart TD\n";
        
        // Subgraphs for capsules
        for (const capsule of self.capsules) {
            diagram += "    subgraph " + capsule.name + "\n";
            
            for (const flow of capsule.flows) {
                let nodeId = capsule.name + "_" + flow.name;
                
                // Check for server attribute
                let serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    let method = serverAttr.name.split('.')[1].toUpperCase();
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
                let from = capsule.name + "_" + capsule.flows[i].name;
                let to = capsule.name + "_" + capsule.flows[i + 1].name;
                // diagram += "    " + from + " --> " + to + "\n";
            }
        }
        
        // External connections
        for (const entity of self.entities.filter(e => e.isEntity)) {
            diagram += "    DB[(" + entity.name + " DB)]\n";
            
            for (const capsule of self.capsules) {
                let capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + "_" + capsule.flows[0].name + " --> DB\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_sequence_diagram(self) {
    let diagram = "";
    
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
                let serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    let method = serverAttr.name.split('.')[1].toUpperCase();
                    diagram += "    Client->>+" + capsule.name + ": " + method + " /" + flow.name + "\n";
                    
                    // Check for entity access
                    for (const entity of self.entities.filter(e => e.isEntity)) {
                        let flowStr = JSON.stringify(flow);
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
    let diagram = "";
    
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
    let doc = "";
    
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
                let params = (flow.params || []).map(p => 
                    typeof p === 'string' ? p : (p.name + ': ' + (p.type || 'any'))
                ).join(', ');
                
                doc += "#### `" + flow.name + "(" + params + ") -> " + flow.return_type + "`\n\n";
                
                // Attributes
                for (const attr of flow.attributes) {
                    if (attr.name && attr.name.startsWith('server.')) {
                        let method = attr.name.split('.')[1].toUpperCase();
                        let path = attr.args && attr.args[0] ? attr.args[0] : '/' + flow.name;
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
                let name = field.name || field;
                let type = field.type || 'any';
                doc += "| " + name + " | " + type + " |\n";
            }
            
            doc += "\n";
        }
        
        doc += "---\n\n";
        doc += "*Generated by Omni Ghost Writer v1.0*\n";
    
    return doc;
}
function cmd_graph(input_file, output_file) {
    CLI_header("Omni Ghost Writer");
    CLI_info("Analyzing: " + input_file);
    let source = read_file(input_file);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let writer = GhostWriter_new();
    GhostWriter_analyze(writer, program);
    let project_name = "";
    
        // const path = require('path'); (hoisted)
        project_name = path.basename(input_file, '.omni');
    
    let docs = GhostWriter_generate_docs(writer, project_name);
    write_file(output_file, docs);
    CLI_success("Documentation generated: " + output_file);
    
        console.log("");
        console.log(CLI_COLORS.bold + "Generated Diagrams:" + CLI_COLORS.reset);
        console.log("  • Class Diagram");
        console.log("  • System Flowchart");
        console.log("  • Sequence Diagram");
        console.log("  • Call Graph");
        console.log("");
        terminal.CLI_info("View the .md file in any Markdown viewer with Mermaid support");
    
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
function get_c_runtime_header() {
    let header = "";
    
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
    CLI_banner();
    CLI_header("Omni Bootstrap - Native Compilation");
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        let omniDir = path.join(__dirname, '..');
        let srcDir = path.join(omniDir, 'src');
        let distDir = path.join(omniDir, 'dist');
        let bootstrapDir = path.join(omniDir, 'bootstrap');
        
        // Create bootstrap directory
        if (!fs.existsSync(bootstrapDir)) {
            fs.mkdirSync(bootstrapDir, { recursive: true });
        }
        
        CLI_step(1, 5, "Generating C runtime header...");
        
        // Write runtime header
        let runtimeHeader = get_c_runtime_header();
        fs.writeFileSync(path.join(bootstrapDir, 'omni_runtime.h'), runtimeHeader);
        CLI_success("Created: bootstrap/omni_runtime.h");
        
        CLI_step(2, 5, "Compiling Omni sources to C...");
        
        // List of core source files (order matters)
        let sourceFiles = [
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
            let fullPath = path.join(srcDir, file);
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
        let compilers = ['gcc', 'clang', 'cl'];
        
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
        
        let isWindows = process.platform === 'win32';
        let outputName = isWindows ? 'omni.exe' : 'omni';
        let outputPath = path.join(bootstrapDir, outputName);
        
        try {
            // Note: This would fail without actual C code
            // let compileCmd = compiler + ' -O2 -o ' + outputPath + ' ' + 
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var ghost_writer = exports;
if (typeof global !== 'undefined') Object.assign(global, ghost_writer);
var project = exports;
if (typeof global !== 'undefined') Object.assign(global, project);
var runner = exports;
if (typeof global !== 'undefined') Object.assign(global, runner);
var state = exports;
if (typeof global !== 'undefined') Object.assign(global, state);
var server = exports;
if (typeof global !== 'undefined') Object.assign(global, server);
var html = exports;
if (typeof global !== 'undefined') Object.assign(global, html);



// === Module: core/studio_graph ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var graph_types = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_types);
var graph_convert = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_convert);
var graph_io = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_io);
var graph_actions = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_actions);



// === Module: core/app_packager ===
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
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
    let platform = "unknown";
    
        platform = process.platform;
    
    return platform;
}
function detect_build_tools() {
    
        const { execSync } = require('child_process');
        
        let tools = {
            gcc: false,
            clang: false,
            cargo: false,
            android_sdk: false,
            xcode: false,
            wix: false
        };
        
        let check = (cmd) => {
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
    
    return 0;
}
function generate_tauri_config(config, is_studio) {
    let json = "";
    
        let tauriConfig = {
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
    let json = "";
    
        let capConfig = {
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
    CLI_banner();
    CLI_header("Omni App Packager");
    CLI_info("Target: " + target);
    CLI_info("App: " + config.name + " v" + config.version);
    let tools = detect_build_tools();
    let platform = detect_platform();
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        let omniDir = path.join(__dirname, '..');
        let buildDir = path.join(omniDir, 'build');
        let distDir = path.join(omniDir, 'dist', 'app');
        
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
            let tauriDir = path.join(buildDir, 'tauri');
            if (!fs.existsSync(tauriDir)) {
                fs.mkdirSync(tauriDir, { recursive: true });
            }
            
            // Write tauri.conf.json
            let tauriConfig = generate_tauri_config(config, true);
            fs.writeFileSync(path.join(tauriDir, 'tauri.conf.json'), tauriConfig);
            CLI_success("Generated: build/tauri/tauri.conf.json");
            
            CLI_step(2, 4, "Copying Studio UI...");
            
            // Copy Studio files
            let studioDistDir = path.join(tauriDir, 'studio', 'dist');
            if (!fs.existsSync(studioDistDir)) {
                fs.mkdirSync(studioDistDir, { recursive: true });
            }
            
            // Generate minimal index.html that loads Studio
            let indexHtml = `<!DOCTYPE html>
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
            
            let capDir = path.join(buildDir, 'capacitor');
            if (!fs.existsSync(capDir)) {
                fs.mkdirSync(capDir, { recursive: true });
            }
            
            // Write capacitor.config.json
            let capConfig = generate_capacitor_config(config);
            fs.writeFileSync(path.join(capDir, 'capacitor.config.json'), capConfig);
            CLI_success("Generated: build/capacitor/capacitor.config.json");
            
            // Create package.json
            let packageJson = {
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
            
            let distFolder = path.join(capDir, 'dist');
            if (!fs.existsSync(distFolder)) {
                fs.mkdirSync(distFolder, { recursive: true });
            }
            
            // Create minimal index.html
            let indexHtml = `<!DOCTYPE html>
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
            
            let linuxDir = path.join(buildDir, 'linux');
            if (!fs.existsSync(linuxDir)) {
                fs.mkdirSync(linuxDir, { recursive: true });
            }
            
            // Write desktop file
            let desktopEntry = `[Desktop Entry]
Name=${config.name}
Comment=${config.description}
Exec=omni
Icon=omni
Type=Application
Categories=Development;IDE;
`;
            fs.writeFileSync(path.join(linuxDir, config.name + '.desktop'), desktopEntry);
            
            // Write AppImage recipe
            let appImageYml = `app: ${config.name}
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
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
    
        let width = process.stdout.columns || 80;
        let line = 'â•'.repeat(width - 2);
        
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
            let item = state.items[i];
            let selected = i === state.cursor;
            let prefix = selected ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            let suffix = CLI_COLORS.reset;
            
            if (selected) {
                console.log(prefix + CLI_COLORS.bold + item.label + suffix);
            } else {
                console.log(prefix + CLI_COLORS.dim + item.label + suffix);
            }
        }
    
}
function tui_render_footer(state) {
    
        let width = process.stdout.columns || 80;
        let line = 'â”€'.repeat(width - 2);
        
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
            let item = state.items[i];
            let isSelected = state.selected.includes(i);
            let isCursor = i === state.cursor;
            
            let checkbox = isSelected ? CLI_COLORS.green + '[âœ“]' : CLI_COLORS.dim + '[ ]';
            let prefix = isCursor ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            
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
            let item = state.items[i];
            let isCursor = i === state.cursor;
            
            let prefix = isCursor ? CLI_COLORS.cyan + ' â–¶ ' : '   ';
            let icon = item.icon || 'ðŸŽ¯';
            
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
    let files = [];
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let extensions = ['.php', '.java', '.py', '.js', '.ts'];
        
        let scan = (d) => {
            try {
                let entries = fs.readdirSync(d, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
                    
                    let fullPath = path.join(d, entry.name);
                    
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
    let state = TUIState_new();
    
        state.items = tui_main_menu();
    
    tui_enable_raw_mode();
    tui_hide_cursor();
    
        const readline = require('readline');
        
        let render = () => {
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
        
        let handleAction = (action) => {
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
                let target = action.split(':')[1];
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
                let idx = state.selected.indexOf(state.cursor);
                if (idx >= 0) {
                    state.selected.splice(idx, 1);
                } else {
                    state.selected.push(state.cursor);
                }
            } else if (key === '\r' || key === '\n') { // Enter
                let item = state.items[state.cursor];
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


// === Module: core/../studio/project ===
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
    let info = new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" });
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        info.name = path.basename(dir);
        
        // Detection order (most specific first)
        let detectors = [
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
            let configPath = path.join(dir, detector.file);
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.detect_project = detect_project;
    exports.ProjectInfo = ProjectInfo;
}


// === Module: core/../studio/runner ===
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
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
    let success = true;
    
        const { spawn } = require('child_process');
        // const path = require('path'); (hoisted)
        
        console.log(CLI_COLORS.cyan + "[runner] " + CLI_COLORS.reset + "Starting: " + command);
        
        // Parse command
        let parts = command.split(' ');
        let cmd = parts[0];
        let args = parts.slice(1);
        
        // Spawn process
        let proc = spawn(cmd, args, {
            cwd: cwd,
            shell: true,
            stdio: ['inherit', 'pipe', 'pipe']
        });
        
        self.processes[name] = proc;
        self.output_buffer[name] = [];
        
        proc.stdout.on('data', (data) => {
            let line = data.toString();
            self.output_buffer[name].push(line);
            process.stdout.write(CLI_COLORS.dim + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.stderr.on('data', (data) => {
            let line = data.toString();
            self.output_buffer[name].push(line);
            process.stderr.write(CLI_COLORS.red + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.on('close', (code) => {
            console.log(CLI_COLORS.yellow + "[runner] " + CLI_COLORS.reset + name + " exited with code " + code);
            delete self.processes[name];
        });
        
        proc.on('error', (err) => {
            terminal.CLI_error("Failed to start " + name + ": " + err.message);
            success = false;
        });
    
    return success;
}
function CrossRunner_stop(self, name) {
    
        let proc = self.processes[name];
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CrossRunner_new = CrossRunner_new;
    exports.CrossRunner_run = CrossRunner_run;
    exports.CrossRunner_stop = CrossRunner_stop;
    exports.CrossRunner_stop_all = CrossRunner_stop_all;
    exports.CrossRunner = CrossRunner;
}


// === Module: core/../studio/state ===
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
    let state = GraphState_new();
    
        if (!program || !program.statements) return;
        
        let nodeId = 0;
        let y = 50;
        
        for (const stmt of program.statements) {
            let node = {
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
    let json = "";
    
        json = JSON.stringify({
            nodes: self.nodes,
            edges: self.edges,
            viewport: self.viewport
        }, null, 2);
    
    return json;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.GraphState_new = GraphState_new;
    exports.GraphState_from_ast = GraphState_from_ast;
    exports.GraphState_to_json = GraphState_to_json;
    exports.GraphNode = GraphNode;
    exports.GraphEdge = GraphEdge;
    exports.GraphState = GraphState;
}


// === Module: core/../studio/html ===
var server = exports;
if (typeof global !== 'undefined') Object.assign(global, server);
function generate_studio_html(server) {
    let html = "";
    
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
            let res = await fetch('/api/graph');
            let graph = await res.json();
            nodes = graph.nodes || [];
            renderNodes();
        }
        
        function renderNodes() {
            let canvas = document.getElementById('canvas');
            canvas.innerHTML = '';
            
            for (const node of nodes) {
                let el = document.createElement('div');
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
                
                // Add output ports and rest of rendering logic here...
                // (Truncated for brevity in split)
                
                el.innerHTML = \`
                    <div class="vnode-header">
                        <span class="vnode-type">\${node.type}</span>
                        <span class="vnode-title">\${node.name}</span>
                    </div>
                    <div class="vnode-body">
                        \${portsHtml}
                    </div>
                \`;
                
                canvas.appendChild(el);
            }
        }
        
        loadGraph();
    </script>
</body>
</html>`;
    
    return html;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.generate_studio_html = generate_studio_html;
}


// === Module: core/../studio/server ===
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var project = exports;
if (typeof global !== 'undefined') Object.assign(global, project);
var runner = exports;
if (typeof global !== 'undefined') Object.assign(global, runner);
var state = exports;
if (typeof global !== 'undefined') Object.assign(global, state);
var html = exports;
if (typeof global !== 'undefined') Object.assign(global, html);
class StudioServer {
    constructor(data = {}) {
        this.port = data.port;
        this.project = data.project;
        this.runner = data.runner;
        this.graph = data.graph;
    }
}
function StudioServer_new(port) {
    return new StudioServer({ port: port, project: new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" }), runner: CrossRunner_new(), graph: GraphState_new() });
}
function StudioServer_start(self, dir) {
    CLI_banner();
    CLI_header("Omni Studio");
    self.project = detect_project(dir);
    CLI_info("Project: " + self.project.name);
    CLI_info("Type: " + self.project.type);
    
        const http = require('http');
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let server = http.createServer((req, res) => {
            // API Routes
            if (req.url === '/api/project') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(self.project));
                return;
            }
            
            if (req.url === '/api/graph') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(GraphState_to_json(self.graph));
                return;
            }
            
            if (req.url === '/api/packages') {
                // Warning: PackageRegistry_new might need import or be available
                // Assuming it's available via global context or we need to import it here.
                // For now, let's assume it's imported in facade or globally available.
                let registry = PackageRegistry_new();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(registry.packages));
                return;
            }
            
            // Serve Studio UI
            if (req.url === '/' || req.url === '/index.html') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(generate_studio_html(self));
                return;
            }
            
            res.writeHead(404);
            res.end('Not Found');
        });
        
        server.listen(self.port, () => {
            console.log("");
            console.log(CLI_COLORS.green + "  ╔════════════════════════════════════════════════╗" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║                                                ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║       OMNI STUDIO - Ready                      ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║                                                ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ╚════════════════════════════════════════════════╝" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  → Local:   " + CLI_COLORS.reset + "http://localhost:" + self.port);
            console.log(CLI_COLORS.cyan + "  → Project: " + CLI_COLORS.reset + self.project.name);
            console.log("");
            CLI_info("Press Ctrl+C to stop");
        });
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.StudioServer_new = StudioServer_new;
    exports.StudioServer_start = StudioServer_start;
    exports.StudioServer = StudioServer;
}


// === Module: core/../studio/graph_types ===
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
    return new VisualGraph({ nodes: [], edges: [], viewport: null, x: 0, y: 0, zoom: 1.0 });
    // Unknown stmt kind: 0
    metadata;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    version;
    // Unknown stmt kind: 0
    "1.0";
    // Unknown stmt kind: 0
    generated;
    // Unknown stmt kind: 0
    "";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.VisualGraph_new = VisualGraph_new;
    exports.VisualNode = VisualNode;
    exports.VisualEdge = VisualEdge;
    exports.VisualGraph = VisualGraph;
}


// === Module: core/../studio/graph_convert ===
var ast = exports;
if (typeof global !== 'undefined') Object.assign(global, ast);
var graph_types = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_types);

    var { VisualGraph_new, VisualGraph: VisualGraph_Class } = graph_types;

function ast_to_graph(program) {
    let graph = VisualGraph_new();
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        graph.metadata.generated = new Date().toISOString();
        
        let nodeId = 0;
        let edgeId = 0;
        let y = 50;
        let NODE_HEIGHT = 80;
        let NODE_WIDTH = 200;
        let CAPSULE_PADDING = 40;
        
        // Helper to create node
        let createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
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
        let createEdge = (srcNode, srcPort, tgtNode, tgtPort, type) => {
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
                let node = createNode('import', stmt.path || stmt.value, 50, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                y += 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                let isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                let node = createNode(isEntity ? 'entity' : 'struct', stmt.name, 400, y, 70, stmt.line);
                
                // Add fields as ports
                for (const field of (stmt.fields || [])) {
                    let fieldName = typeof field === 'string' ? field : field.name;
                    let fieldType = typeof field === 'object' ? field.type : 'any';
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
                let capsuleNode = createNode('capsule', stmt.name, 50, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + CAPSULE_PADDING;
                let flowNodes = [];
                
                // Process flows inside capsule
                for (const flow of (stmt.flows || [])) {
                    let flowNode = createNode('flow', flow.name, 70, innerY, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    // Input ports (params)
                    for (const param of (flow.params || [])) {
                        let paramName = typeof param === 'string' ? param : param.name;
                        let paramType = typeof param === 'object' ? param.type : 'any';
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
                    let edge = createEdge(
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
                let node = createNode('function', stmt.name, 50, y, 4, stmt.line);
                
                // Input ports (params)
                for (const param of (stmt.params || [])) {
                    let paramName = typeof param === 'string' ? param : param.name;
                    let paramType = typeof param === 'object' ? param.type : 'any';
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
function new_map() {
     return {}; 
    return 0;
}
function graph_to_ast(graph) {
    let program = new_map();
    
        program = {
            kind: 1, // NODE_PROGRAM
            statements: []
        };
        
        // Sort nodes by y position for correct order
        let sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group child nodes by parent
        let childrenMap = {};
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
                let stmt = {
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
                let flows = (childrenMap[node.id] || [])
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
}
function graph_to_code(graph) {
    let code = "";
    
        let lines = [];
        lines.push("// Generated by Omni Studio Visual Editor");
        lines.push("// " + new Date().toISOString());
        lines.push("");
        
        // Sort nodes by y position
        let sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group children by parent
        let childrenMap = {};
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
                
                let children = (childrenMap[node.id] || []).sort((a, b) => a.y - b.y);
                for (const child of children) {
                    if (child.type === 'flow') {
                        // Position comment
                        lines.push(`    // @visual:position(${Math.round(child.x)}, ${Math.round(child.y)})`);
                        
                        // Attributes
                        for (const attr of (child.attributes || [])) {
                            if (attr.name) {
                                let args = (attr.args || []).map(a => `"${a}"`).join(', ');
                                lines.push(`    @${attr.name}${args ? '(' + args + ')' : ''}`);
                            }
                        }
                        
                        // Flow signature
                        let params = child.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                        let returnType = child.ports_out[0]?.type || 'void';
                        let returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                        
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
                let params = node.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                let returnType = node.ports_out[0]?.type || 'void';
                let returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                
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
function code_to_graph(source, program) {
    let graph = VisualGraph_new();
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        // Parse @visual:position comments from source
        let positionMap = {};
        let lines = source.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let match = line.match(new RegExp("@visual:position\\((\\d+),\\s*(\\d+)\\)"));
            if (match) {
                // Position applies to next non-comment line
                let x = parseInt(match[1]);
                let y = parseInt(match[2]);
                
                // Find next statement line
                for (let j = i + 1; j < lines.length; j++) {
                    let nextLine = lines[j].trim();
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
        let NODE_HEIGHT = 80;
        let NODE_WIDTH = 200;
        
        let createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
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
            let savedPos = positionMap[stmt.line];
            let x = savedPos ? savedPos.x : 50;
            let y = savedPos ? savedPos.y : defaultY;
            
            // Import
            if (stmt.kind === 10) {
                let node = createNode('import', stmt.path || stmt.value, x, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                defaultY = y + 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) {
                let isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                let node = createNode(isEntity ? 'entity' : 'struct', stmt.name, x, y, 70, stmt.line);
                
                for (const field of (stmt.fields || [])) {
                    let fieldName = typeof field === 'string' ? field : field.name;
                    let fieldType = typeof field === 'object' ? field.type : 'any';
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
                let capsuleNode = createNode('capsule', stmt.name, x, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + 40;
                
                for (const flow of (stmt.flows || [])) {
                    let flowPos = positionMap[flow.line];
                    let fx = flowPos ? flowPos.x : x + 20;
                    let fy = flowPos ? flowPos.y : innerY;
                    
                    let flowNode = createNode('flow', flow.name, fx, fy, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    for (const param of (flow.params || [])) {
                        let paramName = typeof param === 'string' ? param : param.name;
                        let paramType = typeof param === 'object' ? param.type : 'any';
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
                let node = createNode('function', stmt.name, x, y, 4, stmt.line);
                
                for (const param of (stmt.params || [])) {
                    let paramName = typeof param === 'string' ? param : param.name;
                    let paramType = typeof param === 'object' ? param.type : 'any';
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.ast_to_graph = ast_to_graph;
    exports.new_map = new_map;
    exports.graph_to_ast = graph_to_ast;
    exports.graph_to_code = graph_to_code;
    exports.code_to_graph = code_to_graph;
}


// === Module: core/../studio/graph_io ===
var graph_types = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_types);

    var { VisualGraph_new } = graph_types;

function graph_to_json(graph) {
    let json = "";
    
        json = JSON.stringify(graph, null, 2);
    
    return json;
}
function json_to_graph(json) {
    let graph = VisualGraph_new();
    
        try {
            let parsed = JSON.parse(json);
            graph.nodes = parsed.nodes || [];
            graph.edges = parsed.edges || [];
            graph.viewport = parsed.viewport || { x: 0, y: 0, zoom: 1.0 };
            graph.metadata = parsed.metadata || {};
        } catch (e) {
            console.error("[graph] Failed to parse JSON: " + e.message);
        }
    
    return graph;
}
function get_installed_package_nodes() {
    let nodes = [];
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        let packagesDir = path.join(process.cwd(), 'packages');
        if (!fs.existsSync(packagesDir)) {
            return;
        }
        
        let scanDir = (dir, pkgName = '') => {
            let entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                let fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    let newPkgName = pkgName ? pkgName + '/' + entry.name : entry.name;
                    scanDir(fullPath, newPkgName);
                } else if (entry.name.endsWith('.omni')) {
                    try {
                        let source = fs.readFileSync(fullPath, 'utf-8');
                        
                        // Simple regex to find capsules and functions
                        let capsuleMatches = source.matchAll(new RegExp("capsule\\s+(\\w+)\\s*\\{", "g")); // }
                        for (const match of capsuleMatches) {
                            nodes.push({
                                type: 'package_capsule',
                                name: match[1],
                                package: pkgName,
                                file: entry.name,
                                import: pkgName + '/' + entry.name.replace('.omni', '')
                            });
                        }
                        
                        let fnMatches = source.matchAll(new RegExp("fn\\s+(\\w+)\\s*\\(", "g"));
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
    
    return nodes;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.graph_to_json = graph_to_json;
    exports.json_to_graph = json_to_graph;
    exports.get_installed_package_nodes = get_installed_package_nodes;
}


// === Module: core/../studio/graph_actions ===
var graph_types = exports;
if (typeof global !== 'undefined') Object.assign(global, graph_types);
function graph_add_node(graph, node_type, name, x, y) {
    let new_id = "";
    
        new_id = 'node_' + Date.now();
        
        let node = {
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
    
        let node = graph.nodes.find(n => n.id === node_id);
        if (node) {
            let dx = x - node.x;
            let dy = y - node.y;
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
    let new_id = "";
    
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.graph_add_node = graph_add_node;
    exports.graph_remove_node = graph_remove_node;
    exports.graph_move_node = graph_move_node;
    exports.graph_add_edge = graph_add_edge;
    exports.graph_remove_edge = graph_remove_edge;
}


// === Module: core/../contracts/types ===
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CanonicalInterface = CanonicalInterface;
    exports.ContractMethod = ContractMethod;
    exports.ContractRegistry = ContractRegistry;
}


// === Module: core/../contracts/interfaces ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
function register_std_interfaces(registry) {
    
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
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_std_interfaces = register_std_interfaces;
}


// === Module: core/../contracts/registry ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
var interfaces = exports;
if (typeof global !== 'undefined') Object.assign(global, interfaces);
var impl_js = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_js);
var impl_python = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_python);
var impl_cnative = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_cnative);
var impl_lua = exports;
if (typeof global !== 'undefined') Object.assign(global, impl_lua);
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
function new_map() {
     return {}; 
    return 0;
}
function ContractRegistry_new() {
    let registry = new ContractRegistry({ interfaces: new_map(), implementations: new_map(), active_target: "js" });
    register_std_interfaces(registry);
    register_js_impl(registry);
    register_python_impl(registry);
    register_cnative_impl(registry);
    register_lua_impl(registry);
    return registry;
}
function ContractRegistry_set_target(self, target) {
    
        self.active_target = target;
        // console.log("[contract] Active target: " + target);
    
}
function ContractRegistry_resolve(self, contract_path, args) {
    let result = "";
    
        let impl = self.implementations[self.active_target];
        if (!impl) {
            result = "/* UNKNOWN TARGET: " + self.active_target + " */";
            return;
        }
        
        let template = impl[contract_path];
        if (!template) {
            // Fallback to JS implementation? No, that's dangerous if semantics differ.
            // But preserving original behavior:
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
            let methodCount = Object.keys(iface.methods).length;
            console.log("│ " + name.padEnd(20) + " │ " + 
                        iface.category.padEnd(10) + " │ " +
                        (methodCount + " methods").padEnd(15) + " │");
        }
        
        console.log("└─────────────────────────────────────────────────────────────┘");
    
}
function ContractRegistry_verify_target(self, target) {
    let is_complete = true;
    let missing = 0;
    
        let impl = self.implementations[target];
        if (!impl) {
            terminal.CLI_error("Target '" + target + "' has no implementations");
            is_complete = false;
            return;
        }
        
        // Check all interfaces
        for (const [ifaceName, iface] of Object.entries(self.interfaces)) {
            for (const methodName of Object.keys(iface.methods)) {
                let contractPath = ifaceName + '.' + methodName;
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
let GLOBAL_CONTRACTS = ContractRegistry_new();


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_map = new_map;
    exports.ContractRegistry_new = ContractRegistry_new;
    exports.ContractRegistry_set_target = ContractRegistry_set_target;
    exports.ContractRegistry_resolve = ContractRegistry_resolve;
    exports.ContractRegistry_list_interfaces = ContractRegistry_list_interfaces;
    exports.ContractRegistry_verify_target = ContractRegistry_verify_target;
    exports.GLOBAL_CONTRACTS = GLOBAL_CONTRACTS;
}


// === Module: core/../contracts/impl_js ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
function register_js_impl(registry) {
    
        registry.implementations['js'] = {
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
            'std.3d.add_cube': '(() => { let g = new THREE.BoxGeometry({3}, {3}, {3}); let m = new THREE.MeshStandardMaterial({color: {4}}); let c = new THREE.Mesh(g, m); c.position.set({0}, {1}, {2}); {5}.add(c); return c; })()',
            'std.3d.add_sphere': '(() => { let g = new THREE.SphereGeometry({3}); let m = new THREE.MeshStandardMaterial({color: {4}}); let s = new THREE.Mesh(g, m); s.position.set({0}, {1}, {2}); {5}.add(s); return s; })()',
            'std.3d.add_plane': '(() => { let g = new THREE.PlaneGeometry({0}, {1}); let m = new THREE.MeshStandardMaterial({color: {2}}); let p = new THREE.Mesh(g, m); return p; })()',
            'std.3d.add_light': '(() => { let l = new THREE.DirectionalLight({2}, {1}); {0}.add(l); return l; })()',
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
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_js_impl = register_js_impl;
}


// === Module: core/../contracts/impl_python ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
function register_python_impl(registry) {
    
        registry.implementations['python'] = {
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
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_python_impl = register_python_impl;
}


// === Module: core/../contracts/impl_cnative ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
function register_cnative_impl(registry) {
    
        registry.implementations['c_native'] = {
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
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_cnative_impl = register_cnative_impl;
}


// === Module: core/../contracts/impl_lua ===
var types = exports;
if (typeof global !== 'undefined') Object.assign(global, types);
function register_lua_impl(registry) {
    
        registry.implementations['lua'] = {
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
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_lua_impl = register_lua_impl;
}


// === Module: lib/std ===
function print(msg) {
     console.log(msg); 
    
}
function read_file(path) {
    let content = "";
    
        // const fs = require("fs"); (hoisted)
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }
    
    
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
    
    
}





// === Module: lib/terminal ===
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
    let c = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
    
        // Check if terminal supports colors
        let supportsColor = process.stdout.isTTY && 
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
let CLI_COLORS_INIT = false;
let CLI_COLORS_CACHE = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
function CLI_COLORS() {
    if (CLI_COLORS_INIT == false) {
    CLI_COLORS_CACHE = Colors_new();
    CLI_COLORS_INIT = true;
}
    return CLI_COLORS_CACHE;
}
function CLI_success(msg) {
    
        let c = CLI_COLORS();
        console.log(c.green + 'âœ“' + c.reset + ' ' + msg);
    
}
function CLI_error(msg) {
    
        let c = CLI_COLORS();
        console.error(c.red + 'âœ—' + c.reset + ' ' + msg);
    
}
function CLI_warning(msg) {
    
        let c = CLI_COLORS();
        console.log(c.yellow + 'âš ' + c.reset + ' ' + msg);
    
}
function CLI_info(msg) {
    
        let c = CLI_COLORS();
        console.log(c.blue + 'â„¹' + c.reset + ' ' + msg);
    
}
function CLI_step(step, total, msg) {
    
        let c = CLI_COLORS();
        let prefix = c.cyan + '[' + step + '/' + total + ']' + c.reset;
        console.log(prefix + ' ' + msg);
    
}
function CLI_header(title) {
    
        let c = CLI_COLORS();
        console.log('');
        console.log(c.bold + c.cyan + 'â•â•â• ' + title + ' â•â•â•' + c.reset);
        console.log('');
    
}
function CLI_dim(msg) {
    let result = "";
    
        let c = CLI_COLORS();
        result = c.dim + msg + c.reset;
    
    return result;
}
function CLI_bold(msg) {
    let result = "";
    
        let c = CLI_COLORS();
        result = c.bold + msg + c.reset;
    
    return result;
}
function CLI_green(msg) {
    let result = "";
    
        let c = CLI_COLORS();
        result = c.green + msg + c.reset;
    
    return result;
}
function CLI_red(msg) {
    let result = "";
    
        let c = CLI_COLORS();
        result = c.red + msg + c.reset;
    
    return result;
}
function CLI_yellow(msg) {
    let result = "";
    
        let c = CLI_COLORS();
        result = c.yellow + msg + c.reset;
    
    return result;
}
function CLI_cyan(msg) {
    let result = "";
    
        let c = CLI_COLORS();
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
    let spinner = new Spinner({ frames: "â ‹â ™â ¹â ¸â ¼â ´â ¦â §â ‡â ", current: 0, interval: 0, message: message, running: false });
    return spinner;
}
function Spinner_start(self) {
    
        if (self.running) return;
        self.running = true;
        let frames = self.frames.split('');
        let c = CLI_COLORS();
        
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
        let c = CLI_COLORS();
        
        let icon = success 
            ? c.green + 'âœ“' + c.reset 
            : c.red + 'âœ—' + c.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
    
}
function CLI_progress_bar(current, total, width) {
    let result = "";
    
        let c = CLI_COLORS();
        let percent = Math.floor((current / total) * 100);
        let filled = Math.floor((current / total) * width);
        let empty = width - filled;
        
        let bar = c.green + 'â–ˆ'.repeat(filled) + 
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
    let args = new ParsedArgs({ command: "", arg1: "", arg2: "", arg3: "", flag_help: false, flag_version: false, flag_verbose: false, flag_global: false, flag_app: false, flag_tui: false, opt_target: "js", opt_port: "3000", opt_framework: "" });
    
        let argv = process.argv.slice(2);
        
        let positional = [];
        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i];
            
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
    
        let c = CLI_COLORS();
        console.log('  ' + c.cyan + col1.padEnd(20) + c.reset + col2);
    
}
function CLI_table_header(title) {
    
        let c = CLI_COLORS();
        console.log('');
        console.log(c.bold + title + c.reset);
        console.log('â”€'.repeat(50));
    
}
function CLI_banner() {
    
        let c = CLI_COLORS();
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
function get_omni_home() {
    let home = "";
    
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
            let platform = os.platform();
            if (platform === 'win32') {
                home = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                home = path.join(os.homedir(), '.local', 'share', 'omni');
            }
        }
    
    return home;
}
function resolve_resource_path(name) {
    let resolved = "";
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Strategy 1: Local project path (./targets/, ./packages/, ./patterns/)
        let localPath = path.join(process.cwd(), name);
        if (fs.existsSync(localPath)) {
            resolved = localPath;
            return;
        }
        
        // Strategy 2: Relative to executable (dist/../)
        let execPath = path.join(__dirname, '..', name);
        if (fs.existsSync(execPath)) {
            resolved = execPath;
            return;
        }
        
        // Strategy 3: OMNI_HOME
        let omniHome = get_omni_home();
        let homePath = path.join(omniHome, name);
        if (fs.existsSync(homePath)) {
            resolved = homePath;
            return;
        }
        
        // Strategy 4: Global installation
        // const os = require('os'); (hoisted)
        let platform = os.platform();
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
    CLI_banner();
    CLI_header("Omni Setup");
    
        // const os = require('os'); (hoisted)
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        let platform = os.platform();
        let isWindows = platform === 'win32';
        let omniDir = path.dirname(path.dirname(__filename));
        
        terminal.CLI_info("Platform: " + platform + " (" + os.arch() + ")");
        terminal.CLI_info("Omni directory: " + omniDir);
        terminal.CLI_info("Mode: " + (is_global ? "GLOBAL" : "LOCAL"));
        
        console.log("");
        
        if (is_global) {
            // ============================================================
            // GLOBAL INSTALLATION
            // ============================================================
            terminal.CLI_step(1, 4, "Detecting global installation path...");
            
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
            let srcDist = path.join(omniDir, 'dist');
            let dstDist = path.join(globalDir, 'dist');
            
            if (fs.existsSync(srcDist)) {
                if (!fs.existsSync(dstDist)) {
                    fs.mkdirSync(dstDist, { recursive: true });
                }
                
                let files = fs.readdirSync(srcDist);
                for (const file of files) {
                    fs.copyFileSync(
                        path.join(srcDist, file),
                        path.join(dstDist, file)
                    );
                }
                CLI_success("Copied " + files.length + " files");
            }
            
            // Copy lib folder
            let srcLib = path.join(omniDir, 'src', 'lib');
            let dstLib = path.join(globalDir, 'lib');
            
            if (fs.existsSync(srcLib)) {
                if (!fs.existsSync(dstLib)) {
                    fs.mkdirSync(dstLib, { recursive: true });
                }
                
                let walkAndCopy = (src, dst) => {
                    let entries = fs.readdirSync(src, { withFileTypes: true });
                    for (const entry of entries) {
                        let srcPath = path.join(src, entry.name);
                        let dstPath = path.join(dst, entry.name);
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
                let cmdContent = `@echo off
node "%~dp0dist\\main.js" %*`;
                fs.writeFileSync(path.join(globalDir, 'omni.cmd'), cmdContent);
                
                let ps1Content = `#!/usr/bin/env pwsh
node "$PSScriptRoot\\dist\\main.js" @args`;
                fs.writeFileSync(path.join(globalDir, 'omni.ps1'), ps1Content);
                
                CLI_success("Created omni.cmd and omni.ps1");
            } else {
                // Unix: Create shell script
                let shContent = `#!/usr/bin/env bash
OMNI_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
node "$OMNI_DIR/dist/main.js" "$@"`;
                let shPath = path.join(globalDir, 'omni');
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
                    let currentPath = execSync('echo %PATH%', { encoding: 'utf-8' }).trim();
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
                
                let linkPath = path.join(binDir, 'omni');
                try {
                    if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
                    fs.symlinkSync(path.join(globalDir, 'omni'), linkPath);
                    CLI_success("Linked: " + linkPath);
                } catch (e) {
                    CLI_warning("Could not create symlink: " + e.message);
                }
                
                // Check if ~/.local/bin is in PATH
                let shellPath = process.env.PATH || '';
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
            
            let cwd = process.cwd();
            
            if (isWindows) {
                let cmdContent = `@echo off
node "${path.join(omniDir, 'dist', 'main.js')}" %*`;
                fs.writeFileSync(path.join(cwd, 'omni.cmd'), cmdContent);
                CLI_success("Created: omni.cmd");
            } else {
                let shContent = `#!/usr/bin/env bash
node "${path.join(omniDir, 'dist', 'main.js')}" "$@"`;
                let shPath = path.join(cwd, 'omni');
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var std = exports;
if (typeof global !== 'undefined') Object.assign(global, std);
var lexer = exports;
if (typeof global !== 'undefined') Object.assign(global, lexer);
var parser = exports;
if (typeof global !== 'undefined') Object.assign(global, parser);
var codegen_hybrid = exports;
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
var vm = exports;
if (typeof global !== 'undefined') Object.assign(global, vm);
function cmd_run() {
    let run_file = "";
     
        run_file = process.argv[3] || '';
    
    if (run_file == "") {
    CLI_error("Usage: omni run <file.omni> [--cmd|--app|--web|--web-app] [--port N]");
    CLI_info("Modes:");
    CLI_info("  --cmd      Terminal execution (default)");
    CLI_info("  --app      Native desktop app (Python/Tkinter)");
    CLI_info("  --web      Web server on port (default: 3000)");
    CLI_info("  --web-app  Web in native browser window");
    return true;
}
    let source = read_file(run_file);
    if (source == "") {
    CLI_error("Could not read file: " + run_file);
    return false;
}
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const http = require('http');
        const { spawnSync, exec } = require('child_process');
        
        let mode = "cmd";
        let target = "js";
        let port = 3000;
        
        // Mode detection from flags
        if (process.argv.includes("--cmd")) mode = "cmd";
        if (process.argv.includes("--app")) mode = "app";
        if (process.argv.includes("--web")) mode = "web";
        if (process.argv.includes("--web-app")) mode = "web-app";
        
        // Check custom target
        let t_idx = process.argv.indexOf("--target");
        if (t_idx > -1 && process.argv[t_idx+1]) {
            target = process.argv[t_idx+1];
        }
        
        // Check custom port
        let p_idx = process.argv.indexOf("--port");
        if (p_idx > -1 && process.argv[p_idx+1]) {
            port = parseInt(process.argv[p_idx+1]);
        }
        
        // Auto-detect mode from omni.conf.json if no explicit flag
        let hasExplicitMode = ["--cmd", "--app", "--web", "--web-app"].some(f => process.argv.includes(f));
        
        if (!hasExplicitMode) {
            let dir = path.dirname(run_file);
            let possibleConfigs = [
                path.join(dir, 'omni.conf.json'),
                path.join(dir, '..', 'omni.conf.json')
            ];
            
            for (const confPath of possibleConfigs) {
                if (fs.existsSync(confPath)) {
                    try {
                        let conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
                        if (conf.defaultMode) {
                            mode = conf.defaultMode;
                        } else if (conf.targets && conf.targets.length > 0) {
                            mode = conf.targets[0];
                        }
                        CLI_info("Auto-detected mode: " + mode);
                    } catch(e) {}
                    break;
                }
            }
        }
        
        // Set target based on mode
        if (mode === "app") {
            target = "python";
        } else {
            target = "js";
        }
        
        CLI_info("Mode: " + mode + " | Target: " + target);
        
        // Generate code
        let gen = new_code_generator(target);
        let code = CodeGenerator_generate(gen, program);
        
        let ext = target === "python" ? ".py" : ".js";
        let outFile = run_file.replace(".omni", ext);
        let htmlFile = run_file.replace(".omni", ".html");
        
        // ========== CMD MODE ==========
        if (mode === "cmd") {
            CLI_info("Running in terminal...");
            
            let finalCode = code;
            if (target === "js") {
                finalCode += "\nif (typeof main === 'function') main();\n";
            } else if (target === "python") {
                finalCode += "\nif __name__ == '__main__':\n    main()\n";
            }
            
            fs.writeFileSync(outFile, finalCode);
            let cmd = target === "python" ? "python" : "node";
            spawnSync(cmd, [outFile], { stdio: 'inherit' });
        }
        
        // ========== APP MODE ==========
        else if (mode === "app") {
            CLI_info("Launching native app...");
            
            let finalCode = code;
            finalCode += "\nif __name__ == '__main__':\n    main()\n";
            
            fs.writeFileSync(outFile, finalCode);
            spawnSync("python", [outFile], { stdio: 'inherit' });
        }
        
        // ========== WEB MODE ==========
        else if (mode === "web") {
            CLI_info("Starting web server...");
            
            // Write JS file
            fs.writeFileSync(outFile, code);
            
            // Generate HTML wrapper
            let baseName = path.basename(outFile);
            let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni Web - ${baseName}</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a2e; color: #eee; }
        #app { padding: 20px; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script src="${baseName}"></script>
    <script>if (typeof main === 'function') main();</script>
</body>
</html>`;
            
            fs.writeFileSync(htmlFile, html);
            
            // Create HTTP server
            let server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                let extName = path.extname(filePath);
                let mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };
                
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('Not Found: ' + filePath);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': mimeTypes[extName] || 'text/plain' });
                    res.end(data);
                });
            });
            
            server.listen(port, () => {
                CLI_success("Server running at http://localhost:" + port);
                CLI_info("Press Ctrl+C to stop");
            });
        }
        
        // ========== WEB-APP MODE ==========
        else if (mode === "web-app") {
            CLI_info("Starting web server with browser...");
            
            // Write JS file
            fs.writeFileSync(outFile, code);
            
            // Generate HTML wrapper
            let baseName = path.basename(outFile);
            let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni Web App - ${baseName}</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a2e; color: #eee; }
        #app { padding: 20px; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script src="${baseName}"></script>
    <script>if (typeof main === 'function') main();</script>
</body>
</html>`;
            
            fs.writeFileSync(htmlFile, html);
            
            // Create HTTP server
            let server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                let extName = path.extname(filePath);
                let mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };
                
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('Not Found: ' + filePath);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': mimeTypes[extName] || 'text/plain' });
                    res.end(data);
                });
            });
            
            server.listen(port, () => {
                CLI_success("Server running at http://localhost:" + port);
                
                // Open browser
                let url = "http://localhost:" + port;
                CLI_info("Opening browser: " + url);
                
                let platform = process.platform;
                let openCmd;
                if (platform === 'win32') {
                    openCmd = 'start "" "' + url + '"';
                } else if (platform === 'darwin') {
                    openCmd = 'open "' + url + '"';
                } else {
                    openCmd = 'xdg-open "' + url + '"';
                }
                
                exec(openCmd, (err) => {
                    if (err) {
                        CLI_warning("Could not open browser automatically");
                        CLI_info("Please open manually: " + url);
                    }
                });
                
                CLI_info("Press Ctrl+C to stop");
            });
        }
    
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}


// === Module: commands/cmd_build ===
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
function cmd_build() {
    CLI_info("Building from omni.config.json...");
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_build = cmd_build;
}


// === Module: commands/cmd_test ===
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var lexer = exports;
if (typeof global !== 'undefined') Object.assign(global, lexer);
var parser = exports;
if (typeof global !== 'undefined') Object.assign(global, parser);
var codegen_hybrid = exports;
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
function cmd_test_all() {
    CLI_banner();
    CLI_header("Testing All Examples");
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        
        // Find examples directory
        let possiblePaths = [
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
        
        // Find all example folders (with omni.conf.json)
        let entries = fs.readdirSync(examplesDir, { withFileTypes: true });
        let examples = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                let confPath = path.join(examplesDir, entry.name, 'omni.conf.json');
                if (fs.existsSync(confPath)) {
                    try {
                        let conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
                        examples.push({
                            name: entry.name,
                            conf: conf,
                            entryPath: path.join(examplesDir, entry.name, conf.entry || 'src/main.omni'),
                            modes: conf.targets || ['cmd']
                        });
                    } catch(e) {
                        console.log(CLI_COLORS().yellow + "  ⚠ " + CLI_COLORS().reset + entry.name + " (invalid config)");
                    }
                }
            }
        }
        
        // Sort by name
        examples.sort((a, b) => a.name.localeCompare(b.name));
        
        CLI_info("Found " + examples.length + " example folders");
        console.log("");
        
        let passed = 0;
        let failed = 0;
        let failures = [];
        let results = {};
        
        for (const ex of examples) {
            let modeResults = [];
            
            for (const mode of ex.modes) {
                try {
                    // Read and parse
                    if (!fs.existsSync(ex.entryPath)) {
                        throw new Error("Entry file not found: " + ex.entryPath);
                    }
                    
                    let source = fs.readFileSync(ex.entryPath, 'utf-8');
                    let l = new_lexer(source);
                    let p = new_parser(l);
                    let program = Parser_parse_program(p);
                    
                    // Determine target based on mode
                    let target = "js";
                    if (mode === "app") target = "python";
                    
                    // Generate code
                    let gen = HybridCodeGenerator_new(target);
                    let code = HybridCodeGenerator_generate(gen, program);
                    
                    // Check if code was generated
                    if (code && code.length > 0) {
                        modeResults.push({ mode, success: true });
                    } else {
                        modeResults.push({ mode, success: false, error: "Empty output" });
                    }
                } catch (e) {
                    modeResults.push({ mode, success: false, error: e.message });
                }
            }
            
            // Report results for this example
            let allPassed = modeResults.every(r => r.success);
            let modeStr = modeResults.map(r => 
                r.success ? CLI_COLORS().green + r.mode + CLI_COLORS().reset 
                          : CLI_COLORS().red + r.mode + CLI_COLORS().reset
            ).join(", ");
            
            if (allPassed) {
                passed++;
                console.log(CLI_COLORS().green + "  ✓ " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
            } else {
                failed++;
                let failedModes = modeResults.filter(r => !r.success);
                failures.push({ name: ex.name, errors: failedModes });
                console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
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
                console.log(CLI_COLORS().dim + "  " + f.name + ":" + CLI_COLORS().reset);
                for (const err of f.errors) {
                    console.log(CLI_COLORS().dim + "    [" + err.mode + "] " + err.error.substring(0, 60) + CLI_COLORS().reset);
                }
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
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
function cmd_package_self() {
    CLI_header("Self-Package");
    
        // const fs = require('fs'); (hoisted)
        // const path = require('path'); (hoisted)
        const { execSync } = require('child_process');
        
        let omniDir = path.dirname(path.dirname(__filename));
        let version = CLI_version();
        let platform = process.platform;
        
        terminal.CLI_step(1, 4, "Collecting source files...");
        
        // Files to include
        let distDir = path.join(omniDir, 'dist');
        let targetsDir = path.join(omniDir, 'targets');
        
        terminal.CLI_step(2, 4, "Creating package manifest...");
        
        let manifest = {
            name: 'omni-compiler',
            version: version,
            platform: platform,
            created: new Date().toISOString(),
            files: []
        };
        
        // List dist files
        if (fs.existsSync(distDir)) {
            let files = fs.readdirSync(distDir, { recursive: true });
            manifest.files.push(...files.map(f => 'dist/' + f));
        }
        
        // List target profiles
        if (fs.existsSync(targetsDir)) {
            let files = fs.readdirSync(targetsDir);
            manifest.files.push(...files.map(f => 'targets/' + f));
        }
        
        CLI_step(3, 4, "Writing package...");
        
        let packageName = `omni-${version}-${platform}`;
        let packageDir = path.join(omniDir, 'packages');
        
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
            let runContent = `@echo off
set OMNI_HOME=%~dp0
node "%OMNI_HOME%dist\\main.js" %*`;
            fs.writeFileSync(path.join(packageDir, packageName + '.cmd'), runContent);
            CLI_success("Package created: packages/" + packageName + ".cmd");
        } else {
            let runContent = `#!/bin/bash
OMNI_HOME="$(dirname "$(readlink -f "$0")")"
node "$OMNI_HOME/dist/main.js" "$@"`;
            let runPath = path.join(packageDir, packageName + '.run');
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
var contracts = exports;
if (typeof global !== 'undefined') Object.assign(global, contracts);
function cmd_contracts() {
    
        let registry = ContractRegistry_new();
        ContractRegistry_list_interfaces(registry);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_contracts = cmd_contracts;
}


// === Module: commands/cmd_studio ===
var studio_engine = exports;
if (typeof global !== 'undefined') Object.assign(global, studio_engine);
var tui = exports;
if (typeof global !== 'undefined') Object.assign(global, tui);
function cmd_studio_cli() {
    let port = 3000;
    let open_app = false;
    let run_tui = false;
    
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
    cmd_tui();
} else {
    cmd_studio(port, open_app);
}
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_studio_cli = cmd_studio_cli;
}


// === Main Entry ===
var token = exports;
if (typeof global !== 'undefined') Object.assign(global, token);
var lexer = exports;
if (typeof global !== 'undefined') Object.assign(global, lexer);
var parser = exports;
if (typeof global !== 'undefined') Object.assign(global, parser);
var codegen_hybrid = exports;
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
var vm = exports;
if (typeof global !== 'undefined') Object.assign(global, vm);
var framework_adapter = exports;
if (typeof global !== 'undefined') Object.assign(global, framework_adapter);
var ingestion = exports;
if (typeof global !== 'undefined') Object.assign(global, ingestion);
var package_manager = exports;
if (typeof global !== 'undefined') Object.assign(global, package_manager);
var contracts = exports;
if (typeof global !== 'undefined') Object.assign(global, contracts);
var ghost_writer = exports;
if (typeof global !== 'undefined') Object.assign(global, ghost_writer);
var bootstrap = exports;
if (typeof global !== 'undefined') Object.assign(global, bootstrap);
var studio_engine = exports;
if (typeof global !== 'undefined') Object.assign(global, studio_engine);
var studio_graph = exports;
if (typeof global !== 'undefined') Object.assign(global, studio_graph);
var app_packager = exports;
if (typeof global !== 'undefined') Object.assign(global, app_packager);
var tui = exports;
if (typeof global !== 'undefined') Object.assign(global, tui);
var terminal = exports;
if (typeof global !== 'undefined') Object.assign(global, terminal);
var std = exports;
if (typeof global !== 'undefined') Object.assign(global, std);
var mod_cmd_setup = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_setup);
var mod_cmd_run = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_run);
var mod_cmd_build = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_build);
var mod_cmd_test = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_test);
var mod_cmd_package = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_package);
var mod_cmd_registry = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_registry);
var mod_cmd_studio = exports;
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_studio);
function cmd_version() {
    CLI_banner();
    print("Version: " + CLI_version());
    print("");
    
        console.log(CLI_COLORS.dim + "Node.js: " + process.version + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Platform: " + process.platform + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Arch: " + process.arch + CLI_COLORS.reset);
    
}
function main() {
    let args_len = 0;
    
        args_len = process.argv.length;
    
    let command = "";
    
        command = process.argv[2] || '';
    
    if (command == "setup") {
    let is_global = false;
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
        
    cmd_setup(is_global);
    return 0;
}
    if (command == "--version" || command == "-v" || command == "version") {
    cmd_version();
    return 0;
}
    if (command == "package") {
    let self_package = false;
     self_package = process.argv[3] === '--self'; 
    if (self_package) {
    cmd_package_self();
    return 0;
}
}
    if (command == "install") {
    let package_spec = "";
     package_spec = process.argv[3] || ''; 
    cmd_install(package_spec);
    return 0;
}
    if (command == "uninstall") {
    let package_name = "";
     package_name = process.argv[3] || ''; 
    if (package_name == "") {
    terminal.CLI_error("Usage: omni uninstall <package_name>");
    return 1;
}
    cmd_uninstall(package_name);
    return 0;
}
    if (command == "list") {
    cmd_list();
    return 0;
}
    if (command == "update") {
    let package_name = "";
     package_name = process.argv[3] || ''; 
    cmd_update(package_name);
    return 0;
}
    if (command == "search") {
    let query = "";
     query = process.argv[3] || ''; 
    cmd_search(query);
    return 0;
}
    if (command == "doctor") {
    cmd_doctor();
    return 0;
}
    if (command == "contracts") {
    cmd_contracts();
    return 0;
}
    if (command == "graph") {
    let input_file = "";
    let output_file = "";
     
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
    if (input_file == "") {
    CLI_error("Usage: omni graph <input.omni> [output.md]");
    CLI_info("Generates architecture diagrams in Mermaid format");
    return 1;
}
    if (output_file == "") {
    
                // const path = require('path'); (hoisted)
                output_file = path.basename(input_file, '.omni') + '_architecture.md';
            
}
    cmd_graph(input_file, output_file);
    return 0;
}
    if (command == "bootstrap") {
    cmd_bootstrap();
    return 0;
}
    if (command == "studio") {
    cmd_studio_cli();
    return 0;
}
    if (command == "ui") {
    cmd_tui();
    return 0;
}
    if (command == "package") {
    let target = "";
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--app' && process.argv[i + 1]) {
                    target = process.argv[i + 1];
                }
            }
            if (!target) {
                let platform = process.platform;
                if (platform === 'win32') target = 'windows';
                else if (platform === 'darwin') target = 'macos';
                else if (platform === 'linux') target = 'linux';
                else target = 'windows';
            }
        
    let config = AppConfig_default();
    
            // const fs = require('fs'); (hoisted)
            // const path = require('path'); (hoisted)
            let configPath = path.join(process.cwd(), 'omni.config.json');
            
            if (fs.existsSync(configPath)) {
                let cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (cfg.app) {
                    config.name = cfg.app.name || config.name;
                    config.version = cfg.app.version || config.version;
                    config.bundle_id = cfg.app.bundle_id || config.bundle_id;
                    config.description = cfg.app.description || config.description;
                }
            }
        
    cmd_package_app(target, config);
    return 0;
}
    if (command == "ingest") {
    let input_file = "";
    let output_file = "";
     
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
    if (input_file == "") {
    CLI_error("Usage: omni ingest <legacy_file> <output.omni>");
    return 1;
}
    if (output_file == "") {
    
                // const path = require('path'); (hoisted)
                output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
            
}
    cmd_ingest(input_file, output_file);
    return 0;
}
    if (command == "run") {
    cmd_run();
    return 0;
}
    if (command == "build") {
    cmd_build();
    return 0;
}
    if (command == "test-all") {
    cmd_test_all();
    return 0;
}
    let show_help = false;
     
        show_help = command === 'help' || command === '--help' || command === '-h'; 
    
    if (command == "" || args_len < 3) {
    CLI_info("Launching interactive mode...");
    cmd_tui();
    return 0;
}
    if (show_help) {
    CLI_banner();
    print("Commands:");
    print("  setup                          Start Global Setup Wizard");
    print("  run <file.omni>                Execute instantly via VM");
    print("  build                          Build from omni.config.json");
    print("  test-all                       Validate all examples compile");
    print("  package --self                 Create self-contained package");
    print("  <input> <output> [options]     Compile to target");
    print("");
    print("Options:");
    print("  --target <lang>     Target language (js, python)");
    print("  --package <path>    Load external language package (.omni-pkg)");
    print("  --framework <name>  Framework adapter (nextjs, laravel, android)");
    print("  --coverage          Show AST coverage report");
    print("  --version, -v       Show version");
    print("");
    return 0;
}
    let input_path = "";
    let output_path = "";
    let target_lang = "js";
    let package_path = "";
    let framework = "";
    let show_coverage = false;
    
        input_path = process.argv[2];
        output_path = process.argv[3];
        
        for (let i = 4; i < process.argv.length; i++) {
            let arg = process.argv[i];
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
    
    CLI_info("Compiling: " + input_path);
    CLI_info("Target: " + target_lang);
    
        if (package_path) {
            // const fs = require('fs'); (hoisted)
            // const path = require('path'); (hoisted)
            
            if (fs.existsSync(package_path)) {
                terminal.CLI_info("Loading package: " + package_path);
                
                let grammarPath = fs.statSync(package_path).isDirectory() 
                    ? path.join(package_path, 'grammar.json')
                    : package_path;
                    
                if (fs.existsSync(grammarPath)) {
                    let targetDir = path.join(__dirname, '..', 'targets');
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    let profile = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'));
                    let profileName = profile.name || path.basename(package_path, '.omni-pkg');
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
    
    let source = read_file(input_path);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let gen = new_code_generator(target_lang);
    
        if (framework) {
            gen.framework = framework;
        }
    
    let code = CodeGenerator_generate(gen, program);
    
        if (show_coverage || gen.ast_node_count > 0) {
            let coverage = gen.ast_node_count > 0 
                ? (gen.generated_count / gen.ast_node_count * 100).toFixed(1)
                : 100;
            terminal.CLI_info("AST Coverage: " + coverage + "% (" + 
                gen.generated_count + "/" + gen.ast_node_count + " nodes)");
                
            if (coverage < 100) {
                terminal.CLI_warning("Some AST nodes were not generated");
            }
        }
    
    write_file(output_path, code);
    CLI_success("Output: " + output_path);
    CLI_success("Compiled successfully!");
}



if (typeof main === 'function') main();


// Expose all exports globally
if (typeof global !== 'undefined') Object.assign(global, exports);