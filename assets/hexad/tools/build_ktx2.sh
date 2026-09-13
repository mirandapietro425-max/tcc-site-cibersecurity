#!/usr/bin/env bash
set -euo pipefail
command -v toktx >/dev/null || { echo "Install Khronos KTX-Software (toktx) to encode KTX2."; exit 2; }
for src in "$(dirname "$0")/../textures"/*.png; do toktx --t2 --encode uastc "${src%.png}.ktx2" "$src"; done
