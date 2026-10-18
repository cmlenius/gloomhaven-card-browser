#!/usr/bin/env bash
set -euo pipefail

npm run data

if ! git diff --exit-code -- data/*.ts public/sitemap.xml; then
  echo ""
  echo "Error: Generated files in /data or public/sitemap.xml are out of date with the source data files."
  echo "Please run 'npm run data' and commit the updated files."
  exit 1
fi

echo "All generated data/*.ts files and public/sitemap.xml are up to date."

node ./data/verify-data-integrity.js


