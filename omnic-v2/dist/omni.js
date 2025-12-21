// OMNI v1.2.0 - Unified Bundle
'use strict';


// === lib\cli ===
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

let CLI_COLORS_INIT = false;

let CLI_COLORS_CACHE = new Colors({ reset: "", bold: "", dim: "", underline: "", black: "", red: "", green: "", yellow: "", blue: "", magenta: "", cyan: "", white: "", bg_black: "", bg_red: "", bg_green: "", bg_yellow: "", bg_blue: "", bg_magenta: "", bg_cyan: "", bg_white: "" });

function CLI_COLORS() {
    if ((CLI_COLORS_INIT === false)) {
    CLI_COLORS_CACHE = Colors_new();
    CLI_COLORS_INIT = true;
}

    return CLI_COLORS_CACHE;
}

function CLI_success(msg) {
const c = CLI_COLORS();
        console.log(c.green + 'â”œÃ³â”¼Ã´Ã”Ã‡Â£' + c.reset + ' ' + msg);
}

function CLI_error(msg) {
const c = CLI_COLORS();
        console.error(c.red + 'â”œÃ³â”¼Ã´Ã”Ã‡Ã¶' + c.reset + ' ' + msg);
}

function CLI_warning(msg) {
const c = CLI_COLORS();
        console.log(c.yellow + 'â”œÃ³â”¼Ã­â”¬Ã¡' + c.reset + ' ' + msg);
}

function CLI_info(msg) {
const c = CLI_COLORS();
        console.log(c.blue + 'â”œÃ³Ã”Ã‡Ã—â”¬â•£' + c.reset + ' ' + msg);
}

function CLI_step(step, total, msg) {
const c = CLI_COLORS();
        const prefix = c.cyan + '[' + step + '/' + total + ']' + c.reset;
        console.log(prefix + ' ' + msg);
}

function CLI_header(title) {
const c = CLI_COLORS();
        console.log('');
        console.log(c.bold + c.cyan + 'â”œÃ³Ã”Ã‡Ã³â”¬Ã‰â”œÃ³Ã”Ã‡Ã³â”¬Ã‰â”œÃ³Ã”Ã‡Ã³â”¬Ã‰ ' + title + ' â”œÃ³Ã”Ã‡Ã³â”¬Ã‰â”œÃ³Ã”Ã‡Ã³â”¬Ã‰â”œÃ³Ã”Ã‡Ã³â”¬Ã‰' + c.reset);
        console.log('');
}

function CLI_dim(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.dim + msg + c.reset;
    return result;
}

function CLI_bold(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.bold + msg + c.reset;
    return result;
}

function CLI_green(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.green + msg + c.reset;
    return result;
}

function CLI_red(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.red + msg + c.reset;
    return result;
}

function CLI_yellow(msg) {
    let result = "";
const c = CLI_COLORS();
        result = c.yellow + msg + c.reset;
    return result;
}

function CLI_cyan(msg) {
    let result = "";
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
    let spinner = new Spinner({ frames: "â”œÃ³â”¬Ã¡Ã”Ã‡â•£â”œÃ³â”¬Ã¡Ã”Ã¤Ã³â”œÃ³â”¬Ã¡â”¬â•£â”œÃ³â”¬Ã¡â”¬Â©â”œÃ³â”¬Ã¡â”¬â•â”œÃ³â”¬Ã¡â”¬â”¤â”œÃ³â”¬Ã¡â”¬Âªâ”œÃ³â”¬Ã¡â”¬Âºâ”œÃ³â”¬Ã¡Ã”Ã‡Ã­â”œÃ³â”¬Ã¡â”¬Ã…", current: 0, interval: 0, message: message, running: false });
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
            ? c.green + 'â”œÃ³â”¼Ã´Ã”Ã‡Â£' + c.reset 
            : c.red + 'â”œÃ³â”¼Ã´Ã”Ã‡Ã¶' + c.reset;
        
        process.stdout.write('\r' + icon + ' ' + self.message + '\n');
}

function CLI_progress_bar(current, total, width) {
    let result = "";
const c = CLI_COLORS();
        const percent = Math.floor((current / total) * 100);
        const filled = Math.floor((current / total) * width);
        const empty = width - filled;
        
        const bar = c.green + 'â”œÃ³Ã”Ã‡Ã´â•¦Ã¥'.repeat(filled) + 
                    c.dim + 'â”œÃ³Ã”Ã‡Ã´Ã”Ã‡Ã¿'.repeat(empty) + c.reset;
        
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
    let args = new ParsedArgs({ command: "", arg1: "", arg2: "", arg3: "", flag_help: false, flag_version: false, flag_verbose: false, flag_global: false, flag_app: false, flag_tui: false, opt_target: "js", opt_port: "3000", opt_framework: "" });
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
        console.log('â”œÃ³Ã”Ã‡Ã˜Ã”Ã©Â¼'.repeat(50));
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



// === lib\std ===
function print(msg) {
console.log(msg);

}

function read_file(path) {
    let content = "";
const fs = require("fs");
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Error reading file " + path + ": " + e.message);
            process.exit(1);
        }

    return content;
}

function write_file(path, content) {
const fs = require("fs");
        try {
            fs.writeFileSync(path, content);
        } catch (e) {
            console.error("Error writing file " + path + ": " + e.message);
            process.exit(1);
        }

}



// === core\token ===
let TOKEN_EOF = 0;

let TOKEN_ILLEGAL = 1;

let TOKEN_IDENTIFIER = 10;

let TOKEN_INT = 11;

let TOKEN_STRING = 12;

let TOKEN_ASSIGN = 20;

let TOKEN_PLUS = 21;

let TOKEN_MINUS = 22;

let TOKEN_BANG = 23;

let TOKEN_ASTERISK = 24;

let TOKEN_SLASH = 25;

let TOKEN_LT = 26;

let TOKEN_GT = 27;

let TOKEN_EQ = 28;

let TOKEN_NOT_EQ = 29;

let TOKEN_COLON = 30;

let TOKEN_DOT = 31;

let TOKEN_AND = 32;

let TOKEN_OR = 33;

let TOKEN_LE = 34;

let TOKEN_GE = 35;

let TOKEN_COMMA = 40;

let TOKEN_SEMICOLON = 41;

let TOKEN_LPAREN = 42;

let TOKEN_RPAREN = 43;

let TOKEN_LBRACE = 44;

let TOKEN_RBRACE = 45;

let TOKEN_LBRACKET = 46;

