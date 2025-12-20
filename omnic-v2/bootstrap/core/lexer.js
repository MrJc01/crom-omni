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
    const l = {};
    new Lexer_read_char(l);
    return l;
}
function Lexer_read_char(l) {
    // Unknown stmt kind: 0
    l.read_position;
    999999;
    // Unknown stmt kind: 0
    l.ch;
    "\0";
}
const is_eof = null;
 is_eof = l.ch === "\0"; 
function Lexer_skip_whitespace(l) {
    const is_ws = null;
    // Unknown stmt kind: 0
    
        is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
    
    while(is_ws);
    // Unknown stmt kind: 0
    l.ch;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    l.line;
    l.line;
    1;
}

             is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
        
function Lexer_read_identifier(l) {
    const start_pos = l.position;
    while(is_letter(l.ch));
    new Lexer_read_char(l);
}
const ident = "";

        ident = l.input.substring(Number(start_pos), Number(l.position));
    
return ident;
function Lexer_read_number(l) {
    const start_pos = l.position;
    while(is_digit(l.ch));
    new Lexer_read_char(l);
}
const num_str = "";

        num_str = l.input.substring(Number(start_pos), Number(l.position));
    
return num_str;
function Lexer_lookup_ident(ident) {
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_FN;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_LET;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_STRUCT;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_IF;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_ELSE;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_RETURN;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_TRUE;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_FALSE;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return TOKEN_NATIVE;
    // Unknown stmt kind: 0
    ident;
    // Unknown stmt kind: 0
    return 90;
    return TOKEN_IDENTIFIER;
}
function Lexer_next_token(l) {
    new Lexer_skip_whitespace(l);
    // Unknown stmt kind: 0
    l.ch;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const peek = char_at(l.input, l.read_position);
    // Unknown stmt kind: 0
    peek;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    while(l.ch != "\n" && l.ch != "\0");
    new Lexer_read_char(l);
}
const tok = new_token(TOKEN_ILLEGAL, l.ch, l.line);
return tok;
const peek = char_at(l.input, l.read_position);
const peek = char_at(l.input, l.read_position);
const end = l.position;

            str_val = l.input.substring(Number(start), Number(end));
        
const peek = char_at(l.input, l.read_position);
const peek = char_at(l.input, l.read_position);
const literal = new Lexer_read_identifier(l);
return tok;
return tok;
return tok;
