#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

FIXTURE="${SRSPACK_BENCH_FIXTURE:-./bench/fixtures/medium}"
ITERS="${SRSPACK_BENCH_ITERS:-20}"

if [ ! -d "$FIXTURE" ]; then
  echo "fixture dir does not exist: $FIXTURE" >&2
  exit 1
fi

BIN="$(pwd)/target/release/srspack"
if [ ! -x "$BIN" ]; then
  echo "srspack binary not found at $BIN; run \`cargo build --release\` first." >&2
  exit 1
fi

echo "incremental-build harness"
echo "  fixture: $FIXTURE"
echo "  iters:   $ITERS"
echo

echo "  warmup (fills FS page cache, not measured)..."
(cd "$FIXTURE" && "$BIN" build --mode production --out ./dist) > /dev/null
TOUCH_FILE="$FIXTURE/app/page.tsx"

DURATIONS=()
for i in $(seq 1 "$ITERS"); do
  touch "$TOUCH_FILE"
  START=$(date +%s%N)
  (cd "$FIXTURE" && "$BIN" build --mode production --out ./dist) > /dev/null
  END=$(date +%s%N)
  MS=$(echo "scale=2; ($END - $START) / 1000000" | bc)
  DURATIONS+=("$MS")
  printf "  run %3d: %8s ms\n" "$i" "$MS"
done

echo
echo "summary (incremental, single file change):"
printf "  min:    %8s ms\n" "$(printf '%s\n' "${DURATIONS[@]}" | sort -n | head -1)"
printf "  median: %8s ms\n" "$(printf '%s\n' "${DURATIONS[@]}" | sort -n | awk 'NR==int((FNR+1)/2)')"
printf "  max:    %8s ms\n" "$(printf '%s\n' "${DURATIONS[@]}" | sort -n | tail -1)"
