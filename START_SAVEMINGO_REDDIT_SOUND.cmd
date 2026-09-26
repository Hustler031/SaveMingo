@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-reddit-sound-preview.ps1"
pause
