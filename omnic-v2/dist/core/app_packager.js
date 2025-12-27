const _terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, _terminal);
class AppConfig {
    constructor(data = {}) {
        this.name = data.name;
        this.version = data.version;
        this.icon = data.icon;
        this.description = data.description;
        this.author = data.author;
        this.bundle_id = data.bundle_id;
    }
}
function AppConfig_default() {
    return new AppConfig({ name: "OmniApp", version: "1.0.0", icon: "", description: "Built with Omni", author: "Omni Developer", bundle_id: "org.omni.app" });
}
function detect_platform() {
    let platform = "unknown";
    
        platform = process.platform;
    
    return platform;
}
function detect_build_tools() {
    
        const { execSync } = require('child_process');
        
        let tools = {
            gcc: false,
            clang: false,
            cargo: false,
            android_sdk: false,
            xcode: false,
            wix: false
        };
        
        const check = (cmd) => {
            try {
                execSync(cmd + ' --version', { stdio: 'ignore' });
                return true;
            } catch (e) {
                return false;
            }
        };
        
        tools.gcc = check('gcc');
        tools.clang = check('clang');
        tools.cargo = check('cargo');
        
        // Check for Android SDK
        tools.android_sdk = !!process.env.ANDROID_HOME;
        
        // Check for Xcode (macOS only)
        if (process.platform === 'darwin') {
            tools.xcode = check('xcodebuild');
        }
        
        // Check for WiX (Windows installer)
        if (process.platform === 'win32') {
            tools.wix = check('candle');
        }

        return tools;
    
    return 0;
}
function generate_tauri_config(config, is_studio) {
    let json = "";
    
        const tauriConfig = {
            "build": {
                "distDir": is_studio ? "../studio/dist" : "../dist",
                "devPath": is_studio ? "http://localhost:3000" : "http://localhost:8080"
            },
            "package": {
                "productName": config.name,
                "version": config.version
            },
            "tauri": {
                "bundle": {
                    "active": true,
                    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"],
                    "identifier": config.bundle_id,
                    "targets": ["msi", "appimage", "dmg"]
                },
                "windows": [{
                    "title": config.name,
                    "width": 1280,
                    "height": 800,
                    "minWidth": 800,
                    "minHeight": 600,
                    "resizable": true,
                    "fullscreen": false
                }],
                "allowlist": {
                    "shell": { "execute": true },
                    "fs": { "all": true },
                    "path": { "all": true },
                    "process": { "all": true },
                    "http": { "all": true }
                }
            }
        };
        
        json = JSON.stringify(tauriConfig, null, 2);
    
    return json;
}
function generate_capacitor_config(config) {
    let json = "";
    
        const capConfig = {
            "appId": config.bundle_id,
            "appName": config.name,
            "webDir": "dist",
            "server": {
                "androidScheme": "https"
            },
            "plugins": {
                "SplashScreen": {
                    "launchShowDuration": 2000,
                    "backgroundColor": "#0d1117"
                }
            }
        };
        
        json = JSON.stringify(capConfig, null, 2);
    
    return json;
}
function cmd_package_app(target, config) {
    CLI_banner();
    CLI_header("Omni App Packager");
    CLI_info("Target: " + target);
    CLI_info("App: " + config.name + " v" + config.version);
    let tools = detect_build_tools();
    let platform = detect_platform();
    
        const fs = require('fs');
        const path = require('path');
        const { execSync } = require('child_process');
        
        const omniDir = path.join(__dirname, '..');
        const buildDir = path.join(omniDir, 'build');
        const distDir = path.join(omniDir, 'dist', 'app');
        
        // Create build directories
        [buildDir, distDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        
        // ================================================================
        // WINDOWS BUILD
        // ================================================================
        if (target === 'windows' || target === 'win32' || target === 'exe') {
            CLI_step(1, 4, "Generating Windows project...");
            
            // Create Tauri project structure
            const tauriDir = path.join(buildDir, 'tauri');
            if (!fs.existsSync(tauriDir)) {
                fs.mkdirSync(tauriDir, { recursive: true });
            }
            
            // Write tauri.conf.json
            const tauriConfig = generate_tauri_config(config, true);
            fs.writeFileSync(path.join(tauriDir, 'tauri.conf.json'), tauriConfig);
            CLI_success("Generated: build/tauri/tauri.conf.json");
            
            CLI_step(2, 4, "Copying Studio UI...");
            
            // Copy Studio files
            const studioDistDir = path.join(tauriDir, 'studio', 'dist');
            if (!fs.existsSync(studioDistDir)) {
                fs.mkdirSync(studioDistDir, { recursive: true });
            }
            
            // Generate minimal index.html that loads Studio
            const indexHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${config.name}</title></head>
<body>
<script>
    // Omni Studio loads here
    window.location.href = 'http://localhost:3000';
</script>
</body>
</html>`;
            fs.writeFileSync(path.join(studioDistDir, 'index.html'), indexHtml);
            
            CLI_step(3, 4, "Checking Tauri...");
            
            if (!tools.cargo) {
                CLI_warning("Rust/Cargo not found. Required for Tauri builds.");
                CLI_info("Install Rust: https://rustup.rs/");
                console.log("");
                CLI_info("Manual build steps:");
                console.log(CLI_COLORS.dim + "  cd build/tauri" + CLI_COLORS.reset);
                console.log(CLI_COLORS.dim + "  cargo tauri build" + CLI_COLORS.reset);
                return;
            }
            
            CLI_step(4, 4, "Building...");
            
            console.log("");
            console.log(CLI_COLORS.yellow + "  To complete the Windows build:" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  cd build/tauri" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  cargo install tauri-cli" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  cargo tauri build" + CLI_COLORS.reset);
            console.log("");
            CLI_success("Windows project ready in build/tauri/");
            return;
        }
        
        // ================================================================
        // ANDROID BUILD
        // ================================================================
        if (target === 'android' || target === 'apk') {
            CLI_step(1, 5, "Generating Capacitor project...");
            
            const capDir = path.join(buildDir, 'capacitor');
            if (!fs.existsSync(capDir)) {
                fs.mkdirSync(capDir, { recursive: true });
            }
            
            // Write capacitor.config.json
            const capConfig = generate_capacitor_config(config);
            fs.writeFileSync(path.join(capDir, 'capacitor.config.json'), capConfig);
            CLI_success("Generated: build/capacitor/capacitor.config.json");
            
            // Create package.json
            const packageJson = {
                "name": config.bundle_id.replace(/\./g, '-'),
                "version": config.version,
                "scripts": {
                    "build": "echo 'Building...'",
                    "cap:add": "npx cap add android",
                    "cap:sync": "npx cap sync",
                    "cap:open": "npx cap open android"
                },
                "dependencies": {
                    "@capacitor/android": "^5.0.0",
                    "@capacitor/core": "^5.0.0",
                    "@capacitor/cli": "^5.0.0"
                }
            };
            fs.writeFileSync(path.join(capDir, 'package.json'), JSON.stringify(packageJson, null, 2));
            
            CLI_step(2, 5, "Creating dist folder...");
            
            const distFolder = path.join(capDir, 'dist');
            if (!fs.existsSync(distFolder)) {
                fs.mkdirSync(distFolder, { recursive: true });
            }
            
            // Create minimal index.html
            const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { text-align: center; padding: 20px; }
        h1 { font-size: 2rem; margin-bottom: 1rem; color: #58a6ff; }
        p { color: #8b949e; }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #238636;
            color: white;
            border-radius: 8px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>◊ ${config.name}</h1>
        <p>Built with Omni</p>
        <a href="#" class="btn" onclick="window.location.reload()">Start</a>
    </div>
</body>
</html>`;
            fs.writeFileSync(path.join(distFolder, 'index.html'), indexHtml);
            
            CLI_step(3, 5, "Checking Android SDK...");
            
            if (!tools.android_sdk) {
                CLI_warning("Android SDK not found (ANDROID_HOME not set)");
                CLI_info("Install Android Studio: https://developer.android.com/studio");
            }
            
            CLI_step(4, 5, "Generating build instructions...");
            
            console.log("");
            console.log(CLI_COLORS.yellow + "  To complete the Android build:" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  cd build/capacitor" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npm install" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap add android" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap sync" + CLI_COLORS.reset);
            console.log(CLI_COLORS.cyan + "  npx cap open android" + CLI_COLORS.reset);
            console.log("");
            
            CLI_step(5, 5, "Done!");
            CLI_success("Android project ready in build/capacitor/");
            return;
        }
        
        // ================================================================
        // LINUX BUILD
        // ================================================================
        if (target === 'linux' || target === 'appimage') {
            CLI_step(1, 3, "Generating Linux project...");
            
            const linuxDir = path.join(buildDir, 'linux');
            if (!fs.existsSync(linuxDir)) {
                fs.mkdirSync(linuxDir, { recursive: true });
            }
            
            // Write desktop file
            const desktopEntry = `[Desktop Entry]
Name=${config.name}
Comment=${config.description}
Exec=omni
Icon=omni
Type=Application
Categories=Development;IDE;
`;
            fs.writeFileSync(path.join(linuxDir, config.name + '.desktop'), desktopEntry);
            
            // Write AppImage recipe
            const appImageYml = `app: ${config.name}
ingredients:
  dist: omni-installer
  script:
    - echo "Building Omni AppImage"

script:
  - mkdir -p AppDir/usr/bin
  - cp omni AppDir/usr/bin/
  - cp -r studio AppDir/usr/share/omni/
`;
            fs.writeFileSync(path.join(linuxDir, 'AppImageBuilder.yml'), appImageYml);
            
            CLI_step(2, 3, "Generated Linux files");
            CLI_step(3, 3, "Done!");
            
            console.log("");
            CLI_info("To build AppImage:");
            console.log(CLI_COLORS.dim + "  cd build/linux" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + "  appimage-builder --recipe AppImageBuilder.yml" + CLI_COLORS.reset);
            
            CLI_success("Linux project ready in build/linux/");
            return;
        }
        
        // Unknown target
        CLI_error("Unknown target: " + target);
        CLI_info("Available targets: windows, android, linux");
    
}

module.exports = { AppConfig_default, detect_platform, detect_build_tools, generate_tauri_config, generate_capacitor_config, cmd_package_app };
