# Hello Universal

**Level 1: Core Fundamentals**

Demonstrates Omni's core philosophy: **write once, run anywhere**.

## Supported Modes

| Mode        | Supported  | What Happens                                       |
| ----------- | ---------- | -------------------------------------------------- |
| `--cmd`     | ✅ Yes     | Prints output to terminal                          |
| `--app`     | ⚠️ Limited | Prints to terminal (no GUI window)                 |
| `--web`     | ⚠️ Limited | Server starts but page is blank (console.log only) |
| `--web-app` | ⚠️ Limited | Same as --web                                      |

> **Note:** This example uses `print()` which only outputs to terminal/console. It does NOT open windows or render in browser. Use examples 09-12 for visual modes.

## Run Commands

```powershell
# Recommended: Terminal mode
.\omni run examples/01_hello_universal/src/main.omni --cmd

# Also works but just prints to terminal:
.\omni run examples/01_hello_universal/src/main.omni --app
```

## What It Demonstrates

- Multi-target compilation (JS/Python/C)
- Basic function definitions
- `native` blocks for platform-specific code
- String operations

## Key Code

```omni
fn print_universal(msg: string) {
    native "js" { console.log(msg); }
    native "python" { print(msg) }
}
```
