$ErrorActionPreference = "Stop"
# Use bootstrap compiler instead of Rust compiler (which has stricter semantic checking)
$Omnic = "node $PSScriptRoot/bootstrap/main.js"
$Dist = "dist"

# Ensure dirs
New-Item -ItemType Directory -Force "$Dist\core" | Out-Null
New-Item -ItemType Directory -Force "$Dist\lib" | Out-Null
New-Item -ItemType Directory -Force "$Dist\commands" | Out-Null

$Core = @("token", "lexer", "parser", "ast", "codegen", "codegen_hybrid", "vm", "framework_adapter", "ingestion", "package_manager", "contracts", "ghost_writer", "bootstrap", "studio_engine", "studio_graph", "app_packager", "tui")
$Lib = @("std", "terminal")
$Cmds = @("cmd_setup", "cmd_run", "cmd_build", "cmd_test", "cmd_package", "cmd_registry", "cmd_studio")

function Compile($file, $out) {
    Write-Host "Compiling $file"
    # Bootstrap compiler: node main.js source output --target js
    $c = node "$PSScriptRoot/bootstrap/main.js" $file $out --target js 2>&1
    # Filter out build logs from bootstrap compiler
    $filtered = $c | Where-Object { 
        $_ -notmatch "^Compilando Arquivo:" -and 
        $_ -notmatch "^Compiling:" -and 
        $_ -notmatch "^Writing Result to:" -and
        $_ -notmatch "^\[omni\]"
    }
    # Don't overwrite - bootstrap already writes to $out
}

foreach ($m in $Core) { Compile "src/core/$m.omni" "$Dist/core/$m.js" }
foreach ($m in $Lib) { Compile "src/lib/$m.omni" "$Dist/lib/$m.js" }
foreach ($m in $Cmds) { Compile "src/commands/$m.omni" "$Dist/commands/$m.js" }

Write-Host "Compiling main"
Compile "src/main.omni" "$Dist/main.js"

Write-Host "Bundling..."

# Copy Hybrid Impl to dist (required by bundle)
Copy-Item "src/core/codegen_hybrid_impl.js" "$Dist/core/codegen_hybrid_impl.js" -Force
Copy-Item "src/core/codegen_hybrid_impl.js" "$Dist/codegen_hybrid_impl.js" -Force

# Delegate to robust bundling script (handles imports/requires correctly)
Write-Host "Running bundle.js..."
node bundle.js
Write-Host "Bundling complete."

# Patch exports for robust fallback support
Write-Host "Patching exports..."
node fix_token_exports.js
node fix_ast_exports.js
Write-Host "Exports patched."

