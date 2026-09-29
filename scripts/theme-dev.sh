#!/usr/bin/env bash
set -euo pipefail

shopify_cli="$1"
store="$2"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "Set SHOPIFY_CLI_THEME_TOKEN in .env using a Theme Access password" >&2
  exit 1
fi

exec "$shopify_cli" theme dev --store "$store" --password "$SHOPIFY_CLI_THEME_TOKEN"
