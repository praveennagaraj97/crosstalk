-include .env

SHOPIFY ?= /Users/praveennagaraj/.local/bin/shopify
STORE ?=

.PHONY: dev

dev:
	@test -n "$(STORE)" || (echo "Usage: make dev STORE=your-dev-store.myshopify.com" >&2; exit 1)
	$(SHOPIFY) theme dev --store $(STORE)
