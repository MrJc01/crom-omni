//! Native C Generator - ANSI C Code Generation
//!
//! Generates portable ANSI C code from Omni.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// C type mapping
#[derive(Debug, Clone)]
pub struct CType {
    pub omni_type: String,
    pub c_type: String,
    pub is_pointer: bool,
}

impl CType {
    pub fn from_omni(omni: &str) -> Self {
        let (c_type, is_pointer) = match omni {
            "Int" | "i32" => ("int", false),
            "i64" => ("long long", false),
            "Float" | "f32" => ("float", false),
            "f64" => ("double", false),
            "Bool" => ("int", false), // C doesn't have bool by default
            "String" => ("char*", true),
            "Void" => ("void", false),
            t if t.starts_with("List<") => ("void*", true), // Generic array
            _ => ("void*", true),
        };
        
        Self {
            omni_type: omni.to_string(),
            c_type: c_type.to_string(),
            is_pointer,
        }
    }
}

/// C function
#[derive(Debug, Clone)]
pub struct CFunction {
    pub name: String,
    pub return_type: CType,
    pub params: Vec<(String, CType)>,
    pub body: String,
}

impl CFunction {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            return_type: CType::from_omni("Void"),
            params: Vec::new(),
            body: String::new(),
        }
    }

    pub fn to_header(&self) -> String {
        let params: Vec<_> = self.params.iter()
            .map(|(name, ty)| format!("{} {}", ty.c_type, name))
            .collect();
        
        format!("{} {}({});", 
            self.return_type.c_type,
            self.name,
            if params.is_empty() { "void".to_string() } else { params.join(", ") }
        )
    }

    pub fn to_implementation(&self) -> String {
        let params: Vec<_> = self.params.iter()
            .map(|(name, ty)| format!("{} {}", ty.c_type, name))
            .collect();
        
        format!("{} {}({}) {{\n{}\n}}", 
            self.return_type.c_type,
            self.name,
            if params.is_empty() { "void".to_string() } else { params.join(", ") },
            self.body
        )
    }
}

/// C struct
#[derive(Debug, Clone)]
pub struct CStruct {
    pub name: String,
    pub fields: Vec<(String, CType)>,
}

impl CStruct {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            fields: Vec::new(),
        }
    }

    pub fn to_typedef(&self) -> String {
        let mut output = format!("typedef struct {} {{\n", self.name);
        
        for (name, ty) in &self.fields {
            output.push_str(&format!("    {} {};\n", ty.c_type, name));
        }
        
        output.push_str(&format!("}} {};\n", self.name));
        output
    }
}

/// C module
#[derive(Debug, Clone, Default)]
pub struct CModule {
    pub name: String,
    pub includes: Vec<String>,
    pub structs: Vec<CStruct>,
    pub functions: Vec<CFunction>,
}

impl CModule {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            includes: vec![
                "stdio.h".to_string(),
                "stdlib.h".to_string(),
                "string.h".to_string(),
            ],
            structs: Vec::new(),
            functions: Vec::new(),
        }
    }

    pub fn to_header(&self) -> String {
        let guard = format!("{}_H", self.name.to_uppercase());
        let mut output = String::new();

        output.push_str(&format!("#ifndef {}\n", guard));
        output.push_str(&format!("#define {}\n\n", guard));

        // Includes
        for inc in &self.includes {
            output.push_str(&format!("#include <{}>\n", inc));
        }
        output.push('\n');

        // Structs
        for s in &self.structs {
            output.push_str(&s.to_typedef());
            output.push('\n');
        }

        // Function prototypes
        for f in &self.functions {
            output.push_str(&f.to_header());
            output.push('\n');
        }

        output.push_str(&format!("\n#endif /* {} */\n", guard));
        output
    }

    pub fn to_source(&self) -> String {
        let mut output = String::new();

        output.push_str(&format!("#include \"{}.h\"\n\n", self.name));

        for f in &self.functions {
            output.push_str(&f.to_implementation());
            output.push_str("\n\n");
        }

        output
    }
}

/// Extract C module from Omni code
pub fn extract_from_omni(code: &str, module_name: &str) -> CModule {
    let mut module = CModule::new(module_name);
    let mut current_struct: Option<CStruct> = None;
    let mut current_func: Option<CFunction> = None;

    for line in code.lines() {
        let trimmed = line.trim();

        // Struct definition
        if trimmed.starts_with("struct ") {
            if let Some(s) = current_struct.take() {
                module.structs.push(s);
            }

            let name = trimmed[7..].split('{').next()
                .unwrap_or("Struct")
                .trim()
                .to_string();

            current_struct = Some(CStruct::new(&name));
        }

        // Struct fields
        if let Some(ref mut s) = current_struct {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let ty = CType::from_omni(parts[1].trim().trim_end_matches(','));
                    s.fields.push((name, ty));
                }
            }
        }

        // Function definition
        if trimmed.starts_with("fn ") {
            if let Some(f) = current_func.take() {
                module.functions.push(f);
            }

            let name = trimmed[3..].split('(').next()
                .unwrap_or("func")
                .trim()
                .to_string();

            let mut func = CFunction::new(&name);
            func.body = "    // TODO: implement".to_string();
            current_func = Some(func);
        }

        // End of block
        if trimmed == "}" {
            if let Some(s) = current_struct.take() {
                module.structs.push(s);
            }
            if let Some(f) = current_func.take() {
                module.functions.push(f);
            }
        }
    }

    module
}

/// Generate C code from Omni
pub fn generate_c(code: &str, module_name: &str, output_dir: &Path) -> Result<()> {
    println!("{}", "🔧 Generating ANSI C code...".cyan().bold());

    let module = extract_from_omni(code, module_name);
    
    // Header file
    let header_path = output_dir.join(format!("{}.h", module_name));
    fs::write(&header_path, module.to_header())?;
    println!("  {} {}.h", "✓".green(), module_name);

    // Source file
    let source_path = output_dir.join(format!("{}.c", module_name));
    fs::write(&source_path, module.to_source())?;
    println!("  {} {}.c", "✓".green(), module_name);

    println!("{} Generated {} structs, {} functions",
        "✓".green(),
        module.structs.len(),
        module.functions.len()
    );

    Ok(())
}
