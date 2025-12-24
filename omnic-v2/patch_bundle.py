
import os

BUNDLE = "dist/omni_bundle.js"

OLD_RUN = """    if (command === "run") {
    let run_file = "";
run_file = process.argv[3] || '';
    if (run_file === "") {
    CLI_error("Usage: omni run <file.omni>");
    return 1;
}

    CLI_info("VM Mode - Executing: " + run_file);
    let source = read_file(run_file);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let vm = OmniVM_new();
    OmniVM_run(vm, program);
    return 0;
}"""

NEW_RUN = """    if (command === "run") {
        let run_file = process.argv[3] || '';
        let is_app = false;
        let target = "js";
        
        for (let i = 3; i < process.argv.length; i++) {
             if (process.argv[i] === "--app") is_app = true;
             if (process.argv[i] === "--target" && process.argv[i+1]) target = process.argv[i+1];
        }
        
        if (is_app) target = "python";
        
        if (run_file === "") {
             CLI_error("Usage: omni run <file.omni> [--app] [--target python]");
             return 1;
        }
        
        let source = read_file(run_file);
        let l = new_lexer(source);
        let p = new_parser(l);
        let program = Parser_parse_program(p);
        
        if (is_app || target === "python") {
             CLI_info("Compiling Native App (" + target + ")...");
             let gen = new_code_generator(target);
             let code = CodeGenerator_generate(gen, program);
             
             const fs = require('fs');
             const path = require('path');
             const { spawn } = require('child_process');
             
             const ext = target === "python" ? ".py" : ".js";
             const outFile = run_file.replace(".omni", ext); 
             fs.writeFileSync(outFile, code);
             
             CLI_info("Executing " + outFile + "...");
             
             const cmd = target === "python" ? "python" : "node";
             const child = spawn(cmd, [outFile], { stdio: 'inherit' });
             
             child.on('close', (code) => {
                 process.exit(code);
             });
        } else {
             CLI_info("VM Mode - Executing: " + run_file);
             let vm = OmniVM_new();
             OmniVM_run(vm, program);
        }
        return 0;
    }"""

