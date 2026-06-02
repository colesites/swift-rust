#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> cargo fmt"
cargo fmt --all

echo "==> cargo build --release"
cargo build --release --workspace

echo "==> bun build lib"
(cd lib && bun run build 2>/dev/null || true)

echo "==> done"