let TOKEN_RBRACKET = 47;

let TOKEN_FN = 60;

let TOKEN_LET = 61;

let TOKEN_TRUE = 62;

let TOKEN_FALSE = 63;

let TOKEN_IF = 64;

let TOKEN_ELSE = 65;

let TOKEN_RETURN = 66;

let TOKEN_WHILE = 67;

let TOKEN_STRUCT = 70;

let TOKEN_NATIVE = 80;

let TOKEN_IMPORT = 90;

let TOKEN_PACKAGE = 91;

let TOKEN_EXPORT = 92;

class Token {
    constructor(data = {}) {
        this.kind = data.kind;
        this.lexeme = data.lexeme;
        this.line = data.line;
        this.start = data.start;
        this.end = data.end;
    }
}

function new_token(kind, lexeme, line) {
    return new Token({ kind: kind, lexeme: lexeme, line: line, start: 0, end: 0 });
}



// === core\lexer ===
function char_at(s, i) {
if (i >= s.length) return "\0";
        return s.charAt(i);
}

function is_letter(ch) {
return /[a-zA-Z_]/.test(ch);
}

function is_digit(ch) {
return /\d/.test(ch);
}

function is_quote(ch) {
return ch === String.fromCharCode(34);
}

class Lexer {
    constructor(data = {}) {
        this.input = data.input;
        this.position = data.position;
        this.read_position = data.read_position;
        this.ch = data.ch;
        this.line = data.line;
    }
}

function new_lexer(input) {
    let l = new Lexer({ input: input, position: 0, read_position: 0, ch: "\0", line: 1 });
    Lexer_read_char(l);
    return l;
}

function Lexer_read_char(l) {
    if ((l.read_position >= 999999)) {
    l.ch = "\0";
}
 else {
    l.ch = char_at(l.input, l.read_position);
}

    let is_eof = false;
is_eof = l.ch === "\0";
    if (is_eof) {
    l.ch = "\0";
}
 else {
    l.position = l.read_position;
    l.read_position = (l.read_position + 1);
}

}

function Lexer_skip_whitespace(l) {
    let is_ws = false;
is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
    while (is_ws) {
    if ((l.ch === "\n")) {
    l.line = (l.line + 1);
}

    Lexer_read_char(l);
is_ws = l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r';
}

}

function Lexer_read_identifier(l) {
    let start_pos = l.position;
    while ((is_letter(l.ch) || is_digit(l.ch))) {
    Lexer_read_char(l);
}

    let ident = "";
ident = l.input.substring(Number(start_pos), Number(l.position));
    return ident;
}

function Lexer_read_number(l) {
    let start_pos = l.position;
    while (is_digit(l.ch)) {
    Lexer_read_char(l);
}

    let num_str = "";
num_str = l.input.substring(Number(start_pos), Number(l.position));
    return num_str;
}

function Lexer_lookup_ident(ident) {
    if ((ident === "fn")) {
    return TOKEN_FN;
}

    if ((ident === "let")) {
    return TOKEN_LET;
}

    if ((ident === "struct")) {
    return TOKEN_STRUCT;
}

    if ((ident === "if")) {
    return TOKEN_IF;
}

    if ((ident === "else")) {
    return TOKEN_ELSE;
}

    if ((ident === "return")) {
    return TOKEN_RETURN;
}

    if ((ident === "true")) {
    return TOKEN_TRUE;
}

    if ((ident === "false")) {
    return TOKEN_FALSE;
}

    if ((ident === "native")) {
    return TOKEN_NATIVE;
}

    if ((ident === "import")) {
    return 90;
}

    if ((ident === "package")) {
    return 91;
}

    if ((ident === "export")) {
    return 92;
}

    if ((ident === "while")) {
    return TOKEN_WHILE;
}

    return TOKEN_IDENTIFIER;
}

