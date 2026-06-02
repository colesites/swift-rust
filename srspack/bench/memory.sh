#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

FIXTURE="${SRSPACK_BENCH_FIXTURE:-./bench/fixtures/medium}"
ITERS="${SRSPACK_BENCH_ITERS:-3}"

if [ ! -d "$FIXTURE" ]; then
  echo "fixture dir does not exist: $FIXTURE" >&2
  exit 1
fi

BIN="$(pwd)/target/release/srspack"
if [ ! -x "$BIN" ]; then
  echo "srspack binary not found at $BIN; run \`cargo build --release\` first." >&2
  exit 1
fi

echo "memory harness"
echo "  fixture: $FIXTURE"
echo "  iters:   $ITERS"
echo

echo "  warmup (fills FS page cache, not measured)..."
rm -rf "$FIXTURE/.srspack-cache" "$FIXTURE/dist"
(cd "$FIXTURE" && "$BIN" build --mode production --out ./dist) > /dev/null

for i in $(seq 1 "$ITERS"); do
  rm -rf "$FIXTURE/.srspack-cache" "$FIXTURE/dist"
  echo "  run $i:"
  if /usr/bin/time -v true 2>/dev/null; then
    (cd "$FIXTURE" && /usr/bin/time -v "$BIN" build --mode production --out ./dist) 2>&1 \
      | grep -E "(Maximum resident|User time|System time|Elapsed)" \
      | sed 's/^/    /'
  else
    (cd "$FIXTURE" && "$BIN" build --mode production --out ./dist) > /dev/null &
    PID=$!
    PEAK_KB=0
    while kill -0 "$PID" 2>/dev/null; do
      if RSS=$(ps -o rss= -p "$PID" 2>/dev/null); then
        KB=$(echo "$RSS" | tr -d ' ')
        if [ -n "$KB" ] && [ "$KB" -gt "$PEAK_KB" ] 2>/dev/null; then
          PEAK_KB=$KB
        fi
      fi
      sleep 0.01
    done
    wait "$PID" || true
    PEAK_MB=$(echo "scale=2; $PEAK_KB / 1024" | bc)
    echo "    Maximum RSS (ps-sampled): ${PEAK_MB} MB"
    echo "    (gnu-time not installed; install with: brew install gnu-time)"
  fi
done
