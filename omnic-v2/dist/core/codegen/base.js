const ast = require("../ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const token = require("../token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
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
