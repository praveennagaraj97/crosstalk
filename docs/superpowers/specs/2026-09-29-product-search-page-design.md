# Product Search Page Design

## Goal

Add a polished Shopify storefront search page that helps shoppers find products and matches Amaari's warm, editorial visual style.

## Scope

- Add a `templates/search.json` template that renders a dedicated `main-search` section.
- Render product results only. Submit the query to Shopify's native search route with the product type constraint.
- Include an editable search field, submit button, result heading/count, responsive product grid, pagination, and a clear empty state.
- Keep the content within the shared `container mx-auto px-4` wrapper. Use existing background, text, and display-font tokens, plus product-card proportions and interaction patterns already used in the theme.
- Expose the page copy and page-size setting through Shopify section settings where appropriate.

## Behavior and content

The search form uses a GET request to `routes.search_url`, preserves the current query, and submits `type=product`. Results come from Shopify's paginated `search.results`; the section renders product results only. Pagination retains the search query and Shopify's native page parameter. An empty query shows a useful prompt, while a non-empty query with no matches shows a no-results message and keeps the search field available.

Each card links to its product and shows the featured image, title, and formatted price. Images use Shopify image filters and lazy loading. Cards use the theme's portrait media treatment, warm neutral image surface, serif title, and visible hover/focus states.

## Implementation shape

- `sections/main-search.liquid`: search form, status/heading, result cards, pagination, empty state, and merchant-editable copy/page-size settings.
- `templates/search.json`: default search template referencing `main-search`.
- `assets/base.css` and generated `assets/theme.css`: update only if existing utilities do not cover a required small, scoped treatment; do not hand-edit generated CSS.

No JavaScript is required. Shopify Liquid and the native search endpoint provide the query, product-only filtering, and pagination.

## Accessibility and responsive behavior

Use a semantic `main`-level heading, a labeled search input, a real submit button, descriptive image alt text, keyboard-visible focus states, and navigation landmarks/labels for pagination. Keep two cards per row on narrow screens, three at medium widths, and four on wide screens. Respect the shared page container and mobile `px-4` gutters.

## Validation

After implementation, rebuild CSS if changed, run `npm run check:css`, `shopify theme check`, and `git diff --check`. Inspect the rendered template at mobile and desktop sizes if an existing visual preview is available. Do not add new test files.
