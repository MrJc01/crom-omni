//! Optimization Passes for Omni Compiler
//!
//! Includes constant folding and other compile-time optimizations.

use crate::core::ast::*;

/// Constant Folder - evaluates constant expressions at compile time
pub struct ConstantFolder;

impl ConstantFolder {
    pub fn new() -> Self {
        Self
    }

    /// Fold all constant expressions in a program
    pub fn fold_program(&self, program: &mut Program) {
        for item in &mut program.items {
            self.fold_top_level(item);
        }
    }

    fn fold_top_level(&self, item: &mut TopLevelItem) {
        match item {
            TopLevelItem::Function(f) => self.fold_block(&mut f.body),
            TopLevelItem::Flow(fl) => self.fold_block(&mut fl.body),
            TopLevelItem::Capsule(c) => {
                for inner in &mut c.items {
                    self.fold_top_level(inner);
                }
            }
            TopLevelItem::LetBinding { value, .. } => {
                *value = self.fold_expression(value.clone());
            }
            _ => {}
        }
    }

    fn fold_block(&self, block: &mut Block) {
        for stmt in &mut block.statements {
            self.fold_statement(stmt);
        }
    }

    fn fold_statement(&self, stmt: &mut Statement) {
        match stmt {
            Statement::LetBinding { value, .. } => {
                *value = self.fold_expression(value.clone());
            }
            Statement::Assignment { value, .. } => {
                *value = self.fold_expression(value.clone());
            }
            Statement::If { condition, then_branch, else_branch } => {
                *condition = self.fold_expression(condition.clone());
                self.fold_block(then_branch);
                if let Some(else_b) = else_branch {
                    self.fold_block(else_b);
                }
            }
            Statement::While { condition, body } => {
                *condition = self.fold_expression(condition.clone());
                self.fold_block(body);
            }
            Statement::For { iterator, body, .. } => {
                *iterator = self.fold_expression(iterator.clone());
                self.fold_block(body);
            }
            Statement::Return(Some(expr)) => {
                *expr = self.fold_expression(expr.clone());
            }
            Statement::Expression(expr) => {
                *expr = self.fold_expression(expr.clone());
            }
            _ => {}
        }
    }

    /// Fold a single expression, returning the optimized version
    pub fn fold_expression(&self, expr: Expression) -> Expression {
        match expr {
            Expression::BinaryOp { left, op, right } => {
                let left_folded = self.fold_expression(*left);
                let right_folded = self.fold_expression(*right);

                // Try to evaluate if both are literals
                if let (Expression::Literal(l_lit), Expression::Literal(r_lit)) = 
                    (&left_folded, &right_folded) 
                {
                    if let Some(result) = self.eval_binary_op(l_lit, &op, r_lit) {
                        return Expression::Literal(result);
                    }
                }

                // Can't fold, return with folded children
                Expression::BinaryOp {
                    left: Box::new(left_folded),
                    op,
                    right: Box::new(right_folded),
                }
            }
            Expression::Call { function, args } => {
                Expression::Call {
                    function: Box::new(self.fold_expression(*function)),
                    args: args.into_iter().map(|a| self.fold_expression(a)).collect(),
                }
            }
            Expression::Array(items) => {
                Expression::Array(
                    items.into_iter().map(|i| self.fold_expression(i)).collect()
                )
            }
            Expression::Index { target, index } => {
                Expression::Index {
                    target: Box::new(self.fold_expression(*target)),
                    index: Box::new(self.fold_expression(*index)),
                }
            }
            Expression::MemberAccess { object, member } => {
                Expression::MemberAccess {
                    object: Box::new(self.fold_expression(*object)),
                    member,
                }
            }
            Expression::StructInit { name, fields } => {
                Expression::StructInit {
                    name,
                    fields: fields.into_iter().map(|f| StructInitField {
                        name: f.name,
                        value: self.fold_expression(f.value),
                    }).collect(),
                }
            }
            Expression::ObjectLiteral(fields) => {
                Expression::ObjectLiteral(
                    fields.into_iter().map(|f| StructInitField {
                        name: f.name,
                        value: self.fold_expression(f.value),
                    }).collect()
                )
            }
            // Literals and identifiers remain unchanged
            other => other,
        }
    }

