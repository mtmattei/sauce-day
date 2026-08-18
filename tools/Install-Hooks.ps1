# ============================================================================
#  Copy the repo's git hooks into .git/hooks, which git does not track.
#  Run once per clone:
#
#      .\tools\Install-Hooks.ps1
#
#  Installs:
#    pre-commit — stamps a fresh cache version into index.html whenever a
#                 commit touches js/, styles.css, manifest.json or index.html,
#                 so a deploy can never ship new HTML with stale JavaScript.
# ============================================================================
$src = Join-Path $PSScriptRoot "hooks"
$dst = Join-Path $PSScriptRoot "..\.git\hooks"

if (-not (Test-Path $dst)) { throw "No .git\hooks here - run this from inside the repo." }

Get-ChildItem $src -File | ForEach-Object {
    $target = Join-Path $dst $_.Name
    Copy-Item $_.FullName $target -Force
    "installed $($_.Name)"
}
