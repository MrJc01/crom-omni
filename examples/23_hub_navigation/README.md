# Hub Navigation

**Level 5: Showroom**

Navigation hub with routing.

## Supported Modes

| Mode        | Supported  | What Happens                               |
| ----------- | ---------- | ------------------------------------------ |
| `--cmd`     | ❌ No      | Browser required                           |
| `--app`     | ❌ No      | Needs browser                              |
| `--web`     | ✅ **Yes** | **Navigation UI at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens hub UI in browser**                |

## Run Commands

```powershell
.\omni run examples/23_hub_navigation/src/main.omni --web
# Open: http://localhost:3000

.\omni run examples/23_hub_navigation/src/main.omni --web-app
```

## What It Demonstrates

- Navigation grid layout
- Click-based routing
- CSS styling (gradients, hover effects)
- DOM content updates
