const lib = require("./lib.js");
if (typeof global !== 'undefined') Object.assign(global, lib);
function main() {
    let result = add(10, 20);
    let product = multiply(5, 6);
    print("Sum: " + result);
    print("Product: " + product);
}
