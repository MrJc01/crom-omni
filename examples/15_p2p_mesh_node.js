function print(msg) {
     console.log(msg); 
}
class Peer {
    constructor(data = {}) {
        this.id = data.id;
        this.address = data.address;
        this.port = data.port;
        this.last_seen = data.last_seen;
        this.is_connected = data.is_connected;
    }
}
class Message {
    constructor(data = {}) {
        this.id = data.id;
        this.from_peer = data.from_peer;
        this.to_peer = data.to_peer;
        this.message_type = data.message_type;
        this.payload = data.payload;
        this.timestamp = data.timestamp;
    }
}
class NodeState {
    constructor(data = {}) {
        this.node_id = data.node_id;
        this.peers = data.peers;
        this.message_queue = data.message_queue;
        this.data_store = data.data_store;
    }
}
class P2PNode {
    static state = new NodeState({ node_id: "", peers: [], message_queue: [], data_store: 0 });
    static running = false;
    static init(port) {
    
            const crypto = require('crypto');
            P2PNode.state.node_id = crypto.randomBytes(8).toString('hex');
            P2PNode.state.data_store = {};
            
            console.log('  Node ID: ' + P2PNode.state.node_id);
            console.log('  Listening on port: ' + port);
        
    P2PNode.running = true;
}
    static discover_peers(seed_addresses) {
    let discovered = [];
    
            const crypto = require('crypto');
            
            for (const addr of seed_addresses) {
                const [host, portStr] = addr.split(':');
                const peer = {
                    id: crypto.randomBytes(8).toString('hex'),
                    address: host,
                    port: parseInt(portStr) || 8080,
                    last_seen: new Date().toISOString(),
                    is_connected: true
                };
                discovered.push(peer);
                P2PNode.state.peers.push(peer);
            }
        
    return discovered;
}
    static connect(address, port) {
    let peer = new Peer({ id: "", address: address, port: port, last_seen: "", is_connected: false });
    
            const crypto = require('crypto');
            
            // Simulate connection handshake
            peer.id = crypto.randomBytes(8).toString('hex');
            peer.last_seen = new Date().toISOString();
            peer.is_connected = true;
            
            P2PNode.state.peers.push(peer);
            
            console.log('  Connected to peer: ' + peer.id);
        
    return peer;
}
    static send(to_peer_id, message_type, payload) {
    let msg = new Message({ id: "", from_peer: P2PNode.state.node_id, to_peer: to_peer_id, message_type: message_type, payload: payload, timestamp: "" });
    
            const crypto = require('crypto');
            msg.id = crypto.randomBytes(4).toString('hex');
            msg.timestamp = new Date().toISOString();
            
            // In real implementation, would use WebSocket/TCP
            console.log('  > Sent [' + message_type + '] to ' + to_peer_id.substring(0, 8) + '...');
        
    return msg;
}
    static broadcast(message_type, payload) {
    let sent_count = 0;
    
            for (const peer of P2PNode.state.peers) {
                if (peer.is_connected) {
                    P2PNode.send(peer.id, message_type, payload);
                    sent_count++;
                }
            }
        
    return sent_count;
}
    static on_message(msg) {
    
            console.log('  < Received [' + msg.message_type + '] from ' + msg.from_peer.substring(0, 8) + '...');
            
            // Handle different message types
            switch (msg.message_type) {
                case 'ping':
                    P2PNode.send(msg.from_peer, 'pong', '');
                    break;
                case 'sync':
                    // Sync data with peer
                    const data = JSON.parse(msg.payload);
                    Object.assign(P2PNode.state.data_store, data);
                    break;
                case 'data':
                    P2PNode.state.message_queue.push(msg);
                    break;
            }
        
}
    static store(key, value) {
    
            P2PNode.state.data_store[key] = value;
            
            // Replicate to peers
            const payload = JSON.stringify({ [key]: value });
            P2PNode.broadcast('sync', payload);
        
}
    static get(key) {
    let value = 0;
    
            value = P2PNode.state.data_store[key];
        
    return value;
}
    static peer_count() {
    let count = 0;
    
            count = P2PNode.state.peers.filter(p => p.is_connected).length;
        
    return count;
}
    static heartbeat() {
    
            console.log('  Heartbeat: pinging ' + P2PNode.state.peers.length + ' peers');
            P2PNode.broadcast('ping', '');
        
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - P2P Mesh Node               ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("1. Initializing P2P Node...");
    P2PNode.init(8080);
    print("   ✓ Node started");
    print("");
    print("2. Discovering peers...");
    let seeds = ["192.168.1.10:8080", "192.168.1.11:8080", "192.168.1.12:8080"];
    let peers = P2PNode.discover_peers(seeds);
    print("   ✓ Found 3 peers");
    print("");
    print("3. Connecting to additional peer...");
    let new_peer = P2PNode.connect("10.0.0.5", 8080);
    print("   ✓ Connected (total: 4 peers)");
    print("");
    print("4. Sending messages...");
    P2PNode.broadcast("ping", "");
    print("   ✓ Broadcast ping to all peers");
    print("");
    print("5. Distributed storage...");
    
        P2PNode.store('greeting', 'Hello, Mesh!');
        P2PNode.store('counter', 42);
    
    print("   ✓ Stored and replicated: greeting, counter");
    print("");
    print("6. Heartbeat...");
    P2PNode.heartbeat();
    print("");
    print("P2P Node API:");
    print("  P2PNode.init(port)              - Start node");
    print("  P2PNode.discover_peers(seeds)   - Find peers");
    print("  P2PNode.connect(addr, port)     - Connect to peer");
    print("  P2PNode.send(peer, type, data)  - Send message");
    print("  P2PNode.broadcast(type, data)   - Broadcast");
    print("  P2PNode.store(key, value)       - Distributed store");
    print("  P2PNode.get(key)                - Retrieve data");
    print("");
    print("✓ P2P mesh node demo complete!");
    print("  This demonstrates the Crom-Nodus P2P architecture.");
}

main();