NEW_FUNCS = """
function CodeGenerator_gen_stmt_py(self, stmt) {
    let indent_str = "";
    indent_str = "    ".repeat(self.indent);

    if (stmt.kind === 91) { // PACKAGE
        return "";
    }
    if (stmt.kind === 10) { // IMPORT
        let path = stmt.path;
        let name = "";
        
         path = path.replace(".omni", "");
         path = path.replace(/\//g, "."); 
         if (path.startsWith(".")) path = path.substring(1); 
         if (path.startsWith(".")) path = path.substring(1);
         name = path.split(".").pop();
        
        return indent_str + "import " + path + " as " + name;
    }
    if (stmt.kind === 80) { // NATIVE
       if (stmt.lang === "py" || stmt.lang === "python") {
           return stmt.code;
       }
       return ""; 
    }
    if (stmt.kind === 2) { // LET
        return indent_str + stmt.name + " = " + CodeGenerator_gen_expr_py(self, stmt.value);
    }
    if (stmt.kind === 7) { // RETURN
        return indent_str + "return " + CodeGenerator_gen_expr_py(self, stmt.value);
    }
    if (stmt.kind === 4) { // FUNCTION
        let decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
        
        let params = "";
        params = stmt.params.join(", "); 
        let decl = indent_str + "def " + stmt.name + "(" + params + "):\n";
        
        self.indent = self.indent + 1;
        let body = CodeGenerator_gen_block_py(self, stmt.body);
        self.indent = self.indent - 1;
        
        return decorators + decl + body;
    }
    if (stmt.kind === 70) { // STRUCT
        let decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
    
        let decl = indent_str + "class " + stmt.name + ":\n";
        self.indent = self.indent + 1;
        let init_indent = "";
        init_indent = "    ".repeat(self.indent); 
        
        let assignments = "";
         if (stmt.fields.length === 0) {
             assignments = init_indent + "    pass";
         } else {
             for(let f of stmt.fields) {
                 assignments += init_indent + "    self." + f.name + " = data.get('" + f.name + "')\n";
             }
         }
        
        let init_fn = init_indent + "def __init__(self, data=None):\n";
        init_fn = init_fn + init_indent + "    if data is None: data = {}\n";
        init_fn = init_fn + assignments + "\n";
        
        self.indent = self.indent - 1;
        return decorators + decl + init_fn;
    }
    if (stmt.kind === 13) { // IF
        let cond = CodeGenerator_gen_expr_py(self, stmt.condition);
        let out = indent_str + "if " + cond + ":\n";
        
        self.indent = self.indent + 1;
        out = out + CodeGenerator_gen_block_py(self, stmt.consequence);
        self.indent = self.indent - 1;
        
        if (stmt.alternative) {
            out = out + "\n" + indent_str + "else:\n";
            self.indent = self.indent + 1;
            out = out + CodeGenerator_gen_block_py(self, stmt.alternative);
            self.indent = self.indent - 1;
        }
        return out;
    }
    if (stmt.kind === 14) { // WHILE
        let cond = CodeGenerator_gen_expr_py(self, stmt.condition);
        let out = indent_str + "while " + cond + ":\n";
        self.indent = self.indent + 1;
        out = out + CodeGenerator_gen_block_py(self, stmt.body);
        self.indent = self.indent - 1;
        return out;
    }
    if (stmt.expr) {
        return indent_str + CodeGenerator_gen_expr_py(self, stmt.expr);
    }
    return indent_str + "# Unknown stmt: " + stmt.kind;
}

function CodeGenerator_gen_decorators_py(self, decorators) {
    let out = "";
    let indent_str = "";
    indent_str = "    ".repeat(self.indent);
    
        if (decorators && decorators.length > 0) {
             for (let d of decorators) {
                 let args = "";
                 if (d.args && d.args.length > 0) {
                     let arg_list = [];
                     for (let a of d.args) {
                         let val = CodeGenerator_gen_expr_py(self, a.value);
                         if (a.name && a.name !== "") {
                             arg_list.push(a.name + "=" + val);
                         } else {
                             arg_list.push(val);
                         }
                     }
                     args = "(" + arg_list.join(", ") + ")";
                 }
                 out += indent_str + "@" + d.name + args + "\n";
             }
        }
    return out;
}
"""

DUMMIES = """
function FrameworkAdapter_new() { return {}; }
function FrameworkAdapter_nextjs() { return {}; }
function FrameworkAdapter_laravel() { return {}; }
function FrameworkAdapter_android() { return {}; }
function FrameworkGenerator_new() { return {}; }
function FrameworkGenerator_generate_structure() {}
function FrameworkGenerator_generate_ui() {}
function FrameworkGenerator_generate_server() {}
function FrameworkGenerator_add_file() {}
function FrameworkGenerator_write_all() {}

function FrameworkAdapter() {}
function FrameworkGenerator() {}

function ContractRegistry_new() { return {}; }
function ContractRegistry_list_interfaces() {}
function ContractRegistry() {}
"""

try:
    with open(BUNDLE, "r", encoding="utf-8") as f:
        content = f.read()
        
    print(f"Read {len(content)} bytes.")

    if OLD_RUN.strip() in content:
        content = content.replace(OLD_RUN.strip(), NEW_RUN.strip())
        print("Patched RUN command (Exact match).")
    else:
        # Try finding unique substring
        marker = 'CLI_info("VM Mode - Executing: " + run_file);'
        if marker in content:
            # Replace surrounding block hackily?
            # Or just warn.
            print("Warning: Exact match for RUN command failed. Attempting fuzzy replace...")
            # We can find start and end of block.
            # But simpler to just append NEW_RUN logic if replacement fails?
            # No, we need to remove old logic.
            # Let's hope exact match works. The string literal OLD_RUN comes from view_file.
            # Normalization of newlines?
            content = content.replace(OLD_RUN.replace('\r\n', '\n'), NEW_RUN)
            content = content.replace(OLD_RUN.replace('\n', '\r\n'), NEW_RUN)
            if marker in content: # Still there
                 print("Fuzzy replace failed.")

    content += "\n\n" + NEW_FUNCS + "\n\n" + DUMMIES

    with open(BUNDLE, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Bundle patched successfully.")

except Exception as e:
    print(f"Error: {e}")
