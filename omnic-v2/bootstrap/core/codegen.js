let ast = require("./ast.js");
let token = require("./token.js");
class CodeGenerator {
    constructor(data = {}) {
    }
}
function new_code_generator() {
    let cg = new CodeGenerator({  });
    cg.exports = [];
    return cg;
}
function CodeGenerator_generate(self, program) {
    let output = "";
    
        if (program && program.statements) {
            for (const stmt of program.statements) {
                output = output + CodeGenerator_gen_statement(self, stmt) + "\n";
            }
            if (self.exports && self.exports.length > 0) {
                output += "\nmodule.exports = { " + self.exports.join(", ") + " };\n";
            }
        }
    
    return output;
}
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return CodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == 80) {
        let lang = stmt.lang || 'js';
        // Strip quotes
        if ((lang.startsWith('"') && lang.endsWith('"')) || (lang.startsWith("'") && lang.endsWith("'"))) {
            lang = lang.substring(1, lang.length - 1);
        }
        
        // Normalize
        if (lang === 'python') lang = 'py';
        if (lang === 'javascript') lang = 'js';
        
        let target = self.target || 'js';
        if (target === 'python') target = 'py';
        if (target === 'javascript') target = 'js';
        
        if (lang === target) {
            return stmt.code;
        }
        return "";
    }
    if (stmt.kind == NODE_LET) {
    return "let " + stmt.name + " = " + CodeGenerator_gen_expression(self, stmt.value) + ";";
}
    if (stmt.kind == NODE_RETURN) {
    return "return " + CodeGenerator_gen_expression(self, stmt.value) + ";";
}
    if (stmt.kind == NODE_FUNCTION) {
    if (self.exports) self.exports.push(stmt.name);
    let params = "";
     params = stmt.params.join(", "); 
    let body = CodeGenerator_gen_block(self, stmt.body);
    return "function " + stmt.name + "(" + params + ") " + body;
}
    if (stmt.kind == NODE_STRUCT) {
    return CodeGenerator_gen_struct(self, stmt);
}
    if (stmt.kind == NODE_IF) {
    let cond = CodeGenerator_gen_expression(self, stmt.condition);
    let cons = CodeGenerator_gen_block(self, stmt.consequence);
    let alt = "";
    if (stmt.alternative) {
    alt = " else " + CodeGenerator_gen_block(self, stmt.alternative);
}
    return "if (" + cond + ") " + cons + alt;
}
    if (stmt.kind == NODE_WHILE) {
    let cond = CodeGenerator_gen_expression(self, stmt.condition);
    let body = CodeGenerator_gen_block(self, stmt.body);
    return "while (" + cond + ") " + body;
}
    if (stmt.expr) {
    return CodeGenerator_gen_expression(self, stmt.expr) + ";";
}
    return "// Unknown stmt kind: " + stmt.kind;
}
function CodeGenerator_gen_import(self, stmt) {
    let path = stmt.path;
    
        path = path.replace(".omni", ".js");
        if (path.startsWith(".") == false) path = "./" + path;
        // Extrai nome do arquivo para variável: "./core/token.js" -> "token"
        let name = path.split("/").pop().replace(".js", "");
        // Gera: const _token = require("./token.js");
        // Evita sombreamento: se o modulo exporta 'token', e a var se chama 'token', token() falha se for usada como funcao
        return "const _" + name + " = require(\"" + path + "\");\n" + 
               "if (typeof global !== 'undefined') Object.assign(global, _" + name + ");";
    
    return "";
}
function CodeGenerator_gen_struct(self, stmt) {
    let name = stmt.name;
    let assignments = "";
    
        for (const field of stmt.fields) {
             assignments = assignments + "        this." + field.name + " = data." + field.name + ";\n";
        }
    
    return "class " + name + " {\n    constructor(data = {}) {\n" + assignments + "    }\n}";
}
function CodeGenerator_gen_block(self, block) {
    let out = "{\n";
    
        if (block && block.statements) {
            for (const s of block.statements) {
                out = out + "    " + CodeGenerator_gen_statement(self, s) + "\n";
            }
        }
    
    out = out + "}";
    return out;
}
function CodeGenerator_gen_expression(self, expr) {
    if (expr == 0) {
    return "null";
}
    if (expr.kind == NODE_LITERAL) {
    return expr.value;
}
    if (expr.kind == NODE_BINARY) {
    return CodeGenerator_gen_expression(self, expr.left) + " " + expr.op + " " + CodeGenerator_gen_expression(self, expr.right);
}
    if (expr.kind == NODE_CALL) {
    let args = "";
    
             let list = [];
             for(let a of expr.args) list.push(CodeGenerator_gen_expression(self, a));
             args = list.join(", ");
         
    let callee = CodeGenerator_gen_expression(self, expr.function);
    let is_class = false;
    
             if (typeof expr.function.value === 'string') {
                 let val = expr.function.value;
                 let first = val.charAt(0);
                 is_class = (first >= "A" && first <= "Z") && (val.indexOf("_") == -1);
             }
         
    if (is_class) {
    return "new " + callee + "(" + args + ")";
}
    return callee + "(" + args + ")";
}
    if (expr.kind == NODE_MEMBER) {
    return CodeGenerator_gen_expression(self, expr.target) + "." + expr.property;
}
    if (expr.kind == NODE_STRUCT_INIT) {
    let fields = "";
    
            let list = [];
            for(let f of expr.fields) {
                list.push(f.name + ": " + CodeGenerator_gen_expression(self, f.value));
            }
            fields = list.join(", ");
        
    return "new " + expr.name + "({ " + fields + " })";
}
    if (expr.kind == NODE_ARRAY) {
    let elems = "";
    
            let list = [];
            for (let e of expr.elements) {
                list.push(CodeGenerator_gen_expression(self, e));
            }
            elems = list.join(", ");
        
    return "[" + elems + "]";
}
    if (expr.kind == NODE_IDENTIFIER) {
    return expr.value;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    let left = CodeGenerator_gen_expression(self, expr.left);
    let right = CodeGenerator_gen_expression(self, expr.right);
    let code = "";
     code = left + " = " + right; 
    return code;
}
     if (typeof(expr) == "string") return expr; 
    return expr;
}

// --- [Bootstrap Auto-Patch] ---
// Exporta símbolos para require()
module.exports = { CodeGenerator, new_code_generator, CodeGenerator_generate, CodeGenerator_gen_statement, CodeGenerator_gen_import, CodeGenerator_gen_struct, CodeGenerator_gen_block, CodeGenerator_gen_expression };

// Injeta no Global para simular o namespace plano do Omni
Object.assign(global, module.exports);
