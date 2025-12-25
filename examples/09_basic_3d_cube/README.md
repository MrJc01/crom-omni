# Basic 3D Cube

**Level 3: Visual & 3D**

Demonstrates Three.js 3D scene rendering.

## Supported Modes

| Mode        | Supported  | What Happens                                                 |
| ----------- | ---------- | ------------------------------------------------------------ |
| `--cmd`     | ❌ No      | Browser required for 3D                                      |
| `--app`     | ❌ No      | Needs browser WebGL                                          |
| `--web`     | ✅ **Yes** | **Starts server, open http://localhost:3000 to see 3D cube** |
| `--web-app` | ✅ **Yes** | **Starts server AND opens browser automatically**            |

> **Best Mode:** Use `--web` or `--web-app` for this example!

## Run Commands

```powershell
# Start server only (manually open browser)
.\omni run examples/09_basic_3d_cube/src/main.omni --web
# Then open: http://localhost:3000

# Start server AND open browser
.\omni run examples/09_basic_3d_cube/src/main.omni --web-app
```

## What It Demonstrates

- Three.js integration
- 3D scene creation
- WebGL rendering
- Animation loop
- Rotating wireframe cube
