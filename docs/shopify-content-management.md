# Shopify content

Shopify is the content source; the repository contains rendering code and a synced theme configuration only.

- **Products:** title, description, media, price, inventory, collections, and up to three variant options.
- **Product metafields:** collection label, gallery marquee, ingredient highlights, standards, before/after images, efficacy caption, accordions, and timeline.
- **Metaobjects:** reusable Ingredient, Standard, Product Accordion, and Timeline records. Upload ingredient artwork in `card_image`; order records from each product.
- **Theme editor:** page-level headings, links, selected products, menus, section order, and visual settings.
- **Pages/blogs:** long-form editorial content, visibility, SEO, and template assignment.

For ingredient Categories, use `Hydrators`, `Brighteners`, `Repair & Soothe`, or `Bio-Actives`, separated by `|`.

Missing product metafields hide their storefront section. Before editing code, pull and compare the remote theme; push only changed files. Product and metaobject data is never part of a theme push.
