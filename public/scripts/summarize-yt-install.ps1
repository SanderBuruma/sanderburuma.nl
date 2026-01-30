#!/usr/bin/env pwsh
# summarize-yt installer for Windows PowerShell / PowerShell Core

$ErrorActionPreference = "Stop"

$ScriptUrl = "https://sanderburuma.nl/scripts/yt-transcript.py"
$InstallDir = "$env:USERPROFILE\.local\bin"
$ScriptPath = "$InstallDir\yt-transcript.py"
$ProfilePath = $PROFILE.CurrentUserCurrentHost

Write-Host "=== summarize-yt installer ===" -ForegroundColor Cyan
Write-Host ""

# Check dependencies
$missing = @()
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { $missing += "python (https://python.org)" }
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { $missing += "claude (npm install -g @anthropic-ai/claude-code)" }

if ($missing.Count -gt 0) {
    Write-Host "Missing dependencies:" -ForegroundColor Red
    foreach ($dep in $missing) { Write-Host "  - $dep" }
    Write-Host ""
    Write-Host "Install them and re-run this script."
    exit 1
}

# Install pip package
Write-Host "Installing youtube-transcript-api..."
pip install --quiet youtube-transcript-api

# Download script
if (-not (Test-Path $InstallDir)) { New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null }
Write-Host "Downloading yt-transcript.py to $ScriptPath..."
Invoke-WebRequest -Uri $ScriptUrl -OutFile $ScriptPath

# Define the function to add
$FuncBlock = @'

function summarize-yt {
  python ~/.local/bin/yt-transcript.py --use-clipboard --print | claude --dangerously-skip-permissions -p "summarize this transcript to points made, please"
}
'@

# Add function to PowerShell profile
if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

if ((Get-Content $ProfilePath -Raw -ErrorAction SilentlyContinue) -match 'function summarize-yt') {
    Write-Host "summarize-yt function already exists in $ProfilePath, skipping."
} else {
    Add-Content -Path $ProfilePath -Value $FuncBlock
    Write-Host "Added summarize-yt function to $ProfilePath"
}

Write-Host ""
Write-Host "Done! Run '. `$PROFILE' or open a new terminal, then:" -ForegroundColor Green
Write-Host "  1. Copy a YouTube URL"
Write-Host "  2. Run: summarize-yt"
