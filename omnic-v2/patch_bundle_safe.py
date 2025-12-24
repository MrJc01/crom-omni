
import os

BUNDLE = "dist/omni_bundle.js"

with open(BUNDLE, "r", encoding="utf-8") as f:
    content = f.read()

OLD_RUN_PART = """    if (command === "run") {
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
        var run_file = process.argv[3] || '';
        var is_app = false;
        var target = "js";
        
        for (var i = 3; i < process.argv.length; i++) {
             if (process.argv[i] === "--app") is_app = true;
             if (process.argv[i] === "--target" && process.argv[i+1]) target = process.argv[i+1];
        }
        
        if (is_app) target = "python";
        
        if (run_file === "") {
             CLI_error("Usage: omni run <file.omni> [--app] [--target python]");
             return 1;
        }
        
        var run_fs = require('fs');
        var run_path = require('path');
        var run_cp = require('child_process');
        
        var run_source = run_fs.readFileSync(run_file, 'utf8');
        var run_l = new_lexer(run_source);
        var run_p = new_parser(run_l);
        var run_program = Parser_parse_program(run_p);
        
        if (is_app || target === "python") {
             CLI_info("Compiling Native App (" + target + ")...");
             var run_gen = new_code_generator(target);
             var run_code = CodeGenerator_generate(run_gen, run_program);
             
             var run_ext = target === "python" ? ".py" : ".js";
             var run_outFile = run_file.replace(".omni", run_ext); 
             run_fs.writeFileSync(run_outFile, run_code);
             
             CLI_info("Executing " + run_outFile + "...");
             
             var run_cmd = target === "python" ? "python" : "node";
             var run_child = run_cp.spawn(run_cmd, [run_outFile], { stdio: 'inherit' });
             
             run_child.on('close', function(code) {
                 process.exit(code);
             });
        } else {
             CLI_info("VM Mode - Executing: " + run_file);
             var vm = OmniVM_new();
             OmniVM_run(vm, run_program);
        }
        return 0;
    }"""

if OLD_RUN_PART in content:
    content = content.replace(OLD_RUN_PART, NEW_RUN)
    print("Patched RUN command (Exact match).")
elif OLD_RUN_PART.replace('\n', '\r\n') in content:
    content = content.replace(OLD_RUN_PART.replace('\n', '\r\n'), NEW_RUN)
    print("Patched RUN command (CRLF match).")
else:
    print("Warning: Could not patch RUN command.")

