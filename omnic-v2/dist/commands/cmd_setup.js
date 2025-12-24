const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
function get_omni_home() {
    const home = "";
    
        const path = require('path');
        const os = require('os');
        
        // Priority 1: OMNI_HOME environment variable
        if (process.env.OMNI_HOME) {
            home = process.env.OMNI_HOME;
        }
        // Priority 2: Executable directory
        else if (__dirname) {
            home = path.dirname(__dirname);
        }
        // Priority 3: User's home directory
        else {
            const platform = os.platform();
            if (platform === 'win32') {
                home = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                home = path.join(os.homedir(), '.local', 'share', 'omni');
            }
        }
    
    return home;
}
function resolve_resource_path(name) {
    const resolved = "";
    
        const fs = require('fs');
        const path = require('path');
        
        // Strategy 1: Local project path (./targets/, ./packages/, ./patterns/)
        const localPath = path.join(process.cwd(), name);
        if (fs.existsSync(localPath)) {
            resolved = localPath;
            return;
        }
        
        // Strategy 2: Relative to executable (dist/../)
        const execPath = path.join(__dirname, '..', name);
        if (fs.existsSync(execPath)) {
            resolved = execPath;
            return;
        }
        
        // Strategy 3: OMNI_HOME
        const omniHome = get_omni_home();
        const homePath = path.join(omniHome, name);
        if (fs.existsSync(homePath)) {
            resolved = homePath;
            return;
        }
        
        // Strategy 4: Global installation
        const os = require('os');
        const platform = os.platform();
        let globalPath;
        
        if (platform === 'win32') {
            globalPath = path.join(os.homedir(), 'AppData', 'Local', 'Omni', name);
        } else {
            globalPath = path.join(os.homedir(), '.local', 'share', 'omni', name);
        }
        
        if (fs.existsSync(globalPath)) {
            resolved = globalPath;
            return;
        }
        
        // Not found - return local path for error messages
        resolved = localPath;
    
    return resolved;
}
function cmd_setup(is_global) {
    CLI_banner();
    CLI_header("Omni Setup");
    
        const os = require('os');
        const fs = require('fs');
        const path = require('path');
        const { execSync } = require('child_process');
        
        const platform = os.platform();
        const isWindows = platform === 'win32';
        const omniDir = path.dirname(path.dirname(__filename));
        
        terminal.CLI_info("Platform: " + platform + " (" + os.arch() + ")");
        terminal.CLI_info("Omni directory: " + omniDir);
        terminal.CLI_info("Mode: " + (is_global ? "GLOBAL" : "LOCAL"));
        
        console.log("");
        
        if (is_global) {
            // ============================================================
            // GLOBAL INSTALLATION
            // ============================================================
            terminal.CLI_step(1, 4, "Detecting global installation path...");
            
            let globalDir;
            if (isWindows) {
                // Windows: Use %AppData%\Omni
                globalDir = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                // Unix: Use ~/.local/bin or /usr/local/bin
                globalDir = path.join(os.homedir(), '.local', 'share', 'omni');
            }
            
            CLI_info("Global directory: " + globalDir);
            
            CLI_step(2, 4, "Copying Omni files...");
            
            // Ensure directory exists
            if (!fs.existsSync(globalDir)) {
                fs.mkdirSync(globalDir, { recursive: true });
            }
            
            // Copy dist folder
            const srcDist = path.join(omniDir, 'dist');
            const dstDist = path.join(globalDir, 'dist');
            
            if (fs.existsSync(srcDist)) {
                if (!fs.existsSync(dstDist)) {
                    fs.mkdirSync(dstDist, { recursive: true });
                }
                
                const files = fs.readdirSync(srcDist);
                for (const file of files) {
                    fs.copyFileSync(
                        path.join(srcDist, file),
                        path.join(dstDist, file)
                    );
                }
                CLI_success("Copied " + files.length + " files");
            }
            
            // Copy lib folder
            const srcLib = path.join(omniDir, 'src', 'lib');
            const dstLib = path.join(globalDir, 'lib');
            
            if (fs.existsSync(srcLib)) {
                if (!fs.existsSync(dstLib)) {
                    fs.mkdirSync(dstLib, { recursive: true });
                }
                
                const walkAndCopy = (src, dst) => {
                    const entries = fs.readdirSync(src, { withFileTypes: true });
                    for (const entry of entries) {
                        const srcPath = path.join(src, entry.name);
                        const dstPath = path.join(dst, entry.name);
                        if (entry.isDirectory()) {
                            if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);
                            walkAndCopy(srcPath, dstPath);
                        } else {
                            fs.copyFileSync(srcPath, dstPath);
                        }
                    }
                };
                walkAndCopy(srcLib, dstLib);
                CLI_success("Copied standard library");
            }
            
            CLI_step(3, 4, "Creating executable wrapper...");
            
            if (isWindows) {
                // Windows: Create batch and PowerShell wrappers
                const cmdContent = `@echo off
node "%~dp0dist\\main.js" %*`;
                fs.writeFileSync(path.join(globalDir, 'omni.cmd'), cmdContent);
                
                const ps1Content = `#!/usr/bin/env pwsh
node "$PSScriptRoot\\dist\\main.js" @args`;
                fs.writeFileSync(path.join(globalDir, 'omni.ps1'), ps1Content);
                
                CLI_success("Created omni.cmd and omni.ps1");
            } else {
                // Unix: Create shell script
                const shContent = `#!/usr/bin/env bash
OMNI_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
node "$OMNI_DIR/dist/main.js" "$@"`;
                const shPath = path.join(globalDir, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                
                CLI_success("Created omni executable");
            }
            
            CLI_step(4, 4, "Configuring PATH...");
            
            let binDir;
            if (isWindows) {
                binDir = globalDir;
                
                // Try to add to user PATH
                try {
                    const currentPath = execSync('echo %PATH%', { encoding: 'utf-8' }).trim();
                    if (!currentPath.includes(globalDir)) {
                        console.log("");
                        CLI_warning("Add this directory to your PATH:");
                        console.log(CLI_COLORS.cyan + "  " + globalDir + CLI_COLORS.reset);
                        console.log("");
                        console.log(CLI_COLORS.dim + "  PowerShell (admin):" + CLI_COLORS.reset);
                        console.log(CLI_COLORS.dim + "  [Environment]::SetEnvironmentVariable('Path', $env:Path + ';' + '" + globalDir + "', 'User')" + CLI_COLORS.reset);
                    } else {
                        CLI_success("Already in PATH");
                    }
                } catch (e) {}
            } else {
                binDir = path.join(os.homedir(), '.local', 'bin');
                
                // Create symlink in ~/.local/bin
                if (!fs.existsSync(binDir)) {
                    fs.mkdirSync(binDir, { recursive: true });
                }
                
                const linkPath = path.join(binDir, 'omni');
                try {
                    if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
                    fs.symlinkSync(path.join(globalDir, 'omni'), linkPath);
                    CLI_success("Linked: " + linkPath);
                } catch (e) {
                    CLI_warning("Could not create symlink: " + e.message);
                }
                
                // Check if ~/.local/bin is in PATH
                const shellPath = process.env.PATH || '';
                if (!shellPath.includes(binDir)) {
                    console.log("");
                    CLI_warning("Add to your shell profile (~/.bashrc or ~/.zshrc):");
                    console.log(CLI_COLORS.cyan + '  export PATH="$HOME/.local/bin:$PATH"' + CLI_COLORS.reset);
                }
            }
            
            console.log("");
            CLI_success("Global installation complete!");
            console.log("");
            console.log(CLI_COLORS.green + "  Try: omni --version" + CLI_COLORS.reset);
            
        } else {
            // ============================================================
            // LOCAL INSTALLATION (./omni in current project)
            // ============================================================
            CLI_step(1, 2, "Creating local wrapper...");
            
            const cwd = process.cwd();
            
            if (isWindows) {
                const cmdContent = `@echo off
node "${path.join(omniDir, 'dist', 'main.js')}" %*`;
                fs.writeFileSync(path.join(cwd, 'omni.cmd'), cmdContent);
                CLI_success("Created: omni.cmd");
            } else {
                const shContent = `#!/usr/bin/env bash
node "${path.join(omniDir, 'dist', 'main.js')}" "$@"`;
                const shPath = path.join(cwd, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                CLI_success("Created: ./omni");
            }
            
            CLI_step(2, 2, "Done!");
            
            console.log("");
            CLI_success("Local installation complete!");
            console.log("");
            if (isWindows) {
                console.log(CLI_COLORS.green + "  Try: .\\omni.cmd --version" + CLI_COLORS.reset);
            } else {
                console.log(CLI_COLORS.green + "  Try: ./omni --version" + CLI_COLORS.reset);
            }
        }
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.get_omni_home = get_omni_home;
    exports.resolve_resource_path = resolve_resource_path;
    exports.cmd_setup = cmd_setup;
}
