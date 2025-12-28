@echo off
set "ORIGINAL=%~dp0omnic\target\debug\omnic.exe"
set "SHADOW=%~dp0omnic\target\debug\omnic_shadow.exe"

if exist "%ORIGINAL%" (
    copy /Y "%ORIGINAL%" "%SHADOW%" >nul
    "%SHADOW%" %*
) else (
    echo Error: omnic.exe not found at %ORIGINAL%
    echo Please run 'cargo build' first.
    exit /b 1
)
