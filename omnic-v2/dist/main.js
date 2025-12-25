const token = require("./core/token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
const lexer = require("./core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const parser = require("./core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, parser);
const codegen_hybrid = require("./core/codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
const vm = require("./core/vm.js");
if (typeof global !== 'undefined') Object.assign(global, vm);
const framework_adapter = require("./core/framework_adapter.js");
if (typeof global !== 'undefined') Object.assign(global, framework_adapter);
const ingestion = require("./core/ingestion.js");
if (typeof global !== 'undefined') Object.assign(global, ingestion);
const package_manager = require("./core/package_manager.js");
if (typeof global !== 'undefined') Object.assign(global, package_manager);
const contracts = require("./core/contracts.js");
if (typeof global !== 'undefined') Object.assign(global, contracts);
const ghost_writer = require("./core/ghost_writer.js");
if (typeof global !== 'undefined') Object.assign(global, ghost_writer);
const bootstrap = require("./core/bootstrap.js");
if (typeof global !== 'undefined') Object.assign(global, bootstrap);
const studio_engine = require("./core/studio_engine.js");
if (typeof global !== 'undefined') Object.assign(global, studio_engine);
const studio_graph = require("./core/studio_graph.js");
if (typeof global !== 'undefined') Object.assign(global, studio_graph);
const app_packager = require("./core/app_packager.js");
if (typeof global !== 'undefined') Object.assign(global, app_packager);
const tui = require("./core/tui.js");
if (typeof global !== 'undefined') Object.assign(global, tui);
const terminal = require("./lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const std = require("./lib/std.js");
if (typeof global !== 'undefined') Object.assign(global, std);
const mod_cmd_setup = require("./commands/cmd_setup.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_setup);
const mod_cmd_run = require("./commands/cmd_run.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_run);
const mod_cmd_build = require("./commands/cmd_build.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_build);
const mod_cmd_test = require("./commands/cmd_test.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_test);
const mod_cmd_package = require("./commands/cmd_package.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_package);
const mod_cmd_registry = require("./commands/cmd_registry.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_registry);
const mod_cmd_studio = require("./commands/cmd_studio.js");
if (typeof global !== 'undefined') Object.assign(global, mod_cmd_studio);
function cmd_version() {
    CLI_banner();
    print("Version: " + CLI_version());
    print("");
    
        console.log(CLI_COLORS.dim + "Node.js: " + process.version + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Platform: " + process.platform + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Arch: " + process.arch + CLI_COLORS.reset);
    
}
function main() {
    let args_len = 0;
    
        args_len = process.argv.length;
    
    let command = "";
    
        command = process.argv[2] || '';
    
    if (command == "setup") {
    let is_global = false;
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
        
    cmd_setup(is_global);
    return 0;
}
    if (command == "--version" || command == "-v" || command == "version") {
    cmd_version();
    return 0;
}
    if (command == "package") {
    let self_package = false;
     self_package = process.argv[3] === '--self'; 
    if (self_package) {
    cmd_package_self();
    return 0;
}
}
    if (command == "install") {
    let package_spec = "";
     package_spec = process.argv[3] || ''; 
    cmd_install(package_spec);
    return 0;
}
    if (command == "uninstall") {
    let package_name = "";
     package_name = process.argv[3] || ''; 
    if (package_name == "") {
    terminal.CLI_error("Usage: omni uninstall <package_name>");
    return 1;
}
    cmd_uninstall(package_name);
    return 0;
}
    if (command == "list") {
    cmd_list();
    return 0;
}
    if (command == "update") {
    let package_name = "";
     package_name = process.argv[3] || ''; 
    cmd_update(package_name);
    return 0;
}
    if (command == "search") {
    let query = "";
     query = process.argv[3] || ''; 
    cmd_search(query);
    return 0;
}
    if (command == "doctor") {
    cmd_doctor();
    return 0;
}
    if (command == "contracts") {
    cmd_contracts();
    return 0;
}
    if (command == "graph") {
    let input_file = "";
    let output_file = "";
     
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
    if (input_file == "") {
    CLI_error("Usage: omni graph <input.omni> [output.md]");
    CLI_info("Generates architecture diagrams in Mermaid format");
    return 1;
}
    if (output_file == "") {
    
                const path = require('path');
                output_file = path.basename(input_file, '.omni') + '_architecture.md';
            
}
    cmd_graph(input_file, output_file);
    return 0;
}
    if (command == "bootstrap") {
    cmd_bootstrap();
    return 0;
}
    if (command == "studio") {
    cmd_studio_cli();
    return 0;
}
    if (command == "ui") {
    cmd_tui();
    return 0;
}
    if (command == "package") {
    let target = "";
    
            for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--app' && process.argv[i + 1]) {
                    target = process.argv[i + 1];
                }
            }
            if (!target) {
                let platform = process.platform;
                if (platform === 'win32') target = 'windows';
                else if (platform === 'darwin') target = 'macos';
                else if (platform === 'linux') target = 'linux';
                else target = 'windows';
            }
        
    let config = AppConfig_default();
    
            const fs = require('fs');
            const path = require('path');
            let configPath = path.join(process.cwd(), 'omni.config.json');
            
            if (fs.existsSync(configPath)) {
                let cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (cfg.app) {
                    config.name = cfg.app.name || config.name;
                    config.version = cfg.app.version || config.version;
                    config.bundle_id = cfg.app.bundle_id || config.bundle_id;
                    config.description = cfg.app.description || config.description;
                }
            }
        
    cmd_package_app(target, config);
    return 0;
}
    if (command == "ingest") {
    let input_file = "";
    let output_file = "";
     
            input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
        
    if (input_file == "") {
    CLI_error("Usage: omni ingest <legacy_file> <output.omni>");
    return 1;
}
    if (output_file == "") {
    
                const path = require('path');
                output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
            
}
    cmd_ingest(input_file, output_file);
    return 0;
}
    if (command == "run") {
    cmd_run();
    return 0;
}
    if (command == "build") {
    cmd_build();
    return 0;
}
    if (command == "test-all") {
    cmd_test_all();
    return 0;
}
    let show_help = false;
     
        show_help = command === 'help' || command === '--help' || command === '-h'; 
    
    if (command == "" || args_len < 3) {
    CLI_info("Launching interactive mode...");
    cmd_tui();
    return 0;
}
    if (show_help) {
    CLI_banner();
    print("Commands:");
    print("  setup                          Start Global Setup Wizard");
    print("  run <file.omni>                Execute instantly via VM");
    print("  build                          Build from omni.config.json");
    print("  test-all                       Validate all examples compile");
    print("  package --self                 Create self-contained package");
    print("  <input> <output> [options]     Compile to target");
    print("");
    print("Options:");
    print("  --target <lang>     Target language (js, python)");
    print("  --package <path>    Load external language package (.omni-pkg)");
    print("  --framework <name>  Framework adapter (nextjs, laravel, android)");
    print("  --coverage          Show AST coverage report");
    print("  --version, -v       Show version");
    print("");
    return 0;
}
    let input_path = "";
    let output_path = "";
    let target_lang = "js";
    let package_path = "";
    let framework = "";
    let show_coverage = false;
    
        input_path = process.argv[2];
        output_path = process.argv[3];
        
        for (let i = 4; i < process.argv.length; i++) {
            let arg = process.argv[i];
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
    
    CLI_info("Compiling: " + input_path);
    CLI_info("Target: " + target_lang);
    
        if (package_path) {
            const fs = require('fs');
            const path = require('path');
            
            if (fs.existsSync(package_path)) {
                terminal.CLI_info("Loading package: " + package_path);
                
                let grammarPath = fs.statSync(package_path).isDirectory() 
                    ? path.join(package_path, 'grammar.json')
                    : package_path;
                    
                if (fs.existsSync(grammarPath)) {
                    let targetDir = path.join(__dirname, '..', 'targets');
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    let profile = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'));
                    let profileName = profile.name || path.basename(package_path, '.omni-pkg');
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
    
    let source = read_file(input_path);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let gen = new_code_generator(target_lang);
    
        if (framework) {
            gen.framework = framework;
        }
    
    let code = CodeGenerator_generate(gen, program);
    
        if (show_coverage || gen.ast_node_count > 0) {
            let coverage = gen.ast_node_count > 0 
                ? (gen.generated_count / gen.ast_node_count * 100).toFixed(1)
                : 100;
            terminal.CLI_info("AST Coverage: " + coverage + "% (" + 
                gen.generated_count + "/" + gen.ast_node_count + " nodes)");
                
            if (coverage < 100) {
                terminal.CLI_warning("Some AST nodes were not generated");
            }
        }
    
    write_file(output_path, code);
    CLI_success("Output: " + output_path);
    CLI_success("Compiled successfully!");
}



if (typeof main === 'function') main();
