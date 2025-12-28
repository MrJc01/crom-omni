// omnic/lib/std/http_adapter_js.js
// Universal HTTP Adapter for Node.js (Zero Dependency)
// Implements the contract defined in std/http.omni

const http = require('http');
const https = require('https');

const StdHttp = {
    // Server Listener
    listen: (port, handler) => {
        const server = http.createServer((req, res) => {
            // Read body if needed
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                
                // Construct Omni Request Object
                const omniReq = {
                    method: req.method,
                    path: req.url,
                    headers: req.headers,
                    body: body
                };

                // Delegate to Omni Handler (metamorphosis target)
                // Assuming handler takes (req) and returns { status, body }
                const omniRes = handler(omniReq);

                // Send Response
                res.writeHead(omniRes.status || 200, { 'Content-Type': 'application/json' });
                res.end(typeof omniRes.body === 'string' ? omniRes.body : JSON.stringify(omniRes.body));
            });
        });

        server.listen(port, () => {
            console.log(`\x1b[36m✨ Omni Server running on port ${port}\x1b[0m`);
        });
    },

    // Client GET
    get: (url) => {
        return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? https : http;
            lib.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        body: tryParse(data)
                    });
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
};

function tryParse(str) {
    try { return JSON.parse(str); } catch (e) { return str; }
}

module.exports = StdHttp;
