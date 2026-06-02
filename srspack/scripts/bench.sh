#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ITERS="${SRSPACK_BENCH_ITERS:-5}"
FIXTURE="${SRSPACK_BENCH_FIXTURE:-./bench/fixtures}"

echo "==> srspack bench"
echo "    fixture: $FIXTURE"
echo "    iters:   $ITERS"
echo

./target/release/srspack bench --fixture-dir "$FIXTURE" --iterations "$ITERS"
