# Shopify Theme Rules

## Structure

- Keep storefront rendering in Liquid sections, snippets, and templates; use JavaScript only for behavior that Liquid cannot provide.
- Build merchant-editable content with section schema settings and blocks. Never hard-code store-specific URLs or copy when the theme editor can own them.
- Keep static sections rendered by `layout/theme.liquid` limited to site-wide chrome such as the announcement bar and footer.
- Keep a component in one section file when its parts are only used there. Divide long files with non-rendering Liquid headers in the form `{% comment %} Component: Name {% endcomment %}`; extract a snippet only when markup is reused or has substantial independent logic.

## Styling and assets

- Write component styling as static Tailwind utility classes directly in Liquid markup.
- `assets/base.css` owns the Tailwind import, design tokens, global base rules, shared accessibility utilities, and keyframes. It is build input and must not be loaded directly by Liquid. Do not edit generated `assets/theme.css` by hand.
- Do not construct partial Tailwind class names dynamically in Liquid. Select complete static class strings when variants depend on merchant data.
- Prefer canonical Tailwind utilities whenever the spacing scale has an exact equivalent (for example, `max-w-360` instead of `max-w-[1440px]`). Use arbitrary values only when no canonical token matches the design value.
- Reference colors, spacing, and typography through CSS custom properties rather than repeating literals.
- Use Shopify asset and image URL filters. Preserve Figma-exported image/vector assets; do not replace them with hand-written SVG paths.
- Treat premium storefront styling as deliberate restraint: use a compact type scale, short vertical rhythm, and no whitespace that does not improve hierarchy.

## Animation and motion

- Prefer no animation unless it communicates behavior or is essential to a component.
- Use CSS for simple motion. Do not add an animation library without a documented storefront requirement.
- Keep the few shared motion rules and keyframes in `assets/base.css` rather than repeating state utilities throughout Liquid markup.
- Every animation must have one centralized `prefers-reduced-motion` fallback that removes motion without hiding content.
- For desktop references, match the supplied Figma typography weights and line heights before adjusting scale or spacing. Treat a full desktop view as the visual acceptance reference for every implemented screen.

## Quality

- Use semantic landmarks, descriptive labels, visible focus behavior, and reduced-motion fallbacks for interactive UI.
- Run `shopify theme check` and relevant repository tests after every component change.
- Validate desktop visual work at the Figma reference viewport before declaring a pixel-accuracy task complete.
- Do not commit credentials, development-store configuration, generated preview output, or vendor dependencies.
