BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
function print(msg) {
     console.log(msg); 
    
print(msg)

}
function read_file(path) {
    const content = "";
    
        const fs = require("fs");
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }
    
    
with open(path, "r") as f:
    content = f.read()

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
    
    
with open(path, "w") as f:
    f.write(content)

}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.print = print;
    exports.read_file = read_file;
    exports.write_file = write_file;
}
