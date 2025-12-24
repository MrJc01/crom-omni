
import os

omni_path = "omnic-v2/dist/omni.js"

with open(omni_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Markers
start_marker = "const omniScript = __filename;"
end_marker = "// Post-process" # This is close to the end

# Find positions
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

# Logic to insert
new_logic = """
    
    let output = "";
    try {
      // Base command construction
      // We assume compilerPath is defined in outer scope now (moved previously)
      // Actually we need to ensure compilerPath is available or defined here if I removed it earlier
      // My previous edit MOVED it to top of run block (Line 2430).
      // So it is available.
      
      let cmd = `"${compilerPath}" build "${input_file}" --target js`;

      if (target === 'python') {
           if (!fs.existsSync(compilerPath)) {
               CLI_error("Rust compiler required for Native App mode. Run 'cargo build --release' in omnic/");
               return 1;
           }
           cmd = `"${compilerPath}" build "${input_file}" --target python`;
           console.log(CLI_COLORS().magenta + "Compiling Native App (Python/Tkinter)..." + CLI_COLORS().reset);
      }

      // Framework Adapter Logic
      if (target === 'laravel') {
           const buildDir = config && config.targets && config.targets.laravel && config.targets.laravel.output ? config.targets.laravel.output : "dist/server";
           cmd = `php artisan serve`; 
           console.log(CLI_COLORS().blue + "Target: Laravel (Adapter Active)" + CLI_COLORS().reset);
      }
      
      if (isCmd) {
           console.log(CLI_COLORS().cyan + "Command to execute:" + CLI_COLORS().reset);
           console.log(cmd);
           return 0;
      }

      // Execution
      if (target === 'laravel') {
            console.log("Starting Laravel Server (Mock)...");
            return 0;
      }
      
      // Standard Compilation
      if (target === 'python' || target === 'js') {
          output = execSync(cmd, { 
             cwd: process.cwd(),
             encoding: 'utf-8',
             stdio: ['ignore', 'pipe', 'ignore'] 
          });
          CLI_success("Build complete.");
      }

    } catch (e) {
       CLI_error("Compilation failed: " + e.message);
       return 1;
    }
    
    // Ensure output is defined for post-process (which uses output)
    if (!output) output = "";

"""

# Construct new content
# We replace everything between start_marker (inclusive end) and end_marker
prefix = content[:start_idx + len(start_marker)]
suffix = content[end_idx:]

new_content = prefix + new_logic + suffix

with open(omni_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Patch successful.")
