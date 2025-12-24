import os
import glob
import re

src_root = os.path.abspath("src")
files = glob.glob("src/**/*.omni", recursive=True)

internal_roots = ["core", "lib", "commands", "contracts", "studio"]

for f in files:
    file_pdf = os.path.abspath(f)
    file_dir = os.path.dirname(file_pdf)
    
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    
    def replacer(match):
        path_str = match.group(1)
        
        # Don't touch relative paths
        if path_str.startswith('.'):
            return match.group(0)
            
        # Check if it starts with an internal root
        parts = path_str.split('/')
        if not parts or parts[0] not in internal_roots:
            return match.group(0)
            
        # It's an internal path relative to src/
        # Calculate relative path from current file
        target_abs = os.path.join(src_root, *parts)
        rel_path = os.path.relpath(target_abs, file_dir)
        rel_path = rel_path.replace(os.path.sep, '/')
        
        # Ensure ./ prefix if it's just a filename
        if not rel_path.startswith('.'):
            rel_path = './' + rel_path
            
        # If the file is in src root (e.g. main.omni), os.path.relpath might return the path itself
        # e.g. target=src/core/foo, curr=src/ -> core/foo.
        # But for require usage in the same dir, we need ./
        # Note: os.path.relpath("src/core/foo", "src") -> "core/foo"
        # If we use "core/foo" in require inside src/main.js -> require("./core/foo") works.
        # But typically we want standard relative paths. "core/foo" is not POSIX relative usually?
        # Node require: "core/foo" looks in node_modules!
        # SO WE MUST USE ./ for descending paths too.
        
        if not rel_path.startswith('.'):
             rel_path = './' + rel_path
             
        return f'import "{rel_path}";'

    new_content = re.sub(r'import "(.*?)";', replacer, content)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file: file.write(new_content)
        print(f"Fixed imports in {f}")
