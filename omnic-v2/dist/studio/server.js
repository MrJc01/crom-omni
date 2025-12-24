const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const project = require("./project.js");
if (typeof global !== 'undefined') Object.assign(global, project);
const runner = require("./runner.js");
if (typeof global !== 'undefined') Object.assign(global, runner);
const state = require("./state.js");
if (typeof global !== 'undefined') Object.assign(global, state);
const html = require("./html.js");
if (typeof global !== 'undefined') Object.assign(global, html);
class StudioServer {
    constructor(data = {}) {
        this.port = data.port;
        this.project = data.project;
        this.runner = data.runner;
        this.graph = data.graph;
    }
}
function StudioServer_new(port) {
    return new StudioServer({ port: port, project: new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" }), runner: CrossRunner_new(), graph: GraphState_new() });
}
function StudioServer_start(self, dir) {
    CLI_banner();
    CLI_header("Omni Studio");
    self.project = detect_project(dir);
    CLI_info("Project: " + self.project.name);
    CLI_info("Type: " + self.project.type);
    
        const http = require('http');
        const fs = require('fs');
        const path = require('path');
        
        const server = http.createServer((req, res) => {
            // API Routes
            if (req.url === '/api/project') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(self.project));
                return;
            }
            
            if (req.url === '/api/graph') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(GraphState_to_json(self.graph));
                return;
            }
            
            if (req.url === '/api/packages') {
                // Warning: PackageRegistry_new might need import or be available
                // Assuming it's available via global context or we need to import it here.
                // For now, let's assume it's imported in facade or globally available.
                const registry = PackageRegistry_new();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(registry.packages));
                return;
            }
            
            // Serve Studio UI
            if (req.url === '/' || req.url === '/index.html') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(generate_studio_html(self));
                return;
            }
            
            res.writeHead(404);
            res.end('Not Found');
        });
        
        server.listen(self.port, () => {
            console.log("");
            console.log(CLI_COLORS.green + "  ╔════════════════════════════════════════════════╗" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║                                                ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║       OMNI STUDIO - Ready                      ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ║                                                ║" + CLI_COLORS.reset);
            console.log(CLI_COLORS.green + "  ╚════════════════════════════════════════════════╝" + CLI_COLORS.reset);
            console.log("");
            console.log(CLI_COLORS.cyan + "  → Local:   " + CLI_COLORS.reset + "http://localhost:" + self.port);
            console.log(CLI_COLORS.cyan + "  → Project: " + CLI_COLORS.reset + self.project.name);
            console.log("");
            CLI_info("Press Ctrl+C to stop");
        });
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.StudioServer_new = StudioServer_new;
    exports.StudioServer_start = StudioServer_start;
    exports.StudioServer = StudioServer;
}
