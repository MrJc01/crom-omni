
const fs = require('fs');
const content = fs.readFileSync('omnic-v2/dist/omni_bundle.js', 'utf8');

// Use acorn to parse and find exact error location
const acorn = require('acorn');

try {
    acorn.parse(content, { ecmaVersion: 2020 });
    console.log('No syntax errors');
} catch (e) {
    console.log('Error at line:', e.loc.line, 'column:', e.loc.column);
    console.log('Message:', e.message);
    
    // Show the exact bytes around the error
    const lines = content.split('\n');
    console.log('\nLine', e.loc.line, ':');
    console.log(JSON.stringify(lines[e.loc.line - 1]));
    console.log('\nPrevious line:');
    console.log(JSON.stringify(lines[e.loc.line - 2]));
}
