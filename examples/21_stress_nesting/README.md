# Stress Nesting

**Level 5: Showroom**

Stress test for deeply nested structures.

## Supported Modes

| Mode        | Supported | What Happens       |
| ----------- | --------- | ------------------ |
| `--cmd`     | ✅ Yes    | Tests deep nesting |
| `--app`     | ❌ No     | Terminal only      |
| `--web`     | ❌ No     | Terminal only      |
| `--web-app` | ❌ No     | Terminal only      |

## Run Command

```powershell
.\omni run examples/21_stress_nesting/src/main.omni --cmd
```

## What It Demonstrates

- Deep function call chains
- Nested conditionals
- Compiler stress testing
