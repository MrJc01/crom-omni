const ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
class CapsuleGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.flows = data.flows;
        this.entities = data.entities;
        this.dependencies = data.dependencies;
        this.attributes = data.attributes;
    }
}
class EntityGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.fields = data.fields;
        this.relations = data.relations;
    }
}
class FlowGraph {
    constructor(data = {}) {
        this.name = data.name;
        this.params = data.params;
        this.return_type = data.return_type;
        this.calls = data.calls;
        this.attributes = data.attributes;
    }
}
class GhostWriter {
    constructor(data = {}) {
        this.capsules = data.capsules;
        this.entities = data.entities;
        this.functions = data.functions;
        this.imports = data.imports;
        this.call_graph = data.call_graph;
    }
}
function GhostWriter_new() {
    return new GhostWriter({ capsules: [], entities: [], functions: [], imports: [], call_graph: null });
}
// Unknown stmt kind: undefined
function GhostWriter_analyze(self, program) {
    
        if (!program || !program.statements) {
            console.error("[ghost] Invalid program");
            return;
        }
        
        for (const stmt of program.statements) {
            // Capsule
            if (stmt.kind === 93) { // NODE_CAPSULE
                let capsule = {
                    name: stmt.name,
                    flows: [],
                    entities: [],
                    dependencies: [],
                    attributes: stmt.attributes || []
                };
                
                for (const flow of (stmt.flows || [])) {
                    capsule.flows.push({
                        name: flow.name,
                        params: flow.params || [],
                        return_type: flow.return_type || 'void',
                        attributes: flow.attributes || []
                    });
                }
                
                self.capsules.push(capsule);
            }
            
            // Struct / Entity
            if (stmt.kind === 70) { // NODE_STRUCT
                let entity = {
                    name: stmt.name,
                    fields: stmt.fields || [],
                    isEntity: (stmt.attributes || []).some(a => a.name === 'entity')
                };
                self.entities.push(entity);
            }
            
            // Function
            if (stmt.kind === 4) { // NODE_FUNCTION
                let fn = {
                    name: stmt.name,
                    params: stmt.params || [],
                    return_type: stmt.return_type || 'void',
                    calls: []
                };
                
                // Extract function calls from body
                let extractCalls = (node) => {
                    if (!node) return;
                    if (node.kind === 6) { // NODE_CALL
                        fn.calls.push(node.name || (node.callee && node.callee.value));
                    }
                    if (Array.isArray(node)) {
                        node.forEach(extractCalls);
                    }
                    if (node.statements) extractCalls(node.statements);
                    if (node.body) extractCalls(node.body);
                    if (node.consequence) extractCalls(node.consequence);
                    if (node.alternative) extractCalls(node.alternative);
                };
                
                extractCalls(stmt.body);
                self.functions.push(fn);
            }
            
            // Import
            if (stmt.kind === 10) { // NODE_IMPORT
                self.imports.push(stmt.path || stmt.value);
            }
        }
        
        // Build call graph
        for (const fn of self.functions) {
            self.call_graph[fn.name] = fn.calls.filter(c => c);
        }
    
}
function GhostWriter_gen_class_diagram(self) {
    let diagram = "";
    
        diagram = "```mermaid\nclassDiagram\n";
        
        // Entities
        for (const entity of self.entities) {
            diagram += "    class " + entity.name + " {\n";
            
            for (const field of entity.fields) {
                let fieldName = field.name || field;
                let fieldType = field.type || 'any';
                diagram += "        +" + fieldType + " " + fieldName + "\n";
            }
            
            diagram += "    }\n\n";
        }
        
        // Capsules as classes
        for (const capsule of self.capsules) {
            diagram += "    class " + capsule.name + " {\n";
            diagram += "        <<capsule>>\n";
            
            for (const flow of capsule.flows) {
                let params = (flow.params || []).map(p => 
                    typeof p === 'string' ? p : p.name
                ).join(', ');
                diagram += "        +" + flow.name + "(" + params + ") " + flow.return_type + "\n";
            }
            
            diagram += "    }\n\n";
        }
        
        // Relations (capsules using entities)
        for (const capsule of self.capsules) {
            for (const entity of self.entities) {
                // Check if capsule references entity
                let capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + " --> " + entity.name + " : uses\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_flowchart(self) {
    let diagram = "";
    
        diagram = "```mermaid\nflowchart TD\n";
        
        // Subgraphs for capsules
        for (const capsule of self.capsules) {
            diagram += "    subgraph " + capsule.name + "\n";
            
            for (const flow of capsule.flows) {
                let nodeId = capsule.name + "_" + flow.name;
                
                // Check for server attribute
                let serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    let method = serverAttr.name.split('.')[1].toUpperCase();
                    diagram += "        " + nodeId + "[(" + method + " " + flow.name + ")]\n";
                } else {
                    diagram += "        " + nodeId + "[" + flow.name + "]\n";
                }
            }
            
            diagram += "    end\n\n";
        }
        
        // Connect capsule flows
        for (const capsule of self.capsules) {
            for (let i = 0; i < capsule.flows.length - 1; i++) {
                let from = capsule.name + "_" + capsule.flows[i].name;
                let to = capsule.name + "_" + capsule.flows[i + 1].name;
                // diagram += "    " + from + " --> " + to + "\n";
            }
        }
        
        // External connections
        for (const entity of self.entities.filter(e => e.isEntity)) {
            diagram += "    DB[(" + entity.name + " DB)]\n";
            
            for (const capsule of self.capsules) {
                let capsuleStr = JSON.stringify(capsule);
                if (capsuleStr.includes(entity.name)) {
                    diagram += "    " + capsule.name + "_" + capsule.flows[0].name + " --> DB\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_sequence_diagram(self) {
    let diagram = "";
    
        diagram = "```mermaid\nsequenceDiagram\n";
        
        // Participants
        diagram += "    participant Client\n";
        
        for (const capsule of self.capsules) {
            diagram += "    participant " + capsule.name + "\n";
        }
        
        for (const entity of self.entities.filter(e => e.isEntity)) {
            diagram += "    participant " + entity.name + "DB as " + entity.name + " DB\n";
        }
        
        diagram += "\n";
        
        // Sequence for each flow
        for (const capsule of self.capsules) {
            for (const flow of capsule.flows) {
                let serverAttr = flow.attributes.find(a => 
                    a.name && a.name.startsWith('server.')
                );
                
                if (serverAttr) {
                    let method = serverAttr.name.split('.')[1].toUpperCase();
                    diagram += "    Client->>+" + capsule.name + ": " + method + " /" + flow.name + "\n";
                    
                    // Check for entity access
                    for (const entity of self.entities.filter(e => e.isEntity)) {
                        let flowStr = JSON.stringify(flow);
                        if (flowStr.includes(entity.name) || flow.return_type === entity.name) {
                            diagram += "    " + capsule.name + "->>+" + entity.name + "DB: Query\n";
                            diagram += "    " + entity.name + "DB-->>-" + capsule.name + ": Results\n";
                        }
                    }
                    
                    diagram += "    " + capsule.name + "-->>-Client: Response\n\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_gen_call_graph(self) {
    let diagram = "";
    
        diagram = "```mermaid\ngraph LR\n";
        
        // Function nodes
        for (const fn of self.functions) {
            diagram += "    " + fn.name + "[" + fn.name + "()]\n";
        }
        
        // Capsule flow nodes
        for (const capsule of self.capsules) {
            for (const flow of capsule.flows) {
                diagram += "    " + capsule.name + "_" + flow.name + "[" + capsule.name + "." + flow.name + "]\n";
            }
        }
        
        diagram += "\n";
        
        // Call edges
        for (const [caller, callees] of Object.entries(self.call_graph)) {
            for (const callee of callees) {
                if (callee) {
                    diagram += "    " + caller + " --> " + callee + "\n";
                }
            }
        }
        
        diagram += "```\n";
    
    return diagram;
}
function GhostWriter_generate_docs(self, project_name) {
    let doc = "";
    
        doc = "# " + project_name + " - Architecture Documentation\n\n";
        doc += "> Auto-generated by Omni Ghost Writer\n\n";
        doc += "---\n\n";
        
        // Overview
        doc += "## Overview\n\n";
        doc += "| Component | Count |\n";
        doc += "|-----------|-------|\n";
        doc += "| Capsules | " + self.capsules.length + " |\n";
        doc += "| Entities | " + self.entities.length + " |\n";
        doc += "| Functions | " + self.functions.length + " |\n";
        doc += "| Imports | " + self.imports.length + " |\n\n";
        
        // Class Diagram
        doc += "## Class Diagram\n\n";
        doc += GhostWriter_gen_class_diagram(self) + "\n";
        
        // Flowchart
        doc += "## System Flowchart\n\n";
        doc += GhostWriter_gen_flowchart(self) + "\n";
        
        // Sequence Diagram
        doc += "## Sequence Diagram\n\n";
        doc += GhostWriter_gen_sequence_diagram(self) + "\n";
        
        // Call Graph
        doc += "## Call Graph\n\n";
        doc += GhostWriter_gen_call_graph(self) + "\n";
        
        // API Reference
        doc += "## API Reference\n\n";
        
        for (const capsule of self.capsules) {
            doc += "### Capsule: " + capsule.name + "\n\n";
            
            for (const flow of capsule.flows) {
                let params = (flow.params || []).map(p => 
                    typeof p === 'string' ? p : (p.name + ': ' + (p.type || 'any'))
                ).join(', ');
                
                doc += "#### `" + flow.name + "(" + params + ") -> " + flow.return_type + "`\n\n";
                
                // Attributes
                for (const attr of flow.attributes) {
                    if (attr.name && attr.name.startsWith('server.')) {
                        let method = attr.name.split('.')[1].toUpperCase();
                        let path = attr.args && attr.args[0] ? attr.args[0] : '/' + flow.name;
                        doc += "- **Endpoint:** `" + method + " " + path + "`\n";
                    }
                }
                
                doc += "\n";
            }
        }
        
        // Entities
        doc += "## Data Entities\n\n";
        
        for (const entity of self.entities) {
            doc += "### " + (entity.isEntity ? "@entity " : "") + entity.name + "\n\n";
            doc += "| Field | Type |\n";
            doc += "|-------|------|\n";
            
            for (const field of entity.fields) {
                let name = field.name || field;
                let type = field.type || 'any';
                doc += "| " + name + " | " + type + " |\n";
            }
            
            doc += "\n";
        }
        
        doc += "---\n\n";
        doc += "*Generated by Omni Ghost Writer v1.0*\n";
    
    return doc;
}
function cmd_graph(input_file, output_file) {
    CLI_header("Omni Ghost Writer");
    CLI_info("Analyzing: " + input_file);
    let source = read_file(input_file);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let writer = GhostWriter_new();
    GhostWriter_analyze(writer, program);
    let project_name = "";
    
        const path = require('path');
        project_name = path.basename(input_file, '.omni');
    
    let docs = GhostWriter_generate_docs(writer, project_name);
    write_file(output_file, docs);
    CLI_success("Documentation generated: " + output_file);
    
        console.log("");
        console.log(CLI_COLORS.bold + "Generated Diagrams:" + CLI_COLORS.reset);
        console.log("  • Class Diagram");
        console.log("  • System Flowchart");
        console.log("  • Sequence Diagram");
        console.log("  • Call Graph");
        console.log("");
        terminal.CLI_info("View the .md file in any Markdown viewer with Mermaid support");
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.GhostWriter_new = GhostWriter_new;
    exports.GhostWriter_analyze = GhostWriter_analyze;
    exports.GhostWriter_gen_class_diagram = GhostWriter_gen_class_diagram;
    exports.GhostWriter_gen_flowchart = GhostWriter_gen_flowchart;
    exports.GhostWriter_gen_sequence_diagram = GhostWriter_gen_sequence_diagram;
    exports.GhostWriter_gen_call_graph = GhostWriter_gen_call_graph;
    exports.GhostWriter_generate_docs = GhostWriter_generate_docs;
    exports.cmd_graph = cmd_graph;
    exports.CapsuleGraph = CapsuleGraph;
    exports.EntityGraph = EntityGraph;
    exports.FlowGraph = FlowGraph;
    exports.GhostWriter = GhostWriter;
}
