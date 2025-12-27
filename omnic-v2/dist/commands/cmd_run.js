const _terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, _terminal);
const _std = require("../lib/std.js");
if (typeof global !== 'undefined') Object.assign(global, _std);
const _lexer = require("../core/lexer.js");
if (typeof global !== 'undefined') Object.assign(global, _lexer);
const _parser = require("../core/parser.js");
if (typeof global !== 'undefined') Object.assign(global, _parser);
const _codegen_hybrid = require("../core/codegen_hybrid.js");
if (typeof global !== 'undefined') Object.assign(global, _codegen_hybrid);
const _vm = require("../core/vm.js");
if (typeof global !== 'undefined') Object.assign(global, _vm);
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
        
        // Framework/Target shortcuts
        if (process.argv.includes("--php")) {
             target = "php";
             mode = "cmd"; 
        }
        if (process.argv.includes("--laravel")) {
             target = "php";
             mode = "cmd"; // For now, run as cmd script, detection logic inside codegen will handle specifics
        }
        if (process.argv.includes("--react")) {
             target = "js";
             mode = "web";
        }
        
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
        const hasExplicitMode = ["--cmd", "--app", "--web", "--web-app"].some(f => process.argv.includes(f));
        
        if (!hasExplicitMode) {
            const dir = path.dirname(run_file);
            const possibleConfigs = [
                path.join(dir, 'omni.conf.json'),
                path.join(dir, '..', 'omni.conf.json')
            ];
            
            for (const confPath of possibleConfigs) {
                if (fs.existsSync(confPath)) {
                    try {
                        const conf = JSON.parse(fs.readFileSync(confPath, 'utf-8'));
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
        } else if (target !== "php" && target !== "js") {
            target = "js";
        }
        
        CLI_info("Mode: " + mode + " | Target: " + target);
        
        // Generate code
        const gen = new_code_generator(target);
        const code = CodeGenerator_generate(gen, program);
        
        const ext = target === "python" ? ".py" : ".js";
        const outFile = run_file.replace(".omni", ext);
        const htmlFile = run_file.replace(".omni", ".html");
        
        // ========== CMD MODE ==========
        if (mode === "cmd") {
            CLI_info("Running in terminal...");
            
            let finalCode = code;
            /*
                var nl = String.fromCharCode(10);
                if (target === "js") {
                    finalCode += nl + "if (typeof main === 'function') main();" + nl;
                } else if (target === "python") {
                    finalCode += nl + "if __name__ == '__main__':" + nl + "    main()" + nl;
                } else if (target === "php") {
                    finalCode += nl + "if (function_exists('main')) { main(); }" + nl;
                }
            */
            
            fs.writeFileSync(outFile, finalCode);
            
            let cmd = "node";
            if (target === "python") cmd = "python";
            if (target === "php") cmd = "php";
            
            spawnSync(cmd, [outFile], { stdio: 'inherit' });
        }
        
        // ========== APP MODE ==========
        else if (mode === "app") {
            CLI_info("Launching native app...");
            
            let finalCode = code;
            // var nl = String.fromCharCode(10);
            // finalCode += nl + "if __name__ == '__main__':" + nl + "    main()" + nl;
            
            fs.writeFileSync(outFile, finalCode);
            spawnSync("python", [outFile], { stdio: 'inherit' });
        }
        
        
        // Shared Web Server Logic
        const readline = require('readline');
        
        const startWebServer = (p, openBrowser) => {
            // Re-write HTML/JS files based on current mode/target
            // (Assumed already written by caller or we write them here? 
            // Better to write them before calling this to allow title customization if needed, 
            // but for simplicity we rely on files existing)
            
            const tryServer = http.createServer((req, res) => {
                let filePath;
                if (req.url === '/' || req.url === '/index.html') {
                    filePath = htmlFile;
                } else {
                    filePath = path.join(path.dirname(run_file), req.url);
                }
                
                const extName = path.extname(filePath);
                const mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.ico': 'image/x-icon'
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

            tryServer.on('error', (e) => {
                if (e.code === 'EADDRINUSE') {
                    CLI_warning("Port " + p + " is already in use.");
                    
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    
                    CLI_info("Options:");
                    CLI_info(" [y/s] Kill process and restart");
                    CLI_info(" [number] Start on different port");
                    CLI_info(" [n] Cancel");
                    
                    process.stdout.write("> ");
                    
                    rl.question('', (answer) => {
                        rl.close();
                        const ans = answer.trim().toLowerCase();
                        
                        if (ans === 'y' || ans === 's') {
                            CLI_info("Killing process on port " + p + "...");
                            try {
                                if (process.platform === 'win32') {
                                    spawnSync("powershell", ["-Command", `Get-NetTCPConnection -LocalPort ${p} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`], { stdio: 'inherit' });
                                } else {
                                    spawnSync("sh", ["-c", `lsof -ti:${p} | xargs kill -9`], { stdio: 'inherit' });
                                }
                                startWebServer(p, openBrowser); // Retry same port
                            } catch(err) {
                                CLI_error("Failed to kill process: " + err.message);
                            }
                        } else if (!isNaN(parseInt(ans))) {
                            const newPort = parseInt(ans);
                            startWebServer(newPort, openBrowser);
                        } else {
                            CLI_error("Aborted.");
                            process.exit(1);
                        }
                    });
                } else {
                    CLI_error("Server error: " + e.message);
                    process.exit(1);
                }
            });
            
            tryServer.listen(p, () => {
                CLI_success("Server running at http://localhost:" + p);
                
                if (openBrowser) {
                     const url = "http://localhost:" + p;
                     CLI_info("Opening browser in App Mode: " + url);
                     const platform = process.platform;
                     let openCmd;
                     
                     if (platform === 'win32') {
                         // Try to find Edge or Chrome for "App Mode" (--app=url)
                         // This gives a native window feel without address bar
                         const fs = require('fs');
                         const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
                         const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
                         
                         if (fs.existsSync(edgePath)) {
                             openCmd = `"${edgePath}" --app="${url}"`;
                         } else if (fs.existsSync(chromePath)) {
                             openCmd = `"${chromePath}" --app="${url}"`;
                         } else {
                             // Fallback to default browser
                             openCmd = 'start "" "' + url + '"';
                         }
                     } else if (platform === 'darwin') {
                         // macOS: open -n -a "Google Chrome" --args --app=...
                         openCmd = 'open -n -a "Google Chrome" --args --app="' + url + '"'; 
                     } else {
                         // Linux: google-chrome --app=...
                         openCmd = 'google-chrome --app="' + url + '" || xdg-open "' + url + '"';
                     }
                     
                     exec(openCmd, (err) => {
                         if (err) {
                             // Fallback to standard open if app mode fails
                             CLI_warning("Could not open in App Mode, falling back to default browser...");
                             const fallback = (platform === 'win32') ? 'start "" "' + url + '"' : 
                                            (platform === 'darwin') ? 'open "' + url + '"' : 
                                            'xdg-open "' + url + '"';
                             exec(fallback);
                         }
                     });
                }
                
                CLI_info("Press Ctrl+C to stop");
            });
        };

        // ========== WEB MODE ==========
        if (mode === "web") {
            CLI_info("Starting web server...");
            fs.writeFileSync(outFile, code);
            
            const baseName = path.basename(outFile);
            const html = `<!DOCTYPE html>
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
            startWebServer(port, false);
        }
        
        // ========== WEB-APP MODE ==========
        else if (mode === "web-app") {
            CLI_info("Starting web server with browser...");
            fs.writeFileSync(outFile, code);
            
            const baseName = path.basename(outFile);
            const html = `<!DOCTYPE html>
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
            startWebServer(port, true);
        }
    
    return true;
}

module.exports = { cmd_run };
