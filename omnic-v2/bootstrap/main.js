function print(s) { console.log(s); }
const token = require("./core/token.js");
const lexer = require("./core/lexer.js");
const parser = require("./core/parser.js");
const codegen = require("./core/codegen.js");
const io = require("./core/io.js");
function main() {
    const args_len = 0;
    
}

Object.assign(global, token);
Object.assign(global, lexer);
Object.assign(global, parser);
Object.assign(global, codegen);
Object.assign(global, io);

main();
