# OMNI BIBLE: The Sovereign System Codex

> "One Code to Rule Them All, One Code to Find Them, One Code to Bring Them All and in the Darkness Bind Them (to a single source of truth)."

## Book I: Genesis (Philosophy)

The **Omni Sovereign System** is not just a language; it is a declaration of independence from the chaos of the software ecosystem.

### The Doctrine of Sovereignty

1.  **Logic is Eternal**: Your business logic should survive framework deaths (React -> Vue -> Svelte -> ?).
2.  **Write Once, Manifest Everywhere**: A single `.omni` file can become a Python script, a Node.js server, or a Rust binary.
3.  **Zero Dependency (Goal)**: The final system will compile itself and run without external runtimes.

---

## Book II: Architecture (The Machine)

The system is composed of three trinities:

### 1. The Core (Rust)

The compiler (`omnic`) is the heart. Written in Rust for speed and safety. It parses `.omni` files, builds an AST (Abstract Syntax Tree), and transmutes it into the Target Language.

### 2. The Soul (Omni Language)

A statically typed, high-level language inspired by Rust, TypeScript, and C. It enforces correctness before compilation.

### 3. The Manifestation (Targets)

The output of the metamorphosis:

- **JS/TS**: For Web and Node.js ecosystems.
- **Python**: For AI, Data Science, and Scripting.
- **C/Rust** (Coming Soon): For native performance and self-hosting.

---

## Book III: Syntax (The Laws)

### Variables & Types

```rust
let immutable: string = "Eternal";
mut evanescent: i64 = 42;
```

### Structures (Data Shapes)

```rust
struct Entity {
    id: i64,
    name: string,
    is_active: bool
}
```

### Capsules (Modules)

```rust
capsule MathCore {
    fn add(a: i64, b: i64) -> i64 {
        return a + b;
    }
}
```

### Flow Control

```rust
if x > 10 {
    print("Large");
} else {
    print("Small");
}

for item in list {
    print(item);
}
```

---

## Book IV: The Bridge (Native Interop)

When the abstraction leaks, use the **Native Bridge**. This is the only place where platform-specific code is allowed.

```rust
fn web_alert(msg: string) {
    native "js" {
        alert(msg);
    }
    native "python" {
        print("Alert: " + msg);
    }
}
```

**WARNING**: Overuse of `native` breaks Sovereignty. Use standard libraries (`std/*`) whenever possible.

---

## Book V: The Prophecy (Roadmap)

1.  **Phase 1**: Clean Foundation (Done).
2.  **Phase 2**: Quality Engine (Current).
3.  **Phase 3**: Universal Ingestion (Node/Laravel -> Omni).
4.  **Phase 4**: Self-Hosting (The Singularity - Omni compilation Omni).
