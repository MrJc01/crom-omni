//! Bytecode Backend - Binary Representation (.omnb)
//!
//! Compiles Omni programs to a binary bytecode format for faster loading
//! and more compact distribution.

use std::io::{Read, Write};
use std::fs::File;
use std::path::Path;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};

/// Magic bytes for .omnb files
const MAGIC: &[u8; 4] = b"OMNB";
/// Current bytecode version
const VERSION: u8 = 1;

/// Bytecode instruction opcodes
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[repr(u8)]
pub enum Opcode {
    // Stack operations
    Nop = 0,
    Push = 1,
    Pop = 2,
    Dup = 3,
    
    // Arithmetic
    Add = 10,
    Sub = 11,
    Mul = 12,
    Div = 13,
    Mod = 14,
    Neg = 15,
    
    // Comparison
    Eq = 20,
    Ne = 21,
    Lt = 22,
    Le = 23,
    Gt = 24,
    Ge = 25,
    
    // Logic
    And = 30,
    Or = 31,
    Not = 32,
    
    // Control flow
    Jump = 40,
    JumpIf = 41,
    JumpIfNot = 42,
    Call = 43,
    Return = 44,
    
    // Variables
    Load = 50,
    Store = 51,
    LoadGlobal = 52,
    StoreGlobal = 53,
    
    // Objects
    NewObject = 60,
    GetField = 61,
    SetField = 62,
    NewArray = 63,
    GetIndex = 64,
    SetIndex = 65,
    
    // Built-ins
    Print = 70,
    Input = 71,
    
    // End
    Halt = 255,
}

/// A bytecode instruction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Instruction {
    pub opcode: Opcode,
    pub operand: Option<Operand>,
}

/// Operand types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Operand {
    Int(i64),
    Float(f64),
    String(String),
    Bool(bool),
    Index(u32),
    Address(u32),
}

/// Bytecode function
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BytecodeFunction {
    pub name: String,
    pub arity: u8,
    pub locals: u8,
    pub instructions: Vec<Instruction>,
}

/// Complete bytecode module
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BytecodeModule {
    /// Module name
    pub name: String,
    /// String constant pool
    pub strings: Vec<String>,
    /// Global variable names
    pub globals: Vec<String>,
    /// Functions
    pub functions: Vec<BytecodeFunction>,
    /// Entry point function index
    pub entry: Option<u32>,
}

