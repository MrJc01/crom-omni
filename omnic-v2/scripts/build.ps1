$ErrorActionPreference = "Stop"

$OmnicPath = "..\omnic\target\release\omnic.exe"
$SrcDir = "src"
$DistDir = "dist"
$BundleFile = "$DistDir\omni_bundle.js"

Write-Host "OMNI v1.2 Build System" -ForegroundColor Cyan

# Check if Rust compiler exists
if (-not (Test-Path $OmnicPath)) {
    Write-Host "ERROR: Rust compiler not found at $OmnicPath" -ForegroundColor Red
    exit 1
}

# Create dist directories
if (-not (Test-Path "$DistDir\core")) { New-Item -ItemType Directory -Path "$DistDir\core" -Force | Out-Null }
if (-not (Test-Path "$DistDir\lib")) { New-Item -ItemType Directory -Path "$DistDir\lib" -Force | Out-Null }
if (-not (Test-Path "$DistDir\commands")) { New-Item -ItemType Directory -Path "$DistDir\commands" -Force | Out-Null }

# Core modules
$CoreModules = @(
    "token", "lexer", "parser", "ast", "codegen", "codegen_hybrid",
    "vm", "framework_adapter", "ingestion", "package_manager", 
    "contracts", "ghost_writer", "bootstrap", 
    "studio_engine", "studio_graph", "app_packager", "tui"
)

# Lib modules
$LibModules = @("std", "cli")

# Command modules
$CommandModules = @(
    "cmd_setup", "cmd_run", "cmd_build", "cmd_test", 
    "cmd_package", "cmd_registry", "cmd_studio"
)

Write-Host "Compiling core modules..." -ForegroundColor Green
$compiledCore = @()
foreach ($mod in $CoreModules) {
    $srcFile = "$SrcDir\core\$mod.omni"
    $outFile = "$DistDir\core\$mod.js"
    
    if (Test-Path $srcFile) {
        Write-Host "  Compiling: $mod.omni" -ForegroundColor Gray
        $output = & $OmnicPath build --target js $srcFile
        [System.IO.File]::WriteAllText($outFile, ($output -join "`n"), [System.Text.Encoding]::UTF8)
        $compiledCore += $mod
    }
}

Write-Host "Compiling lib modules..." -ForegroundColor Green
$compiledLib = @()
foreach ($mod in $LibModules) {
    $srcFile = "$SrcDir\lib\$mod.omni"
    $outFile = "$DistDir\lib\$mod.js"
    
    if (Test-Path $srcFile) {
        Write-Host "  Compiling: $mod.omni" -ForegroundColor Gray
        $output = & $OmnicPath build --target js $srcFile
        [System.IO.File]::WriteAllText($outFile, ($output -join "`n"), [System.Text.Encoding]::UTF8)
        $compiledLib += $mod
    }
}

Write-Host "Compiling command modules..." -ForegroundColor Green
$compiledCommands = @()
foreach ($mod in $CommandModules) {
    $srcFile = "$SrcDir\commands\$mod.omni"
    $outFile = "$DistDir\commands\$mod.js"
    
    if (Test-Path $srcFile) {
        Write-Host "  Compiling: $mod.omni" -ForegroundColor Gray
        $output = & $OmnicPath build --target js $srcFile
        [System.IO.File]::WriteAllText($outFile, ($output -join "`n"), [System.Text.Encoding]::UTF8)
        $compiledCommands += $mod
    }
}

Write-Host "Compiling main.omni..." -ForegroundColor Green
$mainOutput = & $OmnicPath build --target js "$SrcDir\main.omni" 2>&1
[System.IO.File]::WriteAllText("$DistDir\main.js", ($mainOutput -join "`n"), [System.Text.Encoding]::UTF8)

Write-Host "Creating bundle..." -ForegroundColor Green

# Bundle header
$bundleContent = "'use strict';" + [Environment]::NewLine
$bundleContent += "const OMNI = {};" + [Environment]::NewLine

# Add modules
function Add-Module($list, $dir, $prefix) {
    $localContent = ""
    foreach ($mod in $list) {
        $modFile = "$dir\$mod.js"
        if (Test-Path $modFile) {
            $content = Get-Content $modFile -Raw -ErrorAction SilentlyContinue
            if ($content) {
                $localContent += [Environment]::NewLine + "// === Module: $prefix/$mod ===" + [Environment]::NewLine
                $localContent += "(function(exports) {" + [Environment]::NewLine + $content + [Environment]::NewLine + "})(OMNI);" + [Environment]::NewLine
            }
        }
    }
    return $localContent
}

$bundleContent += Add-Module $compiledCore "$DistDir\core" "core"
$bundleContent += Add-Module $compiledLib "$DistDir\lib" "lib"
$bundleContent += Add-Module $compiledCommands "$DistDir\commands" "commands"

# Add main
$mainContent = Get-Content "$DistDir\main.js" -Raw -ErrorAction SilentlyContinue
if ($mainContent) {
    $bundleContent += [Environment]::NewLine + "// === Main Entry ===" + [Environment]::NewLine
    $bundleContent += $mainContent
}

[System.IO.File]::WriteAllText($BundleFile, $bundleContent, [System.Text.Encoding]::UTF8)

Write-Host "BUILD COMPLETE: $BundleFile" -ForegroundColor Cyan
