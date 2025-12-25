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
    let params = "";
     params = stmt.params.join(", "); 
    let body = CodeGenerator_gen_block(self, stmt.body);
    let decl = "function " + stmt.name + "(" + params + ") " + body;
    let decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
}
    if (stmt.kind == NODE_STRUCT) {
    let decl = CodeGenerator_gen_struct(self, stmt);
    let decorators_code = CodeGenerator_gen_decorators(self, stmt.name, stmt.decorators);
    if (decorators_code != "") {
    decl = decl + "\n" + decorators_code;
}
    return decl;
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
    
    // Inline bundling for std/ imports
    if (path.startsWith("std/") || path.startsWith("std\\")) {
        const fs = require('fs');
        const p = require('path');
        
        // Find project root (where std/ folder is)
        let projectRoot = process.cwd();
        let stdPath = p.join(projectRoot, path);
        
        // Also try parent directories
        if (!fs.existsSync(stdPath)) {
            let dir = projectRoot;
            for (let i = 0; i < 5; i++) {
                dir = p.dirname(dir);
                stdPath = p.join(dir, path);
                if (fs.existsSync(stdPath)) {
                    projectRoot = dir;
                    break;
                }
            }
        }
        
        if (fs.existsSync(stdPath)) {
            const source = fs.readFileSync(stdPath, 'utf-8');
            
            // Parse the library file
            const lexer_mod = require('../lexer.js');
            const parser_mod = require('../parser.js');
            
            const lexer = lexer_mod.Lexer_new(source);
            const tokens = lexer_mod.Lexer_tokenize(lexer);
            const parser = parser_mod.Parser_new(tokens);
            const ast = parser_mod.Parser_parse(parser);
            
            // Generate inline code
            let code = "// ===== INLINE: " + path + " =====\n";
            if (ast && ast.statements) {
                for (const s of ast.statements) {
                    let stmtCode = CodeGenerator_gen_statement(self, s);
                    if (stmtCode) code += stmtCode + "\n";
                }
            }
            code += "// ===== END: " + path + " =====\n";
            return code;
        } else {
            return "// [WARN] Could not find: " + path + " at " + stdPath;
        }
    }
    
    // Fallback: relative imports use require
    path = path.replace(".omni", ".js");
    if (path.startsWith(".") == false) path = "./" + path;
    let name = path.split("/").pop().replace(".js", "");
    return "const " + name + " = require(\"" + path + "\");\n" +
           "if (typeof global !== 'undefined') Object.assign(global, " + name + ");";
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
function CodeGenerator_gen_decorators(self, target_name, decorators) {
    let out = "";
    
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
