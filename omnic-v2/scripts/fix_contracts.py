import os
import glob

# 1. Fix src/core/contracts.omni
core_contracts = "src/core/contracts.omni"
if os.path.exists(core_contracts):
    with open(core_contracts, 'r') as f: content = f.read()
    content = content.replace('import "contracts/', 'import "../contracts/')
    with open(core_contracts, 'w') as f: f.write(content)
    print("Updated src/core/contracts.omni")

# 2. Fix src/contracts/*.omni
contracts_dir = "src/contracts"
files = glob.glob(os.path.join(contracts_dir, "*.omni"))

for f in files:
    with open(f, 'r', encoding='utf-8') as file: content = file.read()
    original_content = content
    
    # Fix imports: remove 'contracts/' prefix for siblings
    # e.g. import "contracts/types.omni" -> import "types.omni"
    if 'import "contracts/' in content:
        content = content.replace('import "contracts/', 'import "')
    
    # Fix {} in struct init
    if "interfaces: {}" in content:
        content = content.replace("interfaces: {}", "interfaces: new_map()")
    if "implementations: {}" in content:
        content = content.replace("implementations: {}", "implementations: new_map()")
        
    # Add new_map helper if needed
    if "new_map()" in content and "fn new_map()" not in content:
        helper = '\nfn new_map() -> any {\n    native "js" { return {}; }\n    return 0;\n}\n'
        # Insert before the function that uses it, typically ContractRegistry_new
        if "fn ContractRegistry_new" in content:
            content = content.replace("fn ContractRegistry_new", helper + "\nfn ContractRegistry_new")
    
    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file: file.write(content)
        print(f"Updated {f}")
