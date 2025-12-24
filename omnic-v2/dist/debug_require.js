
try {
    console.log("Attempting to require ./lib/cli.js");
    const cli = require('./lib/cli.js');
    console.log("Success: ", cli);
} catch(e) {
    console.error("Failed:");
    console.error(e);
}
