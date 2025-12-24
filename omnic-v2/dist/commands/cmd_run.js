BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (CLI_error)
BlockLoop: 42 (()
BlockLoop: 66 (return)
const cli = require("./lib/cli.js");
const std = require("./lib/std.js");
const lexer = require("./core/lexer.js");
const parser = require("./core/parser.js");
const codegen_hybrid = require("./core/codegen_hybrid.js");
const vm = require("./core/vm.js");
function cmd_run() {
    const run_file = "";
    const is_app = false;
    const target = "js";
     
         run_file = process.argv[3] || ''; 
         if (process.argv.includes("--app")) {
             is_app = true;
             target = "python"; // Default Native App target
         }
         // Check custom target
         let t_idx = process.argv.indexOf("--target");
         if (t_idx > -1 && process.argv[t_idx+1]) {
             target = process.argv[t_idx+1];
         }
    
    if (run_file) {
    "";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    CLI_error;
    "Usage: omni run <file.omni> [--app] [--target python]";
    return true;
}
const source = read_file;
const l = new_lexer;
const p = new_parser;
const program = Parser_parse_program;
if (is_app) {
    target;
}
const gen = new_code_generator;
const code = CodeGenerator_generate;

             const fs = require('fs');
             const path = require('path');
             const { spawn } = require('child_process');
             
             const ext = target == "python" ? ".py" : ".js";
             const outFile = run_file.replace(".omni", ext); 
             fs.writeFileSync(outFile, code);
             
             let cmd = "node";
             let args = [outFile];
             if (target == "python") {
                 cmd = "python";
                 args = [outFile];
             }
             
             const proc = spawn(cmd, args, { stdio: 'inherit' });
             proc.on('close', (code) => {
                 // process.exit(code); // Optional
             });
         
return true;
// Unknown stmt kind: undefined
const vm = OmniVM_new;
return true;
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}
