const _codegen_hybrid = require("./codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, _codegen_hybrid);
function CodeGenerator_generate(self, program) {
    let hybrid = new_code_generator(self.target);
    let h = HybridCodeGenerator_new(self.target);
    return HybridCodeGenerator_generate(h, program);
}

module.exports = { CodeGenerator_generate };
