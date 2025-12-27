const _terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, _terminal);
function cmd_build() {
    CLI_info("Building from omni.config.json...");
}

module.exports = { cmd_build };
