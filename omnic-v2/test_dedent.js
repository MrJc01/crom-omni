
function check(code) {
    if (!code) return "";
    
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0);
    
    if (nonEmptyLines.length > 0) {
        const minIndent = nonEmptyLines.reduce((min, line) => {
            const match = line.match(/^\s*/);
            const indent = match ? match[0].length : 0;
            return indent < min ? indent : min;
        }, Infinity);

        console.log("MinIndent:", minIndent);

        if (minIndent > 0 && minIndent !== Infinity) {
            code = lines.map(line => {
                if (line.trim().length === 0) return ''; 
                return line.length >= minIndent ? line.substring(minIndent) : line;
            }).join('\n');
        }
    }
    return code;
}

const input = `
            import tkinter as tk
            global ui_root_ref
            if ui_root_ref == 0 or ui_root_ref is None:
                ui_root_ref = tk.Tk()
            
            ui_root_ref.title(config.title)
            ui_root_ref.geometry(f"{config.width}x{config.height}")
            if config.background:
                ui_root_ref.configure(bg=config.background)
                
            win.handle = ui_root_ref
`;

console.log("Input length:", input.length);
const output = check(input);
console.log("Output:");
console.log(output);
console.log("First line indent:", output.split('\n')[1].match(/^\s*/)[0].length);
