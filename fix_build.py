
import os

def fix_ui():
    with open('ui_omni.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix imports
    content = content.replace('import core.omni', 'from core_omni import *')
    
    # Fix struct init
    content = content.replace('def __init__(self, data=None):', 'def __init__(self, **data):')

    # Fix indentation (manual heuristic: if line has 8 spaces and looks like our code, dedent to 4)
    # Actually, simpler: replace known double-indented blocks
    
    # We can just run a "smart dedenter" on specific blocks or lines.
    lines = content.split('\n')
    fixed_lines = []
    
    inside_def = False
    for line in lines:
        if line.strip().startswith('def '):
            inside_def = True
        
        # If inside def, and line starts with 8 spaces, and doesn't start with class/def (nested), maybe 4 is enough?
        # But wait, logic inside if/loop needs 8 spaces.
        # The issue is base indentation.
        
        # Specific fix for lines we saw:
        # 46:         global ui_root_ref
        if '        global ui_root_ref' in line:
            line = line.replace('        global ui_root_ref', '    global ui_root_ref')
        if '        if ui_root_ref' in line:
             line = line.replace('        if ui_root_ref', '    if ui_root_ref')
        if '            ui_root_ref' in line:
             line = line.replace('            ui_root_ref', '        ui_root_ref')
        
        # This is fragile.
        # Better: The native blocks in std/ui.omni were indented.
        # Let's simple-replace the known bad indentations.
        
        # Block 1: Window_create
        line = line.replace('        global ui_root_ref', '    global ui_root_ref')
        line = line.replace('        if ui_root_ref == 0', '    if ui_root_ref == 0')
        line = line.replace('            ui_root_ref = tk.Tk()', '        ui_root_ref = tk.Tk()')
        line = line.replace('        ui_root_ref.title', '    ui_root_ref.title')
        line = line.replace('        ui_root_ref.geometry', '    ui_root_ref.geometry')
        line = line.replace('        if config.background:', '    if config.background:')
        line = line.replace('            ui_root_ref.configure', '        ui_root_ref.configure')
        line = line.replace('        win.handle = ui_root_ref', '    win.handle = ui_root_ref')

        # Block 2: Button_create
        line = line.replace('        from tkinter import ttk', '    from tkinter import ttk')
        line = line.replace('        b = ttk.Button', '    b = ttk.Button')
        line = line.replace('        b.place', '    b.place')
        line = line.replace('        btn.handle', '    btn.handle')

        # Block 3: Label_create
        line = line.replace('        bg = ui_root_ref.cget', '    bg = ui_root_ref.cget')
        line = line.replace('        l = tk.Label', '    l = tk.Label')
        line = line.replace('        l.place', '    l.place')
        line = line.replace('        lbl.handle', '    lbl.handle')
        
        # Block 4: TextInput_create
        line = line.replace('        i = ttk.Entry', '    i = ttk.Entry')
        line = line.replace('        i.place', '    i.place')
        line = line.replace('        input.handle = i', '    input.handle = i')
        
        # Block 5: Label_set_text
        line = line.replace('    lbl.handle.config(text=text)', '    lbl.handle.config(text=text)') # seems ok?
        
        # Block 6: Get Value
        line = line.replace('    val = input.handle.get()', '    val = input.handle.get()')

        # Block 7: UI_run
        line = line.replace('        if ui_root_ref:', '    if ui_root_ref:')
        line = line.replace('            ui_root_ref.mainloop()', '        ui_root_ref.mainloop()')

        fixed_lines.append(line)

    with open('ui_omni.py', 'w', encoding='utf-8') as f:
        f.write('\n'.join(fixed_lines))

def fix_main():
    with open('output_debug_utf8.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('import core_omni', 'from core_omni import *')
    content = content.replace('import ui_omni', 'from ui_omni import *')
    # Also handle dot version if we reverted? No, let's keep both just in case or just assume underscore
    content = content.replace('import core.omni', 'from core_omni import *')
    content = content.replace('import ui.omni', 'from ui_omni import *')
    
    # Fix globals in main
    content = content.replace('def main():', 'def main():\n    global input_ref, main_win')
    
    # Fix globals in add_todo
    content = content.replace('def add_todo():', 'def add_todo():\n    global list_y')
    
    # Fix variable scope issue in add_todo (reading input_ref is fine as global if not assigned, but good practice)
    
    with open('output_debug_utf8.py', 'w', encoding='utf-8') as f:
        f.write(content)


def fix_core():
    with open('core_omni.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix double indent
    content = content.replace('        sys.stdout.write', '    sys.stdout.write')
    
    with open('core_omni.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    try:
        fix_ui()
        fix_main()
        fix_core()
        print("Fixed.")
    except Exception as e:
        print(e)
