# Interactive UI Nodes

**Level 3: Visual & 3D**

Visual node editor with interactive elements.

## Supported Modes

| Mode        | Supported  | What Happens                                |
| ----------- | ---------- | ------------------------------------------- |
| `--cmd`     | ❌ No      | Browser required                            |
| `--app`     | ❌ No      | Needs browser                               |
| `--web`     | ✅ **Yes** | **Interactive UI at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens UI in browser automatically**       |

## Run Commands

```powershell
.\omni run examples/11_interactive_ui_nodes/src/main.omni --web
# Open: http://localhost:3000

.\omni run examples/11_interactive_ui_nodes/src/main.omni --web-app
```

## What It Demonstrates

- DOM manipulation
- Interactive buttons
- Visual node workflow
- `@visual:position` annotations
