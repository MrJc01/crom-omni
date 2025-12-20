const lexer = require("./lexer.js");
const token = require("./token.js");
const ast = require("./ast.js");
class Parser {
    constructor(data = {}) {
        this.lexer = data.lexer;
        this.cur_token = data.cur_token;
        this.peek_token = data.peek_token;
    }
}
function new_parser(l) {
    const p = {};
    new Parser_next_token(p);
    new Parser_next_token(p);
    return p;
}
function Parser_next_token(p) {
    p.cur_token;
    p.peek_token;
    p.peek_token;
    new Lexer_next_token(p.lexer);
}
function Parser_parse_program(p) {
    const stmts = [];
    while(p.cur_token.kind != TOKEN_EOF);
    const stmt = new Parser_parse_statement(p);
    if (stmt.kind != 0) {
    
}
}

module.exports = { new_parser, Parser_next_token, Parser_parse_program, Parser };

Object.assign(global, lexer);
Object.assign(global, token);
Object.assign(global, ast);
