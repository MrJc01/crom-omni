# Omnic V2 Compiler

A modular, self-hosted compiler written in Omni that compiles Omni source code to JavaScript or Python.

## Quick Start

### Build the Compiler

```bash
python scripts/build.py
```

### Run (JIT Mode)

```bash
omni run src/examples/hello.omni
```

### Compile to JavaScript

```bash
omni build src/myfile.omni --target js
```

### Compile to Python

```bash
omni build src/myfile.omni --target python
```

### Omni Studio (IDE)

```bash
omni studio
```

## Features

- **Multi-target**: Generates JS or Python
- **Modular Architecture**: Split into core, studio, contracts, and commands
- **Omni Studio**: Visual programming environment (experimental)
- **Contract System**: Standard library interfaces with pluggable implementations
- **Native blocks**: Embed target-specific code with `native "js" { ... }` or `native "py" { ... }`

## Source Structure

```
src/
├── main.omni            # Entry point dispatcher
├── commands/            # CLI command implementations
├── core/
│   ├── ast.omni         # AST node definitions
│   ├── lexer.omni       # Tokenizer
│   ├── parser.omni      # Parser
│   ├── codegen/         # Code generation modules (Base, JS, Py)
│   └── ...
├── studio/              # Studio IDE modules (Server, Graph, UI)
├── contracts/           # Standard library & Registry
└── lib/                 # Shared libraries (std, cli)
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed overview of the compiler design.
