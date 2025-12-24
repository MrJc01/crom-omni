
try:
    with open("dist/omni_bundle.js", "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    start = max(0, 1630)
    end = min(len(lines), 1680)
    
    with open("debug_output.txt", "w", encoding="utf-8") as out:
        for i in range(start, end):
            out.write(f"{i+1}: {lines[i]}")
            
    print("Done")
except Exception as e:
    print(e)