function Lexer_next_token(l) {
    Lexer_skip_whitespace(l);
    if ((l.ch === "/")) {
    let peek = char_at(l.input, l.read_position);
    if ((peek === "/")) {
    while ((((l.ch !== "\n") && l.ch) !== "\0")) {
    Lexer_read_char(l);
}

    Lexer_skip_whitespace(l);
}

}

    let tok = new_token(TOKEN_ILLEGAL, l.ch, l.line);
    tok.start = l.position;
    if ((l.ch === "\0")) {
    tok.kind = TOKEN_EOF;
    tok.lexeme = "";
    return tok;
}

    if ((l.ch === "=")) {
    let peek_eq = char_at(l.input, l.read_position);
    if ((peek_eq === "=")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_EQ;
    tok.lexeme = "==";
}
 else {
    tok.kind = TOKEN_ASSIGN;
    tok.lexeme = "=";
}

}
 else {
    if ((l.ch === "!")) {
    let peek_bang = char_at(l.input, l.read_position);
    if ((peek_bang === "=")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_NOT_EQ;
    tok.lexeme = "!=";
}
 else {
    tok.kind = TOKEN_BANG;
    tok.lexeme = "!";
}

}
 else {
    if ((l.ch === ";")) {
    tok.kind = TOKEN_SEMICOLON;
    tok.lexeme = ";";
}
 else {
    if ((l.ch === "(")) {
    tok.kind = TOKEN_LPAREN;
    tok.lexeme = "(";
}
 else {
    if ((l.ch === ")")) {
    tok.kind = TOKEN_RPAREN;
    tok.lexeme = ")";
}
 else {
    if ((l.ch === "{")) {
    tok.kind = TOKEN_LBRACE;
    tok.lexeme = "{";
}
 else {
    if ((l.ch === "}")) {
    tok.kind = TOKEN_RBRACE;
    tok.lexeme = "}";
}
 else {
    if ((l.ch === ",")) {
    tok.kind = TOKEN_COMMA;
    tok.lexeme = ",";
}
 else {
    if ((l.ch === ":")) {
    tok.kind = 30;
    tok.lexeme = ":";
}
 else {
    if ((l.ch === ".")) {
    tok.kind = 31;
    tok.lexeme = ".";
}
 else {
    if ((l.ch === "[")) {
    tok.kind = TOKEN_LBRACKET;
    tok.lexeme = "[";
}
 else {
    if ((l.ch === "]")) {
    tok.kind = TOKEN_RBRACKET;
    tok.lexeme = "]";
}
 else {
    if ((l.ch === "+")) {
    tok.kind = TOKEN_PLUS;
    tok.lexeme = "+";
}
 else {
    if ((l.ch === "/")) {
    let peek_slash = char_at(l.input, l.read_position);
    if ((peek_slash === "/")) {
    Lexer_read_char(l);
    Lexer_read_char(l);
    while ((((l.ch !== "\n") && l.ch) !== "\0")) {
    Lexer_read_char(l);
}

    return Lexer_next_token(l);
}
 else {
    tok.kind = TOKEN_SLASH;
    tok.lexeme = "/";
}

}
 else {
    if (is_quote(l.ch)) {
    let str_val = "";
    Lexer_read_char(l);
    let start = l.position;
    while ((is_quote(l.ch) === false)) {
    Lexer_read_char(l);
}

    let end = l.position;
str_val = l.input.substring(Number(start), Number(end));
    tok.kind = TOKEN_STRING;
    tok.lexeme = str_val;
}
 else {
    if ((l.ch === "&")) {
    let peek_and = char_at(l.input, l.read_position);
    if ((peek_and === "&")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_AND;
    tok.lexeme = "&&";
}
 else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "&";
}

}
 else {
    if ((l.ch === "|")) {
    let peek_or = char_at(l.input, l.read_position);
    if ((peek_or === "|")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_OR;
    tok.lexeme = "||";
}
 else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = "|";
}

}
 else {
    if ((l.ch === "<")) {
    let peek_lt = char_at(l.input, l.read_position);
    if ((peek_lt === "=")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_LE;
    tok.lexeme = "<=";
}
 else {
    tok.kind = TOKEN_LT;
    tok.lexeme = "<";
}

}
 else {
    if ((l.ch === ">")) {
    let peek_gt = char_at(l.input, l.read_position);
    if ((peek_gt === "=")) {
    Lexer_read_char(l);
    tok.kind = TOKEN_GE;
    tok.lexeme = ">=";
}
 else {
    tok.kind = TOKEN_GT;
    tok.lexeme = ">";
}

}
 else {
    if (is_letter(l.ch)) {
    let literal = Lexer_read_identifier(l);
    tok.kind = Lexer_lookup_ident(literal);
    tok.lexeme = literal;
    return tok;
}
 else {
    if (is_digit(l.ch)) {
    tok.kind = TOKEN_INT;
    tok.lexeme = Lexer_read_number(l);
    return tok;
}
 else {
    tok.kind = TOKEN_ILLEGAL;
    tok.lexeme = l.ch;
}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

}

    Lexer_read_char(l);
    return tok;
}



// === core\parser ===
class Parser {
    constructor(data = {}) {
        this.lexer = data.lexer;
        this.cur_token = data.cur_token;
        this.peek_token = data.peek_token;
    }
}

function new_parser(l) {
    let p = new Parser({ lexer: l, cur_token: new_token(0, "", 0), peek_token: new_token(0, "", 0) });
    Parser_next_token(p);
    Parser_next_token(p);
    return p;
}

function Parser_next_token(p) {
    p.cur_token = p.peek_token;
    p.peek_token = Lexer_next_token(p.lexer);
}

function Parser_parse_program(p) {
    let stmts = [];
    while ((p.cur_token.kind !== TOKEN_EOF)) {
    let stmt = Parser_parse_statement(p);
    if ((stmt !== 0)) {
    if ((stmt.kind !== 0)) {
stmts.push(stmt);
}

}

}

    return new Program({ statements: stmts });
}

function Parser_parse_statement(p) {
    if ((p.cur_token.kind === 92)) {
    Parser_next_token(p);
    let stmt = Parser_parse_statement(p);
if (stmt) stmt.is_exported = true;
    return stmt;
}

    if ((p.cur_token.kind === 91)) {
    return Parser_parse_package(p);
}

    if ((p.cur_token.kind === 90)) {
    return Parser_parse_import(p);
}

    if ((p.cur_token.kind === TOKEN_RBRACE)) {
    Parser_next_token(p);
    return 0;
}

    if ((p.cur_token.kind === TOKEN_IF)) {
    return Parser_parse_if(p);
}

    if ((p.cur_token.kind === TOKEN_WHILE)) {
    return Parser_parse_while(p);
}

    if ((p.cur_token.kind === TOKEN_LET)) {
    return Parser_parse_let(p);
}

    if ((p.cur_token.kind === TOKEN_FN)) {
    return Parser_parse_fn(p);
}

    if ((p.cur_token.kind === TOKEN_STRUCT)) {
    return Parser_parse_struct(p);
}

    if ((p.cur_token.kind === TOKEN_RETURN)) {
    return Parser_parse_return(p);
}

    if ((p.cur_token.kind === TOKEN_NATIVE)) {
    return Parser_parse_native_block(p);
}

    return Parser_parse_expr_stmt(p);
}

function Parser_parse_import(p) {
    Parser_next_token(p);
    let path = p.cur_token.lexeme;
    Parser_next_token(p);
    if ((p.cur_token.kind === TOKEN_SEMICOLON)) {
    Parser_next_token(p);
}

    return new ImportDecl({ kind: NODE_IMPORT, path: path });
}

function Parser_parse_package(p) {
    Parser_next_token(p);
    while ((((p.cur_token.kind !== TOKEN_SEMICOLON) && p.cur_token.kind) !== TOKEN_EOF)) {
    Parser_next_token(p);
}

    if ((p.cur_token.kind === TOKEN_SEMICOLON)) {
    Parser_next_token(p);
}

    return 0;
}

function Parser_parse_let(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if ((p.cur_token.kind === 30)) {
    Parser_next_token(p);
    Parser_next_token(p);
}

    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if ((p.cur_token.kind === TOKEN_SEMICOLON)) {
    Parser_next_token(p);
}

    return new LetStmt({ kind: NODE_LET, name: name, value: val, is_exported: false });
}

function Parser_parse_return(p) {
    Parser_next_token(p);
    let val = Parser_parse_expression(p);
    if ((p.cur_token.kind === TOKEN_SEMICOLON)) {
    Parser_next_token(p);
}

    return new ReturnStmt({ kind: NODE_RETURN, value: val });
}

function Parser_parse_fn(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let params = [];
    while ((p.cur_token.kind !== TOKEN_RPAREN)) {
params.push(p.cur_token.lexeme);
    Parser_next_token(p);
    if ((p.cur_token.kind === 30)) {
    Parser_next_token(p);
    Parser_next_token(p);
}

    if ((p.cur_token.kind === TOKEN_COMMA)) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    if ((p.cur_token.lexeme === "-")) {
    Parser_next_token(p);
    Parser_next_token(p);
    Parser_next_token(p);
}

    let body = Parser_parse_block(p);
    return new FunctionDecl({ kind: NODE_FUNCTION, name: name, params: params, body: body, is_exported: false });
}

function Parser_parse_struct(p) {
    Parser_next_token(p);
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let fields = [];
    while ((((p.cur_token.kind !== TOKEN_RBRACE) && p.cur_token.kind) !== TOKEN_EOF)) {
    if ((p.cur_token.kind === TOKEN_RBRACE)) {
    break;
}

    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_type = p.cur_token.lexeme;
    Parser_next_token(p);
    let f = new_struct_field(field_name, field_type);
fields.push(f);
    if ((p.cur_token.kind === TOKEN_COMMA)) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    return new StructDecl({ kind: NODE_STRUCT, name: name, fields: fields, is_exported: false });
}

function Parser_parse_native_block(p) {
    Parser_next_token(p);
    let lang = "js";
    if ((p.cur_token.kind === TOKEN_STRING)) {
    lang = p.cur_token.lexeme;
    Parser_next_token(p);
}

    if ((p.cur_token.kind !== TOKEN_LBRACE)) {
    return new NativeStmt({ kind: 0, lang: "", code: "" });
}

    let start_pos = p.cur_token.start;
    let code = "";
    let end_pos = 0;
const input = p.lexer.input;
        let pos = Number(start_pos) + 1;
        let brace_count = 1;
        let start_extract = pos;
        
        while (pos < input.length && brace_count > 0) {
            const char = input[pos];
            if (char === '{') brace_count++;
            if (char === '}') brace_count--;
            pos++;
        }
        
        end_pos = pos;
        if (brace_count == 0) {
            code = input.substring(start_extract, pos - 1);
        }
        p.lexer.read_position = end_pos;
        Lexer_read_char(p.lexer);
        p.cur_token = Lexer_next_token(p.lexer);
        p.peek_token = Lexer_next_token(p.lexer);
    return new NativeStmt({ kind: NODE_NATIVE, lang: lang, code: code });
}

function Parser_parse_block(p) {
    let stmts = [];
    if ((p.cur_token.kind === TOKEN_LBRACE)) {
    Parser_next_token(p);
    while ((((p.cur_token.kind !== TOKEN_RBRACE) && p.cur_token.kind) !== TOKEN_EOF)) {
console.log("BlockLoop: " + p.cur_token.kind + " (" + p.cur_token.lexeme + ")");
    let stmt = Parser_parse_statement(p);
stmts.push(stmt);
}

    Parser_next_token(p);
}
 else {
    let stmt = Parser_parse_statement(p);
stmts.push(stmt);
}

    return new Block({ kind: NODE_BLOCK, statements: stmts });
}

function Parser_parse_expr_stmt(p) {
    let expr = Parser_parse_expression(p);
    if ((p.cur_token.kind === TOKEN_SEMICOLON)) {
    Parser_next_token(p);
}

    return new ExpressionStmt({ kind: 0, expr: expr });
}

function Parser_parse_expression(p) {
    return Parser_parse_assignment(p);
}

function Parser_parse_assignment(p) {
    let left = Parser_parse_logic(p);
    if ((p.cur_token.kind === TOKEN_ASSIGN)) {
    Parser_next_token(p);
    let right = Parser_parse_assignment(p);
    return new AssignmentExpr({ kind: NODE_ASSIGNMENT, left: left, right: right });
}

    return left;
}

function Parser_parse_equality(p) {
    let left = Parser_parse_relational(p);
    while (true) {
    let k = p.cur_token.kind;
    if ((((k !== TOKEN_EQ) && k) !== TOKEN_NOT_EQ)) {
    break;
}

    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_relational(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}

    return left;
}

function Parser_parse_relational(p) {
    let left = Parser_parse_term(p);
    while (true) {
    let k = p.cur_token.kind;
    if ((((((((k !== TOKEN_LT) && k) !== TOKEN_GT) && k) !== TOKEN_LE) && k) !== TOKEN_GE)) {
    break;
}

    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_term(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}

    return left;
}

function Parser_parse_logic(p) {
    let left = Parser_parse_equality(p);
    while (true) {
    let k = p.cur_token.kind;
    if ((((k !== TOKEN_AND) && k) !== TOKEN_OR)) {
    break;
}

    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_equality(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}

    return left;
}

function Parser_parse_term(p) {
    let left = Parser_parse_multiplication(p);
    while (true) {
    let k = p.cur_token.kind;
    if ((((k !== TOKEN_PLUS) && k) !== TOKEN_MINUS)) {
    break;
}

    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_multiplication(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}

    return left;
}

function Parser_parse_multiplication(p) {
    let left = Parser_parse_factor(p);
    while (true) {
    let k = p.cur_token.kind;
    if ((((k !== TOKEN_ASTERISK) && k) !== TOKEN_SLASH)) {
    break;
}

    let op = p.cur_token.lexeme;
    Parser_next_token(p);
    let right = Parser_parse_factor(p);
    left = new BinaryExpr({ kind: NODE_BINARY, left: left, op: op, right: right });
}

    return left;
}

function Parser_parse_factor(p) {
    let node = 0;
    if ((p.cur_token.kind === TOKEN_INT)) {
    let val = 0;
val = parseInt(p.cur_token.lexeme);
    node = new IntegerLiteral({ kind: NODE_LITERAL, value: val });
    Parser_next_token(p);
}
 else {
    if ((p.cur_token.kind === TOKEN_IDENTIFIER)) {
    let name = p.cur_token.lexeme;
    Parser_next_token(p);
    if ((p.cur_token.kind === TOKEN_LBRACE)) {
    Parser_next_token(p);
    let init_fields = [];
    while ((((p.cur_token.kind !== TOKEN_RBRACE) && p.cur_token.kind) !== TOKEN_EOF)) {
    let field_name = p.cur_token.lexeme;
    Parser_next_token(p);
    Parser_next_token(p);
    let field_val = Parser_parse_expression(p);
    let field = new StructInitField({ name: field_name, value: field_val });
init_fields.push(field);
    if ((p.cur_token.kind === TOKEN_COMMA)) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    node = new StructInitExpr({ kind: NODE_STRUCT_INIT, name: name, fields: init_fields });
}
 else {
    node = new Identifier({ kind: NODE_IDENTIFIER, value: name });
}

}
 else {
    if ((p.cur_token.kind === TOKEN_LPAREN)) {
    Parser_next_token(p);
    node = Parser_parse_expression(p);
    Parser_next_token(p);
}
 else {
    if ((p.cur_token.kind === TOKEN_STRING)) {
    let str_val = p.cur_token.lexeme;
    node = new StringLiteral({ kind: NODE_STRING, value: str_val });
    Parser_next_token(p);
}
 else {
    if ((p.cur_token.kind === TOKEN_TRUE)) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: true });
    Parser_next_token(p);
}
 else {
    if ((p.cur_token.kind === TOKEN_FALSE)) {
    node = new BoolLiteral({ kind: NODE_BOOL, value: false });
    Parser_next_token(p);
}
 else {
    if ((p.cur_token.kind === TOKEN_LBRACKET)) {
    Parser_next_token(p);
    let elements = [];
    while ((((p.cur_token.kind !== TOKEN_RBRACKET) && p.cur_token.kind) !== TOKEN_EOF)) {
elements.push(Parser_parse_expression(p));
    if ((p.cur_token.kind === TOKEN_COMMA)) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
node = { kind: NODE_ARRAY, elements: elements };
}
 else {
console.error("Unexpected token in expression: Kind " + p.cur_token.kind + ", Lexeme: " + p.cur_token.lexeme);
    Parser_next_token(p);
    return 0;
}

}

}

}

}

}

}

    let continue_loop = true;
    while (continue_loop) {
    if ((p.cur_token.kind === 31)) {
    Parser_next_token(p);
    let prop = p.cur_token.lexeme;
    Parser_next_token(p);
    node = new MemberExpr({ kind: NODE_MEMBER, target: node, property: prop });
}
 else {
    if ((p.cur_token.kind === TOKEN_LPAREN)) {
    Parser_next_token(p);
    let args = [];
    while ((((p.cur_token.kind !== TOKEN_RPAREN) && p.cur_token.kind) !== TOKEN_EOF)) {
args.push(Parser_parse_expression(p));
    if ((p.cur_token.kind === TOKEN_COMMA)) {
    Parser_next_token(p);
}

}

    Parser_next_token(p);
    node = new CallExpr({ kind: NODE_CALL, function: node, args: args });
}
 else {
    continue_loop = false;
}

}

}

    return node;
}

function Parser_parse_if(p) {
    Parser_next_token(p);
    let cond = Parser_parse_expression(p);
    let cons = Parser_parse_block(p);
    let alt = 0;
    if ((p.cur_token.kind === TOKEN_ELSE)) {
    Parser_next_token(p);
    if ((p.cur_token.kind === TOKEN_IF)) {
    let if_stmt = Parser_parse_if(p);
    let stmts = [];
stmts.push(if_stmt);
    alt = new Block({ kind: NODE_BLOCK, statements: stmts });
}
 else {
    alt = Parser_parse_block(p);
}

}

    return new IfStmt({ kind: NODE_IF, condition: cond, consequence: cons, alternative: alt });
}

function Parser_parse_while(p) {
    Parser_next_token(p);
    let cond = Parser_parse_expression(p);
    let body = Parser_parse_block(p);
    return new WhileStmt({ kind: NODE_WHILE, condition: cond, body: body });
}



// === core\ast ===
let NODE_PROGRAM = 1;

let NODE_LET = 2;

let NODE_LITERAL = 3;

let NODE_FUNCTION = 4;

let NODE_BLOCK = 5;

let NODE_CALL = 6;

let NODE_RETURN = 7;

let NODE_BINARY = 8;

let NODE_MEMBER = 9;

let NODE_IMPORT = 10;

let NODE_ARRAY = 11;

let NODE_STRUCT_INIT = 12;

let NODE_IF = 13;

let NODE_WHILE = 14;

let NODE_IDENTIFIER = 15;

let NODE_ASSIGNMENT = 16;

let NODE_STRING = 17;

let NODE_BOOL = 18;

let NODE_STRUCT = 70;

let NODE_NATIVE = 80;

class Program {
    constructor(data = {}) {
        this.statements = data.statements;
    }
}

class AssignmentExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.right = data.right;
    }
}

class NativeStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.lang = data.lang;
        this.code = data.code;
    }
}

class LetStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.value = data.value;
        this.is_exported = data.is_exported;
    }
}

class ImportDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.path = data.path;
    }
}

class ExpressionStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.expr = data.expr;
    }
}

class IntegerLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}

class StringLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}

class BoolLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}

class StructInitExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
    }
}

class StructInitField {
    constructor(data = {}) {
        this.name = data.name;
        this.value = data.value;
    }
}

class BinaryExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.op = data.op;
        this.right = data.right;
    }
}

class MemberExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.target = data.target;
        this.property = data.property;
    }
}

class FunctionDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.params = data.params;
        this.body = data.body;
        this.is_exported = data.is_exported;
    }
}

class Block {
    constructor(data = {}) {
        this.kind = data.kind;
        this.statements = data.statements;
    }
}

class CallExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.function = data.function;
        this.args = data.args;
    }
}

class ReturnStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}

class IfStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.consequence = data.consequence;
        this.alternative = data.alternative;
    }
}

class WhileStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.body = data.body;
    }
}

class StructDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
        this.is_exported = data.is_exported;
    }
}

class StructField {
    constructor(data = {}) {
        this.name = data.name;
        this.typename = data.typename;
    }
}

function new_struct_field(name, typename) {
    return new StructField({ name: name, typename: typename });
}

class Identifier {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}



// === core\codegen_hybrid ===


// === core\vm ===


// === core\framework_adapter ===


// === core\ingestion ===


// === core\package_manager ===


// === core\contracts ===


// === core\ghost_writer ===


// === core\bootstrap ===


// === core\studio_engine ===


// === core\studio_graph ===


// === core\app_packager ===


// === core\tui ===


// === MAIN ===
function get_omni_home() {
    let home = "";
                
        // Priority 1: OMNI_HOME environment variable
        if (process.env.OMNI_HOME) {
            home = process.env.OMNI_HOME;
        }
        // Priority 2: Executable directory
        else if (__dirname) {
            home = path.dirname(__dirname);
        }
        // Priority 3: User's home directory
        else {
            const platform = os.platform();
            if (platform === 'win32') {
                home = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                home = path.join(os.homedir(), '.local', 'share', 'omni');
            }
        }
    return home;
}

