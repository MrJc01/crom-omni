const fs = require('fs');

const files = [
    'dist/core/token.js',
    'dist/core/lexer.js',
    'dist/core/parser.js',
    'dist/core/ast.js',
    'dist/core/codegen.js',
    'dist/core/io.js',
    'dist/main.js'
];

function patchFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove existing patch artifacts
    content = content.replace(/module\.exports\s*=\s*\{[^}]+\};\s*/g, '');
    content = content.replace(/Object\.assign\(global,\s*\w+\);\s*/g, '');
    content = content.replace("function print(s) { console.log(s); }\n", "");
    
    // Fix: Replace const with let for variables (V1 compiler generates const for let, but we need mutability)
    // We target lowercase identifiers (variables) and leave UPPERCASE (constants) as const.
    content = content.replace(/const\s+([a-z][a-zA-Z0-9_]*)\s*=/g, 'let $1 =');

    // Fix: Correct broken V1 loop logic generation: (((A !== B) && A) !== C) -> (A !== B && A !== C)
    // We use \1 to ensure the variable (A) matches exactly in both places.
    content = content.replace(/\(\(\(([^)]+) !== ([^)]+)\) && \1\) !== ([^)]+)\)/g, '($1 !== $2 && $1 !== $3)');

    // Handle Entry Point for main.js (strip it)
    let entryPoint = "";
    if (filePath.includes("main.js")) {
        const regexEntry = /if \(require\.main === module\) \{\s*main\(\);\s*\}/s;
        const match = regexEntry.exec(content);
        if (match) {
            entryPoint = match[0];
            content = content.replace(regexEntry, "");
        }
    }
    
    // 1. Collect exports
    const exports = [];
    const regexConst = /^(?:const|let)\s+(\w+)\s*=/gm;
    const regexFunc = /^function\s+(\w+)/gm;
    const regexClass = /^class\s+(\w+)/gm;
    
    let match;
    while ((match = regexConst.exec(content)) !== null) {
        let name = match[1];
        if (/^[A-Z]/.test(name) && name !== 'Object') { 
            exports.push(name);
        }
    }
    while ((match = regexFunc.exec(content)) !== null) {
         exports.push(match[1]);
    }
    while ((match = regexClass.exec(content)) !== null) {
         exports.push(match[1]);
    }
    
    // 2. Append module.exports
    if (exports.length > 0 && !filePath.includes("main.js")) {
        content += `\nmodule.exports = { ${exports.join(', ')} };\n`;
    }

    // 3. Globalize requires
    const regexRequire = /(?:const|let)\s+(\w+)\s*=\s*require\(([^)]+)\);/g;
    let requireUpdates = "";
    while ((match = regexRequire.exec(content)) !== null) {
        const name = match[1];
        if (name !== 'fs' && name !== 'path' && name !== 'process') {
             requireUpdates += `Object.assign(global, ${name});\n`;
        }
    }
    
    if (requireUpdates) {
        content += `\n${requireUpdates}`;
    }

    // 4. Add print and restore entry point to main.js
    if (filePath.includes("main.js")) {
        content = "function print(s) { console.log(s); }\n" + content;
        if (entryPoint) {
            content += `\n${entryPoint}\n`;
        }
    }

    fs.writeFileSync(filePath, content);
    console.log(`Patched ${filePath}`);
}

files.forEach(f => patchFile(f));
