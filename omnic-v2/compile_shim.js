const fs = require('fs');
const OMNI = require('./dist/omni_bundle.js');

// Args: build --target js <src>
// Index: 0=node, 1=shim, 2=build, 3=--target, 4=js, 5=src
const srcFile = process.argv[5];
if (!srcFile) {
    console.error("Usage: node compile_shim.js build --target js <src>");
    process.exit(1);
}

try {
    const source = fs.readFileSync(srcFile, 'utf-8');
    const l = OMNI.new_lexer(source);
    const p = OMNI.new_parser(l);
    const program = OMNI.Parser_parse_program(p);
    const gen = OMNI.new_code_generator('js');
    const code = OMNI.CodeGenerator_generate(gen, program);
    console.log(code);
} catch (e) {
    console.error("Compilation error:", e.message);
    process.exit(1);
}
