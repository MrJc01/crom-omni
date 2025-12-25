# Animated Solar System

**Level 3: Visual & 3D**

Complex 3D animation with orbital physics.

## Supported Modes

| Mode        | Supported  | What Happens                                              |
| ----------- | ---------- | --------------------------------------------------------- |
| `--cmd`     | ❌ No      | Browser required                                          |
| `--app`     | ❌ No      | Needs browser                                             |
| `--web`     | ✅ **Yes** | **Opens solar system animation at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens animation in browser automatically**              |

## Run Commands

```powershell
# Start server
.\omni run examples/10_animated_solar_system/src/main.omni --web

# Or auto-open browser
.\omni run examples/10_animated_solar_system/src/main.omni --web-app
```

## What It Demonstrates

- Multiple 3D objects (Sun, Earth, Moon)
- Orbital animation physics
- Three.js scene management
