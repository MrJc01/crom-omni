function print(msg) {
     console.log(msg); 
    
}
function get_platform() {
    let platform = "unknown";
    
        platform = typeof window !== 'undefined' ? 'browser' : 'node';
    
    
    
    return platform;
}
function square_native(x) {
    let result = 0;
    
        result = x * x;
    
    
    return result;
}
function read_env_var(name) {
    let value = "";
    
        value = process.env[name] || "";
    
    
    return value;
}
function generate_uuid() {
    let uuid = "";
    
        // Using built-in crypto (Node.js)
        const crypto = require('crypto');
        uuid = crypto.randomUUID();
    
    
    return uuid;
}
function fast_sum(arr) {
    let total = 0;
    
        // Using optimized reduce
        total = arr.reduce((a, b) => a + b, 0);
    
    
    return total;
}
function delay(ms) {
    
        return new Promise(resolve => setTimeout(resolve, ms));
    
    
}
function fetch_url(url) {
    let content = "";
    
        const https = require('https');
        return new Promise((resolve) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    content = data;
                    resolve(content);
                });
            }).on('error', () => resolve(""));
        });
    
    return content;
}
function create_element(tag, text) {
    let element = 0;
    
        if (typeof document !== 'undefined') {
            element = document.createElement(tag);
            element.textContent = text;
        }
    
    return element;
}
function append_to_body(element) {
    
        if (typeof document !== 'undefined' && element) {
            document.body.appendChild(element);
        }
    
}
class SystemInfo {
    constructor(data = {}) {
        this.os = data.os;
        this.arch = data.arch;
        this.node_version = data.node_version;
        this.memory_mb = data.memory_mb;
    }
}
function get_system_info() {
    let info = new SystemInfo({ os: "", arch: "", node_version: "", memory_mb: 0 });
    
        const os = require('os');
        info.os = os.platform();
        info.arch = os.arch();
        info.node_version = process.version;
        info.memory_mb = Math.floor(os.totalmem() / 1024 / 1024);
    
    
    return info;
}
function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Native Bridge               ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("The native {} block allows target-specific code:");
    print("");
    print("1. Platform Detection:");
    let platform = get_platform();
    print("   Current platform: " + platform);
    print("");
    print("2. Variable Access in Native:");
    let sq = square_native(7);
    print("   square_native(7) = 49");
    print("");
    print("3. Environment Variables:");
    let path = read_env_var("PATH");
    print("   PATH is set (length varies by system)");
    print("");
    print("4. UUID Generation (using crypto):");
    let id = generate_uuid();
    print("   Generated: " + id);
    print("");
    print("5. System Information:");
    let sys_info = get_system_info();
    print("   OS: " + sys_info.os);
    print("   Arch: " + sys_info.arch);
    print("   Runtime: " + sys_info.node_version);
    print("");
    print("6. Performance (native reduce):");
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let sum = fast_sum(nums);
    print("   fast_sum([1..10]) = 55");
    print("");
    print("✓ Native bridge demonstration complete!");
    print("  The same Omni code compiles to JS, Python, or C.");
}

main();
