function read_file(path) {
    let content = "";
    
        let fs = require("fs");
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }
    
    return content;
}
function write_file(path, content) {
    
        let fs = require("fs");
        try {
            fs.writeFileSync(path, content);
        } catch (e) {
            console.error("Error writing file " + path + ": " + e.message);
            process.exit(1);
        }
    
}

// --- [Bootstrap Auto-Patch] ---
// Exporta símbolos para require()
module.exports = { read_file, write_file };

// Injeta no Global para simular o namespace plano do Omni
Object.assign(global, module.exports);
