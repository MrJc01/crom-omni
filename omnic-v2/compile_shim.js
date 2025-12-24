const fs = require('fs');

// Bootstrap
try {
    require('./bootstrap/core/token.js');
    require('./bootstrap/core/ast.js');
} catch (e) {
    // If not in bootstrap, maybe try dist/core? But sticking to bootstrap plan.
    console.error("Bootstrap modules not found:", e.message);
    process.exit(1);
}

const LexerMod = require('./bootstrap/core/lexer.js');
const ParserMod = require('./bootstrap/core/parser.js');
const CodegenMod = require('./bootstrap/core/codegen.js');

const OMNI = {
    ...LexerMod,
    ...ParserMod,
    ...CodegenMod
};

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
    
    // Inject framework if needed? The build script doesn't seem to pass it yet.
    
    const code = OMNI.CodeGenerator_generate(gen, program);
    console.log(code);
} catch (e) {
    console.error("Compilation error:", e.message);
    process.exit(1);
}
