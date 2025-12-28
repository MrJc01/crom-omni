// omnic/src/core/vm.rs
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub enum OpCode {
    LoadConst(usize), // Load literal at index
    StoreVar(String), // Store stack top to var
    LoadVar(String),  // Load var to stack
    Print,            // Print stack top
    Halt,
}

pub struct VirtualMachine {
    stack: Vec<i64>, // Simplified stack (only ints for now)
    vars: HashMap<String, i64>,
    literals: Vec<i64>,
}

impl VirtualMachine {
    pub fn new() -> Self {
        Self {
            stack: Vec::new(),
            vars: HashMap::new(),
            literals: Vec::new(),
        }
    }

    pub fn run(&mut self, code: Vec<OpCode>) {
        for op in code {
            match op {
                OpCode::LoadConst(idx) => {
                    if let Some(&val) = self.literals.get(idx) {
                        self.stack.push(val);
                    }
                }
                OpCode::StoreVar(name) => {
                    if let Some(val) = self.stack.pop() {
                        self.vars.insert(name, val);
                    }
                }
                OpCode::LoadVar(name) => {
                    if let Some(&val) = self.vars.get(&name) {
                        self.stack.push(val);
                    }
                }
                OpCode::Print => {
                    if let Some(val) = self.stack.pop() {
                        println!("VM Output: {}", val);
                    }
                }
                OpCode::Halt => break,
            }
        }
    }
}
