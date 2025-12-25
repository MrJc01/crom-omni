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
    let run_file = "";
    let is_app = false;
    let target = "js";
     
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
    let source = read_file(run_file);
    if (source == "") {
}
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    if (is_app || target == "python" || target == "js") {
    CLI_info("Compiling & Running (" + target + "): " + run_file);
    let gen = new_code_generator(target);
    let code = CodeGenerator_generate(gen, program);
    
             const fs = require('fs');
             const path = require('path');
             const { spawnSync } = require('child_process');
             
             let ext = target == "python" ? ".py" : ".js";
             let outFile = run_file.replace(".omni", ext); 
             
             // Auto-run main if exists
             if (target == "js") {
                 code += "\nif (typeof main === 'function') main();\n";
             } else if (target == "python") {
                 code += "\nif __name__ == '__main__':\n    main()\n";
             }

             fs.writeFileSync(outFile, code);
             
             let cmd = "node";
             let args = [outFile];
             if (target == "python") {
                 cmd = "python";
                 args = [outFile];
             }
             
             let proc = spawnSync(cmd, args, { stdio: 'inherit' });
             // Returns { status, signal, output, ... }
         
    return true;
}
    CLI_info("VM Mode - Executing: " + run_file);
    let vm = OmniVM_new();
    OmniVM_run(vm, program);
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}
