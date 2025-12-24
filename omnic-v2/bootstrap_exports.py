
import os
import re

OMNIC_PATH = os.path.join("..", "omnic", "target", "release", "omnic.exe")
SRC_DIR = "src"
DIST_DIR = "dist"

CORE_MODULES = [
    "token", "lexer", "parser", "ast", "codegen",
    "vm", "framework_adapter", "ingestion", "package_manager", 
    "contracts", "ghost_writer", "bootstrap", 
    "studio_engine", "studio_graph", "app_packager", "tui"
]
LIB_MODULES = ["std", "cli"]

def fix_exports(mod, category):
    src = os.path.join(SRC_DIR, category, f"{mod}.omni")
    dest = os.path.join(DIST_DIR, category, f"{mod}.js")
    
    if not os.path.exists(src) or not os.path.exists(dest):
        print(f"Update skipped for {mod} (files not found)")
        return

    print(f"Fixing exports for {mod}...")
    
    with open(src, "r", encoding="utf-8") as s:
        src_content = s.read()
    
    exports = []
    # Find functions: fn Name
    funcs = re.findall(r'^fn\s+(\w+)\s*\(', src_content, re.MULTILINE)
    exports.extend(funcs)
    # Find structs: struct Name
    structs = re.findall(r'^struct\s+(\w+)', src_content, re.MULTILINE)
    exports.extend(structs)
    # Find let constants: let Name =
    lets = re.findall(r'^let\s+(\w+)\s*=', src_content, re.MULTILINE)
    exports.extend(lets)
    
    with open(dest, "r", encoding="utf-8") as f:
        content = f.read()
    
    if exports:
        # Check if already has exports logic to avoid duplication
        if "// Auto-exports" not in content:
            export_code = "\n// Auto-exports\nif (typeof exports !== 'undefined') {\n"
            for name in exports:
                 export_code += f"    exports.{name} = {name};\n"
            export_code += "}\n"
            content += export_code
            
            with open(dest, "w", encoding="utf-8") as f:
                f.write(content)

def main():
    for mod in CORE_MODULES:
        fix_exports(mod, "core")
    
    for mod in LIB_MODULES:
        fix_exports(mod, "lib")
        
    print("Bootstrap exports complete.")

if __name__ == "__main__":
    main()
