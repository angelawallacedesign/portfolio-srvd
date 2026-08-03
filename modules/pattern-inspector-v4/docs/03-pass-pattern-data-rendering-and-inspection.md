# Pattern Inspector Version 4
## Pass 3 — Pattern Data, Rendering, and Inspection

## Objective

Refactor the Pattern Inspector’s data, rendering, annotation, and synchronization architecture.

This pass makes the module scalable beyond one hard-coded component and prepares it for future side-by-side comparison without implementing full comparison mode.

Before starting, incorporate only the recommendations approved after Pass 2 alignment.

---

### Approved Visual QA Before Refactoring

After copying the Pass 2 implementation into `pass-03`, complete these approved updates before beginning the Pass 3 refactor:

- **v-qa1:** Resolve the button-color specificity conflict where the declaration near line 58 in `pattern-inspector.css` overrides the scoped `.p1-v4-annotation` color near line 303.
- **v-qa2:** Update `.pattern-inspector-v4 button` to use `--color-text-contrast` instead of `inherit`.
- **v-qa3:** Add global text-link tokens to `/shared/css/global-tokens.css`, delete `--pi-link-color`, and update the Pattern Inspector to use the new global link tokens.

Confirm the visual QA changes before continuing with the remaining Pass 3 scope.

## 1. Preserve Workspace Behavior

Continue inside:

```text
/portfolio-srvd/modules/pattern-inspector-v4/pass-03
```

Initialize Pass 3 by copying the complete approved implementation from:

```text
/portfolio-srvd/modules/pattern-inspector-v4/pass-02
```

Copy all implementation files and `README.md`.

Do not copy `PASS_REPORT.md`.

Create a new `PASS_REPORT.md` when Pass 3 is complete.

Confirm before refactoring:

- Desktop panel states work
- Presentation mode works
- Responsive drawers work
- Drawer accessibility remains intact
- Shared global tokens remain connected
- No external dependency exists
- The current live module remains untouched

Do not regress Pass 2 behavior.

---

## 2. Structured Pattern Data

Separate pattern data from DOM rendering.

Each pattern record must be capable of supporting:

```text
familyId
patternId
versionId
name
description
category
status
owner
reviewState
previousVersionId
nextVersionId
relatedPatternIds
component
annotations
tokens
states
accessibility
classes
responsiveRules
```

The initial UI does not need to display every field.

Requirements:

- `familyId`, `patternId`, and `versionId` are stable internal identifiers
- Display names are not used as internal IDs
- Version relationships can be expressed without parsing labels
- Pattern data contains no executable arbitrary HTML from untrusted input
- Data remains readable and easy to extend

Use the repository-appropriate native format chosen in Pass 1.

---

## 3. Separate DOM Renderers

Replace or isolate hard-coded markup strings with explicit native DOM renderers where practical.

Recommended responsibilities:

```text
renderWorkspace()
renderNavigation()
renderViewer()
renderPattern()
renderAnnotations()
renderInspector()
renderInspectorDetail()
```

Requirements:

- Renderers accept data and an instance context
- Renderers do not query the entire document when a scoped root is available
- Renderers do not assume one viewer exists
- Renderers do not require global singleton IDs
- Rendering does not rebuild unrelated workspace regions unnecessarily
- Component rendering remains separate from workspace chrome

If a small trusted template string remains, document why and keep it constrained. Do not preserve a broad arbitrary-markup-string architecture simply because it is easier.

---

## 4. Instance-Safe Identity

Create an instance identity strategy.

Each Pattern Inspector or viewer instance should have a stable prefix or generated instance key.

Use that identity for:

- DOM IDs
- Tab relationships
- Inspector relationships
- Annotation relationships
- Drawer labels where required
- Viewer-region labels

Avoid duplicate IDs when two viewers are eventually rendered.

Separate:

```text
Pattern identity
Version identity
Viewer instance identity
Annotation identity
```

Do not use annotation display labels such as `A`, `B`, or `C` as the only persistent identifier.

---

## 5. Annotation Data Model

Each annotation should support:

```text
annotationId
displayLabel
category
targetKey
title
description
token
state
accessibility
className
anchor
```

The exact schema may be adjusted when justified by the renderer.

Requirements:

- `annotationId` is stable
- `displayLabel` may be generated from display order
- `targetKey` maps the annotation to a rendered component element
- Inspector content derives from the same annotation record
- One annotation record drives marker, row, and detail content

Avoid duplicated annotation definitions across component markup and inspector markup.

---

## 6. Responsive Annotation Anchoring

Refactor annotations so markers remain attached to their target elements across widths.

Prefer:

- Anchors inside the relevant component element
- Positioning relative to a component or target wrapper
- Logical inline/block properties
- Minimal component-specific offsets
- Data-driven anchor presets where helpful

Avoid:

- Page-level absolute coordinates
- Viewport-specific hard-coded offsets
- Global coordinates tied to the workspace
- One-off CSS per viewport when a stable anchor can solve it

Requirements:

- Markers remain connected at desktop, tablet, and mobile widths
- Markers do not obscure essential content where avoidable
- Markers remain keyboard reachable
- Active markers remain visually clear
- Responsive component reflow does not disconnect markers

