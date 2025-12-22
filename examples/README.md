# 🎨 Omni Examples Gallery

A curated collection of 20 examples showcasing Omni's capabilities, from basic syntax to complete applications.

## Quick Start

```powershell
# From crom-omni root directory
.\omni compile examples/01_hello_universal.omni --target js
node output.js
```

## Multi-Target Compilation

The same `.omni` file can compile to different targets:

```powershell
# JavaScript (Node.js)
.\omni compile examples/01_hello_universal.omni --target js

# Python
.\omni compile examples/01_hello_universal.omni --target python

# C (coming soon)
.\omni compile examples/01_hello_universal.omni --target c
```

---

## Examples Reference

| #                                        | Example                                                        | What It Proves                           | Command                                                 |
| ---------------------------------------- | -------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Level 1: Core Fundamentals**           |                                                                |                                          |
| 01                                       | [01_hello_universal.omni](01_hello_universal.omni)             | Multi-target compilation (JS/Python/C)   | `.\omni compile examples/01_hello_universal.omni`       |
| 02                                       | [02_flow_control.omni](02_flow_control.omni)                   | if/else, while loops, recursion          | `.\omni compile examples/02_flow_control.omni`          |
| 03                                       | [03_capsule_architecture.omni](03_capsule_architecture.omni)   | Modular organization with capsules       | `.\omni compile examples/03_capsule_architecture.omni`  |
| 04                                       | [04_types_and_structs.omni](04_types_and_structs.omni)         | Type system: primitives, structs, arrays | `.\omni compile examples/04_types_and_structs.omni`     |
| **Level 2: Integration & Metamorphosis** |                                                                |                                          |
| 05                                       | [05_http_api_client.omni](05_http_api_client.omni)             | HTTP requests (std.http)                 | `.\omni compile examples/05_http_api_client.omni`       |
| 06                                       | [06_file_system_master.omni](06_file_system_master.omni)       | File I/O operations                      | `.\omni compile examples/06_file_system_master.omni`    |
| 07                                       | [07_json_transformer.omni](07_json_transformer.omni)           | JSON parsing & transformation            | `.\omni compile examples/07_json_transformer.omni`      |
| 08                                       | [08_native_bridge.omni](08_native_bridge.omni)                 | Native code injection (JS/Python/C)      | `.\omni compile examples/08_native_bridge.omni`         |
| **Level 3: Visual & 3D Experience**      |                                                                |                                          |
| 09                                       | [09_basic_3d_cube.omni](09_basic_3d_cube.omni)                 | Three.js 3D scene                        | `.\omni compile examples/09_basic_3d_cube.omni`         |
| 10                                       | [10_animated_solar_system.omni](10_animated_solar_system.omni) | Complex 3D animation, physics            | `.\omni compile examples/10_animated_solar_system.omni` |
| 11                                       | [11_interactive_ui_nodes.omni](11_interactive_ui_nodes.omni)   | Visual editor with @visual:\*            | `.\omni studio examples/11_interactive_ui_nodes.omni`   |
| 12                                       | [12_desktop_window.omni](12_desktop_window.omni)               | Native GUI (std.gui)                     | `.\omni compile examples/12_desktop_window.omni`        |
| **Level 4: Systems & Networks**          |                                                                |                                          |
| 13                                       | [13_secure_hasher.omni](13_secure_hasher.omni)                 | SHA-256, HMAC (std.crypto)               | `.\omni compile examples/13_secure_hasher.omni`         |
| 14                                       | [14_sql_agnostic_query.omni](14_sql_agnostic_query.omni)       | Database abstraction layer               | `.\omni compile examples/14_sql_agnostic_query.omni`    |
| 15                                       | [15_p2p_mesh_node.omni](15_p2p_mesh_node.omni)                 | P2P mesh networking                      | `.\omni compile examples/15_p2p_mesh_node.omni`         |
| 16                                       | [16_background_worker.omni](16_background_worker.omni)         | Worker pools, parallelism                | `.\omni compile examples/16_background_worker.omni`     |
| **Level 5: Showroom (Complete Systems)** |                                                                |                                          |
| 17                                       | [17_mini_game_3d.omni](17_mini_game_3d.omni)                   | Full 3D game with collision              | `.\omni compile examples/17_mini_game_3d.omni`          |
| 18                                       | [18_payment_flow.omni](18_payment_flow.omni)                   | Payment server with audit trail          | `.\omni compile examples/18_payment_flow.omni`          |
| 19                                       | [19_legacy_converter_demo.omni](19_legacy_converter_demo.omni) | PHP/JS to Omni ingestion                 | `.\omni compile examples/19_legacy_converter_demo.omni` |
| 20                                       | [20_omni_self_scan.omni](20_omni_self_scan.omni)               | Meta-programming: Omni analyzes Omni     | `.\omni compile examples/20_omni_self_scan.omni`        |

---

## Running in Omni Studio

Open any example in the visual 3D editor:

```powershell
.\omni studio examples/11_interactive_ui_nodes.omni
```

Examples with `@visual:position` annotations will render as visual nodes on the canvas.

---

## Test All Examples

Validate all examples compile correctly:

```powershell
.\omni test-all
```

This compiles all 20 examples and reports success/failure for each.

---

## Categories Explained

### Level 1: Core Fundamentals

Basic language features every Omni developer should know.

### Level 2: Integration & Metamorphosis

Connecting Omni to the outside world: HTTP, files, JSON, native code.

### Level 3: Visual & 3D Experience

The unique differentiator: 3D programming, visual nodes, desktop GUIs.

### Level 4: Systems & Networks

Building robust systems: crypto, databases, P2P, concurrency.

### Level 5: Showroom

Complete, functional systems demonstrating Omni's full power.

---

## Contributing

Add new examples following the naming convention:

- `NN_descriptive_name.omni`
- Include header comments explaining the example
- Add `@visual:position` annotations for Studio compatibility
- Update this README with the new entry

---

_Built with Omni - The Hybrid Metamorphosis Compiler_ 🦎
