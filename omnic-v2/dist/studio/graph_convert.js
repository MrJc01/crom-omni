const ast = require("../core/ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const graph_types = require("./graph_types.js");
if (typeof global !== 'undefined') Object.assign(global, graph_types);

    var { VisualGraph_new, VisualGraph: VisualGraph_Class } = graph_types;

function ast_to_graph(program) {
    let graph = VisualGraph_new();
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        graph.metadata.generated = new Date().toISOString();
        
        let nodeId = 0;
        let edgeId = 0;
        let y = 50;
        let NODE_HEIGHT = 80;
        let NODE_WIDTH = 200;
        let CAPSULE_PADDING = 40;
        
        // Helper to create node
        let createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
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
        let createEdge = (srcNode, srcPort, tgtNode, tgtPort, type) => {
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
                let node = createNode('import', stmt.path || stmt.value, 50, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                y += 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                let isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                let node = createNode(isEntity ? 'entity' : 'struct', stmt.name, 400, y, 70, stmt.line);
                
                // Add fields as ports
                for (const field of (stmt.fields || [])) {
                    let fieldName = typeof field === 'string' ? field : field.name;
                    let fieldType = typeof field === 'object' ? field.type : 'any';
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
                let capsuleNode = createNode('capsule', stmt.name, 50, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + CAPSULE_PADDING;
                let flowNodes = [];
                
                // Process flows inside capsule
                for (const flow of (stmt.flows || [])) {
                    let flowNode = createNode('flow', flow.name, 70, innerY, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    // Input ports (params)
                    for (const param of (flow.params || [])) {
                        let paramName = typeof param === 'string' ? param : param.name;
                        let paramType = typeof param === 'object' ? param.type : 'any';
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
                    let edge = createEdge(
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
                let node = createNode('function', stmt.name, 50, y, 4, stmt.line);
                
                // Input ports (params)
                for (const param of (stmt.params || [])) {
                    let paramName = typeof param === 'string' ? param : param.name;
                    let paramType = typeof param === 'object' ? param.type : 'any';
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
function new_map() {
     return {}; 
    return 0;
}
function graph_to_ast(graph) {
    let program = new_map();
    
        program = {
            kind: 1, // NODE_PROGRAM
            statements: []
        };
        
        // Sort nodes by y position for correct order
        let sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group child nodes by parent
        let childrenMap = {};
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
                let stmt = {
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
                let flows = (childrenMap[node.id] || [])
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
}
function graph_to_code(graph) {
    let code = "";
    
        let lines = [];
        lines.push("// Generated by Omni Studio Visual Editor");
        lines.push("// " + new Date().toISOString());
        lines.push("");
        
        // Sort nodes by y position
        let sortedNodes = [...graph.nodes].sort((a, b) => a.y - b.y);
        
        // Group children by parent
        let childrenMap = {};
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
                
                let children = (childrenMap[node.id] || []).sort((a, b) => a.y - b.y);
                for (const child of children) {
                    if (child.type === 'flow') {
                        // Position comment
                        lines.push(`    // @visual:position(${Math.round(child.x)}, ${Math.round(child.y)})`);
                        
                        // Attributes
                        for (const attr of (child.attributes || [])) {
                            if (attr.name) {
                                let args = (attr.args || []).map(a => `"${a}"`).join(', ');
                                lines.push(`    @${attr.name}${args ? '(' + args + ')' : ''}`);
                            }
                        }
                        
                        // Flow signature
                        let params = child.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                        let returnType = child.ports_out[0]?.type || 'void';
                        let returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                        
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
                let params = node.ports_in.map(p => `${p.name}: ${p.type}`).join(', ');
                let returnType = node.ports_out[0]?.type || 'void';
                let returnStr = returnType !== 'void' ? ` -> ${returnType}` : '';
                
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
function code_to_graph(source, program) {
    let graph = VisualGraph_new();
    
        if (!program || !program.statements) {
            console.error("[graph] Invalid program AST");
            return;
        }
        
        // Parse @visual:position comments from source
        let positionMap = {};
        let lines = source.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let match = line.match(new RegExp("@visual:position\\((\\d+),\\s*(\\d+)\\)"));
            if (match) {
                // Position applies to next non-comment line
                let x = parseInt(match[1]);
                let y = parseInt(match[2]);
                
                // Find next statement line
                for (let j = i + 1; j < lines.length; j++) {
                    let nextLine = lines[j].trim();
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
        let NODE_HEIGHT = 80;
        let NODE_WIDTH = 200;
        
        let createNode = (type, name, x, y, astKind, astLine, parentId = null) => {
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
            let savedPos = positionMap[stmt.line];
            let x = savedPos ? savedPos.x : 50;
            let y = savedPos ? savedPos.y : defaultY;
            
            // Import
            if (stmt.kind === 10) {
                let node = createNode('import', stmt.path || stmt.value, x, y, 10, stmt.line);
                node.width = 150;
                node.height = 40;
                graph.nodes.push(node);
                defaultY = y + 60;
                continue;
            }
            
            // Struct / Entity
            if (stmt.kind === 70) {
                let isEntity = (stmt.attributes || []).some(a => a.name === 'entity');
                let node = createNode(isEntity ? 'entity' : 'struct', stmt.name, x, y, 70, stmt.line);
                
                for (const field of (stmt.fields || [])) {
                    let fieldName = typeof field === 'string' ? field : field.name;
                    let fieldType = typeof field === 'object' ? field.type : 'any';
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
                let capsuleNode = createNode('capsule', stmt.name, x, y, 93, stmt.line);
                capsuleNode.width = 350;
                
                let innerY = y + 40;
                
                for (const flow of (stmt.flows || [])) {
                    let flowPos = positionMap[flow.line];
                    let fx = flowPos ? flowPos.x : x + 20;
                    let fy = flowPos ? flowPos.y : innerY;
                    
                    let flowNode = createNode('flow', flow.name, fx, fy, 94, flow.line, capsuleNode.id);
                    flowNode.width = 280;
                    
                    for (const param of (flow.params || [])) {
                        let paramName = typeof param === 'string' ? param : param.name;
                        let paramType = typeof param === 'object' ? param.type : 'any';
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
                let node = createNode('function', stmt.name, x, y, 4, stmt.line);
                
                for (const param of (stmt.params || [])) {
                    let paramName = typeof param === 'string' ? param : param.name;
                    let paramType = typeof param === 'object' ? param.type : 'any';
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


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.ast_to_graph = ast_to_graph;
    exports.new_map = new_map;
    exports.graph_to_ast = graph_to_ast;
    exports.graph_to_code = graph_to_code;
    exports.code_to_graph = code_to_graph;
}
