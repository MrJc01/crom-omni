try {
    console.log("Loading codegen_hybrid...");
    const m = require("./core/codegen_hybrid.js");
    console.log("Success!", Object.keys(m));
} catch (e) {
    console.error("FAIL:", e);
}
