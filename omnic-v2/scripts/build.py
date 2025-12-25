
import os
import subprocess
import sys

# Configuration
OMNIC_PATH = os.path.join("..", "omnic", "target", "release", "omnic.exe")
SRC_DIR = "src"
DIST_DIR = "dist"
CORE_MODULES = [
    "token", "lexer", "parser", "ast", "codegen", "codegen_hybrid",
    "vm", "framework_adapter", "ingestion", "package_manager", 
    "contracts", "ghost_writer", "bootstrap", 
    "studio_engine", "studio_graph", "app_packager", "tui"
]
LIB_MODULES = ["std", "terminal"]
COMMAND_MODULES = [
    "cmd_setup", "cmd_run", "cmd_build", "cmd_test", 
    "cmd_package", "cmd_registry", "cmd_studio"
]

import re

def compile_file(src, dest, auto_export=False):
    print(f"  Compiling: {src}")
    try:
        # Capture output to avoid clutter, unless error
        cmd = ["node", "compile_shim.js", "build", "--target", "js", src]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode != 0:
            print(f"Error compiling {src}:")
            print(result.stderr)
            print(result.stdout)
            return False
        
        content = result.stdout
        
        if auto_export:
            # Simple regex to find top-level declarations
            # This is heuristic but should work for core modules
            
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
            
            if exports:
                export_code = "\n// Auto-exports\nif (typeof exports !== 'undefined') {\n"
                for name in exports:
                    # Filter internal names?
                    export_code += f"    exports.{name} = {name};\n"
                export_code += "}\n"
                content += export_code
        
        with open(dest, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error executing omnic: {e}")
        return False

def main():
    if not os.path.exists(OMNIC_PATH):
        # Allow running without Rust compiler for testing parsing/logic via Node shim if available
        # print(f"Error: Rust compiler not found at {OMNIC_PATH}")
        # return
        pass



    # Create directories
    os.makedirs(os.path.join(DIST_DIR, "core"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "core", "codegen"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "lib"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "commands"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "studio"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "contracts"), exist_ok=True)


    # Copy helper JS files
    try:
        import shutil
        shutil.copy(os.path.join(SRC_DIR, "core", "codegen_hybrid_impl.js"), os.path.join(DIST_DIR, "core", "codegen_hybrid_impl.js"))
        shutil.copy(os.path.join(SRC_DIR, "core", "ingestion_patterns.js"), os.path.join(DIST_DIR, "core", "ingestion_patterns.js"))
    except Exception as e:
        print(f"Error copying helper JS: {e}")

    # Core
    print("Step 1: Compiling core modules...")
    compiled_core = []
    # Explicitly compile submodules first? Order usually doesn't matter for JS requires, but...
    # Update CORE_MODULES dynamically or here?
    # Let's just create a list here or update the global constant?
    # Updating constant is cleaner but I need to make sure I don't break iteration.
    
    # Extended list
    full_core_modules = [
        "token", "lexer", "parser", "ast", 
        "codegen/base", "codegen/js", "codegen/python", "codegen", "codegen_hybrid",
        "vm", "framework_adapter", "ingestion", "package_manager", 
        "contracts", "ghost_writer", "bootstrap", 
        "studio_engine", "studio_graph", "app_packager", "tui"
    ]
    
    # Studio modules (compile to dist/studio/)
    studio_modules = [
        "project", "runner", "state", "html", "server",
        "graph_types", "graph_convert", "graph_io", "graph_actions"
    ]
    
    # Contract modules (compile to dist/contracts/)
    contract_modules = [
        "types", "interfaces", "registry",
        "impl_js", "impl_python", "impl_cnative", "impl_lua"
    ]

    for mod in full_core_modules:
        print(f"DEBUG: Processing {mod}")
        if compile_file(os.path.join(SRC_DIR, "core", f"{mod}.omni"), os.path.join(DIST_DIR, "core", f"{mod}.js"), auto_export=True):
            compiled_core.append(mod)


    # Compiling Studio Submodules
    print("Step 1.1: Compiling studio modules...")
    for mod in studio_modules:
        if compile_file(os.path.join(SRC_DIR, "studio", f"{mod}.omni"), os.path.join(DIST_DIR, "studio", f"{mod}.js"), auto_export=True):
            compiled_core.append(f"../studio/{mod}") # Add to core bundle list? Or separate? 
            # If main.js or other core modules require them via "studio/...", they need to be resolveable.
            # In node, require("studio/project.omni") -> if we patch paths it works.
            # But here "studio_engine.omni" imports "studio/project.omni".
            # The compiler might resolve this relative to src?
            # If I compile to dist/studio/project.js
            # And dist/core/studio_engine.js requires "../studio/project.js"?
            # Omni compiler handles imports by preserving path string usually?
            # Let's see how `compile_file` works. It just runs the shim. 
            pass
            
    # Compiling Contract Submodules
    print("Step 1.2: Compiling contract modules...")
    for mod in contract_modules:
         if compile_file(os.path.join(SRC_DIR, "contracts", f"{mod}.omni"), os.path.join(DIST_DIR, "contracts", f"{mod}.js"), auto_export=True):
            compiled_core.append(f"../contracts/{mod}")
            pass

    # Compile Facades (studio_engine, studio_graph) LAST so they can find dependencies if checked?
    # Actually, they are in core/ so they are in full_core_modules list... wait, I removed them from list above.
    # I replaced "studio_engine", "studio_graph" with "tui".
    # I should add them back to full_core_modules.
    
    # Compile Facades (studio_engine, studio_graph) LAST so they can find dependencies if checked?
    # Actually, they are in core/ so they are in full_core_modules list.
    # extra_core block removed to prevent duplicate inclusion.

    # Lib
    print("Step 2: Compiling lib modules...")
    compiled_lib = []
    for mod in LIB_MODULES:
        if compile_file(os.path.join(SRC_DIR, "lib", f"{mod}.omni"), os.path.join(DIST_DIR, "lib", f"{mod}.js"), auto_export=True):
            compiled_lib.append(mod)

    # Commands
    print("Step 3: Compiling command modules...")
    compiled_commands = []
    for mod in COMMAND_MODULES:
        if compile_file(os.path.join(SRC_DIR, "commands", f"{mod}.omni"), os.path.join(DIST_DIR, "commands", f"{mod}.js"), auto_export=True):
            compiled_commands.append(mod)

    # Main
    print("Step 4: Compiling main.omni...")
    compile_file(os.path.join(SRC_DIR, "main.omni"), os.path.join(DIST_DIR, "main.js"))
    
    # Function to patch generic JS issues (const -> let)
    def patch_js_file(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Fix: Compiler generates 'const' for 'let', preventing reassignment
        # Pattern: const var_name = ... -> let var_name = ...
        # Exclude import requires
        # Match any identifier start (lowercase or uppercase)
        new_content = re.sub(r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!\s*require)', r'let \1 =', content)
        
        if content != new_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
                
    # Patch all generated JS files for const/let issue
    print("Patching generated JS files...")
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            if file.endswith(".js") and file != "omni_bundle.js":
                patch_js_file(os.path.join(root, file))

    # Specific patches for main.js (Entry Point & Module Renaming)
    with open(os.path.join(DIST_DIR, "main.js"), "r", encoding="utf-8") as f:
        main_content = f.read()
    
    # Fix 2: Rename command module imports to avoid shadowing global functions (ONLY needed in main.js)
    # const cmd_run = require(...) -> const mod_cmd_run = require(...)
    # Object.assign(global, cmd_run) -> Object.assign(global, mod_cmd_run)
    main_content = re.sub(r'const (cmd_\w+) = require', r'const mod_\1 = require', main_content)
    main_content = re.sub(r'Object\.assign\(global, (cmd_\w+)\)', r'Object.assign(global, mod_\1)', main_content)
    
    # Append execution trigger
    if "if (typeof main === 'function') main();" not in main_content:
        main_content += "\n\nif (typeof main === 'function') main();\n"
    
    with open(os.path.join(DIST_DIR, "main.js"), "w", encoding="utf-8") as f:
        f.write(main_content)

    # Specific patch for std.js (Export missing functions due to compiler bug)
    with open(os.path.join(DIST_DIR, "lib/std.js"), "a", encoding="utf-8") as f:
        f.write("\nmodule.exports = { print, read_file, write_file };\n")

    # Bundle
    print("Step 5: Creating bundle...")
    bundle_content = [
        "// OMNI v1.2.0 - Unified Bundle",
        "const OMNI = {};",
        
        # Hoist common Node.js modules to global scope to avoid collision
        "const fs = require('fs');",
        "const path = require('path');",
        "const os = require('os');",
        "const child_process = require('child_process');",
        "",
        "var exports = module.exports; // Shared exports object",
    ]

    def process_module(mod_path):
        if not os.path.exists(mod_path): return ""
        with open(mod_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Strip 'use strict'
        content = content.replace("'use strict';", "")
        
        # Remove generated imports (const x = require('./x.js');)
        # We assume dependencies are already loaded in scope due to order
        # 1. Internal Modules: const token = require('./token.js') -> var token = exports;
        content = re.sub(r"const (\w+) = require\(['\"](\./|\../).*?['\"]\);", r"var \1 = exports;", content)

        # 2. Node Modules: const fs = require('fs') -> // const fs = ... (removed, used global)
        content = re.sub(r"const \w+ = require\(['\"](fs|path|os|child_process)['\"]\);", r"// \g<0> (hoisted)", content)
        
        # 3. Remove module.exports assignment (generated by codegen)
        content = re.sub(r"module\.exports\s*=\s*\{[^}]*\};?", "", content)

        return content

    for mod in compiled_core:
        # Pre-append helper JS for specific modules
        if mod == "codegen_hybrid":
             bundle_content.append(f"\n// === Helper: core/codegen_hybrid_impl.js ===")
             if os.path.exists(os.path.join(SRC_DIR, "core", "codegen_hybrid_impl.js")):
                 with open(os.path.join(SRC_DIR, "core", "codegen_hybrid_impl.js"), "r", encoding="utf-8") as f:
                     helper = f.read()
                     # Patch exports
                     helper = helper.replace("module.exports = HybridImpl;", "Object.assign(exports, HybridImpl);")
                     # Patch requires
                     helper = re.sub(r"const \w+ = require\(['\"](fs|path|os|child_process)['\"]\);", r"// \g<0> (hoisted)", helper)
                     bundle_content.append(helper)

        # Inject helper JS for ingestion
        if mod == "ingestion":
             bundle_content.append(f"\n// === Helper: core/ingestion_patterns.js ===")
             if os.path.exists(os.path.join(SRC_DIR, "core", "ingestion_patterns.js")):
                 with open(os.path.join(SRC_DIR, "core", "ingestion_patterns.js"), "r", encoding="utf-8") as f:
                     helper = f.read()
                     # Patch exports to mix into global exports
                     helper = helper.replace("module.exports = {", "Object.assign(exports, {")
                     helper = helper.replace("};", "});")
                     bundle_content.append(helper)

        bundle_content.append(f"\n// === Module: core/{mod} ===")
        content = process_module(os.path.join(DIST_DIR, "core", f"{mod}.js"))
        bundle_content.append(content)

    for mod in compiled_lib:
        bundle_content.append(f"\n// === Module: lib/{mod} ===")
        content = process_module(os.path.join(DIST_DIR, "lib", f"{mod}.js"))
        bundle_content.append(content)

    for mod in compiled_commands:
        bundle_content.append(f"\n// === Module: commands/{mod} ===")
        content = process_module(os.path.join(DIST_DIR, "commands", f"{mod}.js"))
        bundle_content.append(content)
            
    # Main Entry
    if os.path.exists(os.path.join(DIST_DIR, "main.js")):
        with open(os.path.join(DIST_DIR, "main.js"), "r", encoding="utf-8") as f:
            bundle_content.append("\n// === Main Entry ===")
            content = f.read().replace("'use strict';", "")
            
            # Apply same replacements
            content = re.sub(r"const (\w+) = require\(['\"](\./|\../).*?['\"]\);", r"var \1 = exports;", content)
            content = re.sub(r"const \w+ = require\(['\"](fs|path|os|child_process)['\"]\);", r"// \g<0> (hoisted)", content)
            
            bundle_content.append(content)

    # Add footer to expose all exports globally
    bundle_content.append("\n// Expose all exports globally")
    bundle_content.append("if (typeof global !== 'undefined') Object.assign(global, exports);") 
    
    with open(os.path.join(DIST_DIR, "omni_bundle.js"), "w", encoding="utf-8") as f:
        f.write("\n".join(bundle_content))
    
    print("Build Complete.")

if __name__ == "__main__":
    main()
