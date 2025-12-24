const types = require("./types.js");
if (typeof global !== 'undefined') Object.assign(global, types);
const interfaces = require("./interfaces.js");
if (typeof global !== 'undefined') Object.assign(global, interfaces);
const impl_js = require("./impl_js.js");
if (typeof global !== 'undefined') Object.assign(global, impl_js);
const impl_python = require("./impl_python.js");
if (typeof global !== 'undefined') Object.assign(global, impl_python);
const impl_cnative = require("./impl_cnative.js");
if (typeof global !== 'undefined') Object.assign(global, impl_cnative);
const impl_lua = require("./impl_lua.js");
if (typeof global !== 'undefined') Object.assign(global, impl_lua);
const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);

    const { ContractRegistry } = types;
    const { register_std_interfaces } = interfaces;
    const { register_js_impl } = impl_js;
    const { register_python_impl } = impl_python;
    const { register_cnative_impl } = impl_cnative;
    const { register_lua_impl } = impl_lua;

function new_map() {
     return {}; 
    return 0;
}
function ContractRegistry_new() {
    const registry = new ContractRegistry({ interfaces: new_map(), implementations: new_map(), active_target: "js" });
    register_std_interfaces(registry);
    register_js_impl(registry);
    register_python_impl(registry);
    register_cnative_impl(registry);
    register_lua_impl(registry);
    return registry;
}
function ContractRegistry_set_target(self, target) {
    
        self.active_target = target;
        // console.log("[contract] Active target: " + target);
    
}
function ContractRegistry_resolve(self, contract_path, args) {
    const result = "";
    
        const impl = self.implementations[self.active_target];
        if (!impl) {
            result = "/* UNKNOWN TARGET: " + self.active_target + " */";
            return;
        }
        
        let template = impl[contract_path];
        if (!template) {
            // Fallback to JS implementation? No, that's dangerous if semantics differ.
            // But preserving original behavior:
            template = self.implementations['js'][contract_path];
            if (!template) {
                result = "/* UNIMPLEMENTED: " + contract_path + " */";
                return;
            }
        }
        
        // Replace placeholders with arguments
        result = template;
        for (let i = 0; i < args.length; i++) {
            result = result.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
        }
    
    return result;
}
function ContractRegistry_list_interfaces(self) {
    
        console.log("\n┌─────────────────────────────────────────────────────────────┐");
        console.log("│              CANONICAL INTERFACES (Hollow Core)             │");
        console.log("├─────────────────────────────────────────────────────────────┤");
        
        for (const [name, iface] of Object.entries(self.interfaces)) {
            const methodCount = Object.keys(iface.methods).length;
            console.log("│ " + name.padEnd(20) + " │ " + 
                        iface.category.padEnd(10) + " │ " +
                        (methodCount + " methods").padEnd(15) + " │");
        }
        
        console.log("└─────────────────────────────────────────────────────────────┘");
    
}
function ContractRegistry_verify_target(self, target) {
    const is_complete = true;
    const missing = 0;
    
        const impl = self.implementations[target];
        if (!impl) {
            terminal.CLI_error("Target '" + target + "' has no implementations");
            is_complete = false;
            return;
        }
        
        // Check all interfaces
        for (const [ifaceName, iface] of Object.entries(self.interfaces)) {
            for (const methodName of Object.keys(iface.methods)) {
                const contractPath = ifaceName + '.' + methodName;
                if (!impl[contractPath]) {
                    missing++;
                }
            }
        }
        
        if (missing > 0) {
            CLI_warning("Target '" + target + "' has " + missing + " missing implementations");
            is_complete = false;
        }
    
    return is_complete;
}
const GLOBAL_CONTRACTS = ContractRegistry_new();


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_map = new_map;
    exports.ContractRegistry_new = ContractRegistry_new;
    exports.ContractRegistry_set_target = ContractRegistry_set_target;
    exports.ContractRegistry_resolve = ContractRegistry_resolve;
    exports.ContractRegistry_list_interfaces = ContractRegistry_list_interfaces;
    exports.ContractRegistry_verify_target = ContractRegistry_verify_target;
    exports.GLOBAL_CONTRACTS = GLOBAL_CONTRACTS;
}
