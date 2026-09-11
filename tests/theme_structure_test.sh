#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

require_file() {
  test -f "$root_dir/$1" || {
    echo "missing required file: $1" >&2
    exit 1
  }
}

require_text() {
  grep -Fq -- "$2" "$root_dir/$1" || {
    echo "missing required text in $1: $2" >&2
    exit 1
  }
}

reject_file() {
  test ! -e "$root_dir/$1" || {
    echo "unexpected legacy file: $1" >&2
    exit 1
  }
}

reject_text() {
  if grep -Fq -- "$2" "$root_dir/$1"; then
    echo "unexpected text in $1: $2" >&2
    exit 1
  fi
}

require_file "AGENTS.md"
require_file "sections/announcement-marquee.liquid"
require_file "sections/footer.liquid"
require_file "src/global.css"
require_file "assets/theme.css"
require_file "package.json"
require_file "package-lock.json"
require_file ".shopifyignore"
require_file ".vscode/extensions.json"
require_file ".vscode/settings.json"
require_file ".githooks/pre-commit"
require_file ".githooks/pre-push"
require_file ".github/workflows/theme-check.yml"
require_file "assets/gsap.min.js"
require_file "assets/ScrollTrigger.min.js"
require_file "assets/I198-7726-518-7057.svg"
require_file "assets/I198-7726-656-6225.png"
require_file "assets/I198-7726-656-6223.png"
require_file "assets/I198-7726-656-6224.png"
require_file "assets/I198-7726-656-6222.png"
require_file "assets/nykaa-logo.svg"
require_file "assets/tira-logo.webp"
require_file "assets/amazon-logo.png"
require_file "assets/purplle-logo.svg"

if find "$root_dir/assets" -mindepth 1 -type d -print -quit | grep -q .; then
  echo "Shopify theme assets must not be stored in subfolders" >&2
  exit 1
fi

require_text "layout/theme.liquid" "{% section 'announcement-marquee' %}"
require_text "layout/theme.liquid" "{% section 'footer' %}"
require_text "layout/theme.liquid" "{{ 'theme.css' | asset_url | stylesheet_tag }}"
require_text "layout/theme.liquid" "{{ 'gsap.min.js' | asset_url }}"
require_text "layout/theme.liquid" "{{ 'ScrollTrigger.min.js' | asset_url }}"
reject_text "layout/theme.liquid" "{{ 'base.css' | asset_url | stylesheet_tag }}"
reject_text "layout/theme.liquid" "{{ 'marquee.css' | asset_url | stylesheet_tag }}"
reject_text "layout/theme.liquid" "{{ 'footer.css' | asset_url | stylesheet_tag }}"
reject_text "layout/theme.liquid" "{{ 'animations.css' | asset_url | stylesheet_tag }}"
require_text "src/global.css" "@import \"tailwindcss\" source(none);"
require_text "src/global.css" "@source \"../layout\";"
require_text "src/global.css" "@source \"../sections\";"
require_text "src/global.css" "@source \"../snippets\";"
require_text "src/global.css" "@source \"../templates\";"
require_text "src/global.css" "--color-bitter-chocolate"
require_text "src/global.css" "prefers-reduced-motion"
require_text "package.json" "\"dev:css\""
require_text "package.json" "\"build:css\""
require_text "package.json" "\"check:css\""
require_text "package.json" "cmp -s"
require_text "package.json" "\"prepare\""
require_text "Makefile" "npm run build:css"
require_text ".shopifyignore" "src/"
require_text ".githooks/pre-commit" "git add assets/theme.css"
require_text ".githooks/pre-push" "npm run check"
require_text ".github/workflows/theme-check.yml" "npm ci"
require_text ".github/workflows/theme-check.yml" "npm run check"
require_text ".github/workflows/theme-check.yml" "shopify theme check"
require_text "sections/announcement-marquee.liquid" "\"blocks\":"
require_text "sections/footer.liquid" "\"type\": \"link_list\""
require_text "sections/footer.liquid" "menu_label_1"
require_text "sections/footer.liquid" "menu_url_1"
require_text "sections/footer.liquid" "legal_label_1"
require_text "sections/footer.liquid" "Privacy Policy"
require_text "sections/footer.liquid" "nykaa-logo.svg"
require_text "sections/footer.liquid" "for index in (1..3)"
require_text "sections/footer.liquid" "max-w-360"
require_text "sections/footer.liquid" "bg-bitter-chocolate"
require_text "sections/footer.liquid" "style=\"--stagger-index: {{ forloop.index0 }};\""
reject_text "sections/footer.liquid" "site-footer__"
reject_text "sections/announcement-marquee.liquid" "announcement-marquee__"
reject_text "sections/footer.liquid" "max-w-[1440px]"
reject_text "sections/footer.liquid" "min-h-[265px]"
reject_text "sections/footer.liquid" "w-[444px]"
reject_text "sections/footer.liquid" "h-[29px]"
reject_text "sections/footer.liquid" "w-[116px]"
reject_text "sections/footer.liquid" "mt-[22px]"
reject_text "sections/footer.liquid" "gap-[15px]"
reject_text "sections/footer.liquid" "py-[7px]"
reject_text "sections/footer.liquid" "px-[5px]"
reject_text "sections/footer.liquid" "w-[50px]"
reject_text "sections/footer.liquid" "w-[65px]"
reject_text "sections/footer.liquid" "py-[9px]"
reject_text "sections/footer.liquid" "w-[175px]"
reject_text "sections/footer.liquid" "mb-[18px]"
reject_text "sections/footer.liquid" "leading-[15px]"
require_text "AGENTS.md" "Prefer canonical Tailwind utilities"
require_text "AGENTS.md" "Animation and motion"
require_text "assets/theme.js" "ScrollTrigger"
require_text "assets/theme.js" "is-visible"
require_text "assets/theme.js" "once: true"
require_text "sections/footer.liquid" "data-reveal-once"

reject_file "assets/base.css"
reject_file "assets/marquee.css"
reject_file "assets/footer.css"
reject_file "assets/animations.css"

echo "theme structure contract passed"
