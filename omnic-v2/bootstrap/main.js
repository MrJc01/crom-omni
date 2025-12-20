
const fs = require('fs');
// Define print() globalmente
global.print = function(msg) { console.log(msg); };
let token = require("./core/token.js");
let lexer = require("./core/lexer.js");
let parser = require("./core/parser.js");
let codegen = require("./core/codegen.js");
let io = require("./core/io.js");
function main() {
    let args_len = 0;
    
        args_len = process.argv.length;
    
    let check_args = false;
     check_args = args_len < 4; 
    if (check_args) {
    print("Usage: node main.js <input_file> <output_file>");
    return null;
}
    let input_path = "";
    let output_path = "";
    
        input_path = process.argv[2];
        output_path = process.argv[3];
    
    print("Compiling: " + input_path);
    let source = read_file(input_path);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let gen = new_code_generator();
    let code = CodeGenerator_generate(gen, program);
    write_file(output_path, code);
    print("Compiled successfully to: " + output_path);
}

// --- [Bootstrap Auto-Patch] ---
// Exporta símbolos para require()
module.exports = { main };

// Injeta no Global para simular o namespace plano do Omni
Object.assign(global, module.exports);

if (typeof main === 'function') main();
