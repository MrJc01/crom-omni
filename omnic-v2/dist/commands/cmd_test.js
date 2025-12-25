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
        
        // Find all example folders (with omni.conf.json)
        let entries = fs.readdirSync(examplesDir, { withFileTypes: true });
        let examples = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                let confPath = path.join(examplesDir, entry.name, 'omni.conf.json');
                if (fs.existsSync(confPath)) {
                    try {
                        let conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
                        examples.push({
                            name: entry.name,
                            conf: conf,
                            entryPath: path.join(examplesDir, entry.name, conf.entry || 'src/main.omni'),
                            modes: conf.targets || ['cmd']
                        });
                    } catch(e) {
                        console.log(CLI_COLORS().yellow + "  ⚠ " + CLI_COLORS().reset + entry.name + " (invalid config)");
                    }
                }
            }
        }
        
        // Sort by name
        examples.sort((a, b) => a.name.localeCompare(b.name));
        
        CLI_info("Found " + examples.length + " example folders");
        console.log("");
        
        let passed = 0;
        let failed = 0;
        let failures = [];
        let results = {};
        
        for (const ex of examples) {
            let modeResults = [];
            
            for (const mode of ex.modes) {
                try {
                    // Read and parse
                    if (!fs.existsSync(ex.entryPath)) {
                        throw new Error("Entry file not found: " + ex.entryPath);
                    }
                    
                    let source = fs.readFileSync(ex.entryPath, 'utf-8');
                    let l = new_lexer(source);
                    let p = new_parser(l);
                    let program = Parser_parse_program(p);
                    
                    // Determine target based on mode
                    let target = "js";
                    if (mode === "app") target = "python";
                    
                    // Generate code
                    let gen = HybridCodeGenerator_new(target);
                    let code = HybridCodeGenerator_generate(gen, program);
                    
                    // Check if code was generated
                    if (code && code.length > 0) {
                        modeResults.push({ mode, success: true });
                    } else {
                        modeResults.push({ mode, success: false, error: "Empty output" });
                    }
                } catch (e) {
                    modeResults.push({ mode, success: false, error: e.message });
                }
            }
            
            // Report results for this example
            let allPassed = modeResults.every(r => r.success);
            let modeStr = modeResults.map(r => 
                r.success ? CLI_COLORS().green + r.mode + CLI_COLORS().reset 
                          : CLI_COLORS().red + r.mode + CLI_COLORS().reset
            ).join(", ");
            
            if (allPassed) {
                passed++;
                console.log(CLI_COLORS().green + "  ✓ " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
            } else {
                failed++;
                let failedModes = modeResults.filter(r => !r.success);
                failures.push({ name: ex.name, errors: failedModes });
                console.log(CLI_COLORS().red + "  ✗ " + CLI_COLORS().reset + ex.name + CLI_COLORS().dim + " [" + modeStr + "]" + CLI_COLORS().reset);
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
                console.log(CLI_COLORS().dim + "  " + f.name + ":" + CLI_COLORS().reset);
                for (const err of f.errors) {
                    console.log(CLI_COLORS().dim + "    [" + err.mode + "] " + err.error.substring(0, 60) + CLI_COLORS().reset);
                }
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
