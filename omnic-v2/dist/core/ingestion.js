const _ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, _ast);
const _token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, _token);
class CanonicalPattern {
    constructor(data = {}) {
        this.name = data.name;
        this.language = data.language;
        this.signature = data.signature;
        this.omni_equivalent = data.omni_equivalent;
        this.confidence = data.confidence;
    }
}
function CanonicalPattern_new(name, lang, sig, omni) {
    return new CanonicalPattern({ name: name, language: lang, signature: sig, omni_equivalent: omni, confidence: 100 });
}
class PatternDatabase {
    constructor(data = {}) {
        this.patterns = data.patterns;
    }
}
function new_map() {
     return {}; 
    return 0;
}
function PatternDatabase_new() {
    let db = new PatternDatabase({ patterns: new_map() });
    
        const patterns = require('./ingestion_patterns.js');
        db.patterns = patterns;
        
        // Load external patterns from patterns/ directory
        const fs = require('fs');
        const path = require('path');
        const patternsDir = path.join(__dirname, '..', 'patterns');
        
        if (fs.existsSync(patternsDir)) {
            const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(patternsDir, file), 'utf-8'));
                    const lang = content.language || path.basename(file, '.json');
                    
                    if (!db.patterns[lang]) {
                        db.patterns[lang] = [];
                    }
                    
                    // Add patterns from external file
                    for (const pattern of (content.patterns || [])) {
                        db.patterns[lang].push({
                            name: pattern.name,
                            regex: new RegExp(pattern.regex, pattern.flags || ''),
                            toOmni: (m) => {
                                let result = pattern.template;
                                for (let i = 0; i < m.length; i++) {
                                    result = result.replace(new RegExp('\\{' + i + '\\}', 'g'), m[i] || '');
                                }
                                return result;
                            }
                        });
                    }
                    
                    console.log("[ingest] Loaded external patterns: " + lang);
                } catch (e) {
                    console.warn("[ingest] Failed to load patterns from " + file + ": " + e.message);
                }
            }
        }
    
    return db;
}
// Unknown stmt kind: undefined
class IngestionEngine {
    constructor(data = {}) {
        this.patterns = data.patterns;
        this.source_language = data.source_language;
        this.detected_patterns = data.detected_patterns;
        this.omni_output = data.omni_output;
        this.confidence_score = data.confidence_score;
    }
}
function IngestionEngine_new(source_lang) {
    return new IngestionEngine({ patterns: PatternDatabase_new(), source_language: source_lang, detected_patterns: [], omni_output: "", confidence_score: 0 });
}
function IngestionEngine_detect_language(source) {
    let lang = "unknown";
    
        // Heuristic language detection
        if (source.includes('<?php') || source.includes('<?=')) {
            lang = 'php';
        } else if (source.includes('public class') || source.includes('import java.')) {
            lang = 'java';
        } else if (source.includes('def ') && source.includes(':') && !source.includes('{')) { // }
            lang = 'python';
        } else if (source.includes('function') || source.includes('=>') || source.includes('const ')) {
            lang = 'javascript';
        } else if (source.includes('fn ') || source.includes('let ') || source.includes('use ')) {
            if (source.includes('->') && source.includes('::')) {
                lang = 'rust';
            }
        }
    
    return lang;
}
function IngestionEngine_analyze(self, source) {
    
        const patterns = self.patterns.patterns[self.source_language] || [];
        self.detected_patterns = [];
        
        for (const pattern of patterns) {
            const matches = source.match(new RegExp(pattern.regex, 'gm'));
            if (matches) {
                for (const match of matches) {
                    const groups = match.match(pattern.regex);
                    if (groups) {
                        self.detected_patterns.push({
                            pattern: pattern.name,
                            match: match,
                            omni: pattern.toOmni(groups)
                        });
                    }
                }
            }
        }
        
        // Calculate confidence based on pattern coverage
        if (self.detected_patterns.length > 0) {
            self.confidence_score = Math.min(100, self.detected_patterns.length * 15);
        }
    
}
function IngestionEngine_generate_omni(self) {
    let output = "";
    
        output = "// ============================================================================\n";
        output += "// AUTO-GENERATED OMNI CODE\n";
        output += "// Source Language: " + self.source_language.toUpperCase() + "\n";
        output += "// Confidence Score: " + self.confidence_score + "%\n";
        output += "// Patterns Detected: " + self.detected_patterns.length + "\n";
        output += "// ============================================================================\n\n";
        
        // Group by pattern type
        const structs = [];
        const capsules = [];
        const functions = [];
        const flows = [];
        
        for (const detected of self.detected_patterns) {
            const omni = detected.omni;
            if (omni.includes('@entity') || omni.includes('struct')) {
                structs.push(omni);
            } else if (omni.includes('capsule') || omni.includes('@server')) {
                capsules.push(omni);
            } else if (omni.includes('flow')) {
                flows.push(omni);
            } else if (omni.includes('fn ')) {
                functions.push(omni);
            }
        }
        
        // Output in logical order
        if (structs.length > 0) {
            output += "// === ENTITIES ===\n\n";
            output += structs.join('\n\n') + '\n\n';
        }
        
        if (capsules.length > 0 || flows.length > 0) {
            output += "// === CAPSULES ===\n\n";
            output += capsules.join('\n\n') + '\n';
            output += flows.join('\n') + '\n\n';
        }
        
        if (functions.length > 0) {
            output += "// === FUNCTIONS ===\n\n";
            output += functions.join('\n\n') + '\n\n';
        }
        
        // Add main if no capsules
        if (capsules.length === 0) {
            output += "fn main() {\n";
            output += "    // TODO: Implement main logic\n";
            output += "}\n";
        }
        
        self.omni_output = output;
    
    return output;
}
function IngestionEngine_report(self) {
    
        console.log("\n┌────────────────────────────────────────────┐");
        console.log("│        INGESTION ANALYSIS REPORT           │");
        console.log("├────────────────────────────────────────────┤");
        console.log("│ Source Language: " + self.source_language.toUpperCase().padEnd(25) + "│");
        console.log("│ Patterns Found:  " + String(self.detected_patterns.length).padEnd(25) + "│");
        console.log("│ Confidence:      " + (self.confidence_score + "%").padEnd(25) + "│");
        console.log("└────────────────────────────────────────────┘");
        console.log("\nDetected Patterns:");
        
        const patternCounts = {};
        for (const p of self.detected_patterns) {
            patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
        }
        
        for (const [name, count] of Object.entries(patternCounts)) {
            console.log("  • " + name + ": " + count);
        }
    
}
function cmd_ingest(input_file, output_file) {
    CLI_header("Omni Ingestion Engine");
    CLI_info("Analyzing: " + input_file);
    let source = read_file(input_file);
    let lang = IngestionEngine_detect_language(source);
    CLI_info("Detected language: " + lang);
    if (lang == "unknown") {
    CLI_error("Could not detect source language");
    return null;
}
    let engine = IngestionEngine_new(lang);
    IngestionEngine_analyze(engine, source);
    IngestionEngine_report(engine);
    let omni_code = IngestionEngine_generate_omni(engine);
    write_file(output_file, omni_code);
    CLI_success("Generated: " + output_file);
    CLI_info("Review the generated code and add missing implementation details.");
}

module.exports = { CanonicalPattern_new, new_map, PatternDatabase_new, IngestionEngine_new, IngestionEngine_detect_language, IngestionEngine_analyze, IngestionEngine_generate_omni, IngestionEngine_report, cmd_ingest };
