BlockLoop: 66 (return)
BlockLoop: 43 ())
BlockLoop: 10 (res)
BlockLoop: 31 (.)
BlockLoop: 10 (end)
BlockLoop: 42 (()
BlockLoop: 10 (stringify)
BlockLoop: 42 (()
BlockLoop: 10 (project)
BlockLoop: 43 ())
BlockLoop: 43 ())
BlockLoop: 66 (return)
const cli = require("./lib/cli.js");
const project = require("./studio/project.js");
const runner = require("./studio/runner.js");
const state = require("./studio/state.js");
const html = require("./studio/html.js");
class StudioServer {
    constructor(data = {}) {
        this.port = data.port;
        this.project = data.project;
        this.runner = data.runner;
        this.graph = data.graph;
    }
}
function StudioServer_new(port) {
    return new StudioServer({ port: port, project: new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" }), runner: CrossRunner_new, (: null, graph: GraphState_new, (: null, ;: null, StudioServer_start: self, :: null, dir: string, ): CLI_banner, (: null, CLI_header: "Omni Studio", ): self, .: null, detect_project: dir, ): CLI_info, (: null, self: project, .: null, ;: "Type: ", self: project, .: null, ;: "js", {: http = require, (: http, ': null, const: null, require: null, fs: null, ;: path = require, (: path, ': null, const: null, http: createServer, (: req, res: null, >: null, (: null, url: null, ': api, /: null, ): res, .: 200, {: Content, -: null, :: application, /: null });
    // Unknown stmt kind: 0
    res;
    // Unknown stmt kind: 0
    end;
    JSON;
    stringify;
    self;
    project;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    return null;
}
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
if (req) {
    url;
}
// Unknown stmt kind: undefined
return null;
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.StudioServer_new = StudioServer_new;
    exports.StudioServer_start = StudioServer_start;
    exports.StudioServer = StudioServer;
}
