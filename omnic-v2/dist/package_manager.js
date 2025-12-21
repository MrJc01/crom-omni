const cli = require("./lib/cli.js");
if (typeof global !== 'undefined') Object.assign(global, cli);
class GitPackage {
    constructor(data = {}) {
        this.name = data.name;
        this.provider = data.provider;
        this.owner = data.owner;
        this.repo = data.repo;
        this.full_url = data.full_url;
        this.commit = data.commit;
        this.branch = data.branch;
        this.local_path = data.local_path;
    }
}

function GitPackage_parse(spec) {
    let pkg = new GitPackage({ name: "", provider: "github", owner: "", repo: "", full_url: "", commit: "", branch: "main", local_path: "" });
    
        const path = require('path');
        
        // Parse different formats:
        // github:user/repo
        // gitlab:user/repo
        // https://github.com/user/repo
        // user/repo (default to github)
        
        let input = spec.trim();
        
        if (input.startsWith('github:')) {
            pkg.provider = 'github';
            input = input.substring(7);
        } else if (input.startsWith('gitlab:')) {
            pkg.provider = 'gitlab';
            input = input.substring(7);
        } else if (input.startsWith('https://github.com/')) {
            pkg.provider = 'github';
            input = input.substring(19);
        } else if (input.startsWith('https://gitlab.com/')) {
            pkg.provider = 'gitlab';
            input = input.substring(19);
        } else if (input.startsWith('http://') || input.startsWith('https://')) {
            pkg.provider = 'url';
            pkg.full_url = input;
            // Extract name from URL
            const parts = input.split('/');
            pkg.name = parts.slice(-2).join('/');
            pkg.owner = parts[parts.length - 2];
            pkg.repo = parts[parts.length - 1].replace('.git', '');
        }
        
        // Parse owner/repo format
        if (!pkg.full_url && input.includes('/')) {
            const parts = input.split('/');
            pkg.owner = parts[0];
            pkg.repo = parts[1].replace('.git', '');
            pkg.name = pkg.owner + '/' + pkg.repo;
            
            if (pkg.provider === 'github') {
                pkg.full_url = 'https://github.com/' + pkg.owner + '/' + pkg.repo;
            } else if (pkg.provider === 'gitlab') {
                pkg.full_url = 'https://gitlab.com/' + pkg.owner + '/' + pkg.repo;
            }
        }
        
        // Set local path
        pkg.local_path = path.join('packages', pkg.owner, pkg.repo);
    
    return pkg;
}
function GitPackage_get_zip_url(pkg) {
    let url = "";
    
        if (pkg.provider === 'github') {
            // GitHub archive URL (no git required)
            const branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/archive/refs/heads/' + branch + '.zip';
        } else if (pkg.provider === 'gitlab') {
            const branch = pkg.commit || pkg.branch || 'main';
            url = pkg.full_url + '/-/archive/' + branch + '/' + pkg.repo + '-' + branch + '.zip';
        } else {
            url = pkg.full_url;
        }
    
    return url;
}
function GitPackage_get_api_url(pkg) {
    let url = "";
    
        if (pkg.provider === 'github') {
            url = 'https://api.github.com/repos/' + pkg.owner + '/' + pkg.repo;
        } else if (pkg.provider === 'gitlab') {
            url = 'https://gitlab.com/api/v4/projects/' + encodeURIComponent(pkg.owner + '/' + pkg.repo);
        }
    
    return url;
}
class LockEntry {
    constructor(data = {}) {
        this.name = data.name;
        this.url = data.url;
        this.commit = data.commit;
        this.installed_at = data.installed_at;
    }
}

class LockFile {
    constructor(data = {}) {
        this.version = data.version;
        this.packages = data.packages;
    }
}

function LockFile_load(project_dir) {
    let lock = new LockFile({ version: "1.0", packages: null });
}

        const fs = require('fs');
        const path = require('path');
        
        const lockPath = path.join(project_dir, 'omni.lock');
        
        if (fs.existsSync(lockPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
                lock.version = data.version || '1.0';
                lock.packages = data.packages || {};
            } catch (e) {
                console.error('[lock] Failed to parse omni.lock: ' + e.message);
            }
        }
    
