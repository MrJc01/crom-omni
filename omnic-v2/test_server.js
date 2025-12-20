const storage = require("./shared/storage.js");
if (typeof global !== 'undefined') Object.assign(global, storage);
class PaymentProcessor {
    constructor(data = {}) {
        this.balance = data.balance;
    }
}
// impl PaymentGateway for PaymentProcessor
PaymentProcessor.prototype.process = function(amount, currency) {
    print("Processing payment: " + amount + " " + currency);
    return true;
}
PaymentProcessor.prototype.refund = function(transaction_id) {
    print("Refunding transaction: " + transaction_id);
    return true;
}
PaymentProcessor.prototype.get_balance = function(account_id) {
    print("Getting balance for: " + account_id);
    return 1000.0;
}

// === Server Skeleton with FlightRecorder ===
const http = require('http');
const FlightRecorder = global.FlightRecorder || require('./lib/debug.js').FlightRecorder;

const PaymentProcessorInstance = new PaymentProcessor();

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const [, iface, method] = url.pathname.split('/');
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        const traceId = FlightRecorder.start(iface + '.' + method);
        try {
            const args = JSON.parse(body || '{}');
            const impl = PaymentProcessorInstance;
            if (impl[method]) {
                const result = await impl[method](...Object.values(args));
                FlightRecorder.stop(traceId, { success: true });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                FlightRecorder.stop(traceId, { error: 'Method not found' });
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Method not found' }));
            }
        } catch (e) {
            FlightRecorder.stop(traceId, { error: e.message });
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
    });
});

server.listen(3001, () => {
    console.log('[PaymentGateway Server] Listening on port 3001');
});

// Save flight recorder on exit
process.on('SIGINT', () => {
    FlightRecorder.saveReport();
    process.exit();
});

