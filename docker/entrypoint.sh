#!/bin/bash
set -e

# Load environment
eval "$(fnm env --use-on-cd)"
source $HOME/.cargo/env

# Extract submission.tar.gz if it exists
if [ -f /submission.tar.gz ]; then
    echo "Extracting submission.tar.gz to /home/user/workspace..."
    tar -xzf /submission.tar.gz -C /home/user/workspace
    echo "Extraction completed."
fi

# Execute the main command
exec "$@"
