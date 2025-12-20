const storage = require("./shared/storage.js");
if (typeof global !== 'undefined') Object.assign(global, storage);
class LocalStorage {
    constructor(data = {}) {
        this.prefix = data.prefix;
    }
}
// impl Storage for LocalStorage
LocalStorage.prototype.get = function(key) {
    
            return localStorage.getItem(this.prefix + key);
        
    return "";
}
LocalStorage.prototype.put = function(key, value) {
    
            localStorage.setItem(this.prefix + key, value);
        
}
LocalStorage.prototype.delete = function(key) {
    
            localStorage.removeItem(this.prefix + key);
        
}

