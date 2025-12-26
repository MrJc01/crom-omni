//! Architecture Diagram Generator - Mermaid Output
//!
//! Generates Mermaid diagrams from Omni project structure.

use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use colored::*;

/// Node type in architecture diagram
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NodeType {
    Module,
    Struct,
    Function,
    Enum,
    Trait,
    External,
}

impl NodeType {
    pub fn shape(&self) -> (&'static str, &'static str) {
        match self {
            NodeType::Module => ("[", "]"),
            NodeType::Struct => ("(", ")"),
            NodeType::Function => ("{", "}"),
            NodeType::Enum => ("((", "))"),
            NodeType::Trait => ("[/", "/]"),
            NodeType::External => ("[[", "]]"),
        }
    }
}

/// A node in the architecture graph
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchNode {
    pub id: String,
    pub label: String,
    pub node_type: NodeType,
}

/// A connection between nodes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchEdge {
    pub from: String,
    pub to: String,
    pub label: Option<String>,
    pub style: EdgeStyle,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EdgeStyle {
    Normal,     // -->
    Dotted,     // -.->
    Thick,      // ==>
}

impl EdgeStyle {
    pub fn arrow(&self) -> &'static str {
        match self {
            EdgeStyle::Normal => "-->",
            EdgeStyle::Dotted => "-.->",
            EdgeStyle::Thick => "==>",
        }
    }
}

/// Complete architecture diagram
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchDiagram {
    pub title: String,
    pub nodes: Vec<ArchNode>,
    pub edges: Vec<ArchEdge>,
    pub subgraphs: Vec<Subgraph>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Subgraph {
    pub id: String,
    pub label: String,
    pub nodes: Vec<String>,
}

impl ArchDiagram {
    pub fn new(title: &str) -> Self {
        Self {
            title: title.to_string(),
            nodes: Vec::new(),
            edges: Vec::new(),
            subgraphs: Vec::new(),
        }
    }

    pub fn add_node(&mut self, id: &str, label: &str, node_type: NodeType) {
        self.nodes.push(ArchNode {
            id: id.to_string(),
            label: label.to_string(),
            node_type,
        });
    }

    pub fn add_edge(&mut self, from: &str, to: &str) {
        self.edges.push(ArchEdge {
            from: from.to_string(),
            to: to.to_string(),
            label: None,
            style: EdgeStyle::Normal,
        });
    }

    pub fn add_labeled_edge(&mut self, from: &str, to: &str, label: &str) {
        self.edges.push(ArchEdge {
            from: from.to_string(),
            to: to.to_string(),
            label: Some(label.to_string()),
            style: EdgeStyle::Normal,
        });
    }

    pub fn add_subgraph(&mut self, id: &str, label: &str, nodes: Vec<&str>) {
        self.subgraphs.push(Subgraph {
            id: id.to_string(),
            label: label.to_string(),
            nodes: nodes.into_iter().map(String::from).collect(),
        });
    }

    /// Generate Mermaid markdown
    pub fn to_mermaid(&self) -> String {
        let mut output = String::new();
        output.push_str("```mermaid\n");
        output.push_str("graph TD\n");
        
        // Add subgraphs
        for sg in &self.subgraphs {
            output.push_str(&format!("    subgraph {}\n", sg.label));
            for node_id in &sg.nodes {
                if let Some(node) = self.nodes.iter().find(|n| &n.id == node_id) {
                    let (open, close) = node.node_type.shape();
                    output.push_str(&format!("        {}{}{}{};\n", 
                        node.id, open, node.label, close));
                }
            }
            output.push_str("    end\n");
        }

        // Add remaining nodes not in subgraphs
        let subgraph_nodes: Vec<_> = self.subgraphs.iter()
            .flat_map(|sg| sg.nodes.iter())
            .collect();
        
        for node in &self.nodes {
            if !subgraph_nodes.contains(&&node.id) {
                let (open, close) = node.node_type.shape();
                output.push_str(&format!("    {}{}{}{};\n", 
                    node.id, open, node.label, close));
            }
        }

        // Add edges
        for edge in &self.edges {
            let arrow = edge.style.arrow();
            if let Some(ref label) = edge.label {
                output.push_str(&format!("    {} {}|{}| {};\n", 
                    edge.from, arrow, label, edge.to));
            } else {
                output.push_str(&format!("    {} {} {};\n", 
                    edge.from, arrow, edge.to));
            }
        }

        output.push_str("```\n");
        output
    }

    /// Generate Mermaid flowchart
    pub fn to_flowchart(&self) -> String {
        let mut output = String::new();
        output.push_str("```mermaid\nflowchart LR\n");
        
        for node in &self.nodes {
            let (open, close) = node.node_type.shape();
            output.push_str(&format!("    {}{}{}{}\n", node.id, open, node.label, close));
        }
        
        for edge in &self.edges {
            output.push_str(&format!("    {} {} {}\n", edge.from, edge.style.arrow(), edge.to));
        }
        
        output.push_str("```\n");
        output
    }
}

/// Generate Omni compiler architecture
pub fn omni_architecture() -> ArchDiagram {
    let mut diagram = ArchDiagram::new("Omni Compiler Architecture");

    // Add nodes
    diagram.add_node("lexer", "Lexer", NodeType::Module);
    diagram.add_node("parser", "Parser", NodeType::Module);
    diagram.add_node("semantic", "Semantic Analyzer", NodeType::Module);
    diagram.add_node("optimizer", "Optimizer", NodeType::Module);
    diagram.add_node("codegen", "Code Generator", NodeType::Module);
    diagram.add_node("js", "JavaScript", NodeType::External);
    diagram.add_node("php", "PHP", NodeType::External);
    diagram.add_node("py", "Python", NodeType::External);

    // Add edges
    diagram.add_labeled_edge("lexer", "parser", "tokens");
    diagram.add_labeled_edge("parser", "semantic", "AST");
    diagram.add_labeled_edge("semantic", "optimizer", "typed AST");
    diagram.add_labeled_edge("optimizer", "codegen", "optimized AST");
    diagram.add_edge("codegen", "js");
    diagram.add_edge("codegen", "php");
    diagram.add_edge("codegen", "py");

    // Add subgraphs
    diagram.add_subgraph("frontend", "Frontend", vec!["lexer", "parser", "semantic"]);
    diagram.add_subgraph("backend", "Backend", vec!["optimizer", "codegen"]);
    diagram.add_subgraph("targets", "Targets", vec!["js", "php", "py"]);

    diagram
}

/// Save architecture markdown
pub fn save_architecture_md(output_path: &Path) -> Result<()> {
    println!("{}", "📐 Generating architecture documentation...".cyan().bold());

    let diagram = omni_architecture();
    
    let mut content = String::new();
    content.push_str("# Omni Compiler Architecture\n\n");
    content.push_str("## Pipeline Overview\n\n");
    content.push_str(&diagram.to_mermaid());
    content.push_str("\n## Components\n\n");
    content.push_str("| Component | Description |\n");
    content.push_str("|-----------|-------------|\n");
    content.push_str("| Lexer | Tokenizes source code |\n");
    content.push_str("| Parser | Builds AST from tokens |\n");
    content.push_str("| Semantic | Type checking and validation |\n");
    content.push_str("| Optimizer | Dead code elimination, constant folding |\n");
    content.push_str("| Codegen | Generates target language output |\n");

    fs::write(output_path, &content)?;
    println!("{} Saved to {}", "✓".green(), output_path.display());

    Ok(())
}
