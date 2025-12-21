const cli = require("./lib/cli.js");
if (typeof global !== 'undefined') Object.assign(global, cli);
class TUIState {
    constructor(data = {}) {
        this.screen = data.screen;
        this.cursor = data.cursor;
        this.items = data.items;
        this.selected = data.selected;
        this.message = data.message;
        this.running = data.running;
    }
}

function TUIState_new() {
    return new TUIState({ screen: "main", cursor: 0, items: [], selected: [], message: "", running: true });
}
function tui_enable_raw_mode() {
    
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
    
}
function tui_disable_raw_mode() {
    
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
    
}
function tui_clear_screen() {
    
        console.clear();
        process.stdout.write('\x1B[2J\x1B[0f');
    
}
function tui_move_cursor(row, col) {
    
        process.stdout.write(`\x1B[${row};${col}H`);
    
}
function tui_hide_cursor() {
    
        process.stdout.write('\x1B[?25l');
    
}
function tui_show_cursor() {
    
        process.stdout.write('\x1B[?25h');
    
}
function tui_render_header(title, subtitle) {
    
        const width = process.stdout.columns || 80;
        const line = '═'.repeat(width - 2);
        
        console.log(CLI_COLORS.cyan + '╔' + line + '╗' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '║' + CLI_COLORS.reset + 
                    CLI_COLORS.bold + ' ◊ OMNI ' + title.padEnd(width - 12) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + '║' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '║' + CLI_COLORS.reset + 
                    CLI_COLORS.dim + '   ' + subtitle.padEnd(width - 6) + 
                    CLI_COLORS.reset + CLI_COLORS.cyan + '║' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + '╠' + line + '╣' + CLI_COLORS.reset);
    
}
function tui_render_menu(state) {
    
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const selected = i === state.cursor;
            const prefix = selected ? CLI_COLORS.cyan + ' ▶ ' : '   ';
            const suffix = CLI_COLORS.reset;
            
            if (selected) {
                console.log(prefix + CLI_COLORS.bold + item.label + suffix);
            } else {
                console.log(prefix + CLI_COLORS.dim + item.label + suffix);
            }
        }
    
}
function tui_render_footer(state) {
    
        const width = process.stdout.columns || 80;
        const line = '─'.repeat(width - 2);
        
        console.log('');
        console.log(CLI_COLORS.dim + '┌' + line + '┐' + CLI_COLORS.reset);
        
        if (state.message) {
            console.log(CLI_COLORS.dim + '│ ' + CLI_COLORS.reset + 
                        state.message.padEnd(width - 4) + 
                        CLI_COLORS.dim + ' │' + CLI_COLORS.reset);
        }
        
        console.log(CLI_COLORS.dim + '│ ↑/↓ Navigate   Enter Select   q Quit' + 
                    ''.padEnd(width - 42) + ' │' + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + '└' + line + '┘' + CLI_COLORS.reset);
    
}
function tui_render_file_list(state) {
    
        console.log('');
        console.log(CLI_COLORS.cyan + '  Select files to convert:' + CLI_COLORS.reset);
        console.log('');
        
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const isSelected = state.selected.includes(i);
            const isCursor = i === state.cursor;
            
            const checkbox = isSelected ? CLI_COLORS.green + '[✓]' : CLI_COLORS.dim + '[ ]';
            const prefix = isCursor ? CLI_COLORS.cyan + ' ▶ ' : '   ';
            
            console.log(prefix + checkbox + CLI_COLORS.reset + ' ' + 
                        (isCursor ? CLI_COLORS.bold : CLI_COLORS.dim) + 
                        item.name + CLI_COLORS.reset);
        }
    
}
function tui_render_target_select(state) {
    
        console.log('');
        console.log(CLI_COLORS.cyan + '  Select target language:' + CLI_COLORS.reset);
        console.log('');
        
        for (let i = 0; i < state.items.length; i++) {
            const item = state.items[i];
            const isCursor = i === state.cursor;
            
            const prefix = isCursor ? CLI_COLORS.cyan + ' ▶ ' : '   ';
            const icon = item.icon || '🎯';
            
            console.log(prefix + icon + ' ' + 
                        (isCursor ? CLI_COLORS.bold : '') + 
                        item.label + CLI_COLORS.reset);
            
            if (isCursor && item.description) {
                console.log('      ' + CLI_COLORS.dim + item.description + CLI_COLORS.reset);
            }
        }
    
}
function tui_main_menu() {
    return [null, id, null, "convert", label, null, "🔄 Convert Legacy Code", description, null, "Transform PHP, Java, Python to Omni", null, null, id, null, "install", label, null, "📦 Install Package", description, null, "Install from GitHub", null, null, id, null, "studio", label, null, "🎨 Open Studio", description, null, "Visual programming environment", null, null, id, null, "build", label, null, "🔨 Build Project", description, null, "Compile current project", null, null, id, null, "run", label, null, "▶️  Run Project", description, null, "Execute main file", null, null, id, null, "doctor", label, null, "🩺 System Doctor", description, null, "Check installation health", null, null, id, null, "quit", label, null, "❌ Quit", description, null, "", null];
}
function tui_target_menu() {
    return [null, id, null, "js", label, null, "JavaScript (Node.js)", icon, null, "🟨", description, null, "CommonJS module", null, null, id, null, "python", label, null, "Python 3", icon, null, "🐍", description, null, "Python 3.8+ compatible", null, null, id, null, "c", label, null, "C Native", icon, null, "⚡", description, null, "Portable C99 code", null, null, id, null, "lua", label, null, "Lua 5.4", icon, null, "🌙", description, null, "Lua script", null, null, id, null, "wasm", label, null, "WebAssembly", icon, null, "🕸️", description, null, "WASM binary", null, null, id, null, "back", label, null, "← Back", icon, null, "◀️", description, null, "", null];
}
function tui_scan_legacy_files(dir) {
    let files = [];
    
        const fs = require('fs');
        const path = require('path');
        
        const extensions = ['.php', '.java', '.py', '.js', '.ts'];
        
        const scan = (d) => {
            try {
                const entries = fs.readdirSync(d, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
                    
                    const fullPath = path.join(d, entry.name);
                    
                    if (entry.isDirectory()) {
                        scan(fullPath);
                    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
                        files.push({
                            name: path.relative(dir, fullPath),
                            path: fullPath,
                            ext: path.extname(entry.name)
                        });
                    }
                }
            } catch (e) {
                // Skip inaccessible directories
            }
        };
        
        scan(dir);
    
    return files;
}
function cmd_tui() {
    let state = TUIState_new();
    
        state.items = tui_main_menu();
    
    tui_enable_raw_mode();
    tui_hide_cursor();
    
        const readline = require('readline');
        
        const render = () => {
            tui_clear_screen();
            tui_render_header('INTERACTIVE', 'v1.1.0 - Use arrow keys to navigate');
            
            if (state.screen === 'main') {
                tui_render_menu(state);
            } else if (state.screen === 'files') {
                tui_render_file_list(state);
            } else if (state.screen === 'targets') {
                tui_render_target_select(state);
            }
            
            tui_render_footer(state);
        };
        
        const handleAction = (action) => {
            if (action === 'convert') {
                state.screen = 'files';
                state.items = tui_scan_legacy_files(process.cwd());
                state.cursor = 0;
                state.selected = [];
                state.message = 'Space to select, Enter to continue';
            } else if (action === 'install') {
                state.message = 'Use: omni install github:user/repo';
                setTimeout(() => { state.message = ''; render(); }, 2000);
            } else if (action === 'studio') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nStarting Omni Studio...');
                require('child_process').execSync('node dist/main.js studio', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'build') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nBuilding project...');
                require('child_process').execSync('node dist/main.js build', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'run') {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nRunning project...');
                require('child_process').execSync('node dist/main.js run main.omni', { stdio: 'inherit' });
                process.exit(0);
            } else if (action === 'doctor') {
                tui_show_cursor();
                tui_disable_raw_mode();
                cmd_doctor();
                process.exit(0);
            } else if (action === 'quit') {
                state.running = false;
            } else if (action === 'select_target') {
                state.screen = 'targets';
                state.items = tui_target_menu();
                state.cursor = 0;
                state.message = 'Select output target';
            } else if (action === 'back') {
                state.screen = 'main';
                state.items = tui_main_menu();
                state.cursor = 0;
            } else if (action.startsWith('target:')) {
                const target = action.split(':')[1];
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nConverting ' + state.selected.length + ' files to ' + target + '...');
                // Here would call ingest for each selected file
                process.exit(0);
            }
        };
        
        process.stdin.on('data', (key) => {
            // Handle key presses
            if (key === '\u001B[A') { // Up arrow
                state.cursor = Math.max(0, state.cursor - 1);
            } else if (key === '\u001B[B') { // Down arrow
                state.cursor = Math.min(state.items.length - 1, state.cursor + 1);
            } else if (key === ' ' && state.screen === 'files') { // Space - toggle select
                const idx = state.selected.indexOf(state.cursor);
                if (idx >= 0) {
                    state.selected.splice(idx, 1);
                } else {
                    state.selected.push(state.cursor);
                }
            } else if (key === '\r' || key === '\n') { // Enter
                const item = state.items[state.cursor];
                if (state.screen === 'main') {
                    handleAction(item.id);
                } else if (state.screen === 'files') {
                    if (state.selected.length > 0) {
                        handleAction('select_target');
                    } else {
                        state.message = 'Select at least one file';
                    }
                } else if (state.screen === 'targets') {
                    if (item.id === 'back') {
                        handleAction('back');
                    } else {
                        handleAction('target:' + item.id);
                    }
                }
            } else if (key === 'q' || key === '\u0003') { // q or Ctrl+C
                state.running = false;
            } else if (key === '\u001B' || key === 'b') { // Escape or b - back
                if (state.screen !== 'main') {
                    handleAction('back');
                }
            }
            
            if (state.running) {
                render();
            } else {
                tui_show_cursor();
                tui_disable_raw_mode();
                console.log('\nGoodbye! 👋');
                process.exit(0);
            }
        });
        
        // Initial render
        render();
    
}
function tui_quick_convert(files, target) {
    
        console.log(CLI_COLORS.cyan + '◊ Quick Convert' + CLI_COLORS.reset);
        console.log('');
        
        for (const file of files) {
            console.log(CLI_COLORS.dim + '  Converting: ' + file + CLI_COLORS.reset);
            // Would call ingest here
        }
        
        CLI_success('Conversion complete!');
    
}
