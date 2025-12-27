const fs = require('fs');
const path = require('path');

const filePath = path.join('dist', 'core', 'codegen_hybrid.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Reading " + filePath);

// 1. Patch HybridCodeGenerator_gen_if
const genIfRegex = /function HybridCodeGenerator_gen_if\(self, stmt\) \{[\s\S]*?(?=function HybridCodeGenerator_gen_struct)/;
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
        {
            const impl = require ('./codegen_hybrid_impl.js');
            result = impl.LanguageProfile_render_impl(self.profile, "if_else_stmt", {
                condition: cond,
                consequence: consequence,
                alternative: alternative
            });
        }
        return result;
    }
    
    let result = "";
    {
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self.profile, "if_stmt", {
            condition: cond,
            consequence: consequence
        });
    }
    return result;
}
`;

if (genIfRegex.test(content)) {
    content = content.replace(genIfRegex, genIfPatch);
    console.log("Patched gen_if");
} else {
    console.log("WARN: gen_if not matched");
}


// 2. Patch NODE_FUNCTION inside gen_statement
const genFuncRegex = /if \(stmt\.kind == NODE_FUNCTION\) \{[\s\S]*?(?=if \(stmt\.kind == NODE_STRUCT\))/;
const genFuncPatch = `if (stmt.kind == NODE_FUNCTION) {
    let params = "";
    params = stmt.params ? stmt.params.join(", ") : ""; 
    
    let old_level = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = old_level;
    
    self.exports.push(stmt.name);
        
    let result = "";
    {
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self.profile, "fn_decl", {
            name: stmt.name,
            params: params,
            body: body
        });
    }
    return result;
}
    `;

if (genFuncRegex.test(content)) {
    content = content.replace(genFuncRegex, genFuncPatch);
    console.log("Patched NODE_FUNCTION");
} else {
    console.log("WARN: NODE_FUNCTION not matched");
}


// 3. Patch NODE_WHILE inside gen_statement
const genWhileRegex = /if \(stmt\.kind == NODE_WHILE\) \{[\s\S]*?(?=if \(stmt\.kind == 19\))/;
const genWhilePatch = `if (stmt.kind == NODE_WHILE) {
    let cond = HybridCodeGenerator_gen_expression(self, stmt.condition);
    
    let old_level = self.indent_level;
    self.indent_level = 1;
    let body = HybridCodeGenerator_gen_block(self, stmt.body);
    self.indent_level = old_level;

    let result = "";
    {
        const impl = require ('./codegen_hybrid_impl.js');
        result = impl.LanguageProfile_render_impl(self.profile, "while_stmt", {
            condition: cond,
            body: body
        });
    }
    return result;
}
    `;

if (genWhileRegex.test(content)) {
    content = content.replace(genWhileRegex, genWhilePatch);
    console.log("Patched NODE_WHILE");
} else {
    console.log("WARN: NODE_WHILE not matched");
}


// 4. Patch HybridCodeGenerator_gen_struct
const genStructRegex = /function HybridCodeGenerator_gen_struct\(self, stmt\) \{[\s\S]*?(?=function HybridCodeGenerator_gen_entity_repo)/;
const genStructPatch = `function HybridCodeGenerator_gen_struct(self, stmt) {
    let is_entity = false;
    is_entity = stmt.attributes && stmt.attributes.some(a => a.name === 'entity');
    
    let target = self.profile ? self.profile.name : 'js';
    
    let constructor_body = "";
    {
        const impl = require ('./codegen_hybrid_impl.js');
        // Passing target to support is_python check in impl
        constructor_body = impl.gen_struct_body(stmt, target);
    } 
    
    let class_body = "";
    if (target === 'python' || target === 'py') {
        class_body = "    def __init__(self, data=None):\\n";
        class_body += "        if data is None: data = {}\\n";
        class_body += constructor_body;
    } else {
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
}
`;

if (genStructRegex.test(content)) {
    content = content.replace(genStructRegex, genStructPatch);
    console.log("Patched gen_struct");
} else {
    console.log("WARN: gen_struct not matched");
}


// 5. Patch NODE_STRUCT_INIT inside gen_expression
const structInitRegex = /if \(expr\.kind == NODE_STRUCT_INIT\) \{[\s\S]*?(?=\s*let result =)/;
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
}
    `;

if (structInitRegex.test(content)) {
    content = content.replace(structInitRegex, structInitPatch);
    console.log("Patched NODE_STRUCT_INIT");
} else {
    console.log("WARN: NODE_STRUCT_INIT not matched");
}


// 6. Patch Exports logic in HybridCodeGenerator_generate
// Use stronger anchor to avoid matching } inside string literals
const exportsRegex = /if \(self\.exports\.length > 0\) \{[\s\S]*?(?=\s*\/\/ Auto-main execution)/;
const exportsPatch = `if (self.exports.length > 0) {
            const nl = String.fromCharCode(10);
            if (self.profile.name === "python") {
                // Generate __all__ = ["name", ...]
                let quoted = self.exports.map(e => '"' + e + '"').join(', ');
                output += nl + "__all__ = [" + quoted + "]" + nl;
            } else {
                // Default JS
                output += nl + "module.exports = { " + self.exports.join(", ") + " };" + nl;
            }
        }`;

if (exportsRegex.test(content)) {
    content = content.replace(exportsRegex, exportsPatch);
    console.log("Patched Auto-exports");
} else {
    console.log("WARN: Auto-exports not matched");
}

fs.writeFileSync(filePath, content);
console.log("Done.");
