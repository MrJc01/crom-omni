//! Module Resolution for Omni Compiler
//!
//! Handles resolving import paths to actual file system paths
//! and managing module dependencies.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::fs;
use crate::core::ast::{Program, Import};
use crate::core::parser::Parser;
use crate::core::lexer::Lexer;
use anyhow::{Result, anyhow, Context};

/// Represents a resolved module
#[derive(Debug, Clone)]
pub struct ResolvedModule {
    pub path: PathBuf,
    pub program: Program,
}

/// Module Resolver - handles import path resolution and module loading
pub struct ModuleResolver {
    /// Base directory for relative imports
    base_dir: PathBuf,
    /// Standard library path
    std_lib_path: Option<PathBuf>,
    /// Cache of already resolved modules
    cache: HashMap<PathBuf, ResolvedModule>,
    /// Search paths for modules
    search_paths: Vec<PathBuf>,
}

impl ModuleResolver {
    /// Create a new resolver with a base directory
    pub fn new(base_dir: PathBuf) -> Self {
        let mut search_paths = vec![base_dir.clone()];
        
        // Add lib directory if it exists
        let lib_dir = base_dir.join("lib");
        if lib_dir.exists() {
            search_paths.push(lib_dir);
        }
        
        // Add std directory if it exists
        let std_dir = base_dir.join("lib").join("std");
        let std_lib_path = if std_dir.exists() {
            Some(std_dir)
        } else {
            None
        };

        Self {
            base_dir,
            std_lib_path,
            cache: HashMap::new(),
            search_paths,
        }
    }

    /// Resolve an import statement to a file path
    pub fn resolve_import(&self, import: &Import) -> Result<PathBuf> {
        let path = &import.path;

        // Handle @std prefix
        if path.starts_with("@std/") || path.starts_with("std/") {
            let relative = path.trim_start_matches('@').trim_start_matches("std/");
            if let Some(std_path) = &self.std_lib_path {
                let file_path = std_path.join(relative).with_extension("omni");
                if file_path.exists() {
                    return Ok(file_path);
                }
            }
            return Err(anyhow!("Standard library module not found: {}", path));
        }

        // Handle .omni extension explicitly given
        if path.ends_with(".omni") {
            let file_path = self.base_dir.join(path);
            if file_path.exists() {
                return Ok(file_path);
            }
            return Err(anyhow!("Module not found: {}", path));
        }

        // Search in all search paths
        for search_path in &self.search_paths {
            // Try with .omni extension
            let file_path = search_path.join(path).with_extension("omni");
            if file_path.exists() {
                return Ok(file_path);
            }

            // Try as directory with index.omni
            let dir_path = search_path.join(path);
            let index_path = dir_path.join("index.omni");
            if index_path.exists() {
                return Ok(index_path);
            }
        }

        Err(anyhow!("Module not found: {}", path))
    }

    /// Load and parse a module from a resolved path
    pub fn load_module(&mut self, path: &Path) -> Result<ResolvedModule> {
        let canonical = path.canonicalize()
            .with_context(|| format!("Failed to resolve path: {}", path.display()))?;

        // Check cache first
        if let Some(cached) = self.cache.get(&canonical) {
            return Ok(cached.clone());
        }

        // Read and parse the module
        let source = fs::read_to_string(&canonical)
            .with_context(|| format!("Failed to read module: {}", canonical.display()))?;

        let lexer = Lexer::new(&source);
        let mut parser = Parser::new(lexer, &source);
        let program = parser.parse_program()
            .with_context(|| format!("Failed to parse module: {}", canonical.display()))?;

        let module = ResolvedModule {
            path: canonical.clone(),
            program,
        };

        // Cache the result
        self.cache.insert(canonical, module.clone());

        Ok(module)
    }

    /// Resolve all imports in a program and return the resolved modules
    pub fn resolve_all_imports(&mut self, program: &Program) -> Result<Vec<ResolvedModule>> {
        let mut modules = Vec::new();

        for import in &program.imports {
            let path = self.resolve_import(import)?;
            let module = self.load_module(&path)?;
            
            // Recursively resolve imports in the loaded module
            let sub_modules = self.resolve_all_imports(&module.program)?;
            modules.extend(sub_modules);
            
            modules.push(module);
        }

        Ok(modules)
    }

    /// Get the module name from a path (basename without extension)
    pub fn get_module_name(path: &Path) -> String {
        path.file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("unknown")
            .to_string()
    }
}

/// Helper to resolve a single import path from the current working directory
pub fn resolve_import_path(import_path: &str) -> Result<PathBuf> {
    let cwd = std::env::current_dir()?;
    let resolver = ModuleResolver::new(cwd);
    let import = Import {
        path: import_path.to_string(),
        alias: None,
    };
    resolver.resolve_import(&import)
}
