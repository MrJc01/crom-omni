'use strict';
// Omni Compiler Bundle
// Global Header: Core Node.js dependencies
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');




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
}
 else {
    l.ch = char_at(l.input, l.read_position);
}

    let is_eof = false;
is_eof = l.ch === "\0";
    if (is_eof) {
    l.ch = "\0";
}
 else {
    l.position = l.read_position;
    l.read_position = l.read_position + 1;
}

}

function Lexer_skip_whitespace(l) {
    let should_skip = false;
const code = l.ch.charCodeAt(0);
        should_skip = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r' || code > 127;
    while (should_skip) {
    if (l.ch === "\n") {
    l.line = l.line + 1;
}

    Lexer_read_char(l);
const code = l.ch.charCodeAt(0);
            should_skip = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r' || code > 127;
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

    if (l.ch === ".") {
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
    if (ident === "fn") {
    return TOKEN_FN;
}

    if (ident === "let") {
    return TOKEN_LET;
}

    if (ident === "struct") {
    return TOKEN_STRUCT;
}

    if (ident === "if") {
    return TOKEN_IF;
}

    if (ident === "else") {
    return TOKEN_ELSE;
}

    if (ident === "return") {
    return TOKEN_RETURN;
}

    if (ident === "true") {
    return TOKEN_TRUE;
}

    if (ident === "false") {
    return TOKEN_FALSE;
}

    if (ident === "native") {
    return TOKEN_NATIVE;
}

    if (ident === "import") {
    return 90;
}

    if (ident === "package") {
    return 91;
}

    if (ident === "export") {
    return 92;
}

    if (ident === "while") {
    return TOKEN_WHILE;
}

    return TOKEN_IDENTIFIER;
}

function Lexer_next_token(l) {
    Lexer_skip_whitespace(l);
    if (l.ch === "/") {
    let peek = char_at(l.input, l.read_position);
    if (peek === "/") {
    while (l.ch !== "\n" && l.ch !== "\0") {
    Lexer_read_char(l);
}

    Lexer_skip_whitespace(l);
}

}

    let tok = new_token(TOKEN_ILLEGAL, l.ch, l.line);
    tok.start = l.position;
    if (l.ch === "\0") {
    tok.kind = TOKEN_EOF;
    tok.lexeme = "";
    return tok;
}

    if (l.ch === "=") {
    let peek_eq = char_at(l.input, l.read_position);
    if (peek_eq === "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_EQ;
    tok.lexeme = "==";
}
 else {
    tok.kind = TOKEN_ASSIGN;
    tok.lexeme = "=";
}

}
 else {
    if (l.ch === "!") {
    let peek_bang = char_at(l.input, l.read_position);
    if (peek_bang === "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_NOT_EQ;
    tok.lexeme = "!=";
}
 else {
    tok.kind = TOKEN_BANG;
    tok.lexeme = "!";
}

}
 else {
    if (l.ch === ";") {
    tok.kind = TOKEN_SEMICOLON;
    tok.lexeme = ";";
}
 else {
    if (l.ch === "(") {
    tok.kind = TOKEN_LPAREN;
    tok.lexeme = "(";
}
 else {
    if (l.ch === ")") {
    tok.kind = TOKEN_RPAREN;
    tok.lexeme = ")";
}
 else {
    if (l.ch === "{") {
    tok.kind = TOKEN_LBRACE;
    tok.lexeme = "{";
}
 else {
    if (l.ch === "}") {
    tok.kind = TOKEN_RBRACE;
    tok.lexeme = "}";
}
 else {
    if (l.ch === ",") {
    tok.kind = TOKEN_COMMA;
    tok.lexeme = ",";
}
 else {
    if (l.ch === ":") {
    tok.kind = 30;
    tok.lexeme = ":";
}
 else {
    if (l.ch === ".") {
    tok.kind = 31;
    tok.lexeme = ".";
}
 else {
    if (l.ch === "[") {
    tok.kind = TOKEN_LBRACKET;
    tok.lexeme = "[";
}
 else {
    if (l.ch === "]") {
    tok.kind = TOKEN_RBRACKET;
    tok.lexeme = "]";
}
 else {
    if (l.ch === "+") {
    tok.kind = TOKEN_PLUS;
    tok.lexeme = "+";
}
 else {
    if (l.ch === "-") {
    let peek_arrow = char_at(l.input, l.read_position);
    if (peek_arrow === ">") {
    Lexer_read_char(l);
    tok.kind = 99;
    tok.lexeme = "->";
}
 else {
    tok.kind = TOKEN_MINUS;
    tok.lexeme = "-";
}

}
 else {
    if (l.ch === "*") {
    tok.kind = TOKEN_ASTERISK;
    tok.lexeme = "*";
}
 else {
    if (l.ch === "/") {
    let peek_slash = char_at(l.input, l.read_position);
    if (peek_slash === "/") {
    Lexer_read_char(l);
    Lexer_read_char(l);
    while (l.ch !== "\n" && l.ch !== "\0") {
    Lexer_read_char(l);
}

    return Lexer_next_token(l);
}
 else {
    tok.kind = TOKEN_SLASH;
    tok.lexeme = "/";
}

}
 else {
    if (is_quote(l.ch)) {
    let str_val = "";
    Lexer_read_char(l);
    let start = l.position;
    while (is_quote(l.ch) === false) {
    Lexer_read_char(l);
}

    let end = l.position;
str_val = l.input.substring(Number(start), Number(end));
    tok.kind = TOKEN_STRING;
    tok.lexeme = str_val;
}
 else {
    if (l.ch === "&") {
    let peek_and = char_at(l.input, l.read_position);
    if (peek_and === "&") {
    Lexer_read_char(l);
    tok.kind = TOKEN_AND;
    tok.lexeme = "&&";
}
 else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "&";
}

}
 else {
    if (l.ch === "|") {
    let peek_or = char_at(l.input, l.read_position);
    if (peek_or === "|") {
    Lexer_read_char(l);
    tok.kind = TOKEN_OR;
    tok.lexeme = "||";
}
 else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "|";
}

}
 else {
    if (l.ch === "<") {
    let peek_lt = char_at(l.input, l.read_position);
    if (peek_lt === "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_LE;
    tok.lexeme = "<=";
}
 else {
    tok.kind = TOKEN_LT;
    tok.lexeme = "<";
}

}
 else {
    if (l.ch === "@") {
    tok.kind = 95;
    tok.lexeme = "@";
}
 else {
    if (l.ch === ">") {
    let peek_gt = char_at(l.input, l.read_position);
    if (peek_gt === "=") {
    Lexer_read_char(l);
    tok.kind = TOKEN_GE;
    tok.lexeme = ">=";
}
 else {
    tok.kind = TOKEN_GT;
    tok.lexeme = ">";
}

}
 else {
    if (is_letter(l.ch)) {
    let literal = Lexer_read_identifier(l);
    tok.kind = Lexer_lookup_ident(literal);
    tok.lexeme = literal;
    return tok;
}
 else {
    if (is_digit(l.ch)) {
    tok.kind = TOKEN_INT;
    tok.lexeme = Lexer_read_number(l);
    return tok;
}
 else {
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
    while (p.cur_token.kind !== TOKEN_EOF) {
    let stmt = Parser_parse_statement(p);
    if (stmt !== 0) {
    if (stmt.kind !== 0) {
stmts.push(stmt);
}

}

}

    return new Program({ statements: stmts });
}

function Parser_parse_statement(p) {
    if (p.cur_token.kind === 95) {
    let decorators = [];
    while (p.cur_token.kind === 95) {
decorators.push(Parser_parse_decorator(p));
}

    let stmt = Parser_parse_statement(p);
if (stmt) stmt.decorators = decorators;
    return stmt;
}

    if (p.cur_token.kind === 92) {
    Parser_next_token(p);
    let stmt = Parser_parse_statement(p);
if (stmt) stmt.is_exported = true;
    return stmt;
}

    if (p.cur_token.kind === 91) {
    return Parser_parse_package(p);
}

    if (p.cur_token.kind === 90) {
    return Parser_parse_import(p);
}

    if (p.cur_token.kind === TOKEN_RBRACE) {
    Parser_next_token(p);
    return 0;
}

    if (p.cur_token.kind === TOKEN_IF) {
    return Parser_parse_if(p);
}

    if (p.cur_token.kind === TOKEN_WHILE) {
    return Parser_parse_while(p);
}

    if (p.cur_token.kind === TOKEN_LET) {
    return Parser_parse_let(p);
}

    if (p.cur_token.kind === TOKEN_FN) {
    return Parser_parse_fn(p);
}

    if (p.cur_token.kind === TOKEN_STRUCT) {
    return Parser_parse_struct(p);
}

    if (p.cur_token.kind === TOKEN_RETURN) {
    return Parser_parse_return(p);
}

    if (p.cur_token.kind === TOKEN_NATIVE) {
    return Parser_parse_native_block(p);
}

    return Parser_parse_expr_stmt(p);
}

function Parser_parse_import(p) {
    Parser_next_token(p);
    let path = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind === TOKEN_SEMICOLON) {
    Parser_next_token(p);
}

    return new ImportDecl({ kind: NODE_IMPORT, path: path });
}

function Parser_parse_package(p) {
    Parser_next_token(p);
    while (p.cur_token.kind !== TOKEN_SEMICOLON && p.cur_token.kind !== TOKEN_EOF) {
    Parser_next_token(p);
}

    if (p.cur_token.kind === TOKEN_SEMICOLON) {
    Parser_next_token(p);
}

    return 0;
}

function Parser_parse_let(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind === 30) {
    Parser_next_token(p);
    Parser_next_token(p);
}

    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if (p.cur_token.kind === TOKEN_SEMICOLON) {
    Parser_next_token(p);
}

    return new LetStmt({ kind: NODE_LET, name: name, value: val, is_exported: false });
}

function Parser_parse_return(p) {
    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if (p.cur_token.kind === TOKEN_SEMICOLON) {
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
    while (p.cur_token.kind !== TOKEN_RPAREN) {
params.push(p.cur_token.lexeme);
    Parser_next_token(p);
    if (p.cur_token.kind === 30) {
    Parser_next_token(p);
    Parser_next_token(p);
}

    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    if (p.cur_token.kind === 99) {
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
    while (p.cur_token.kind !== TOKEN_RBRACE && p.cur_token.kind !== TOKEN_EOF) {
    if (p.cur_token.kind === TOKEN_RBRACE) {
    break;
}

    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_type = p.cur_token.lexeme;
    Parser_next_token(p);
    let f = new_struct_field(field_name, field_type);
fields.push(f);
    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    return new StructDecl({ kind: NODE_STRUCT, name: name, fields: fields, is_exported: false, decorators: [] });
}

function Parser_parse_native_block(p) {
    Parser_next_token(p);
    let lang = "js";
    if (p.cur_token.kind === TOKEN_STRING) {
    lang = p.cur_token.lexeme;
    Parser_next_token(p);
}

    if (p.cur_token.kind !== TOKEN_LBRACE) {
    return new NativeStmt({ kind: 0, lang: "", code: "" });
}

    let start_pos = p.cur_token.start;
    let code = "";
    let end_pos = 0;
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
}

function Parser_parse_block(p) {
    let stmts = [];
    if (p.cur_token.kind === TOKEN_LBRACE) {
    Parser_next_token(p);
    while (p.cur_token.kind !== TOKEN_RBRACE && p.cur_token.kind !== TOKEN_EOF) {
    let stmt = Parser_parse_statement(p);
stmts.push(stmt);
}

    Parser_next_token(p);
}
 else {
    let stmt = Parser_parse_statement(p);
stmts.push(stmt);
}

    return new Block({ kind: NODE_BLOCK, statements: stmts });
}

function Parser_parse_expr_stmt(p) {
    let expr = Parser_parse_expression(p);
    if (p.cur_token.kind === TOKEN_SEMICOLON) {
    Parser_next_token(p);
}

    return new ExpressionStmt({ kind: NODE_EXPRESSION_STMT, expr: expr });
}

function Parser_parse_expression(p) {
    return Parser_parse_assignment(p);
}

function Parser_parse_assignment(p) {
    let left = Parser_parse_logic(p);
    if (p.cur_token.kind === TOKEN_ASSIGN) {
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
    if (k !== TOKEN_EQ && k !== TOKEN_NOT_EQ) {
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
    if (k !== TOKEN_LT && k !== TOKEN_GT && k !== TOKEN_LE && k !== TOKEN_GE) {
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
    if (k !== TOKEN_AND && k !== TOKEN_OR) {
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
    if (k !== TOKEN_PLUS && k !== TOKEN_MINUS) {
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
    if (k !== TOKEN_ASTERISK && k !== TOKEN_SLASH) {
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
    if (p.cur_token.kind === TOKEN_MINUS) {
    Parser_next_token(p);
    let operand = Parser_parse_factor(p);
    node = new BinaryExpr({ kind: NODE_BINARY, left: new IntegerLiteral({ kind: NODE_LITERAL, value: 0 }), op: "-", right: operand });
    return node;
}

    if (p.cur_token.kind === TOKEN_BANG) {
    Parser_next_token(p);
    let operand = Parser_parse_factor(p);
    return operand;
}

    if (p.cur_token.kind === TOKEN_INT) {
    let val = 0;
val = Number(p.cur_token.lexeme);
    node = new IntegerLiteral({ kind: NODE_LITERAL, value: val });
    Parser_next_token(p);
}
 else {
    if (p.cur_token.kind === TOKEN_IDENTIFIER) {
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if (p.cur_token.kind === TOKEN_LBRACE) {
    Parser_next_token(p);
    let init_fields = [];
    while (p.cur_token.kind !== TOKEN_RBRACE && p.cur_token.kind !== TOKEN_EOF) {
    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_val = Parser_parse_expression(p);
    let field = new StructInitField({ name: field_name, value: field_val });
init_fields.push(field);
    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    node = new StructInitExpr({ kind: NODE_STRUCT_INIT, name: name, fields: init_fields });
}
 else {
    node = new Identifier({ kind: NODE_IDENTIFIER, value: name });
}

}
 else {
    if (p.cur_token.kind === TOKEN_LPAREN) {
    Parser_next_token(p);
    node = Parser_parse_expression(p);
    Parser_next_token(p);
}
 else {
    if (p.cur_token.kind === TOKEN_STRING) {
    let str_val = p.cur_token.lexeme;
    node = new StringLiteral({ kind: NODE_STRING, value: str_val });
    Parser_next_token(p);
}
 else {
    if (p.cur_token.kind === TOKEN_TRUE) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: true });
    Parser_next_token(p);
}
 else {
    if (p.cur_token.kind === TOKEN_FALSE) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: false });
    Parser_next_token(p);
}
 else {
    if (p.cur_token.kind === TOKEN_LBRACKET) {
    Parser_next_token(p);
    let elements = [];
    while (p.cur_token.kind !== TOKEN_RBRACKET && p.cur_token.kind !== TOKEN_EOF) {
elements.push(Parser_parse_expression(p));
    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
node = { kind: NODE_ARRAY, elements: elements };
}
 else {
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
    if (p.cur_token.kind === 31) {
    Parser_next_token(p);
    let prop = p.cur_token.lexeme;
    Parser_next_token(p);
    node = new MemberExpr({ kind: NODE_MEMBER, target: node, property: prop });
}
 else {
    if (p.cur_token.kind === TOKEN_LPAREN) {
    Parser_next_token(p);
    let args = [];
    while (p.cur_token.kind !== TOKEN_RPAREN && p.cur_token.kind !== TOKEN_EOF) {
args.push(Parser_parse_expression(p));
    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    node = new CallExpr({ kind: NODE_CALL, function: node, args: args });
}
 else {
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
    if (p.cur_token.kind === TOKEN_ELSE) {
    Parser_next_token(p);
    if (p.cur_token.kind === TOKEN_IF) {
    let if_stmt = Parser_parse_if(p);
    let stmts = [];
stmts.push(if_stmt);
    alt = new Block({ kind: NODE_BLOCK, statements: stmts });
}
 else {
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
    if (p.cur_token.kind === TOKEN_LPAREN) {
    Parser_next_token(p);
    while (p.cur_token.kind !== TOKEN_RPAREN && p.cur_token.kind !== TOKEN_EOF) {
    let arg_name = "";
    let arg_val = 0;
    let is_named = false;
    if (p.cur_token.kind === TOKEN_IDENTIFIER) {
    if (p.peek_token.kind === TOKEN_ASSIGN) {
    is_named = true;
}

}

    if (is_named) {
    arg_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    arg_val = Parser_parse_expression(p);
}
 else {
    arg_val = Parser_parse_expression(p);
}

    let field = new StructInitField({ name: arg_name, value: arg_val });
args.push(field);
    if (p.cur_token.kind === TOKEN_COMMA) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
}

    return new Decorator({ name: name, args: args });
}







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






function CodeGenerator_generate(self, program) {
    let hybrid = new_code_generator(self.target);
    let h = HybridCodeGenerator_new(self.target);
    return HybridCodeGenerator_generate(h, program);
}






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
return impl.LanguageProfile_load_impl(self);
    return self;
}

function LanguageProfile_render(self, template_name, data) {
    let result = "";
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
result = impl.HybridCodeGenerator_indent_impl(self, code);
    return result;
}

function HybridCodeGenerator_generate(self, program) {
    let output = "";
    output = LanguageProfile_render(self.profile, "program_header", {  });
self.exports = [];
        self.ast_node_count = 0;
        self.generated_count = 0;
        
        if (program && program.statements) {
            for (const stmt of program.statements) {
                self.ast_node_count++;
                const code = HybridCodeGenerator_gen_statement(self, stmt);
                if (code) {
                    output += code + "\n";
                    self.generated_count++;
                }
            }
        }
        
        // Auto-exports
        if (self.exports.length > 0) {
            output += "\nmodule.exports = { " + self.exports.join(", ") + " };\n";
        }
        
        // AST Parity Validation
        const coverage = self.ast_node_count > 0 ? 
            (self.generated_count / self.ast_node_count * 100).toFixed(1) : 100;
        if (coverage < 100) {
            console.warn("[codegen] AST coverage: " + coverage + "% (" + 
                self.generated_count + "/" + self.ast_node_count + " nodes)");
        }
    return output;
}

function HybridCodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind === NODE_IMPORT) {
    return HybridCodeGenerator_gen_import(self, stmt);
}

    if (stmt.kind === NODE_NATIVE) {
    let result = "";
result = impl.check_native_lang(self, stmt);
    return result;
}

    if (stmt.kind === NODE_LET) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "let_decl", {
                name: stmt.name,
                value: value
            });
    return result;
}

    if (stmt.kind === NODE_RETURN) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "return_stmt", {
                value: value
            });
    return result;
}

    if (stmt.kind === NODE_FUNCTION) {
    let params = "";
params = stmt.params ? stmt.params.join(", ") : "";
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level - 1;
if (stmt.is_exported) self.exports.push(stmt.name);
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "fn_decl", {
                name: stmt.name,
                params: params,
                body: body
            });
    return result;
}

    if (stmt.kind === NODE_STRUCT) {
    return HybridCodeGenerator_gen_struct(self, stmt);
}

    if (stmt.kind === NODE_IF) {
    return HybridCodeGenerator_gen_if(self, stmt);
}

    if (stmt.kind === NODE_WHILE) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level - 1;
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
    return result;
}

    if (stmt.kind === NODE_CAPSULE) {
    return HybridCodeGenerator_gen_capsule(self, stmt);
}

    if (stmt.kind === NODE_SPAWN) {
    return HybridCodeGenerator_gen_spawn(self, stmt);
}

    if (stmt.kind === NODE_INTERFACE) {
    return HybridCodeGenerator_gen_interface(self, stmt);
}

    if (stmt.kind === NODE_ASSIGNMENT) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return stmt.name + " = " + value + self.profile.statement_end;
}

    if (stmt.kind === NODE_CALL) {
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: stmt.name, // Simplified for direct calls
                args: "" // Simplified
            });
             // This block seems wrong/duplicate, referencing old logic
}

    if (stmt.kind === 20) {
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

    if (expr.kind === NODE_LITERAL) {
    let val = "";
val = String(expr.value);
            // Map booleans
            if (val === 'true') val = self.profile.templates.bool_true || 'true';
            if (val === 'false') val = self.profile.templates.bool_false || 'false';
            if (val === 'null') val = self.profile.templates.null || 'null';
    return val;
}

    if (expr.kind === NODE_STRING) {
    let result = "";
result = '"' + expr.value + '"';
    return result;
}

    if (expr.kind === NODE_BOOL) {
    let result = "";
result = impl.gen_expression_bool(self, expr);
    return result;
}

    if (expr.kind === NODE_IDENTIFIER) {
    let result = "";
result = expr.value || expr.name || '';
    return result;
}

    if (expr.kind === NODE_BINARY) {
    let left = HybridCodeGenerator_gen_expression(self, expr.left);
    let right = HybridCodeGenerator_gen_expression(self, expr.right);
    let op = LanguageProfile_map_operator(self.profile, expr.op);
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "binary_expr", {
                left: left,
                op: op,
                right: right
            });
    return result;
}

    if (expr.kind === NODE_CALL) {
    let callee = "";
    let args = "";
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
result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
    return result;
}

    if (expr.kind === NODE_MEMBER) {
    let obj = HybridCodeGenerator_gen_expression(self, expr.object);
    return obj + "." + expr.member;
}

    if (expr.kind === NODE_ARRAY) {
    let elements = "";
if (expr.elements) {
                elements = expr.elements.map(e => HybridCodeGenerator_gen_expression(self, e)).join(', ');
            }
    return "[" + elements + "]";
}

    if (expr.kind === NODE_STRUCT_INIT) {
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
        const statements = Array.isArray(body) ? body : (body.statements || []);
        if (!Array.isArray(statements)) return '';
        result = statements.map(s => {
            const code = HybridCodeGenerator_gen_statement(self, s);
            return HybridCodeGenerator_indent(self, code);
        }).join('\n');
    return result;
}

function HybridCodeGenerator_gen_if(self, stmt) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    let consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = self.indent_level - 1;
    let has_alt = false;
has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node (e.g., Block, IfStmt)
        );
    if (has_alt) {
    self.indent_level = self.indent_level + 1;
    let alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = self.indent_level - 1;
    let result = "";
result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
    return result;
}

    let result = "";
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
{
        const impl = require('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    }
    let class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
    let out = "";
{
        const impl = require('./codegen_hybrid_impl.js');
        out = impl.LanguageProfile_render_impl(self.profile, "class_decl", {
            name: stmt.name,
            body: class_body
        });
    }
    if (is_entity) {
    out = out + HybridCodeGenerator_gen_entity_repo(self, stmt);
}

    return out;
}

function HybridCodeGenerator_gen_entity_repo(self, stmt) {
    let result = "";
result = impl.gen_entity_repo(stmt);
    return result;
}

function HybridCodeGenerator_gen_capsule(self, stmt) {
    let result = "";
result = impl.gen_capsule(stmt);
    return result;
}

function HybridCodeGenerator_gen_spawn(self, stmt) {
    let fn_name = "";
    let args = "";
const call = stmt.call;
        fn_name = call?.name || call?.callee?.value || 'unknown';
        if (call?.args) {
            args = call.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
        }
    let out = "";
out = impl.gen_spawn_code(fn_name, args);
    return out;
}

function HybridCodeGenerator_gen_import(self, stmt) {
    let result = "";
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
result = impl.gen_service_client(stmt);
    return result;
}

function new_code_generator(target) {
    return HybridCodeGenerator_new(target);
}

function CodeGenerator_generate(self, program) {
    return HybridCodeGenerator_generate(self, program);
}






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
            const fs = require('fs');
            return fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '';
        };
        env.functions['write_file'] = (path, content) => {
            const fs = require('fs');
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
        
        const statements = Array.isArray(block) ? block : (block.statements || []);
        
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
            // Fix: CallExpr uses 'function' field (AST), not 'callee' or 'name'
            const funcNode = expr.function;
            const fnName = funcNode ? (funcNode.value || funcNode.name) : '';

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
    let result = 0;
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
    let url = "";
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
const path = require('path');
        
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
}

function LockFile_save(lock, project_dir) {
const path = require('path');
        
        const lockPath = path.join(project_dir, 'omni.lock');
        
        fs.writeFileSync(lockPath, JSON.stringify({
            version: lock.version,
            packages: lock.packages
        }, null, 2));
        
        console.log(CLI_COLORS.green + '├âãÆ├é┬ó├âÔÇª├óÔé¼┼ô├â┬ó├óÔÇÜ┬¼├àÔÇ£' + CLI_COLORS.reset + ' Updated omni.lock');
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
    let success = false;
const { execSync, exec } = require('child_process');
        const fs = require('fs');
        const path = require('path');
        
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
    CLI_banner();
    CLI_header("Omni Package Installer");
    if (package_spec === "") {
    cmd_install_from_lock();
    return;
}

    let pkg = GitPackage_parse(package_spec);
    if (pkg.name === "") {
    CLI_error("Invalid package specification: " + package_spec);
    CLI_info("Examples:");
    CLI_info("  omni install github:crom/utils");
    CLI_info("  omni install crom/utils");
    CLI_info("  omni install https://github.com/crom/utils");
    return;
}

    CLI_info("Package: " + pkg.name);
    CLI_info("Source: " + pkg.full_url);
    let commit = git_get_latest_commit(pkg);
    if (commit !== "") {
    pkg.commit = commit;
    CLI_info("Commit: " + commit.substring(0, 8) + "...");
}

    let cwd = "";
cwd = process.cwd();
    let target = "";
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
}
 else {
    CLI_error("Failed to install package");
}

}

function cmd_install_from_lock() {
    CLI_info("Installing packages from omni.lock...");
    let cwd = "";
cwd = process.cwd();
    let lock = LockFile_load(cwd);
const packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            terminal.CLI_info("No packages in omni.lock");
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
    CLI_banner();
    CLI_header("Omni Package Uninstaller");
    if (package_name === "") {
    CLI_error("Usage: omni uninstall <package>");
    return;
}

    let cwd = "";
cwd = process.cwd();
    let lock = LockFile_load(cwd);
    let found = false;
const path = require('path');
        
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
    LockFile_save(lock, cwd);
    CLI_success("Uninstalled: " + package_name);
}
 else {
    CLI_error("Package not found: " + package_name);
}

}

function cmd_list() {
    CLI_banner();
    CLI_header("Installed Packages");
    let cwd = "";
cwd = process.cwd();
    let lock = LockFile_load(cwd);
const packages = Object.values(lock.packages);
        
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
            const commit = pkg.commit ? pkg.commit.substring(0, 8) : 'HEAD';
            console.log("  ├âãÆ├é┬░├âÔÇª├é┬©├â┬ó├óÔÇÜ┬¼├àÔÇ£├âÔÇÜ├é┬ª " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset + 
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
                console.log(CLI_COLORS.dim + "    " + entry.commit.substring(0, 8) + " ├âãÆ├é┬ó├â┬ó├óÔÇÜ┬¼├é┬á├â┬ó├óÔÇÜ┬¼├óÔÇ×┬ó " + newCommit.substring(0, 8) + CLI_COLORS.reset);
                
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
    CLI_banner();
    CLI_header("Omni Doctor - System Health Check");
const { execSync } = require('child_process');
        const fs = require('fs');
        const path = require('path');
        
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
                console.log("  " + CLI_COLORS.green + "├âãÆ├é┬ó├âÔÇª├óÔé¼┼ô├â┬ó├óÔÇÜ┬¼├àÔÇ£" + CLI_COLORS.reset + " " + tool.name + ": " + CLI_COLORS.dim + version + CLI_COLORS.reset);
            } catch (e) {
                console.log("  " + CLI_COLORS.red + "├âãÆ├é┬ó├âÔÇª├óÔé¼┼ô├â┬ó├óÔÇÜ┬¼├óÔé¼┬Ø" + CLI_COLORS.reset + " " + tool.name + ": not found");
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
                console.log("  " + CLI_COLORS.green + "├âãÆ├é┬ó├âÔÇª├óÔé¼┼ô├â┬ó├óÔÇÜ┬¼├àÔÇ£" + CLI_COLORS.reset + " " + file.name);
            } else {
                console.log("  " + CLI_COLORS.yellow + "├âãÆ├é┬ó├â┬ó├óÔÇÜ┬¼├óÔé¼┬Ø├â┬ó├óÔÇÜ┬¼├é┬╣" + CLI_COLORS.reset + " " + file.name + CLI_COLORS.dim + " (optional)" + CLI_COLORS.reset);
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
                console.log("  ├âãÆ├é┬░├âÔÇª├é┬©├â┬ó├óÔÇÜ┬¼├àÔÇ£├âÔÇÜ├é┬ª " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset);
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
        const line = '├óÔÇó┬É'.repeat(width - 2);
        
        console.log(CLI_COLORS.cyan + '├óÔÇóÔÇØ' + line + '├óÔÇóÔÇö' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '├óÔÇóÔÇÿ' + CLI_COLORS.reset + 
                    CLI_COLORS.bold + ' ├óÔÇö┼á OMNI ' + title.padEnd(width - 12) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + '├óÔÇóÔÇÿ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '├óÔÇóÔÇÿ' + CLI_COLORS.reset + 
                    CLI_COLORS.dim + '   ' + subtitle.padEnd(width - 6) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + '├óÔÇóÔÇÿ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '├óÔÇó┬á' + line + '├óÔÇó┬ú' + CLI_COLORS.reset);
}

function tui_render_menu(state) {
for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const selected = i === state.cursor;
            const prefix = selected ? CLI_COLORS.cyan + ' ├óÔÇô┬Â ' : '   ';
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
        const line = '├óÔÇØÔé¼'.repeat(width - 2);
        
        console.log('');
        console.log(CLI_COLORS.dim + '├óÔÇØ┼Æ' + line + '├óÔÇØ┬É' + CLI_COLORS.reset);
        
        if (state.message) {
            console.log(CLI_COLORS.dim + '├óÔÇØÔÇÜ ' + CLI_COLORS.reset + 
                        state.message.padEnd(width - 4) + 
                        CLI_COLORS.dim + ' ├óÔÇØÔÇÜ' + CLI_COLORS.reset);
        }
        
        console.log(CLI_COLORS.dim + '├óÔÇØÔÇÜ ├óÔÇáÔÇÿ/├óÔÇáÔÇ£ Navigate   Enter Select   q Quit' + 
                    ''.padEnd(width - 42) + ' ├óÔÇØÔÇÜ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + '├óÔÇØÔÇØ' + line + '├óÔÇØ╦£' + CLI_COLORS.reset);
}

function tui_render_file_list(state) {
console.log('');
        console.log(CLI_COLORS.cyan + '  Select files to convert:' + CLI_COLORS.reset);
        console.log('');
        
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const isSelected = state.selected.includes(i);
            const isCursor = i === state.cursor;
            
            const checkbox = isSelected ? CLI_COLORS.green + '[├ó┼ôÔÇ£]' : CLI_COLORS.dim + '[ ]';
            const prefix = isCursor ? CLI_COLORS.cyan + ' ├óÔÇô┬Â ' : '   ';
            
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
            
            const prefix = isCursor ? CLI_COLORS.cyan + ' ├óÔÇô┬Â ' : '   ';
            const icon = item.icon || '├░┼©┼¢┬»';
            
            console.log(prefix + icon + ' ' + 
                        (isCursor ? CLI_COLORS.bold : '') + 
                        item.label + CLI_COLORS.reset);
            
            if (isCursor && item.description) {
                console.log('      ' + CLI_COLORS.dim + item.description + CLI_COLORS.reset);
            }
        }
}

function tui_main_menu() {
    return [{ id: "convert", label: "├░┼©ÔÇØÔÇ× Convert Legacy Code", description: "Transform PHP, Java, Python to Omni" }, { id: "install", label: "├░┼©ÔÇ£┬ª Install Package", description: "Install from GitHub" }, { id: "studio", label: "├░┼©┼¢┬¿ Open Studio", description: "Visual programming environment" }, { id: "build", label: "├░┼©ÔÇØ┬¿ Build Project", description: "Compile current project" }, { id: "run", label: "├óÔÇô┬Â├»┬©┬Å  Run Project", description: "Execute main file" }, { id: "doctor", label: "├░┼©┬®┬║ System Doctor", description: "Check installation health" }, { id: "quit", label: "├ó┬Ø┼Æ Quit", description: "" }];
}

function tui_target_menu() {
    return [{ id: "js", label: "JavaScript (Node.js)", icon: "├░┼©┼©┬¿", description: "CommonJS module" }, { id: "python", label: "Python 3", icon: "├░┼©┬É┬ì", description: "Python 3.8+ compatible" }, { id: "c", label: "C Native", icon: "├ó┼í┬í", description: "Portable C99 code" }, { id: "lua", label: "Lua 5.4", icon: "├░┼©┼ÆÔäó", description: "Lua script" }, { id: "wasm", label: "WebAssembly", icon: "├░┼©ÔÇó┬©├»┬©┬Å", description: "WASM binary" }, { id: "back", label: "├óÔÇá┬É Back", icon: "├óÔÇöÔé¼├»┬©┬Å", description: "" }];
}

function tui_scan_legacy_files(dir) {
    let files = [];
const path = require('path');
        
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
    let state = TUIState_new();
state.items = tui_main_menu();
    tui_enable_raw_mode();
    tui_hide_cursor();
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
                console.log('\nGoodbye! ├░┼©ÔÇÿÔÇ╣');
                process.exit(0);
            }
        });
        
        // Initial render
        render();
}

function tui_quick_convert(files, target) {
console.log(CLI_COLORS.cyan + '├óÔÇö┼á Quick Convert' + CLI_COLORS.reset);
        console.log('');
        
        for (const file of files) {
            console.log(CLI_COLORS.dim + '  Converting: ' + file + CLI_COLORS.reset);
            // Would call ingest here
        }
        
        CLI_success('Conversion complete!');
}







function print(msg) {
console.log(msg);

}

function read_file(path) {
    let content = "";
try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }

    return content;
}

function write_file(path, content) {
try {
            fs.writeFileSync(path, content);
        } catch (e) {
            console.error("Error writing file " + path + ": " + e.message);
            process.exit(1);
        }

}









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

let CLI_COLORS_INIT = false;

let CLI_COLORS_CACHE = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });

function CLI_COLORS() {
    if (CLI_COLORS_INIT === false) {
    CLI_COLORS_CACHE = Colors_new();
    CLI_COLORS_INIT = true;
}

    return CLI_COLORS_CACHE;
}

function CLI_success(msg) {
const c = CLI_COLORS();
        console.log(c.green + '├ó┼ôÔÇ£' + c.reset + ' ' + msg);
}

function CLI_error(msg) {
const c = CLI_COLORS();
        console.error(c.red + '├ó┼ôÔÇö' + c.reset + ' ' + msg);
}

function CLI_warning(msg) {
const c = CLI_COLORS();
        console.log(c.yellow + '├ó┼í┬á' + c.reset + ' ' + msg);
}

function CLI_info(msg) {
const c = CLI_COLORS();
        console.log(c.blue + '├óÔÇ×┬╣' + c.reset + ' ' + msg);
}

function CLI_step(step, total, msg) {
const c = CLI_COLORS();
        const prefix = c.cyan + '[' + step + '/' + total + ']' + c.reset;
        console.log(prefix + ' ' + msg);
}

function CLI_header(title) {
const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + c.cyan + '├óÔÇó┬É├óÔÇó┬É├óÔÇó┬É ' + title + ' ├óÔÇó┬É├óÔÇó┬É├óÔÇó┬É' + c.reset);
        console.log('');
}

function CLI_dim(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.dim + msg + c.reset;
    return result;
}

function CLI_bold(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.bold + msg + c.reset;
    return result;
}

function CLI_green(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.green + msg + c.reset;
    return result;
}

function CLI_red(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.red + msg + c.reset;
    return result;
}

function CLI_yellow(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.yellow + msg + c.reset;
    return result;
}

function CLI_cyan(msg) {
    let result = "";
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
    let spinner = new Spinner({ frames: "├ó┬áÔÇ╣├ó┬áÔäó├ó┬á┬╣├ó┬á┬©├ó┬á┬╝├ó┬á┬┤├ó┬á┬ª├ó┬á┬º├ó┬áÔÇí├ó┬á┬Å", current: 0, interval: 0, message: message, running: false });
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
            ? c.green + '├ó┼ôÔÇ£' + c.reset 
            : c.red + '├ó┼ôÔÇö' + c.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
}

function CLI_progress_bar(current, total, width) {
    let result = "";
const c = CLI_COLORS();
        const percent = Math.floor((current / total) * 100);
        const filled = Math.floor((current / total) * width);
        const empty = width - filled;
        
        const bar = c.green + '├óÔÇô╦å'.repeat(filled) + 
                    c.dim + '├óÔÇôÔÇÿ'.repeat(empty) + c.reset;
        
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
        console.log('├óÔÇØÔé¼'.repeat(50));
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






function get_omni_home() {
    let home = "";
const os = require('os');
        
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
    let resolved = "";
const path = require('path');
        
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
        const os = require('os');
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
    CLI_banner();
    CLI_header("Omni Setup");
const fs = require('fs');
        const path = require('path');
        const { execSync } = require('child_process');
        
        const platform = os.platform();
        const isWindows = platform === 'win32';
        const omniDir = path.dirname(path.dirname(__filename));
        
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






function cmd_run() {
    let run_file = "";
run_file = process.argv[3] || '';
    if (run_file === "") {
    CLI_error("Usage: omni run <file.omni> [--cmd|--app|--web|--web-app] [--port N]");
    CLI_info("Modes:");
    CLI_info("  --cmd      Terminal execution (default)");
    CLI_info("  --app      Native desktop app (Python/Tkinter)");
    CLI_info("  --web      Web server on port (default: 3000)");
    CLI_info("  --web-app  Web in native browser window");
    return true;
}

    let source = read_file(run_file);
    if (source === "") {
    CLI_error("Could not read file: " + run_file);
    return false;
}

    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
const path = require('path');
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
        
        // Framework/Target shortcuts
        if (process.argv.includes("--php")) {
             target = "php";
             mode = "cmd"; 
        }
        if (process.argv.includes("--laravel")) {
             target = "php";
             mode = "cmd"; // For now, run as cmd script, detection logic inside codegen will handle specifics
        }
        if (process.argv.includes("--react")) {
             target = "js";
             mode = "web";
        }
        
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
        const hasExplicitMode = ["--cmd", "--app", "--web", "--web-app"].some(f => process.argv.includes(f));
        
        if (!hasExplicitMode) {
            const dir = path.dirname(run_file);
            const possibleConfigs = [
                path.join(dir, 'omni.conf.json'),
                path.join(dir, '..', 'omni.conf.json')
            ];
            
            for (const confPath of possibleConfigs) {
                if (fs.existsSync(confPath)) {
                    try {
                        const conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
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
        } else if (target !== "php" && target !== "js") {
            target = "js";
        }
        
        CLI_info("Mode: " + mode + " | Target: " + target);
        
        // Generate code
        const gen = new_code_generator(target);
        const code = CodeGenerator_generate(gen, program);
        
        const ext = target === "python" ? ".py" : ".js";
        const outFile = run_file.replace(".omni", ext);
        const htmlFile = run_file.replace(".omni", ".html");
        
        // ========== CMD MODE ==========
        if (mode === "cmd") {
            CLI_info("Running in terminal...");
            
            let finalCode = code;
            if (target === "js") {
                finalCode += "\nif (typeof main === 'function') main();\n";
            } else if (target === "python") {
                finalCode += "\nif __name__ == '__main__':\n    main()\n";
            } else if (target === "php") {
                finalCode += "\nif (function_exists('main')) { main(); }\n";
            }
            
            fs.writeFileSync(outFile, finalCode);
            
            let cmd = "node";
            if (target === "python") cmd = "python";
            if (target === "php") cmd = "php";
            
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
            const baseName = path.basename(outFile);
            const html = `<!DOCTYPE html>
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
            const server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                const extName = path.extname(filePath);
                const mimeTypes = {
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
            const baseName = path.basename(outFile);
            const html = `<!DOCTYPE html>
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
            const server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                const extName = path.extname(filePath);
                const mimeTypes = {
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
                const url = "http://localhost:" + port;
                CLI_info("Opening browser: " + url);
                
                const platform = process.platform;
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






function cmd_build() {
    CLI_info("Building from omni.config.json...");
}






function cmd_test_all() {
    CLI_banner();
    CLI_header("Testing All Examples");
const path = require('path');
        
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
        
        // Find all example folders (with omni.conf.json)
        const entries = fs.readdirSync(examplesDir, { withFileTypes: true });
        const examples = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const confPath = path.join(examplesDir, entry.name, 'omni.conf.json');
                if (fs.existsSync(confPath)) {
                    try {
                        const conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
                        examples.push({
                            name: entry.name,
                            conf: conf,
                            entryPath: path.join(examplesDir, entry.name, conf.entry || 'src/main.omni'),
                            modes: conf.targets || ['cmd']
                        });
                    } catch(e) {
                        console.log(CLI_COLORS().yellow + "  ÔÜá " + CLI_COLORS().reset + entry.name + " (invalid config)");
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
        const failures = [];
        const results = {};
        
        for (const ex of examples) {
            const modeResults = [];
            
            for (const mode of ex.modes) {
                try {
                    // Read and parse
                    if (!fs.existsSync(ex.entryPath)) {
                        throw new Error("Entry file not found: " + ex.entryPath);
                    }
                    
                    const source = fs.readFileSync(ex.entryPath, 'utf-8');
                    const l = new_lexer(source);
                    const p = new_parser(l);
                    const program = Parser_parse_program(p);
                    
                    // Determine target based on mode
                    let target = "js";
                    if (mode === "app") target = "python";
                    
                    // Generate code
                    const gen = HybridCodeGenerator_new(target);
                    const code = HybridCodeGenerator_generate(gen, program);
                    
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
            const allPassed = modeResults.every(r => r.success);
            const modeStr = modeResults.map(r => 
                r.success ? CLI_COLORS().green + r.mode + CLI_COLORS().reset 
                          : CLI_COLORS().red + r.mode + CLI_COLORS().reset
            ).join(", ");
            
            if (allPassed) {
                passed++;
                console.log(CLI_COLORS().green + "  Ô£ô " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
            } else {
                failed++;
                const failedModes = modeResults.filter(r => !r.success);
                failures.push({ name: ex.name, errors: failedModes });
                console.log(CLI_COLORS().red + "  Ô£ù " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
            }
        }
        
        console.log("");
        console.log("ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ");
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






function cmd_package_self() {
    CLI_header("Self-Package");
const path = require('path');
        const { execSync } = require('child_process');
        
        const omniDir = path.dirname(path.dirname(__filename));
        const version = CLI_version();
        const platform = process.platform;
        
        terminal.CLI_step(1, 4, "Collecting source files...");
        
        // Files to include
        const distDir = path.join(omniDir, 'dist');
        const targetsDir = path.join(omniDir, 'targets');
        
        terminal.CLI_step(2, 4, "Creating package manifest...");
        
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






function cmd_contracts() {
const registry = ContractRegistry_new();
        ContractRegistry_list_interfaces(registry);
}






function cmd_studio_cli() {
    let port = 3000;
    let open_app = false;
    let run_tui = false;
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
}
 else {
    cmd_studio(port, open_app);
}

}






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
    if (command === "setup") {
    let is_global = false;
for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
    cmd_setup(is_global);
    return 0;
}

    if (command === "--version" || command === "-v" || command === "version") {
    cmd_version();
    return 0;
}

    if (command === "package") {
    let self_package = false;
self_package = process.argv[3] === '--self';
    if (self_package) {
    cmd_package_self();
    return 0;
}

}

    if (command === "install") {
    let package_spec = "";
package_spec = process.argv[3] || '';
    cmd_install(package_spec);
    return 0;
}

    if (command === "uninstall") {
    let package_name = "";
package_name = process.argv[3] || '';
    if (package_name === "") {
    terminal.CLI_error("Usage: omni uninstall <package_name>");
    return 1;
}

    cmd_uninstall(package_name);
    return 0;
}

    if (command === "list") {
    cmd_list();
    return 0;
}

    if (command === "update") {
    let package_name = "";
package_name = process.argv[3] || '';
    cmd_update(package_name);
    return 0;
}

    if (command === "search") {
    let query = "";
query = process.argv[3] || '';
    cmd_search(query);
    return 0;
}

    if (command === "doctor") {
    cmd_doctor();
    return 0;
}

    if (command === "contracts") {
    cmd_contracts();
    return 0;
}

    if (command === "graph") {
    let input_file = "";
    let output_file = "";
input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
    if (input_file === "") {
    CLI_error("Usage: omni graph <input.omni> [output.md]");
    CLI_info("Generates architecture diagrams in Mermaid format");
    return 1;
}

    if (output_file === "") {
output_file = path.basename(input_file, '.omni') + '_architecture.md';
}

    cmd_graph(input_file, output_file);
    return 0;
}

    if (command === "bootstrap") {
    cmd_bootstrap();
    return 0;
}

    if (command === "studio") {
    cmd_studio_cli();
    return 0;
}

    if (command === "ui") {
    cmd_tui();
    return 0;
}

    if (command === "package") {
    let target = "";
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
    let config = AppConfig_default();
const path = require('path');
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
    cmd_package_app(target, config);
    return 0;
}

    if (command === "ingest") {
    let input_file = "";
    let output_file = "";
input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
    if (input_file === "") {
    CLI_error("Usage: omni ingest <legacy_file> <output.omni>");
    return 1;
}

    if (output_file === "") {
output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
}

    cmd_ingest(input_file, output_file);
    return 0;
}

    if (command === "run") {
    cmd_run();
    return 0;
}

    if (command === "build") {
    cmd_build();
    return 0;
}

    if (command === "test-all") {
    cmd_test_all();
    return 0;
}

    let show_help = false;
show_help = command === 'help' || command === '--help' || command === '-h';
    if (command === "" || args_len < 3) {
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
    CLI_info("Compiling: " + input_path);
    CLI_info("Target: " + target_lang);
if (package_path) {
            const fs = require('fs');
            const path = require('path');
            
            if (fs.existsSync(package_path)) {
                terminal.CLI_info("Loading package: " + package_path);
                
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
            const coverage = gen.ast_node_count > 0 
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


// Entry Point
if (require.main === module) {
    main();
}



