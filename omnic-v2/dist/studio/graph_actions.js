const graph_types = require("./graph_types.js");
if (typeof global !== 'undefined') Object.assign(global, graph_types);
function graph_add_node(graph, node_type, name, x, y) {
    const new_id = "";
    
        new_id = 'node_' + Date.now();
        
        const node = {
            id: new_id,
            type: node_type,
            name: name,
            x: x,
            y: y,
            width: 200,
            height: 80,
            ports_in: [],
            ports_out: [],
            attributes: [],
            properties: {},
            parent_id: null,
            ast_kind: 0,
            ast_line: 0
        };
        
        // Default ports based on type
        if (node_type === 'function' || node_type === 'flow') {
            node.ports_out.push({ id: 'port_ret_' + new_id, name: 'return', type: 'void' });
        }
        
        graph.nodes.push(node);
    
    return new_id;
}
function graph_remove_node(graph, node_id) {
    
        // Remove node
        graph.nodes = graph.nodes.filter(n => n.id !== node_id);
        
        // Remove connected edges
        graph.edges = graph.edges.filter(e => 
            e.source_node !== node_id && e.target_node !== node_id
        );
        
        // Remove children
        graph.nodes = graph.nodes.filter(n => n.parent_id !== node_id);
    
}
function graph_move_node(graph, node_id, x, y) {
    
        const node = graph.nodes.find(n => n.id === node_id);
        if (node) {
            const dx = x - node.x;
            const dy = y - node.y;
            node.x = x;
            node.y = y;
            
            // Move children too
            for (const child of graph.nodes) {
                if (child.parent_id === node_id) {
                    child.x += dx;
                    child.y += dy;
                }
            }
        }
    
}
function graph_add_edge(graph, src_node, src_port, tgt_node, tgt_port) {
    const new_id = "";
    
        new_id = 'edge_' + Date.now();
        
        graph.edges.push({
            id: new_id,
            source_node: src_node,
            source_port: src_port,
            target_node: tgt_node,
            target_port: tgt_port,
            edge_type: 'data'
        });
    
    return new_id;
}
function graph_remove_edge(graph, edge_id) {
    
        graph.edges = graph.edges.filter(e => e.id !== edge_id);
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.graph_add_node = graph_add_node;
    exports.graph_remove_node = graph_remove_node;
    exports.graph_move_node = graph_move_node;
    exports.graph_add_edge = graph_add_edge;
    exports.graph_remove_edge = graph_remove_edge;
}
