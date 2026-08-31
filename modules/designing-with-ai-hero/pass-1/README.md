# Designing with AI Hero

Standalone featured-project hero module. The implementation is intentionally staged.

## Pass 1 status

Complete: coded technical background, dimensional foreground panel, responsive layout, upward panel entrance, and reduced-motion final state.

Not yet implemented by design: eyebrow, title, body copy, CTA, sparkles, supporting workflow visualization, and persistent ambient motion.

Open `index.html` for the isolated demo and reuse notes. Copy `component.html` and load `designing-ai-hero.css` to embed the module.

### Shared dependencies

- `shared/css/global-tokens.css`
- `css/tokens.css`
- Inter and DM Serif Display supplied by the host portfolio

### Module-owned controls

Motion values are grouped at the top of `.designing-ai-hero` in `designing-ai-hero.css`. Layout, the technical SVG field, the extrusion, all responsive behavior, and reduced-motion behavior are scoped to the module.

Instance-level overrides may tune the `--dai-stage-*`, `--dai-panel-*`, `--dai-extrusion-*`, and `--dai-enter-*` custom properties without editing the module source.
