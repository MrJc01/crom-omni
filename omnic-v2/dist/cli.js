class Colors {
    constructor(data = {}) {
        this.reset = data.reset;
        this.bold = data.bold;
        this.dim = data.dim;
        this.underline = data.underline;
        this.black = data.black;
        this.red = data.red;
        this.green = data.green;
        this.yellow = data.yellow;
        this.blue = data.blue;
        this.magenta = data.magenta;
        this.cyan = data.cyan;
        this.white = data.white;
        this.bg_black = data.bg_black;
        this.bg_red = data.bg_red;
        this.bg_green = data.bg_green;
        this.bg_yellow = data.bg_yellow;
        this.bg_blue = data.bg_blue;
        this.bg_magenta = data.bg_magenta;
        this.bg_cyan = data.bg_cyan;
        this.bg_white = data.bg_white;
    }
}

function Colors_new() {
    let c = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
    
        // Check if terminal supports colors
        const supportsColor = process.stdout.isTTY && 
            (process.env.TERM !== 'dumb') && 
            !process.env.NO_COLOR;
        
        if (supportsColor) {
            c.reset = '\x1b[0m';
            c.bold = '\x1b[1m';
            c.dim = '\x1b[2m';
            c.underline = '\x1b[4m';
            
            c.black = '\x1b[30m';
            c.red = '\x1b[31m';
            c.green = '\x1b[32m';
            c.yellow = '\x1b[33m';
            c.blue = '\x1b[34m';
            c.magenta = '\x1b[35m';
            c.cyan = '\x1b[36m';
            c.white = '\x1b[37m';
            
            c.bg_black = '\x1b[40m';
            c.bg_red = '\x1b[41m';
            c.bg_green = '\x1b[42m';
            c.bg_yellow = '\x1b[43m';
            c.bg_blue = '\x1b[44m';
            c.bg_magenta = '\x1b[45m';
            c.bg_cyan = '\x1b[46m';
            c.bg_white = '\x1b[47m';
        }
    
    return c;
}
let CLI_COLORS = Colors_new();
function CLI_success(msg) {
    
        console.log(CLI_COLORS.green + '✓' + CLI_COLORS.reset + ' ' + msg);
    
}
function CLI_error(msg) {
    
        console.error(CLI_COLORS.red + '✗' + CLI_COLORS.reset + ' ' + msg);
    
}
function CLI_warning(msg) {
    
        console.log(CLI_COLORS.yellow + '⚠' + CLI_COLORS.reset + ' ' + msg);
    
}
function CLI_info(msg) {
    
        console.log(CLI_COLORS.blue + 'ℹ' + CLI_COLORS.reset + ' ' + msg);
    
}
function CLI_step(step, total, msg) {
    
        const prefix = CLI_COLORS.cyan + '[' + step + '/' + total + ']' + CLI_COLORS.reset;
        console.log(prefix + ' ' + msg);
    
}
function CLI_header(title) {
    
        console.log('');
        console.log(CLI_COLORS.bold + CLI_COLORS.cyan + '═══ ' + title + ' ═══' + CLI_COLORS.reset);
        console.log('');
    
}
function CLI_dim(msg) {
    let result = "";
    
        result = CLI_COLORS.dim + msg + CLI_COLORS.reset;
    
    return result;
}
function CLI_bold(msg) {
    let result = "";
    
        result = CLI_COLORS.bold + msg + CLI_COLORS.reset;
    
    return result;
}
function CLI_green(msg) {
    let result = "";
    
        result = CLI_COLORS.green + msg + CLI_COLORS.reset;
    
    return result;
}
function CLI_red(msg) {
    let result = "";
    
        result = CLI_COLORS.red + msg + CLI_COLORS.reset;
    
    return result;
}
function CLI_yellow(msg) {
    let result = "";
    
        result = CLI_COLORS.yellow + msg + CLI_COLORS.reset;
    
    return result;
}
function CLI_cyan(msg) {
    let result = "";
    
        result = CLI_COLORS.cyan + msg + CLI_COLORS.reset;
    
    return result;
}
class Spinner {
    constructor(data = {}) {
        this.frames = data.frames;
        this.current = data.current;
        this.interval = data.interval;
        this.message = data.message;
        this.running = data.running;
    }
}

