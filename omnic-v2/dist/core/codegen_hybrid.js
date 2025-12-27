const _ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, _ast);
const _token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, _token);
class LanguageProfile {
    constructor(data = {}) {
        this.name = data.name;
        this.extension = data.extension;
        this.templates = data.templates;
        this.type_map = data.type_map;
        this.operators = data.operators;
        this.indent_str = data.indent_str;
        this.statement_end = data.statement_end;
        this.loaded = data.loaded;
    }
}
function new_map() {
     return {}; 
    return 0;
}
function LanguageProfile_new(name) {
    return new LanguageProfile({ name: name, extension: ".txt", templates: new_map(), type_map: new_map(), operators: new_map(), indent_str: "    ", statement_end: ";", loaded: false });
}
function LanguageProfile_load(self) {
    
        const impl = require ('./codegen_hybrid_impl.js');
        return impl.LanguageProfile_load_impl(self);
    
    return self;
}
function LanguageProfile_render(self, template_name, data) {
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self, template_name, data);
    
    return result;
}
function LanguageProfile_map_type(self, omni_type) {
    let result = omni_type;
    
        result = self.type_map[omni_type] || omni_type;
    
    return result;
}
function LanguageProfile_map_operator(self, op) {
    let result = op;
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_map_operator_impl(self, op);
    
    return result;
}
class HybridCodeGenerator {
    constructor(data = {}) {
        this.profile = data.profile;
        this.indent_level = data.indent_level;
        this.exports = data.exports;
        this.ast_node_count = data.ast_node_count;
        this.generated_count = data.generated_count;
    }
}
function HybridCodeGenerator_new(target) {
    let profile = LanguageProfile_new(target);
    profile = LanguageProfile_load(profile);
    return new HybridCodeGenerator({ profile: profile, indent_level: 0, exports: [], ast_node_count: 0, generated_count: 0 });
}
function HybridCodeGenerator_indent(self, code) {
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.HybridCodeGenerator_indent_impl(self, code);
    
    return result;
}
function HybridCodeGenerator_generate(self, program) {
    let output = "";
    output = LanguageProfile_render(self.profile, "program_header", null, null);
    
        self.exports = [];
        self.ast_node_count = 0;
        self.generated_count = 0;
        
        if (program && program.statements) {
            for (const stmt of program.statements) {
                self.ast_node_count++;
                const code = HybridCodeGenerator_gen_statement(self, stmt);
                if (code) {
                    output += code + "\n";
                    self.generated_count++;
                }
            }
        }
        
        // Auto-exports
        if (self.exports.length > 0) {
            if (self.profile.name === "python") {
                output += "\n__all__ = [" + self.exports.map(e => '"' + e + '"').join(', ') + "]\n";
            } else {
                output += "\nmodule.exports = { " + self.exports.join(", ") + " };\n";
            }
        }

        // Auto-main execution
        var nl = String.fromCharCode(10);
        if (self.profile.name === "python") {
                output += nl + "if __name__ == '__main__':" + nl + "    if 'main' in globals():" + nl + "        main()" + nl;
        } else {
                output += nl + "if (typeof main === 'function') { main(); }" + nl;
        }
        
        // AST Parity Validation
        const coverage = self.ast_node_count > 0 ? 
            (self.generated_count / self.ast_node_count * 100).toFixed(1) : 100;
        if (coverage < 100) {
            console.warn("[codegen] AST coverage: " + coverage + "% (" + 
                self.generated_count + "/" + self.ast_node_count + " nodes)");
        }
    
    return output;
}
function HybridCodeGenerator_gen_statement(self, stmt) {
    if (stmt.kind == NODE_IMPORT) {
    return HybridCodeGenerator_gen_import(self, stmt);
}
    if (stmt.kind == NODE_NATIVE) {
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.check_native_lang(self, stmt);
        
    return result;
}
    if (stmt.kind == NODE_LET) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "let_decl", {
                name: stmt.name,
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_RETURN) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "return_stmt", {
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_FUNCTION) {
    let params = "";
     params = stmt.params ? stmt.params.join(", ") : ""; 
    let saved_indent = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = saved_indent;
    
            self.exports.push(stmt.name);
        
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "fn_decl", {
                name: stmt.name,
                params: params,
                body: body
            });
        
    return result;
}
    if (stmt.kind == NODE_STRUCT) {
    return HybridCodeGenerator_gen_struct(self, stmt);
}
    if (stmt.kind == NODE_IF) {
    return HybridCodeGenerator_gen_if(self, stmt);
}
    if (stmt.kind == NODE_WHILE) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    let saved_indent = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = saved_indent;
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
        
    return result;
}
    if (stmt.kind == 19) {
    let iter = stmt.iterator;
    let col = HybridCodeGenerator_gen_expression(self, stmt.collection);
    let saved_indent = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = saved_indent;
    let code = "";
    
             if (self.profile.name === "python") {
                 code = "for " + iter + " in " + col + ":\n" + body;
             } else {
                 code = "for (const " + iter + " of " + col + ") {\n" + body + "}";
             }
         
    return code;
}
    if (stmt.kind == NODE_CAPSULE) {
    return HybridCodeGenerator_gen_capsule(self, stmt);
}
    if (stmt.kind == NODE_SPAWN) {
    return HybridCodeGenerator_gen_spawn(self, stmt);
}
    if (stmt.kind == NODE_INTERFACE) {
    return HybridCodeGenerator_gen_interface(self, stmt);
}
    if (stmt.kind == NODE_ASSIGNMENT) {
    let left = HybridCodeGenerator_gen_expression(self, stmt.left);
    let right = HybridCodeGenerator_gen_expression(self, stmt.right);
    return left + " = " + right + self.profile.statement_end;
}
    if (stmt.kind == NODE_CALL) {
    let callee = "";
    let function_node = 0;
     function_node = stmt.function || stmt.callee || stmt.name; 
    if (function_node) {
    let is_node = false;
     is_node = typeof function_node === "object"; 
    if (is_node) {
    callee = HybridCodeGenerator_gen_expression(self, function_node);
} else {
     callee = String(function_node); 
}
}
    let args = "";
    
            if (stmt.args && stmt.args.length > 0) {
                args = stmt.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result + self.profile.statement_end;
}
    if (stmt.kind == 20) {
    
            if (self.profile.name === 'python') self.profile.statement_end = '';
        
    let expr = HybridCodeGenerator_gen_expression(self, stmt.expr);
    if (expr == "") {
    return "";
}
    return expr + self.profile.statement_end;
}
    let result = "";
     result = "// Unknown stmt kind: " + stmt.kind; 
    return result;
}
function HybridCodeGenerator_gen_expression(self, expr) {
    let is_null = false;
     is_null = !expr; 
    if (is_null) {
    return "";
}
    if (expr.kind == NODE_NATIVE) {
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            // Check if lang matches
            let code = impl.check_native_lang(self, expr);
            if (code) {
                // Wrap in IIFE for expression context
                result = "(() => { " + code + " })()";
            } else {
                result = "null"; // Fallback for wrong target
            }
        
    return result;
}
    if (expr.kind == NODE_LITERAL) {
    let val = "";
     
            val = String(expr.value);
            // Map booleans
            if (val === "true") val = self.profile.templates.bool_true || "true";
            if (val === "false") val = self.profile.templates.bool_false || "false";
            if (val === "null") val = self.profile.templates.null || "null";
        
    return val;
}
    if (expr.kind == NODE_UNARY) {
    let op = expr.op;
    let operand = HybridCodeGenerator_gen_expression(self, expr.operand);
    if (op == "!") {
     
                 if (self.profile.operators && self.profile.operators.not) op = self.profile.operators.not;
                 else op = "!";
             
}
    return op + operand;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    let left = HybridCodeGenerator_gen_expression(self, expr.left);
    let right = HybridCodeGenerator_gen_expression(self, expr.right);
    return left + " = " + right;
}
    if (expr.kind == NODE_STRING) {
    let result = "";
     result = JSON.stringify(expr.value); 
    return result;
}
    if (expr.kind == NODE_BOOL) {
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.gen_expression_bool(self, expr);
        
    return result;
}
    if (expr.kind == NODE_IDENTIFIER) {
    let result = "";
     result = expr.value || expr.name || ''; 
    if (result == "print") {
    let is_js = false;
     is_js = self.profile.name !== "python"; 
    if (is_js) {
    return "console.log";
}
}
    return result;
}
    if (expr.kind == NODE_BINARY) {
    let left = HybridCodeGenerator_gen_expression(self, expr.left);
    let right = HybridCodeGenerator_gen_expression(self, expr.right);
    let op = LanguageProfile_map_operator(self.profile, expr.op);
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "binary_expr", {
                left: left,
                op: op,
                right: right
            });
        
    return result;
}
    if (expr.kind == NODE_CALL) {
    let callee = "";
    let function_node = 0;
    
             function_node = expr.function || expr.callee;
        
    if (function_node) {
    callee = HybridCodeGenerator_gen_expression(self, function_node);
}
    let args = "";
    
            if (expr.args) {
                args = expr.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result;
}
    if (expr.kind == NODE_MEMBER) {
    let obj = HybridCodeGenerator_gen_expression(self, expr.target);
    return obj + "." + expr.property;
}
    if (expr.kind == NODE_ARRAY) {
    let elements = "";
    
            if (expr.elements) {
                elements = expr.elements.map(e => HybridCodeGenerator_gen_expression(self, e)).join(', ');
            }
        
    return "[" + elements + "]";
}
    if (expr.kind == NODE_STRUCT_INIT) {
    let fields = "";
    let is_python = false;
     is_python = self.profile.name === "python"; 
    
            if (expr.fields && Array.isArray(expr.fields)) {
                if (is_python) {
                    fields = expr.fields.map(f => "'" + f.name + "': " + HybridCodeGenerator_gen_expression(self, f.value)).join(', ');
                } else {
                    fields = expr.fields.map(f => f.name + ": " + HybridCodeGenerator_gen_expression(self, f.value)).join(', ');
                }
            }
        
    if (is_python) {
    return expr.name + "({ " + fields + " })";
} else {
    return "new " + expr.name + "({ " + fields + " })";
}
}
    let result = "";
     result = String(expr.value || expr.name || ''); 
    return result;
}
function HybridCodeGenerator_gen_block(self, body) {
    let result = "";
    
        if (!body) return '';
        const statements = Array.isArray(body) ? body : (body.statements || []);
        if (!Array.isArray(statements)) return '';
        result = statements.map(s => {
            const code = HybridCodeGenerator_gen_statement(self, s);
            return HybridCodeGenerator_indent(self, code);
        }).join('\n');
        
        // Python requires 'pass' for empty blocks
        if (self.profile.name === 'python' && (!result || result.trim() === '')) {
            result = HybridCodeGenerator_indent(self, 'pass');
        }
    
    return result;
    return result;
}
function HybridCodeGenerator_gen_if(self, stmt) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    let saved_indent = self.indent_level;
    self.indent_level = 1;
    let consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = saved_indent;
    let has_alt = false;
     
        // Check for both array and Block object formats
        has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node (e.g., Block, IfStmt)
        ); 
    
    if (has_alt) {
    let saved_alt_indent = self.indent_level;
    self.indent_level = 1;
    let alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = saved_alt_indent;
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
        
    return result;
}
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self.profile, "if_stmt", {
            condition: cond,
            consequence: consequence
        });
    
    return result;
}
function HybridCodeGenerator_gen_struct(self, stmt) {
    let is_entity = false;
    
        is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    let constructor_body = "";
     {
        const impl = require ('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    } 
    let class_body = "";
    
        if (self.profile.name === "python") {
            class_body = "    def __init__(self, data={}):\n" + constructor_body;
        } else {
            class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
        }
    
    let out = "";
     {
        const impl = require ('./codegen_hybrid_impl.js');
        out = impl.LanguageProfile_render_impl(self.profile, "class_decl", {
            name: stmt.name,
            body: class_body
        });
    } 
    if (is_entity) {
    out = out + HybridCodeGenerator_gen_entity_repo(self, stmt);
}
    return out;
}
function HybridCodeGenerator_gen_entity_repo(self, stmt) {
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.gen_entity_repo(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_capsule(self, stmt) {
    let name = stmt.name;
    let result = "";
    
        const is_python = self.profile.name === "python";
        
        if (is_python) {
            result = "class " + name + ":\n";
            if (!stmt.body || !stmt.body.statements || stmt.body.statements.length === 0) {
                result += "    pass\n";
            } else {
                for (const s of stmt.body.statements) {
                    // Let/Var -> Class Attribute
                    if (s.kind == 2 || s.kind == 61) {
                         let val = HybridCodeGenerator_gen_expression(self, s.value);
                         result += "    " + s.name + " = " + val + "\n";
                    }
                    // Function -> Static Method
                    if (s.kind == 4 || s.kind == 94) {
                        let params = s.params ? s.params.join(", ") : "";
                        
                        let saved_indent = self.indent_level;
                        self.indent_level = 2; // Methods inside Class need 2 levels (8 spaces)
                        let body = HybridCodeGenerator_gen_block(self, s.body);
                        self.indent_level = saved_indent;
                        
                        let method = "    @staticmethod\n    def " + s.name + "(" + params + "):\n" + body + "\n";
                        result += method;
                    }
                }
            }
        } else {
            // JavaScript Object
            let props = "";
            if (stmt.body && stmt.body.statements) {
                for (const s of stmt.body.statements) {
                    if (s.kind == 2 || s.kind == 61) { 
                        let val = HybridCodeGenerator_gen_expression(self, s.value);
                        props += "    " + s.name + ": " + val + ",\n";
                    }
                    if (s.kind == 4 || s.kind == 94) { 
                        let params = s.params ? s.params.join(", ") : "";
                        self.indent_level++;
                        let body = HybridCodeGenerator_gen_block(self, s.body);
                        self.indent_level--;
                        props += "    " + s.name + "(" + params + ") {\n" + body + "    },\n";
                    }
                }
            }
            result = "// Capsule: " + name + "\nconst " + name + " = {\n" + props + "\n};\n";
        }
    
    return result;
}
function HybridCodeGenerator_gen_spawn(self, stmt) {
    let fn_name = "";
    let args = "";
    
        const call = stmt.call;
        fn_name = call?.name || call?.callee?.value || 'unknown';
        if (call?.args) {
            args = call.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
        }
    
    let out = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        out = impl.gen_spawn_code(fn_name, args);
    
    return out;
}
function HybridCodeGenerator_gen_import(self, stmt) {
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.gen_import(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_interface(self, stmt) {
    let is_service = false;
    
        is_service = stmt.attributes && stmt.attributes.some(a => a.name === 'service');
    
    if (is_service) {
    return HybridCodeGenerator_gen_service_client(self, stmt);
}
    return "// Interface: " + stmt.name;
}
function HybridCodeGenerator_gen_service_client(self, stmt) {
    let result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.gen_service_client(stmt);
    
    return result;
}
function new_code_generator(target) {
    return HybridCodeGenerator_new(target);
}
function CodeGenerator_generate(self, program) {
    return HybridCodeGenerator_generate(self, program);
}

module.exports = { new_map, LanguageProfile_new, LanguageProfile_load, LanguageProfile_render, LanguageProfile_map_type, LanguageProfile_map_operator, HybridCodeGenerator_new, HybridCodeGenerator_indent, HybridCodeGenerator_generate, HybridCodeGenerator_gen_statement, HybridCodeGenerator_gen_expression, HybridCodeGenerator_gen_block, HybridCodeGenerator_gen_if, HybridCodeGenerator_gen_struct, HybridCodeGenerator_gen_entity_repo, HybridCodeGenerator_gen_capsule, HybridCodeGenerator_gen_spawn, HybridCodeGenerator_gen_import, HybridCodeGenerator_gen_interface, HybridCodeGenerator_gen_service_client, new_code_generator, CodeGenerator_generate };
