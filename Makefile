-include .env

SHOPIFY ?= /Users/praveennagaraj/.local/bin/shopify
STORE ?=
THEME ?= Crosstalk

.PHONY: dev pull-dev pull-gift-card push-dev sync-dev

dev:
	@test -n "$(STORE)" || (echo "Usage: make dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme dev --store $(STORE)

pull-dev:
	@test -n "$(STORE)" || (echo "Usage: make pull-dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme pull --store $(STORE) --theme "$(THEME)"

pull-gift-card:
	@test -n "$(STORE)" || (echo "Usage: make pull-gift-card STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme pull --store $(STORE) --theme "$(THEME)" --only templates/gift_card.liquid

push-dev:
	@test -n "$(STORE)" || (echo "Usage: make push-dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme push --store $(STORE) --theme "$(THEME)" --allow-live --strict

sync-dev: pull-dev push-dev