    /// Evaluate a binary operation on two literal values
    fn eval_binary_op(&self, left: &Literal, op: &BinaryOperator, right: &Literal) -> Option<Literal> {
        match (left, right) {
            // Integer arithmetic
            (Literal::Integer(l), Literal::Integer(r)) => {
                match op {
                    BinaryOperator::Add => Some(Literal::Integer(l + r)),
                    BinaryOperator::Subtract => Some(Literal::Integer(l - r)),
                    BinaryOperator::Multiply => Some(Literal::Integer(l * r)),
                    BinaryOperator::Divide if *r != 0 => Some(Literal::Integer(l / r)),
                    BinaryOperator::Equals => Some(Literal::Bool(l == r)),
                    BinaryOperator::NotEquals => Some(Literal::Bool(l != r)),
                    BinaryOperator::LessThan => Some(Literal::Bool(l < r)),
                    BinaryOperator::GreaterThan => Some(Literal::Bool(l > r)),
                    BinaryOperator::LessEquals => Some(Literal::Bool(l <= r)),
                    BinaryOperator::GreaterEquals => Some(Literal::Bool(l >= r)),
                    _ => None,
                }
            }
            // Float arithmetic
            (Literal::Float(l), Literal::Float(r)) => {
                match op {
                    BinaryOperator::Add => Some(Literal::Float(l + r)),
                    BinaryOperator::Subtract => Some(Literal::Float(l - r)),
                    BinaryOperator::Multiply => Some(Literal::Float(l * r)),
                    BinaryOperator::Divide if *r != 0.0 => Some(Literal::Float(l / r)),
                    BinaryOperator::Equals => Some(Literal::Bool((l - r).abs() < f64::EPSILON)),
                    BinaryOperator::NotEquals => Some(Literal::Bool((l - r).abs() >= f64::EPSILON)),
                    BinaryOperator::LessThan => Some(Literal::Bool(l < r)),
                    BinaryOperator::GreaterThan => Some(Literal::Bool(l > r)),
                    BinaryOperator::LessEquals => Some(Literal::Bool(l <= r)),
                    BinaryOperator::GreaterEquals => Some(Literal::Bool(l >= r)),
                    _ => None,
                }
            }
            // Mixed int/float (promote to float)
            (Literal::Integer(l), Literal::Float(r)) => {
                self.eval_binary_op(&Literal::Float(*l as f64), op, right)
            }
            (Literal::Float(_), Literal::Integer(r)) => {
                self.eval_binary_op(left, op, &Literal::Float(*r as f64))
            }
            // String concatenation
            (Literal::String(l), Literal::String(r)) => {
                match op {
                    BinaryOperator::Add => Some(Literal::String(format!("{}{}", l, r))),
                    BinaryOperator::Equals => Some(Literal::Bool(l == r)),
                    BinaryOperator::NotEquals => Some(Literal::Bool(l != r)),
                    _ => None,
                }
            }
            // Boolean operations
            (Literal::Bool(l), Literal::Bool(r)) => {
                match op {
                    BinaryOperator::LogicalAnd => Some(Literal::Bool(*l && *r)),
                    BinaryOperator::LogicalOr => Some(Literal::Bool(*l || *r)),
                    BinaryOperator::Equals => Some(Literal::Bool(l == r)),
                    BinaryOperator::NotEquals => Some(Literal::Bool(l != r)),
                    _ => None,
                }
            }
            _ => None,
        }
    }
}

/// Helper function to run constant folding on a program
pub fn fold_constants(program: &mut Program) {
    let folder = ConstantFolder::new();
    folder.fold_program(program);
}

// =============================================================================
// Dead Code Elimination
// =============================================================================

use std::collections::HashSet;

/// Dead Code Eliminator - removes unused functions and variables
pub struct DeadCodeEliminator {
    /// Set of function names that are called/used
    used_functions: HashSet<String>,
    /// Set of variable names that are used
    used_variables: HashSet<String>,
    /// Entry point function name (always kept)
    entry_point: String,
}

impl DeadCodeEliminator {
    pub fn new(entry_point: &str) -> Self {
        let mut used = HashSet::new();
        used.insert(entry_point.to_string());
        
        Self {
            used_functions: used,
            used_variables: HashSet::new(),
            entry_point: entry_point.to_string(),
        }
    }

