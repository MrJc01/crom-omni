const studio_engine = require("../core/studio_engine.js");
if (typeof global !== 'undefined') Object.assign(global, studio_engine);
const tui = require("../core/tui.js");
if (typeof global !== 'undefined') Object.assign(global, tui);
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
    cmd_tui();
} else {
    cmd_studio(port, open_app);
}
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_studio_cli = cmd_studio_cli;
}
