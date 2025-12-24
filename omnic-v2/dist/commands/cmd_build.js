const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
function cmd_build() {
    CLI_info("Building from omni.config.json...");
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_build = cmd_build;
}
