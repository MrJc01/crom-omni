# verify_fixes.ps1

echo "1. Checking CLI Parity (--web-app)..."
# Create a dummy file
echo "fn main() { io.print(1); }" > test_cli.omni
.\omni run test_cli.omni --web-app
if ($LASTEXITCODE -eq 0) { echo "✅ CLI Parity Passed" } else { echo "❌ CLI Parity Failed" }
rm test_cli.omni

echo "`n2. Checking Grammar Freedom (Native Block)..."
echo "native `"js`" { console.log('hello'); }" > test_native.omni
echo "fn main() {}" >> test_native.omni
.\omni run test_native.omni
if ($LASTEXITCODE -eq 0) { echo "✅ Native Block Parser Passed" } else { echo "❌ Native Block Parser Failed" }
rm test_native.omni

echo "`n3. Checking Repair Command..."
.\omni repair
if ($LASTEXITCODE -eq 0) { echo "✅ Repair Command Passed" } else { echo "❌ Repair Command Failed" }

echo "`n4. Checking Doctor Command..."
.\omni doctor

echo "`nDone."
