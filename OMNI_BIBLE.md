# OMNI BIBLE v1.5

## 1. Architecture

Omni is a meta-language designed to be the universal source of truth for software systems. It abstracts away the implementation details of specific languages and frameworks, allowing developers to define _what_ they want, while the Omni compiler handles _how_ it is implemented.

### Core Components

- **Parser:** Validates Omni syntax and constructs the AST.
- **AST (Abstract Syntax Tree):** The central representation of the code.
- **Transformers:** Manipulate the AST (metamorphosis, optimization).
- **Generators:** Output code for specific targets (JS, Python, PHP, C).

## 2. Syntax & Capsules

Omni code is organized into **Capsules**. A capsule is a self-contained unit of functionality.

```omni
capsule UserManagement {
    @entity
    struct User {
        id: int,
        username: string,
        email: string
    }

    flow CreateUser(name: string, mail: string) -> User {
        // Logic here
    }
}
```

### Ingestion

Existing code can be ingested into Omni capsules using the `ingest` command (planned).

## 3. Metamorphosis

Omni can transform its internal representation into various frameworks.

- **--laravel:** Generates Controllers, Models, Routes.
- **--react:** Generates Components, Hooks, State.
- **--c:** Generates highly efficient native code (Sovereign goal).

## 4. Ingestion Guide

(Guidelines for converting legacy projects to Omni - To be expanded)

1. Identify domain entities.
2. Map data flows to Omni `flow` blocks.
3. Extract UI components to Omni UI nodes.
