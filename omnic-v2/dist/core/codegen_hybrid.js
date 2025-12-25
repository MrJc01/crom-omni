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
    
        const impl = require('./codegen_hybrid_impl.js');
        return impl.LanguageProfile_load_impl(self);
    
    return self;
}
function LanguageProfile_render(self, template_name, data) {
    let result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
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
    
        const impl = require('./codegen_hybrid_impl.js');
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
    
        const impl = require('./codegen_hybrid_impl.js');
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
                let code = HybridCodeGenerator_gen_statement(self, stmt);
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
        
        // AST Parity Validation
        let coverage = self.ast_node_count > 0 ? 
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
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.check_native_lang(self, stmt);
        
    return result;
}
    if (stmt.kind == NODE_LET) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "let_decl", {
                name: stmt.name,
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_RETURN) {
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "return_stmt", {
                value: value
            });
        
    return result;
}
    if (stmt.kind == NODE_FUNCTION) {
    let params = "";
     params = stmt.params ? stmt.params.join(", ") : ""; 
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    
            if (stmt.is_exported) self.exports.push(stmt.name);
        
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
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
    self.indent_level = self.indent_level + 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
        
    return result;
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
    let value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return stmt.name + " = " + value + self.profile.statement_end;
}
    if (stmt.kind == NODE_CALL) {
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: stmt.name, // Simplified for direct calls
                args: "" // Simplified
            });
             // This block seems wrong/duplicate, referencing old logic
        
}
    if (stmt.kind == 20) {
    let expr = HybridCodeGenerator_gen_expression(self, stmt.expr);
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
    if (expr.kind == NODE_LITERAL) {
    let val = "";
     
            val = String(expr.value);
            // Map booleans
            if (val === 'true') val = self.profile.templates.bool_true || 'true';
            if (val === 'false') val = self.profile.templates.bool_false || 'false';
            if (val === 'null') val = self.profile.templates.null || 'null';
        
    return val;
}
    if (expr.kind == NODE_STRING) {
    let result = "";
     result = '"' + expr.value + '"'; 
    return result;
}
    if (expr.kind == NODE_BOOL) {
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.gen_expression_bool(self, expr);
        
    return result;
}
    if (expr.kind == NODE_IDENTIFIER) {
    let result = "";
     result = expr.value || expr.name || ''; 
    return result;
}
    if (expr.kind == NODE_BINARY) {
    let left = HybridCodeGenerator_gen_expression(self, expr.left);
    let right = HybridCodeGenerator_gen_expression(self, expr.right);
    let op = LanguageProfile_map_operator(self.profile, expr.op);
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "binary_expr", {
                left: left,
                op: op,
                right: right
            });
        
    return result;
}
    if (expr.kind == NODE_CALL) {
    let callee = "";
    let args = "";
    
            // Fix: Check expr.function for identifier, or expr.name if legacy
            if (expr.function && (expr.function.kind == 15 || expr.function.value)) {
                 callee = expr.function.value || expr.function.name;
            } else if (expr.name) {
                 callee = expr.name;
            } else if (expr.callee) { // Support legacy parser format if any
                 callee = expr.callee.value || expr.callee.name;
            }
            
            if (expr.args) {
                args = expr.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "call_expr", {
                callee: callee,
                args: args
            });
        
    return result;
}
    if (expr.kind == NODE_MEMBER) {
    let obj = HybridCodeGenerator_gen_expression(self, expr.object);
    return obj + "." + expr.member;
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
    
            if (expr.fields) {
                fields = Object.entries(expr.fields)
                    .map(([k, v]) => k + ": " + HybridCodeGenerator_gen_expression(self, v))
                    .join(', ');
            }
        
    return "new " + expr.name + "({ " + fields + " })";
}
    let result = "";
     result = String(expr.value || expr.name || ''); 
    return result;
}
function HybridCodeGenerator_gen_block(self, body) {
    let result = "";
    
        if (!body) return '';
        let statements = Array.isArray(body) ? body : (body.statements || []);
        if (!Array.isArray(statements)) return '';
        result = statements.map(s => {
            let code = HybridCodeGenerator_gen_statement(self, s);
            return HybridCodeGenerator_indent(self, code);
        }).join('\n');
    
    return result;
}
function HybridCodeGenerator_gen_if(self, stmt) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    self.indent_level = self.indent_level + 1;
    let consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let has_alt = false;
     
        // Check for both array and Block object formats
        has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node (e.g., Block, IfStmt)
        ); 
    
    if (has_alt) {
    self.indent_level = self.indent_level + 1;
    let alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    let result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
        
    return result;
}
    let result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
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
    
        const impl = require('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    
    let class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
    let out = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        out = impl.LanguageProfile_render_impl(self.profile, "class_decl", {
            name: stmt.name,
            body: class_body
        });
    
    if (is_entity) {
    out = out + HybridCodeGenerator_gen_entity_repo(self, stmt);
}
    return out;
}
function HybridCodeGenerator_gen_entity_repo(self, stmt) {
    let result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.gen_entity_repo(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_capsule(self, stmt) {
    let result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.gen_capsule(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_spawn(self, stmt) {
    let fn_name = "";
    let args = "";
    
        let call = stmt.call;
        fn_name = call?.name || call?.callee?.value || 'unknown';
        if (call?.args) {
            args = call.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
        }
    
    let out = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        out = impl.gen_spawn_code(fn_name, args);
    
    return out;
}
function HybridCodeGenerator_gen_import(self, stmt) {
    let result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
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
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.gen_service_client(stmt);
    
    return result;
}
function new_code_generator(target) {
    return HybridCodeGenerator_new(target);
}
function CodeGenerator_generate(self, program) {
    return HybridCodeGenerator_generate(self, program);
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_map = new_map;
    exports.LanguageProfile_new = LanguageProfile_new;
    exports.LanguageProfile_load = LanguageProfile_load;
    exports.LanguageProfile_render = LanguageProfile_render;
    exports.LanguageProfile_map_type = LanguageProfile_map_type;
    exports.LanguageProfile_map_operator = LanguageProfile_map_operator;
    exports.HybridCodeGenerator_new = HybridCodeGenerator_new;
    exports.HybridCodeGenerator_indent = HybridCodeGenerator_indent;
    exports.HybridCodeGenerator_generate = HybridCodeGenerator_generate;
    exports.HybridCodeGenerator_gen_statement = HybridCodeGenerator_gen_statement;
    exports.HybridCodeGenerator_gen_expression = HybridCodeGenerator_gen_expression;
    exports.HybridCodeGenerator_gen_block = HybridCodeGenerator_gen_block;
    exports.HybridCodeGenerator_gen_if = HybridCodeGenerator_gen_if;
    exports.HybridCodeGenerator_gen_struct = HybridCodeGenerator_gen_struct;
    exports.HybridCodeGenerator_gen_entity_repo = HybridCodeGenerator_gen_entity_repo;
    exports.HybridCodeGenerator_gen_capsule = HybridCodeGenerator_gen_capsule;
    exports.HybridCodeGenerator_gen_spawn = HybridCodeGenerator_gen_spawn;
    exports.HybridCodeGenerator_gen_import = HybridCodeGenerator_gen_import;
    exports.HybridCodeGenerator_gen_interface = HybridCodeGenerator_gen_interface;
    exports.HybridCodeGenerator_gen_service_client = HybridCodeGenerator_gen_service_client;
    exports.new_code_generator = new_code_generator;
    exports.CodeGenerator_generate = CodeGenerator_generate;
    exports.LanguageProfile = LanguageProfile;
    exports.HybridCodeGenerator = HybridCodeGenerator;
}
