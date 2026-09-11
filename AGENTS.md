# Shopify Theme Rules

## Design

- Match supplied desktop references at their exact viewport before adapting the layout.
- Preserve the reference typography, color, proportions, alignment, and image focal point.
- Aim for compact, premium composition: restrained type, tight rhythm, clear hierarchy, and intentional whitespace.
- Avoid excessive empty space when content can be composed more effectively; keep whitespace only when it improves hierarchy, focus, or readability.
- Design mobile independently for clarity and touch use; do not merely shrink the desktop layout.
- Give interactive elements visible hover, focus, open, and active states. Keep glass effects subtle and text legible.
- Prefer consistency over one-off styling. Reuse established tokens, containers, radii, and interaction patterns.
- Do not hide content behind animation, overlays, images, or JavaScript failure states.

## Shopify and Liquid

- Keep storefront markup in Liquid sections, snippets, and templates; use JavaScript only for necessary behavior.
- Make store content, images, colors, menus, products, and links merchant-editable through clearly named schema settings and blocks.
- Use Shopify routes and image filters; never hard-code storefront URLs.
- Keep section-specific markup together and divide it with `{% comment %} Component: Name {% endcomment %}` headers. Extract snippets only for reused or independently complex markup.
- Keep `layout/theme.liquid` limited to the page shell and truly global sections.

## Tailwind and CSS

- Write static Tailwind utilities directly in Liquid. Never concatenate partial class names dynamically.
- Prefer canonical utilities such as `max-w-360`; use arbitrary values only for exact design values without a suitable token.
- `assets/base.css` is the Tailwind source for tokens, base rules, shared utilities, and shared keyframes.
- `assets/theme.css` is generated, committed, and loaded by Shopify. Never edit it manually.
- Keep non-Tailwind interaction styles small, scoped, and in the appropriate component or animation stylesheet.
- Every section's primary content wrapper must use `container mx-auto px-4`.
- Navigation pills and other top-level section content must align to the same shared container.
- Let the shared container determine the available content width; do not add wrapper-level `max-w-*` constraints.
- Use `max-w-*` only for intentional design constraints such as readable copy width, media sizing, or a reference-defined composition.
- Nested grids must fill the shared container without manual width or margin positioning that creates gaps.

## Motion and Quality

- Give each section a unique but simple entrance using a restrained fade, rise, scale, or directional reveal; avoid decorative or repetitive motion.
- Keep motion short and purposeful. Stagger repeated elements subtly and provide smooth open and close states.
- Use the shared reveal behavior for once-only viewport entrances and CSS for simple interactions.
- Provide one centralized `prefers-reduced-motion` fallback that keeps all content visible.
- Use semantic landmarks, descriptive labels, keyboard support, and visible focus states.
- Do not create new test files unless the user explicitly requests them; validate changes with existing checks and tests.
- After changes, rebuild CSS and run `npm run check:css`, `shopify theme check`, and relevant existing visual checks.
- Never commit credentials, development-store configuration, preview output, or vendor dependencies.
