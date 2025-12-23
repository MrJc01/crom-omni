function print(msg) {
    console.log(msg);
}
function demo_primitives() {
    print("1. Primitive Types:");
    let count = 42;
    let negative = -100;
    print("   i64: count = 42, negative = -100");
    let pi = 3.14159;
    let epsilon = 0.0001;
    print("   f64: pi = 3.14159, epsilon = 0.0001");
    let active = true;
    let hidden = false;
    print("   bool: active = true, hidden = false");
    let name = "Omni";
    let greeting = "Hello, " + name;
    print("   string: greeting = \"Hello, Omni\"");
    print("");
}
class Point {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
    }
}
class Rectangle {
    constructor(data = {}) {
        this.origin = data.origin;
        this.width = data.width;
        this.height = data.height;
    }
}
function Rectangle_area(rect) {
    return rect.width * rect.height;
}
function Rectangle_contains(rect, p) {
    let in_x = p.x >= rect.origin.x;
    let in_y = p.y >= rect.origin.y;
    
    return in_x == true;
}
function demo_structs() {
    print("2. Basic Structs:");
    let p1 = new Point({ x: 10.0, y: 20.0 });
    print("   Point: p1 = (10.0, 20.0)");
    let rect = new Rectangle({ origin: new Point({ x: 0.0, y: 0.0 }), width: 100.0, height: 50.0 });
    print("   Rectangle: origin=(0,0), 100x50");
    let area = Rectangle_area(rect);
    print("   Area: 5000.0");
    print("   rect.width = 100.0");
    print("");
}
class Product {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.in_stock = data.in_stock;
    }
}
class Order {
    constructor(data = {}) {
        this.id = data.id;
        this.customer_name = data.customer_name;
        this.total = data.total;
        this.items = data.items;
    }
}
function demo_entities() {
    print("3. Entity Structs (@entity):");
    let product1 = new Product({ id: 1, name: "Laptop", price: 999.99, in_stock: true });
    let product2 = new Product({ id: 2, name: "Mouse", price: 29.99, in_stock: true });
    print("   Product: { id: 1, name: \"Laptop\", price: 999.99 }");
    print("   Product: { id: 2, name: \"Mouse\", price: 29.99 }");
    let order = new Order({ id: 100, customer_name: "John Doe", total: 1029.98, items: [product1, product2] });
    print("   Order: { id: 100, customer: \"John Doe\", items: 2 }");
    print("");
}
function demo_arrays() {
    print("4. Arrays:");
    let numbers = [1, 2, 3, 4, 5];
    print("   i64[]: [1, 2, 3, 4, 5]");
    let names = ["Alice", "Bob", "Charlie"];
    print("   string[]: [\"Alice\", \"Bob\", \"Charlie\"]");
    let points = [new Point({ x: 0.0, y: 0.0 }), new Point({ x: 1.0, y: 1.0 }), new Point({ x: 2.0, y: 4.0 })];
    print("   Point[]: 3 points");
    let len = 0;
    
    print("   numbers.length = 5");
    print("");
}
function demo_inference() {
    print("5. Type Inference:");
    let inferred_int = 42;
    let inferred_float = 3.14;
    let inferred_bool = true;
    let inferred_str = "hello";
    print("   let x = 42      -> i64");
    print("   let x = 3.14    -> f64");
    print("   let x = true    -> bool");
    print("   let x = \"hi\"    -> string");
    let inferred_point = new Point({ x: 1.0, y: 2.0 });
    print("   let p = Point{} -> Point");
    print("");
}
function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Types and Structs           ║");
    print("╚══════════════════════════════════════╝");
    print("");
    demo_primitives();
    demo_structs();
    demo_entities();
    demo_arrays();
    demo_inference();
    print("✓ Type system demo completed!");
    print("  All types compile correctly to target language.");
}
main();
