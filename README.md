# Amaari Shopify Theme

A blank Shopify Online Store 2.0 theme foundation. It intentionally contains
no storefront sections, Figma screens, demo content, or Dawn code.

Before distributing the theme outside development, replace the reserved
`example.com` documentation and support-email values in
`config/settings_schema.json` with Amaari's real support details.

## Requirements

- Node.js 22.12 or newer
- Shopify CLI 4.8 or newer
- A Shopify development store when you are ready to preview the theme

## Local development

From the theme root, start a hot-reloading preview against a development
store:

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

The CLI prints a local preview URL, normally `http://127.0.0.1:9292`.
This project includes a local, ignored `.env` file for its development-store
handle. With that file configured, start the preview with:

```bash
make dev
```

To use a different store for one run, override it on the command line:

```bash
make dev STORE=your-dev-store.myshopify.com
```

## Full development-theme upload

Use this after a hot-reload sync error, or whenever you want to upload all
local theme files to the existing Shopify development theme:

```bash
make push-dev
```

It runs Theme Check before uploading and preserves Shopify-provided remote
files, such as the protected gift-card template. It does not publish a live
theme.

## Validate

Run Shopify Theme Check before uploading:

```bash
shopify theme check
```

## Package and upload

Create a theme ZIP:

```bash
shopify theme package
```

Upload the resulting ZIP in Shopify Admin: **Online Store → Themes → Import
theme → Upload zip file**. Use an unpublished theme for review before
publishing.

## Foundation boundaries

The starter provides the required theme shell only. Figma modules, responsive
layouts, animations, customer account experiences, and checkout decisions are
intentionally deferred.
