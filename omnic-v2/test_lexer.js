const lexer = require('./dist/core/lexer.js');
const token = require('./dist/core/token.js');
const fs = require('fs');

const input = fs.readFileSync('test_multi_fn.omni', 'utf8');

console.log("Testing Lexer with file test_multi_fn.omni");

try {
    const l = lexer.new_lexer(input);
    
    let tok = lexer.Lexer_next_token(l);
    while (tok.kind !== token.TOKEN_EOF) {
        console.log(`Token: Kind=${tok.kind}, Lexeme='${tok.lexeme}'`);
        tok = lexer.Lexer_next_token(l);
    }
    console.log("EOF reached");
} catch (e) {
    console.error("Error:", e);
}
