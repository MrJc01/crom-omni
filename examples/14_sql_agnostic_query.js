function print(msg) {
     console.log(msg); 
}
class DbConfig {
    constructor(data = {}) {
        this.driver = data.driver;
        this.host = data.host;
        this.port = data.port;
        this.database = data.database;
        this.user = data.user;
        this.password = data.password;
    }
}
class QueryResult {
    constructor(data = {}) {
        this.success = data.success;
        this.rows = data.rows;
        this.affected_rows = data.affected_rows;
        this.last_insert_id = data.last_insert_id;
        this.error = data.error;
    }
}
class User {
    constructor(data = {}) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.created_at = data.created_at;
    }
}
class Post {
    constructor(data = {}) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.title = data.title;
        this.content = data.content;
        this.published = data.published;
    }
}
class Database {
    static config = new DbConfig({ driver: "memory", host: "", port: 0, database: "", user: "", password: "" });
    static connection = 0;
    static tables = 0;
    static connect(cfg) {
    Database.config = cfg;
    
            if (Database.config.driver === 'memory') {
                // In-memory mock database
                Database.tables = {};
                Database.connection = { connected: true };
                return true;
            }
            
            // For real databases, would use appropriate driver
            // sqlite: better-sqlite3
            // postgres: pg
            // mysql: mysql2
        
    return true;
}
    static create_table(name, schema) {
    let success = false;
    
            if (Database.config.driver === 'memory') {
                Database.tables[name] = {
                    schema: schema,
                    rows: [],
                    autoIncrement: 1
                };
                success = true;
            }
        
    return success;
}
    static insert(table, data) {
    let result = new QueryResult({ success: false, rows: 0, affected_rows: 0, last_insert_id: 0, error: "" });
    
            if (Database.config.driver === 'memory' && Database.tables[table]) {
                const id = Database.tables[table].autoIncrement++;
                const row = { id, ...data };
                Database.tables[table].rows.push(row);
                result.success = true;
                result.affected_rows = 1;
                result.last_insert_id = id;
            } else {
                result.error = 'Table not found: ' + table;
            }
        
    return result;
}
    static select(table, where_clause) {
    let result = new QueryResult({ success: false, rows: [], affected_rows: 0, last_insert_id: 0, error: "" });
    
            if (Database.config.driver === 'memory' && Database.tables[table]) {
                let rows = Database.tables[table].rows;
                
                if (where_clause) {
                    rows = rows.filter(row => {
                        for (const key in where_clause) {
                            if (row[key] !== where_clause[key]) return false;
                        }
                        return true;
                    });
                }
                
                result.rows = rows;
                result.affected_rows = rows.length;
                result.success = true;
            } else {
                result.error = 'Table not found: ' + table;
            }
        
    return result;
}
    static update(table, data, where_clause) {
    let result = new QueryResult({ success: false, rows: 0, affected_rows: 0, last_insert_id: 0, error: "" });
    
            if (Database.config.driver === 'memory' && Database.tables[table]) {
                let updated = 0;
                
                Database.tables[table].rows = Database.tables[table].rows.map(row => {
                    let matches = true;
                    for (const key in where_clause) {
                        if (row[key] !== where_clause[key]) matches = false;
                    }
                    
                    if (matches) {
                        updated++;
                        return { ...row, ...data };
                    }
                    return row;
                });
                
                result.affected_rows = updated;
                result.success = true;
            } else {
                result.error = 'Table not found: ' + table;
            }
        
    return result;
}
    static delete(table, where_clause) {
    let result = new QueryResult({ success: false, rows: 0, affected_rows: 0, last_insert_id: 0, error: "" });
    
            if (Database.config.driver === 'memory' && Database.tables[table]) {
                const original = Database.tables[table].rows.length;
                
                Database.tables[table].rows = Database.tables[table].rows.filter(row => {
                    for (const key in where_clause) {
                        if (row[key] === where_clause[key]) return false;
                    }
                    return true;
                });
                
                result.affected_rows = original - Database.tables[table].rows.length;
                result.success = true;
            } else {
                result.error = 'Table not found: ' + table;
            }
        
    return result;
}
    static query(sql) {
    let result = new QueryResult({ success: false, rows: [], affected_rows: 0, last_insert_id: 0, error: "" });
    
            // In production, this would execute actual SQL
            // For memory driver, we'd need a SQL parser
            result.error = 'Raw SQL not supported in memory driver';
        
    return result;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - SQL Agnostic Query          ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("1. Connecting to in-memory database...");
    let config = new DbConfig({ driver: "memory", host: "", port: 0, database: "demo", user: "", password: "" });
    Database.connect(config);
    print("   ✓ Connected");
    print("");
    print("2. Creating tables...");
    let user_schema = 0;
    let post_schema = 0;
    
        user_schema = { username: 'string', email: 'string', created_at: 'string' };
        post_schema = { user_id: 'int', title: 'string', content: 'string', published: 'bool' };
    
    Database.create_table("users", user_schema);
    Database.create_table("posts", post_schema);
    print("   ✓ Tables: users, posts");
    print("");
    print("3. Inserting records...");
    let user1 = 0;
    let user2 = 0;
    
        user1 = { username: 'alice', email: 'alice@example.com', created_at: new Date().toISOString() };
        user2 = { username: 'bob', email: 'bob@example.com', created_at: new Date().toISOString() };
    
    let r1 = Database.insert("users", user1);
    let r2 = Database.insert("users", user2);
    print("   ✓ Inserted 2 users (IDs: 1, 2)");
    let post1 = 0;
    
        post1 = { user_id: 1, title: 'Hello World', content: 'My first post!', published: true };
    
    Database.insert("posts", post1);
    print("   ✓ Inserted 1 post");
    print("");
    print("4. Querying records...");
    let all_users = Database.select("users", 0);
    print("   All users: " + all_users.affected_rows + " found");
    let where_alice = 0;
     where_alice = { username: 'alice' }; 
    let alice = Database.select("users", where_alice);
    print("   User 'alice': found");
    print("");
    print("5. Updating records...");
    let update_data = 0;
     update_data = { email: 'alice.new@example.com' }; 
    let update_result = Database.update("users", update_data, where_alice);
    print("   Updated alice's email: " + update_result.affected_rows + " row(s)");
    print("");
    print("6. Deleting records...");
    let where_bob = 0;
     where_bob = { username: 'bob' }; 
    let delete_result = Database.delete("users", where_bob);
    print("   Deleted bob: " + delete_result.affected_rows + " row(s)");
    print("");
    print("Database API:");
    print("  Database.connect(config)            - Connect");
    print("  Database.create_table(name, schema) - Create table");
    print("  Database.insert(table, data)        - Insert row");
    print("  Database.select(table, where)       - Query rows");
    print("  Database.update(table, data, where) - Update rows");
    print("  Database.delete(table, where)       - Delete rows");
    print("");
    print("✓ SQL agnostic query demo complete!");
}

main();
