function print(msg) {
     console.log(msg); 
}
class WindowConfig {
    constructor(data = {}) {
        this.title = data.title;
        this.width = data.width;
        this.height = data.height;
        this.resizable = data.resizable;
        this.fullscreen = data.fullscreen;
        this.background = data.background;
    }
}
class Window {
    constructor(data = {}) {
        this.handle = data.handle;
        this.config = data.config;
        this.is_open = data.is_open;
    }
}
class Button {
    constructor(data = {}) {
        this.handle = data.handle;
        this.label = data.label;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
    }
}
class Label {
    constructor(data = {}) {
        this.handle = data.handle;
        this.text = data.text;
        this.x = data.x;
        this.y = data.y;
    }
}
class TextInput {
    constructor(data = {}) {
        this.handle = data.handle;
        this.placeholder = data.placeholder;
        this.value = data.value;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
    }
}
class GUI {
    static main_window = new Window({ handle: 0, config: new WindowConfig({ title: "", width: 0, height: 0, resizable: false, fullscreen: false, background: "" }), is_open: false });
    static event_handlers = 0;
    static create_window(config) {
    let win = new Window({ handle: 0, config: config, is_open: false });
    
            // Browser-based simulation (Electron would use BrowserWindow)
            if (typeof window !== 'undefined') {
                // Create a div to simulate a window
                const container = document.createElement('div');
                container.id = 'omni-window';
                container.style.cssText = `
                    width: ${config.width}px;
                    height: ${config.height}px;
                    background: ${config.background};
                    border: 2px solid #333;
                    border-radius: 8px;
                    margin: 20px auto;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    font-family: system-ui, sans-serif;
                `;
                
                // Title bar
                const titleBar = document.createElement('div');
                titleBar.style.cssText = `
                    background: linear-gradient(180deg, #4a4a4a, #333);
                    padding: 8px 12px;
                    color: white;
                    font-weight: bold;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;
                
                // Title text
                const title = document.createElement('span');
                title.textContent = config.title;
                titleBar.appendChild(title);
                
                // Window controls
                const controls = document.createElement('div');
                controls.innerHTML = `
                    <span style="display:inline-block;width:12px;height:12px;background:#ff5f56;border-radius:50%;margin-left:8px"></span>
                    <span style="display:inline-block;width:12px;height:12px;background:#ffbd2e;border-radius:50%;margin-left:8px"></span>
                    <span style="display:inline-block;width:12px;height:12px;background:#27c93f;border-radius:50%;margin-left:8px"></span>
                `;
                titleBar.appendChild(controls);
                
                container.appendChild(titleBar);
                
                // Content area
                const content = document.createElement('div');
                content.id = 'window-content';
                content.style.cssText = 'padding: 16px; position: relative;';
                container.appendChild(content);
                
                document.body.appendChild(container);
                win.handle = container;
                win.is_open = true;
            }
        
}
}

static add_button(label, x, y, width, height) {
    let btn = new Button({ handle: 0, label: label, x: x, y: y, width: width, height: height });
    
            const content = document.getElementById('window-content');
            if (content) {
                const button = document.createElement('button');
                button.textContent = label;
                button.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${width}px;
                    height: ${height}px;
                    background: linear-gradient(180deg, #58a6ff, #388bfd);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: transform 0.1s;
                `;
                button.onmouseover = () => button.style.transform = 'scale(1.02)';
                button.onmouseout = () => button.style.transform = 'scale(1)';
                content.appendChild(button);
                btn.handle = button;
            }
        
    return btn;
}
static add_label(text, x, y) {
    let lbl = new Label({ handle: 0, text: text, x: x, y: y });
    
            const content = document.getElementById('window-content');
            if (content) {
                const label = document.createElement('div');
                label.textContent = text;
                label.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    color: #333;
                    font-size: 14px;
                `;
                content.appendChild(label);
                lbl.handle = label;
            }
        
    return lbl;
}
static add_input(placeholder, x, y, width) {
    let input = new TextInput({ handle: 0, placeholder: placeholder, value: "", x: x, y: y, width: width });
    
            const content = document.getElementById('window-content');
            if (content) {
                const inputEl = document.createElement('input');
                inputEl.type = 'text';
                inputEl.placeholder = placeholder;
                inputEl.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${width}px;
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 14px;
                `;
                inputEl.addEventListener('input', () => {
                    input.value = inputEl.value;
                });
                content.appendChild(inputEl);
                input.handle = inputEl;
            }
        
    return input;
}
static on_click(btn, callback) {
    
            if (btn.handle) {
                btn.handle.addEventListener('click', callback);
            }
        
}
static set_label_text(lbl, text) {
    
            if (lbl.handle) {
                lbl.handle.textContent = text;
            }
        
}
static close() {
    
            if (GUI.main_window.handle) {
                GUI.main_window.handle.remove();
                GUI.main_window.is_open = false;
            }
        
}
function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Desktop Window (std.gui)    ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("Creating native window...");
    let config = new WindowConfig({ title: "Omni Desktop App", width: 400, height: 300, resizable: true, fullscreen: false, background: "#f5f5f5" });
    let window = GUI.create_window(config);
    print("  ✓ Window created: " + config.title);
    let title = GUI.add_label("Welcome to Omni GUI", 20, 20);
    print("  ✓ Label added");
    let name_input = GUI.add_input("Enter your name...", 20, 60, 200);
    print("  ✓ Input field added");
    let greet_button = GUI.add_button("Greet", 20, 110, 100, 36);
    print("  ✓ Button added");
    let result_label = GUI.add_label("", 20, 160);
    
        GUI.on_click(greet_button, () => {
            const name = name_input.value || 'World';
            GUI.set_label_text(result_label, 'Hello, ' + name + '!');
        });
    
    print("  ✓ Event handler bound");
    print("");
    print("GUI Components Available:");
    print("  GUI.create_window(config) - Create native window");
    print("  GUI.add_button(label,...)  - Add clickable button");
    print("  GUI.add_label(text,...)    - Add text label");
    print("  GUI.add_input(placeholder) - Add text input");
    print("  GUI.on_click(btn, fn)      - Handle click events");
    print("");
    print("✓ Desktop window demo ready!");
    print("  Open in browser to see the simulated window.");
}
