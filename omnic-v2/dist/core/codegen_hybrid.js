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
        return impl.LanguageProfile_load(self);
    
    return self;
}
function LanguageProfile_render(self, template_name, data) {
    const result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render(self, template_name, data);
    
    return result;
}
function LanguageProfile_map_type(self, omni_type) {
    const result = omni_type;
    
        result = self.type_map[omni_type] || omni_type;
    
    return result;
}
function LanguageProfile_map_operator(self, op) {
    const result = op;
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_map_operator(self, op);
    
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
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.HybridCodeGenerator_indent(self, code);
    
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
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.check_native_lang(self, stmt);
        
    return result;
}
    if (stmt.kind == NODE_LET) {
    const value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return LanguageProfile_render(self.profile, "let_decl", null, name, null, stmt.name, value, null, value, null);
}
    if (stmt.kind == NODE_RETURN) {
    const value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return LanguageProfile_render(self.profile, "return_stmt", null, value, null, value, null);
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
        
    return LanguageProfile_render(self.profile, "fn_decl", null, name, null, stmt.name, params, null, params, body, null, body, null);
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
    return LanguageProfile_render(self.profile, "while_stmt", null, condition, null, cond, body, null, body, null);
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
    const value = HybridCodeGenerator_gen_expression(self, stmt.value);
    return stmt.name + " = " + value + self.profile.statement_end;
}
    if (stmt.kind == NODE_CALL) {
    return HybridCodeGenerator_gen_expression(self, stmt) + self.profile.statement_end;
}
    const result = "";
     result = "// Unknown stmt kind: " + stmt.kind; 
    return result;
}
function HybridCodeGenerator_gen_expression(self, expr) {
    if (expr == 0) {
    return "";
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
    if (expr.kind == NODE_STRING) {
    const result = "";
     result = '"' + expr.value + '"'; 
    return result;
}
    if (expr.kind == NODE_BOOL) {
    const result = "";
    
            const impl = require('./codegen_hybrid_impl.js');
            result = impl.gen_expression_bool(self, expr);
        
    return result;
}
    if (expr.kind == NODE_IDENTIFIER) {
    const result = "";
     result = expr.value || expr.name || ''; 
    return result;
}
    if (expr.kind == NODE_BINARY) {
    const left = HybridCodeGenerator_gen_expression(self, expr.left);
    const right = HybridCodeGenerator_gen_expression(self, expr.right);
    const op = LanguageProfile_map_operator(self.profile, expr.op);
    return LanguageProfile_render(self.profile, "binary_expr", null, left, null, left, op, null, op, right, null, right, null);
}
    if (expr.kind == NODE_CALL) {
    const callee = "";
    const args = "";
    
            callee = expr.name || (expr.callee ? expr.callee.value : '');
            if (expr.args) {
                args = expr.args.map(a => HybridCodeGenerator_gen_expression(self, a)).join(', ');
            }
        
    return LanguageProfile_render(self.profile, "call_expr", null, callee, null, callee, args, null, args, null);
}
    if (expr.kind == NODE_MEMBER) {
    const obj = HybridCodeGenerator_gen_expression(self, expr.object);
    return obj + "." + expr.member;
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
     has_alt = stmt.alternative && stmt.alternative.length > 0; 
    if (has_alt) {
    self.indent_level = self.indent_level + 1;
    const alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
    self.indent_level = self.indent_level;
    // Unknown stmt kind: 0
    1;
    return LanguageProfile_render(self.profile, "if_else_stmt", null, condition, null, cond, consequence, null, consequence, alternative, null, alternative, null);
}
    return LanguageProfile_render(self.profile, "if_stmt", null, condition, null, cond, consequence, null, consequence, null);
}
function HybridCodeGenerator_gen_struct(self, stmt) {
    const is_entity = false;
    
        is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    const constructor_body = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    
    const class_body = "    constructor(data = {}) {\n" + constructor_body + "    }\n";
    const out = LanguageProfile_render(self.profile, "class_decl", null, name, null, stmt.name, body, null, class_body, null);
    if (is_entity) {
    out = out + HybridCodeGenerator_gen_entity_repo(self, stmt);
}
    return out;
}
function HybridCodeGenerator_gen_entity_repo(self, stmt) {
    const result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.gen_entity_repo(stmt);
    
    return result;
}
function HybridCodeGenerator_gen_capsule(self, stmt) {
    const result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
        result = impl.gen_capsule(stmt);
    
    return result;
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
    
        const impl = require('./codegen_hybrid_impl.js');
        out = impl.gen_spawn_code(fn_name, args);
    
    return out;
}
function HybridCodeGenerator_gen_import(self, stmt) {
    const result = "";
    
        const impl = require('./codegen_hybrid_impl.js');
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
