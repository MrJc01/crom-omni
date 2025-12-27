const fs = require('fs');
const path = require('path');

const filePath = path.join('dist', 'core', 'codegen_hybrid.js');
let content = fs.readFileSync(filePath, 'utf8');

// The original function body we want to replace
const originalFunction = `function HybridCodeGenerator_gen_struct(self, stmt) {
    let is_entity = false;
    
        is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    let constructor_body = "";
     {
        const impl = require ('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt);
    } 
    let class_body = "    constructor(data = {}) {\\n" + constructor_body + "    }\\n";
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
}`;

// Robust replacement pattern (since whitespace might vary slightly, use exact copy from file or regex)
// Using exact string matching first, if fails, fallback to regex-like
if (content.indexOf("function HybridCodeGenerator_gen_struct(self, stmt)") === -1) {
    console.error("Function header not found!");
    process.exit(1);
}

// Improved Python-aware function
const newFunction = `function HybridCodeGenerator_gen_struct(self, stmt) {
    let is_entity = false;
    is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    // Pass target to gen_struct_body
    let target = self.profile ? self.profile.name : 'js';
    
    let constructor_body = "";
    {
        const impl = require ('./codegen_hybrid_impl.js');
        constructor_body = impl.gen_struct_body(stmt, target);
    } 
    
    // Target-specific constructor syntax
    let class_body = "";
    
    if (target === 'python' || target === 'py') {
        class_body = "    def __init__(self, data=None):\\n";
        class_body += "        if data is None: data = {}\\n";
        class_body += constructor_body; // Uses self.x = data.x
    } else {
        // Default JS
        class_body = "    constructor(data = {}) {\\n" + constructor_body + "    }\\n";
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
}`;

// We will attempt to find the block by its start and end approximately
// or rely on a regex to replace the whole block
const regex = /function HybridCodeGenerator_gen_struct\(self, stmt\) \{[\s\S]*?return out;\r?\n\}/;

if (regex.test(content)) {
    content = content.replace(regex, newFunction);
    fs.writeFileSync(filePath, content);
    console.log("Patched HybridCodeGenerator_gen_struct successfully.");
} else {
    console.error("Could not match function body with regex.");
}

// Patch NODE_STRUCT_INIT in HybridCodeGenerator_gen_expression
const structInitRegex = /if \(expr\.kind == NODE_STRUCT_INIT\) \{[\s\S]*?return "new "\s*\+\s*expr\.name\s*\+\s*"\(\{ "\s*\+\s*fields\s*\+\s*" \}\)";\s*\}/;

const structInitPatch = `if (expr.kind == NODE_STRUCT_INIT) {
    let target = self.profile ? self.profile.name : 'js';
    let is_py = (target === 'python' || target === 'py');

    let fields = "";
    if (expr.fields && Array.isArray(expr.fields)) {
        fields = expr.fields.map(f => {
            let val = HybridCodeGenerator_gen_expression(self, f.value);
            if (is_py) return "'" + f.name + "': " + val;
            return f.name + ": " + val;
        }).join(', ');
    }

    if (is_py) {
        return expr.name + "({ " + fields + " })";
    }
    return "new " + expr.name + "({ " + fields + " })";
}`;

if (structInitRegex.test(content)) {
    content = content.replace(structInitRegex, structInitPatch);
    fs.writeFileSync(filePath, content);
    console.log("Patched NODE_STRUCT_INIT successfully.");
} else {
    console.log("Could not find NODE_STRUCT_INIT block to patch (already patched?).");
}

// Patch HybridCodeGenerator_gen_if
const genIfRegex = /function HybridCodeGenerator_gen_if\(self, stmt\) \{[\s\S]*?return result;\r?\n\}/;
const genIfPatch = `function HybridCodeGenerator_gen_if(self, stmt) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    
    let old_level = self.indent_level;
    self.indent_level = 1;
    let consequence = HybridCodeGenerator_gen_block(self, stmt.consequence);
    self.indent_level = old_level;
    
    let has_alt = false;
     
        // Check for both array and Block object formats
        has_alt = stmt.alternative && (
            (Array.isArray(stmt.alternative) && stmt.alternative.length > 0) ||
            (stmt.alternative.statements && stmt.alternative.statements.length > 0) ||
            (stmt.alternative.kind) // Any AST node
        ); 
    
    
    if (has_alt) {
        self.indent_level = 1;
        let alternative = HybridCodeGenerator_gen_block(self, stmt.alternative);
        self.indent_level = old_level;
        
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
}`;

if (genIfRegex.test(content)) {
    content = content.replace(genIfRegex, genIfPatch);
    fs.writeFileSync(filePath, content);
    console.log("Patched HybridCodeGenerator_gen_if successfully.");
} else {
    console.log("Could not find HybridCodeGenerator_gen_if to patch.");
}

// Patch NODE_FUNCTION in gen_statement
const genFuncRegex = /if \(stmt\.kind == NODE_FUNCTION\) \{[\s\S]*?return result;\r?\n\}/;
const genFuncPatch = `if (stmt.kind == NODE_FUNCTION) {
    let params = "";
     params = stmt.params ? stmt.params.join(", ") : ""; 
    
    let old_level = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = old_level;
    
            self.exports.push(stmt.name);
        
    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "fn_decl", {
                name: stmt.name,
                params: params,
                body: body
            });
        
    return result;
}`;

if (genFuncRegex.test(content)) {
    content = content.replace(genFuncRegex, genFuncPatch);
    fs.writeFileSync(filePath, content);
    console.log("Patched NODE_FUNCTION successfully.");
} else {
    console.log("Could not find NODE_FUNCTION block to patch.");
}

// Patch NODE_WHILE in gen_statement
const genWhileRegex = /if \(stmt\.kind == NODE_WHILE\) \{[\s\S]*?return result;\r?\n\}/;
const genWhilePatch = `if (stmt.kind == NODE_WHILE) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    
    let old_level = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = old_level;

    let result = "";
    
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
                condition: cond,
                body: body
            });
        
    return result;
}`;

if (genWhileRegex.test(content)) {
    content = content.replace(genWhileRegex, genWhilePatch);
    fs.writeFileSync(filePath, content);
    console.log("Patched NODE_WHILE successfully.");
} else {
    console.log("Could not find NODE_WHILE block to patch.");
}
