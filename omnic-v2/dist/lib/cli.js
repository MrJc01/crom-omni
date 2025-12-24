BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 64 (if)
BlockLoop: 43 ())
BlockLoop: 44 ({)
BlockLoop: 10 (CLI_COLORS_CACHE)
BlockLoop: 42 (()
BlockLoop: 10 (CLI_COLORS_INIT)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
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
    const c = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
    
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
const CLI_COLORS_INIT = false;
const CLI_COLORS_CACHE = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });
function CLI_COLORS() {
    if (CLI_COLORS_INIT) {
    false;
}
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
    CLI_COLORS_CACHE = Colors_new;
    // Unknown stmt kind: 0
    CLI_COLORS_INIT = true;
}
return CLI_COLORS_CACHE;
// Unknown stmt kind: undefined
function CLI_success(msg) {
    
        const c = CLI_COLORS();
        console.log(c.green + 'âœ“' + c.reset + ' ' + msg);
    
}
function CLI_error(msg) {
    
        const c = CLI_COLORS();
        console.error(c.red + 'âœ—' + c.reset + ' ' + msg);
    
}
function CLI_warning(msg) {
    
        const c = CLI_COLORS();
        console.log(c.yellow + 'âš ' + c.reset + ' ' + msg);
    
}
function CLI_info(msg) {
    
        const c = CLI_COLORS();
        console.log(c.blue + 'â„¹' + c.reset + ' ' + msg);
    
}
function CLI_step(step, total, msg) {
    
        const c = CLI_COLORS();
        const prefix = c.cyan + '[' + step + '/' + total + ']' + c.reset;
        console.log(prefix + ' ' + msg);
    
}
function CLI_header(title) {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + c.cyan + 'â•â•â• ' + title + ' â•â•â•' + c.reset);
        console.log('');
    
}
function CLI_dim(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.dim + msg + c.reset;
    
    return result;
}
function CLI_bold(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.bold + msg + c.reset;
    
    return result;
}
function CLI_green(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.green + msg + c.reset;
    
    return result;
}
function CLI_red(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.red + msg + c.reset;
    
    return result;
}
function CLI_yellow(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.yellow + msg + c.reset;
    
    return result;
}
function CLI_cyan(msg) {
    const result = "";
    
        const c = CLI_COLORS();
        result = c.cyan + msg + c.reset;
    
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
    const spinner = new Spinner({ frames: "â ‹â ™â ¹â ¸â ¼â ´â ¦â §â ‡â ", current: 0, interval: 0, message: message, running: false });
    return spinner;
}
function Spinner_start(self) {
    
        if (self.running) return;
        self.running = true;
        const frames = self.frames.split('');
        const c = CLI_COLORS();
        
        self.interval = setInterval(() => {
            process.stdout.write('\r' + c.cyan + 
                frames[self.current % frames.length] + c.reset + 
                ' ' + self.message);
            self.current = (self.current + 1) % frames.length;
        }, 80);
    
}
function Spinner_stop(self, success) {
    
        if (!self.running) return;
        
        clearInterval(self.interval);
        self.running = false;
        const c = CLI_COLORS();
        
        const icon = success 
            ? c.green + 'âœ“' + c.reset 
            : c.red + 'âœ—' + c.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
    
}
function CLI_progress_bar(current, total, width) {
    const result = "";
    
        const c = CLI_COLORS();
        const percent = Math.floor((current / total) * 100);
        const filled = Math.floor((current / total) * width);
        const empty = width - filled;
        
        const bar = c.green + 'â–ˆ'.repeat(filled) + 
                    c.dim + 'â–‘'.repeat(empty) + c.reset;
        
        result = bar + ' ' + percent + '%';
    
    return result;
}
class ParsedArgs {
    constructor(data = {}) {
        this.command = data.command;
        this.arg1 = data.arg1;
        this.arg2 = data.arg2;
        this.arg3 = data.arg3;
        this.flag_help = data.flag_help;
        this.flag_version = data.flag_version;
        this.flag_verbose = data.flag_verbose;
        this.flag_global = data.flag_global;
        this.flag_app = data.flag_app;
        this.flag_tui = data.flag_tui;
        this.opt_target = data.opt_target;
        this.opt_port = data.opt_port;
        this.opt_framework = data.opt_framework;
    }
}
function ParsedArgs_new() {
    const args = new ParsedArgs({ command: "", arg1: "", arg2: "", arg3: "", flag_help: false, flag_version: false, flag_verbose: false, flag_global: false, flag_app: false, flag_tui: false, opt_target: "js", opt_port: "3000", opt_framework: "" });
    
        const argv = process.argv.slice(2);
        
        let positional = [];
        for (let i = 0; i < argv.length; i++) {
            const arg = argv[i];
            
            if (arg === '--help' || arg === '-h') {
                args.flag_help = true;
            } else if (arg === '--version' || arg === '-v') {
                args.flag_version = true;
            } else if (arg === '--verbose' || arg === '-V') {
                args.flag_verbose = true;
            } else if (arg === '--global' || arg === '-g') {
                args.flag_global = true;
            } else if (arg === '--app') {
                args.flag_app = true;
            } else if (arg === '--tui') {
                args.flag_tui = true;
            } else if (arg === '--target' && argv[i + 1]) {
                args.opt_target = argv[++i];
            } else if (arg === '--port' && argv[i + 1]) {
                args.opt_port = argv[++i];
            } else if (arg === '--framework' && argv[i + 1]) {
                args.opt_framework = argv[++i];
            } else if (!arg.startsWith('-')) {
                positional.push(arg);
            }
        }
        
        args.command = positional[0] || '';
        args.arg1 = positional[1] || '';
        args.arg2 = positional[2] || '';
        args.arg3 = positional[3] || '';
    
    return args;
}
function CLI_table_simple(col1, col2) {
    
        const c = CLI_COLORS();
        console.log('  ' + c.cyan + col1.padEnd(20) + c.reset + col2);
    
}
function CLI_table_header(title) {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + title + c.reset);
        console.log('â”€'.repeat(50));
    
}
function CLI_banner() {
    
        const c = CLI_COLORS();
        console.log('');
        console.log(c.cyan + c.bold + 
            '   ____  __  __ _   _ ___ ' + c.reset);
        console.log(c.cyan + 
            '  / __ \\|  \\/  | \\ | |_ _|' + c.reset);
        console.log(c.cyan + 
            ' | |  | | |\\/| |  \\| || | ' + c.reset);
        console.log(c.cyan + 
            ' | |__| | |  | | |\\  || | ' + c.reset);
        console.log(c.cyan + 
            '  \\____/|_|  |_|_| \\_|___|' + c.reset);
        console.log('');
        console.log(c.dim + 
            '  Hybrid Metamorphosis Compiler' + c.reset);
        console.log('');
    
}
function CLI_version() {
    return "1.2.0";
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.Colors_new = Colors_new;
    exports.CLI_COLORS = CLI_COLORS;
    exports.CLI_success = CLI_success;
    exports.CLI_error = CLI_error;
    exports.CLI_warning = CLI_warning;
    exports.CLI_info = CLI_info;
    exports.CLI_step = CLI_step;
    exports.CLI_header = CLI_header;
    exports.CLI_dim = CLI_dim;
    exports.CLI_bold = CLI_bold;
    exports.CLI_green = CLI_green;
    exports.CLI_red = CLI_red;
    exports.CLI_yellow = CLI_yellow;
    exports.CLI_cyan = CLI_cyan;
    exports.Spinner_new = Spinner_new;
    exports.Spinner_start = Spinner_start;
    exports.Spinner_stop = Spinner_stop;
    exports.CLI_progress_bar = CLI_progress_bar;
    exports.ParsedArgs_new = ParsedArgs_new;
    exports.CLI_table_simple = CLI_table_simple;
    exports.CLI_table_header = CLI_table_header;
    exports.CLI_banner = CLI_banner;
    exports.CLI_version = CLI_version;
    exports.Colors = Colors;
    exports.Spinner = Spinner;
    exports.ParsedArgs = ParsedArgs;
    exports.CLI_COLORS_INIT = CLI_COLORS_INIT;
    exports.CLI_COLORS_CACHE = CLI_COLORS_CACHE;
}
