BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_IMPORT)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 42 (()
BlockLoop: 10 (stmt)
BlockLoop: 43 ())
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (path)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 31 (.)
BlockLoop: 10 (name)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 21 (+)
BlockLoop: 10 (name)
BlockLoop: 21 (+)
BlockLoop: 12 ( {\n    constructor(data = {}) {\n)
BlockLoop: 21 (+)
BlockLoop: 10 (assignments)
BlockLoop: 21 (+)
BlockLoop: 12 (    }\n})
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (out)
BlockLoop: 21 (+)
BlockLoop: 12 (})
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_LITERAL)
BlockLoop: 43 ())
BlockLoop: 66 (return)
BlockLoop: 31 (.)
BlockLoop: 10 (value)
BlockLoop: 64 (if)
BlockLoop: 28 (==)
BlockLoop: 10 (NODE_STRING)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 66 (return)
BlockLoop: 21 (+)
BlockLoop: 10 (expr)
BlockLoop: 31 (.)
BlockLoop: 10 (value)
BlockLoop: 21 (+)
BlockLoop: 12 (')
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
const base = require("./base.js");
const ast = require("../ast.js");
const token = require("../token.js");
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_IMPORT;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return CodeGenerator_gen_import;
    self;
    stmt;
    // Unknown stmt kind: 0
}
if (stmt) {
    kind;
}
if (stmt) {
    lang;
}
return stmt;
// Unknown stmt kind: undefined
return "";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return "let ";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
return "return ";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const params = "";
 params = stmt.params.join(", "); 
const body = CodeGenerator_gen_block;
const decl = "function ";
const decorators_code = CodeGenerator_gen_decorators;
if (decorators_code) {
    "";
}
// Unknown stmt kind: undefined
return decl;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const decl = CodeGenerator_gen_struct;
const decorators_code = CodeGenerator_gen_decorators;
if (decorators_code) {
    "";
}
// Unknown stmt kind: undefined
return decl;
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expression;
const cons = CodeGenerator_gen_block;
const alt = "";
if (stmt) {
    alternative;
}
// Unknown stmt kind: undefined
return "if (";
// Unknown stmt kind: undefined
if (stmt) {
    kind;
}
const cond = CodeGenerator_gen_expression;
const body = CodeGenerator_gen_block;
return "while (";
// Unknown stmt kind: undefined
if (stmt) {
    expr;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
return "// Unknown stmt kind: ";
// Unknown stmt kind: undefined
function CodeGenerator_gen_import(self, stmt) {
    const path = stmt;
    // Unknown stmt kind: 0
    path;
    
        path = path.replace(".omni", ".js");
        if (path.startsWith(".") == false) path = "./" + path;
        // Extrai nome do arquivo para variável: "./core/token.js" -> "token"
        let name = path.split("/").pop().replace(".js", "");
        // Gera: const token = require("./token.js");
        return "const " + name + " = require(\"" + path + "\");\n" +
               "if (typeof global !== 'undefined') Object.assign(global, " + name + ");";
    
    return "";
}
function CodeGenerator_gen_struct(self, stmt) {
    const name = stmt;
    // Unknown stmt kind: 0
    name;
    const assignments = "";
    
        for (const field of stmt.fields) {
             assignments = assignments + "        this." + field.name + " = data." + field.name + ";\n";
        }
    
    return "class ";
    // Unknown stmt kind: 0
    name;
    // Unknown stmt kind: 0
    " {\n    constructor(data = {}) {\n";
    // Unknown stmt kind: 0
    assignments;
    // Unknown stmt kind: 0
    "    }\n}";
}
function CodeGenerator_gen_block(self, block) {
    const out = "{\n";
    
        if (block && block.statements) {
            for (const s of block.statements) {
                out = out + "    " + CodeGenerator_gen_statement(self, s) + "\n";
            }
        }
    
    out = out;
    // Unknown stmt kind: 0
    "}";
    return out;
}
function CodeGenerator_gen_expression(self, expr) {
    if (expr) {
    0;
}
    // Unknown stmt kind: 0
    return "null";
    if (expr) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_LITERAL;
    // Unknown stmt kind: 0
    return expr;
    // Unknown stmt kind: 0
    value;
    if (expr) {
    kind;
}
    // Unknown stmt kind: 0
    NODE_STRING;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return "'";
    // Unknown stmt kind: 0
    expr;
    // Unknown stmt kind: 0
    value;
    // Unknown stmt kind: 0
    "'";
}
if (expr) {
    kind;
}
if (expr) {
    value;
}
return "true";
// Unknown stmt kind: undefined
return "false";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const args = "";

             let list = [];
             for(let a of expr.args) list.push(CodeGenerator_gen_expression(self, a));
             args = list.join(", ");
         
const callee = CodeGenerator_gen_expression;
const is_class = false;

             if (typeof expr.function.value === 'string') {
                 let val = expr.function.value;
                 let first = val.charAt(0);
                 is_class = (first >= "A" && first <= "Z") && (val.indexOf("_") == -1);
             }
         
if (is_class) {
    return "new ";
}
return callee;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return CodeGenerator_gen_expression;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const fields = "";

            let list = [];
            for(let f of expr.fields) {
                list.push(f.name + ": " + CodeGenerator_gen_expression(self, f.value));
            }
            fields = list.join(", ");
        
return "new ";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const elems = "";

            let list = [];
            for (let e of expr.elements) {
                list.push(CodeGenerator_gen_expression(self, e));
            }
            elems = list.join(", ");
        
return "[";
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
return expr;
// Unknown stmt kind: undefined
if (expr) {
    kind;
}
const left = CodeGenerator_gen_expression;
const right = CodeGenerator_gen_expression;
const code = "";
 code = left + " = " + right; 
return code;
// Unknown stmt kind: undefined
 if (typeof(expr) == "string") return expr; 
return expr;
// Unknown stmt kind: undefined
function CodeGenerator_gen_decorators(self, target_name, decorators) {
    const out = "";
    
        if (decorators && decorators.length > 0) {
             let dec_list = [];
             for (let d of decorators) {
                 let args = "[]";
                 if (d.args && d.args.length > 0) {
                     let arg_list = [];
                     for (let a of d.args) {
                         // struct init fields: {name: "x", value: expr}
                         let val = CodeGenerator_gen_expression(self, a.value);
                         if (a.name && a.name !== "") {
                             arg_list.push('{ name: "' + a.name + '", value: ' + val + ' }');
                         } else {
                             arg_list.push('{ value: ' + val + ' }');
                         }
                     }
                     args = "[" + arg_list.join(", ") + "]";
                 }
                 dec_list.push('{ name: "' + d.name + '", args: ' + args + ' }');
             }
             out = target_name + ".decorators = [" + dec_list.join(", ") + "];";
        }
    
    return out;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CodeGenerator_gen_statement = CodeGenerator_gen_statement;
    exports.CodeGenerator_gen_import = CodeGenerator_gen_import;
    exports.CodeGenerator_gen_struct = CodeGenerator_gen_struct;
    exports.CodeGenerator_gen_block = CodeGenerator_gen_block;
    exports.CodeGenerator_gen_expression = CodeGenerator_gen_expression;
    exports.CodeGenerator_gen_decorators = CodeGenerator_gen_decorators;
}
