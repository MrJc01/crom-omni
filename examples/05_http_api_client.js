function print(msg) {
     console.log(msg); 
}
class HttpResponse {
    constructor(data = {}) {
        this.status = data.status;
        this.body = data.body;
        this.headers = data.headers;
    }
}
class ApiUser {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
    }
}
class Http {
    static get(url) {
    let response = new HttpResponse({ status: 0, body: "", headers: 0 });
    
            // Node.js implementation using https
            const https = require('https');
            const http = require('http');
            
            return new Promise((resolve) => {
                const protocol = url.startsWith('https') ? https : http;
                
                protocol.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        response.status = res.statusCode;
                        response.body = data;
                        response.headers = res.headers;
                        resolve(response);
                    });
                }).on('error', (err) => {
                    response.status = 0;
                    response.body = err.message;
                    resolve(response);
                });
            });
        
    return response;
}
    static post(url, body, content_type) {
    let response = new HttpResponse({ status: 0, body: "", headers: 0 });
    
            const https = require('https');
            const http = require('http');
            const { URL } = require('url');
            
            return new Promise((resolve) => {
                const parsedUrl = new URL(url);
                const protocol = url.startsWith('https') ? https : http;
                
                const options = {
                    hostname: parsedUrl.hostname,
                    port: parsedUrl.port || (url.startsWith('https') ? 443 : 80),
                    path: parsedUrl.pathname + parsedUrl.search,
                    method: 'POST',
                    headers: {
                        'Content-Type': content_type,
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                
                const req = protocol.request(options, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        response.status = res.statusCode;
                        response.body = data;
                        response.headers = res.headers;
                        resolve(response);
                    });
                });
                
                req.on('error', (err) => {
                    response.status = 0;
                    response.body = err.message;
                    resolve(response);
                });
                
                req.write(body);
                req.end();
            });
        
    return response;
}
    static parse_json(json_str) {
    let result = 0;
    
            try {
                result = JSON.parse(json_str);
            } catch (e) {
                result = null;
            }
        
    return result;
}
}

class ApiClient {
    static base_url = "https://jsonplaceholder.typicode.com";
    static fetch_user(user_id) {
    let url = base_url + "/users/" + "1";
    let response = Http.get(url);
    let user = new ApiUser({ id: 0, name: "", email: "", phone: "" });
    
            // Since Http.get returns a Promise in JS
            return Http.get(url).then(resp => {
                if (resp.status === 200) {
                    const data = JSON.parse(resp.body);
                    user.id = data.id;
                    user.name = data.name;
                    user.email = data.email;
                    user.phone = data.phone;
                }
                return user;
            });
        
    return user;
}
    static fetch_all_users() {
    let users = [];
    let url = base_url + "/users";
    
            return Http.get(url).then(resp => {
                if (resp.status === 200) {
                    const data = JSON.parse(resp.body);
                    users = data.map(u => ({
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        phone: u.phone
                    }));
                }
                return users;
            });
        
    return users;
}
    static create_post(title, body, user_id) {
    let url = base_url + "/posts";
    let payload = "";
    
            payload = JSON.stringify({
                title: title,
                body: body,
                userId: user_id
            });
            
            return Http.post(url, payload, 'application/json').then(resp => {
                return JSON.parse(resp.body);
            });
        
    return 0;
}
}

class Demo {
    static run() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - HTTP API Client             ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("This example demonstrates HTTP requests using std.http");
    print("It connects to JSONPlaceholder API (jsonplaceholder.typicode.com)");
    print("");
    print("1. GET Request - Fetch single user:");
    print("   ApiClient.fetch_user(1)");
    print("   -> Returns: { id: 1, name: \"Leanne Graham\", ... }");
    print("");
    print("2. GET Request - Fetch all users:");
    print("   ApiClient.fetch_all_users()");
    print("   -> Returns: Array of 10 users");
    print("");
    print("3. POST Request - Create a post:");
    print("   ApiClient.create_post(\"My Title\", \"My Body\", 1)");
    print("   -> Returns: { id: 101, title: \"My Title\", ... }");
    print("");
    print("Code Structure:");
    print("  Http capsule     - Low-level HTTP operations");
    print("  ApiClient capsule - High-level API wrapper");
    print("");
    print("✓ HTTP API client example ready!");
    print("  Compile and run to make real API calls.");
}
}

function main() {
    Demo.run();
}

main();
