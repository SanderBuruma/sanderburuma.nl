---
title: Summarize Any YouTube From Your Terminal
date: 2026-01-30
description: A simple script that chains a Python transcript fetcher with Claude CLI to get rapid bullet-point summaries of YouTube videos.
image: /images/blog/summarize-yt.jpg
tags:
  - cli
  - productivity
  - python
  - ai
  - youtube
author: Sander Buruma
---

# Summarize Any YouTube Video From Your Terminal

I watch a lot of YouTube — tutorials, conference talks, deep dives on topics I'm researching. But not every video deserves 45 minutes of my attention. Sometimes I just need the key points. It could be one of those really long videos that sound kind of interesting or the speaker is really rambly and goes on tangents a lot that you're just not interested in. But you still want meaty bits because they're just that awesome. Theree are lots of youtube summarizers around, but I find them just a little too inconvenient for me. I can't control the summary prompt or they might take too long.

Within a minute or two (depending on video length and your LLM setup) you'll even have a full summary of videos that go on for 3 hours or more. Short videos take literally less than 10 seconds.

So I built a one-liner bash function that summarizes any YouTube video straight from the terminal.

## The Function

```bash
summarize-yt() {
  python3 ~/.local/bin/yt-transcript.py --use-clipboard --print \
    | claude --dangerously-skip-permissions -p "summarize this transcript to points made, please"
}
```

Copy a YouTube URL, run `summarize-yt` from your terminal or CLI, and get a bullet-point summary in seconds. That's it.

## How It Works

The function chains two tools together with a pipe:

1. **yt-transcript.py** fetches the video's transcript using YouTube's built-in caption data
2. **Claude CLI** receives the raw transcript and condenses it into key points

### The Transcript Fetcher

The Python script (`yt-transcript.py`) handles the tedious parts:

- **Reads the YouTube URL from your clipboard** — auto-detects your platform (xclip/xsel/wl-clipboard on Linux, pbpaste on macOS, PowerShell on WSL)
- **Extracts the video ID** from various YouTube URL formats (`youtube.com/watch?v=...`, `youtu.be/...`)
- **Fetches the transcript** using the `youtube-transcript-api` library
- **Prints plain text** to stdout, ready to be piped

The script is also useful on its own. It can save transcripts to files, include timestamps, or copy directly to the clipboard. But for `summarize-yt`, all I need is `--use-clipboard --print`.

### Claude CLI

The piped transcript goes straight to [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) with a simple prompt. The `--dangerously-skip-permissions` flag runs it non-interactively, and `-p` passes the prompt directly. Claude reads the transcript from stdin and returns a structured summary.

## Usage

```bash
# 1. Copy a YouTube URL to your clipboard
# 2. Run the function, pasting the link is NOT necessary
summarize-yt
```

Here's a real example — summarizing [a video about DeepMind using AI to control nuclear fusion reactors](https://www.youtube.com/watch?v=otPtotc1_jg):

```bash
$ summarize-yt

- Nuclear fusion replicates the Sun's reactions to generate clean energy,
  but faces major engineering challenges
- Tokamak reactors confine plasma in a torus (donut) shape using
  superconducting magnets; fuel is typically deuterium-tritium
- Four main challenges: high plasma temperatures (~150M °C), high fuel
  density, good plasma confinement, and sustainable fuel generation
- The triple product (temperature × density × confinement time) must be
  maximized; target is 20× energy output vs. input
- Google DeepMind + Swiss Plasma Center collaborated to improve plasma
  confinement using reinforcement learning
- Plasma is inherently unstable; magnetic fields must adjust within
  milliseconds to contain it
- The RL model was trained on a simulation first (too expensive to train
  on a real reactor), then tested on the real Swiss reactor
- The AI successfully held plasma in exotic shapes, including elongated
  plasma (better confinement) and doublets (two-droplet shape invented
  in the 1970s but previously too hard to maintain)
- The doublet concept originally led to the D-shaped plasma used in ITER;
  RL may now make the original doublet feasible again
- This is a meaningful breakthrough for confinement quality, but long-term
  reliability of ML-based control still needs further testing
```

An 8-minute video distilled into bullet points in under a minute.

## Installation

You'll need **Python 3** and **[Claude CLI](https://docs.anthropic.com/en/docs/claude-code/overview)** (`npm install -g @anthropic-ai/claude-code`) installed first. Then pick the option that fits your setup.

### Option 1: WSL / Linux / macOS

```bash
curl -s https://sanderburuma.nl/scripts/summarize-yt-install.sh | bash
```

Then reload your shell: `source ~/.bashrc`

The script installs the `youtube-transcript-api` pip package, downloads `yt-transcript.py` to `~/.local/bin/`, and adds the `summarize-yt` function to your `.bashrc` or `.zshrc`.

### Option 2: Windows PowerShell

```powershell
irm https://sanderburuma.nl/scripts/summarize-yt-install.ps1 | iex
```

Then reload your profile: `. $PROFILE`

Same steps as above but for PowerShell — installs the pip package, downloads the script to `%USERPROFILE%\.local\bin\`, and adds a `summarize-yt` function to your PowerShell profile.

### Option 3: Use Your Own AI

If you use a different AI tool (ChatGPT, local LLM, etc.), paste this prompt to have it set everything up for you:

> I want to set up a YouTube video summarizer on my machine. Here's what I need:
>
> 1. Download this Python script and save it somewhere sensible: https://sanderburuma.nl/scripts/yt-transcript.py
> 2. Install its only pip dependency: `youtube-transcript-api`
> 3. Create a shell function called `summarize-yt` that pipes the script's output into you (or any CLI AI tool I have). The script accepts `--use-clipboard --print` flags to read a YouTube URL from the clipboard and print the transcript to stdout.
> 4. Add the function to my shell profile so it persists.
>
> My OS is: [Windows / macOS / Linux]
> My shell is: [PowerShell / bash / zsh / fish]
> My AI CLI tool is: [claude / ollama / llm / other]

## Why Not Just Use a Web Tool?

There are plenty of YouTube summarizer websites. The terminal approach has a few advantages:

- **No context switching** — I'm already in the terminal most of the day
- **No accounts or subscriptions** — just tools I already have installed
- **Composable** — the transcript fetcher works independently, and I can swap the summarizer prompt for anything else
- **Fast** — clipboard to summary in one command, no browser tabs

## Possible Extensions

The function is deliberately simple, but there's room to grow:

- Pass a custom prompt instead of the hardcoded one (e.g., "extract all code examples" or "list action items")
- Add a `--url` flag to skip the clipboard step
- Pipe the summary to a markdown file for note-taking

For now, the one-liner does exactly what I need. Sometimes the best tool is the simplest one.

## Share
If you like this article, please consider posting it, liking it on your social medias and discussing the use of youtube summarizers.