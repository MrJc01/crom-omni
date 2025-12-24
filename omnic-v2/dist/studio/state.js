class GraphNode {
    constructor(data = {}) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.position = data.position;
        this.ports = data.ports;
        this.attributes = data.attributes;
        this.ast_ref = data.ast_ref;
    }
}
class GraphEdge {
    constructor(data = {}) {
        this.id = data.id;
        this.source = data.source;
        this.target = data.target;
        this.edge_type = data.edge_type;
    }
}
class GraphState {
    constructor(data = {}) {
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.selected = data.selected;
        this.viewport = data.viewport;
    }
}
function GraphState_new() {
    return new GraphState({ nodes: [], edges: [], selected: [], viewport: null, x: 0, y: 0, zoom: 1 });
}
// Unknown stmt kind: undefined
function GraphState_from_ast(program) {
    const state = GraphState_new();
    
        if (!program || !program.statements) return;
        
        let nodeId = 0;
        let y = 50;
        
        for (const stmt of program.statements) {
            const node = {
                id: 'node_' + (++nodeId),
                type: 'unknown',
                name: stmt.name || 'anonymous',
                position: { x: 100, y: y },
                ports: { inputs: [], outputs: [] },
                attributes: stmt.attributes || [],
                ast_ref: { kind: stmt.kind, line: stmt.line || 0 }
            };
            
            // Determine type
            if (stmt.kind === 93) {
                node.type = 'capsule';
                node.position.x = 50;
                
                // Add flows as child nodes
                for (const flow of (stmt.flows || [])) {
                    y += 60;
                    state.nodes.push({
                        id: 'node_' + (++nodeId),
                        type: 'flow',
                        name: flow.name,
                        position: { x: 150, y: y },
                        ports: {
                            inputs: (flow.params || []).map((p, i) => ({
                                id: 'port_in_' + nodeId + '_' + i,
                                name: typeof p === 'string' ? p : p.name,
                                type: typeof p === 'object' ? p.type : 'any'
                            })),
                            outputs: [{
                                id: 'port_out_' + nodeId,
                                name: 'return',
                                type: flow.return_type || 'void'
                            }]
                        },
                        attributes: flow.attributes || [],
                        ast_ref: { kind: 94, line: flow.line || 0 },
                        parent: node.id
                    });
                }
            } else if (stmt.kind === 70) {
                node.type = 'entity';
                node.ports.outputs = (stmt.fields || []).map((f, i) => ({
                    id: 'port_field_' + nodeId + '_' + i,
                    name: typeof f === 'string' ? f : f.name,
                    type: typeof f === 'object' ? f.type : 'any'
                }));
            } else if (stmt.kind === 4) {
                node.type = 'function';
                node.ports.inputs = (stmt.params || []).map((p, i) => ({
                    id: 'port_in_' + nodeId + '_' + i,
                    name: typeof p === 'string' ? p : p.name,
                    type: typeof p === 'object' ? p.type : 'any'
                }));
                node.ports.outputs = [{
                    id: 'port_out_' + nodeId,
                    name: 'return',
                    type: stmt.return_type || 'void'
                }];
            }
            
            state.nodes.push(node);
            y += 100;
        }
    
    return state;
}
function GraphState_to_json(self) {
    const json = "";
    
        json = JSON.stringify({
            nodes: self.nodes,
            edges: self.edges,
            viewport: self.viewport
        }, null, 2);
    
    return json;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.GraphState_new = GraphState_new;
    exports.GraphState_from_ast = GraphState_from_ast;
    exports.GraphState_to_json = GraphState_to_json;
    exports.GraphNode = GraphNode;
    exports.GraphEdge = GraphEdge;
    exports.GraphState = GraphState;
}
