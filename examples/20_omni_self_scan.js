function print(msg) {
     console.log(msg); 
}
class SourceMetrics {
    constructor(data = {}) {
        this.file_path = data.file_path;
        this.total_lines = data.total_lines;
        this.code_lines = data.code_lines;
        this.comment_lines = data.comment_lines;
        this.blank_lines = data.blank_lines;
        this.function_count = data.function_count;
        this.capsule_count = data.capsule_count;
        this.struct_count = data.struct_count;
        this.native_block_count = data.native_block_count;
    }
}
class ProjectMetrics {
    constructor(data = {}) {
        this.total_files = data.total_files;
        this.total_lines = data.total_lines;
        this.total_functions = data.total_functions;
        this.total_capsules = data.total_capsules;
        this.total_structs = data.total_structs;
        this.files = data.files;
    }
}
class Token {
    constructor(data = {}) {
        this.token_type = data.token_type;
        this.lexeme = data.lexeme;
        this.line = data.line;
    }
}
class OmniLexer {
    static tokenize(source) {
    let tokens = [];
    
            const patterns = [
                { type: 'KEYWORD', regex: new RegExp("\\b(fn|let|if|else|while|return|struct|capsule|flow|import|native)\\b", "g") },
                { type: 'IDENTIFIER', regex: new RegExp("\\b[a-zA-Z_][a-zA-Z0-9_]*\\b", "g") },
                { type: 'NUMBER', regex: new RegExp("\\b\\d+(\\.\\d+)?\\b", "g") },
                { type: 'STRING', regex: new RegExp("\"[^\"]*\"", "g") },
                { type: 'COMMENT', regex: new RegExp("//.*$", "gm") }
            ];
            
            const lines = source.split('\n');
            
            for (let lineNum = 0; lineNum < lines.length; lineNum++) {
                const line = lines[lineNum];
                
                // Check for keywords
                const keywords = line.match(/\b(fn|let|if|else|while|return|struct|capsule|flow|import|native)\b/g);
                if (keywords) {
                    for (const kw of keywords) {
                        tokens.push({ token_type: 'KEYWORD', lexeme: kw, line: lineNum + 1 });
                    }
                }
            }
        
    return tokens;
}
}

class Analyzer {
    static analyze_file(content, path) {
    let metrics = new SourceMetrics({ file_path: path, total_lines: 0, code_lines: 0, comment_lines: 0, blank_lines: 0, function_count: 0, capsule_count: 0, struct_count: 0, native_block_count: 0 });
    
            const lines = content.split("\n");
            metrics.total_lines = lines.length;
            
            for (const line of lines) {
                const trimmed = line.trim();
                
                if (trimmed === "") {
                    metrics.blank_lines++;
                } else if (trimmed.startsWith("//")) {
                    metrics.comment_lines++;
                } else {
                    metrics.code_lines++;
                }
                
                // Count declarations
                if (trimmed.match(new RegExp("^fn\\s+\\w+"))) {
                    metrics.function_count++;
                }
                if (trimmed.match(new RegExp("^flow\\s+\\w+"))) {
                    metrics.function_count++; // flows are also functions
                }
                if (trimmed.match(new RegExp("^capsule\\s+\\w+"))) {
                    metrics.capsule_count++;
                }
                if (trimmed.match(new RegExp("^struct\\s+\\w+")) || trimmed.match(new RegExp("^@entity\\s*$"))) {
                    metrics.struct_count++;
                }
                if (trimmed.match(new RegExp("^native\\s+\""))) {
                    metrics.native_block_count++;
                }
            }
        
    return metrics;
}
    static analyze_directory(dir_path) {
    let project = new ProjectMetrics({ total_files: 0, total_lines: 0, total_functions: 0, total_capsules: 0, total_structs: 0, files: [] });
    
            const fs = require('fs');
            const path = require('path');
            
            function scanDir(dir) {
                try {
                    const entries = fs.readdirSync(dir);
                    
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry);
                        const stat = fs.statSync(fullPath);
                        
                        if (stat.isDirectory()) {
                            scanDir(fullPath);
                        } else if (entry.endsWith('.omni')) {
                            const content = fs.readFileSync(fullPath, 'utf8');
                            const metrics = Analyzer.analyze_file(content, fullPath);
                            
                            project.files.push(metrics);
                            project.total_files++;
                            project.total_lines += metrics.total_lines;
                            project.total_functions += metrics.function_count;
                            project.total_capsules += metrics.capsule_count;
                            project.total_structs += metrics.struct_count;
                        }
                    }
                } catch (e) {
                    // Directory not accessible
                }
            }
            
            scanDir(dir_path);
        
    return project;
}
    static print_report(project) {
    print("════════════════════════════════════════");
    print("         OMNI PROJECT ANALYSIS");
    print("════════════════════════════════════════");
    print("");
    
            console.log('📁 Files Analyzed: ' + project.total_files);
            console.log('📊 Total Lines: ' + project.total_lines);
            console.log('');
            console.log('   Functions: ' + project.total_functions);
            console.log('   Capsules: ' + project.total_capsules);
            console.log('   Structs: ' + project.total_structs);
            console.log('');
            
            if (project.files.length > 0) {
                console.log('Top 5 largest files:');
                const sorted = [...project.files].sort((a, b) => b.total_lines - a.total_lines);
                const top5 = sorted.slice(0, 5);
                
                for (const f of top5) {
                    const name = f.file_path.split(/[/\\]/).pop();
                    console.log('   ' + f.total_lines.toString().padStart(5) + ' lines - ' + name);
                }
                console.log('');
            }
        
    print("════════════════════════════════════════");
}
}

