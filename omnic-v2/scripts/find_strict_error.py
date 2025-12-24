
import re

reserved = [
    "implements", "interface", "let", "package", "private", "protected", 
    "public", "static", "yield", "arguments", "eval"
]

pattern = r'\b(var|let|const|function|class)\s+(' + '|'.join(reserved) + r')\b'
pattern_assign = r'\b(' + '|'.join(reserved) + r')\s*='
pattern_prop = r'\.(' + '|'.join(reserved) + r')\s*=' # Properties ARE allowed (e.g. obj.package = 1)

with open("dist/omni_bundle.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Scanning {len(lines)} lines...")

for i, line in enumerate(lines):
    # Check declarations
    match = re.search(pattern, line)
    if match:
        print(f"Line {i+1}: {match.group(0)}")
        print(line.strip())
    
    # Check assignments - BE CAREFUL: obj.package = ... is VALID. package = ... is INVALID (if package is var)
    # But checking for simple assignment might catch globals.
    # We want valid identifiers.
    # Strict mode: "package = 1" (if package not defined) is ReferenceError, but if defined as var it's SyntaxError?
    # No, defining it is SyntaxError.
    
    # We mainly care about Declarations.
    
    # Also check function params? naive regex is hard.
