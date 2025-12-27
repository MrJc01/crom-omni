const fs = require('fs');
const path = require('path');

const tokenPath = path.join('dist', 'core', 'token.js');
let content = fs.readFileSync(tokenPath, 'utf8');

// Find all TOKEN_ declarations
const regex = /let\s+(TOKEN_\w+)\s*=/g;
let match;
const tokens = [];

while ((match = regex.exec(content)) !== null) {
    tokens.push(match[1]);
}

console.log(`Found ${tokens.length} tokens.`);

// Check if exports already correct (avoid double patch)
if (content.includes('TOKEN_ILLEGAL')) {
    // Replace the exports line
    // Look for module.exports = { new_token };
    
    const exportBlock = `module.exports = { new_token, ${tokens.join(', ')} };`;
    
    if (content.includes('module.exports = { new_token };')) {
        content = content.replace('module.exports = { new_token };', exportBlock);
        fs.writeFileSync(tokenPath, content);
        console.log('Patched token.js exports.');
    } else if (content.includes('module.exports = {')) {
        // Already complicated exports or patched?
        // Let's just append an assignment
        const append = `\nObject.assign(module.exports, { ${tokens.join(', ')} });\n`;
        fs.appendFileSync(tokenPath, append);
        console.log('Appended exports to token.js.');
    } else {
        console.log('Could not find standard exports line.');
    }
}
