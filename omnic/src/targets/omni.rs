use crate::core::codegen::CodeGenerator;
use crate::core::ast::{Program, Statement, Expression};
use anyhow::Result;

pub struct OmniBackend;

impl OmniBackend {
    pub fn new() -> Self {
        Self
    }
}

impl CodeGenerator for OmniBackend {
    fn generate(&self, _program: &Program) -> Result<String> {
        Ok("// Omni Generator Stub".to_string())
    }
}

impl OmniBackend {
    fn gen_statement(&self, _stmt: &Statement, _indent: usize) -> String {
        String::new()
    }
    fn gen_expression(&self, _expr: &Expression) -> String {
        String::new()
    }
}
