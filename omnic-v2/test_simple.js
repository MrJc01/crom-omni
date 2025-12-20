function simple_math(a, b) {
    let result = a * 2 + b;
    return result;
}
function comparison_test(n) {
    if (n > 10) {
    return true;
}
    return false;
}
function string_concat(name) {
    return "Hello " + name;
}

module.exports = { simple_math, comparison_test, string_concat };
