BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_version)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 10 (cmd_setup)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (cmd_package_self)
BlockLoop: 42 (()
BlockLoop: 66 (return)
BlockLoop: 10 (CLI_banner)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 10 (print)
BlockLoop: 42 (()
BlockLoop: 66 (return)
const token = require("./core/token.js");
const lexer = require("./core/lexer.js");
const parser = require("./core/parser.js");
const codegen_hybrid = require("./core/codegen_hybrid.js");
const vm = require("./core/vm.js");
const framework_adapter = require("./core/framework_adapter.js");
const ingestion = require("./core/ingestion.js");
const package_manager = require("./core/package_manager.js");
const contracts = require("./core/contracts.js");
const ghost_writer = require("./core/ghost_writer.js");
const bootstrap = require("./core/bootstrap.js");
const studio_engine = require("./core/studio_engine.js");
const studio_graph = require("./core/studio_graph.js");
const app_packager = require("./core/app_packager.js");
const tui = require("./core/tui.js");
const std = require("./lib/std.js");
const cli = require("./lib/cli.js");
const cmd_setup = require("./commands/cmd_setup.js");
const cmd_run = require("./commands/cmd_run.js");
const cmd_build = require("./commands/cmd_build.js");
const cmd_test = require("./commands/cmd_test.js");
const cmd_package = require("./commands/cmd_package.js");
const cmd_registry = require("./commands/cmd_registry.js");
const cmd_studio = require("./commands/cmd_studio.js");
function cmd_version() {
    CLI_banner;
    // Unknown stmt kind: 0
    print;
    "Version: ";
    CLI_version;
    // Unknown stmt kind: 0
    print;
    "";
    
        console.log(CLI_COLORS.dim + "Node.js: " + process.version + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Platform: " + process.platform + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Arch: " + process.arch + CLI_COLORS.reset);
    
}
function main() {
    const args_len = 0;
    
        args_len = process.argv.length;
    
    const command = "";
    
        command = process.argv[2] || '';
    
    if (command) {
    "setup";
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    const is_global = false;
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
        
    cmd_setup;
    is_global;
    return 0;
}
if (command) {
    "--version";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "package";
}
const self_package = false;
 self_package = process.argv[3] === '--self'; 
if (self_package) {
    cmd_package_self;
    // Unknown stmt kind: 0
    return 0;
}
// Unknown stmt kind: undefined
if (command) {
    "install";
}
const package_spec = "";
 package_spec = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "uninstall";
}
const package_name = "";
 package_name = process.argv[3] || ''; 
if (package_name) {
    "";
}
return 1;
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "list";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "update";
}
const package_name = "";
 package_name = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "search";
}
const query = "";
 query = process.argv[3] || ''; 
return 0;
// Unknown stmt kind: undefined
if (command) {
    "doctor";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "contracts";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "graph";
}
const input_file = "";
const output_file = "";
 
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
if (input_file) {
    "";
}
return 1;
// Unknown stmt kind: undefined
if (output_file) {
    "";
}

                const path = require('path');
                output_file = path.basename(input_file, '.omni') + '_architecture.md';
            
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "bootstrap";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "studio";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "ui";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "package";
}
const target = "";

            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--app' && process.argv[i + 1]) {
                    target = process.argv[i + 1];
                }
            }
            if (!target) {
                const platform = process.platform;
                if (platform === 'win32') target = 'windows';
                else if (platform === 'darwin') target = 'macos';
                else if (platform === 'linux') target = 'linux';
                else target = 'windows';
            }
        
const config = AppConfig_default;

            const fs = require('fs');
            const path = require('path');
            const configPath = path.join(process.cwd(), 'omni.config.json');
            
            if (fs.existsSync(configPath)) {
                const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (cfg.app) {
                    config.name = cfg.app.name || config.name;
                    config.version = cfg.app.version || config.version;
                    config.bundle_id = cfg.app.bundle_id || config.bundle_id;
                    config.description = cfg.app.description || config.description;
                }
            }
        
