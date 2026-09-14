# Dynamic Product Search and Radiance Product Data

## Goal

Make storefront product presentation derive from Shopify product data, match the selected Figma product-dropdown design, and turn Radiance Volcanic Oil into a complete purchasable product without making future theme pushes overwrite unrelated remote changes.

## Existing State

- The selected Figma frame `549:9923` shows product rows with an 80×80 image, a product title, and a muted one-line tagline.
- The theme product flyout renders product images and titles but no tagline.
- Radiance Volcanic Oil exists in Shopify as active product `9262142095602`, priced at ₹124, with a description but no media, options, variants, or pinned metafields.
- The Ritual Essence is the reference complete product. It has five media items and six variants across two options.

## Shopify Content Model

Create a product metafield definition with:

- Name: Search tagline
- Namespace and key: `custom.search_tagline`
- Owner: Product
- Type: Single line text
- Validation: one value, no list

The navigation product flyout reads `product.metafields.custom.search_tagline.value`. When the value is blank, no tagline element is rendered. Product descriptions are not used as an automatic fallback, preventing long or inconsistent navigation copy.

Radiance receives the tagline `Restorative Night Treatment`, matching the selected Figma design.

## Product Flyout

Update the existing reusable product-row markup rather than creating a parallel search component. Each desktop row contains:

- An 80×80 product image with an 8px radius and cover crop.
- A vertical text group centered against the image.
- The existing product title treatment.
- The metafield tagline beneath the title, limited to one line with muted text.
- A full-row product link with the existing focus and hover behavior.

The flyout retains its current merchant-configured product list and collection fallback. Mobile navigation remains title-only because the selected Figma frame is the desktop flyout and mobile space is constrained.

## Radiance Volcanic Oil

Keep the current product title, description, active status, publishing, and base identity. Add two options:

- Formula: Original, Rose, Neroli
- Size: 30ml, 50ml

Create all six combinations. Use deterministic SKUs in the form `RVO-{formula code}-{size}`, track inventory at the existing Shop location, and seed each variant with available inventory. Keep 30ml at ₹124 and price 50ml at ₹168. All variants remain taxable and physical.

Add up to five skincare/product images already present in the local theme workspace, prioritizing Radiance-specific imagery and then complementary botanical textures. The first image becomes featured media. This satisfies the request for random imagery without downloading unrelated third-party assets or introducing licensing uncertainty.

## Dynamic Product Pages

The existing product template continues to consume Shopify product title, description, media, options, variants, price, availability, and selected variant. No product-specific values are hard-coded into Liquid. The new Radiance data therefore flows into the gallery, selectors, price, availability, cart form, navigation flyout, and homepage product references automatically.

## Synchronization and Deployment

Shopify product records and metafield definitions are admin data, not theme files, and are changed through the already-open authenticated Shopify Chrome session.

Theme deployment is allowlisted:

1. Record the local Git state before changes.
2. Change only the product-row Liquid and generated CSS when required.
3. Run the CSS build/check and Shopify Theme Check.
4. Push only explicitly named changed theme files to the development theme.
5. Pull the remote development theme into a temporary directory.
6. Diff it against the local workspace.
7. Merge only relevant remote theme changes; never replace the workspace wholesale.

This prevents future pushes from rewriting remote editor changes. Admin product data does not need a theme pull and remains authoritative in Shopify.

## Error Handling

- A product without a tagline renders only its title.
- A product without media retains the current image-optional behavior.
- Variant creation is verified in Shopify before proceeding to media and metafield updates.
- If Shopify rejects a duplicate option, SKU, or metafield definition, inspect the existing entity and update it instead of creating a second one.
- If a remote theme diff overlaps local edits, stop and reconcile that file explicitly.

## Verification

- Confirm the metafield definition exists for Products and the Radiance value is saved.
- Confirm Radiance has six combinations, correct prices, SKUs, inventory, and media in Shopify admin.
- Run `npm run build:css`, `npm run check:css`, and `shopify theme check`.
- Verify the desktop flyout against Figma at the reference viewport, including image size, spacing, title, and tagline.
- Verify the Radiance product page uses Shopify media and variant selections dynamically.
- Pull the remote theme to a temporary directory and review the final diff before reporting completion.
