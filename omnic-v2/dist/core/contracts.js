const types = require("../contracts/types.js");
if (typeof global !== 'undefined') Object.assign(global, types);
const registry = require("../contracts/registry.js");
if (typeof global !== 'undefined') Object.assign(global, registry);
const interfaces = require("../contracts/interfaces.js");
if (typeof global !== 'undefined') Object.assign(global, interfaces);
const impl_js = require("../contracts/impl_js.js");
if (typeof global !== 'undefined') Object.assign(global, impl_js);
const impl_python = require("../contracts/impl_python.js");
if (typeof global !== 'undefined') Object.assign(global, impl_python);
const impl_cnative = require("../contracts/impl_cnative.js");
if (typeof global !== 'undefined') Object.assign(global, impl_cnative);
const impl_lua = require("../contracts/impl_lua.js");
if (typeof global !== 'undefined') Object.assign(global, impl_lua);

