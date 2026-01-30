#!/bin/bash
set -e

SCRIPT_URL="https://sanderburuma.nl/scripts/yt-transcript.py"
INSTALL_DIR="$HOME/.local/bin"
SCRIPT_PATH="$INSTALL_DIR/yt-transcript.py"

FUNC='summarize-yt() {
  python3 ~/.local/bin/yt-transcript.py --use-clipboard --print \
    | claude --dangerously-skip-permissions -p "summarize this transcript to points made, please"
}'

echo "=== summarize-yt installer ==="
echo

# Check dependencies
missing=()
command -v python3 >/dev/null 2>&1 || missing+=("python3")
command -v claude >/dev/null 2>&1 || missing+=("claude (npm install -g @anthropic-ai/claude-code)")

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing dependencies:"
  for dep in "${missing[@]}"; do
    echo "  - $dep"
  done
  echo
  echo "Install them and re-run this script."
  exit 1
fi

# Install pip package
echo "Installing youtube-transcript-api..."
pip install --quiet youtube-transcript-api

# Download script
mkdir -p "$INSTALL_DIR"
echo "Downloading yt-transcript.py to $SCRIPT_PATH..."
curl -sfo "$SCRIPT_PATH" "$SCRIPT_URL"
chmod +x "$SCRIPT_PATH"

# Detect shell rc file
if [ -n "$ZSH_VERSION" ] || [ "$(basename "$SHELL")" = "zsh" ]; then
  RC_FILE="$HOME/.zshrc"
else
  RC_FILE="$HOME/.bashrc"
fi

# Add function if not already present
if grep -q 'summarize-yt()' "$RC_FILE" 2>/dev/null; then
  echo "summarize-yt function already exists in $RC_FILE, skipping."
else
  echo "" >> "$RC_FILE"
  echo "$FUNC" >> "$RC_FILE"
  echo "Added summarize-yt function to $RC_FILE"
fi

echo
echo "Done! Run 'source $RC_FILE' or open a new terminal, then:"
echo "  1. Copy a YouTube URL"
echo "  2. Run: summarize-yt"
