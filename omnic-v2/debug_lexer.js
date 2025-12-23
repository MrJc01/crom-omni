const lexer = require('./dist/core/lexer.js');
const token = require('./dist/core/token.js');

const input = '"hello"';
const l = lexer.new_lexer(input);
const tok = lexer.Lexer_next_token(l);

console.log('Kind:', tok.kind);
console.log('Lexeme:', tok.lexeme);
console.log('Lexeme Type:', typeof tok.lexeme);
console.log('Token:', JSON.stringify(tok));
