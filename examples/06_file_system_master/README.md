# File System Master

**Level 2: Integration**

Demonstrates file I/O operations.

## Supported Modes

| Mode        | Supported  | What Happens                           |
| ----------- | ---------- | -------------------------------------- |
| `--cmd`     | ✅ Yes     | Reads/writes files, prints to terminal |
| `--app`     | ⚠️ Limited | Terminal output only                   |
| `--web`     | ❌ No      | Browser can't access filesystem        |
| `--web-app` | ❌ No      | Browser can't access filesystem        |

## Run Command

```powershell
.\omni run examples/06_file_system_master/src/main.omni --cmd
```

## What It Demonstrates

- `read_file()` function
- `write_file()` function
- Cross-platform file I/O
