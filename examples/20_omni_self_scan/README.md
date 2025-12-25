# Omni Self Scan

**Level 5: Showroom**

Meta-programming: Omni analyzes Omni code.

## Supported Modes

| Mode        | Supported | What Happens                |
| ----------- | --------- | --------------------------- |
| `--cmd`     | ✅ Yes    | Analyzes code, prints stats |
| `--app`     | ❌ No     | Terminal only               |
| `--web`     | ❌ No     | Terminal only               |
| `--web-app` | ❌ No     | Terminal only               |

## Run Command

```powershell
.\omni run examples/20_omni_self_scan/src/main.omni --cmd
```

## What It Demonstrates

- Regex pattern matching
- Code analysis (counting functions, structs)
- Meta-programming concepts
