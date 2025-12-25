# Stress Types

**Level 5: Showroom**

Stress test for type system.

## Supported Modes

| Mode        | Supported | What Happens      |
| ----------- | --------- | ----------------- |
| `--cmd`     | ✅ Yes    | Tests type system |
| `--app`     | ❌ No     | Terminal only     |
| `--web`     | ❌ No     | Terminal only     |
| `--web-app` | ❌ No     | Terminal only     |

## Run Command

```powershell
.\omni run examples/22_stress_types/src/main.omni --cmd
```

## What It Demonstrates

- Complex nested structs
- Type instantiation
- Compiler type handling
