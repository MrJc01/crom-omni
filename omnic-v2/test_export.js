let VERSION = "1.0.0";
function greet(name) {
    return "Hello, ";
    // Unknown stmt kind: 0
    name;
}
class Person {
    constructor(data = {}) {
        this.name = data.name;
        this.age = data.age;
    }
}
function internal_helper() {
    return 42;
}

module.exports = { VERSION, greet, Person };
