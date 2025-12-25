# Fullstack App

**Level 5: Showroom**

Complete fullstack application showing all layers working together.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     UI LAYER (@ui)                      │
│              Screen, Button, List, Card                 │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  SERVER LAYER (@server)                 │
│            Routes, Middleware, Auth                     │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  DATA LAYER (@entity)                   │
│              Models, Database, Cache                    │
└─────────────────────────────────────────────────────────┘
```

## Supported Modes

| Mode        | Supported  | What Happens                                      |
| ----------- | ---------- | ------------------------------------------------- |
| `--cmd`     | ✅ Yes     | Shows architecture simulation                     |
| `--app`     | ❌ No      | Web only                                          |
| `--web`     | ✅ **Yes** | **Interactive TODO app at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens TODO app in browser**                     |

## Run Commands

```powershell
# Terminal simulation
.\omni run examples/26_fullstack_app/src/main.omni --cmd

# Interactive web app
.\omni run examples/26_fullstack_app/src/main.omni --web-app
```

## What It Demonstrates

- `@entity` models with CRUD operations
- `@server` routes for API endpoints
- `@ui` components for user interface
- All three layers working together
