# Building Native Desktop Apps with Omni

Omni now supports compiling directly to native desktop applications using Python and Tkinter as the backend. This allows you to create windowed applications that run independently of the web browser.

## Prerequisites

- **Python 3.x** installed and in your system PATH.
- **Tkinter** (usually included with standard Python installations).

## How to Run

To run an Omni file as a native application, use the `--app` flag:

```bash
./omni run examples/12_desktop_window.omni --app
```

## How it Works

1.  **Compilation**: `omnic` compiles your Omni code to Python (`--target python`).
2.  **Native Blocks**: The compiler looks for `native "python"` blocks in your code for OS-specific functionality.
3.  **Execution**: The CLI automatically executes the generated Python script.

## Example Code (`examples/12_desktop_window.omni`)

The `std.gui` simulation in this example uses flat functions to wrap Tkinter calls:

```rust
// Create a window
let config = WindowConfig {
    title: "My App",
    width: 800,
    height: 600,
    ...
};
let window = GUI_create_window(config);

// Add a button
let btn = GUI_add_button("Click Me", 50, 50, 100, 30);

// Handle events
fn on_click() {
    print("Button clicked!");
}
GUI_on_click(btn, on_click);

// Start the Event Loop
GUI_loop();
```

## Troubleshooting

- **Indentation Errors**: The compiler includes a "Smart Dedenter" that automatically fixes most indentation issues caused by mixing `native` blocks with Omni structures.
- **Missing Dependencies**: Ensure you have Python installed. If `tkinter` is missing, you may need to install `python-tk` (on Linux) or reinstall Python with the tcl/tk option (on Windows).
