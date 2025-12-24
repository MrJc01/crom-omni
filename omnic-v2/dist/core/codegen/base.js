BlockLoop: 66 (return)
const ast = require("../ast.js");
const token = require("../token.js");
class CodeGenerator {
    constructor(data = {}) {
        this.target = data.target;
        this.indent = data.indent;
    }
}
function new_code_generator(target) {
    return new CodeGenerator({ target: target, indent: 0 });
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_code_generator = new_code_generator;
    exports.CodeGenerator = CodeGenerator;
}
