# ============================================================================
#  Stamp a fresh cache version into index.html, then show what changed.
#
#  GitHub Pages caches every file for 10 minutes and offers no say in the
#  matter. index.html carries an import map that pins every module (and the
#  stylesheet, and the splash) to one version stamp, so whichever index.html
#  a phone receives, it pulls that version's entire graph — never a fresh
#  app.js over a stale views.js.
#
#  Run this before committing a deploy:
#
#      .\tools\Bump-Version.ps1
#      git add index.html
#      git commit -m "chore: bump cache stamp"
#      git push
#
#  The stamp is the current minute (yyyyMMddHHmm). Anything matching ?v=<12
#  digits> in index.html is rewritten; nothing else is touched.
# ============================================================================
$path  = Join-Path $PSScriptRoot "..\index.html"
$stamp = Get-Date -Format "yyyyMMddHHmm"
$html  = Get-Content $path -Raw

$old = [regex]::Match($html, '\?v=(\d{12})').Groups[1].Value
if (-not $old) { throw "No ?v= stamps found in index.html - nothing to bump." }
if ($old -eq $stamp) { "Stamp is already $stamp (same minute). Nothing to do."; exit 0 }

$count = ([regex]::Matches($html, '\?v=\d{12}')).Count
$html  = $html -replace '\?v=\d{12}', "?v=$stamp"
Set-Content -Path $path -Value $html -NoNewline

"Stamped $count refs: $old -> $stamp"
