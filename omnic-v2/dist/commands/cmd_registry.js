const _contracts = require("../core/contracts.js");
if (typeof global !== 'undefined') Object.assign(global, _contracts);
function cmd_contracts() {
    
        const registry = ContractRegistry_new();
        ContractRegistry_list_interfaces(registry);
    
}

module.exports = { cmd_contracts };