FUNCS = """
function CodeGenerator_gen_stmt_py(self, stmt) {
    var indent_str = "    ".repeat(self.indent);

    if (stmt.kind === 91) return "";
    
    if (stmt.kind === 10) {
        var path = stmt.path;
        path = path.replace(".omni", "").replace(/\\//g, ".");
        if (path.startsWith(".")) path = path.substring(1);
        if (path.startsWith(".")) path = path.substring(1);
        var name = path.split(".").pop();
        return indent_str + "import " + path + " as " + name;
    }
    
    if (stmt.kind === 80) {
       if (stmt.lang === "py" || stmt.lang === "python") {
           // Preserve relative indentation: find minimum leading spaces and dedent by that amount
           var lines = stmt.code.split("\\n");
           var minLeading = 9999;
           for (var i = 0; i < lines.length; i++) {
               var line = lines[i];
               if (line.trim() !== "") {
                   var match = line.match(/^(\\s*)/);
                   var leading = match ? match[1].length : 0;
                   if (leading < minLeading) minLeading = leading;
               }
           }
           if (minLeading === 9999) minLeading = 0;
           
           var indented = [];
           for (var i = 0; i < lines.length; i++) {
               var line = lines[i];
               if (line.trim() !== "") {
                   // Remove minLeading spaces, then add indent_str
                   var dedented = line.substring(minLeading);
                   indented.push(indent_str + dedented);
               }
           }
           return indented.join("\\n");
       }
       return ""; 
    }
    
    if (stmt.kind === 2) {
        return indent_str + stmt.name + " = " + CodeGenerator_gen_expr_py(self, stmt.value);
    }
    
    if (stmt.kind === 7) {
        return indent_str + "return " + CodeGenerator_gen_expr_py(self, stmt.value);
    }
    
    if (stmt.kind === 4) {
        var decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
        var params = stmt.params.join(", ");
        var decl = indent_str + "def " + stmt.name + "(" + params + "):\\n";
        
        self.indent = self.indent + 1;
        var body = CodeGenerator_gen_block_py(self, stmt.body);
        self.indent = self.indent - 1;
        
        return decorators + decl + body;
    }
    
    if (stmt.kind === 70) {
        var decorators = CodeGenerator_gen_decorators_py(self, stmt.decorators);
        var decl = indent_str + "class " + stmt.name + ":\\n";
        
        self.indent = self.indent + 1;
        var init_indent = "    ".repeat(self.indent);
        var assignments = "";
        
        if (stmt.fields.length === 0) {
             assignments = init_indent + "    pass";
        } else {
             for(var i=0; i<stmt.fields.length; i++) {
                 var f = stmt.fields[i];
                 assignments += init_indent + "    self." + f.name + " = data.get('" + f.name + "')\\n";
             }
        }
        
        var init_fn = init_indent + "def __init__(self, data=None):\\n" +
                      init_indent + "    if data is None: data = {}\\n" +
                      assignments + "\\n";
        
        self.indent = self.indent - 1;
        return decorators + decl + init_fn;
    }
    
    if (stmt.kind === 13) {
        var cond = CodeGenerator_gen_expr_py(self, stmt.condition);
        var out = indent_str + "if " + cond + ":\\n";
        
        self.indent = self.indent + 1;
        out += CodeGenerator_gen_block_py(self, stmt.consequence);
        self.indent = self.indent - 1;
        
        if (stmt.alternative) {
            out += "\\n" + indent_str + "else:\\n";
            self.indent = self.indent + 1;
            out += CodeGenerator_gen_block_py(self, stmt.alternative);
            self.indent = self.indent - 1;
        }
        return out;
    }
    
    if (stmt.kind === 14) {
        var cond = CodeGenerator_gen_expr_py(self, stmt.condition);
        var out = indent_str + "while " + cond + ":\\n";
        self.indent = self.indent + 1;
        out += CodeGenerator_gen_block_py(self, stmt.body);
        self.indent = self.indent - 1;
        return out;
    }
    
    if (stmt.expr) {
        return indent_str + CodeGenerator_gen_expr_py(self, stmt.expr);
    }
    
    return indent_str + "# Unknown stmt: " + stmt.kind;
}

function CodeGenerator_gen_decorators_py(self, decorators) {
    var out = "";
    var indent_str = "    ".repeat(self.indent);
    
    if (decorators && decorators.length > 0) {
         for (var i=0; i<decorators.length; i++) {
             var d = decorators[i];
             var args = "";
             if (d.args && d.args.length > 0) {
                 var arg_list = [];
                 for (var j=0; j<d.args.length; j++) {
                     var a = d.args[j];
                     var val = CodeGenerator_gen_expr_py(self, a.value);
                     if (a.name && a.name !== "") {
                         arg_list.push(a.name + "=" + val);
                     } else {
                         arg_list.push(val);
                     }
                 }
                 args = "(" + arg_list.join(", ") + ")";
             }
             out += indent_str + "@" + d.name + args + "\\n";
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

function IngestionEngine_new() { return {}; }
function IngestionEngine_detect_language() { return ""; }
function IngestionEngine_analyze() { return {}; }
function IngestionEngine_generate_omni() { return ""; }
function IngestionEngine_report() {}
function IngestionEngine() {}

function PatternDatabase_new() { return {}; }
function PatternDatabase() {}

function GhostWriter_new() { return {}; }
function GhostWriter_analyze() { return {}; }
function GhostWriter_generate() { return ""; }
function GhostWriter_gen_class_diagram() { return ""; }
function GhostWriter_gen_flowchart() { return ""; }
function GhostWriter_gen_sequence_diagram() { return ""; }
function GhostWriter_gen_call_graph() { return ""; }
function GhostWriter_generate_docs() { return ""; }
function GhostWriter_explain() { return ""; }
function GhostWriter() {}

function CanonicalPattern_new() { return {}; }
function CanonicalPattern() {}

function cmd_ingest() {}
function cmd_graph() {}
function cmd_bootstrap() {}

function CapsuleGraph_new() { return {}; }
function CapsuleGraph_add_node() { return {}; }
function CapsuleGraph_add_edge() { return {}; }
function CapsuleGraph() {}

function EntityGraph_new() { return {}; }
function EntityGraph() {}

function FlowGraph_new() { return {}; }
function FlowGraph() {}

function get_c_runtime_header() { return ""; }
"""

content += "\n\n" + FUNCS + "\n\n" + DUMMIES

with open(BUNDLE, "w", encoding="utf-8") as f:
    f.write(content)

print("Paranoid patch complete.")
