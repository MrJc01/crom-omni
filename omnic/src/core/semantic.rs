//! Semantic Analysis Module for Omni Compiler
//! 
//! Provides basic type checking and symbol table management.
//! Runs between Parser and CodeGen to catch errors early.

use std::collections::HashMap;
use crate::core::ast::*;
use anyhow::{Result, anyhow};

/// Represents a declared symbol (variable, function, struct)
#[derive(Debug, Clone)]
pub struct Symbol {
    pub name: String,
    pub ty: OmniType,
    pub kind: SymbolKind,
    pub is_mutable: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SymbolKind {
    Variable,
    Function,
    Struct,
    Parameter,
}

/// Unified type representation for semantic analysis
#[derive(Debug, Clone, PartialEq)]
pub enum OmniType {
    Int,
    Float,
    String,
    Bool,
    Void,
    List(Box<OmniType>),
    Struct(String),
    Function { params: Vec<OmniType>, returns: Box<OmniType> },
    Unknown,
}

impl OmniType {
    /// Convert AST Type to OmniType
    pub fn from_ast_type(ty: &Type) -> Self {
        match ty {
            Type::Simple(name) => match name.as_str() {
                "i64" | "i32" | "int" => OmniType::Int,
                "f64" | "f32" | "float" => OmniType::Float,
                "string" | "String" => OmniType::String,
                "bool" => OmniType::Bool,
                "void" | "()" => OmniType::Void,
                other => OmniType::Struct(other.to_string()),
            },
            Type::List(inner) => OmniType::List(Box::new(OmniType::from_ast_type(inner))),
        }
    }
}

/// Symbol Table with scope support
#[derive(Debug, Clone)]
pub struct SymbolTable {
    scopes: Vec<HashMap<String, Symbol>>,
}

impl SymbolTable {
    pub fn new() -> Self {
        Self {
            scopes: vec![HashMap::new()], // Global scope
        }
    }

    /// Enter a new scope (function body, block, etc)
    pub fn enter_scope(&mut self) {
        self.scopes.push(HashMap::new());
    }

    /// Exit current scope
    pub fn exit_scope(&mut self) {
        if self.scopes.len() > 1 {
            self.scopes.pop();
        }
    }

    /// Define a symbol in current scope
    pub fn define(&mut self, symbol: Symbol) -> Result<()> {
        let current = self.scopes.last_mut().unwrap();
        if current.contains_key(&symbol.name) {
            return Err(anyhow!("Symbol '{}' already defined in this scope", symbol.name));
        }
        current.insert(symbol.name.clone(), symbol);
        Ok(())
    }

    /// Lookup a symbol, searching from innermost to outermost scope
    pub fn lookup(&self, name: &str) -> Option<&Symbol> {
        for scope in self.scopes.iter().rev() {
            if let Some(sym) = scope.get(name) {
                return Some(sym);
            }
        }
        None
    }
}

/// Semantic Analyzer - walks AST and validates types
pub struct SemanticAnalyzer {
    pub symbols: SymbolTable,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
}

impl SemanticAnalyzer {
    pub fn new() -> Self {
        let mut analyzer = Self {
            symbols: SymbolTable::new(),
            errors: Vec::new(),
            warnings: Vec::new(),
        };
        
        // Pre-register built-in symbols to reduce false positives
        analyzer.register_builtins();
        analyzer
    }

