const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const ghost_writer = require("./ghost_writer.js");
if (typeof global !== 'undefined') Object.assign(global, ghost_writer);
const project = require("../studio/project.js");
if (typeof global !== 'undefined') Object.assign(global, project);
const runner = require("../studio/runner.js");
if (typeof global !== 'undefined') Object.assign(global, runner);
const state = require("../studio/state.js");
if (typeof global !== 'undefined') Object.assign(global, state);
const server = require("../studio/server.js");
if (typeof global !== 'undefined') Object.assign(global, server);
const html = require("../studio/html.js");
if (typeof global !== 'undefined') Object.assign(global, html);

