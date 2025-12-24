
try:
    with open("dist/omni_bundle.js", "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    found = False
    for i, line in enumerate(lines):
        if "function CodeGenerator_gen_decorators" in line:
            print(f"Found definition at line {i+1}:")
            for j in range(max(0, i), min(len(lines), i+30)):
                print(f"{j+1}: {lines[j].rstrip()}")
            found = True
            break
            
    if not found:
        print("Definition NOT FOUND")

except Exception as e:
    print(e)
