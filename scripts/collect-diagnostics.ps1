$ErrorActionPreference = "Continue"

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$root = Join-Path (Get-Location) "diagnostics"
$folder = Join-Path $root ("savemingo-" + $stamp)
$zip = Join-Path $root ("savemingo-debug-" + $stamp + ".zip")

New-Item -ItemType Directory -Force -Path $folder | Out-Null

"SaveMingo diagnostic report" | Out-File (Join-Path $folder "summary.txt")
("Generated: " + (Get-Date).ToString("o")) | Out-File (Join-Path $folder "summary.txt") -Append

try { ("Node: " + (node --version)) | Out-File (Join-Path $folder "versions.txt") } catch {}
try { ("npm: " + (npm --version)) | Out-File (Join-Path $folder "versions.txt") -Append } catch {}
try { git status --short --branch | Out-File (Join-Path $folder "git-state.txt") } catch {}
try { git log -5 --oneline | Out-File (Join-Path $folder "recent-commits.txt") } catch {}
try { npm run typecheck *>&1 | Out-File (Join-Path $folder "typecheck.txt") } catch {}
try { npm run lint *>&1 | Out-File (Join-Path $folder "lint.txt") } catch {}

# Never copy .env files, cookies, tokens, browser data, or credentials.
Compress-Archive -Path (Join-Path $folder "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "Diagnostic bundle created:" -ForegroundColor Green
Write-Host $zip
Write-Host "This script intentionally excludes .env files and credentials."
