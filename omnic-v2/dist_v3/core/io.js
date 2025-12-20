function read_file(path) {
    let content = "";
    
        const fs = require("fs");
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }
    
    return content;
}
function write_file(path, content) {
    
        const fs = require("fs");
        try {
            fs.writeFileSync(path, content);
        } catch (e) {
            console.error("Error writing file " + path + ": " + e.message);
            process.exit(1);
        }
    
}
function print(msg) {
    
        console.log(msg);
    
}

module.exports = { read_file, write_file, print };
