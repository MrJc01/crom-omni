#!/usr/bin/env pwsh
# ==================================================
# Omni v1.2 Full Ecosystem Build Script
# Uses Rust compiler (omnic) to compile all modules
# ==================================================

$ErrorActionPreference = "Continue"

$OmnicPath = "..\omnic\target\release\omnic.exe"
$SrcDir = "src"
$DistDir = "dist"
$BundleFile = "$DistDir\omni_bundle.js"

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    OMNI v1.2 - Full Ecosystem Compilation            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Rust compiler exists
if (-not (Test-Path $OmnicPath)) {
    Write-Host "ERROR: Rust compiler not found at $OmnicPath" -ForegroundColor Red
    Write-Host "Run: cd ..\omnic && cargo build --release" -ForegroundColor Yellow
    exit 1
}

# Create dist directories
if (-not (Test-Path "$DistDir\core")) { New-Item -ItemType Directory -Path "$DistDir\core" -Force | Out-Null }
if (-not (Test-Path "$DistDir\lib")) { New-Item -ItemType Directory -Path "$DistDir\lib" -Force | Out-Null }

# Core modules to compile
$CoreModules = @(
    "token", "lexer", "parser", "ast", "codegen", "codegen_hybrid",
    "vm", "framework_adapter", "ingestion", "package_manager", 
    "contracts", "ghost_writer", "bootstrap", 
    "studio_engine", "studio_graph", "app_packager", "tui"
)

# Lib modules
$LibModules = @("std", "cli")

Write-Host "Step 1/4: Compiling core modules..." -ForegroundColor Green
$compiledCore = @()
foreach ($mod in $CoreModules) {
    $srcFile = "$SrcDir\core\$mod.omni"
    $outFile = "$DistDir\core\$mod.js"
    
    if (Test-Path $srcFile) {
        Write-Host "  Compiling: $mod.omni" -ForegroundColor Gray
        $output = & $OmnicPath build --target js $srcFile 2>&1
        
        # Save output to file
        [System.IO.File]::WriteAllText($outFile, ($output -join "`n"), [System.Text.Encoding]::UTF8)
        $compiledCore += $mod
    } else {
        Write-Host "  Skipping (not found): $srcFile" -ForegroundColor DarkGray
    }
}
Write-Host "  Compiled $($compiledCore.Count) core modules" -ForegroundColor Green

Write-Host "Step 2/4: Compiling lib modules..." -ForegroundColor Green
$compiledLib = @()
foreach ($mod in $LibModules) {
    $srcFile = "$SrcDir\lib\$mod.omni"
    $outFile = "$DistDir\lib\$mod.js"
    
    if (Test-Path $srcFile) {
        Write-Host "  Compiling: $mod.omni" -ForegroundColor Gray
        $output = & $OmnicPath build --target js $srcFile 2>&1
        [System.IO.File]::WriteAllText($outFile, ($output -join "`n"), [System.Text.Encoding]::UTF8)
        $compiledLib += $mod
    }
}
Write-Host "  Compiled $($compiledLib.Count) lib modules" -ForegroundColor Green

Write-Host "Step 3/4: Compiling main.omni..." -ForegroundColor Green
$mainOutput = & $OmnicPath build --target js "$SrcDir\main.omni" 2>&1
[System.IO.File]::WriteAllText("$DistDir\main.js", ($mainOutput -join "`n"), [System.Text.Encoding]::UTF8)
Write-Host "  Main compiled" -ForegroundColor Green

Write-Host "Step 4/4: Creating bundle..." -ForegroundColor Green

# Create unified bundle by concatenating all modules
$bundleContent = @"
// ============================================================
// OMNI v1.2.0 - Unified Bundle
// Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
// ============================================================
'use strict';

// Global namespace for Omni
const OMNI = {};

"@

# Add each compiled module to bundle
foreach ($mod in $compiledCore) {
    $modFile = "$DistDir\core\$mod.js"
    if (Test-Path $modFile) {
        $content = Get-Content $modFile -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $bundleContent += "`n// === Module: core/$mod ===`n"
            $bundleContent += "(function(exports) {`n$content`n})(OMNI);`n"
        }
    }
}

foreach ($mod in $compiledLib) {
    $modFile = "$DistDir\lib\$mod.js"
    if (Test-Path $modFile) {
        $content = Get-Content $modFile -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $bundleContent += "`n// === Module: lib/$mod ===`n"
            $bundleContent += "(function(exports) {`n$content`n})(OMNI);`n"
        }
    }
}

# Add main
$mainContent = Get-Content "$DistDir\main.js" -Raw -ErrorAction SilentlyContinue
if ($mainContent) {
    $bundleContent += "`n// === Main Entry ===`n"
    $bundleContent += $mainContent
}

# Save bundle
[System.IO.File]::WriteAllText($BundleFile, $bundleContent, [System.Text.Encoding]::UTF8)

$bundleSize = (Get-Item $BundleFile -ErrorAction SilentlyContinue).Length
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║    BUILD COMPLETE                                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Bundle: $BundleFile ($([math]::Round($bundleSize/1024, 1)) KB)" -ForegroundColor Cyan
Write-Host "  Modules: $($compiledCore.Count) core + $($compiledLib.Count) lib" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Test: node $BundleFile --version" -ForegroundColor Yellow
Write-Host "  TUI:  node $BundleFile" -ForegroundColor Yellow
Write-Host ""
