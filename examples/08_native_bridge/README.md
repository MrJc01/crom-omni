# Native Bridge

**Level 2: Integration**

Demonstrates native code injection for JS/Python/C.

## Supported Modes

| Mode        | Supported  | What Happens                         |
| ----------- | ---------- | ------------------------------------ |
| `--cmd`     | ✅ Yes     | Runs native code, prints to terminal |
| `--app`     | ⚠️ Limited | Runs Python native blocks            |
| `--web`     | ❌ No      | Terminal only                        |
| `--web-app` | ❌ No      | Terminal only                        |

## Run Commands

```powershell
# JavaScript native blocks
.\omni run examples/08_native_bridge/src/main.omni --cmd

# Python native blocks
.\omni run examples/08_native_bridge/src/main.omni --app
```

## What It Demonstrates

- `native "js" { }` blocks
- `native "python" { }` blocks
- Platform detection
- Cross-platform abstractions
