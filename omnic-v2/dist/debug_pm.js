try {
    console.log("Loading package_manager...");
    const pm = require("./core/package_manager.js");
    console.log("Success!");
} catch (e) {
    console.error("FAIL:", e);
}
