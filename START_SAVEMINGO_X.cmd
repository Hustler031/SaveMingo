@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-v2-preview.ps1" -TargetPath "/v2-preview/x-downloader"
pause
