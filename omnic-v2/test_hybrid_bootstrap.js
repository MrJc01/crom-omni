const ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
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
    const result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self, template_name, data);
    
    return result;
}
function LanguageProfile_map_type(self, omni_type) {
    const result = omni_type;
    
        result = self.type_map[omni_type] || omni_type;
    
    return result;
}
function LanguageProfile_map_operator(self, op) {
    const result = op;
    
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
    const profile = LanguageProfile_new(target);
    profile = LanguageProfile_load(profile);
    return new HybridCodeGenerator({ profile: profile, indent_level: 0, exports: [], ast_node_count: 0, generated_count: 0 });
}
function HybridCodeGenerator_indent(self, code) {
    const result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.HybridCodeGenerator_indent_impl(self, code);
    
    return result;
}
function HybridCodeGenerator_generate(self, program) {
    const output = "";
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
            output += "\nmodule.exports = { " + self.exports.join(", ") + " };\n";
        }

        // Auto-main execution
        // Auto-main execution
        native "js" {
            var nl = String.fromCharCode(10);
            if (self.profile.name === 'python') {
                 output += nl + "if __name__ == '__main__':" + nl + "    if 'main' in globals():" + nl + "        main()" + nl;
            } else {
                 output += nl + "if (typeof main === 'function') { main(); }" + nl;
            }
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
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.check_native_lang(self, stmt);
        
    return result;
}
    if (stmt.kind == NODE_LET) {
    const value = HybridCodeGenerator_gen_expression(self, stmt.value);
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "let_decl", {
                name: stmt.name,
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_RETURN) {
    const value = HybridCodeGenerator_gen_expression(self, stmt.value);
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "return_stmt", {
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_FUNCTION) {
    const params = "";
     params = stmt.params ? stmt.params.join(", ") : ""; 
    self.indent_level = self.indent_level + 1;
    const body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    
            if (stmt.is_exported) self.exports.push(stmt.name);
        
    const result = "";
    
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
    const cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    const body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
        
    return result;
}
    if (stmt.kind == 19) {
    const iter = stmt.iterator;
    const col = HybridCodeGenerator_gen_expression(self, stmt.collection);
    self.indent_level = self.indent_level + 1;
    const body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    const code = "";
    
             if (self.profile.name === 'python') {
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
    const left = HybridCodeGenerator_gen_expression(self, stmt.left);
    const right = HybridCodeGenerator_gen_expression(self, stmt.right);
    return left + " = " + right + self.profile.statement_end;
}
    if (stmt.kind == NODE_CALL) {
    const callee = "";
    const function_node = 0;
     function_node = stmt.function || stmt.callee || stmt.name; 
    if (function_node) {
    const is_node = false;
     is_node = typeof function_node === 'object'; 
    if (is_node) {
    callee = HybridCodeGenerator_gen_expression(self, function_node);
} else {
     callee = String(function_node); 
}
}
    const args = "";
    
            if (stmt.args && stmt.args.length > 0) {
                args = stmt.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result + self.profile.statement_end;
}
    if (stmt.kind == 20) {
    const expr = HybridCodeGenerator_gen_expression(self, stmt.expr);
    return expr + self.profile.statement_end;
}
    const result = "";
     result = "// Unknown stmt kind: " + stmt.kind; 
    return result;
}
function HybridCodeGenerator_gen_expression(self, expr) {
    const is_null = false;
     is_null = !expr; 
    if (is_null) {
    return "";
}
    if (expr.kind == NODE_NATIVE) {
    const result = "";
    
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
    const val = "";
     
            val = String(expr.value);
            // Map booleans
            if (val === 'true') val = self.profile.templates.bool_true || 'true';
            if (val === 'false') val = self.profile.templates.bool_false || 'false';
            if (val === 'null') val = self.profile.templates.null || 'null';
        
    return val;
}
    if (expr.kind == NODE_UNARY) {
    const op = expr.op;
    const operand = HybridCodeGenerator_gen_expression(self, expr.operand);
    if (op == "!") {
     
                 if (self.profile.operators && self.profile.operators.not) op = self.profile.operators.not;
                 else op = "!";
             
}
    return op + operand;
}
    if (expr.kind == NODE_ASSIGNMENT) {
    const left = HybridCodeGenerator_gen_expression(self, expr.left);
    const right = HybridCodeGenerator_gen_expression(self, expr.right);
    return left + " = " + right;
}
    if (expr.kind == NODE_STRING) {
    const result = "";
     result = JSON.stringify(expr.value); 
    return result;
}
    if (expr.kind == NODE_BOOL) {
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.gen_expression_bool(self, expr);
        
    return result;
}
    if (expr.kind == NODE_IDENTIFIER) {
    const result = "";
     result = expr.value || expr.name || ''; 
    if (result == "print") {
    return "console.log";
}
    return result;
}
    if (expr.kind == NODE_BINARY) {
    const left = HybridCodeGenerator_gen_expression(self, expr.left);
    const right = HybridCodeGenerator_gen_expression(self, expr.right);
    const op = LanguageProfile_map_operator(self.profile, expr.op);
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "binary_expr", {
                left: left,
                op: op,
                right: right
            });
        
    return result;
}
    if (expr.kind == NODE_CALL) {
    const callee = "";
    const function_node = 0;
    
             function_node = expr.function || expr.callee;
        
    if (function_node) {
    callee = HybridCodeGenerator_gen_expression(self, function_node);
}
    const args = "";
    
            if (expr.args) {
                args = expr.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result;
}
    if (expr.kind == NODE_MEMBER) {
    const obj = HybridCodeGenerator_gen_expression(self, expr.target);
    return obj + "." + expr.property;
}
    if (expr.kind == NODE_ARRAY) {
    const elements = "";
    
            if (expr.elements) {
                elements = expr.elements.map(e => HybridCodeGenerator_gen_expression(self, e)).join(', ');
            }
        
    return "[" + elements + "]";
}
    if (expr.kind == NODE_STRUCT_INIT) {
    const fields = "";
    
            if (expr.fields) {
                fields = Object.entries(expr.fields)
                    .map(([k, v]) => k + ": " + HybridCodeGenerator_gen_expression(self, v))
                    .join(', ');
            }
        
    return "new " + expr.name + "({ " + fields + " })";
}
    const result = "";
     result = String(expr.value || expr.name || ''); 
    return result;
}
function HybridCodeGenerator_gen_block(self, body) {
    const result = "";
    
        if (!body) return '';
        const statements = Array.isArray(body) ? body : (body.statements || []);
        if (!Array.isArray(statements)) return '';
        result = statements.map(s => {
            const code = HybridCodeGenerator_gen_statement(self, s);
            return HybridCodeGenerator_indent(self, code);
        }).join('\n');
    
    return result;
}
function HybridCodeGenerator_gen_if(self, stmt) {
    const cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    const consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    const has_alt = false;
     
        // Check for both array and Block object formats
        has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node (e.g., Block, IfStmt)
        ); 
    
    if (has_alt) {
    self.indent_level = self.indent_level + 1;
    const alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    const result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
        
    return result;
}
    const result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self.profile, "if_stmt", {
            condition: cond,
            consequence: consequence
        });
    
    return result;
}
function HybridCodeGenerator_gen_struct(self, stmt) {
    const is_entity = false;
    
        is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    const constructor_body = "";
     {
        const impl = require ('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    } 
    const class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
    const out = "";
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
    const result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.gen_entity_repo(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_capsule(self, stmt) {
    const name = stmt.name;
    const props = "";
    
        if (stmt.body && stmt.body.statements) {
            for (const s of stmt.body.statements) {
                // Let/Var -> Property
                if (s.kind == 2 || s.kind == 61) { // NODE_LET
                    let val = HybridCodeGenerator_gen_expression(self, s.value);
                    props += "    " + s.name + ": " + val + ",\n";
                }
                // Function -> Method
                if (s.kind == 4 || s.kind == 94) { // NODE_FUNCTION
                    let params = s.params ? s.params.join(", ") : "";
                    self.indent_level++;
                    let body = HybridCodeGenerator_gen_block(self, s.body);
                    self.indent_level--;
                    
                    // Remove braces from block because we want method syntax flow() { ... }
                    // Wait, gen_block returns { ... }. 
                    // Object method syntax: name(params) { ... }
                    // gen_block returns "{\n ... \n}"
                    
                    props += "    " + s.name + "(" + params + ") {\n" + body + "    },\n";
                }
            }
        }
    
    return "// Capsule: " + name + "\nconst " + name + " = {\n" + props + "\n};\n";
}
function HybridCodeGenerator_gen_spawn(self, stmt) {
    const fn_name = "";
    const args = "";
    
        const call = stmt.call;
        fn_name = call?.name || call?.callee?.value || 'unknown';
        if (call?.args) {
            args = call.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
        }
    
    const out = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        out = impl.gen_spawn_code(fn_name, args);
    
    return out;
}
function HybridCodeGenerator_gen_import(self, stmt) {
    const result = "";
    
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.gen_import(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_interface(self, stmt) {
    const is_service = false;
    
        is_service = stmt.attributes && stmt.attributes.some(a => a.name === 'service');
    
    if (is_service) {
    return HybridCodeGenerator_gen_service_client(self, stmt);
}
    return "// Interface: " + stmt.name;
}
function HybridCodeGenerator_gen_service_client(self, stmt) {
    const result = "";
    
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
