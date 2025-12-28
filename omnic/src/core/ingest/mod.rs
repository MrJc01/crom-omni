use std::path::{Path, PathBuf};
use std::fs;
use anyhow::{Result, anyhow};
use regex::Regex;

pub fn ingest_path(path: &Path) -> Result<()> {
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                ingest_file(&path)?;
            }
        }
    } else {
        ingest_file(path)?;
    }
    Ok(())
}

fn ingest_file(path: &Path) -> Result<()> {
    let content = fs::read_to_string(path)?;
    let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
    
    let omni_code = match ext {
        "php" => ingest_php(&content, path),
        "js" | "ts" | "jsx" | "tsx" => ingest_node(&content, path),
        _ => return Ok(()), // Skip unknown extensions
    };
    
    if let Ok(code) = omni_code {
        let out_path = path.with_extension("omni");
        fs::write(&out_path, code)?;
        println!("   ✨ Ingested: {} -> {}", path.display(), out_path.display());
    }
    
    Ok(())
}

fn ingest_php(content: &str, path: &Path) -> Result<String> {
    let file_stem = path.file_stem().unwrap().to_string_lossy();
    let mut capsule_name = capitalize(&file_stem);
    if capsule_name.chars().next().map(|c| c.is_numeric()).unwrap_or(false) {
        capsule_name = format!("C_{}", capsule_name); // Hex-safe prefix
    }
    
    // Simple regex heuristics for PHP
    // 1. Detect Functions: function name(...)
    let re_func = Regex::new(r"function\s+(\w+)\s*\(([^)]*)\)").unwrap();
    
    let mut flows = String::new();
    
    // 2. Detect Classes: class Name extends Model
    let re_class = Regex::new(r"class\s+(\w+)\s+extends\s+Model").unwrap();

    // 3. Detect Middleware: public function handle($request, Closure $next)
    let re_middleware = Regex::new(r"public\s+function\s+handle\s*\(\s*\$request\s*,\s*Closure\s+\$next\s*\)").unwrap();
    
    // 4. Universal Router Mapping (Laravel)
    let re_laravel_route = Regex::new(r"Route::(get|post|put|delete)\s*\(\s*'([^']+)'").unwrap();
    
    // 5. Universal Database Ingestion (Task 11.2)
    // Detects: "SELECT ... FROM", "INSERT INTO", or DB Connection strings
    let re_sql_select = Regex::new(r"(?i)SELECT\s+.*?\s+FROM\s+\w+").unwrap();
    let re_sql_insert = Regex::new(r"(?i)INSERT\s+INTO\s+\w+").unwrap();
    let re_db_conn = Regex::new(r"(mysql|postgres|sqlite):host=").unwrap();

    if re_sql_select.is_match(content) || re_sql_insert.is_match(content) || re_db_conn.is_match(content) {
        flows.push_str("\n    // Database Interactions Detected\n");
        flows.push_str("    @database(provider: \"generic\")\n");
        flows.push_str("    flow db_ops() {\n");
        flows.push_str("        // TODO: Auto-map queries\n");
        flows.push_str("        native \"sql\" { /* Legacy Query */ }\n");
        flows.push_str("    }\n");
    }

    for cap in re_func.captures_iter(content) {
        let name = &cap[1];
        let args = &cap[2]; // $a, $b
        
        // Convert $arg to arg: Any
        let omni_args = args.split(',')
            .filter(|s| !s.trim().is_empty())
            .map(|s| format!("{}: Any", s.trim().trim_start_matches('$')))
            .collect::<Vec<_>>()
            .join(", ");
            
        flows.push_str(&format!("\n    flow {}({}) {{\n        native \"php\" {{\n            // Originally: function {}(...)\n            // Logic preserved for manual review\n        }}\n    }}\n", name, omni_args, name));
    }

    // Universal Router Mapping (Laravel)
    for cap in re_laravel_route.captures_iter(content) {
        let method = cap[1].to_uppercase();
        let path = &cap[2];
        let omni_path = path.replace("{", ":").replace("}", ""); // {id} -> :id
        let name = format!("{}_{}", method.to_lowercase(), omni_path.replace("/", "_").replace("-", "_").replace(":", "").trim_start_matches('_'));
        
        flows.push_str(&format!("\n    // Route: {} {}\n", method, path));
        flows.push_str(&format!("    @route(method: \"{}\", path: \"{}\")\n", method, omni_path));
        flows.push_str(&format!("    flow {}() {{\n", name));
        flows.push_str("        native \"php\" { return ...; }\n");
        flows.push_str("    }\n");
    }
    
    // Inject Main Flow for Server Metamorphosis
    flows.push_str("\n    flow main() {\n        std.http.listen(8080);\n    }\n");

    let decorators = "import std.http;\n";
    Ok(format!("{}capsule {} {{{}\n}}\n", decorators, capsule_name, flows))
}

