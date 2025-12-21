const lexer = require("./lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
const ast = require("./ast.js");
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
    if (p.cur_token.lexeme == "-") {
    Parser_next_token(p);
    Parser_next_token(p);
    Parser_next_token(p);
}
    let body = Parser_parse_block(p);
    return new FunctionDecl({ kind: NODE_FUNCTION, name: name, params: params, body: body, is_exported: false });
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
    return new StructDecl({ kind: NODE_STRUCT, name: name, fields: fields, is_exported: false });
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
    if (p.cur_token.kind == TOKEN_LBRACE) {
    Parser_next_token(p);
    while (p.cur_token.kind != TOKEN_RBRACE && p.cur_token.kind != TOKEN_EOF) {
     console.log("BlockLoop: " + p.cur_token.kind + " (" + p.cur_token.lexeme + ")"); 
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
    return new ExpressionStmt({ kind: 0, expr: expr });
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
    if (p.cur_token.kind == TOKEN_INT) {
    let val = 0;
     val = parseInt(p.cur_token.lexeme); 
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
