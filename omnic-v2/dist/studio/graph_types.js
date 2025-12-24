class VisualNode {
    constructor(data = {}) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.ports_in = data.ports_in;
        this.ports_out = data.ports_out;
        this.attributes = data.attributes;
        this.properties = data.properties;
        this.parent_id = data.parent_id;
        this.ast_kind = data.ast_kind;
        this.ast_line = data.ast_line;
    }
}
class VisualEdge {
    constructor(data = {}) {
        this.id = data.id;
        this.source_node = data.source_node;
        this.source_port = data.source_port;
        this.target_node = data.target_node;
        this.target_port = data.target_port;
        this.edge_type = data.edge_type;
    }
}
class VisualGraph {
    constructor(data = {}) {
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.viewport = data.viewport;
        this.metadata = data.metadata;
    }
}
function VisualGraph_new() {
    return new VisualGraph({ nodes: [], edges: [], viewport: null, x: 0, y: 0, zoom: 1.0 });
    // Unknown stmt kind: 0
    metadata;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    version;
    // Unknown stmt kind: 0
    "1.0";
    // Unknown stmt kind: 0
    generated;
    // Unknown stmt kind: 0
    "";
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.VisualGraph_new = VisualGraph_new;
    exports.VisualNode = VisualNode;
    exports.VisualEdge = VisualEdge;
    exports.VisualGraph = VisualGraph;
}
