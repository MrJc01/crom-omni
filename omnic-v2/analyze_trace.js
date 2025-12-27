const fs = require('fs');
try {
    const content = fs.readFileSync('lexer_loop_trace.txt', 'ucs2');
    const lines = content.split('\n');
    let letCount = 0;
    lines.forEach(line => {
        if (line.includes("DEBUG LOOKUP") || line.includes("DEBUG PARSE LET")) {
            console.log(line.trim());
        }
    });
    console.log("Total [let] lookups: " + letCount);
} catch (e) {
    console.error(e);
}
