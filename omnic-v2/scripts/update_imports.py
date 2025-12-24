import os

files = [
    "src/studio/server.omni",
    "src/studio/runner.omni",
    "src/core/tui.omni",
    "src/core/studio_graph.omni",
    "src/core/studio_engine.omni",
    "src/core/package_manager.omni",
    "src/core/ghost_writer.omni",
    "src/core/app_packager.omni",
    "src/core/bootstrap.omni",
    "src/contracts/registry.omni",
    "src/commands/cmd_package.omni",
    "src/commands/cmd_build.omni",
    "src/commands/cmd_test.omni",
    "src/commands/cmd_setup.omni",
    "src/commands/cmd_run.omni"
]

for f in files:
    path = os.path.abspath(f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = content.replace('import "lib/terminal.omni";', 'import "../lib/terminal.omni";')
        
        if content != new_content:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"No change in {f}")
    else:
        print(f"Missing {f}")