function resolve_resource_path(name) {
    let resolved = "";
                
        // Strategy 1: Local project path (./targets/, ./packages/, ./patterns/)
        const localPath = path.join(process.cwd(), name);
        if (fs.existsSync(localPath)) {
            resolved = localPath;
            return;
        }
        
        // Strategy 2: Relative to executable (dist/../)
        const execPath = path.join(__dirname, '..', name);
        if (fs.existsSync(execPath)) {
            resolved = execPath;
            return;
        }
        
        // Strategy 3: OMNI_HOME
        const omniHome = get_omni_home();
        const homePath = path.join(omniHome, name);
        if (fs.existsSync(homePath)) {
            resolved = homePath;
            return;
        }
        
        // Strategy 4: Global installation
                const platform = os.platform();
        let globalPath;
        
        if (platform === 'win32') {
            globalPath = path.join(os.homedir(), 'AppData', 'Local', 'Omni', name);
        } else {
            globalPath = path.join(os.homedir(), '.local', 'share', 'omni', name);
        }
        
        if (fs.existsSync(globalPath)) {
            resolved = globalPath;
            return;
        }
        
        // Not found - return local path for error messages
        resolved = localPath;
    return resolved;
}

function cmd_setup(is_global) {
    CLI_banner();
    CLI_header("Omni Setup");
                        const { execSync } = require('child_process');
        
        const platform = os.platform();
        const isWindows = platform === 'win32';
        const omniDir = path.dirname(path.dirname(__filename));
        
        CLI_info("Platform: " + platform + " (" + os.arch() + ")");
        CLI_info("Omni directory: " + omniDir);
        CLI_info("Mode: " + (is_global ? "GLOBAL" : "LOCAL"));
        
        console.log("");
        
        if (is_global) {
            // ============================================================
            // GLOBAL INSTALLATION
            // ============================================================
            CLI_step(1, 4, "Detecting global installation path...");
            
            let globalDir;
            if (isWindows) {
                // Windows: Use %AppData%\Omni
                globalDir = path.join(os.homedir(), 'AppData', 'Local', 'Omni');
            } else {
                // Unix: Use ~/.local/bin or /usr/local/bin
                globalDir = path.join(os.homedir(), '.local', 'share', 'omni');
            }
            
            CLI_info("Global directory: " + globalDir);
            
            CLI_step(2, 4, "Copying Omni files...");
            
            // Ensure directory exists
            if (!fs.existsSync(globalDir)) {
                fs.mkdirSync(globalDir, { recursive: true });
            }
            
            // Copy dist folder
            const srcDist = path.join(omniDir, 'dist');
            const dstDist = path.join(globalDir, 'dist');
            
            if (fs.existsSync(srcDist)) {
                if (!fs.existsSync(dstDist)) {
                    fs.mkdirSync(dstDist, { recursive: true });
                }
                
                const files = fs.readdirSync(srcDist);
                for (const file of files) {
                    fs.copyFileSync(
                        path.join(srcDist, file),
                        path.join(dstDist, file)
                    );
                }
                CLI_success("Copied " + files.length + " files");
            }
            
            // Copy lib folder
            const srcLib = path.join(omniDir, 'src', 'lib');
            const dstLib = path.join(globalDir, 'lib');
            
            if (fs.existsSync(srcLib)) {
                if (!fs.existsSync(dstLib)) {
                    fs.mkdirSync(dstLib, { recursive: true });
                }
                
                const walkAndCopy = (src, dst) => {
                    const entries = fs.readdirSync(src, { withFileTypes: true });
                    for (const entry of entries) {
                        const srcPath = path.join(src, entry.name);
                        const dstPath = path.join(dst, entry.name);
                        if (entry.isDirectory()) {
                            if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);
                            walkAndCopy(srcPath, dstPath);
                        } else {
                            fs.copyFileSync(srcPath, dstPath);
                        }
                    }
                };
                walkAndCopy(srcLib, dstLib);
                CLI_success("Copied standard library");
            }
            
            CLI_step(3, 4, "Creating executable wrapper...");
            
            if (isWindows) {
                // Windows: Create batch and PowerShell wrappers
                const cmdContent = `@echo off
node "%~dp0dist\\main.js" %*`;
                fs.writeFileSync(path.join(globalDir, 'omni.cmd'), cmdContent);
                
                const ps1Content = `#!/usr/bin/env pwsh
node "$PSScriptRoot\\dist\\main.js" @args`;
                fs.writeFileSync(path.join(globalDir, 'omni.ps1'), ps1Content);
                
                CLI_success("Created omni.cmd and omni.ps1");
            } else {
                // Unix: Create shell script
                const shContent = `#!/usr/bin/env bash
OMNI_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
node "$OMNI_DIR/dist/main.js" "$@"`;
                const shPath = path.join(globalDir, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                
                CLI_success("Created omni executable");
            }
            
            CLI_step(4, 4, "Configuring PATH...");
            
            let binDir;
            if (isWindows) {
                binDir = globalDir;
                
                // Try to add to user PATH
                try {
                    const currentPath = execSync('echo %PATH%', { encoding: 'utf-8' }).trim();
                    if (!currentPath.includes(globalDir)) {
                        console.log("");
                        CLI_warning("Add this directory to your PATH:");
                        console.log(CLI_COLORS.cyan + "  " + globalDir + CLI_COLORS.reset);
                        console.log("");
                        console.log(CLI_COLORS.dim + "  PowerShell (admin):" + CLI_COLORS.reset);
                        console.log(CLI_COLORS.dim + "  [Environment]::SetEnvironmentVariable('Path', $env:Path + ';' + '" + globalDir + "', 'User')" + CLI_COLORS.reset);
                    } else {
                        CLI_success("Already in PATH");
                    }
                } catch (e) {}
            } else {
                binDir = path.join(os.homedir(), '.local', 'bin');
                
                // Create symlink in ~/.local/bin
                if (!fs.existsSync(binDir)) {
                    fs.mkdirSync(binDir, { recursive: true });
                }
                
                const linkPath = path.join(binDir, 'omni');
                try {
                    if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
                    fs.symlinkSync(path.join(globalDir, 'omni'), linkPath);
                    CLI_success("Linked: " + linkPath);
                } catch (e) {
                    CLI_warning("Could not create symlink: " + e.message);
                }
                
                // Check if ~/.local/bin is in PATH
                const shellPath = process.env.PATH || '';
                if (!shellPath.includes(binDir)) {
                    console.log("");
                    CLI_warning("Add to your shell profile (~/.bashrc or ~/.zshrc):");
                    console.log(CLI_COLORS.cyan + '  export PATH="$HOME/.local/bin:$PATH"' + CLI_COLORS.reset);
                }
            }
            
            console.log("");
            CLI_success("Global installation complete!");
            console.log("");
            console.log(CLI_COLORS.green + "  Try: omni --version" + CLI_COLORS.reset);
            
        } else {
            // ============================================================
            // LOCAL INSTALLATION (./omni in current project)
            // ============================================================
            CLI_step(1, 2, "Creating local wrapper...");
            
            const cwd = process.cwd();
            
            if (isWindows) {
                const cmdContent = `@echo off
node "${path.join(omniDir, 'dist', 'main.js')}" %*`;
                fs.writeFileSync(path.join(cwd, 'omni.cmd'), cmdContent);
                CLI_success("Created: omni.cmd");
            } else {
                const shContent = `#!/usr/bin/env bash
node "${path.join(omniDir, 'dist', 'main.js')}" "$@"`;
                const shPath = path.join(cwd, 'omni');
                fs.writeFileSync(shPath, shContent);
                fs.chmodSync(shPath, '755');
                CLI_success("Created: ./omni");
            }
            
            CLI_step(2, 2, "Done!");
            
            console.log("");
            CLI_success("Local installation complete!");
            console.log("");
            if (isWindows) {
                console.log(CLI_COLORS.green + "  Try: .\\omni.cmd --version" + CLI_COLORS.reset);
            } else {
                console.log(CLI_COLORS.green + "  Try: ./omni --version" + CLI_COLORS.reset);
            }
        }
}

