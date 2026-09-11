# Product detail content model

Create these product metafields in Shopify Admin under **Settings → Custom data → Products**. Metaobject-list fields should reference a reusable definition with the listed fields.

| Namespace/key | Type | Fields |
| --- | --- | --- |
| `custom.collection_label` | Single-line text | — |
| `custom.editorial_quote` | Multi-line text | — |
| `custom.ingredient_highlights` | List of metaobjects | `name`, `summary`, `image` |
| `custom.clinical_metrics` | List of metaobjects | `value` or `percentage`, `label` |
| `custom.before_image` | File reference (image) | — |
| `custom.after_image` | File reference (image) | — |
| `custom.scientific_backing` | Rich text | — |
| `custom.ethical_sourcing` | Rich text | — |
| `custom.ritual_steps` | List of metaobjects | `heading`, `description` |
| `custom.timeline_milestones` | List of metaobjects | `period`, `heading`, `description` |

The section provides Theme Editor fallbacks for missing optional values. Add Judge.me's review widget as an app block in the **Product reviews** section after installing Judge.me.
