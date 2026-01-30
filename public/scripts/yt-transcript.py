#!/usr/bin/env python3
"""
YouTube Transcript Fetcher
Fetches transcript from YouTube videos with millisecond timestamps
"""

import sys
import shutil
import argparse
import platform
import subprocess
from youtube_transcript_api import YouTubeTranscriptApi

def extract_video_id(url):
    """Extract video ID from YouTube URL or return as-is if already an ID"""
    if 'youtube.com' in url or 'youtu.be' in url:
        if 'youtu.be/' in url:
            return url.split('youtu.be/')[-1].split('?')[0]
        elif 'v=' in url:
            return url.split('v=')[-1].split('&')[0]
    return url

def _is_wsl():
    try:
        return 'microsoft' in platform.uname().release.lower()
    except Exception:
        return False

def get_clipboard():
    """Get clipboard contents (supports Linux, macOS, WSL/Windows)"""
    commands = []
    if _is_wsl():
        commands.append(['powershell.exe', '-command', 'Get-Clipboard'])
    if platform.system() == 'Darwin':
        commands.append(['pbpaste'])
    else:
        if shutil.which('xclip'):
            commands.append(['xclip', '-selection', 'clipboard', '-o'])
        if shutil.which('xsel'):
            commands.append(['xsel', '--clipboard', '--output'])
        if shutil.which('wl-paste'):
            commands.append(['wl-paste'])

    for cmd in commands:
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout.strip()
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue

    print('Error: no clipboard tool found. Install xclip, xsel, or wl-clipboard.', file=sys.stderr)
    sys.exit(1)

def set_clipboard(text):
    """Copy text to clipboard (supports Linux, macOS, WSL/Windows)"""
    commands = []
    if _is_wsl():
        commands.append((['clip.exe'], text.encode('utf-16le')))
    if platform.system() == 'Darwin':
        commands.append((['pbcopy'], text.encode()))
    else:
        if shutil.which('xclip'):
            commands.append((['xclip', '-selection', 'clipboard'], text.encode()))
        if shutil.which('xsel'):
            commands.append((['xsel', '--clipboard', '--input'], text.encode()))
        if shutil.which('wl-copy'):
            commands.append((['wl-copy'], text.encode()))

    for cmd, input_bytes in commands:
        try:
            subprocess.run(cmd, input=input_bytes, check=True)
            return True
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue

    return False

def main():
    parser = argparse.ArgumentParser(description='Fetch YouTube video transcripts')
    parser.add_argument('url', nargs='?', help='YouTube URL or video ID')
    parser.add_argument('--file', '-f', metavar='PATH', help='Save transcript to file')
    parser.add_argument('--print', '-p', dest='print_output', action='store_true',
                        help='Print transcript to stdout')
    parser.add_argument('--use-clipboard', '-c', action='store_true',
                        help='Read YouTube URL from clipboard')
    parser.add_argument('--timestamps', '-t', action='store_true',
                        help='Include timestamps in output')
    args = parser.parse_args()

    if args.use_clipboard:
        video_url = get_clipboard()
    elif args.url:
        video_url = args.url
    else:
        parser.error('url is required (or use --use-clipboard)')
    output_file = args.file

    # Extract video ID
    video_id = extract_video_id(video_url)

    try:
        # Fetch transcript
        transcript = YouTubeTranscriptApi().fetch(video_id)

        # Format transcript
        lines = []
        for entry in transcript:
            if args.timestamps:
                total_seconds = entry.start
                minutes = int(total_seconds // 60)
                seconds = int(total_seconds % 60)
                milliseconds = int((total_seconds % 1) * 1000)
                timestamp = f'[{minutes:02d}:{seconds:02d}.{milliseconds:03d}]'
                lines.append(f'{timestamp} {entry.text}')
            else:
                lines.append(entry.text)

        text = '\n'.join(lines)

        # Output: file, print, or clipboard (default)
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f'Transcript saved to {output_file} ({len(transcript)} entries)', file=sys.stderr)
        if args.print_output:
            print(text)
        if not output_file and not args.print_output:
            if set_clipboard(text):
                print(f'Transcript copied to clipboard ({len(transcript)} entries)')
            else:
                print(text)
                print(f'\nWarning: no clipboard tool found, printed to stdout instead', file=sys.stderr)

    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
