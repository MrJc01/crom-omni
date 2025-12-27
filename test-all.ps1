$ErrorActionPreference = "Stop"

Write-Host "🚀 Initializing Omni Sovereign Test Protocol..." -ForegroundColor Cyan

# 1. Locate/Build Rust Compiler
$OmniRustPath = "$PSScriptRoot\omnic\target\debug\omni.exe" 
# Check if exists, else try cargo build
if (-not (Test-Path $OmniRustPath)) {
    $OmniRustPath = "$PSScriptRoot\omnic\target\debug\omnic.exe"
}

if (-not (Test-Path $OmniRustPath)) {
    Write-Host "⚠️ Rust binary not found in expected paths. Attempting Cargo Build..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\omnic"
    cargo build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Cargo build failed."
    }
    Pop-Location
}

# Verify again
if (-not (Test-Path $OmniRustPath)) {
    $OmniRustPath = "$PSScriptRoot\omnic\target\debug\omnic.exe"
}

if (-not (Test-Path $OmniRustPath)) {
    Write-Error "❌ Could not find compiled omni executable."
}

Write-Host "✅ Using Compiler: $OmniRustPath" -ForegroundColor Green

# 2. Set Env Var for Tester
$env:OMNI_COMPILER = $OmniRustPath

# 3. Compile the Tester itself (Self-Verification)
Write-Host "🛠️ Compiling Tester Capsule..." -ForegroundColor Cyan
& $OmniRustPath build "$PSScriptRoot\scripts\tester.omni" "$PSScriptRoot\scripts\tester.js" --target js

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Failed to compile scripts/tester.omni"
}

# 4. Run the Tester
Write-Host "🧪 Running Test Suite..." -ForegroundColor Cyan
node "$PSScriptRoot\scripts\tester.js"
