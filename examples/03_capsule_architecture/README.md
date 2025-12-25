# Capsule Architecture

**Level 1: Core Fundamentals**

Demonstrates modular organization with capsules.

## Supported Modes

| Mode        | Supported | What Happens     |
| ----------- | --------- | ---------------- |
| `--cmd`     | ✅ Yes    | Runs in terminal |
| `--app`     | ❌ No     | Terminal only    |
| `--web`     | ❌ No     | Terminal only    |
| `--web-app` | ❌ No     | Terminal only    |

## Run Command

```powershell
.\omni run examples/03_capsule_architecture/src/main.omni --cmd
```

## What It Demonstrates

- `capsule` keyword for module organization
- Encapsulated functions (`math.add()`, `string_utils.repeat()`)
- Code organization patterns
