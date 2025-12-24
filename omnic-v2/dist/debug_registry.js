try {
    console.log("Loading registry...");
    const reg = require("./contracts/registry.js");
    console.log("Success!");
} catch (e) {
    console.error("FAIL:", e);
}
