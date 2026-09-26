$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo Cloudflare/vinext local startup" -ForegroundColor Magenta
Write-Host "-----------------------------------------"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or not available in PATH." -ForegroundColor Red
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "npm is not available in PATH." -ForegroundColor Red
  exit 1
}

Write-Host ("Node: " + (node --version)) -ForegroundColor Green
Write-Host ("npm:  " + (npm --version)) -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing locked dependencies..." -ForegroundColor Yellow
  npm ci
}

Write-Host ""
Write-Host "Starting SaveMingo Cloudflare-compatible dev mode at http://localhost:3001" -ForegroundColor Cyan
npm run dev:vinext
