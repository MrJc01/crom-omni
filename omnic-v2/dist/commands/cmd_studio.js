BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 64 (if)
BlockLoop: 10 (cmd_tui)
BlockLoop: 42 (()
BlockLoop: 10 (cmd_studio)
BlockLoop: 42 (()
BlockLoop: 10 (open_app)
BlockLoop: 43 ())
const studio_engine = require("./core/studio_engine.js");
const tui = require("./core/tui.js");
function cmd_studio_cli() {
    const port = 3000;
    const open_app = false;
    const run_tui = false;
    
        // Parse port option
        for (let i = 3; i < process.argv.length; i++) {
            if (process.argv[i] === '--port' && process.argv[i + 1]) {
                port = parseInt(process.argv[i + 1]);
            }
            if (process.argv[i] === '--app') {
                open_app = true;
            }
            if (process.argv[i] === '--tui') {
                run_tui = true;
            }
        }
    
    if (run_tui) {
    cmd_tui;
    // Unknown stmt kind: 0
} else {
    cmd_studio;
    port;
    open_app;
    // Unknown stmt kind: 0
}
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_studio_cli = cmd_studio_cli;
}
