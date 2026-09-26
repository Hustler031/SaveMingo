$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo V2 preview startup" -ForegroundColor Magenta
Write-Host "---------------------------"

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
  Write-Host "Installing locked dependencies..." -ForegroundColor Yellow
  npm ci
}

$previewUrl = "http://localhost:3000/v2-preview"

Write-Host ""
Write-Host "Starting Next.js dev server in a separate window..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "npm run dev" -WorkingDirectory (Get-Location)

Write-Host "Waiting for SaveMingo..." -ForegroundColor DarkGray

$ready = $false

for ($attempt = 0; $attempt -lt 40; $attempt++) {
  try {
    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      $ready = $true
      break
    }
  } catch {
    Start-Sleep -Milliseconds 750
  }
}

if ($ready) {
  Write-Host ""
  Write-Host "SaveMingo V2 preview is ready:" -ForegroundColor Green
  Write-Host $previewUrl -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Instagram preview:" -ForegroundColor Green
  Write-Host "http://localhost:3000/v2-preview/instagram-downloader" -ForegroundColor Cyan
  Start-Process $previewUrl
} else {
  Write-Host ""
  Write-Host "The server did not become reachable automatically." -ForegroundColor Yellow
  Write-Host "Check the separate npm window, then open:" -ForegroundColor Yellow
  Write-Host $previewUrl -ForegroundColor Cyan
}
