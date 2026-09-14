# Product detail content model

Create these product metafields in Shopify Admin under **Settings → Custom data → Products**. Metaobject-list fields should reference a reusable definition with the listed fields.

| Namespace/key | Type | Fields |
| --- | --- | --- |
| `custom.collection_label` | Single-line text | — |
| `custom.gallery_marquee` | Single-line text | — |
| `custom.ingredient_highlights` | List of Ingredient metaobjects | `name`, `summary`, `card_image` |
| `custom.standards` | List of Standard metaobjects | `label`, optional `icon` image |
| `custom.standards_note` | Rich text | — |
| `custom.before_image` | File reference (image) | — |
| `custom.after_image` | File reference (image) | — |
| `custom.efficacy_caption` | Single-line text | — |
| `custom.product_accordions` | List of Product Accordion metaobjects | `heading`, rich-text `content` |
| `custom.timeline_milestones` | List of Timeline metaobjects | `period`, `heading`, rich-text `description` |

Presentation labels remain editable in the Theme Editor. Product-specific sections render only when their metafields contain data; there are no theme-block content fallbacks.
