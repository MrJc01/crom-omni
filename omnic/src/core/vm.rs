// omnic/src/core/vm.rs
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub enum OpCode {
    LoadConst(i64),   // Load literal integer
    StoreVar(String), // Pop -> Var
    LoadVar(String),  // Var -> Push
    Add,              // Pop a, Pop b -> Push a + b
    Sub,              // Pop a, Pop b -> Push a - b
    Mul,              // Pop a, Pop b -> Push a * b
    Div,              // Pop a, Pop b -> Push a / b
    Print,            // Pop -> IO
    Halt,
    // Future: Jumps for control flow
    // JumpIfFalse(usize),
    // Jump(usize),
}

pub struct VirtualMachine {
    stack: Vec<i64>, 
    vars: HashMap<String, i64>,
    program: Vec<OpCode>,
    ip: usize, // Instruction Pointer
}

impl VirtualMachine {
    pub fn new(program: Vec<OpCode>) -> Self {
        Self {
            stack: Vec::new(),
            vars: HashMap::new(),
            program,
            ip: 0,
        }
    }

    pub fn run(&mut self) {
        println!("🔮 Hollow VM: Awakening...");
        while self.ip < self.program.len() {
            let op = self.program[self.ip].clone();
            self.ip += 1;

            match op {
                OpCode::LoadConst(val) => self.stack.push(val),
                OpCode::StoreVar(name) => {
                    if let Some(val) = self.stack.pop() {
                        self.vars.insert(name, val);
                    }
                }
                OpCode::LoadVar(name) => {
                    if let Some(&val) = self.vars.get(&name) {
                        self.stack.push(val);
                    } else {
                        eprintln!("🔥 VM Fault: Undefined variable '{}'", name);
                    }
                }
                OpCode::Add => {
                    let b = self.stack.pop().unwrap_or(0);
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a + b);
                }
                OpCode::Sub => {
                    let b = self.stack.pop().unwrap_or(0);
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a - b);
                }
                OpCode::Mul => {
                    let b = self.stack.pop().unwrap_or(0);
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a * b);
                }
                OpCode::Div => {
                    let b = self.stack.pop().unwrap_or(1); // Avoid div by zero crash for prototype
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a / b);
                }
                OpCode::Print => {
                    if let Some(val) = self.stack.pop() {
                        println!(">> {}", val);
                    }
                }
                OpCode::Halt => {
                    println!("🔮 Hollow VM: Halting.");
                    break;
                }
            }
        }
    }
}