function cmd_version() {
    CLI_banner();
    print(("Version: " + CLI_version()));
    print("");
console.log(CLI_COLORS.dim + "Node.js: " + process.version + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Platform: " + process.platform + CLI_COLORS.reset);
        console.log(CLI_COLORS.dim + "Arch: " + process.arch + CLI_COLORS.reset);
}

function cmd_package_self() {
    CLI_header("Self-Package");
                const { execSync } = require('child_process');
        
        const omniDir = path.dirname(path.dirname(__filename));
        const version = CLI_version();
        const platform = process.platform;
        
        CLI_step(1, 4, "Collecting source files...");
        
        // Files to include
        const distDir = path.join(omniDir, 'dist');
        const targetsDir = path.join(omniDir, 'targets');
        
        CLI_step(2, 4, "Creating package manifest...");
        
        const manifest = {
            name: 'omni-compiler',
            version: version,
            platform: platform,
            created: new Date().toISOString(),
            files: []
        };
        
        // List dist files
        if (fs.existsSync(distDir)) {
            const files = fs.readdirSync(distDir, { recursive: true });
            manifest.files.push(...files.map(f => 'dist/' + f));
        }
        
        // List target profiles
        if (fs.existsSync(targetsDir)) {
            const files = fs.readdirSync(targetsDir);
            manifest.files.push(...files.map(f => 'targets/' + f));
        }
        
        CLI_step(3, 4, "Writing package...");
        
        const packageName = `omni-${version}-${platform}`;
        const packageDir = path.join(omniDir, 'packages');
        
        if (!fs.existsSync(packageDir)) {
            fs.mkdirSync(packageDir, { recursive: true });
        }
        
        // Write manifest
        fs.writeFileSync(
            path.join(packageDir, packageName + '.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        CLI_step(4, 4, "Creating executable wrapper...");
        
        // Create .run file (Unix) or .cmd (Windows)
        if (platform === 'win32') {
            const runContent = `@echo off
set OMNI_HOME=%~dp0
node "%OMNI_HOME%dist\\main.js" %*`;
            fs.writeFileSync(path.join(packageDir, packageName + '.cmd'), runContent);
            CLI_success("Package created: packages/" + packageName + ".cmd");
        } else {
            const runContent = `#!/bin/bash
OMNI_HOME="$(dirname "$(readlink -f "$0")")"
node "$OMNI_HOME/dist/main.js" "$@"`;
            const runPath = path.join(packageDir, packageName + '.run');
            fs.writeFileSync(runPath, runContent);
            fs.chmodSync(runPath, '755');
            CLI_success("Package created: packages/" + packageName + ".run");
        }
        
        console.log("");
        CLI_info("Package manifest: packages/" + packageName + ".json");
        CLI_info("Total files: " + manifest.files.length);
}

function main() {
    let args_len = 0;
args_len = process.argv.length;
    let command = "";
command = process.argv[2] || '';
    if ((command === "setup")) {
    cmd_setup();
    return 0;
}

    if (command === "--version" || command === "-v" || command === "version") {
    cmd_version();
    return 0;
}

    if ((command === "package")) {
    let self_package = false;
self_package = process.argv[3] === '--self';
    if (self_package) {
    cmd_package_self();
    return 0;
}

}

    if ((command === "setup")) {
    let is_global = false;
for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--global' || process.argv[i] === '-g') {
                    is_global = true;
                }
            }
    cmd_setup(is_global);
    return 0;
}

    if ((command === "install")) {
    let package_spec = "";
package_spec = process.argv[3] || '';
    cmd_install(package_spec);
    return 0;
}

    if ((command === "uninstall")) {
    let package_name = "";
package_name = process.argv[3] || '';
    if ((package_name === "")) {
    CLI_error("Usage: omni uninstall <package_name>");
    return 1;
}

    cmd_uninstall(package_name);
    return 0;
}

    if ((command === "list")) {
    cmd_list();
    return 0;
}

    if ((command === "update")) {
    let package_name = "";
package_name = process.argv[3] || '';
    cmd_update(package_name);
    return 0;
}

    if ((command === "search")) {
    let query = "";
query = process.argv[3] || '';
    cmd_search(query);
    return 0;
}

    if ((command === "doctor")) {
    cmd_doctor();
    return 0;
}

    if ((command === "contracts")) {
const registry = ContractRegistry_new();
            ContractRegistry_list_interfaces(registry);
    return 0;
}

    if ((command === "graph")) {
    let input_file = "";
    let output_file = "";
input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
    if ((input_file === "")) {
    CLI_error("Usage: omni graph <input.omni> [output.md]");
    CLI_info("Generates architecture diagrams in Mermaid format");
    return 1;
}

    if ((output_file === "")) {
                output_file = path.basename(input_file, '.omni') + '_architecture.md';
}

    cmd_graph(input_file, output_file);
    return 0;
}

    if ((command === "bootstrap")) {
    cmd_bootstrap();
    return 0;
}

    if ((command === "studio")) {
    let port = 3000;
    let open_app = false;
for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--port' && process.argv[i + 1]) {
                    port = parseInt(process.argv[i + 1]);
                }
                if (process.argv[i] === '--app') {
                    open_app = true;
                }
                if (process.argv[i] === '--tui') {
                    // TUI mode - interactive terminal
                    cmd_tui();
                    return 0;
                }
            }
    cmd_studio(port, open_app);
    return 0;
}

    if ((command === "ui")) {
    cmd_tui();
    return 0;
}

    if ((command === "package")) {
    let target = "";
for (let i = 3; i < process.argv.length; i++) {
                if (process.argv[i] === '--app' && process.argv[i + 1]) {
                    target = process.argv[i + 1];
                }
            }
            
            // Default to current platform
            if (!target) {
                const platform = process.platform;
                if (platform === 'win32') target = 'windows';
                else if (platform === 'darwin') target = 'macos';
                else if (platform === 'linux') target = 'linux';
                else target = 'windows';
            }
    let config = AppConfig_default();
                        const configPath = path.join(process.cwd(), 'omni.config.json');
            
            if (fs.existsSync(configPath)) {
                const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                if (cfg.app) {
                    config.name = cfg.app.name || config.name;
                    config.version = cfg.app.version || config.version;
                    config.bundle_id = cfg.app.bundle_id || config.bundle_id;
                    config.description = cfg.app.description || config.description;
                }
            }
    cmd_package_app(target, config);
    return 0;
}

    if ((command === "ingest")) {
    let input_file = "";
    let output_file = "";
input_file = process.argv[3] || '';
            output_file = process.argv[4] || '';
    if ((input_file === "")) {
    CLI_error("Usage: omni ingest <legacy_file> <output.omni>");
    CLI_info("Transforms PHP, Java, Python, or JS code to Omni");
    return 1;
}

    if ((output_file === "")) {
                output_file = path.basename(input_file).replace(/\.[^.]+$/, '.omni');
}

    cmd_ingest(input_file, output_file);
    return 0;
}

    if ((command === "run")) {
    let run_file = "";
run_file = process.argv[3] || '';
    if ((run_file === "")) {
    CLI_error("Usage: omni run <file.omni>");
    return 1;
}

    CLI_info(("VM Mode - Executing: " + run_file));
    let source = read_file(run_file);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let vm = OmniVM_new();
    OmniVM_run(vm, program);
    return 0;
}

    if ((command === "build")) {
    CLI_info("Building from omni.config.json...");
    return 0;
}

    let show_help = false;
