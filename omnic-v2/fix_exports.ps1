$cmds = @("cmd_setup", "cmd_run", "cmd_build", "cmd_test", "cmd_package", "cmd_registry", "cmd_studio")

foreach ($cmd in $cmds) {
    $path = "src/commands/$cmd.omni"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -notmatch "exports.$cmd") {
            Write-Host "Appending export to $cmd"
            $exportBlock = "`n`nnative `"js`" {`n    exports.$cmd = $cmd;`n}`n"
            Add-Content -Path $path -Value $exportBlock -Encoding UTF8
        } else {
            Write-Host "Skipping $cmd (already exported)"
        }
    }
}
