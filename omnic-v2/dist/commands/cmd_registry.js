BlockLoop: 80 (native)
const contracts = require("./core/contracts.js");
function cmd_contracts() {
    
        const registry = ContractRegistry_new();
        ContractRegistry_list_interfaces(registry);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.cmd_contracts = cmd_contracts;
}
