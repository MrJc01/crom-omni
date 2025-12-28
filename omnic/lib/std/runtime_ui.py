# =============================================================================
# Omni UI Runtime (Tkinter Backend)
# =============================================================================

import tkinter as tk
from tkinter import ttk

# Global state
_app_root = None
_widgets = {}

# Struct definitions (matching Omni)
class WindowConfig:
    def __init__(self, title="Omni App", width=400, height=300, background="#f5f5f5"):
        self.title = title
        self.width = width
        self.height = height
        self.background = background

class TextInput:
    def __init__(self, handle=0, id=""):
        self.handle = handle
        self.id = id
        self._widget = None

class Label:
    def __init__(self, handle=0, id="", text=""):
        self.handle = handle
        self.id = id
        self.text = text
        self._widget = None

class Button:
    def __init__(self, handle=0, id="", text=""):
        self.handle = handle
        self.id = id
        self.text = text
        self._widget = None

# Factory Functions
def Window_create(config):
    global _app_root
    _app_root = tk.Tk()
    _app_root.title(config.title)
    _app_root.geometry(f"{config.width}x{config.height}")
    _app_root.configure(bg=config.background)
    return _app_root

def Label_create(parent, text, x, y):
    label = Label(text=text)
    label._widget = tk.Label(parent, text=text, bg=parent.cget('bg'))
    label._widget.place(x=x, y=y)
    return label

def Label_set_text(label, text):
    if label._widget:
        label._widget.config(text=text)
    label.text = text

def TextInput_create(parent, x, y):
    text_input = TextInput()
    text_input._widget = tk.Entry(parent, width=30)
    text_input._widget.place(x=x, y=y)
    return text_input

def TextInput_get_value(text_input):
    if text_input._widget:
        return text_input._widget.get()
    return ""

def Button_create(parent, text, x, y):
    btn = Button(text=text)
    btn._widget = tk.Button(parent, text=text)
    btn._widget.place(x=x, y=y)
    return btn

def Button_set_click(btn, callback):
    if btn._widget:
        btn._widget.config(command=callback)

def UI_run():
    global _app_root
    if _app_root:
        _app_root.mainloop()

# Legacy aliases
GUI_create_window = Window_create
GUI_add_button = Button_create
GUI_add_label = Label_create
GUI_add_input = TextInput_create
GUI_on_click = Button_set_click
GUI_loop = UI_run

# Omni print function wrapper
def omni_print(msg):
    """Omni print function that outputs to console"""
    import builtins
    builtins.print(msg)

__all__ = ['WindowConfig', 'TextInput', 'Label', 'Button', 
           'Window_create', 'Label_create', 'Label_set_text',
           'TextInput_create', 'TextInput_get_value', 
           'Button_create', 'Button_set_click', 'UI_run',
           'GUI_create_window', 'GUI_add_button', 'GUI_add_label',
           'GUI_add_input', 'GUI_on_click', 'GUI_loop', 'omni_print']

# Store the original print before any user code can override it
import builtins
_original_print = builtins.print

def print(msg):
    """Safe print wrapper that uses builtins.print to avoid recursion"""
    _original_print(msg)
