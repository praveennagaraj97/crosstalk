# Shopify content

Shopify is the content source; the repository contains rendering code and a synced theme configuration only.

- **Products:** title, description, media, price, inventory, collections, and up to three variant options.
- **Metafields:** product-specific structured data such as `custom.search_tagline` and `custom.ingredients`.
- **Metaobjects:** reusable records. Add ingredients in **Content → Metaobjects → Ingredient**, then assign them in the product’s **Ingredients** metafield.
- **Theme editor:** page-level headings, links, selected products, menus, section order, and visual settings.
- **Pages/blogs:** long-form editorial content, visibility, SEO, and template assignment.

For ingredient Categories, use `Hydrators`, `Brighteners`, `Repair & Soothe`, or `Bio-Actives`, separated by `|`.

Before editing, pull and compare the remote theme. Push only changed code files. Theme settings are synced through Shopify theme JSON; product, metafield, and metaobject data is never part of a theme push.
