const ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const token = require("./token.js");
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
function CodeGenerator_generate(self, program) {
    if (self.target == "python") {
    return CodeGenerator_generate_python(self, program);
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
                 if (stmt.kind == 60) exports.push(stmt.name); // FN
                 if (stmt.kind == 70) exports.push(stmt.name); // STRUCT
                 if (stmt.kind == 61) exports.push(stmt.name); // LET
             }
        }
        if (exports.length > 0) {
            output += "\nmodule.exports = { " + exports.join(", ") + " };\n";
        }
    
    return output;
}
function CodeGenerator_generate_python(self, program) {
    const output = "";
    
        if (program && program.statements) {
            for (const stmt of program.statements) {
                output = output + CodeGenerator_gen_stmt_py(self, stmt) + "\n";
            }
        }
    
    return output;
}
function CodeGenerator_gen_stmt_py(self, stmt) {
    const indent_str = "";
     indent_str = "    ".repeat(self.indent); 
    if (stmt.kind == 91) {
    return "";
}
    if (stmt.kind == NODE_IMPORT) {
    const path = stmt.path;
    const name = "";
    
             path = path.replace(".omni", "");
             path = path.replace(/\//g, "."); // core/token -> core.token
             if (path.startsWith(".")) path = path.substring(1); // ./core -> /core -> core (fix logic later if needed)
             if (path.startsWith(".")) path = path.substring(1);
             name = path.split(".").pop();
        
    return indent_str + "import " + path + " as " + name;
}
    if (stmt.kind == 80) {
    if (stmt.lang == "py" || stmt.lang == "python") {
    return stmt.code;
}
    return "";
}
    if (stmt.kind == NODE_LET) {
    return indent_str + stmt.name + " = " + CodeGenerator_gen_expr_py(self, stmt.value);
}
    if (stmt.kind == NODE_RETURN) {
    return indent_str + "return " + CodeGenerator_gen_expr_py(self, stmt.value);
}
    if (stmt.kind == NODE_FUNCTION) {
    const params = "";
     params = stmt.params.join(", "); 
    const decl = indent_str + "def " + stmt.name + "(" + params + "):\n";
    self.indent = self.indent + 1;
    const body = CodeGenerator_gen_block_py(self, stmt.body);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return decl + body;
}
    if (stmt.kind == NODE_STRUCT) {
    const decl = indent_str + "class " + stmt.name + ":\n";
    self.indent = self.indent + 1;
    const init_indent = "";
     init_indent = "    ".repeat(self.indent); 
    const assignments = "";
    
             if (stmt.fields.length == 0) {
                 assignments = init_indent + "    pass";
             } else {
                 for(let f of stmt.fields) {
                     assignments += init_indent + "    self." + f.name + " = data.get('" + f.name + "')\n";
                 }
             }
        
    const init_fn = init_indent + "def __init__(self, data=None):\n";
    init_fn = init_fn + init_indent + "    if data is None: data = {}\n";
    init_fn = init_fn + assignments + "\n";
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return decl + init_fn;
}
    if (stmt.kind == NODE_IF) {
    const cond = CodeGenerator_gen_expr_py(self, stmt.condition);
    const out = indent_str + "if " + cond + ":\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.consequence);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    if (stmt.alternative) {
    out = out + "\n" + indent_str + "else:\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.alternative);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
}
    return out;
}
    if (stmt.kind == NODE_WHILE) {
    const cond = CodeGenerator_gen_expr_py(self, stmt.condition);
    const out = indent_str + "while " + cond + ":\n";
    self.indent = self.indent + 1;
    out = out + CodeGenerator_gen_block_py(self, stmt.body);
    self.indent = self.indent;
    // Unknown stmt kind: 0
    1;
    return out;
}
    if (stmt.expr) {
    return indent_str + CodeGenerator_gen_expr_py(self, stmt.expr);
}
    return indent_str + "# Unknown stmt: " + stmt.kind;
}
function CodeGenerator_gen_block_py(self, block) {
    const out = "";
    
        if (!block.statements || block.statements.length == 0) {
             out = "    ".repeat(self.indent) + "pass";
        } else {
             for (const s of block.statements) {
                  out = out + CodeGenerator_gen_stmt_py(self, s) + "\n";
             }
        }
    
    return out;
}
function CodeGenerator_gen_expr_py(self, expr) {
    if (expr == 0) {
    return "None";
}
    if (expr.kind == NODE_LITERAL) {
    if (expr.value == "true") {
    return "True";
}
    if (expr.value == "false") {
    return "False";
}
    if (expr.value == "null") {
    return "None";
}
    return expr.value;
}
    if (expr.kind == NODE_BINARY) {
    const op = expr.op;
    if (op == "&&") {
    op = "and";
}
    if (op == "||") {
    op = "or";
}
    if (op == "!") {
    op = "not ";
}
    return CodeGenerator_gen_expr_py(self, expr.left) + " " + op + " " + CodeGenerator_gen_expr_py(self, expr.right);
}
    if (expr.kind == NODE_CALL) {
    const callee = CodeGenerator_gen_expr_py(self, expr.function);
    const args = "";
    
            let list = [];
            for(let a of expr.args) list.push(CodeGenerator_gen_expr_py(self, a));
            args = list.join(", ");
        
    return callee + "(" + args + ")";
}
    if (expr.kind == NODE_MEMBER) {
    return CodeGenerator_gen_expr_py(self, expr.target) + "." + expr.property;
}
    if (expr.kind == NODE_STRUCT_INIT) {
    const fields = "";
    
              let list = [];
              for(let f of expr.fields) {
                   list.push("'" + f.name + "': " + CodeGenerator_gen_expr_py(self, f.value));
              }
              fields = list.join(", ");
         
    return expr.name + "({ " + fields + " })";
}
    if (expr.kind == NODE_ARRAY) {
    const elems = "";
    
             let list = [];
             for (let e of expr.elements) list.push(CodeGenerator_gen_expr_py(self, e));
             elems = list.join(", ");
         
    return "[" + elems + "]";
}
    if (expr.kind == NODE_IDENTIFIER) {
    return expr.value;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    return CodeGenerator_gen_expr_py(self, expr.left) + " = " + CodeGenerator_gen_expr_py(self, expr.right);
}
     if (typeof(expr) == "string") return expr; 
    return "None";
}
function CodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return CodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == 80) {
    return stmt.code;
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
    return "function " + stmt.name + "(" + params + ") " + body;
}
    if (stmt.kind == NODE_STRUCT) {
    return CodeGenerator_gen_struct(self, stmt);
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

module.exports = { CodeGenerator };
