
try {
    require('./omni_bundle.js');
    console.log("No syntax error");
} catch (e) {
    console.log("SYNTAX ERROR:");
    if (e.message) {
        console.log("PART1:", e.message.substring(0, 50));
        console.log("PART2:", e.message.substring(50));
    }
}
