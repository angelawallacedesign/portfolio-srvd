# AWD Shared Assets

The canonical browser-consumable shared token file is:

- `../css/global-tokens.css`

Token ownership:

- Global brand colors, theme aliases, shared frame/surface/text values: `shared/css/global-tokens.css`
- Product-local typography, spacing, breakpoints, and intro-specific motion tokens: `portfolio-srvd/css/tokens.css`
- Reusable timing and easing primitives: `shared/css/motion.css`

Shared SVG icons:
One shared set of svg icon paths, including single origin icons with rotation instead of separate assets.

## Icon System

Icons are injected into wrapper elements with `data-icon` by `shared/js/createIcon.js` and initialized globally by `shared/js/base.js`.

```html
<span class="icon" data-icon="arrow"></span>
<span class="icon icon--em rotate-180" data-icon="arrow"></span>
<span class="icon icon-16" data-icon="chevron"></span>
<span class="icon icon-24" data-icon="close"></span>
<span class="icon icon-32 rotate-90" data-icon="arrow"></span>
```

Default icons render in a stable `24px` layout box. Use `icon--em` when an icon should inherit the surrounding text size. Use fixed-size variants such as `icon-16`, `icon-24`, and `icon-32` when the icon should keep an explicit layout size.

Rotation utility classes such as `rotate-45`, `rotate-90`, and `rotate-180` keep their existing public names. They rotate the injected SVG artwork while the `.icon` wrapper keeps its layout dimensions stable.

## Design Philosophy

Wrapper elements own layout and sizing. Injected SVGs own rendering. Layout, sizing, and rotation are intentionally independent concerns so icons remain composable, reusable, and consistent across products while preserving a stable public API.

Default theme values intentionally mirror the authored AWD palette. Dark and night themes override only token values, allowing component presentation styles to remain stable.
