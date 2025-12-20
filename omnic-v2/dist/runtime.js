// Omni Micro-Runtime - Topology Resolver
// Reads omni.config.json and decides local vs RPC routing

const fs = require('fs');
const path = require('path');

// Load config at startup
let config = null;
let nodeMap = {}; // capsule -> node mapping
let currentNode = process.env.OMNI_NODE || null;

function loadConfig() {
    try {
        const configPath = process.env.OMNI_CONFIG || path.join(process.cwd(), 'omni.config.json');
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            
            // Build capsule -> node map
            if (config.nodes) {
                for (const [nodeName, nodeConfig] of Object.entries(config.nodes)) {
                    if (nodeConfig.capsules) {
                        for (const capsule of nodeConfig.capsules) {
                            nodeMap[capsule] = {
                                node: nodeName,
                                host: nodeConfig.host || 'localhost',
                                port: nodeConfig.port || 3000,
                                protocol: nodeConfig.protocol || 'http'
                            };
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('[runtime] Failed to load config:', e.message);
    }
}

loadConfig();

const TopologyResolver = {
    resolve(capsuleName) {
        const capsuleNode = nodeMap[capsuleName];
        
        if (!capsuleNode) {
            // No node mapping, assume local
            return { local: true };
        }
        
        // Check if this capsule is on the same node as us
        if (currentNode && capsuleNode.node === currentNode) {
            return { local: true };
        }
        
        // Check if no current node specified (standalone mode) - assume local
        if (!currentNode) {
            return { local: true };
        }
        
        // Different node - return RPC route
        return {
            local: false,
            url: `${capsuleNode.protocol}://${capsuleNode.host}:${capsuleNode.port}`,
            node: capsuleNode.node
        };
    },
    
    getCurrentNode() {
        return currentNode;
    },
    
    setCurrentNode(node) {
        currentNode = node;
    },
    
    getConfig() {
        return config;
    },
    
    reload() {
        loadConfig();
    }
};

// Discovery service (used by @service interfaces)
const Discovery = {
    resolve(name) {
        const capsuleRoute = nodeMap[name];
        if (capsuleRoute) {
            return `${capsuleRoute.protocol}://${capsuleRoute.host}:${capsuleRoute.port}`;
        }
        
        // Fallback to topology section
        if (config && config.topology && config.topology[name]) {
            const svc = config.topology[name];
            return `${svc.protocol || 'http'}://${svc.host}:${svc.port}`;
        }
        
        return null;
    }
};

// Make globally available
if (typeof global !== 'undefined') {
    global.TopologyResolver = TopologyResolver;
    global.Discovery = Discovery;
}

module.exports = { TopologyResolver, Discovery };
