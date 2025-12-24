BlockLoop: 10 (CLI_info)
BlockLoop: 42 (()
const cli = require("./lib/cli.js");
function cmd_build() {
    CLI_info;
    "Building from omni.config.json...";
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_build = cmd_build;
}
