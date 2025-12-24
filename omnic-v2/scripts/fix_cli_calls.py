import os
import glob
import re

# Recursive glob
files = glob.glob("src/**/*.omni", recursive=True)

cli_functions = [
    "CLI_success", "CLI_error", "CLI_warning", "CLI_info", 
    "CLI_step", "CLI_header", "CLI_banner", "CLI_diff",
    "CLI_dim", "CLI_bold", "CLI_green", "CLI_red", "CLI_yellow", "CLI_cyan",
    "CLI_table_simple", "CLI_table_header", "CLI_progress_bar"
]

for f in files:
    if "terminal.omni" in f: continue # Don't update definition file
    
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    original_content = content
    
    # We only want to replace call sites inside native "js" blocks OR if they are using the JS specific syntax?
    # Actually, in Omni code, `CLI_info("foo")` works if `terminal.omni` is imported.
    # But inside `native "js" { ... }`, `CLI_info` is just a variable name.
    # The compiler doesn't rewrite variables inside native blocks.
    # So we must manually update them to `terminal.CLI_info` IF `terminal` is the name of the import.
    
    # Simple regex approach: find `native "js" { ... }` blocks and replace inside them.
    
    parts = []
    last_pos = 0
    
    # Find all native "js" blocks
    # Note: simple regex for native "js" { ... } might fail with nested braces, but let's try assuming balanced or simple structure
    # Actually, fixing this robustly is hard with regex. 
    # But since I know the code style, I can assume standard formatting.
    
    # Better approach: Just replace `CLI_X(` with `terminal.CLI_X(` globally in the file?
    # NO! That would break Omni code which calls the functions directly.
    # We MUST restrict to `native "js"`.
    
    # Let's iterate through lines and track state.
    in_native_js = False
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('native "js" {'):
            in_native_js = True
            new_lines.append(line)
            continue
        
        if in_native_js:
            if stripped == '}' or stripped.startswith('} //'):
                in_native_js = False
                new_lines.append(line)
                continue
            
            # Perform replacements
            temp_line = line
            for func in cli_functions:
                # Look for `CLI_func(` but NOT `terminal.CLI_func(` and NOT `function CLI_func` (def)
                # Regex `(?<!terminal\.|function\s)\bCLI_func\(` 
                pattern = r'(?<!terminal\.|function\s)\b' + func + r'\('
                temp_line = re.sub(pattern, 'terminal.' + func + '(', temp_line)
            
            new_lines.append(temp_line)
        else:
            new_lines.append(line)
            
    new_content = '\n'.join(new_lines)
    
    if new_content != original_content:
        with open(f, 'w', encoding='utf-8') as file: file.write(new_content)
        print(f"Updated {f}")
