
try:
    with open("dist/omni_bundle.js", "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    start = 1885
    end = 1900
    
    for i in range(start, end):
        if i < len(lines):
            line = lines[i].rstrip()
            print(f"{i+1}: {repr(line)}")
    
except Exception as e:
    print(e)
