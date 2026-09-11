# Product detail content model

Create these product metafields in Shopify Admin under **Settings → Custom data → Products**. Metaobject-list fields should reference a reusable definition with the listed fields.

| Namespace/key | Type | Fields |
| --- | --- | --- |
| `custom.collection_label` | Single-line text | — |
| `custom.editorial_quote` | Multi-line text | — |
| `custom.ingredient_highlights` | List of metaobjects | `name`, `summary`, `card_image` or `image`, `image_alt` |
| `custom.clinical_metrics` | List of metaobjects | `value` or `percentage`, `label` |
| `custom.before_image` | File reference (image) | — |
| `custom.after_image` | File reference (image) | — |
| `custom.efficacy_caption` | Single-line text | — |
| `custom.scientific_backing` | Rich text | — |
| `custom.ethical_sourcing` | Rich text | — |
| `custom.ritual_steps` | List of metaobjects | `heading`, `description` |
| `custom.full_ingredients` | Rich text | — |
| `custom.standards` | List of metaobjects or list of text | Metaobject: `label`, optional `icon` |
| `custom.standards_note` | Multi-line text | — |
| `custom.timeline_milestones` | List of metaobjects | `period`, `heading`, `benefits` (list of text), optional `description` fallback |

Presentation labels remain editable in the Theme Editor. Metafields are the primary source and are the recommended option for larger catalogs.

For setup without custom-data definitions, the Product detail section also accepts product-targeted blocks for ingredient highlights, standards, efficacy media/caption, evidence accordions, ritual steps, full ingredients, and timeline milestones. Every block requires a Shopify product selection and is rendered only for that product. These blocks are merchant content stored in the theme configuration; there is no hard-coded Liquid copy fallback. Product metafields take priority whenever both sources exist.
