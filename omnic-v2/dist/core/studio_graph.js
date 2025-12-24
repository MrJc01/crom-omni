BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 42 (()
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 60 (fn)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 60 (fn)
BlockLoop: 80 (native)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualNode)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualEdge)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualGraph)
BlockLoop: 10 (export)
BlockLoop: 10 (VisualGraph_new)
BlockLoop: 10 (export)
BlockLoop: 10 (ast_to_graph)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_ast)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_code)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_to_json)
BlockLoop: 10 (export)
BlockLoop: 10 (json_to_graph)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_add_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_remove_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_move_node)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_add_edge)
BlockLoop: 10 (export)
BlockLoop: 10 (graph_remove_edge)
const ast = require("./core/ast.js");
const cli = require("./lib/cli.js");
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
    return new VisualGraph({ nodes: [], edges: [], viewport: null, x: 0, y: 0, zoom: 1, .: null, metadata: null, version: "1.0", generated: "" });
}
// Unknown stmt kind: undefined
function ast_to_graph(program) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        graph.metadata.generated = new Date().toISOString();
        
        let nodeId = 0;
        let edgeId = 0;
        let y = 50;
        const NODE_HEIGHT = 80;
        const NODE_WIDTH = 200;
        const CAPSULE_PADDING = 40;
        
        // Helper to create node
        const createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
            return {
                id: 'node_' + (++nodeId),
                type: type,
                name: name,
                x: x,
                y: y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                ports_in: [],
                ports_out: [],
                attributes: [],
                properties: {},
                parent_id: parentId,
                ast_kind: astKind,
                ast_line: astLine || 0
            };
        };
        
        // Helper to create edge
        const createEdge = (srcNode, srcPort, tgtNode, tgtPort, type) => {
            return {
                id: 'edge_' + (++edgeId),
                source_node: srcNode,
                source_port: srcPort,
                target_node: tgtNode,
                target_port: tgtPort,
                edge_type: type
            };
        };
        
        // Process each statement
        for (const stmt of program.statements) {
            // Import
            if (stmt.kind === 10) { // NODE_IMPORT
                const node = createNode('import', stmt.path || stmt.value, 50, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                y += 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                const isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                const node = createNode(isEntity ? 'entity' : 'struct', stmt.name, 400, y, 70, stmt.line);
                
                // Add fields as ports
                for (const field of (stmt.fields || [])) {
                    const fieldName = typeof field === 'string' ? field : field.name;
                    const fieldType = typeof field === 'object' ? field.type : 'any';
                    node.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: fieldName,
                        type: fieldType
                    });
                }
                
                node.attributes = stmt.attributes || [];
                node.height = Math.max(NODE_HEIGHT, 40 + node.ports_out.length * 25);
                graph.nodes.push(node);
                y += node.height + 30;
                continue;
            }
            
            // Capsule
            if (stmt.kind === 93) { // NODE_CAPSULE
                const capsuleNode = createNode('capsule', stmt.name, 50, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + CAPSULE_PADDING;
                const flowNodes = [];
                
                // Process flows inside capsule
                for (const flow of (stmt.flows || [])) {
                    const flowNode = createNode('flow', flow.name, 70, innerY, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    // Input ports (params)
                    for (const param of (flow.params || [])) {
                        const paramName = typeof param === 'string' ? param : param.name;
                        const paramType = typeof param === 'object' ? param.type : 'any';
                        flowNode.ports_in.push({
                            id: 'port_' + (++nodeId),
                            name: paramName,
                            type: paramType
                        });
                    }
                    
                    // Output port (return)
                    flowNode.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: 'return',
                        type: flow.return_type || 'void'
                    });
                    
                    flowNode.attributes = flow.attributes || [];
                    flowNode.height = Math.max(60, 30 + Math.max(flowNode.ports_in.length, 1) * 25);
                    
                    graph.nodes.push(flowNode);
                    flowNodes.push(flowNode);
                    innerY += flowNode.height + 20;
                }
                
                // Set capsule height to contain all flows
                capsuleNode.height = innerY - y + CAPSULE_PADDING;
                graph.nodes.push(capsuleNode);
                
                // Create execution edges between flows
                for (let i = 0; i < flowNodes.length - 1; i++) {
                    const edge = createEdge(
                        flowNodes[i].id, 'exec_out',
                        flowNodes[i + 1].id, 'exec_in',
                        'execution'
                    );
                    graph.edges.push(edge);
                }
                
                y += capsuleNode.height + 50;
                continue;
            }
            
            // Function
            if (stmt.kind === 4) { // NODE_FUNCTION
                const node = createNode('function', stmt.name, 50, y, 4, stmt.line);
                
                // Input ports (params)
                for (const param of (stmt.params || [])) {
                    const paramName = typeof param === 'string' ? param : param.name;
                    const paramType = typeof param === 'object' ? param.type : 'any';
                    node.ports_in.push({
                        id: 'port_' + (++nodeId),
                        name: paramName,
                        type: paramType
                    });
                }
                
                // Output port (return)
                node.ports_out.push({
                    id: 'port_' + (++nodeId),
                    name: 'return',
                    type: stmt.return_type || 'void'
                });
                
                node.height = Math.max(NODE_HEIGHT, 40 + Math.max(node.ports_in.length, 1) * 25);
                graph.nodes.push(node);
                y += node.height + 30;
                continue;
            }
        }
    
    return graph;
}
function graph_to_ast(graph) {
    const program = null;
}

        program = {
            kind: 1, // NODE_PROGRAM
            statements: []
        };
        
        // Sort nodes by y position for correct order
        const sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group child nodes by parent
        const childrenMap = {};
        for (const node of sortedNodes) {
            if (node.parent_id) {
                if (!childrenMap[node.parent_id]) {
                    childrenMap[node.parent_id] = [];
                }
                childrenMap[node.parent_id].push(node);
            }
        }
        
        // Process top-level nodes only
        for (const node of sortedNodes) {
            if (node.parent_id) continue; // Skip children, processed with parent
            
            // Import
            if (node.type === 'import') {
                program.statements.push({
                    kind: 10,
                    path: node.name,
                    line: node.ast_line
                });
                continue;
            }
            
            // Struct / Entity
            if (node.type === 'struct' || node.type === 'entity') {
                const stmt = {
                    kind: 70,
                    name: node.name,
                    fields: node.ports_out.map(p => ({ name: p.name, type: p.type })),
                    attributes: node.type === 'entity' ? [{ name: 'entity' }] : [],
                    line: node.ast_line
                };
                program.statements.push(stmt);
                continue;
            }
            
            // Capsule
            if (node.type === 'capsule') {
                const flows = (childrenMap[node.id] || [])
                    .filter(n => n.type === 'flow')
                    .sort((a, b) => a.y - b.y)
                    .map(flowNode => ({
                        kind: 94,
                        name: flowNode.name,
                        params: flowNode.ports_in.map(p => ({ name: p.name, type: p.type })),
                        return_type: flowNode.ports_out[0]?.type || 'void',
                        attributes: flowNode.attributes,
                        body: { statements: [] },
                        line: flowNode.ast_line
                    }));
                
                program.statements.push({
                    kind: 93,
                    name: node.name,
                    flows: flows,
                    attributes: node.attributes,
                    line: node.ast_line
                });
                continue;
            }
            
            // Function
            if (node.type === 'function') {
                program.statements.push({
                    kind: 4,
                    name: node.name,
                    params: node.ports_in.map(p => ({ name: p.name, type: p.type })),
                    return_type: node.ports_out[0]?.type || 'void',
                    body: { statements: [] },
                    line: node.ast_line
                });
                continue;
            }
        }
    
