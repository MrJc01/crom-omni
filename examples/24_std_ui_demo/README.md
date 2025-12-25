# STD UI Demo

**Level 3: Visual & 3D**

Demonstrates `std/ui` library - global functions that work across platforms.

## The Power of Standard Library

Instead of writing `native` blocks, you use **abstracted global functions**:

```omni
import "std/ui.omni";

// Works on BOTH Tkinter (Python) AND Browser (JS)!
let win = Window_create(config);
let btn = Button_create(win, "Click Me", 20, 20);
Button_on_click(btn, myHandler);
UI_run();
```

## Supported Modes

| Mode        | Supported  | What Happens                                           |
| ----------- | ---------- | ------------------------------------------------------ |
| `--cmd`     | ❌ No      | GUI required                                           |
| `--app`     | ✅ **Yes** | **Native Tkinter window with buttons, labels, inputs** |
| `--web`     | ✅ **Yes** | **DOM elements at http://localhost:3000**              |
| `--web-app` | ✅ **Yes** | **Opens browser automatically**                        |

## Run Commands

```powershell
# Native desktop app (recommended)
.\omni run examples/24_std_ui_demo/src/main.omni --app

# Web version
.\omni run examples/24_std_ui_demo/src/main.omni --web
```

## Key Concepts

- `import "std/ui.omni"` - Import the universal UI library
- `Window_create(config)` - Creates window on ANY platform
- `Button_create(win, text, x, y)` - Cross-platform button
- `UI_run()` - Starts the event loop

**No more `native` blocks needed for common UI tasks!**
