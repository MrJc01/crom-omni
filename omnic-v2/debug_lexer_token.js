const fs = require('fs');
const lexer = require('./dist/core/lexer.js');
const token = require('./dist/core/token.js');

// Mock helpers if needed, but dist/core/lexer.js requires distinct files
// We need to inject token constants into global scope or specific scope if lexer relies on them?
// dist/core/lexer.js requires token.js.

const input = fs.readFileSync('src/core/token.omni', 'utf8');
const l = lexer.new_lexer(input);

let tok = lexer.Lexer_next_token(l);
while (tok.kind !== token.TOKEN_EOF) {
    console.log(`Kind: ${tok.kind}, Lexeme: '${tok.lexeme}', Line: ${tok.line}`);
    tok = lexer.Lexer_next_token(l);
}
