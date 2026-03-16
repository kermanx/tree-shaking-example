#!/bin/bash
set -e

# Load environment
export PATH="/home/user/.local/share/fnm:$PATH"
export FNM_DIR="/home/user/.local/share/fnm"
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi
if [ -d "$FNM_DIR" ]; then
    eval "$(fnm env --use-on-cd --shell bash)"
fi
if [ -f "$HOME/.cargo/env" ]; then
    source "$HOME/.cargo/env"
fi

# Execute the main command
exec "$@"
