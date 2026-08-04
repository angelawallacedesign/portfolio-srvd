# Pattern Inspector Version 4 — Pass 3

Pass 3 replaces the provisional component with validated structured pattern data, scoped native-DOM renderers, synchronized annotations, and an instance-safe mounting API. It preserves the adaptive three-region workspace from Pass 2 and prepares the module for a later comparison layout without implementing comparison mode.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173
```

Open:

- `http://localhost:4173/modules/pattern-inspector-v4/pass-03/demo.html` for the production-shaped demo.
- `http://localhost:4173/modules/pattern-inspector-v4/pass-03/instance-test.html` for the two-instance isolation fixture.

The module has no package, build, or external runtime dependency. It uses native HTML, CSS, JavaScript modules, DOM APIs, and the shared global token stylesheet.

## Files and responsibilities

- `demo.html` mounts one default inspector.
- `instance-test.html` mounts two independently configured inspectors and is a validation fixture, not a finished comparison UI.
- `pattern-inspector.html` contains only trusted static workspace chrome.
- `pattern-inspector-data.js` owns structured pattern and annotation records.
- `pattern-inspector-renderers.js` owns component, workspace, navigation, viewer, inspector, and interaction-state rendering.
- `pattern-inspector.js` validates records, creates instance context and state, mounts the template, and coordinates navigation, tabs, annotations, panels, drawers, and breakpoint transitions.
- `pattern-inspector.css` owns the component-scoped token mappings, adaptive layout, pattern presentation, annotation anchors, and interaction states.

## Pattern data

Each record contains:

```text
familyId, familyName, patternId, versionId,
name, description, category, status, owner, reviewState,
previousVersionId, nextVersionId, relatedPatternIds,
component, annotations, tokens, states, accessibility,
classes, responsiveRules
```

`component.renderer` selects one trusted renderer and `component.props` supplies inert data. No pattern record contains executable or arbitrary HTML. The current records demonstrate CTA Banner, Status Card, Button Group, and Form States across three families.

The validator requires the complete schema, supported renderer names, unique `familyId:patternId:versionId` identities, annotations, unique annotation IDs per pattern, and unique target keys per pattern. Version relationships remain explicit data and are never inferred from display labels.

Each annotation contains:

```text
annotationId, displayLabel, category, targetKey, title,
description, token, state, accessibility, className, anchor
```

One annotation record drives its component marker, inspector row, active detail, target highlight, and category values.

## Rendering and state

`renderWorkspace()` composes responsibility-based renderers for the initial mount. Pattern changes rerender only the data-dependent navigation, viewer, component, annotations, inspector, and interaction state. Panel visibility changes remain isolated to the Pass 2 layout controller and do not rerender the component.

Pattern identity, viewer instance identity, and annotation identity remain separate. The state closure stores the active family/pattern/version, inspector tab, selected/hovered/focused annotation, desktop panel preferences, responsive drawer, and breakpoint mode. Presentation mode remains strictly derived from desktop panel state.

At `max-width: 68rem`, the selected annotation detail moves to a bottom-docked region driven by the same annotation and active-category state. The dock remains present while responsive, can be collapsed without clearing selection, and keeps the selected annotation label visible in its compact header. Its Token, State, A11y, and Class tabs preserve category access even when the inspector drawer is unavailable.

Selecting a new pattern resets selection to that pattern's first annotation and resets the inspector category to Token. Previous and Next use the same rule. Panel visibility does not reset the active pattern, tab, or annotation.

## Instance identity

`mountPatternInspectorV4()` accepts an optional `instanceId`, `patternIdentity`, record set, template URL, and explicit slot. Without an ID it generates a UUID-based prefix, with a timestamp/random fallback.

All static and rendered relationship IDs use that prefix, including panels, viewer labels, tabs, tab panel, component headings, form fields, markers, annotation rows, and inspector detail. Queries are scoped to the mounted root. The two-instance fixture verifies independent state and zero duplicate IDs.

## Annotation anchoring and synchronization

Markers are appended to the element wrapper identified by `targetKey`. That wrapper is positioned locally; the annotation's `anchor` selects one of four logical presets:

- `inside-block-start-end`
- `title-inline-end`
- `edge-inline-start`
- `edge-inline-end`

This keeps markers attached through workspace resizing and component reflow without page-level coordinates. Component-specific behavior is limited to structural wrappers and normal component reflow; there are no viewport-coordinate overrides or general collision engine.

