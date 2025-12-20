# Omnic V2 Compiler

A self-hosted compiler written in Omni that compiles Omni source code to JavaScript or Python.

## Quick Start

### Compile to JavaScript (default)

```bash
node dist/main.js src/myfile.omni output.js
```

### Compile to Python

```bash
node dist/main.js src/myfile.omni output.py --target python
```

## Self-Hosting Test

Compile the compiler's own token module to Python:

```bash
node dist/main.js src/core/token.omni dist/core/token.py --target python
```

## Features

- **Multi-target**: Generates JS or Python
- **Auto-exports**: Automatically generates `module.exports` for JS
- **Native blocks**: Embed target-specific code with `native "js" { ... }` or `native "py" { ... }`
- **Structs**: Compile to JS classes or Python classes with `__init__`

## Source Structure

```
src/
├── main.omni          # Entry point
└── core/
    ├── token.omni     # Token definitions
    ├── lexer.omni     # Tokenizer
    ├── parser.omni    # Parser
    ├── codegen.omni   # Code generator (JS + Python)
    ├── ast.omni       # AST node definitions
    └── io.omni        # File I/O helpers
```
