# Shopify content management

Use the content location that matches what you are changing.

## Product editor

Go to **Products**, open a product, and edit its title, description, media, price, inventory, status, vendor, or collections.

Use **Options and variants** for choices such as Size, Formula, and Finish. Shopify supports up to three option types on a product; their values create the purchasable variant combinations. Set price, SKU, and inventory on each variant.

## Product metafields

Metafields store structured content that belongs to one product. They are configured under **Settings → Custom data → Products** and edited near the bottom of each product page.

- **Search tagline** (`custom.search_tagline`): short text shown with the product in search.
- **Ingredients** (`custom.ingredients`): reusable Ingredient entries assigned to the product.

## Ingredient library

1. Go to **Content → Metaobjects → Ingredient** and add an entry.
2. Complete Name, Summary, About, How it works, Source, and Categories.
3. For Categories, use these labels separated by `|`: `Hydrators`, `Brighteners`, `Repair & Soothe`, `Bio-Actives`.
4. Open the product, select the entries in its **Ingredients** metafield, and save.

The ingredient page reads the product metafield first. Theme-editor ingredient blocks remain a fallback when no entries are assigned.

## Theme editor and pages

Use **Online Store → Themes → Customize** for layout, section settings, menus, and fallback section blocks. Use **Online Store → Pages** for page title, visibility, SEO, and template assignment. Keep product-specific data in the product editor or metafields.

## Theme sync

Product, variant, metafield, and metaobject data lives in Shopify and is not stored in the theme repository. Before future theme work, pull the remote theme into a temporary location and compare it; push only the changed theme files so newer store customizations are not overwritten.
