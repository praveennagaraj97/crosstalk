# Crosstalk Shopify Theme

A blank Shopify Online Store 2.0 theme foundation. It intentionally contains
no storefront sections, Figma screens, demo content, or Dawn code.

Before distributing the theme outside development, replace the reserved
`example.com` documentation and support-email values in
`config/settings_schema.json` with Crosstalk's real support details.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer
- Shopify CLI 4.8 or newer
- A Shopify development store when you are ready to preview the theme

Install the pinned frontend dependencies after cloning:

```bash
npm ci
```

This also enables the repository's Git hooks. The pre-commit hook compiles and
stages the deployable Tailwind stylesheet; the pre-push hook rejects stale
generated CSS.

## Local development

From the theme root, start a hot-reloading preview against a development
store:

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

The CLI prints a local preview URL, normally `http://127.0.0.1:9292`.
This project includes a local, ignored `.env` file for its development-store
handle. With that file configured, start Tailwind's watcher and the Shopify
preview together with:

```bash
make dev
```

To use a different store for one run, override it on the command line:

```bash
make dev STORE=your-dev-store.myshopify.com
```

Write Tailwind utilities directly in Liquid `class` attributes. Global design
tokens, base rules, accessibility utilities, and animation keyframes live in
`assets/base.css`. Tailwind compiles that source into `assets/theme.css`; the
generated file is committed for Shopify GitHub integration and ZIP uploads and
must not be edited by hand.

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

Build the production CSS and run Shopify Theme Check before uploading:

```bash
make check
```

## Package and upload

Create a validated theme ZIP:

```bash
make package
```

Upload the resulting ZIP in Shopify Admin: **Online Store → Themes → Import
theme → Upload zip file**. Use an unpublished theme for review before
publishing.

## Foundation boundaries

The starter provides the required theme shell only. Figma modules, responsive
layouts, animations, customer account experiences, and checkout decisions are
intentionally deferred.
