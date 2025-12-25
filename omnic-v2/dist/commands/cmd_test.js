const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const lexer = require("../core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const parser = require("../core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, parser);
const codegen_hybrid = require("../core/codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
function cmd_test_all() {
    CLI_banner();
    CLI_header("Testing All Examples");
    
        const fs = require('fs');
        const path = require('path');
        
        // Find examples directory
        let possiblePaths = [
            path.join(process.cwd(), 'examples'),
            path.join(__dirname, '..', '..', 'examples'),
            path.join(__dirname, '..', 'examples')
        ];
        
        let examplesDir = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                examplesDir = p;
                break;
            }
        }
        
        if (!examplesDir) {
            CLI_error("Examples directory not found");
            CLI_info("Run from project root: .\\omni test-all");
            return 1;
        }
        
        CLI_info("Examples directory: " + examplesDir);
        console.log("");
        
        // Get all .omni files
        let files = fs.readdirSync(examplesDir)
            .filter(f => f.endsWith('.omni'))
            .sort();
        
        CLI_info("Found " + files.length + " example files");
        console.log("");
        
        let passed = 0;
        let failed = 0;
        let failures = [];
        
        for (const file of files) {
            let filePath = path.join(examplesDir, file);
            let outputPath = path.join(examplesDir, file.replace('.omni', '.test.js'));
            
            try {
                // Read and parse
                let source = fs.readFileSync(filePath, 'utf-8');
                let l = new_lexer(source);
                let p = new_parser(l);
                let program = Parser_parse_program(p);
                
                // Generate code
                let gen = HybridCodeGenerator_new('js');
                let code = HybridCodeGenerator_generate(gen, program);
                
                // Check if code was generated
                if (code && code.length > 0) {
                    passed++;
                    console.log(CLI_COLORS().green + "  ✓ " + CLI_COLORS().reset + file);
                } else {
                    failed++;
                    failures.push({ file, error: "Empty output" });
                    console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + file + CLI_COLORS().dim + " (empty output)" + CLI_COLORS().reset);
                }
            } catch (e) {
                failed++;
                failures.push({ file, error: e.message });
                console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + file + CLI_COLORS().dim + " (" + e.message.substring(0, 40) + ")" + CLI_COLORS().reset);
            }
        }
        
        console.log("");
        console.log("────────────────────────────────────────");
        console.log("Results: " + CLI_COLORS().green + passed + " passed" + CLI_COLORS().reset + ", " + 
            (failed > 0 ? CLI_COLORS().red + failed + " failed" + CLI_COLORS().reset : "0 failed"));
        console.log("");
        
        if (failed > 0) {
            CLI_warning("Some examples failed to compile");
            for (const f of failures) {
                console.log(CLI_COLORS().dim + "  " + f.file + ": " + f.error + CLI_COLORS().reset);
            }
            return 1;
        } else {
            CLI_success("All examples compiled successfully!");
            return 0;
        }
    
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_test_all = cmd_test_all;
}