    /// Register built-in symbols (std library, CLI, token constants)
    fn register_builtins(&mut self) {
        // Standard library functions
        let builtins = vec![
            // std/io functions
            ("print", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("println", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("read_file", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::String) }),
            ("write_file", OmniType::Function { params: vec![OmniType::String, OmniType::String], returns: Box::new(OmniType::Void) }),
            
            // CLI functions
            ("CLI_banner", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("CLI_header", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("CLI_info", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("CLI_success", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("CLI_error", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("CLI_warn", OmniType::Function { params: vec![OmniType::String], returns: Box::new(OmniType::Void) }),
            ("CLI_version", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            
            // Command functions
            ("cmd_run", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_build", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_test_all", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_setup", OmniType::Function { params: vec![OmniType::Bool], returns: Box::new(OmniType::Void) }),
            ("cmd_package_self", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_package_app", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_install", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_uninstall", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_list", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_update", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_search", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_doctor", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_contracts", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_graph", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_bootstrap", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_studio_cli", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_tui", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("cmd_ingest", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
            ("terminal", OmniType::Function { params: vec![], returns: Box::new(OmniType::Void) }),
        ];

        for (name, ty) in builtins {
            let _ = self.symbols.define(Symbol {
                name: name.to_string(),
                ty,
                kind: SymbolKind::Function,
                is_mutable: false,
            });
        }

        // Token constants (integers)
        let token_constants = vec![
            "TOKEN_ILLEGAL", "TOKEN_EOF", "TOKEN_IDENTIFIER", "TOKEN_INT", "TOKEN_FLOAT",
            "TOKEN_STRING", "TOKEN_ASSIGN", "TOKEN_PLUS", "TOKEN_MINUS", "TOKEN_STAR",
            "TOKEN_SLASH", "TOKEN_EQ", "TOKEN_NOT_EQ", "TOKEN_LT", "TOKEN_GT",
            "TOKEN_SEMICOLON", "TOKEN_LPAREN", "TOKEN_RPAREN", "TOKEN_LBRACE", "TOKEN_RBRACE",
            "TOKEN_COMMA", "TOKEN_FN", "TOKEN_LET", "TOKEN_STRUCT", "TOKEN_IF",
            "TOKEN_ELSE", "TOKEN_RETURN", "TOKEN_TRUE", "TOKEN_FALSE", "TOKEN_NATIVE",
            "TOKEN_WHILE", "TOKEN_AND", "TOKEN_OR", "TOKEN_LBRACKET", "TOKEN_RBRACKET",
            "TOKEN_BANG", "TOKEN_COLON", "TOKEN_DOT", "TOKEN_ARROW",
        ];

        for name in token_constants {
            let _ = self.symbols.define(Symbol {
                name: name.to_string(),
                ty: OmniType::Int,
                kind: SymbolKind::Variable,
                is_mutable: false,
            });
        }
    }

    /// Analyze a complete program
    pub fn analyze(&mut self, program: &Program) -> Result<()> {
        // First pass: register all top-level declarations
        for item in &program.items {
            self.register_top_level(item)?;
        }

        // Second pass: analyze function bodies
        for item in &program.items {
            self.analyze_top_level(item)?;
        }

        if !self.errors.is_empty() {
            return Err(anyhow!("Semantic errors:\n{}", self.errors.join("\n")));
        }

        Ok(())
    }

    /// Register top-level declarations (first pass)
    fn register_top_level(&mut self, item: &TopLevelItem) -> Result<()> {
        match item {
            TopLevelItem::Function(f) => {
                let param_types: Vec<OmniType> = f.params.iter()
                    .map(|p| OmniType::from_ast_type(&p.ty))
                    .collect();
                let return_type = f.return_type.as_ref()
                    .map(|t| OmniType::from_ast_type(t))
                    .unwrap_or(OmniType::Void);

                self.symbols.define(Symbol {
                    name: f.name.clone(),
                    ty: OmniType::Function {
                        params: param_types,
                        returns: Box::new(return_type),
                    },
                    kind: SymbolKind::Function,
                    is_mutable: false,
                })?;
            }
            TopLevelItem::Struct(s) => {
                self.symbols.define(Symbol {
                    name: s.name.clone(),
                    ty: OmniType::Struct(s.name.clone()),
                    kind: SymbolKind::Struct,
                    is_mutable: false,
                })?;
            }
            TopLevelItem::LetBinding { name, ty, is_mut, .. } => {
                let var_type = ty.as_ref()
                    .map(|t| OmniType::from_ast_type(t))
                    .unwrap_or(OmniType::Unknown);
                self.symbols.define(Symbol {
                    name: name.clone(),
                    ty: var_type,
                    kind: SymbolKind::Variable,
                    is_mutable: *is_mut,
                })?;
            }
            TopLevelItem::Capsule(c) => {
                // Register capsule as namespace
                self.symbols.define(Symbol {
                    name: c.name.clone(),
                    ty: OmniType::Struct(c.name.clone()),
                    kind: SymbolKind::Struct,
                    is_mutable: false,
                })?;
            }
            TopLevelItem::Flow(fl) => {
                let param_types: Vec<OmniType> = fl.params.iter()
                    .map(|p| OmniType::from_ast_type(&p.ty))
                    .collect();
                let return_type = fl.return_type.as_ref()
                    .map(|t| OmniType::from_ast_type(t))
                    .unwrap_or(OmniType::Void);

                self.symbols.define(Symbol {
                    name: fl.name.clone(),
                    ty: OmniType::Function {
                        params: param_types,
                        returns: Box::new(return_type),
                    },
                    kind: SymbolKind::Function,
                    is_mutable: false,
                })?;
            }
        }
        Ok(())
    }

    /// Analyze top-level items (second pass)
    fn analyze_top_level(&mut self, item: &TopLevelItem) -> Result<()> {
        match item {
            TopLevelItem::Function(f) => {
                self.analyze_function(f)?;
            }
            TopLevelItem::Flow(fl) => {
                self.analyze_flow(fl)?;
            }
            TopLevelItem::Capsule(c) => {
                for inner in &c.items {
                    self.analyze_top_level(inner)?;
                }
            }
            _ => {}
        }
        Ok(())
    }

    /// Analyze function body
    fn analyze_function(&mut self, func: &FunctionDeclaration) -> Result<()> {
        self.symbols.enter_scope();

        // Register parameters
        for param in &func.params {
            self.symbols.define(Symbol {
                name: param.name.clone(),
                ty: OmniType::from_ast_type(&param.ty),
                kind: SymbolKind::Parameter,
                is_mutable: false,
            })?;
        }

        // Analyze body
        self.analyze_block(&func.body)?;

        self.symbols.exit_scope();
        Ok(())
    }

    /// Analyze flow body
    fn analyze_flow(&mut self, flow: &FlowDeclaration) -> Result<()> {
        self.symbols.enter_scope();

        for param in &flow.params {
            self.symbols.define(Symbol {
                name: param.name.clone(),
                ty: OmniType::from_ast_type(&param.ty),
                kind: SymbolKind::Parameter,
                is_mutable: false,
            })?;
        }

        self.analyze_block(&flow.body)?;

        self.symbols.exit_scope();
        Ok(())
    }

    /// Analyze a block of statements
    fn analyze_block(&mut self, block: &Block) -> Result<()> {
        for stmt in &block.statements {
            self.analyze_statement(stmt)?;
        }
        Ok(())
    }

    /// Analyze a single statement
    fn analyze_statement(&mut self, stmt: &Statement) -> Result<()> {
        match stmt {
            Statement::LetBinding { name, ty, value, is_mut } => {
                // Check value expression
                let value_type = self.infer_type(value);

                let declared_type = ty.as_ref()
                    .map(|t| OmniType::from_ast_type(t))
                    .unwrap_or(value_type.clone());

                // Register variable
                self.symbols.define(Symbol {
                    name: name.clone(),
                    ty: declared_type,
                    kind: SymbolKind::Variable,
                    is_mutable: *is_mut,
                })?;
            }
            Statement::Assignment { target, value: _ } => {
                // Check if target is assignable
                if let Expression::Identifier(name) = target {
                    match self.symbols.lookup(name) {
                        Some(sym) if !sym.is_mutable && sym.kind == SymbolKind::Variable => {
                            self.errors.push(format!(
                                "Cannot assign to immutable variable '{}'. Use 'mut' keyword.",
                                name
                            ));
                        }
                        None => {
                            self.errors.push(format!("Undefined variable '{}'", name));
                        }
                        _ => {}
                    }
                }
            }
            Statement::If { condition: _, then_branch, else_branch } => {
                self.symbols.enter_scope();
                self.analyze_block(then_branch)?;
                self.symbols.exit_scope();

                if let Some(else_b) = else_branch {
                    self.symbols.enter_scope();
                    self.analyze_block(else_b)?;
                    self.symbols.exit_scope();
                }
            }
            Statement::While { condition: _, body } => {
                self.symbols.enter_scope();
                self.analyze_block(body)?;
                self.symbols.exit_scope();
            }
            Statement::For { var, iterator: _, body } => {
                self.symbols.enter_scope();
                // Register loop variable
                self.symbols.define(Symbol {
                    name: var.clone(),
                    ty: OmniType::Unknown,
                    kind: SymbolKind::Variable,
                    is_mutable: false,
                })?;
                self.analyze_block(body)?;
                self.symbols.exit_scope();
            }
            Statement::Expression(expr) => {
                self.check_expression(expr)?;
            }
            Statement::Return(Some(expr)) => {
                self.check_expression(expr)?;
            }
            Statement::NativeBlock { .. } | Statement::Break | Statement::Continue | Statement::Return(None) => {}
        }
        Ok(())
    }

    /// Check an expression for undefined variables
    fn check_expression(&mut self, expr: &Expression) -> Result<()> {
        match expr {
            Expression::Identifier(name) => {
                if self.symbols.lookup(name).is_none() {
                    self.warnings.push(format!("Possibly undefined: '{}'", name));
                }
            }
            Expression::BinaryOp { left, right, .. } => {
                self.check_expression(left)?;
                self.check_expression(right)?;
            }
            Expression::Call { function, args } => {
                self.check_expression(function)?;
                for arg in args {
                    self.check_expression(arg)?;
                }
            }
            Expression::MemberAccess { object, .. } => {
                self.check_expression(object)?;
            }
            Expression::Index { target, index } => {
                self.check_expression(target)?;
                self.check_expression(index)?;
            }
            Expression::Array(items) => {
                for item in items {
                    self.check_expression(item)?;
                }
            }
            Expression::StructInit { fields, .. } => {
                for field in fields {
                    self.check_expression(&field.value)?;
                }
            }
            Expression::ObjectLiteral(fields) => {
                for field in fields {
                    self.check_expression(&field.value)?;
                }
            }
            Expression::Literal(_) => {}
        }
        Ok(())
    }

    /// Infer type of an expression
    fn infer_type(&self, expr: &Expression) -> OmniType {
        match expr {
            Expression::Literal(lit) => match lit {
                Literal::Integer(_) => OmniType::Int,
                Literal::Float(_) => OmniType::Float,
                Literal::String(_) => OmniType::String,
                Literal::Bool(_) => OmniType::Bool,
            },
            Expression::Identifier(name) => {
                self.symbols.lookup(name)
                    .map(|s| s.ty.clone())
                    .unwrap_or(OmniType::Unknown)
            }
            Expression::BinaryOp { left, op, right } => {
                let left_ty = self.infer_type(left);
                let right_ty = self.infer_type(right);

                match op {
                    BinaryOperator::Add | BinaryOperator::Subtract |
                    BinaryOperator::Multiply | BinaryOperator::Divide => {
                        if left_ty == OmniType::String || right_ty == OmniType::String {
                            OmniType::String
                        } else if left_ty == OmniType::Float || right_ty == OmniType::Float {
                            OmniType::Float
                        } else {
                            OmniType::Int
                        }
                    }
                    BinaryOperator::Equals | BinaryOperator::NotEquals |
                    BinaryOperator::LessThan | BinaryOperator::GreaterThan |
                    BinaryOperator::LessEquals | BinaryOperator::GreaterEquals |
                    BinaryOperator::LogicalAnd | BinaryOperator::LogicalOr => {
                        OmniType::Bool
                    }
                }
            }
            Expression::Call { function, .. } => {
                if let Expression::Identifier(name) = function.as_ref() {
                    if let Some(sym) = self.symbols.lookup(name) {
                        if let OmniType::Function { returns, .. } = &sym.ty {
                            return *returns.clone();
                        }
                    }
                }
                // Handle method calls on MemberAccess
                if let Expression::MemberAccess { .. } = function.as_ref() {
                    // For method calls, return Unknown for now
                    // Future: lookup method signature on the object type
                    return OmniType::Unknown;
                }
                OmniType::Unknown
            }
            Expression::MemberAccess { object, member } => {
                // Get the type of the object
                let obj_type = self.infer_type(object);
                
                // For known types, try to infer member type
                match obj_type {
                    OmniType::Struct(struct_name) => {
                        // Future: lookup struct field types
                        // For now return Unknown but could be enhanced with struct registry
                        OmniType::Unknown
                    }
                    OmniType::String => {
                        // Common string properties
                        match member.as_str() {
                            "length" => OmniType::Int,
                            _ => OmniType::Unknown,
                        }
                    }
                    OmniType::List(_) => {
                        // Common array properties
                        match member.as_str() {
                            "length" => OmniType::Int,
                            _ => OmniType::Unknown,
                        }
                    }
                    _ => OmniType::Unknown,
                }
            }
            Expression::Index { target, .. } => {
                // Indexing into an array returns the element type
                let target_type = self.infer_type(target);
                match target_type {
                    OmniType::List(inner) => *inner,
                    OmniType::String => OmniType::String, // String indexing returns char/string
                    _ => OmniType::Unknown,
                }
            }
            Expression::Array(items) => {
                // Infer array element type from first element
                if let Some(first) = items.first() {
                    let element_type = self.infer_type(first);
                    OmniType::List(Box::new(element_type))
                } else {
                    OmniType::List(Box::new(OmniType::Unknown))
                }
            }
            Expression::StructInit { name, .. } => OmniType::Struct(name.clone()),
            Expression::ObjectLiteral(_) => OmniType::Struct("Object".to_string()),
        }
    }
}

/// Convenience function to run semantic analysis
pub fn analyze_program(program: &Program) -> Result<SemanticAnalyzer> {
    let mut analyzer = SemanticAnalyzer::new();
    analyzer.analyze(program)?;
    Ok(analyzer)
}
