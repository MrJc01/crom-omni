class Product {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.in_stock = data.in_stock;
    }
}

// @entity Repository: Product
Product.find = async (id) => {
    const db = await Database.get('main_db');
    const row = await db.get('SELECT * FROM Product WHERE id = ?', [id]);
    return row ? new Product(row) : null;
};

Product.save = async (obj) => {
    const db = await Database.get('main_db');
    if (obj.id) {
        await db.run('UPDATE Product SET name=?, price=?, in_stock=? WHERE id=?', [obj.name, obj.price, obj.in_stock, obj.id]);
    } else {
        const r = await db.run('INSERT INTO Product (name, price, in_stock) VALUES (?, ?, ?)', [obj.name, obj.price, obj.in_stock]);
        obj.id = r.lastID;
    }
    return obj;
};

Product.all = async () => {
    const db = await Database.get('main_db');
    return (await db.all('SELECT * FROM Product')).map(r => new Product(r));
};

Product.delete = async (id) => {
    const db = await Database.get('main_db');
    await db.run('DELETE FROM Product WHERE id = ?', [id]);
};

class Order {
    constructor(data = {}) {
        this.id = data.id;
        this.product_id = data.product_id;
        this.quantity = data.quantity;
        this.total = data.total;
    }
}

// @entity Repository: Order
Order.find = async (id) => {
    const db = await Database.get('main_db');
    const row = await db.get('SELECT * FROM Order WHERE id = ?', [id]);
    return row ? new Order(row) : null;
};

Order.save = async (obj) => {
    const db = await Database.get('main_db');
    if (obj.id) {
        await db.run('UPDATE Order SET product_id=?, quantity=?, total=? WHERE id=?', [obj.product_id, obj.quantity, obj.total, obj.id]);
    } else {
        const r = await db.run('INSERT INTO Order (product_id, quantity, total) VALUES (?, ?, ?)', [obj.product_id, obj.quantity, obj.total]);
        obj.id = r.lastID;
    }
    return obj;
};

Order.all = async () => {
    const db = await Database.get('main_db');
    return (await db.all('SELECT * FROM Order')).map(r => new Order(r));
};

Order.delete = async (id) => {
    const db = await Database.get('main_db');
    await db.run('DELETE FROM Order WHERE id = ?', [id]);
};

function create_product(name, price) {
    let product = new Product({ name: name, price: price, in_stock: true });
    return product;
}

module.exports = { create_product };
