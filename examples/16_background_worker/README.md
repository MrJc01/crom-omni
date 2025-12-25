# Background Worker

**Level 4: Systems & Networks**

Worker pools and parallelism.

## Supported Modes

| Mode        | Supported | What Happens         |
| ----------- | --------- | -------------------- |
| `--cmd`     | ✅ Yes    | Simulates task queue |
| `--app`     | ❌ No     | Terminal only        |
| `--web`     | ❌ No     | Terminal only        |
| `--web-app` | ❌ No     | Terminal only        |

## Run Command

```powershell
.\omni run examples/16_background_worker/src/main.omni --cmd
```

## What It Demonstrates

- Task queue simulation
- Worker pool pattern
- Async processing concepts
