# Pattern Inspector Version 4

Passes 1 and 2 establish a standalone, dependency-free foundation and adaptive workspace for the Pattern Inspector. The complete extension and maintenance guide will replace this working note in Pass 4.

## Current-module inspection

### Reusable architecture

- Explicit root initialization and a failure-tolerant HTML loader.
- Root-scoped CSS, semantic native controls, event delegation, and per-root state closures.
- Target-relative annotation anchors and synchronized marker/list selection.
- Tablist roles, roving tab index, `aria-selected`, `aria-pressed`, a polite live region, visible focus, and reduced-motion handling.
- Responsive component refinements and the recognizable CTA Banner visual baseline.

### Architecture to refactor

- The current two-region viewer/inspector must become independent left navigation, center viewer, and right inspector regions.
- Pattern data, HTML markup strings, rendering, state, and interaction logic currently share one JavaScript file.
- Fixed IDs and ARIA references prevent conforming multiple-instance use; rendered component heading IDs are fixed too.
- The module redeclares a complete local token system, includes un-tokenized secondary/panel text and a purple CTA link, and has one unscoped `.interaction-callout` rule.
- Annotation placement uses a few content-specific offsets and has no collision strategy or responsive anchoring model.

### Behavior to preserve

- Version 3 visual language, pattern navigation reset rules, annotation identifiers, marker/list synchronization, inspector categories, active states, keyboard tab behavior, responsive component intent, focus visibility, and reduced motion.

### Coupling to remove

- The production portfolio mounts the current loader from `js/modal.js`, supplies the slot in project includes, and separately loads module CSS from `work.html`.
- The current demo owns page sizing/background and does not load shared global tokens.
- The default loader lookup and fixed IDs assume one mounted viewer even though most internal queries are root-scoped.

### Risks for later passes

- Drawers need coordinated inertness, focus containment/restoration, Escape handling, mutual exclusion, and breakpoint transitions.
- Pass 3 needs validation and DOM renderers before untrusted or evolving records replace markup strings.
- Annotation placement must remain reliable when the center column changes width and when a second viewer is eventually introduced.
- Theme-aware alternatives are needed for the local soft-pink, secondary-text, and purple-link gaps.

## Pass 1 architecture

- `demo.html` loads `../../../shared/css/global-tokens.css`, the module stylesheet, and the native ES module entry point.
- `pattern-inspector.html` owns the semantic workspace chrome, navigation region, viewer/canvas, provisional rendered component, and inspector region.
- `pattern-inspector-data.js` owns stable `familyId`, `patternId`, `versionId`, and annotation records.
- `pattern-inspector.js` separates mounting, instance relationships, workspace state, viewer-shell rendering, panel-control setup, tabs, and the future annotation-synchronization boundary.
- Every generated DOM relationship is prefixed with an instance ID. Internal behavior is resolved from an explicit root rather than document-global singleton IDs.

## Shared-token strategy

The module directly maps its surface, primary text, contrast text, borders, accent, and focus aliases to the theme and color tokens in `shared/css/global-tokens.css`. It does not redeclare global token names.

The following component-scoped aliases represent gaps and should be reviewed for global promotion in Pass 4:

| Alias | Current value/purpose | Shared-token gap |
| --- | --- | --- |
| `--pi-selection-surface` | `#ffe7ef`, selected rows and component halo | No soft accent/selection surface |
| `--pi-text-secondary` | `#4f4f4f`, supporting copy | Existing muted text is visually too light in the default theme |
| `--pi-text-subtle` | `#7a7a78`, metadata and tertiary copy | No intermediate secondary/tertiary text scale |
| `--pi-font-*`, `--pi-type-*` | Version 3 family and type scale | No shared typography system |
| `--pi-space-*` | Version 3 spacing scale | No shared spacing system |
| `--pi-navigation-size`, `--pi-inspector-size`, `--pi-workspace-max` | Three-region dimensions | Product-specific layout dimensions |

No shared token file was modified in Pass 1.

The approved pre-Pass 3 visual QA adds shared `--color-text-link`, `--color-text-link-hover`, `--color-text-link-visited`, and `--color-text-link-focus` values for every existing theme. Standard component text links use those global tokens; buttons, tabs, navigation controls, and other interface controls retain their established colors.

## Known Pass 1 limitations

- The CTA Banner is provisional static markup. Pass 3 introduces validated pattern renderers and full annotation synchronization.

## Pass 2 workspace behavior

- Desktop navigation and inspector panels open and close independently. Presentation mode is derived only when both desktop panel preferences are closed.
- Persistent controls live in the status bar, outside panels that can be hidden or made inert.
- At `max-width: 68rem`, panels become mutually exclusive modal drawers. Opening a drawer moves focus inside; Tab and Shift+Tab remain within it; Escape or the backdrop closes it; focus then returns to the opener.
- While a drawer is open, the status controls, viewer, and inactive drawer are inert. The active panel receives dialog semantics and remains the only tabbable panel region.
- Desktop panel preferences survive responsive mode. Entering responsive mode starts with no open drawer; leaving it closes any drawer, restores focus when necessary, and restores the preserved desktop layout.
- Layout updates change state attributes, grid columns, visibility, and accessibility state without rebuilding the provisional component.
- Reduced-motion preferences remove panel transitions while preserving immediate state changes.