class SelfScan {
    static analyze_self() {
    let self_source = "";
    
            const fs = require('fs');
            const path = require('path');
            
            // Try to read the source file
            const possiblePaths = [
                'examples/20_omni_self_scan.omni',
                './20_omni_self_scan.omni',
                path.join(process.cwd(), 'examples', '20_omni_self_scan.omni')
            ];
            
            for (const p of possiblePaths) {
                try {
                    if (fs.existsSync(p)) {
                        self_source = fs.readFileSync(p, 'utf8');
                        break;
                    }
                } catch (e) {}
            }
        
    if (self_source == "") {
    print("   [Could not read source file]");
    return new SourceMetrics({ file_path: "self", total_lines: 0, code_lines: 0, comment_lines: 0, blank_lines: 0, function_count: 0, capsule_count: 0, struct_count: 0, native_block_count: 0 });
}
    return Analyzer.analyze_file(self_source, "20_omni_self_scan.omni");
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Self Scan (Meta-Analysis)   ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("1. Analyzing THIS file (self-scan):");
    print("   ──────────────────────────────────");
    let self_metrics = SelfScan.analyze_self();
    
        if (self_metrics.total_lines > 0) {
            console.log('   Total lines: ' + self_metrics.total_lines);
            console.log('   Code lines: ' + self_metrics.code_lines);
            console.log('   Comments: ' + self_metrics.comment_lines);
            console.log('   Blank lines: ' + self_metrics.blank_lines);
            console.log('   Functions: ' + self_metrics.function_count);
            console.log('   Capsules: ' + self_metrics.capsule_count);
            console.log('   Structs: ' + self_metrics.struct_count);
            console.log('   Native blocks: ' + self_metrics.native_block_count);
        }
    
    print("");
    print("2. Analyzing examples/ directory:");
    print("   ────────────────────────────────");
    let project = Analyzer.analyze_directory("examples");
    
        if (project.total_files > 0) {
            Analyzer.print_report(project);
        } else {
            console.log('   [Run from project root to analyze examples/]');
        }
    
    print("");
    print("Self-Scan demonstrates:");
    print("  • Reading Omni source files at runtime");
    print("  • Lexical analysis of Omni syntax");
    print("  • Code metrics extraction");
    print("  • Directory traversal & file scanning");
    print("  • Meta-programming capabilities");
    print("");
    print("CLI Usage:");
    print("  .\\omni compile examples/20_omni_self_scan.omni --target js");
    print("  node output.js");
    print("");
    print("✓ Omni self-scan complete!");
    print("  The compiler analyzed its own language. 🐍");
}

main();