show_help = command === 'help' || command === '--help' || command === '-h';
    if ((((command === "") || args_len) < 3)) {
    CLI_info("Launching interactive mode...");
    cmd_tui();
    return 0;
}

    if (show_help) {
    CLI_banner();
    print("Commands:");
    print("  setup                          Install Omni globally");
    print("  run <file.omni>                Execute instantly via VM");
    print("  build                          Build from omni.config.json");
    print("  package --self                 Create self-contained package");
    print("  <input> <output> [options]     Compile to target");
    print("");
    print("Options:");
    print("  --target <lang>     Target language (js, python, lua, c, rust)");
    print("  --package <path>    Load external language package (.omni-pkg)");
    print("  --framework <name>  Framework adapter (nextjs, laravel, android)");
    print("  --coverage          Show AST coverage report");
    print("  --version, -v       Show version");
    print("");
    print("Examples:");
console.log(CLI_COLORS.dim + "  omni run app.omni                       # Execute immediately" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + "  omni app.omni app.js                    # Compile to JS" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + "  omni app.omni dist/ --framework nextjs  # Generate Next.js" + CLI_COLORS.reset);
            console.log(CLI_COLORS.dim + "  omni setup                              # Install globally" + CLI_COLORS.reset);
    print("");
    return 0;
}

    let input_path = "";
    let output_path = "";
    let target_lang = "js";
    let package_path = "";
    let framework = "";
    let show_coverage = false;
