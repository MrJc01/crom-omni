
const fs = require('fs');
const p = 'debug_bundle.js';
try {
    let c = fs.readFileSync(p, 'utf8');
    // Replace const token/lexer/parser/etc with var
    // To allow redeclaration.
    const vars = ['token', 'lexer', 'parser', 'ast', 'codegen_hybrid', 'cmd_run', 'cmd_compile'];
    
    let globalCount = 0;
    vars.forEach(v => {
        let regex = new RegExp(`const\\s+${v}\\s+=`, 'g');
        c = c.replace(regex, `var ${v} =`);
        globalCount++;
    });

    // Also replace `const terminal =` because that caused issues too?
    c = c.replace(/const\s+terminal\s+=/g, 'var terminal =');

    fs.writeFileSync(p, c);
    console.log("Patched debug_bundle.js");
} catch (e) {
    console.error(e);
}
