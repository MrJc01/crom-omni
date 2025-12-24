BlockLoop: 61 (let)
BlockLoop: 40 (,)
BlockLoop: 10 (implementations)
BlockLoop: 30 (:)
BlockLoop: 44 ({)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
const types = require("./contracts/types.js");
const interfaces = require("./contracts/interfaces.js");
const impl_js = require("./contracts/impl_js.js");
const impl_python = require("./contracts/impl_python.js");
const impl_cnative = require("./contracts/impl_cnative.js");
const impl_lua = require("./contracts/impl_lua.js");
const cli = require("./lib/cli.js");
function ContractRegistry_new() {
    const registry = new ContractRegistry({ interfaces: null });
    // Unknown stmt kind: 0
    implementations;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined
return registry;
// Unknown stmt kind: undefined
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
            CLI_error("Target '" + target + "' has no implementations");
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
const GLOBAL_CONTRACTS = ContractRegistry_new;


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.ContractRegistry_new = ContractRegistry_new;
    exports.ContractRegistry_set_target = ContractRegistry_set_target;
    exports.ContractRegistry_resolve = ContractRegistry_resolve;
    exports.ContractRegistry_list_interfaces = ContractRegistry_list_interfaces;
    exports.ContractRegistry_verify_target = ContractRegistry_verify_target;
    exports.GLOBAL_CONTRACTS = GLOBAL_CONTRACTS;
}
