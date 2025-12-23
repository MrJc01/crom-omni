function print(msg) {
     console.log(msg); 
}
class FileInfo {
    constructor(data = {}) {
        this.name = data.name;
        this.path = data.path;
        this.size = data.size;
        this.is_directory = data.is_directory;
        this.modified = data.modified;
    }
}
class ReadResult {
    constructor(data = {}) {
        this.success = data.success;
        this.content = data.content;
        this.error = data.error;
    }
}
class WriteResult {
    constructor(data = {}) {
        this.success = data.success;
        this.bytes_written = data.bytes_written;
        this.error = data.error;
    }
}
class FileSystem {
    static read(path) {
    let result = new ReadResult({ success: false, content: "", error: "" });
    
            const fs = require('fs');
            try {
                result.content = fs.readFileSync(path, 'utf8');
                result.success = true;
            } catch (e) {
                result.error = e.message;
                result.success = false;
            }
        
    
    return result;
}
    static write(path, content) {
    let result = new WriteResult({ success: false, bytes_written: 0, error: "" });
    
            const fs = require('fs');
            try {
                fs.writeFileSync(path, content, 'utf8');
                result.bytes_written = Buffer.byteLength(content);
                result.success = true;
            } catch (e) {
                result.error = e.message;
                result.success = false;
            }
        
    
    return result;
}
    static append(path, content) {
    let result = new WriteResult({ success: false, bytes_written: 0, error: "" });
    
            const fs = require('fs');
            try {
                fs.appendFileSync(path, content, 'utf8');
                result.bytes_written = Buffer.byteLength(content);
                result.success = true;
            } catch (e) {
                result.error = e.message;
                result.success = false;
            }
        
    return result;
}
    static exists(path) {
    let result = false;
    
            const fs = require('fs');
            result = fs.existsSync(path);
        
    
    return result;
}
    static delete(path) {
    let success = false;
    
            const fs = require('fs');
            try {
                fs.unlinkSync(path);
                success = true;
            } catch (e) {
                success = false;
            }
        
    return success;
}
    static info(path) {
    let fi = new FileInfo({ name: "", path: path, size: 0, is_directory: false, modified: "" });
    
            const fs = require('fs');
            const path_mod = require('path');
            try {
                const stats = fs.statSync(path);
                fi.name = path_mod.basename(path);
                fi.size = stats.size;
                fi.is_directory = stats.isDirectory();
                fi.modified = stats.mtime.toISOString();
            } catch (e) {
                // File not found
            }
        
    return fi;
}
    static list_dir(path) {
    let files = [];
    
            const fs = require('fs');
            const path_mod = require('path');
            try {
                const entries = fs.readdirSync(path);
                files = entries.map(name => {
                    const fullPath = path_mod.join(path, name);
                    try {
                        const stats = fs.statSync(fullPath);
                        return {
                            name: name,
                            path: fullPath,
                            size: stats.size,
                            is_directory: stats.isDirectory(),
                            modified: stats.mtime.toISOString()
                        };
                    } catch (e) {
                        return {
                            name: name,
                            path: fullPath,
                            size: 0,
                            is_directory: false,
                            modified: ''
                        };
                    }
                });
            } catch (e) {
                // Directory not accessible
            }
        
    return files;
}
}

class Path {
    static join(a, b) {
    let result = "";
    
            const path = require('path');
            result = path.join(a, b);
        
    return result;
}
    static basename(path) {
    let result = "";
    
            const path_mod = require('path');
            result = path_mod.basename(path);
        
    return result;
}
    static dirname(path) {
    let result = "";
    
            const path_mod = require('path');
            result = path_mod.dirname(path);
        
    return result;
}
    static extension(path) {
    let result = "";
    
            const path_mod = require('path');
            result = path_mod.extname(path);
        
    return result;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - File System Master          ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("FileSystem Capsule Operations:");
    print("  FileSystem.read(path)           -> ReadResult");
    print("  FileSystem.write(path, content) -> WriteResult");
    print("  FileSystem.append(path, data)   -> WriteResult");
    print("  FileSystem.exists(path)         -> bool");
    print("  FileSystem.delete(path)         -> bool");
    print("  FileSystem.info(path)           -> FileInfo");
    print("  FileSystem.list_dir(path)       -> FileInfo[]");
    print("");
    print("Path Capsule Utilities:");
    print("  Path.join(a, b)      -> combined path");
    print("  Path.basename(path)  -> filename");
    print("  Path.dirname(path)   -> directory");
    print("  Path.extension(path) -> file extension");
    print("");
    print("Example Usage:");
    print("  let content = FileSystem.read(\"config.json\");");
    print("  if (content.success) {");
    print("      print(content.content);");
    print("  }");
    print("");
    print("✓ File system module ready!");
    print("  All operations return result structs for safe error handling.");
}

main();
