$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo local startup" -ForegroundColor Magenta
Write-Host "------------------------"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or not available in PATH." -ForegroundColor Red
  Write-Host "Install a current Node.js LTS release, then run this again."
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "npm is not available in PATH." -ForegroundColor Red
  exit 1
}

Write-Host ("Node: " + (node --version)) -ForegroundColor Green
Write-Host ("npm:  " + (npm --version)) -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..." -ForegroundColor Yellow
  npm install
}

Write-Host ""
Write-Host "Starting SaveMingo at http://localhost:3000" -ForegroundColor Cyan
npm run dev
