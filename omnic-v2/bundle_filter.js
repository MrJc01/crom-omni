const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'dist', 'omni_bundle.js');

try {
    if (!fs.existsSync(bundlePath)) {
        console.error("Bundle not found: " + bundlePath);
        process.exit(1);
    }

    let content = fs.readFileSync(bundlePath, 'utf8');
    console.log("Original size: " + content.length);

    // Regex to match the problematic lines
    // Pattern: if (typeof global !== 'undefined') Object.assign(global, _token);
    // Note: The bundle might have different whitespace or be minified/modified?
    // But mostly it's line-based.
    
    const regex = /if \(typeof global !== 'undefined'\) Object\.assign\(global, _\w+\);/g;
    
    const matches = content.match(regex);
    console.log("Matches found: " + (matches ? matches.length : 0));
    
    if (matches) {
        content = content.replace(regex, '');
        console.log("Replaced problematic lines.");
        fs.writeFileSync(bundlePath, content, 'utf8');
        console.log("Saved new bundle. Size: " + content.length);
    } else {
        console.log("No matches found. Check if the line differs?");
        // Fallback search
        if (content.includes("Object.assign(global, _")) {
            console.log("WARNING: content contains 'Object.assign(global, _' but regex failed!");
            const idx = content.indexOf("Object.assign(global, _");
            console.log("Context: " + content.substring(idx-20, idx+50));
        }
    }
} catch (e) {
    console.error("Error: " + e.message);
    process.exit(1);
}
