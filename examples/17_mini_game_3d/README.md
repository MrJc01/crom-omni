# Mini Game 3D

**Level 5: Showroom**

Full 3D game with collision detection.

## Supported Modes

| Mode        | Supported  | What Happens                               |
| ----------- | ---------- | ------------------------------------------ |
| `--cmd`     | ❌ No      | Browser required                           |
| `--app`     | ❌ No      | Needs browser                              |
| `--web`     | ✅ **Yes** | **PLAYABLE GAME at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens game in browser automatically**    |

> **Best Mode:** Use `--web-app` to play immediately!

## Run Commands

```powershell
# Start game server
.\omni run examples/17_mini_game_3d/src/main.omni --web

# Or auto-open browser
.\omni run examples/17_mini_game_3d/src/main.omni --web-app
```

## Controls

- **Arrow Left/Right** - Move player

## What It Demonstrates

- Three.js game development
- Keyboard input handling
- Collision detection (color changes on collision)
- Real-time game loop
