# OMNI BIBLE v1.6

## 1. Architecture

Omni is a meta-language designed to be the universal source of truth for software systems. It abstracts away the implementation details of specific languages and frameworks, allowing developers to define _what_ they want, while the Omni compiler handles _how_ it is implemented.

### Core Components

- **Parser:** Validates Omni syntax and constructs the AST.
- **AST (Abstract Syntax Tree):** The central representation of the code.
- **Transformers:** Manipulate the AST (metamorphosis, optimization).
- **Generators:** Output code for specific targets (JS, Python, PHP, C, Bytecode).
- **Hollow VM:** A stack-based virtual machine for immediate execution and visual tracing.

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

Existing code can be ingested into Omni capsules using the `ingest` command. It supports semantic mapping of regex-based rules for PHP (Laravel) and JS (React).

## 3. Metamorphosis & Targets

Omni can transform its internal representation into various frameworks.

- **--laravel:** Generates Controllers, Models, Routes.
- **--react:** Generates Components, Hooks, State.
- **--c:** Generates highly efficient native code (Sovereign goal) with Reference Counting.
- **--bytecode:** Runs directly on the Hollow VM.

## 4. Ingestion Guide (Protocolo de Ingestão)

To convert legacy projects to Omni:

1.  **Ingest:** Run `omni ingest <path>`. The system detects:
    - **Models:** mapped to `@entity` structs.
    - **Routes:** mapped to `@route` flows.
    - **DB Queries:** mapped to `@database` flows (SQL/ORM).
2.  **Refine:** Manually type-check generated Omni code.
3.  **Metamorph:** Compile back to target structure or run natively.

## 5. Hollow VM Architecture

The Hollow VM is a stack-based machine designed for "Intellectual Independence" from host runtimes.

- **OpCodes:** Simple instruction set (`LoadConst`, `StoreVar`, `Add`, `Jump`, `Print`).
- **Execution:** Fetch-Decode-Execute loop.
- **Visual Trace:** `omni studio` provides visible heartbeat of execution.
- **State:** Hybrid memory model (currently simplified, moving to RC).

## 6. Gerenciamento de Memória (Soberania)

1.  **Targets Gerenciados (JS/Python):** Delega para o GC do host.
2.  **Target C (Soberano):** Implementa **Reference Counting (RC)** intrusivo.
    - `omni_retain(ptr)` / `omni_release(ptr)`.
    - Injetado pelo compilador em atribuições.