impl BytecodeModule {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            strings: Vec::new(),
            globals: Vec::new(),
            functions: Vec::new(),
            entry: None,
        }
    }

    /// Add a string to constant pool, return index
    pub fn add_string(&mut self, s: &str) -> u32 {
        if let Some(idx) = self.strings.iter().position(|x| x == s) {
            idx as u32
        } else {
            self.strings.push(s.to_string());
            (self.strings.len() - 1) as u32
        }
    }

    /// Add a function
    pub fn add_function(&mut self, func: BytecodeFunction) -> u32 {
        self.functions.push(func);
        (self.functions.len() - 1) as u32
    }

    /// Write to binary format
    pub fn write_binary<W: Write>(&self, writer: &mut W) -> Result<()> {
        // Header
        writer.write_all(MAGIC)?;
        writer.write_all(&[VERSION])?;
        
        // Module name
        let name_bytes = self.name.as_bytes();
        writer.write_all(&(name_bytes.len() as u16).to_le_bytes())?;
        writer.write_all(name_bytes)?;
        
        // String pool
        writer.write_all(&(self.strings.len() as u32).to_le_bytes())?;
        for s in &self.strings {
            let bytes = s.as_bytes();
            writer.write_all(&(bytes.len() as u32).to_le_bytes())?;
            writer.write_all(bytes)?;
        }
        
        // Globals
        writer.write_all(&(self.globals.len() as u32).to_le_bytes())?;
        for g in &self.globals {
            let bytes = g.as_bytes();
            writer.write_all(&(bytes.len() as u16).to_le_bytes())?;
            writer.write_all(bytes)?;
        }
        
        // Functions (as JSON for simplicity)
        let funcs_json = serde_json::to_vec(&self.functions)?;
        writer.write_all(&(funcs_json.len() as u32).to_le_bytes())?;
        writer.write_all(&funcs_json)?;
        
        // Entry point
        let entry = self.entry.unwrap_or(u32::MAX);
        writer.write_all(&entry.to_le_bytes())?;
        
        Ok(())
    }

    /// Read from binary format
    pub fn read_binary<R: Read>(reader: &mut R) -> Result<Self> {
        // Header
        let mut magic = [0u8; 4];
        reader.read_exact(&mut magic)?;
        if &magic != MAGIC {
            anyhow::bail!("Invalid bytecode file: bad magic");
        }
        
        let mut version = [0u8; 1];
        reader.read_exact(&mut version)?;
        if version[0] != VERSION {
            anyhow::bail!("Unsupported bytecode version: {}", version[0]);
        }
        
        // Module name
        let mut name_len = [0u8; 2];
        reader.read_exact(&mut name_len)?;
        let name_len = u16::from_le_bytes(name_len) as usize;
        let mut name_bytes = vec![0u8; name_len];
        reader.read_exact(&mut name_bytes)?;
        let name = String::from_utf8(name_bytes)?;
        
        // String pool
        let mut count = [0u8; 4];
        reader.read_exact(&mut count)?;
        let count = u32::from_le_bytes(count) as usize;
        let mut strings = Vec::with_capacity(count);
        for _ in 0..count {
            let mut len = [0u8; 4];
            reader.read_exact(&mut len)?;
            let len = u32::from_le_bytes(len) as usize;
            let mut bytes = vec![0u8; len];
            reader.read_exact(&mut bytes)?;
            strings.push(String::from_utf8(bytes)?);
        }
        
        // Globals
        let mut count = [0u8; 4];
        reader.read_exact(&mut count)?;
        let count = u32::from_le_bytes(count) as usize;
        let mut globals = Vec::with_capacity(count);
        for _ in 0..count {
            let mut len = [0u8; 2];
            reader.read_exact(&mut len)?;
            let len = u16::from_le_bytes(len) as usize;
            let mut bytes = vec![0u8; len];
            reader.read_exact(&mut bytes)?;
            globals.push(String::from_utf8(bytes)?);
        }
        
        // Functions
        let mut len = [0u8; 4];
        reader.read_exact(&mut len)?;
        let len = u32::from_le_bytes(len) as usize;
        let mut funcs_json = vec![0u8; len];
        reader.read_exact(&mut funcs_json)?;
        let functions: Vec<BytecodeFunction> = serde_json::from_slice(&funcs_json)?;
        
        // Entry
        let mut entry_bytes = [0u8; 4];
        reader.read_exact(&mut entry_bytes)?;
        let entry_val = u32::from_le_bytes(entry_bytes);
        let entry = if entry_val == u32::MAX { None } else { Some(entry_val) };
        
        Ok(Self {
            name,
            strings,
            globals,
            functions,
            entry,
        })
    }

    /// Save to file
    pub fn save(&self, path: &Path) -> Result<()> {
        let mut file = File::create(path)
            .with_context(|| format!("Failed to create {}", path.display()))?;
        self.write_binary(&mut file)
    }

    /// Load from file
    pub fn load(path: &Path) -> Result<Self> {
        let mut file = File::open(path)
            .with_context(|| format!("Failed to open {}", path.display()))?;
        Self::read_binary(&mut file)
    }
}

/// Compile bytecode to .omnb file
pub fn compile_to_bytecode(module: &BytecodeModule, output: &Path) -> Result<()> {
    use colored::*;
    println!("{}", "📦 Compiling to bytecode...".cyan().bold());
    
    module.save(output)?;
    
    let size = std::fs::metadata(output)?.len();
    println!("{} Saved {} ({} bytes)", "✓".green(), output.display(), size);
    
    Ok(())
}
