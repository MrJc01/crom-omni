BlockLoop: 66 (return)
BlockLoop: 61 (let)
const ast = require("./ast.js");
const token = require("./token.js");
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
function PatternDatabase_new() {
    const db = new PatternDatabase({ patterns: null });
}



// Auto-exports
if (typeof exports !== 'undefined') {
    exports.CanonicalPattern_new = CanonicalPattern_new;
    exports.PatternDatabase_new = PatternDatabase_new;
    exports.IngestionEngine_new = IngestionEngine_new;
    exports.IngestionEngine_detect_language = IngestionEngine_detect_language;
    exports.IngestionEngine_analyze = IngestionEngine_analyze;
    exports.IngestionEngine_generate_omni = IngestionEngine_generate_omni;
    exports.IngestionEngine_report = IngestionEngine_report;
    exports.cmd_ingest = cmd_ingest;
    exports.CanonicalPattern = CanonicalPattern;
    exports.PatternDatabase = PatternDatabase;
    exports.IngestionEngine = IngestionEngine;
}
