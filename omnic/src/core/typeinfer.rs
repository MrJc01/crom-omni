//! Type Inferencer - Automatic Type Inference for Omni
//!
//! Analyzes code to infer types from usage patterns.

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use colored::*;

/// Inferred type
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum InferredType {
    Int,
    Float,
    String,
    Bool,
    Void,
    Any,
    List(Box<InferredType>),
    Map(Box<InferredType>, Box<InferredType>),
    Optional(Box<InferredType>),
    Function(Vec<InferredType>, Box<InferredType>),
    Struct(String),
    Unknown,
}

impl InferredType {
    pub fn to_omni(&self) -> String {
        match self {
            InferredType::Int => "Int".to_string(),
            InferredType::Float => "Float".to_string(),
            InferredType::String => "String".to_string(),
            InferredType::Bool => "Bool".to_string(),
            InferredType::Void => "Void".to_string(),
            InferredType::Any => "Any".to_string(),
            InferredType::List(inner) => format!("List<{}>", inner.to_omni()),
            InferredType::Map(k, v) => format!("Map<{}, {}>", k.to_omni(), v.to_omni()),
            InferredType::Optional(inner) => format!("{}?", inner.to_omni()),
            InferredType::Function(params, ret) => {
                let params: Vec<_> = params.iter().map(|p| p.to_omni()).collect();
                format!("({}) -> {}", params.join(", "), ret.to_omni())
            }
            InferredType::Struct(name) => name.clone(),
            InferredType::Unknown => "Any".to_string(),
        }
    }

    /// Unify two types
    pub fn unify(&self, other: &InferredType) -> InferredType {
        if self == other {
            return self.clone();
        }
        
        match (self, other) {
            (InferredType::Unknown, t) | (t, InferredType::Unknown) => t.clone(),
            (InferredType::Any, _) | (_, InferredType::Any) => InferredType::Any,
            (InferredType::Int, InferredType::Float) | (InferredType::Float, InferredType::Int) => {
                InferredType::Float
            }
            (InferredType::List(a), InferredType::List(b)) => {
                InferredType::List(Box::new(a.unify(b)))
            }
            (InferredType::Optional(a), InferredType::Optional(b)) => {
                InferredType::Optional(Box::new(a.unify(b)))
            }
            (InferredType::Optional(a), b) => {
                InferredType::Optional(Box::new(a.unify(b)))
            }
            (a, InferredType::Optional(b)) => {
                InferredType::Optional(Box::new(a.unify(b)))
            }
            _ => InferredType::Any,
        }
    }
}

/// Type constraint for inference
#[derive(Debug, Clone)]
pub struct TypeConstraint {
    pub variable: String,
    pub inferred: InferredType,
    pub source: String,
}

/// Type inference context
pub struct TypeInferencer {
    /// Variable -> inferred type
    bindings: HashMap<String, InferredType>,
    /// Constraints collected
    constraints: Vec<TypeConstraint>,
    /// Function return types
    functions: HashMap<String, InferredType>,
}

impl TypeInferencer {
    pub fn new() -> Self {
        Self {
            bindings: HashMap::new(),
            constraints: Vec::new(),
            functions: HashMap::new(),
        }
    }

    /// Infer type from a literal value
    pub fn infer_literal(&self, value: &str) -> InferredType {
        // Check for string
        if value.starts_with('"') || value.starts_with('\'') {
            return InferredType::String;
        }
        
        // Check for boolean
        if value == "true" || value == "false" {
            return InferredType::Bool;
        }
        
        // Check for number
        if value.parse::<i64>().is_ok() {
            return InferredType::Int;
        }
        if value.parse::<f64>().is_ok() {
            return InferredType::Float;
        }
        
        // Check for null/none
        if value == "null" || value == "None" || value == "nil" {
            return InferredType::Optional(Box::new(InferredType::Unknown));
        }
        
        // Check for array/list
        if value.starts_with('[') {
            return InferredType::List(Box::new(InferredType::Unknown));
        }
        
        // Check for object/map
        if value.starts_with('{') {
            return InferredType::Map(
                Box::new(InferredType::String),
                Box::new(InferredType::Unknown)
            );
        }
        
        InferredType::Unknown
    }

