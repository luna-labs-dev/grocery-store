#!/usr/bin/env bash

# Exit on error
set -e

# Repository root relative to script location
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "🔧 Setting up Git Hooks..."

# 1. Ensure .venv exists
if [ ! -d ".venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv .venv
fi

# 2. Ensure pre-commit is installed in .venv
echo "🐍 Installing pre-commit in .venv..."
./.venv/bin/pip install -q pre-commit

# 3. Install git hooks
echo "⚓ Installing git hooks (pre-commit, commit-msg, pre-push)..."
./.venv/bin/pre-commit install --hook-type pre-commit --hook-type commit-msg --hook-type pre-push

echo "✅ Git Hooks setup complete!"
