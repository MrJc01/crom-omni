# 🎨 Omni Examples Gallery

A curated collection of 26 examples showcasing Omni's capabilities.

## 🚀 Quick Start - Examples Hub

Run the interactive hub to explore all examples:

```powershell
node examples\hub.js
```

This opens a menu where you can:

1. Browse all examples with descriptions
2. See which modes each example supports
3. Select and run any example instantly

---

## Run Modes Explained

| Mode           | Flag        | What It Does                      |
| -------------- | ----------- | --------------------------------- |
| **Terminal**   | `--cmd`     | Runs in terminal (Node.js/Python) |
| **Native App** | `--app`     | Opens Tkinter window (Python)     |
| **Web Server** | `--web`     | Starts HTTP server on port 3000   |
| **Web App**    | `--web-app` | Starts server + opens browser     |

---

## Examples by Category

### Level 1: Core Fundamentals (Terminal)

| #   | Example              | Modes | Run                                                               |
| --- | -------------------- | ----- | ----------------------------------------------------------------- |
| 01  | hello_universal      | cmd   | `.\omni run examples\01_hello_universal\src\main.omni --cmd`      |
| 02  | flow_control         | cmd   | `.\omni run examples\02_flow_control\src\main.omni --cmd`         |
| 03  | capsule_architecture | cmd   | `.\omni run examples\03_capsule_architecture\src\main.omni --cmd` |
| 04  | types_and_structs    | cmd   | `.\omni run examples\04_types_and_structs\src\main.omni --cmd`    |

### Level 2: Integration (Terminal)

| #   | Example            | Modes    | Description        |
| --- | ------------------ | -------- | ------------------ |
| 05  | http_api_client    | cmd      | HTTP requests      |
| 06  | file_system_master | cmd      | File I/O           |
| 07  | json_transformer   | cmd      | JSON parsing       |
| 08  | native_bridge      | cmd, app | Native code blocks |

### Level 3: Visual & 3D (Web/App)

| #      | Example               | Modes            | Run                                                         |
| ------ | --------------------- | ---------------- | ----------------------------------------------------------- |
| 09     | basic_3d_cube         | **web, web-app** | `.\omni run examples\09_basic_3d_cube\src\main.omni --web`  |
| 10     | animated_solar_system | **web, web-app** | 3D orbital animation                                        |
| 11     | interactive_ui_nodes  | **web, web-app** | Visual node editor                                          |
| **12** | desktop_window        | **app**          | `.\omni run examples\12_desktop_window\src\main.omni --app` |

### Level 4: Systems & Networks (Terminal)

| #   | Example            | Modes | Description          |
| --- | ------------------ | ----- | -------------------- |
| 13  | secure_hasher      | cmd   | SHA-256 crypto       |
| 14  | sql_agnostic_query | cmd   | Database abstraction |
| 15  | p2p_mesh_node      | cmd   | P2P networking       |
| 16  | background_worker  | cmd   | Worker pools         |

### Level 5: Showroom

| #      | Example               | Modes       | Run                                                           |
| ------ | --------------------- | ----------- | ------------------------------------------------------------- |
| **17** | mini_game_3d          | **web-app** | `.\omni run examples\17_mini_game_3d\src\main.omni --web-app` |
| **18** | payment_flow          | **web-app** | Payment UI demo                                               |
| 19     | legacy_converter_demo | cmd         | Code ingestion                                                |
| 20     | omni_self_scan        | cmd         | Meta-programming                                              |
| 21     | stress_nesting        | cmd         | Stress test                                                   |
| 22     | stress_types          | cmd         | Type stress test                                              |
| **23** | hub_navigation        | **web-app** | Navigation hub                                                |

### Level 6: Standard Library & Adapters

| #      | Example           | Modes        | What It Shows                          |
| ------ | ----------------- | ------------ | -------------------------------------- |
| **24** | std_ui_demo       | **app, web** | `import std/ui` - Global UI functions  |
| **25** | adapters_showcase | cmd          | `@entity`, `@server`, `@ui` decorators |
| **26** | fullstack_app     | **web-app**  | Complete Task Manager with all layers  |

---

## Standard Library Usage

Instead of writing `native` blocks, use global library functions:

```omni
import "std/ui.omni";
import "std/core.omni";

let win = Window_create(config);
let btn = Button_create(win, "Click", 20, 20);
UI_run();
```

**Same code runs on Tkinter (Python) AND Browser (JS)!**

---

## Adapter Decorators

Write framework-agnostic code:

```omni
@entity struct User { id: i64, name: string }

@server.get("/users")
fn getUsers() { ... }

@ui.screen("Dashboard")
capsule Dashboard { ... }
```

Omni compiles this to: React, Laravel, FastAPI, or any configured target.

---

_Built with Omni - The Hybrid Metamorphosis Compiler_ 🦎
