# Pattern Inspector Version 4
## Pass 2 — Workspace and Responsive Panels

## Objective

Implement the adaptive workspace around the Pattern Viewer.

This pass adds independent desktop panels, center expansion, derived presentation mode, responsive mutually exclusive drawers, and accessible panel interaction.

Do not complete the structured pattern renderer or annotation synchronization refactor in this pass. Those belong in Pass 3.

Before starting, incorporate only the recommendations approved after Pass 1 alignment.

---

## 1. Preserve the Pass 1 Foundation

Continue inside:

```text
/portfolio-srvd/modules/pattern-inspector-v4
```

Confirm:

- Active branch is `pattern-inspector-v4`
- Shared global tokens still load
- No external dependencies exist
- Workspace, viewer, and rendered component remain structurally separate
- The existing live module remains untouched

Do not collapse architectural boundaries established in Pass 1.

---

## 2. Left Navigation Panel

Implement a semantic left navigation panel for design families and patterns.

Initial content should demonstrate:

```text
Design Family
├── Pattern
├── Pattern
└── Pattern
```

Required behavior:

- Visible by default at desktop widths
- Independently collapsible
- Reopenable through a persistent accessible control
- Current pattern clearly selected
- Full-row selected background
- Tree groups may expand and collapse
- Current selection persists while hidden
- Center viewer expands into released space

Required semantics:

- Use semantic buttons for toggles
- Use `aria-expanded`
- Use appropriate tree or navigation semantics
- Do not communicate selection by color alone
- Preserve visible focus indicators

Do not implement advanced search or filtering.

---

## 3. Right Inspector Panel

Convert the Version 3 inspector into an independently collapsible panel.

Preserve categories:

- Token
- State
- Accessibility
- Class

Required behavior:

- Visible by default at desktop widths
- Independently collapsible
- Reopenable through a persistent accessible control
- Active tab persists while hidden
- Selected inspector item persists while hidden
- Center viewer expands into released space
- Panel behavior does not destroy future annotation state

Preserve Version 3 semantics and active-state baseline.

Do not complete final annotation synchronization yet.

---

## 4. Independent Desktop Panel States

Support all desktop states:

```text
Left open  + Right open
Left open  + Right closed
Left closed + Right open
Left closed + Right closed
```

Panel state must be independent.

Closing one panel must not automatically close the other at desktop widths.

The center viewer must use available width without requiring page reload or component re-render.

---

## 5. Presentation Mode

Presentation mode is derived when both panels are hidden.

Required behavior:

- Center viewer becomes full-width
- Pattern selection persists
- Inspector tab selection persists
- Future annotation selection must remain preservable
- Returning from presentation mode restores prior panel state or uses an explicit predictable restoration rule
- Workspace controls remain discoverable without dominating the presentation

Do not create a separate duplicated presentation page.

Presentation is a workspace state.

---

## 6. Responsive Drawer Strategy

At the approved responsive breakpoint:

- Left and right panels become overlay drawers
- Drawers are mutually exclusive
- Opening one drawer closes the other
- Drawers do not permanently consume viewer width
- Center viewer remains usable beneath the drawer model
- Drawer controls remain reachable
- Drawer labels clearly identify navigation versus inspection

Do not simply shrink the desktop three-column layout until it becomes unreadable.

---

## 7. Responsive Drawer Accessibility

Implement:

- Focus movement into an opened drawer
- Focus containment while the drawer is modal
- Escape closes the active drawer
- Focus returns to the control that opened it
- Background workspace becomes inert while a modal drawer is open
- Appropriate `aria-expanded`
- Appropriate drawer labeling
- Correct hidden state
- Visible focus indicators
- Logical tab order
- Reduced-motion support

Use the native `inert` attribute where supported by the existing project’s browser expectations. If a fallback is needed, keep it dependency-free.

Avoid fragile focus traps that depend on hard-coded element order.

---

## 8. Motion

Panel transitions must respect:

```css
@media (prefers-reduced-motion: reduce)
```

In reduced motion:

- Remove or substantially reduce sliding animation
- Preserve immediate state clarity
- Do not rely on motion to communicate open or closed state

---

## 9. Center Viewer Expansion

The center viewer must react correctly when:

- Left panel closes
- Right panel closes
- Both panels close
- A responsive drawer opens
- A responsive drawer closes
- The viewport crosses the responsive breakpoint

Avoid page-level fixed widths.

Avoid JavaScript-calculated widths when CSS Grid and state attributes can solve the layout.

Prefer state attributes or classes on the workspace root.

---

## 10. Workspace State Model

Create one predictable workspace state model.

It should represent at least:

```text
leftPanelOpen
rightPanelOpen
activeResponsiveDrawer
presentationMode
activeInspectorTab
```

Presentation mode should be derived from panel state unless an approved recommendation after Pass 1 specifies otherwise.

Keep state instance-scoped.

Do not use global singleton variables that block future multiple inspectors.

Persistence across page reload is not required in Version 4.

---

## 11. Demo Requirements

Update `demo.html` so reviewers can test:

- Both panels open
- Left panel closed
- Right panel closed
- Both panels closed
- Presentation mode
- Left responsive drawer
- Right responsive drawer
- Mutual exclusivity
- Escape behavior
- Focus restoration
- Reduced-motion behavior
- Center expansion

Provide concise visible control labels.

Do not add developer-only controls that obscure the product interface unless they are clearly separated as demo utilities.

---

## 12. Preserve Visual Language

Preserve:

- Version 3 black-and-white foundation
- Pink accent
- Minimal chrome
- Strong type hierarchy
- Neutral inspector surfaces
- Full-width selected rows
- Existing tab model
- Live prototype status treatment

Do not redesign the pattern content in this pass.

---

## Validation

### Desktop

- Left and right panels open and close independently.
- The center viewer expands correctly.
- Controls remain available after panels close.
- Both panels closed produce presentation mode.
- Reopening panels preserves state.
- Tabs remain operable.

### Responsive

- Panels become overlay drawers.
- Only one drawer may be open.
- Drawers do not permanently reduce viewer width.
- Escape closes the active drawer.
- Focus moves into the drawer.
- Focus is contained appropriately.
- Focus restores to the opener.
- Background content is inert while a modal drawer is open.
- Reduced-motion behavior works.

### Architecture

- Workspace state remains instance-scoped.
- Pattern rendering remains separable.
- No external dependency was added.
- Shared global tokens remain the source for global values.
- The existing live module remains unchanged.

---

## Required Pass Report

Report:

- Files created
- Files modified
- Files removed
- Workspace states implemented
- Responsive breakpoint strategy
- Drawer accessibility behavior
- Focus-management strategy
- Reduced-motion behavior
- Remaining visual or token gaps
- Regressions discovered
- Recommendations for Pass 3

Categorize each recommendation as:

- Weave into Pass 3
- Defer
- Remove from scope

---

# STOP AND ALIGN

Stop after completing this pass.

Do not begin Pass 3.

Wait for human review of:

- Desktop panel behavior
- Presentation-mode behavior
- Responsive drawer interaction
- Accessibility implementation
- State architecture
- Risks and recommendations to weave into, defer from, or remove from Pass 3