function Spinner_new(message) {
    let spinner = new Spinner({ frames: [], current: 0, interval: 0, message: message, running: false });
    
        spinner.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    
    return spinner;
}
function Spinner_start(self) {
    
        if (self.running) return;
        self.running = true;
        
        self.interval = setInterval(() => {
            process.stdout.write('\r' + CLI_COLORS.cyan + 
                self.frames[self.current] + CLI_COLORS.reset + 
                ' ' + self.message);
            self.current = (self.current + 1) % self.frames.length;
        }, 80);
    
}
function Spinner_stop(self, success) {
    
        if (!self.running) return;
        
        clearInterval(self.interval);
        self.running = false;
        
        const icon = success 
            ? CLI_COLORS.green + '✓' + CLI_COLORS.reset 
            : CLI_COLORS.red + '✗' + CLI_COLORS.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
    
}
function CLI_progress_bar(current, total, width) {
    let result = "";
    
        const percent = Math.floor((current / total) * 100);
        const filled = Math.floor((current / total) * width);
        const empty = width - filled;
        
        const bar = CLI_COLORS.green + '█'.repeat(filled) + 
                    CLI_COLORS.dim + '░'.repeat(empty) + CLI_COLORS.reset;
        
        result = bar + ' ' + percent + '%';
    
    return result;
}
class ArgParser {
    constructor(data = {}) {
        this.args = data.args;
        this.flags = data.flags;
        this.commands = data.commands;
        this.positional = data.positional;
    }
}

function ArgParser_new() {
    let parser = new ArgParser({ args: [], flags: null });
    // Unknown stmt kind: 0
    commands;
    // Unknown stmt kind: 0
    [];
    // Unknown stmt kind: 0
    positional;
    // Unknown stmt kind: 0
    [];
}

        parser.args = process.argv.slice(2);
        
        for (let i = 0; i < parser.args.length; i++) {
            const arg = parser.args[i];
            
            if (arg.startsWith('--')) {
                // Long flag: --name value or --flag
                const key = arg.substring(2);
                if (i + 1 < parser.args.length && !parser.args[i + 1].startsWith('-')) {
                    parser.flags[key] = parser.args[++i];
                } else {
                    parser.flags[key] = true;
                }
            } else if (arg.startsWith('-') && arg.length === 2) {
                // Short flag: -n value or -f
                const key = arg.substring(1);
                if (i + 1 < parser.args.length && !parser.args[i + 1].startsWith('-')) {
                    parser.flags[key] = parser.args[++i];
                } else {
                    parser.flags[key] = true;
                }
            } else {
                // Positional argument or command
                if (parser.commands.length === 0 && !arg.includes('.')) {
                    parser.commands.push(arg);
                } else {
                    parser.positional.push(arg);
                }
            }
        }
    
return parser;
// Unknown stmt kind: undefined
function ArgParser_has_flag(self, name) {
    let result = false;
    
        result = self.flags.hasOwnProperty(name) && self.flags[name] !== false;
    
    return result;
}
function ArgParser_get_flag(self, name, default_val) {
    let result = default_val;
    
        if (self.flags.hasOwnProperty(name) && typeof self.flags[name] === 'string') {
            result = self.flags[name];
        }
    
    return result;
}
function ArgParser_get_command(self) {
    let result = "";
    
        result = self.commands[0] || '';
    
    return result;
}
function ArgParser_get_positional(self, index) {
    let result = "";
    
        result = self.positional[index] || '';
    
    return result;
}
function CLI_table(headers, rows) {
    
        if (!headers || headers.length === 0) return;
        
        // Calculate column widths
        const widths = headers.map((h, i) => {
            const colValues = [h, ...rows.map(r => String(r[i] || ''))];
            return Math.max(...colValues.map(v => v.length));
        });
        
        // Print header
        const headerRow = headers.map((h, i) => h.padEnd(widths[i])).join(' │ ');
        console.log(CLI_COLORS.bold + headerRow + CLI_COLORS.reset);
        
        // Print separator
        const separator = widths.map(w => '─'.repeat(w)).join('─┼─');
        console.log(separator);
        
        // Print rows
        for (const row of rows) {
            const rowStr = row.map((cell, i) => String(cell || '').padEnd(widths[i])).join(' │ ');
            console.log(rowStr);
        }
    
}
function CLI_banner() {
    
        console.log('');
        console.log(CLI_COLORS.cyan + CLI_COLORS.bold + 
            '   ____  __  __ _   _ ___ ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 
            '  / __ \\|  \\/  | \\ | |_ _|' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 
            ' | |  | | |\\/| |  \\| || | ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 
            ' | |__| | |  | | |\\  || | ' + CLI_COLORS.reset);
        console.log(CLI_COLORS.cyan + 
            '  \\____/|_|  |_|_| \\_|___|' + CLI_COLORS.reset);
        console.log('');
        console.log(CLI_COLORS.dim + 
            '  Hybrid Metamorphosis Compiler' + CLI_COLORS.reset);
        console.log('');
    
}
function CLI_version() {
    return "0.6.0";
}
