$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo Reddit video-with-sound preview" -ForegroundColor Magenta
Write-Host "----------------------------------------"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or not available in PATH." -ForegroundColor Red
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "npm is not available in PATH." -ForegroundColor Red
  exit 1
}

$token = "savemingo-local-reddit-mux"
$muxHealth = "http://localhost:8788/health"
$appHealth = "http://localhost:3002/api/health/reddit-mux"
$previewUrl = "http://localhost:3002/v2-preview/reddit-video-downloader"

function Test-Url {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

if (-not (Test-Path ".\services\reddit-mux\node_modules")) {
  Write-Host ""
  Write-Host "Installing Reddit mux service dependencies..." -ForegroundColor Yellow
  npm install --prefix ".\services\reddit-mux"

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Mux dependency installation failed." -ForegroundColor Red
    exit 1
  }
}

if (-not (Test-Url -Url $muxHealth)) {
  Write-Host ""
  Write-Host "Starting isolated Reddit FFmpeg mux service on port 8788..." -ForegroundColor Cyan

  $muxCommand = "set MUX_SERVICE_TOKEN=$token&& set PORT=8788&& npm start --prefix services\reddit-mux"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", $muxCommand -WorkingDirectory $root

  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 750
    if (Test-Url -Url $muxHealth) { break }
  }
}

if (-not (Test-Url -Url $muxHealth)) {
  Write-Host ""
  Write-Host "Reddit mux service did not become healthy." -ForegroundColor Red
  Write-Host "Check the separate mux-service command window." -ForegroundColor Yellow
  exit 1
}

Write-Host "Mux service: healthy" -ForegroundColor Green

if (-not (Test-Url -Url $appHealth)) {
  Write-Host ""
  Write-Host "Starting mux-enabled SaveMingo on port 3002..." -ForegroundColor Cyan

  $appCommand = "set REDDIT_MUX_SERVICE_URL=http://localhost:8788&& set REDDIT_MUX_SERVICE_TOKEN=$token&& npm run dev -- -p 3002"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", $appCommand -WorkingDirectory $root

  for ($attempt = 0; $attempt -lt 50; $attempt++) {
    Start-Sleep -Milliseconds 750
    if (Test-Url -Url $appHealth) { break }
  }
}

if (-not (Test-Url -Url $appHealth)) {
  Write-Host ""
  Write-Host "Mux-enabled SaveMingo did not become reachable on port 3002." -ForegroundColor Red
  Write-Host "Check the separate SaveMingo command window." -ForegroundColor Yellow
  exit 1
}

Write-Host "SaveMingo mux proxy: healthy" -ForegroundColor Green
Write-Host ""
Write-Host "Opening Reddit video-with-sound preview:" -ForegroundColor Green
Write-Host $previewUrl -ForegroundColor Cyan
Write-Host ""
Write-Host "Normal port 3000 preview can remain open separately." -ForegroundColor DarkGray

Start-Process $previewUrl
