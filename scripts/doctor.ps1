$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "SaveMingo system check" -ForegroundColor Magenta
Write-Host "-----------------------"

function Report($label, $ok, $detail) {
  if ($ok) {
    Write-Host ("[OK]   " + $label + " - " + $detail) -ForegroundColor Green
  } else {
    Write-Host ("[FAIL] " + $label + " - " + $detail) -ForegroundColor Red
  }
}

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue
Report "Node" ($null -ne $node) $(if ($node) { node --version } else { "not found" })
Report "npm" ($null -ne $npm) $(if ($npm) { npm --version } else { "not found" })
Report "package.json" (Test-Path "package.json") "project manifest"
Report "node_modules" (Test-Path "node_modules") $(if (Test-Path "node_modules") { "installed" } else { "run npm install" })
Report ".env tracked?" (-not (Test-Path ".env")) $(if (Test-Path ".env") { "local env exists; ensure it stays untracked" } else { "no local .env detected" })

if ($node -and $npm -and (Test-Path "node_modules")) {
  Write-Host ""
  Write-Host "Running TypeScript check..." -ForegroundColor Cyan
  npm run typecheck
}