fn ingest_node(content: &str, path: &Path) -> Result<String> {
    let file_stem = path.file_stem().unwrap().to_string_lossy();
    let capsule_name = capitalize(&file_stem);
    
    // 1. Regex Definitions
    let re_func = Regex::new(r"function\s+(\w+)\s*\(([^)]*)\)").unwrap();
    let re_const = Regex::new(r"const\s+(\w+)\s*=").unwrap();
    let re_hook = Regex::new(r"const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\((.*)\)").unwrap();
    let re_react_props = Regex::new(r"const\s+(\w+)\s*=\s*\(\{\s*([^}]+)\s*\}\)\s*=>").unwrap();
    let re_laravel_route = Regex::new(r"Route::(get|post|put|delete)\s*\(\s*'([^']+)'").unwrap();
    let re_express_route = Regex::new(r"app\.(get|post|put|delete)\s*\(\s*'([^']+)'").unwrap();

    let mut items = String::new();

    // 2. Process Hooks (Mutable State)
    for cap in re_hook.captures_iter(content) {
         let var_name = &cap[1];
         let init_val = &cap[2];
         items.push_str(&format!("\n    // React Hook -> Mutable Variable\n    let mut {} = {};\n", var_name, init_val));
    }
    
    // 3. Process Constants (unless it's a component or hook already caught? simplest heuristic for now)
    // Note: This matches 'const x =' which might overlap with hooks/components. 
    // In a real parser we'd check ranges, but for regex-ingest we'll just allow duplicate comments or rely on specific patterns.
    // For now, let's skip re_const execution to avoid clutter if we prefer structured ingestion, 
    // OR we can leave it but we typically want to avoid ingesting the same line twice.
    // Let's keep it simple: if it looks like a simple const, we take it.
    for cap in re_const.captures_iter(content) {
         let name = &cap[1];
         // Basic filter to avoid ingesting 'Route' or 'app' as constants if they appear so
         if name != "Route" && name != "app" {
            items.push_str(&format!("\n    // Ingested constant\n    let {} = native \"js\" {{ return ...; }};\n", name));
         }
    }
    
    // 4. React Props Mapping
    for cap in re_react_props.captures_iter(content) {
        let comp_name = &cap[1];
        let props_str = &cap[2];
        
        let props: Vec<&str> = props_str.split(',')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .collect();
        
        let mut omni_params = String::new();
        for p in props {
            if !omni_params.is_empty() { omni_params.push_str(", "); }
            omni_params.push_str(&format!("{}: string", p)); // Default to string for now
        }
        
        items.push_str(&format!("\n    // React Component: {}\n", comp_name));
        items.push_str(&format!("    flow {}({}) {{\n", comp_name, omni_params));
        items.push_str("        // Metamorphosis: Component logic here\n");
        items.push_str("        native \"jsx\" { return ...; }\n");
        items.push_str("    }\n");
    }

    // 5. Functions
    for cap in re_func.captures_iter(content) {
        let name = &cap[1];
        let args = &cap[2].trim();
        let omni_args = if args.is_empty() { String::new() } else {
            args.split(',')
                .map(|s| format!("{}: Any", s.trim()))
                .collect::<Vec<_>>()
                .join(", ")
        };
        
        items.push_str(&format!("\n    flow {}({}) {{\n        native \"js\"`\n            // Original JS function {}\n        `\n    }}\n", name, omni_args, name));
    }

    // 6. Universal Router Mapping (Laravel)
    for cap in re_laravel_route.captures_iter(content) {
        let method = cap[1].to_uppercase();
        let path = &cap[2];
        let omni_path = path.replace("{", ":").replace("}", ""); // {id} -> :id
        let name = format!("{}_{}", method.to_lowercase(), omni_path.replace("/", "_").replace("-", "_").replace(":", "").trim_start_matches('_'));
        
        items.push_str(&format!("\n    // Route: {} {}\n", method, path));
        items.push_str(&format!("    @route(method: \"{}\", path: \"{}\")\n", method, omni_path));
        items.push_str(&format!("    flow {}() {{\n", name));
        items.push_str("        native \"php\" { return ...; }\n");
        items.push_str("    }\n");
    }

    // 7. Universal Router Mapping (Express)
    for cap in re_express_route.captures_iter(content) {
        let method = cap[1].to_uppercase();
        let path = &cap[2];
        let omni_path = path.replace("{", ":").replace("}", ""); // Standardize param syntax
        let name = format!("{}_{}", method.to_lowercase(), omni_path.replace("/", "_").replace("-", "_").replace(":", "").trim_start_matches('_'));
        
        items.push_str(&format!("\n    // Route: {} {}\n", method, path));
        items.push_str(&format!("    @route(method: \"{}\", path: \"{}\")\n", method, omni_path));
        items.push_str(&format!("    flow {}() {{\n", name));
        items.push_str("        native \"js\" { return ...; }\n");
        items.push_str("    }\n");
    }
    
    Ok(format!("capsule {} {{{}\n}}\n", capsule_name, items))
}

fn capitalize(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}
