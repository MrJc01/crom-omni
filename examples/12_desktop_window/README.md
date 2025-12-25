# Desktop Window

**Level 3: Visual & 3D**

Native GUI with Python/Tkinter.

## Supported Modes

| Mode        | Supported  | What Happens                                                       |
| ----------- | ---------- | ------------------------------------------------------------------ |
| `--cmd`     | ⚠️ Limited | Terminal output only                                               |
| `--app`     | ✅ **Yes** | **OPENS NATIVE TKINTER WINDOW with buttons, labels, input fields** |
| `--web`     | ⚠️ Limited | Shows simulated window in browser                                  |
| `--web-app` | ⚠️ Limited | Shows simulated window                                             |

> **Best Mode:** Use `--app` to see the native desktop window!

## Run Command

```powershell
# Opens a real native desktop window
.\omni run examples/12_desktop_window/src/main.omni --app
```

## What It Demonstrates

- `GUI_create_window()` - Creates Tkinter window
- `GUI_add_button()` - Adds clickable buttons
- `GUI_add_label()` - Adds text labels
- `GUI_add_input()` - Adds text input fields
- `GUI_on_click()` - Event handlers
- `GUI_loop()` - Main event loop

## Requirements

- Python 3 with Tkinter (usually included by default)
