const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'core', 'ast.js');

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Find all class definitions
const classRegex = /class\s+(\w+)/g;
const classes = [];
let match;
while ((match = classRegex.exec(content)) !== null) {
    classes.push(match[1]);
}

// Find all NODE_ definitions
const nodeRegex = /let\s+(NODE_\w+)\s*=/g;
const nodes = [];
while ((match = nodeRegex.exec(content)) !== null) {
    nodes.push(match[1]);
}

console.log(`Found ${classes.length} classes and ${nodes.length} NODE constants.`);

if (classes.length === 0 && nodes.length === 0) {
    console.log("No definitions found to export.");
    process.exit(0);
}

// Combine all exports
const allExports = [...classes, ...nodes];
const exportString = `module.exports = Object.assign(module.exports || {}, { ${allExports.join(', ')} });`;

// Append to file
// We append it at the end. Note: if there is an existing module.exports assignment, 
// Object.assign(module.exports || {}, ...) handles it if it's an object. 
// If it overwrites, we might lose previous exports?
// Standard Omni `codegen` usually ends with `module.exports = \{ ... \};`.
// So we should probably REPLACE the last module.exports or append Object.assign.
// Appending Object.assign is safest if the previous one exists.
// BUT if the previous one is `module.exports = { new_X }`, then `module.exports` is that object.
// We modify it.

fs.appendFileSync(filePath, '\n' + exportString + '\n');

console.log(`Patched ast.js exports with ${allExports.length} items.`);
