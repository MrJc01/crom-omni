# Secure Hasher

**Level 4: Systems & Networks**

SHA-256 cryptography demonstration.

## Supported Modes

| Mode        | Supported | What Happens                 |
| ----------- | --------- | ---------------------------- |
| `--cmd`     | ✅ Yes    | Hashes string, prints result |
| `--app`     | ❌ No     | Terminal only                |
| `--web`     | ❌ No     | Terminal only                |
| `--web-app` | ❌ No     | Terminal only                |

## Run Command

```powershell
.\omni run examples/13_secure_hasher/src/main.omni --cmd
```

## What It Demonstrates

- SHA-256 hashing (`crypto.createHash` in JS, `hashlib` in Python)
- Cross-platform crypto abstraction
