const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAPPING = {
    'src/core/token.omni': 'bootstrap/core/token.js',
    'src/core/lexer.omni': 'bootstrap/core/lexer.js',
    'src/core/ast.omni': 'bootstrap/core/ast.js',
    'src/core/parser.omni': 'bootstrap/core/parser.js',
    'src/core/codegen.omni': 'bootstrap/core/codegen.js',
    'src/core/io.omni': 'bootstrap/core/io.js',
    'src/main.omni': 'bootstrap/main.js'
};

function ensureDirs() {
    if (!fs.existsSync('bootstrap')) fs.mkdirSync('bootstrap');
    if (!fs.existsSync('bootstrap/core')) fs.mkdirSync('bootstrap/core');
}

function compile() {
    console.log('\x1b[36m%s\x1b[0m', '=== Iniciando Bootstrap ===');
    
    for (const [src, dest] of Object.entries(MAPPING)) {
        const componentName = path.basename(src, '.omni');
        const coloredName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        
        process.stdout.write(`Compilando ${coloredName}... `);
        
        try {
            // node dist/main.js <input> <output>
            execSync(`node dist/main.js ${src} ${dest}`, { stdio: 'inherit' });
            console.log('\x1b[32m[OK]\x1b[0m');
        } catch (e) {
            console.log('\x1b[31m[ERRO]\x1b[0m');
            console.error(e.message);
            process.exit(1);
        }
    }
}

function patchFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove existing patch artifacts (in case of re-run on same file, though here we regenerate)
    content = content.replace(/module\.exports\s*=\s*\{[^}]+\};\s*/g, '');
    content = content.replace(/Object\.assign\(global,\s*\w+\);\s*/g, '');
    content = content.replace("function print(s) { console.log(s); }\n", "");

    // Handle Entry Point for main.js (strip it initially to append later)
    let entryPoint = "";
    if (filePath.includes("main.js")) {
        // Regex to find the main() call if present
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
        // Export constants starting with Uppercase (types/enums) 
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
    
    // 2. Append module.exports (exclude main.js from exporting everything typically, or just keep consistency)
    // The patch_dist logic excludes main.js from exporting.
    if (exports.length > 0 && !filePath.includes("main.js")) {
        content += `\nmodule.exports = { ${exports.join(', ')} };\n`;
    }

    // 3. Globalize requires
    // This makes imported modules available globally, simulating Omni's namespace visibility if needed.
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
        // Simple polyfill for print if not present
        content = "function print(s) { console.log(s); }\n" + content;
        if (entryPoint) {
            content += `\n${entryPoint}\n`;
        } else {
            content += `\nmain();\n`;
        }
    }

    fs.writeFileSync(filePath, content);
}

function patchAll() {
    console.log('\x1b[36m%s\x1b[0m', '=== Aplicando Patches ===');
    const files = Object.values(MAPPING);
    files.forEach(f => {
        process.stdout.write(`Patching ${f}... `);
        patchFile(f);
        console.log('\x1b[32m[OK]\x1b[0m');
    });
}

function main() {
    ensureDirs();
    compile();
    patchAll();
    console.log('\x1b[36m%s\x1b[0m', '=== Bootstrap Completo ===');
}

main();
