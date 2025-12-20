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

module.exports = { Token, new_token, TOKEN_EOF, TOKEN_ILLEGAL, TOKEN_IDENTIFIER, TOKEN_INT, TOKEN_STRING, TOKEN_ASSIGN, TOKEN_PLUS, TOKEN_MINUS, TOKEN_BANG, TOKEN_ASTERISK, TOKEN_SLASH, TOKEN_LT, TOKEN_GT, TOKEN_EQ, TOKEN_NOT_EQ, TOKEN_COLON, TOKEN_DOT, TOKEN_AND, TOKEN_OR, TOKEN_LE, TOKEN_GE, TOKEN_COMMA, TOKEN_SEMICOLON, TOKEN_LPAREN, TOKEN_RPAREN, TOKEN_LBRACE, TOKEN_RBRACE, TOKEN_LBRACKET, TOKEN_RBRACKET, TOKEN_FN, TOKEN_LET, TOKEN_TRUE, TOKEN_FALSE, TOKEN_IF, TOKEN_ELSE, TOKEN_RETURN, TOKEN_WHILE, TOKEN_STRUCT, TOKEN_NATIVE, TOKEN_IMPORT, TOKEN_PACKAGE };
