const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const std = require("../lib/std.js");
if (typeof global !== 'undefined') Object.assign(global, std);
const lexer = require("../core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const parser = require("../core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, parser);
const codegen_hybrid = require("../core/codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
const vm = require("../core/vm.js");
if (typeof global !== 'undefined') Object.assign(global, vm);
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
    
    if (run_file == "") {
    CLI_error("Usage: omni run <file.omni> [--app] [--target python]");
    return true;
}
    const source = read_file(run_file);
    const l = new_lexer(source);
    const p = new_parser(l);
    const program = Parser_parse_program(p);
    if (is_app || target == "python") {
    CLI_info("Compiling Native App (" + target + ")...");
    const gen = new_code_generator(target);
    const code = CodeGenerator_generate(gen, program);
    
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
}
    CLI_info("VM Mode - Executing: " + run_file);
    const vm = OmniVM_new();
    OmniVM_run(vm, program);
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}
