
try {
    console.log("Loading bundle...");
    require('./omni_bundle.js');
    console.log("Bundle loaded.");
} catch (e) {
    console.log(e.name + ": " + e.message);
}
