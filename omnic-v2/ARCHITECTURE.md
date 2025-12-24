# Omnic-v2 Architecture

## Overview

Omnic-v2 is a modular, self-hosted compiler designed for extensibility and multi-target support. It features a facade-based architecture for its core components, allowing for clean separation of concerns and easy addition of new features.

## Module Structure

The codebase is organized into vertical slices based on functionality:

### 1. Core (`src/core/`)

The heart of the compiler.

- **Lexer/Parser:** Converts source code into an AST.
- **AST:** Defines the structure of the Omni language.
- **Codegen:** Uses a strategy pattern to support multiple targets.
  - `codegen.omni` acts as a facade.
  - `codegen/js.omni` and `codegen/python.omni` implement specific logic.

### 2. Commands (`src/commands/`)

Each CLI command is an isolated module, dispatched by `main.omni`.

- `cmd_run`: JIT-like execution.
- `cmd_build`: AOT compilation.
- `cmd_studio`: Launches the IDE.
- `cmd_registry`: Manages contracts/packages.

### 3. Studio (`src/studio/`)

The visual programming IDE.

- **Engine:** Manages project state and execution (`project`, `runner`, `server`).
- **Graph:** Handles the AST <-> Visual Graph bidirectional mapping (`graph_convert`, `graph_actions`).

### 4. Contracts (`src/contracts/`)

The standard library abstraction layer.

- **Interfaces:** Defines canonical signatures (e.g., `std.io.print`).
- **Implementations:** Target-specific code (e.g., `console.log` for JS).
- **Registry:** Resolves calls at compile-time or runtime.
- Allows the same Omni code to run on Node.js, Python, or even C (via `impl_cnative`).

### 5. Lib (`src/lib/`)

Shared utilities.

- `std.omni`: The standard library exposed to user code.
- `cli.omni`: Helpers for terminal output and creating CLIs.

## Build System

The build process (`scripts/build.py`) is a Python script that:

1. Compiles all `.omni` modules to `.js` using the bootstrap compiler (with native block filtering).
2. Bundles them into a single `dist/omni_bundle.js`.
3. Handles directory recursion and export hoisting.
4. Creates the `omni` executable (via `omni.cmd` wrapper).

## Data Flow

1. **Source Code** -> **Lexer** -> **Tokens**
2. **Tokens** -> **Parser** -> **AST**
3. **AST** -> **Codegen** -> **Target Code** (JS/Py)
4. **Target Code** -> **Runtime/Execution**
