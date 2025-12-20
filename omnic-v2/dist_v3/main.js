const token = require("./core/token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
const lexer = require("./core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const parser = require("./core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, parser);
const codegen = require("./core/codegen.js");
if (typeof global !== 'undefined') Object.assign(global, codegen);
const std = require("./lib/std.js");
if (typeof global !== 'undefined') Object.assign(global, std);
function main() {
    let args_len = 0;
    
        args_len = process.argv.length;
    
    let check_args = false;
     check_args = args_len < 4; 
    if (check_args) {
    print("Usage: node main.js <input_file> <output_file>");
    return 0;
}
    let input_path = "";
    let output_path = "";
    
        input_path = process.argv[2];
        output_path = process.argv[3];
    
    let target_lang = "js";
    
        for (let i = 4; i < process.argv.length; i++) {
             if (process.argv[i] == "--target" && (i + 1 < process.argv.length)) {
                 target_lang = process.argv[i+1];
             }
        }
    
    print("Compiling: " + input_path);
    let source = read_file(input_path);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let gen = new_code_generator(target_lang);
    let code = CodeGenerator_generate(gen, program);
    write_file(output_path, code);
    print("Compiled successfully to: " + output_path);
}

main();
