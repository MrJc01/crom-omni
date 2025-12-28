use crate::core::codegen::CodeGenerator;
use crate::core::ast::{Program, Statement, Expression, Literal};
use crate::core::vm::OpCode; // Direct dependency on VM opcodes? 
// Or maybe serialization to string/binary file?
// For "omni run --bytecode", we might just want to return a debug string or 
// return a Vec<OpCode> if we change the trait ref signature, but CodeGenerator returns String.
// So: We will serialize the OpCodes to a text format that can be parsed or displayed.

use anyhow::Result;

pub struct BytecodeBackend;

impl BytecodeBackend {
    pub fn new() -> Self {
        Self
    }

    fn compile_expr(&self, expr: &Expression, ops: &mut Vec<OpCode>) {
        match expr {
            Expression::Literal(Literal::Integer(i)) => {
                ops.push(OpCode::LoadConst(*i));
            }
            Expression::Identifier(name) => {
                ops.push(OpCode::LoadVar(name.clone()));
            }
            Expression::BinaryOp { left, op, right } => {
                self.compile_expr(left, ops);
                self.compile_expr(right, ops);
                match op {
                    crate::core::ast::BinaryOperator::Add => ops.push(OpCode::Add),
                    crate::core::ast::BinaryOperator::Subtract => ops.push(OpCode::Sub),
                    crate::core::ast::BinaryOperator::Multiply => ops.push(OpCode::Mul),
                    crate::core::ast::BinaryOperator::Divide => ops.push(OpCode::Div),
                    _ => {} // TODO: Comparisons
                }
            }
            _ => {} // Nested calls etc
        }
    }
}

impl CodeGenerator for BytecodeBackend {
    fn generate(&self, program: &Program) -> Result<String> {
        let mut ops = Vec::new();

        // Very simple Linear scan for statements in flows
        for item in &program.items {
            match item {
                crate::core::ast::TopLevelItem::Capsule(c) => {
                    for c_item in &c.items {
                        if let crate::core::ast::TopLevelItem::Flow(f) = c_item {
                            for stmt in &f.body.statements {
                               match stmt {
                                   Statement::LetBinding { name, value, .. } => {
                                       self.compile_expr(value, &mut ops);
                                       ops.push(OpCode::StoreVar(name.clone()));
                                   }
                                   Statement::Expression(Expression::Call { function, args }) => {
                                       if let Expression::Identifier(fname) = function.as_ref() {
                                           if fname == "print" || fname.contains("print") {
                                                if let Some(arg) = args.first() {
                                                    self.compile_expr(arg, &mut ops);
                                                    ops.push(OpCode::Print);
                                                }
                                           }
                                       }
                                   }
                                   _ => {}
                               }
                            }
                        }
                    }
                }
                _ => {} // Ignore NativeBlock, Structs, etc.
            }
        }
        
        ops.push(OpCode::Halt);

        // Debug Output for now
        let mut out = String::new();
        for op in ops {
            out.push_str(&format!("{:?}\n", op));
        }
        Ok(out)
    }
}