Marker and inspector-row events update one persistent `annotationId`. Hover and focus use separate transient IDs, so they add related highlighting without overwriting selection. Marker, target, row, and detail are always rendered from the same state. Dashed, dotted, and solid outlines plus the visible `Selected` label keep hover, focus, and selection distinguishable without color alone.

## Workspace and accessibility

- Desktop navigation and inspector panels remain independently closable.
- Persistent reopen controls remain outside panels that can be hidden or inert and occupy the left and right edges of the workspace header.
- Below `68rem`, mutually exclusive drawers use inert background regions, dialog semantics, focus entry and containment, Escape/backdrop dismissal, and focus restoration.
- In responsive mode, the inspector drawer contains annotation navigation while the bottom dock contains the non-duplicated category and detail interface.
- At `42rem` and below, the inspector control is hidden; stage markers and the bottom dock retain annotation and category access.
- At `42rem` and below, a native Pattern details disclosure keeps the title visible while hiding description and metadata by default.
- Breakpoint transitions preserve desktop preferences and begin responsive mode with no open drawer.
- Token, State, A11y, and Class use native buttons with tablist semantics, roving tab index, arrow/Home/End keyboard behavior, and instance-prefixed relationships.
- Markers and inspector rows are native buttons with descriptive accessible names and `aria-pressed` selection state.
- The viewer component and inspector detail provide useful programmatic labels; status and detail updates use polite live regions.
- Native headings, links, form labels, `aria-invalid`, and disabled input semantics are retained by component renderers.
- Focus is visible and reduced-motion preferences remove panel and marker transition duration.

## Approved follow-up traceability

| Identifier | Pass 3 disposition |
| --- | --- |
| `VQA-1` | Implemented: selected target outlines use `--color-control`. |
| `VQA-2` | Implemented: compact metadata aligns with `justify-content: flex-start`. |
| `UI-1` | Implemented: navigation and inspector controls occupy opposite header edges. |
| `IX-1` | Implemented: responsive annotation detail is bottom-docked. |
| `IX-2` | Implemented: the dock is persistent and collapsible. |
| `IX-3` | Implemented: responsive inspector detail/category duplication is hidden while annotation navigation remains. |
| `IX-4` | Implemented: stage selections update the dock label and contextual detail from shared state. |
| `UI-2` | Implemented: the inspector control is hidden at `max-width: 42rem`; dock controls preserve access. |
| `IA-1` | Implemented: native disclosure hides description and metadata by default at `max-width: 42rem`. |
| `IA-2` | Deferred as approved; status hierarchy and indicator remain unchanged. |
| `ENG-1` | Deferred as approved; no keyboard shortcut was assigned. |

The final feedback-label governance documentation remains deferred to the final pass.

## Token strategy

The module maps its main surface, text, contrast, border, accent, and focus aliases to shared semantic theme tokens. Standard component text links use the global default, hover, visited, and focus link tokens. Button, tab, navigation, and other control colors remain independently scoped.

Component aliases retained because no shared semantic equivalent exists yet:

| Alias group | Current purpose | Future review |
| --- | --- | --- |
| `--pi-selection-surface` | Soft selection and error surface (`#ffe7ef`) | Candidate shared selection/accent surface |
| `--pi-text-secondary`, `--pi-text-subtle` | Supporting and tertiary copy (`#4f4f4f`, `#7a7a78`) | Candidate shared text hierarchy |
| `--pi-font-*`, `--pi-type-*` | Version 4 type families and scale | Candidate shared typography system |
| `--pi-space-*` | Version 4 spacing scale | Candidate shared spacing system |
| `--pi-navigation-size`, `--pi-inspector-size`, `--pi-workspace-max` | Product-specific workspace geometry | Retain locally unless reused elsewhere |

## Known limitations

- The trusted static template is fetched and parsed once during mounting. Pattern content itself is created with native DOM APIs and `textContent`/properties.
- Records reference a fixed registry of four component renderer names; extending the library requires adding a renderer.
- Anchor presets intentionally do not provide automatic collision detection.
- The fixture proves isolation but is not a production comparison layout; synchronized zoom, diffs, summaries, and comparison controls remain out of scope.
- The module does not expose a destroy/lifecycle API.

Pass 4 has not started. See `PASS_REPORT.md` for validation evidence and the recommendations awaiting alignment.
