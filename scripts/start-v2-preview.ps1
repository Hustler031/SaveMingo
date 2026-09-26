param(
  [string]$TargetPath = "/v2-preview"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SaveMingo local preview startup" -ForegroundColor Magenta
Write-Host "-------------------------------"

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

$baseUrl = "http://localhost:3000"
$previewUrl = $baseUrl + $TargetPath

function Test-SaveMingoUrl {
  param([string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

$ready = Test-SaveMingoUrl -Url $previewUrl

if (-not $ready) {
  Write-Host ""
  Write-Host "Starting Next.js dev server in a separate window..." -ForegroundColor Cyan
  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "npm run dev" -WorkingDirectory (Get-Location)

  Write-Host "Waiting for SaveMingo..." -ForegroundColor DarkGray

  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 750

    if (Test-SaveMingoUrl -Url $previewUrl) {
      $ready = $true
      break
    }
  }
} else {
  Write-Host ""
  Write-Host "Existing SaveMingo dev server detected." -ForegroundColor Green
}

if ($ready) {
  Write-Host ""
  Write-Host "SaveMingo preview is ready:" -ForegroundColor Green
  Write-Host $previewUrl -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Home:      $baseUrl/v2-preview" -ForegroundColor DarkGray
  Write-Host "Instagram: $baseUrl/v2-preview/instagram-downloader" -ForegroundColor DarkGray
  Write-Host "X:         $baseUrl/v2-preview/x-downloader" -ForegroundColor DarkGray
  Write-Host "Pinterest: $baseUrl/v2-preview/pinterest-downloader" -ForegroundColor DarkGray
  Write-Host "Reddit:    $baseUrl/v2-preview/reddit-downloader" -ForegroundColor DarkGray
  Start-Process $previewUrl
} else {
  Write-Host ""
  Write-Host "The server did not become reachable automatically." -ForegroundColor Yellow
  Write-Host "Check the separate npm window, then open:" -ForegroundColor Yellow
  Write-Host $previewUrl -ForegroundColor Cyan
}
