
f = open('dist/omni_bundle.js', 'r', encoding='utf-8')
lines = f.readlines()
for i, line in enumerate(lines):
    if 'function CodeGenerator_gen_stmt_py' in line:
        print(f"Found CodeGenerator_gen_stmt_py at line {i+1}")
    if 'function cmd_run' in line or 'if (command ==' in line or 'if (command === "run"' in line:
        if 'vm' in line: # crude filter
             print(f"Possible run command at line {i+1}: {line.strip()[:50]}...")
f.close()
