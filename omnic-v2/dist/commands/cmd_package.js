const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
function cmd_package_self() {
    CLI_header("Self-Package");
    
        const fs = require('fs');
        const path = require('path');
        const { execSync } = require('child_process');
        
        const omniDir = path.dirname(path.dirname(__filename));
        const version = CLI_version();
        const platform = process.platform;
        
        terminal.CLI_step(1, 4, "Collecting source files...");
        
        // Files to include
        const distDir = path.join(omniDir, 'dist');
        const targetsDir = path.join(omniDir, 'targets');
        
        terminal.CLI_step(2, 4, "Creating package manifest...");
        
        const manifest = {
            name: 'omni-compiler',
            version: version,
            platform: platform,
            created: new Date().toISOString(),
            files: []
        };
        
        // List dist files
        if (fs.existsSync(distDir)) {
            const files = fs.readdirSync(distDir, { recursive: true });
            manifest.files.push(...files.map(f => 'dist/' + f));
        }
        
        // List target profiles
        if (fs.existsSync(targetsDir)) {
            const files = fs.readdirSync(targetsDir);
            manifest.files.push(...files.map(f => 'targets/' + f));
        }
        
        CLI_step(3, 4, "Writing package...");
        
        const packageName = `omni-${version}-${platform}`;
        const packageDir = path.join(omniDir, 'packages');
        
        if (!fs.existsSync(packageDir)) {
            fs.mkdirSync(packageDir, { recursive: true });
        }
        
        // Write manifest
        fs.writeFileSync(
            path.join(packageDir, packageName + '.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        CLI_step(4, 4, "Creating executable wrapper...");
        
        // Create .run file (Unix) or .cmd (Windows)
        if (platform === 'win32') {
            const runContent = `@echo off
set OMNI_HOME=%~dp0
node "%OMNI_HOME%dist\\main.js" %*`;
            fs.writeFileSync(path.join(packageDir, packageName + '.cmd'), runContent);
            CLI_success("Package created: packages/" + packageName + ".cmd");
        } else {
            const runContent = `#!/bin/bash
OMNI_HOME="$(dirname "$(readlink -f "$0")")"
node "$OMNI_HOME/dist/main.js" "$@"`;
            const runPath = path.join(packageDir, packageName + '.run');
            fs.writeFileSync(runPath, runContent);
            fs.chmodSync(runPath, '755');
            CLI_success("Package created: packages/" + packageName + ".run");
        }
        
        console.log("");
        CLI_info("Package manifest: packages/" + packageName + ".json");
        CLI_info("Total files: " + manifest.files.length);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_package_self = cmd_package_self;
}
