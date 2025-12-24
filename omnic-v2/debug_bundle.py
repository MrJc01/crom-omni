
import sys

try:
    with open("dist/omni_bundle.js", "r", encoding="utf-8") as f:
        content = f.readlines()
    
    found = False
    for i, line in enumerate(content):
        if "CodeGenerator_gen_decorators" in line:
            print(f"Found at line {i+1}:")
            for j in range(max(0, i-5), min(len(content), i+25)):
                print(f"{j+1}: {content[j].rstrip()}")
            found = True
            break
            
    if not found:
        print("CodeGenerator_gen_decorators NOT FOUND")
        
    print("\nTail:")
    for line in content[-10:]:
        print(line.rstrip())
        
except Exception as e:
    print(e)
