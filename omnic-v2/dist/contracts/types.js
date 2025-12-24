class CanonicalInterface {
    constructor(data = {}) {
        this.name = data.name;
        this.category = data.category;
        this.methods = data.methods;
        this.version = data.version;
    }
}
class ContractMethod {
    constructor(data = {}) {
        this.name = data.name;
        this.signature = data.signature;
        this.params = data.params;
        this.return_type = data.return_type;
        this.description = data.description;
    }
}
class ContractRegistry {
    constructor(data = {}) {
        this.interfaces = data.interfaces;
        this.implementations = data.implementations;
        this.active_target = data.active_target;
    }
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CanonicalInterface = CanonicalInterface;
    exports.ContractMethod = ContractMethod;
    exports.ContractRegistry = ContractRegistry;
}