    /// Analyze and eliminate dead code from a program
    pub fn eliminate(&mut self, program: &mut Program) {
        // Phase 1: Collect all used functions starting from entry point
        self.analyze_program(program);
        
        // Phase 2: Remove unused functions
        program.items.retain(|item| self.is_item_used(item));
    }

    /// Check if a top-level item is used
    fn is_item_used(&self, item: &TopLevelItem) -> bool {
        match item {
            TopLevelItem::Function(f) => {
                // Keep entry point, public functions, and called functions
                f.name == self.entry_point 
                    || f.is_public 
                    || self.used_functions.contains(&f.name)
            }
            TopLevelItem::Struct(_) => true, // Keep all structs for now
            TopLevelItem::Capsule(_) => true, // Keep all capsules
            TopLevelItem::Flow(fl) => {
                self.used_functions.contains(&fl.name)
            }
            TopLevelItem::LetBinding { name, .. } => {
                self.used_variables.contains(name)
            }
            TopLevelItem::NativeBlock { .. } => true, // Always keep native blocks
        }
    }

    /// Analyze program to find all used functions
    fn analyze_program(&mut self, program: &Program) {
        // First, find the entry point and start analysis from there
        for item in &program.items {
            if let TopLevelItem::Function(f) = item {
                if f.name == self.entry_point || f.is_public {
                    self.analyze_block(&f.body);
                }
            }
        }

        // Fixpoint iteration: keep analyzing until no new functions are found
        let mut changed = true;
        while changed {
            changed = false;
            let current_used = self.used_functions.clone();
            
            for item in &program.items {
                if let TopLevelItem::Function(f) = item {
                    if current_used.contains(&f.name) {
                        let before = self.used_functions.len();
                        self.analyze_block(&f.body);
                        if self.used_functions.len() > before {
                            changed = true;
                        }
                    }
                }
            }
        }
    }

    fn analyze_block(&mut self, block: &Block) {
        for stmt in &block.statements {
            self.analyze_statement(stmt);
        }
    }

    fn analyze_statement(&mut self, stmt: &Statement) {
        match stmt {
            Statement::LetBinding { value, .. } => {
                self.analyze_expression(value);
            }
            Statement::Assignment { target, value } => {
                self.analyze_expression(target);
                self.analyze_expression(value);
            }
            Statement::If { condition, then_branch, else_branch } => {
                self.analyze_expression(condition);
                self.analyze_block(then_branch);
                if let Some(else_b) = else_branch {
                    self.analyze_block(else_b);
                }
            }
            Statement::While { condition, body } => {
                self.analyze_expression(condition);
                self.analyze_block(body);
            }
            Statement::For { iterator, body, .. } => {
                self.analyze_expression(iterator);
                self.analyze_block(body);
            }
            Statement::Return(Some(expr)) => {
                self.analyze_expression(expr);
            }
            Statement::Expression(expr) => {
                self.analyze_expression(expr);
            }
            _ => {}
        }
    }

    fn analyze_expression(&mut self, expr: &Expression) {
        match expr {
            Expression::Identifier(name) => {
                self.used_variables.insert(name.clone());
            }
            Expression::Call { function, args } => {
                // Record function call
                if let Expression::Identifier(name) = function.as_ref() {
                    self.used_functions.insert(name.clone());
                }
                self.analyze_expression(function);
                for arg in args {
                    self.analyze_expression(arg);
                }
            }
            Expression::BinaryOp { left, right, .. } => {
                self.analyze_expression(left);
                self.analyze_expression(right);
            }
            Expression::MemberAccess { object, .. } => {
                self.analyze_expression(object);
            }
            Expression::Index { target, index } => {
                self.analyze_expression(target);
                self.analyze_expression(index);
            }
            Expression::Array(items) => {
                for item in items {
                    self.analyze_expression(item);
                }
            }
            Expression::StructInit { fields, .. } => {
                for field in fields {
                    self.analyze_expression(&field.value);
                }
            }
            Expression::ObjectLiteral(fields) => {
                for field in fields {
                    self.analyze_expression(&field.value);
                }
            }
            Expression::Literal(_) => {}
        }
    }
}

/// Helper function to eliminate dead code from a program
pub fn eliminate_dead_code(program: &mut Program, entry_point: &str) {
    let mut eliminator = DeadCodeEliminator::new(entry_point);
    eliminator.eliminate(program);
}

