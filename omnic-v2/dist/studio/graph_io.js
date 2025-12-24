BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
const graph_types = require("./studio/graph_types.js");
function graph_to_json(graph) {
    const json = "";
    
        json = JSON.stringify(graph, null, 2);
    
    return json;
}
function json_to_graph(json) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        try {
            const parsed = JSON.parse(json);
            graph.nodes = parsed.nodes || [];
            graph.edges = parsed.edges || [];
            graph.viewport = parsed.viewport || { x: 0, y: 0, zoom: 1.0 };
            graph.metadata = parsed.metadata || {};
        } catch (e) {
            console.error("[graph] Failed to parse JSON: " + e.message);
        }
    
    return graph;
}
function get_installed_package_nodes() {
    const nodes = [];
    
        const fs = require('fs');
        const path = require('path');
        
        const packagesDir = path.join(process.cwd(), 'packages');
        if (!fs.existsSync(packagesDir)) {
            return;
        }
        
        const scanDir = (dir, pkgName = '') => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    const newPkgName = pkgName ? pkgName + '/' + entry.name : entry.name;
                    scanDir(fullPath, newPkgName);
                } else if (entry.name.endsWith('.omni')) {
                    try {
                        const source = fs.readFileSync(fullPath, 'utf-8');
                        
                        // Simple regex to find capsules and functions
                        const capsuleMatches = source.matchAll(new RegExp("capsule\\s+(\\w+)\\s*\\{", "g"));
                        for (const match of capsuleMatches) {
                            nodes.push({
                                type: 'package_capsule',
                                name: match[1],
                                package: pkgName,
                                file: entry.name,
                                import: pkgName + '/' + entry.name.replace('.omni', '')
                            });
                        }
                        
                        const fnMatches = source.matchAll(new RegExp("fn\\s+(\\w+)\\s*\\(", "g"));
                        for (const match of fnMatches) {
                            // Skip private functions (starting with _)
                            if (!match[1].startsWith('_')) {
                                nodes.push({
                                    type: 'package_function',
                                    name: match[1],
                                    package: pkgName,
                                    file: entry.name,
                                    import: pkgName + '/' + entry.name.replace('.omni', '')
                                });
                            }
                        }
                    } catch (e) {
                        // Skip files that can't be read
                    }
                }
            }
        };
        
        scanDir(packagesDir);
    }
    
    return nodes;

}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.graph_to_json = graph_to_json;
    exports.json_to_graph = json_to_graph;
    exports.get_installed_package_nodes = get_installed_package_nodes;
}
