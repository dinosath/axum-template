#!/bin/bash
# Script to generate the sample project from the axum-template using baker
# Usage: ./generate.sh [output_directory]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${1:-$SCRIPT_DIR/generated}"
ANSWERS_FILE="$SCRIPT_DIR/answers.yaml"

echo "🚀 Generating sample project from axum-template"
echo "   Template: $TEMPLATE_DIR"
echo "   Answers:  $ANSWERS_FILE"
echo "   Output:   $OUTPUT_DIR"
echo ""

# Check if baker is installed
if ! command -v baker &> /dev/null; then
    echo "❌ Error: baker is not installed"
    echo "   Install with: cargo install baker --locked"
    exit 1
fi

# Check if answers file exists
if [ ! -f "$ANSWERS_FILE" ]; then
    echo "❌ Error: answers.yaml not found at $ANSWERS_FILE"
    exit 1
fi

# Remove existing generated directory if it exists
if [ -d "$OUTPUT_DIR" ]; then
    echo "🗑️  Removing existing generated directory..."
    rm -rf "$OUTPUT_DIR"
fi

# Generate the project
echo "⚙️  Running baker..."
baker bake "$TEMPLATE_DIR" "$OUTPUT_DIR" --answers "$ANSWERS_FILE"

echo ""
echo "✅ Sample project generated successfully!"
echo ""
echo "📁 Next steps:"
echo "   cd $OUTPUT_DIR"
echo "   cargo build"
echo "   cargo test"
echo ""
