use crate::core::ast::Program;
use anyhow::Result;

/// Trait que todo Backend (Target) deve implementar.
/// Isso permite que o Omni compile para JS, Python, C, etc.
pub trait CodeGenerator {
    /// Recebe a AST (Program) e retorna o código fonte final como String.
    fn generate(&self, program: &Program) -> Result<String>;
}
