//! Stdlib - Standard Library Expansion
//!
//! Core standard library modules for Omni.

use colored::*;

/// Standard library modules
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StdModule {
    Queue,
    Stack,
    Cache,
    Auth,
    Http,
    Json,
    Crypto,
    Time,
    Random,
    Regex,
}

impl StdModule {
    pub fn name(&self) -> &'static str {
        match self {
            StdModule::Queue => "std.queue",
            StdModule::Stack => "std.stack",
            StdModule::Cache => "std.cache",
            StdModule::Auth => "std.auth",
            StdModule::Http => "std.http",
            StdModule::Json => "std.json",
            StdModule::Crypto => "std.crypto",
            StdModule::Time => "std.time",
            StdModule::Random => "std.random",
            StdModule::Regex => "std.regex",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            StdModule::Queue => "FIFO queue data structure",
            StdModule::Stack => "LIFO stack data structure",
            StdModule::Cache => "In-memory caching with TTL",
            StdModule::Auth => "Authentication and authorization",
            StdModule::Http => "HTTP client and server",
            StdModule::Json => "JSON parsing and serialization",
            StdModule::Crypto => "Cryptographic functions",
            StdModule::Time => "Date and time utilities",
            StdModule::Random => "Random number generation",
            StdModule::Regex => "Regular expressions",
        }
    }
}

/// Queue implementation signature
pub fn queue_omni() -> &'static str {
    r#"// std.queue - FIFO Queue
struct Queue<T> {
    items: List<T>
}

impl Queue<T> {
    fn new() -> Queue<T>
    fn enqueue(item: T) -> Void
    fn dequeue() -> T?
    fn peek() -> T?
    fn is_empty() -> Bool
    fn size() -> Int
}
"#
}

/// Stack implementation signature
pub fn stack_omni() -> &'static str {
    r#"// std.stack - LIFO Stack
struct Stack<T> {
    items: List<T>
}

impl Stack<T> {
    fn new() -> Stack<T>
    fn push(item: T) -> Void
    fn pop() -> T?
    fn peek() -> T?
    fn is_empty() -> Bool
    fn size() -> Int
}
"#
}

/// Cache implementation signature
pub fn cache_omni() -> &'static str {
    r#"// std.cache - In-Memory Cache
struct CacheEntry<T> {
    value: T,
    expires_at: Int?
}

struct Cache<T> {
    entries: Map<String, CacheEntry<T>>
}

impl Cache<T> {
    fn new() -> Cache<T>
    fn set(key: String, value: T, ttl_seconds: Int?) -> Void
    fn get(key: String) -> T?
    fn has(key: String) -> Bool
    fn delete(key: String) -> Bool
    fn clear() -> Void
    fn size() -> Int
}
"#
}

/// Auth implementation signature
pub fn auth_omni() -> &'static str {
    r#"// std.auth - Authentication
struct User {
    id: String,
    email: String,
    password_hash: String,
    roles: List<String>
}

struct Session {
    token: String,
    user_id: String,
    expires_at: Int
}

fn hash_password(password: String) -> String
fn verify_password(password: String, hash: String) -> Bool
fn generate_token() -> String
fn create_session(user_id: String) -> Session
fn validate_session(token: String) -> User?
fn has_role(user: User, role: String) -> Bool
"#
}

/// Time implementation signature
pub fn time_omni() -> &'static str {
    r#"// std.time - Date and Time
struct DateTime {
    year: Int,
    month: Int,
    day: Int,
    hour: Int,
    minute: Int,
    second: Int
}

fn now() -> DateTime
fn timestamp() -> Int
fn parse(s: String, format: String) -> DateTime?
fn format(dt: DateTime, format: String) -> String
fn add_days(dt: DateTime, days: Int) -> DateTime
fn diff_seconds(a: DateTime, b: DateTime) -> Int
"#
}

/// Crypto implementation signature
pub fn crypto_omni() -> &'static str {
    r#"// std.crypto - Cryptography
fn sha256(data: String) -> String
fn sha512(data: String) -> String
fn md5(data: String) -> String
fn hmac(key: String, data: String) -> String
fn encrypt(data: String, key: String) -> String
fn decrypt(data: String, key: String) -> String
fn random_bytes(length: Int) -> String
fn uuid() -> String
"#
}

/// List all stdlib modules
pub fn list_modules() {
    println!("{}", "📚 Omni Standard Library".cyan().bold());
    println!();
    
    let modules = [
        StdModule::Queue, StdModule::Stack, StdModule::Cache, StdModule::Auth,
        StdModule::Http, StdModule::Json, StdModule::Crypto, StdModule::Time,
        StdModule::Random, StdModule::Regex,
    ];
    
    for m in modules {
        println!("  {} - {}", m.name().green(), m.description());
    }
}

/// Get module source
pub fn get_module_source(module: StdModule) -> &'static str {
    match module {
        StdModule::Queue => queue_omni(),
        StdModule::Stack => stack_omni(),
        StdModule::Cache => cache_omni(),
        StdModule::Auth => auth_omni(),
        StdModule::Time => time_omni(),
        StdModule::Crypto => crypto_omni(),
        _ => "// Not implemented yet",
    }
}
