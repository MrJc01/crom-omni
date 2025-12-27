const _studio_engine = require("../core/studio_engine.js");
if (typeof global !== 'undefined') Object.assign(global, _studio_engine);
const _tui = require("../core/tui.js");
if (typeof global !== 'undefined') Object.assign(global, _tui);
function cmd_studio_cli() {
    let port = 3000;
    let open_app = false;
    let run_tui = false;
    
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

module.exports = { cmd_studio_cli };
