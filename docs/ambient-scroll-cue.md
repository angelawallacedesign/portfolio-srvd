# Ambient Scroll Cue

## Purpose

The ambient scroll cue gives first-time visitors a quiet hint that the bridge intro continues downward. It is intentionally secondary to the phrase animation and typography: the cue sits in a transparent full-width, fixed-height container near the bottom of the intro viewport.

## Structure

- Markup lives in `index.html` as `.scroll-cue[data-scroll-cue]`.
- The arrow reuses `a.hero-link`; scroll-cue-specific presentation is scoped through `.scroll-cue a.hero-link`.
- The arrow uses the same `→` glyph as the "I BRIDGE THE GAP →" heading.
- The link targets `#gap` and uses `aria-label="Scroll down the page"`.
- The container spans the full viewport width and reserves a fixed height.
- The arrow is centered by default, then aligns to the right edge of the container at `min-width: 768px`.
- The container remains in the DOM for the page session. Hidden state is controlled through opacity and focusability, not layout insertion.

## Behavior

- On load, the cue is visible in its resting position when the page can scroll downward.
- The cue waits 2 seconds before the first prompt animation.
- Each sequence prompts downward twice, then pauses for 6 seconds.
- The sequence runs 3 times total.
- After the third sequence, the arrow remains visible in its resting position with no further animation.
- Refreshing the page resets the in-memory state.
- If the page can no longer scroll downward, the cue smoothly fades out for the current page session.

## Timing

| Value | Default |
| --- | ---: |
| Initial delay | 2000ms |
| Fade out | 600ms |
| Prompt duration | 300ms |
| Prompt count | 2 |
| Delay between sequences | 6000ms |
| Maximum sequences | 3 |
| Vertical travel | 8px |

## Interaction States

- Default: arrow uses `--color-accent`.
- Hover: cursor changes to a pointer and the arrow color resolves to `#F495B0`.
- Active: arrow remains `#F495B0`.
- Click or tap: scrolls to `#gap` using the site's smooth scrolling behavior.
- Scroll and resize events check whether more downward scrolling is possible. When the page reaches its downward limit, the cue fades out.

## Accessibility

- `prefers-reduced-motion: reduce` displays a static arrow without fade or vertical animation.
- While hidden, the arrow is removed from tab order and the container is marked `aria-hidden="true"`.
- While visible, the arrow is focusable and exposes the accessible name "Scroll down the page".

## Configurable Values

- Timing and behavior values are named constants in `js/scroll-cue.js`.
- Visual values are CSS custom properties in `css/bridge.css`, including container height, bottom offset, arrow size, travel distance, easing, and fade duration.
