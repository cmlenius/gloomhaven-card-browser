#!/usr/bin/env bash
set -euo pipefail

npm run data

if ! git diff --exit-code -- data/*.ts; then
  echo ""
  echo "Error: Generated .ts files in /data are out of date with the source data files."
  echo "Please run 'npm run data' and commit the updated .ts files."
  exit 1
fi

echo "All generated data/*.ts files are up to date."

node ./data/verify-data-integrity.js