Document any unavoidable component-specific anchor rules.

---

## 7. One Synchronized Selection Model

Use one active annotation-selection model.

Selecting a component annotation must update:

- Annotation marker
- Target component element
- Inspector row
- Inspector detail

Selecting an inspector row must update:

- Annotation marker
- Target component element
- Inspector row
- Inspector detail

Hover and focus should produce consistent related highlighting without overwriting the persistent selected state.

Represent states distinctly:

```text
idle
hovered
focused
selected
```

Do not create conflicting marker-selection and inspector-selection state.

---

## 8. Inspector Tabs

Preserve:

- Token
- State
- Accessibility
- Class

Requirements:

- Existing tab semantics remain valid
- Each instance has unique tab and panel IDs
- Keyboard tab behavior remains correct
- Active tab persists through panel hiding
- Selection detail updates under the appropriate active category
- Responsive drawer behavior remains intact

Do not add unrelated tabs in Version 4.

---

## 9. Navigation and Viewer Updates

Connect the left navigation to structured pattern data.

Required behavior:

- Selecting a pattern updates the center viewer
- Selected navigation row updates
- Pattern title and metadata update
- Annotation selection resets or follows an explicit documented rule
- Inspector content updates from the selected pattern record
- Previous and next navigation may remain as secondary controls
- Selection behavior works with either side panel hidden

Do not implement full version history or comparison controls.

---

## 10. Comparison Readiness

Do not implement full comparison mode.

Prepare for it by ensuring:

- Two viewer instances can render without duplicate IDs
- DOM queries are scoped to each viewer
- Pattern and version identity are explicit
- Annotation IDs are scoped by viewer instance
- Rendering functions can accept separate pattern records
- Workspace architecture can later host two viewers
- A selected annotation in one viewer does not unintentionally mutate another viewer

Do not implement:

- Automated visual diffing
- Synchronized zoom
- Difference summaries
- Change detection
- Comparison toolbar
- Two-view production layout

Only establish readiness.

---

## 11. Semantic Token Review

Resolve or document:

- Soft pink selected-row surface
- Secondary text
- Typography scale
- Spacing scale
- Layout dimensions
- Purple CTA link

Use shared global tokens when available.

Where missing:

- Use a component-scoped alias
- Give it a semantic name
- Document its current value and intended future global mapping
- Do not hide hard-coded values inside arbitrary selectors

The purple CTA link must no longer remain an unexplained hard-coded color.

---

## 12. Accessibility

Verify:

- Annotation markers are semantic interactive controls when interactive
- Marker labels are understandable beyond letters alone
- Inspector rows are keyboard operable
- Focus is visible
- Target highlighting is not communicated by color alone
- Tabs remain accessible
- Navigation remains accessible
- Responsive drawers remain accessible
- Reduced motion remains respected
- Dynamic updates provide appropriate labels or announcements only where useful

Avoid excessive ARIA.

Prefer native semantics first.

---

## 13. Demo Coverage

Update `demo.html` to demonstrate:

- Multiple patterns
- Structured data switching
- Annotation selection from the viewer
- Selection from the inspector
- Hover and focus relationships
- Responsive annotation behavior
- Panel states from Pass 2
- Presentation mode
- Responsive drawers
- Instance-safe architecture, where practical through a test fixture or documented verification

The production demo does not need to display two viewers as a finished feature.

---

## Validation

### Data and Rendering

- Pattern content is driven by structured data.
- Stable IDs exist for family, pattern, and version.
- Renderers are scoped and responsibility-based.
- No broad arbitrary markup-string architecture remains without justification.
- The same annotation record drives marker, row, and detail.

### Annotation Behavior

- Markers remain attached across widths.
- Marker and inspector selection synchronize both directions.
- Hover, focus, and selected states are distinguishable.
- Component targets visually respond.
- Keyboard interaction works.

### Instance Safety

- IDs are prefixed or otherwise unique.
- Queries are scoped.
- Two future viewers will not inherently conflict.
- Annotation identity is not based solely on display letters.

### Regression

- Desktop panel behavior still works.
- Presentation mode still works.
- Responsive drawers still work.
- Focus containment and restoration still work.
- Shared global tokens remain connected.
- No external dependency was added.
- The existing live module remains unchanged.

---

## Required Pass Report


Create `PASS_REPORT.md` inside the current pass folder:

```text
/portfolio-srvd/modules/pattern-inspector-v4/pass-03/PASS_REPORT.md

Report:

- Files created
- Files modified
- Files removed
- Final pattern-data schema
- Renderer responsibilities
- Instance-ID strategy
- Responsive annotation strategy
- Synchronization state model
- Shared tokens reused
- Component aliases retained
- Accessibility behavior
- Comparison-readiness decisions
- Known limitations
- Recommendations for Pass 4

Categorize each recommendation as:

- Weave into Pass 4
- Defer
- Remove from scope

---

# STOP AND ALIGN

Stop after completing this pass.

Do not begin Pass 4.

Wait for human review of:

- Pattern-data model
- Renderer architecture
- Annotation anchoring
- Synchronization behavior
- Token decisions
- Accessibility behavior
- Comparison readiness
- Recommendations to weave into, defer from, or remove from the final documentation and validation pass
