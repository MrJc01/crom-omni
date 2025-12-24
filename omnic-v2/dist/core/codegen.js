BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 12 (python)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 42 (()
BlockLoop: 10 (program)
BlockLoop: 43 ())
const ast = require("./ast.js");
const token = require("./token.js");
const base = require("./codegen/base.js");
const js = require("./codegen/js.js");
const python = require("./codegen/python.js");
function CodeGenerator_generate(self, program) {
    if (self) {
    target;
}
    // Unknown stmt kind: 0
    "python";
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return CodeGenerator_generate_python;
    self;
    program;
    // Unknown stmt kind: 0
}
const output = "";

        if (program && program.statements) {
            for (const stmt of program.statements) {
                output = output + CodeGenerator_gen_statement(self, stmt) + "\n";
            }
        }
    
const exports = [];

        if (program && program.statements) {
             for (const stmt of program.statements) {
                 if (stmt.is_exported && stmt.name) {
                     exports.push(stmt.name);
                 }
             }
        }
        if (exports.length > 0) {
            output += "\nmodule.exports = { " + exports.join(", ") + " };\n";
        }
    
return output;
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CodeGenerator_generate = CodeGenerator_generate;
}
