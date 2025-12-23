class HttpRequest {
    constructor(data = {}) {
        this.url = data.url;
        this.method = data.method;
    }
}
class HubServer {
    static port = 8080;
    static start() {
    
            const http = require('http');
            
            const server = http.createServer((req, res) => {
                const url = req.url;
                const method = req.method;
                
                console.log(`[${method}] ${url}`);
                
                let body = "";
                
                // Router Logic
                if (url === '/' || url.startsWith('/#')) {
                    body = HubServer.page_home();
                } 
                else if (url === '/updates') {
                    body = HubServer.page_updates();
                }
                else if (url === '/voting') {
                    body = HubServer.page_voting();
                }
                else if (url === '/status') {
                    body = HubServer.page_status();
                }
                else if (url === '/login') {
                    body = HubServer.page_login();
                }
                else if (url === '/auth/login' && method === 'POST') {
                    // Simulation of redirection flow
                    res.writeHead(302, { 'Location': '/admin' });
                    res.end();
                    return;
                }
                else if (url === '/admin') {
                    body = HubServer.page_admin();
                }
                else if (url === '/admin/layout') {
                    body = HubServer.layout("Admin Layout", "<h1>Admin Layout</h1><a href='/admin'>Voltar</a>");
                }
                else if (url === '/stripe-checkout') {
                     // Simulation of external redirect
                     res.writeHead(302, { 'Location': '/' }); // Back to home for demo
                     res.end();
                     return;
                }
                else {
                    res.writeHead(404);
                    res.end("404 Not Found");
                    return;
                }
                
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(body);
            });
            
            server.listen(8080, () => {
                console.log(`🚀 Hub.org Server running at http://localhost:8080`);
                console.log(`   - Home:    http://localhost:8080/`);
                console.log(`   - Updates: http://localhost:8080/updates`);
                console.log(`   - Login:   http://localhost:8080/login`);
                console.log(`   - Admin:   http://localhost:8080/admin (via redirect)`);
            });
        
}
}

function main() {
    HubServer.start();
}

main();