input_path = process.argv[2];
        output_path = process.argv[3];
        
        for (let i = 4; i < process.argv.length; i++) {
            const arg = process.argv[i];
            if (arg === "--target" && (i + 1 < process.argv.length)) {
                target_lang = process.argv[++i];
            } else if (arg === "--package" && (i + 1 < process.argv.length)) {
                package_path = process.argv[++i];
            } else if (arg === "--framework" && (i + 1 < process.argv.length)) {
                framework = process.argv[++i];
            } else if (arg === "--coverage") {
                show_coverage = true;
            }
        }
    CLI_info(("Compiling: " + input_path));
    CLI_info(("Target: " + target_lang));
if (package_path) {
                                    
            if (fs.existsSync(package_path)) {
                CLI_info("Loading package: " + package_path);
                
                const grammarPath = fs.statSync(package_path).isDirectory() 
                    ? path.join(package_path, 'grammar.json')
                    : package_path;
                    
                if (fs.existsSync(grammarPath)) {
                    const targetDir = path.join(__dirname, '..', 'targets');
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    const profile = JSON.parse(fs.readFileSync(grammarPath, 'utf-8'));
                    const profileName = profile.name || path.basename(package_path, '.omni-pkg');
                    fs.writeFileSync(
                        path.join(targetDir, profileName + '.json'),
                        JSON.stringify(profile, null, 2)
                    );
                    
                    target_lang = profileName;
                    CLI_success("Loaded profile: " + profileName);
                }
            } else {
                CLI_warning("Package not found: " + package_path);
            }
        }
    let source = read_file(input_path);
    let l = new_lexer(source);
    let p = new_parser(l);
    let program = Parser_parse_program(p);
    let gen = HybridCodeGenerator_new(target_lang);
if (framework) {
            gen.framework = framework;
        }
    let code = HybridCodeGenerator_generate(gen, program);
if (show_coverage || gen.ast_node_count > 0) {
            const coverage = gen.ast_node_count > 0 
                ? (gen.generated_count / gen.ast_node_count * 100).toFixed(1)
                : 100;
            CLI_info("AST Coverage: " + coverage + "% (" + 
                gen.generated_count + "/" + gen.ast_node_count + " nodes)");
                
            if (coverage < 100) {
                CLI_warning("Some AST nodes were not generated");
            }
        }
    write_file(output_path, code);
    CLI_success(("Output: " + output_path));
    CLI_success("Compiled successfully!");
}

let _ = main();


// Entry Point
if (require.main === module) {
    main();
}
