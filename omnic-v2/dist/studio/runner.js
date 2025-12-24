const terminal = require("../lib/terminal.js");
if (typeof global !== 'undefined') Object.assign(global, terminal);
class CrossRunner {
    constructor(data = {}) {
        this.processes = data.processes;
        this.output_buffer = data.output_buffer;
    }
}
function CrossRunner_new() {
    return new CrossRunner({ processes: null });
    // Unknown stmt kind: 0
    output_buffer;
    // Unknown stmt kind: 0
    // Unknown stmt kind: 0
}
// Unknown stmt kind: undefined
// Unknown stmt kind: undefined
function CrossRunner_run(self, name, command, cwd) {
    const success = true;
    
        const { spawn } = require('child_process');
        const path = require('path');
        
        console.log(CLI_COLORS.cyan + "[runner] " + CLI_COLORS.reset + "Starting: " + command);
        
        // Parse command
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        // Spawn process
        const proc = spawn(cmd, args, {
            cwd: cwd,
            shell: true,
            stdio: ['inherit', 'pipe', 'pipe']
        });
        
        self.processes[name] = proc;
        self.output_buffer[name] = [];
        
        proc.stdout.on('data', (data) => {
            const line = data.toString();
            self.output_buffer[name].push(line);
            process.stdout.write(CLI_COLORS.dim + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.stderr.on('data', (data) => {
            const line = data.toString();
            self.output_buffer[name].push(line);
            process.stderr.write(CLI_COLORS.red + "[" + name + "] " + CLI_COLORS.reset + line);
        });
        
        proc.on('close', (code) => {
            console.log(CLI_COLORS.yellow + "[runner] " + CLI_COLORS.reset + name + " exited with code " + code);
            delete self.processes[name];
        });
        
        proc.on('error', (err) => {
            terminal.CLI_error("Failed to start " + name + ": " + err.message);
            success = false;
        });
    
    return success;
}
function CrossRunner_stop(self, name) {
    
        const proc = self.processes[name];
        if (proc) {
            proc.kill('SIGTERM');
            console.log(CLI_COLORS.yellow + "[runner] " + CLI_COLORS.reset + "Stopped: " + name);
        }
    
}
function CrossRunner_stop_all(self) {
    
        for (const name of Object.keys(self.processes)) {
            CrossRunner_stop(self, name);
        }
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CrossRunner_new = CrossRunner_new;
    exports.CrossRunner_run = CrossRunner_run;
    exports.CrossRunner_stop = CrossRunner_stop;
    exports.CrossRunner_stop_all = CrossRunner_stop_all;
    exports.CrossRunner = CrossRunner;
}
