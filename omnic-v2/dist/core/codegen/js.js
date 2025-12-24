const base = require("./base.js");
if (typeof global !== 'undefined') Object.assign(global, base);
const ast = require("../ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const token = require("../token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return CodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == 80) {
    if (stmt.lang == "js" || stmt.lang == "javascript") {
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
    const params = "";
     params = stmt.params.join(", "); 
    const body = CodeGenerator_gen_block(self, stmt.body);
    const decl = "function " + stmt.name + "(" + params + ") " + body;
    const decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
}
    if (stmt.kind == NODE_STRUCT) {
    const decl = CodeGenerator_gen_struct(self, stmt);
    const decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
}
    if (stmt.kind == NODE_IF) {
    const cond = CodeGenerator_gen_expression(self, stmt.condition);
    const cons = CodeGenerator_gen_block(self, stmt.consequence);
    const alt = "";
    if (stmt.alternative) {
    alt = " else " + CodeGenerator_gen_block(self, stmt.alternative);
}
    return "if (" + cond + ") " + cons + alt;
}
    if (stmt.kind == NODE_WHILE) {
    const cond = CodeGenerator_gen_expression(self, stmt.condition);
    const body = CodeGenerator_gen_block(self, stmt.body);
    return "while (" + cond + ") " + body;
}
    if (stmt.expr) {
    return CodeGenerator_gen_expression(self, stmt.expr) + ";";
}
    return "// Unknown stmt kind: " + stmt.kind;
}
function CodeGenerator_gen_import(self, stmt) {
    const path = stmt.path;
    
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
    const name = stmt.name;
    const assignments = "";
    
        for (const field of stmt.fields) {
             assignments = assignments + "        this." + field.name + " = data." + field.name + ";\n";
        }
    
    return "class " + name + " {\n    constructor(data = {}) {\n" + assignments + "    }\n}";
}
function CodeGenerator_gen_block(self, block) {
    const out = "{\n";
    
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
    if (expr.kind == NODE_STRING) {
    return "'" + expr.value + "'";
}
    if (expr.kind == NODE_BOOL) {
    if (expr.value) {
    return "true";
}
    return "false";
}
    if (expr.kind == NODE_BINARY) {
    return CodeGenerator_gen_expression(self, expr.left) + " " + expr.op + " " + CodeGenerator_gen_expression(self, expr.right);
}
    if (expr.kind == NODE_CALL) {
    const args = "";
    
             let list = [];
             for(let a of expr.args) list.push(CodeGenerator_gen_expression(self, a));
             args = list.join(", ");
         
    const callee = CodeGenerator_gen_expression(self, expr.function);
    const is_class = false;
    
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
    const fields = "";
    
            let list = [];
            for(let f of expr.fields) {
                list.push(f.name + ": " + CodeGenerator_gen_expression(self, f.value));
            }
            fields = list.join(", ");
        
    return "new " + expr.name + "({ " + fields + " })";
}
    if (expr.kind == NODE_ARRAY) {
    const elems = "";
    
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
    const left = CodeGenerator_gen_expression(self, expr.left);
    const right = CodeGenerator_gen_expression(self, expr.right);
    const code = "";
     code = left + " = " + right; 
    return code;
}
     if (typeof(expr) == "string") return expr; 
    return expr;
}
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
