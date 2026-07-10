# Shared Icons

The shared icon system provides one reusable set of SVG paths for all products. Icons are injected from `data-icon` attributes by the shared initializer, so consumers should use the existing system instead of adding new inline SVGs or one-off icon assets.

## Usage

Default icon:

```html
<span class="icon" data-icon="arrow" aria-hidden="true"></span>
```

Typography-sized icon:

```html
<span class="icon icon--em" data-icon="arrow" aria-hidden="true"></span>
```

Fixed-size icons:

```html
<span class="icon icon-16" data-icon="chevron" aria-hidden="true"></span>
<span class="icon icon-24" data-icon="close" aria-hidden="true"></span>
<span class="icon icon-32" data-icon="arrow" aria-hidden="true"></span>
```

Rotated icon:

```html
<span class="icon icon--em rotate-180" data-icon="arrow" aria-hidden="true"></span>
```

All icons are injected automatically via `data-icon` when the shared `base.js` initializer runs.

Layout, sizing, and rotation are independent concerns: `.icon` owns the layout box, sizing variants set the box size, and rotation utilities rotate only the injected SVG artwork.

For design philosophy and implementation details, see `README.md`.
