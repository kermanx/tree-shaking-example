#!/bin/bash
set -e

# Package all non-ignored files for submission
# This script uses git archive to create a compressed archive directly

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/submission.tar.gz"

echo "=== Submission Packaging ==="
echo "Source: $SCRIPT_DIR"
echo ""

# Remove existing archive if it exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing submission archive..."
    rm -f "$OUTPUT_FILE"
fi

# Create compressed archive using git archive
echo "Creating compressed archive..."
git archive --format=tar.gz -o "$OUTPUT_FILE" HEAD

# Get file count and size
ARCHIVE_SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
FILE_COUNT=$(tar -tzf "$OUTPUT_FILE" | wc -l)

echo ""
echo "=== Packaging Complete ==="
echo "Total files: $FILE_COUNT"
echo "Archive: submission.tar.gz ($ARCHIVE_SIZE)"
echo ""
echo "Submission package ready: $OUTPUT_FILE"
