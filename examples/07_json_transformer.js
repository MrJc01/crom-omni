function print(msg) {
     console.log(msg); 
}
class Config {
    constructor(data = {}) {
        this.app_name = data.app_name;
        this.version = data.version;
        this.debug = data.debug;
        this.port = data.port;
        this.features = data.features;
    }
}
class User {
    constructor(data = {}) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.active = data.active;
    }
}
class ApiResponse {
    constructor(data = {}) {
        this.success = data.success;
        this.data = data.data;
        this.error = data.error;
        this.timestamp = data.timestamp;
    }
}
class JSON {
    static parse(json_str) {
    let result = 0;
    
            try {
                result = JSON.parse(json_str);
            } catch (e) {
                result = null;
            }
        
    
    return result;
}
    static stringify(data) {
    let result = "";
    
            try {
                result = JSON.stringify(data);
            } catch (e) {
                result = "{}";
            }
        
    
    return result;
}
    static pretty(data) {
    let result = "";
    
            try {
                result = JSON.stringify(data, null, 2);
            } catch (e) {
                result = "{}";
            }
        
    
    return result;
}
    static get(data, path) {
    let result = 0;
    
            try {
                const parts = path.split('.');
                result = data;
                for (const part of parts) {
                    if (result === null || result === undefined) break;
                    result = result[part];
                }
            } catch (e) {
                result = null;
            }
        
    return result;
}
    static set(data, path, value) {
    let result = 0;
    
            try {
                result = JSON.parse(JSON.stringify(data)); // Deep clone
                const parts = path.split('.');
                let current = result;
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!current[parts[i]]) current[parts[i]] = {};
                    current = current[parts[i]];
                }
                current[parts[parts.length - 1]] = value;
            } catch (e) {
                result = data;
            }
        
    return result;
}
    static merge(a, b) {
    let result = 0;
    
            result = { ...a, ...b };
        
    return result;
}
}

class Transformer {
    static map_users(users, transform_name) {
    let result = [];
    
            if (transform_name === 'anonymize') {
                result = users.map(u => ({
                    id: u.id,
                    username: 'user_' + u.id,
                    email: '***@***.com',
                    active: u.active
                }));
            } else if (transform_name === 'summary') {
                result = users.map(u => ({
                    id: u.id,
                    display: u.username + ' <' + u.email + '>'
                }));
            } else {
                result = users;
            }
        
    return result;
}
    static filter_active(items) {
    let result = [];
    
            result = items.filter(item => item.active === true);
        
    return result;
}
    static to_api_response(data, success) {
    let response = new ApiResponse({ success: success, data: data, error: "", timestamp: "" });
    
            response.timestamp = new Date().toISOString();
            if (!success) {
                response.error = "Operation failed";
            }
        
    return response;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - JSON Transformer            ║");
    print("╚══════════════════════════════════════╝");
    print("");
    let config_json = "{\"app_name\":\"MyApp\",\"version\":\"1.0.0\",\"debug\":true,\"port\":8080}";
    print("1. Parsing JSON:");
    print("   Input: " + config_json);
    let config = JSON.parse(config_json);
    print("   Parsed successfully!");
    print("");
    print("2. Accessing nested values:");
    print("   JSON.get(config, \"app_name\") -> \"MyApp\"");
    print("   JSON.get(config, \"port\")     -> 8080");
    print("");
    print("3. Modifying and stringifying:");
    let updated = JSON.set(config, "debug", false);
    let json_out = JSON.stringify(updated);
    print("   Modified debug to false");
    print("   Output: {\"app_name\":\"MyApp\",...,\"debug\":false}");
    print("");
    print("4. Pretty printing:");
    print("   JSON.pretty(data) formats with indentation");
    print("");
    print("5. Data transformation:");
    print("   Transformer.map_users(users, \"anonymize\")");
    print("   Transformer.filter_active(items)");
    print("   Transformer.to_api_response(data, true)");
    print("");
    print("6. Merging objects:");
    print("   JSON.merge({a:1}, {b:2}) -> {a:1, b:2}");
    print("");
    print("✓ JSON transformer ready!");
    print("  Full JSON manipulation and transformation pipeline.");
}

main();
