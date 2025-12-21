const ast = require("./ast.js");
if (typeof global !== 'undefined') Object.assign(global, ast);
const token = require("./token.js");
if (typeof global !== 'undefined') Object.assign(global, token);
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
    let db = new PatternDatabase({ patterns: null });
}

