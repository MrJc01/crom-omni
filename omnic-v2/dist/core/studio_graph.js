const ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
const graph_types = require("../studio/graph_types.js");
if (typeof global !== 'undefined') Object.assign(global, graph_types);
const graph_convert = require("../studio/graph_convert.js");
if (typeof global !== 'undefined') Object.assign(global, graph_convert);
const graph_io = require("../studio/graph_io.js");
if (typeof global !== 'undefined') Object.assign(global, graph_io);
const graph_actions = require("../studio/graph_actions.js");
if (typeof global !== 'undefined') Object.assign(global, graph_actions);

