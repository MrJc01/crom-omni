const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const std = require("../lib/std.js");
if (typeof global !== 'undefined') Object.assign(global, std);
const lexer = require("../core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, lexer);
const parser = require("../core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, parser);
const codegen_hybrid = require("../core/codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, codegen_hybrid);
const vm = require("../core/vm.js");
if (typeof global !== 'undefined') Object.assign(global, vm);
function cmd_run() {
    let run_file = "";
     
        run_file = process.argv[3] || '';
    
    if (run_file == "") {
    CLI_error("Usage: omni run <file.omni> [--cmd|--app|--web|--web-app] [--port N]");
    CLI_info("Modes:");
    CLI_info("  --cmd      Terminal execution (default)");
    CLI_info("  --app      Native desktop app (Python/Tkinter)");
    CLI_info("  --web      Web server on port (default: 3000)");
    CLI_info("  --web-app  Web in native browser window");
    return true;
}
    let source = read_file(run_file);
    if (source == "") {
    CLI_error("Could not read file: " + run_file);
    return false;
}
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    
        const fs = require('fs');
        const path = require('path');
        const http = require('http');
        const { spawnSync, exec } = require('child_process');
        
        let mode = "cmd";
        let target = "js";
        let port = 3000;
        
        // Mode detection from flags
        if (process.argv.includes("--cmd")) mode = "cmd";
        if (process.argv.includes("--app")) mode = "app";
        if (process.argv.includes("--web")) mode = "web";
        if (process.argv.includes("--web-app")) mode = "web-app";
        
        // Check custom target
        let t_idx = process.argv.indexOf("--target");
        if (t_idx > -1 && process.argv[t_idx+1]) {
            target = process.argv[t_idx+1];
        }
        
        // Check custom port
        let p_idx = process.argv.indexOf("--port");
        if (p_idx > -1 && process.argv[p_idx+1]) {
            port = parseInt(process.argv[p_idx+1]);
        }
        
        // Auto-detect mode from omni.conf.json if no explicit flag
        let hasExplicitMode = ["--cmd", "--app", "--web", "--web-app"].some(f => process.argv.includes(f));
        
        if (!hasExplicitMode) {
            let dir = path.dirname(run_file);
            let possibleConfigs = [
                path.join(dir, 'omni.conf.json'),
                path.join(dir, '..', 'omni.conf.json')
            ];
            
            for (const confPath of possibleConfigs) {
                if (fs.existsSync(confPath)) {
                    try {
                        let conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
                        if (conf.defaultMode) {
                            mode = conf.defaultMode;
                        } else if (conf.targets && conf.targets.length > 0) {
                            mode = conf.targets[0];
                        }
                        CLI_info("Auto-detected mode: " + mode);
                    } catch(e) {}
                    break;
                }
            }
        }
        
        // Set target based on mode
        if (mode === "app") {
            target = "python";
        } else {
            target = "js";
        }
        
        CLI_info("Mode: " + mode + " | Target: " + target);
        
        // Generate code
        let gen = new_code_generator(target);
        let code = CodeGenerator_generate(gen, program);
        
        let ext = target === "python" ? ".py" : ".js";
        let outFile = run_file.replace(".omni", ext);
        let htmlFile = run_file.replace(".omni", ".html");
        
        // ========== CMD MODE ==========
        if (mode === "cmd") {
            CLI_info("Running in terminal...");
            
            let finalCode = code;
            if (target === "js") {
                finalCode += "\nif (typeof main === 'function') main();\n";
            } else if (target === "python") {
                finalCode += "\nif __name__ == '__main__':\n    main()\n";
            }
            
            fs.writeFileSync(outFile, finalCode);
            let cmd = target === "python" ? "python" : "node";
            spawnSync(cmd, [outFile], { stdio: 'inherit' });
        }
        
        // ========== APP MODE ==========
        else if (mode === "app") {
            CLI_info("Launching native app...");
            
            let finalCode = code;
            finalCode += "\nif __name__ == '__main__':\n    main()\n";
            
            fs.writeFileSync(outFile, finalCode);
            spawnSync("python", [outFile], { stdio: 'inherit' });
        }
        
        // ========== WEB MODE ==========
        else if (mode === "web") {
            CLI_info("Starting web server...");
            
            // Write JS file
            fs.writeFileSync(outFile, code);
            
            // Generate HTML wrapper
            let baseName = path.basename(outFile);
            let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni Web - ${baseName}</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a2e; color: #eee; }
        #app { padding: 20px; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script src="${baseName}"></script>
    <script>if (typeof main === 'function') main();</script>
</body>
</html>`;
            
            fs.writeFileSync(htmlFile, html);
            
            // Create HTTP server
            let server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                let extName = path.extname(filePath);
                let mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };
                
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('Not Found: ' + filePath);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': mimeTypes[extName] || 'text/plain' });
                    res.end(data);
                });
            });
            
            server.listen(port, () => {
                CLI_success("Server running at http://localhost:" + port);
                CLI_info("Press Ctrl+C to stop");
            });
        }
        
        // ========== WEB-APP MODE ==========
        else if (mode === "web-app") {
            CLI_info("Starting web server with browser...");
            
            // Write JS file
            fs.writeFileSync(outFile, code);
            
            // Generate HTML wrapper
            let baseName = path.basename(outFile);
            let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni Web App - ${baseName}</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a2e; color: #eee; }
        #app { padding: 20px; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script src="${baseName}"></script>
    <script>if (typeof main === 'function') main();</script>
</body>
</html>`;
            
            fs.writeFileSync(htmlFile, html);
            
            // Create HTTP server
            let server = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                let extName = path.extname(filePath);
                let mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };
                
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('Not Found: ' + filePath);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': mimeTypes[extName] || 'text/plain' });
                    res.end(data);
                });
            });
            
            server.listen(port, () => {
                CLI_success("Server running at http://localhost:" + port);
                
                // Open browser
                let url = "http://localhost:" + port;
                CLI_info("Opening browser: " + url);
                
                let platform = process.platform;
                let openCmd;
                if (platform === 'win32') {
                    openCmd = 'start "" "' + url + '"';
                } else if (platform === 'darwin') {
                    openCmd = 'open "' + url + '"';
                } else {
                    openCmd = 'xdg-open "' + url + '"';
                }
                
                exec(openCmd, (err) => {
                    if (err) {
                        CLI_warning("Could not open browser automatically");
                        CLI_info("Please open manually: " + url);
                    }
                });
                
                CLI_info("Press Ctrl+C to stop");
            });
        }
    
    return true;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_run = cmd_run;
}
