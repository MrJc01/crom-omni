
import re

def check():
    path = 'dist/omni_bundle.js'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(e)
        return

    targets = ['fs', 'path', 'os', 'child_process', 'execSync', 'exec']
    counts = {t: 0 for t in targets}
    
    for line in lines:
        for v in targets:
             # Check for top-level (no indentation)
             # Matches "const v =", "const { v } =", "const {..., v, ...} =" - harder.
             # match simple "const v =" or "const { v } ="
             if re.search(r'^(const|let|var)\s+(\{\s*)?' + v + r'(\s*\})?\s*=', line):
                counts[v] += 1
    
    for v, c in counts.items():
        print(f"{v}: {c}")

if __name__ == '__main__':
    check()