    /// Record a variable binding
    pub fn bind(&mut self, name: &str, inferred: InferredType, source: &str) {
        self.constraints.push(TypeConstraint {
            variable: name.to_string(),
            inferred: inferred.clone(),
            source: source.to_string(),
        });
        
        // Unify with existing binding
        let unified = match self.bindings.get(name) {
            Some(existing) => existing.unify(&inferred),
            None => inferred,
        };
        
        self.bindings.insert(name.to_string(), unified);
    }

    /// Get inferred type for variable
    pub fn get(&self, name: &str) -> InferredType {
        self.bindings.get(name).cloned().unwrap_or(InferredType::Unknown)
    }

    /// Record function return type
    pub fn bind_function(&mut self, name: &str, return_type: InferredType) {
        self.functions.insert(name.to_string(), return_type);
    }

    /// Get function return type
    pub fn get_function_return(&self, name: &str) -> InferredType {
        self.functions.get(name).cloned().unwrap_or(InferredType::Unknown)
    }

    /// Resolve all constraints and finalize types
    pub fn resolve(&mut self) -> HashMap<String, InferredType> {
        // Multiple passes to propagate types
        for _ in 0..3 {
            for constraint in &self.constraints.clone() {
                let current = self.get(&constraint.variable);
                let unified = current.unify(&constraint.inferred);
                self.bindings.insert(constraint.variable.clone(), unified);
            }
        }
        
        self.bindings.clone()
    }

    /// Display inference results
    pub fn display(&self) {
        println!("{}", "🔍 Type Inference Results".cyan().bold());
        println!();
        
        for (name, typ) in &self.bindings {
            println!("  {} : {}", name.green(), typ.to_omni());
        }
        
        if !self.functions.is_empty() {
            println!();
            println!("{}", "Functions:".yellow());
            for (name, ret) in &self.functions {
                println!("  {} -> {}", name.green(), ret.to_omni());
            }
        }
    }
}

impl Default for TypeInferencer {
    fn default() -> Self {
        Self::new()
    }
}

/// Infer types from Omni code
pub fn infer_types(code: &str) -> HashMap<String, InferredType> {
    let mut inferencer = TypeInferencer::new();
    
    // Simple pattern matching for type inference
    for line in code.lines() {
        let line = line.trim();
        
        // Variable assignment: let x = value
        if line.starts_with("let ") {
            if let Some(eq_pos) = line.find('=') {
                let name = line[4..eq_pos].trim().trim_end_matches(':').trim();
                let name = name.split(':').next().unwrap_or(name).trim();
                let value = line[eq_pos + 1..].trim().trim_end_matches(';');
                
                let typ = inferencer.infer_literal(value);
                inferencer.bind(name, typ, line);
            }
        }
        
        // Function return: return value
        if line.starts_with("return ") {
            let value = line[7..].trim().trim_end_matches(';');
            let typ = inferencer.infer_literal(value);
            // Could track current function context
            inferencer.bind("__return__", typ, line);
        }
    }
    
    inferencer.resolve()
}

/// Add type annotations to code
pub fn annotate_types(code: &str) -> String {
    let types = infer_types(code);
    let mut output = String::new();
    
    for line in code.lines() {
        let trimmed = line.trim();
        
        // Add type to let bindings without types
        if trimmed.starts_with("let ") && !trimmed.contains(':') {
            if let Some(eq_pos) = trimmed.find('=') {
                let name = trimmed[4..eq_pos].trim();
                if let Some(typ) = types.get(name) {
                    let annotated = format!("let {}: {} ={}", 
                        name, typ.to_omni(), &trimmed[eq_pos + 1..]);
                    output.push_str(&annotated);
                    output.push('\n');
                    continue;
                }
            }
        }
        
        output.push_str(line);
        output.push('\n');
    }
    
    output
}
