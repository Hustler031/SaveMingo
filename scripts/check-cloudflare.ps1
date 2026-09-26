$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo Cloudflare system check" -ForegroundColor Magenta
Write-Host "---------------------------------"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[FAIL] Node.js not found." -ForegroundColor Red
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "[FAIL] npm not found." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing locked dependencies..." -ForegroundColor Yellow
  npm ci
}

if (-not (Test-Path "vite.config.ts")) {
  Write-Host "[FAIL] vite.config.ts missing." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "wrangler.jsonc")) {
  Write-Host "[FAIL] wrangler.jsonc missing." -ForegroundColor Red
  exit 1
}

Write-Host "[OK] Cloudflare configuration present." -ForegroundColor Green

npm run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npm run test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npm run build:vinext
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "[OK] SaveMingo Cloudflare build is healthy." -ForegroundColor Green