return 0;
// Unknown stmt kind: undefined
if (command) {
    "ingest";
}
const input_file = "";
const output_file = "";
 
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
if (input_file) {
    "";
}
return 1;
// Unknown stmt kind: undefined
if (output_file) {
    "";
}

                const path = require('path');
                output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
            
// Unknown stmt kind: undefined
return 0;
// Unknown stmt kind: undefined
if (command) {
    "run";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "build";
}
return 0;
// Unknown stmt kind: undefined
if (command) {
    "test-all";
}
return 0;
// Unknown stmt kind: undefined
const show_help = false;
 
        show_help = command === 'help' || command === '--help' || command === '-h'; 
    
if (command) {
    "";
}
return 0;
// Unknown stmt kind: undefined
if (show_help) {
    CLI_banner;
    // Unknown stmt kind: 0
    print;
    "Commands:";
    print;
    "  setup                          Start Global Setup Wizard";
    print;
    "  run <file.omni>                Execute instantly via VM";
    print;
    "  build                          Build from omni.config.json";
    print;
    "  test-all                       Validate all examples compile";
    print;
    "  package --self                 Create self-contained package";
    print;
    "  <input> <output> [options]     Compile to target";
    print;
    "";
    print;
    "Options:";
    print;
    "  --target <lang>     Target language (js, python)";
    print;
    "  --package <path>    Load external language package (.omni-pkg)";
    print;
    "  --framework <name>  Framework adapter (nextjs, laravel, android)";
    print;
    "  --coverage          Show AST coverage report";
    print;
    "  --version, -v       Show version";
    print;
    "";
    return 0;
}
const input_path = "";
const output_path = "";
const target_lang = "js";
const package_path = "";
const framework = "";
const show_coverage = false;

        input_path = process.argv[2];
        output_path = process.argv[3];
        
        for (let i = 4; i < process.argv.length; i++) {
            const arg = process.argv[i];
            if (arg === "--target" && (i + 1 < process.argv.length)) {
                target_lang = process.argv[++i];
            } else if (arg === "--package" && (i + 1 < process.argv.length)) {
                package_path = process.argv[++i];
            } else if (arg === "--framework" && (i + 1 < process.argv.length)) {
                framework = process.argv[++i];
            } else if (arg === "--coverage") {
                show_coverage = true;
            }
        }
    

        if (package_path) {
            const fs = require('fs');
            const path = require('path');
            
            if (fs.existsSync(package_path)) {
                CLI_info("Loading package: " + package_path);
                
                const grammarPath = fs.statSync(package_path).isDirectory() 
                    ? path.join(package_path, 'grammar.json')
                    : package_path;
                    
                if (fs.existsSync(grammarPath)) {
                    const targetDir = path.join(__dirname, '..', 'targets');
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    const profile = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'));
                    const profileName = profile.name || path.basename(package_path, '.omni-pkg');
                    fs.writeFileSync(
                        path.join(targetDir, profileName + '.json'),
                        JSON.stringify(profile, null, 2)
                    );
                    
                    target_lang = profileName;
                    CLI_success("Loaded profile: " + profileName);
                }
            } else {
                CLI_warning("Package not found: " + package_path);
            }
        }
    
const source = read_file;
const l = new_lexer;
const p = new_parser;
const program = Parser_parse_program;
const gen = new_code_generator;

        if (framework) {
            gen.framework = framework;
        }
    
const code = CodeGenerator_generate;

        if (show_coverage || gen.ast_node_count > 0) {
            const coverage = gen.ast_node_count > 0 
                ? (gen.generated_count / gen.ast_node_count * 100).toFixed(1)
                : 100;
            CLI_info("AST Coverage: " + coverage + "% (" + 
                gen.generated_count + "/" + gen.ast_node_count + " nodes)");
                
            if (coverage < 100) {
                CLI_warning("Some AST nodes were not generated");
            }
        }
    
// Unknown stmt kind: undefined

