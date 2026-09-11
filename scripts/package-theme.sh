#!/usr/bin/env bash

set -euo pipefail

shopify_cli="${1:-shopify}"
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
package_dir="$(mktemp -d)"

cleanup() {
  rm -rf "$package_dir"
}
trap cleanup EXIT

for theme_dir in assets config layout locales sections snippets templates; do
  if [[ -d "$project_dir/$theme_dir" ]]; then
    cp -R "$project_dir/$theme_dir" "$package_dir/$theme_dir"
  fi
done

rm -f "$package_dir/assets/base.css"
"$shopify_cli" theme package --path "$package_dir"

package_file="$(find "$package_dir" -maxdepth 1 -name '*.zip' -print -quit)"
if [[ -z "$package_file" ]]; then
  echo "Theme package was not created." >&2
  exit 1
fi

mv "$package_file" "$project_dir/$(basename "$package_file")"