return program;
// Unknown stmt kind: undefined
function graph_to_code(graph) {
    const code = "";
    
        const lines = [];
        lines.push("// Generated by Omni Studio Visual Editor");
        lines.push("// " + new Date().toISOString());
        lines.push("");
        
        // Sort nodes by y position
        const sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group children by parent
        const childrenMap = {};
        for (const node of sortedNodes) {
            if (node.parent_id) {
                if (!childrenMap[node.parent_id]) {
                    childrenMap[node.parent_id] = [];
                }
                childrenMap[node.parent_id].push(node);
            }
        }
        
        // Generate code for each top-level node
        for (const node of sortedNodes) {
            if (node.parent_id) continue;
            
            // Position comment (for round-trip)
            lines.push(`// @visual:position(${Math.round(node.x)}, ${Math.round(node.y)})`);
            
            // Import
            if (node.type === 'import') {
                lines.push(`import "${node.name}";`);
                lines.push("");
                continue;
            }
            
            // Entity / Struct
            if (node.type === 'entity' || node.type === 'struct') {
                if (node.type === 'entity') {
                    lines.push('@entity');
                }
                lines.push(`struct ${node.name} {`);
                for (const port of node.ports_out) {
                    lines.push(`    ${port.name}: ${port.type},`);
                }
                lines.push('}');
                lines.push("");
                continue;
            }
            
            // Capsule
            if (node.type === 'capsule') {
                lines.push(`capsule ${node.name} {`);
                
                const children = (childrenMap[node.id] || []).sort((a, b) => a.y - b.y);
                for (const child of children) {
                    if (child.type === 'flow') {
                        // Position comment
                        lines.push(`    // @visual:position(${Math.round(child.x)}, ${Math.round(child.y)})`);
                        
                        // Attributes
                        for (const attr of (child.attributes || [])) {
                            if (attr.name) {
                                const args = (attr.args || []).map(a => `"${a}"`).join(', ');
                                lines.push(`    @${attr.name}${args ? '(' + args + ')' : ''}`);
                            }
                        }
                        
                        // Flow signature
                        const params = child.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                        const returnType = child.ports_out[0]?.type || 'void';
                        const returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                        
                        lines.push(`    flow ${child.name}(${params})${returnStr} {`);
                        lines.push(`        // TODO: Implement`);
                        lines.push(`    }`);
                        lines.push("");
                    }
                }
                
                lines.push('}');
                lines.push("");
                continue;
            }
            
            // Function
            if (node.type === 'function') {
                const params = node.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                const returnType = node.ports_out[0]?.type || 'void';
                const returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                
                lines.push(`fn ${node.name}(${params})${returnStr} {`);
                lines.push(`    // TODO: Implement`);
                lines.push(`}`);
                lines.push("");
                continue;
            }
        }
        
        code = lines.join('\n');
    
    return code;
}
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
function code_to_graph(source, program) {
    const graph = VisualGraph_new;
    // Unknown stmt kind: 0
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        // Parse @visual:position comments from source
        const positionMap = {};
        const lines = source.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = line.match(new RegExp("@visual:position\\((\\d+),\\s*(\\d+)\\)"));
            if (match) {
                // Position applies to next non-comment line
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                
                // Find next statement line
                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('@')) {
                        positionMap[j + 1] = { x, y }; // 1-indexed
                        break;
                    }
                }
            }
        }
        
        graph.metadata.generated = new Date().toISOString();
        graph.metadata.source = 'code';
        
        let nodeId = 0;
        let edgeId = 0;
        let defaultY = 50;
        const NODE_HEIGHT = 80;
        const NODE_WIDTH = 200;
        
        const createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
            return {
                id: 'node_' + (++nodeId),
                type: type,
                name: name,
                x: x,
                y: y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                ports_in: [],
                ports_out: [],
                attributes: [],
                properties: {},
                parent_id: parentId,
                ast_kind: astKind,
                ast_line: astLine || 0
            };
        };
        
        for (const stmt of program.statements) {
            // Get saved position or use default
            const savedPos = positionMap[stmt.line];
            const x = savedPos ? savedPos.x : 50;
            const y = savedPos ? savedPos.y : defaultY;
            
            // Import
            if (stmt.kind === 10) {
                const node = createNode('import', stmt.path || stmt.value, x, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                defaultY = y + 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) {
                const isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                const node = createNode(isEntity ? 'entity' : 'struct', stmt.name, x, y, 70, stmt.line);
                
                for (const field of (stmt.fields || [])) {
                    const fieldName = typeof field === 'string' ? field : field.name;
                    const fieldType = typeof field === 'object' ? field.type : 'any';
                    node.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: fieldName,
                        type: fieldType
                    });
                }
                
                node.attributes = stmt.attributes || [];
                node.height = Math.max(NODE_HEIGHT, 40 + node.ports_out.length * 25);
                graph.nodes.push(node);
                defaultY = y + node.height + 30;
                continue;
            }
            
            // Capsule
            if (stmt.kind === 93) {
                const capsuleNode = createNode('capsule', stmt.name, x, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + 40;
                
                for (const flow of (stmt.flows || [])) {
                    const flowPos = positionMap[flow.line];
                    const fx = flowPos ? flowPos.x : x + 20;
                    const fy = flowPos ? flowPos.y : innerY;
                    
                    const flowNode = createNode('flow', flow.name, fx, fy, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    for (const param of (flow.params || [])) {
                        const paramName = typeof param === 'string' ? param : param.name;
                        const paramType = typeof param === 'object' ? param.type : 'any';
                        flowNode.ports_in.push({
                            id: 'port_' + (++nodeId),
                            name: paramName,
                            type: paramType
                        });
                    }
                    
                    flowNode.ports_out.push({
                        id: 'port_' + (++nodeId),
                        name: 'return',
                        type: flow.return_type || 'void'
                    });
                    
                    flowNode.attributes = flow.attributes || [];
                    flowNode.height = Math.max(60, 30 + Math.max(flowNode.ports_in.length, 1) * 25);
                    
                    graph.nodes.push(flowNode);
                    innerY = fy + flowNode.height + 20;
                }
                
                capsuleNode.height = innerY - y + 40;
                graph.nodes.push(capsuleNode);
                defaultY = y + capsuleNode.height + 50;
                continue;
            }
            
            // Function
            if (stmt.kind === 4) {
                const node = createNode('function', stmt.name, x, y, 4, stmt.line);
                
                for (const param of (stmt.params || [])) {
                    const paramName = typeof param === 'string' ? param : param.name;
                    const paramType = typeof param === 'object' ? param.type : 'any';
                    node.ports_in.push({
                        id: 'port_' + (++nodeId),
                        name: paramName,
                        type: paramType
                    });
                }
                
                node.ports_out.push({
                    id: 'port_' + (++nodeId),
                    name: 'return',
                    type: stmt.return_type || 'void'
                });
                
                node.height = Math.max(NODE_HEIGHT, 40 + Math.max(node.ports_in.length, 1) * 25);
                graph.nodes.push(node);
                defaultY = y + node.height + 30;
                continue;
            }
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
    export;
    VisualNode;
    export;
    VisualEdge;
    export;
    VisualGraph;
    export;
    VisualGraph_new;
    export;
    ast_to_graph;
    export;
    graph_to_ast;
    export;
    graph_to_code;
    export;
    graph_to_json;
    export;
    json_to_graph;
    export;
    graph_add_node;
    export;
    graph_remove_node;
    export;
    graph_move_node;
    export;
    graph_add_edge;
    export;
    graph_remove_edge;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.VisualGraph_new = VisualGraph_new;
    exports.ast_to_graph = ast_to_graph;
    exports.graph_to_ast = graph_to_ast;
    exports.graph_to_code = graph_to_code;
    exports.graph_to_json = graph_to_json;
    exports.json_to_graph = json_to_graph;
    exports.code_to_graph = code_to_graph;
    exports.get_installed_package_nodes = get_installed_package_nodes;
    exports.graph_add_node = graph_add_node;
    exports.graph_remove_node = graph_remove_node;
    exports.graph_move_node = graph_move_node;
    exports.graph_add_edge = graph_add_edge;
    exports.graph_remove_edge = graph_remove_edge;
    exports.VisualNode = VisualNode;
    exports.VisualEdge = VisualEdge;
    exports.VisualGraph = VisualGraph;
}
