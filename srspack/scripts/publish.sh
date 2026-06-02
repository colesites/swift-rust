#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -z "${CARGO_REGISTRY_TOKEN:-}" ]; then
  echo "CARGO_REGISTRY_TOKEN is not set; refusing to publish." >&2
  exit 1
fi

DRY_RUN=""
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN="--dry-run"
fi

ORDER=(
  "crates/srspack-core"
  "crates/srspack-loader-tsx"
  "crates/srspack-loader-css"
  "crates/srspack-cli"
)

for crate in "${ORDER[@]}"; do
  echo "==> cargo publish $crate $DRY_RUN"
  (cd "$crate" && cargo publish $DRY_RUN)
done
