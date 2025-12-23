function print(msg) {
     console.log(msg); 
}
class SourceFile {
    constructor(data = {}) {
        this.path = data.path;
        this.language = data.language;
        this.content = data.content;
    }
}
class ConversionResult {
    constructor(data = {}) {
        this.success = data.success;
        this.omni_code = data.omni_code;
        this.warnings = data.warnings;
        this.stats = data.stats;
    }
}
class ConversionStats {
    constructor(data = {}) {
        this.lines_input = data.lines_input;
        this.lines_output = data.lines_output;
        this.functions_converted = data.functions_converted;
        this.classes_converted = data.classes_converted;
        this.native_blocks = data.native_blocks;
    }
}
class LanguagePattern {
    constructor(data = {}) {
        this.name = data.name;
        this.regex = data.regex;
        this.replacement = data.replacement;
    }
}
class Converter {
    static detect_language(content) {
    let language = "unknown";
    
            if (content.includes('<?php') || content.includes('<?=')) {
                language = 'php';
            } else if (content.includes('def ') && content.includes(':')) {
                language = 'python';
            } else if (content.includes('function ') || content.includes('const ') || content.includes('=>')) {
                language = 'javascript';
            } else if (content.includes('public class ') || content.includes('private void ')) {
                language = 'java';
            }
        
    return language;
}
    static convert_php(content) {
    let result = new ConversionResult({ success: false, omni_code: "", warnings: [], stats: new ConversionStats({ lines_input: 0, lines_output: 0, functions_converted: 0, classes_converted: 0, native_blocks: 0 }) });
    
            const lines = content.split('\n');
            result.stats.lines_input = lines.length;
            
            let output = [];
            let warnings = [];
            
            output.push('// Converted from PHP by Omni Ghost Writer');
            output.push('// Original: ' + result.stats.lines_input + ' lines');
            output.push('');
            
            for (let line of lines) {
                let converted = line;
                
                // Skip PHP tags
                if (line.includes('<?php') || line.includes('?>')) {
                    continue;
                }
                
                // Convert function declarations
                if (line.match(new RegExp("function\\s+(\\w+)\\s*\\("))) {
                    converted = line
                        .replace(new RegExp("function\\s+(\\w+)\\s*\\((.*?)\\)"), "fn $1($2)")
                        .replace(new RegExp("\\$(\\w+)", "g"), "$1")
                        .replace(new RegExp(":\\s*string"), ": string")
                        .replace(new RegExp(":\\s*int"), ": i64")
                        .replace(new RegExp(":\\s*float"), ": f64")
                        .replace(new RegExp(":\\s*bool"), ": bool");
                    result.stats.functions_converted++;
                }
                
                // Convert echo/print
                converted = converted.replace(new RegExp("echo\\s+(.+);"), "print($1);");
                converted = converted.replace(new RegExp("print\\s+(.+);"), "print($1);");
                
                // Convert variable declarations
                converted = converted.replace(new RegExp("\\$(\\w+)\\s*="), "let $1 =");
                
                // Convert string concatenation
                converted = converted.replace(new RegExp("\\s*\\.\\s*", "g"), " + ");
                
                // Convert class
                if (line.match(new RegExp("class\\s+(\\w+)"))) {
                    converted = line.replace(new RegExp("class\\s+(\\w+)"), "capsule $1");
                    result.stats.classes_converted++;
                }
                
                // Track native blocks needed
                if (line.includes('mysql_') || line.includes('mysqli_')) {
                    warnings.push('Database calls require native blocks');
                    result.stats.native_blocks++;
                }
                
                output.push(converted);
            }
            
            result.omni_code = output.join('\n');
            result.stats.lines_output = output.length;
            result.warnings = warnings;
            result.success = true;
        
    return result;
}
    static convert_javascript(content) {
    let result = new ConversionResult({ success: false, omni_code: "", warnings: [], stats: new ConversionStats({ lines_input: 0, lines_output: 0, functions_converted: 0, classes_converted: 0, native_blocks: 0 }) });
    
            const lines = content.split('\n');
            result.stats.lines_input = lines.length;
            
            let output = [];
            let warnings = [];
            
            output.push('// Converted from JavaScript by Omni Ghost Writer');
            output.push('// Original: ' + result.stats.lines_input + ' lines');
            output.push('');
            
            for (let line of lines) {
                let converted = line;
                
                // Convert function declarations
                if (line.match(new RegExp("function\\s+(\\w+)\\s*\\("))) {
                    converted = line.replace(new RegExp("function\\s+(\\w+)"), "fn $1");
                    result.stats.functions_converted++;
                }
                
                // Convert arrow functions (basic)
                if (line.match(new RegExp("const\\s+(\\w+)\\s*=\\s*\\(.*?\\)\\s*=>"))) {
                    converted = line
                        .replace(new RegExp("const\\s+(\\w+)\\s*=\\s*\\((.*?)\\)\\s*=>"), "fn $1($2) ->");
                    result.stats.functions_converted++;
                }
                
                // Convert let/const
                converted = converted.replace(new RegExp("const\\s+", "g"), "let ");
                converted = converted.replace(new RegExp("var\\s+", "g"), "let ");
                
                // Convert console.log
                converted = converted.replace(new RegExp("console\\.log\\s*\\(", "g"), "print(");
                
                // Convert class
                if (line.match(new RegExp("class\\s+(\\w+)"))) {
                    // Check if it extends something
                    if (line.includes('extends')) {
                        warnings.push('Inheritance not directly supported - use capsules');
                    }
                    converted = line.replace(new RegExp("class\\s+(\\w+)(\\s+extends\\s+\\w+)?"), "capsule $1");
                    result.stats.classes_converted++;
                }
                
                // Track async/await
                if (line.includes('async ') || line.includes('await ')) {
                    warnings.push('Async/await requires native blocks');
                    result.stats.native_blocks++;
                }
                
                output.push(converted);
            }
            
            result.omni_code = output.join('\n');
            result.stats.lines_output = output.length;
            result.warnings = [...new Set(warnings)]; // Dedupe
            result.success = true;
        
    return result;
}
    static convert(source) {
    let lang = source.language;
    if (lang == "") {
    lang = Converter.detect_language(source.content);
}
    if (lang == "php") {
    return Converter.convert_php(source.content);
}
    if (lang == "javascript") {
    return Converter.convert_javascript(source.content);
}
    let result = new ConversionResult({ success: false, omni_code: "", warnings: ["Unsupported language: " + lang], stats: new ConversionStats({ lines_input: 0, lines_output: 0, functions_converted: 0, classes_converted: 0, native_blocks: 0 }) });
    return result;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Legacy Converter Demo       ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("1. Converting PHP code:");
    print("   ─────────────────────");
    let php_code = "";
    
        php_code = `<?php
function greet($name) {
    echo "Hello, " . $name;
}

class UserService {
    private $users = [];
    
    public function addUser($user) {
        $this->users[] = $user;
    }
}
?>`;
    
    let php_source = new SourceFile({ path: "example.php", language: "php", content: php_code });
    let php_result = Converter.convert(php_source);
    print("   Input: " + php_result.stats.lines_input + " lines PHP");
    print("   Output: " + php_result.stats.lines_output + " lines Omni");
    print("   Functions: " + php_result.stats.functions_converted);
    print("   Classes: " + php_result.stats.classes_converted);
    print("");
    print("2. Converting JavaScript code:");
    print("   ────────────────────────────");
    let js_code = "";
    
        js_code = `const API_BASE = 'https://api.example.com';

function fetchUser(userId) {
    console.log('Fetching user: ' + userId);
    return fetch(API_BASE + '/users/' + userId);
}

class DataService {
    constructor() {
        this.cache = {};
    }
    
    async getData(key) {
        return await this.fetch(key);
    }
}`;
    
    let js_source = new SourceFile({ path: "example.js", language: "javascript", content: js_code });
    let js_result = Converter.convert(js_source);
    print("   Input: " + js_result.stats.lines_input + " lines JS");
    print("   Output: " + js_result.stats.lines_output + " lines Omni");
    print("   Functions: " + js_result.stats.functions_converted);
    print("   Native blocks needed: " + js_result.stats.native_blocks);
    print("");
    print("3. Language Detection:");
    print("   ────────────────────");
    
        console.log('   "<?php echo $x;" -> ' + Converter.detect_language('<?php echo $x;'));
        console.log('   "def foo(): pass" -> ' + Converter.detect_language('def foo(): pass'));
        console.log('   "const x = () =>" -> ' + Converter.detect_language('const x = () => {}'));
    
    print("");
    print("Conversion API:");
    print("  Converter.detect_language(code)  - Auto-detect language");
    print("  Converter.convert_php(code)      - Convert PHP to Omni");
    print("  Converter.convert_javascript(code) - Convert JS to Omni");
    print("  Converter.convert(source)        - Convert any language");
    print("");
    print("CLI Usage:");
    print("  .\\omni ingest legacy.php output.omni");
    print("  .\\omni ingest legacy.js output.omni");
    print("");
    print("✓ Legacy converter demo complete!");
}

main();
