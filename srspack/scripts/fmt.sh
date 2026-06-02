#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cargo fmt --all
cargo fmt --all -- --check
echo "fmt ok"
