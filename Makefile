-include .env

# Shopify CLI reads this variable for Theme Access password authentication.
export SHOPIFY_CLI_THEME_TOKEN

SHOPIFY ?= /Users/praveennagaraj/.local/bin/shopify
STORE ?=
THEME ?= Crosstalk

.PHONY: dev build check package pull-dev pull-gift-card push-dev sync-dev

dev:
	@test -n "$(STORE)" || (echo "Usage: make dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	@test -n "$$SHOPIFY_CLI_THEME_TOKEN" || (echo "Set SHOPIFY_CLI_THEME_TOKEN in .env using a Theme Access password" >&2; exit 1)
	@npx concurrently --kill-others --names tailwind,shopify "npm:dev:css" "bash ./scripts/theme-dev.sh '$(SHOPIFY)' '$(STORE)'"

build:
	npm run build:css

check: build
	$(SHOPIFY) theme check

package: check
	./scripts/package-theme.sh "$(SHOPIFY)"

pull-dev:
	@test -n "$(STORE)" || (echo "Usage: make pull-dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme pull --store $(STORE) --theme "$(THEME)"

pull-gift-card:
	@test -n "$(STORE)" || (echo "Usage: make pull-gift-card STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme pull --store $(STORE) --theme "$(THEME)" --only templates/gift_card.liquid

push-dev: check
	@test -n "$(STORE)" || (echo "Usage: make push-dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme push --store $(STORE) --theme "$(THEME)" --allow-live --strict

sync-dev: pull-dev push-dev
