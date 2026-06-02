#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cargo clippy --workspace --all-targets -- -D warnings
echo "clippy ok"