return lock;
// Unknown stmt kind: undefined
function LockFile_save(lock, project_dir) {
    
        const fs = require('fs');
        const path = require('path');
        
        const lockPath = path.join(project_dir, 'omni.lock');
        
        fs.writeFileSync(lockPath, JSON.stringify({
            version: lock.version,
            packages: lock.packages
        }, null, 2));
        
        console.log(CLI_COLORS.green + '✓' + CLI_COLORS.reset + ' Updated omni.lock');
    
}
function LockFile_add(lock, pkg) {
    
        lock.packages[pkg.name] = {
            name: pkg.name,
            url: pkg.full_url,
            commit: pkg.commit,
            installed_at: new Date().toISOString()
        };
    
}
function LockFile_get(lock, name) {
    let entry = new LockEntry({ name: "", url: "", commit: "", installed_at: "" });
    
        if (lock.packages[name]) {
            entry = lock.packages[name];
        }
    
    return entry;
}
function LockFile_remove(lock, name) {
    
        delete lock.packages[name];
    
}
function git_get_latest_commit(pkg) {
    let commit = "";
    
        const https = require('https');
        
        // Use GitHub API to get latest commit
        if (pkg.provider === 'github') {
            const apiUrl = 'https://api.github.com/repos/' + pkg.owner + '/' + pkg.repo + '/commits?per_page=1';
            
            console.log(CLI_COLORS.dim + '  Fetching latest commit...' + CLI_COLORS.reset);
            
            // Sync HTTP request (simplified for demo)
            const { execSync } = require('child_process');
            try {
                const result = execSync(
                    'curl -s -H "Accept: application/vnd.github.v3+json" "' + apiUrl + '"',
                    { encoding: 'utf-8' }
                );
                const data = JSON.parse(result);
                if (data && data[0] && data[0].sha) {
                    commit = data[0].sha;
                }
            } catch (e) {
                console.error(CLI_COLORS.dim + '  Could not fetch commit, using HEAD' + CLI_COLORS.reset);
            }
        }
    
    return commit;
}
function git_clone(pkg, target_dir) {
    let success = false;
    
        const { execSync, exec } = require('child_process');
        const fs = require('fs');
        const path = require('path');
        
        // Ensure parent directory exists
        const parentDir = path.dirname(target_dir);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        
        // Remove existing directory
        if (fs.existsSync(target_dir)) {
            fs.rmSync(target_dir, { recursive: true });
        }
        
        console.log(CLI_COLORS.cyan + '  Cloning: ' + CLI_COLORS.reset + pkg.full_url);
        
        try {
            // Try git clone first (depth 1 for speed)
            execSync(
                'git clone --depth 1 --quiet "' + pkg.full_url + '.git" "' + target_dir + '"',
                { stdio: 'pipe' }
            );
            success = true;
        } catch (e) {
            // Fallback to ZIP download
            console.log(CLI_COLORS.dim + '  Git not available, using ZIP download...' + CLI_COLORS.reset);
            
            const zipUrl = GitPackage_get_zip_url(pkg);
            const zipPath = path.join(parentDir, pkg.repo + '.zip');
            
            try {
                // Download ZIP
                execSync('curl -sL "' + zipUrl + '" -o "' + zipPath + '"');
                
                // Extract
                if (process.platform === 'win32') {
                    execSync('powershell -Command "Expand-Archive -Path \'' + zipPath + '\' -DestinationPath \'' + parentDir + '\' -Force"');
                } else {
                    execSync('unzip -q "' + zipPath + '" -d "' + parentDir + '"');
                }
                
                // Rename extracted folder
                const entries = fs.readdirSync(parentDir);
                for (const entry of entries) {
                    if (entry.startsWith(pkg.repo + '-') && fs.statSync(path.join(parentDir, entry)).isDirectory()) {
                        fs.renameSync(path.join(parentDir, entry), target_dir);
                        break;
                    }
                }
                
                // Cleanup ZIP
                fs.unlinkSync(zipPath);
                
                success = true;
            } catch (e2) {
                CLI_error('Failed to download package: ' + e2.message);
            }
        }
    
    return success;
}
function cmd_install(package_spec) {
    CLI_banner();
    CLI_header("Omni Package Installer");
    if (package_spec == "") {
    cmd_install_from_lock();
    return null;
}
    let pkg = GitPackage_parse(package_spec);
    if (pkg.name == "") {
    CLI_error("Invalid package specification: " + package_spec);
    CLI_info("Examples:");
    CLI_info("  omni install github:crom/utils");
    CLI_info("  omni install crom/utils");
    CLI_info("  omni install https://github.com/crom/utils");
    return null;
}
    CLI_info("Package: " + pkg.name);
    CLI_info("Source: " + pkg.full_url);
    let commit = git_get_latest_commit(pkg);
    if (commit != "") {
    pkg.commit = commit;
    CLI_info("Commit: " + commit.substring(0, 8) + "...");
}
    let cwd = "";
     cwd = process.cwd(); 
    let target = "";
    
        const path = require('path');
        target = path.join(cwd, pkg.local_path);
    
    CLI_step(1, 3, "Downloading...");
    let success = git_clone(pkg, target);
    if (success) {
    CLI_step(2, 3, "Updating lock file...");
    let lock = LockFile_load(cwd);
    LockFile_add(lock, pkg);
    LockFile_save(lock, cwd);
    CLI_step(3, 3, "Done!");
    CLI_success("Installed: " + pkg.name);
    
            console.log("");
            console.log(CLI_COLORS.cyan + "  Usage:" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + '    import "' + pkg.owner + '/' + pkg.repo + '/src/main.omni";' + CLI_COLORS.reset);
        
} else {
    CLI_error("Failed to install package");
}
}
function cmd_install_from_lock() {
    CLI_info("Installing packages from omni.lock...");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
        const path = require('path');
        const packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            CLI_info("No packages in omni.lock");
            return;
        }
        
        console.log(CLI_COLORS.dim + "  Found " + packages.length + " packages" + CLI_COLORS.reset);
        
        for (const entry of packages) {
            const pkg = GitPackage_parse(entry.url);
            pkg.commit = entry.commit;
            
            const target = path.join(cwd, pkg.local_path);
            
            console.log(CLI_COLORS.cyan + "  Installing: " + CLI_COLORS.reset + pkg.name);
            git_clone(pkg, target);
        }
        
        CLI_success("All packages installed!");
    
}
function cmd_uninstall(package_name) {
    CLI_banner();
    CLI_header("Omni Package Uninstaller");
    if (package_name == "") {
    CLI_error("Usage: omni uninstall <package>");
    return null;
}
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    let found = false;
    
        const fs = require('fs');
        const path = require('path');
        
        // Find package in lock
        for (const [name, entry] of Object.entries(lock.packages)) {
            if (name === package_name || name.endsWith('/' + package_name)) {
                found = true;
                
                // Remove directory
                const pkg = GitPackage_parse(entry.url);
                const targetDir = path.join(cwd, pkg.local_path);
                
                if (fs.existsSync(targetDir)) {
                    fs.rmSync(targetDir, { recursive: true });
                    console.log(CLI_COLORS.dim + "  Removed: " + targetDir + CLI_COLORS.reset);
                }
                
                // Remove from lock
                LockFile_remove(lock, name);
                break;
            }
        }
    
    if (found) {
    LockFile_save(lock, cwd);
    CLI_success("Uninstalled: " + package_name);
} else {
    CLI_error("Package not found: " + package_name);
}
}
function cmd_list() {
    CLI_banner();
    CLI_header("Installed Packages");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
        const packages = Object.values(lock.packages);
        
        if (packages.length === 0) {
            CLI_info("No packages installed.");
            console.log("");
            CLI_info("Install packages with: omni install github:user/repo");
            return;
        }
        
        console.log("");
        console.log(CLI_COLORS.cyan + "  " + packages.length + " packages installed:" + CLI_COLORS.reset);
        console.log("");
        
        for (const pkg of packages) {
            const commit = pkg.commit ? pkg.commit.substring(0, 8) : 'HEAD';
            console.log("  📦 " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset + 
                        CLI_COLORS.dim + " @ " + commit + CLI_COLORS.reset);
            console.log("     " + CLI_COLORS.dim + pkg.url + CLI_COLORS.reset);
        }
        
        console.log("");
    
}
function cmd_update(package_name) {
    CLI_banner();
    CLI_header("Omni Package Updater");
    let cwd = "";
     cwd = process.cwd(); 
    let lock = LockFile_load(cwd);
    
        const path = require('path');
        let packagesToUpdate = Object.values(lock.packages);
        
        if (package_name) {
            packagesToUpdate = packagesToUpdate.filter(p => 
                p.name === package_name || p.name.endsWith('/' + package_name)
            );
        }
        
        if (packagesToUpdate.length === 0) {
            CLI_info("No packages to update");
            return;
        }
        
        console.log(CLI_COLORS.dim + "  Updating " + packagesToUpdate.length + " packages..." + CLI_COLORS.reset);
        
        for (const entry of packagesToUpdate) {
            const pkg = GitPackage_parse(entry.url);
            
            console.log(CLI_COLORS.cyan + "  Updating: " + CLI_COLORS.reset + pkg.name);
            
            // Get latest commit
            const newCommit = git_get_latest_commit(pkg);
            
            if (newCommit && newCommit !== entry.commit) {
                console.log(CLI_COLORS.dim + "    " + entry.commit.substring(0, 8) + " → " + newCommit.substring(0, 8) + CLI_COLORS.reset);
                
                pkg.commit = newCommit;
                const target = path.join(cwd, pkg.local_path);
                git_clone(pkg, target);
                
                LockFile_add(lock, pkg);
            } else {
                console.log(CLI_COLORS.dim + "    Already up to date" + CLI_COLORS.reset);
            }
        }
        
        LockFile_save(lock, cwd);
        CLI_success("Update complete!");
    
}
function cmd_doctor() {
    CLI_banner();
    CLI_header("Omni Doctor - System Health Check");
    
        const { execSync } = require('child_process');
        const fs = require('fs');
        const path = require('path');
        
        let allOk = true;
        
        // Check git
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking tools:" + CLI_COLORS.reset);
        
        const tools = [
            { name: 'git', cmd: 'git --version' },
            { name: 'node', cmd: 'node --version' },
            { name: 'curl', cmd: 'curl --version' }
        ];
        
        for (const tool of tools) {
            try {
                const version = execSync(tool.cmd, { encoding: 'utf-8' }).trim().split('\n')[0];
                console.log("  " + CLI_COLORS.green + "✓" + CLI_COLORS.reset + " " + tool.name + ": " + CLI_COLORS.dim + version + CLI_COLORS.reset);
            } catch (e) {
                console.log("  " + CLI_COLORS.red + "✗" + CLI_COLORS.reset + " " + tool.name + ": not found");
                allOk = false;
            }
        }
        
        // Check omni.lock
        console.log("");
        console.log(CLI_COLORS.cyan + "  Checking project:" + CLI_COLORS.reset);
        
        const cwd = process.cwd();
        const files = [
            { name: 'omni.config.json', path: path.join(cwd, 'omni.config.json') },
            { name: 'omni.lock', path: path.join(cwd, 'omni.lock') },
            { name: 'packages/', path: path.join(cwd, 'packages') }
        ];
        
        for (const file of files) {
            if (fs.existsSync(file.path)) {
                console.log("  " + CLI_COLORS.green + "✓" + CLI_COLORS.reset + " " + file.name);
            } else {
                console.log("  " + CLI_COLORS.yellow + "○" + CLI_COLORS.reset + " " + file.name + CLI_COLORS.dim + " (optional)" + CLI_COLORS.reset);
            }
        }
        
        console.log("");
        if (allOk) {
            CLI_success("All systems operational!");
        } else {
            CLI_warning("Some tools are missing. Git is recommended for package installation.");
        }
    
}
function cmd_search(query) {
    CLI_banner();
    CLI_header("Omni Package Search");
    
        const https = require('https');
        
        // Fetch from static registry JSON
        const registryUrl = 'https://raw.githubusercontent.com/crom-lang/registry/main/packages.json';
        
        console.log(CLI_COLORS.dim + "  Fetching registry..." + CLI_COLORS.reset);
        
        const { execSync } = require('child_process');
        
        try {
            const result = execSync('curl -sL "' + registryUrl + '"', { encoding: 'utf-8' });
            const registry = JSON.parse(result);
            
            let results = registry.packages || [];
            
            if (query) {
                const q = query.toLowerCase();
                results = results.filter(p => 
                    p.name.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)) ||
                    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
                );
            }
            
            console.log("");
            console.log(CLI_COLORS.cyan + "  Found " + results.length + " packages:" + CLI_COLORS.reset);
            console.log("");
            
            for (const pkg of results.slice(0, 20)) {
                console.log("  📦 " + CLI_COLORS.bold + pkg.name + CLI_COLORS.reset);
                if (pkg.description) {
                    console.log("     " + CLI_COLORS.dim + pkg.description + CLI_COLORS.reset);
                }
                console.log("     " + CLI_COLORS.dim + "omni install github:" + pkg.repo + CLI_COLORS.reset);
                console.log("");
            }
        } catch (e) {
            CLI_warning("Could not fetch registry. You can still install packages directly:");
            console.log(CLI_COLORS.dim + "  omni install github:user/repo" + CLI_COLORS.reset);
        }
    
}
