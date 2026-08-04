# Pattern Inspector Version 4
## Pass 1 — Foundation and Architecture

## Objective

Create the Version 4 branch and standalone module foundation without overwriting the current live Pattern Inspector.

This pass establishes repository tracking, architecture, shared-token consumption, module boundaries, and an initial working demo shell.

Do not implement the full pattern renderer, responsive drawer behavior, or annotation synchronization in this pass.

---

## 1. Create the Branch

Inside:

```text
/portfolio-srvd
```

Create and switch to:

```text
pattern-inspector-v4
```

Confirm the active branch before modifying files.

Do not work directly on the main branch.

---

## 2. Inspect the Current Live Module

Inspect:

```text
/portfolio-srvd/modules/pattern-inspector
```

Review and document:

- Directory structure
- HTML structure
- CSS architecture
- JavaScript architecture
- Data sources
- Component rendering
- Annotation positioning
- Annotation synchronization
- Inspector tabs
- Navigation
- Responsive behavior
- Accessibility semantics
- Reduced-motion handling
- Existing dependencies
- Shared global token usage
- Locally duplicated token values
- Portfolio-page coupling
- Any singleton IDs or global selectors
- Any code that assumes one viewer instance

Before implementation, produce a concise inspection summary containing:

- Reusable architecture
- Architecture to refactor
- Behavior to preserve
- Coupling to remove
- Risks that affect later passes

Do not rewrite the module before completing this inspection.

---

## 3. Create the New Module

Create:

```text
/portfolio-srvd/modules/pattern-inspector-v4
```

Mirror useful conventions from the live module.

Recommended initial shape:

```text
/portfolio-srvd/modules/pattern-inspector-v4/
├── demo.html
├── pattern-inspector.html
├── pattern-inspector.css
├── pattern-inspector.js
├── pattern-inspector-data.js
└── README.md
```

The exact data filename may be adjusted to repository conventions.

If using JSON would create local-file loading limitations for `demo.html`, use a native JavaScript data module instead. Do not introduce a build tool to solve this.

The final README content is completed in Pass 4. A placeholder may be created now.

---

## 4. Maintain the Existing Live Module

Do not overwrite:

```text
/portfolio-srvd/modules/pattern-inspector
```

The existing implementation remains the reference baseline during Version 4 development.

Any integration or replacement should occur only in a future controlled pass.

---

## 5. Connect Shared Global Tokens

Inspect:

```text
/portfolio-srvd/shared/css/global-tokens.css
```

Load it from the new module demo using the correct repository-relative path.

Map Version 3 values to existing shared tokens wherever equivalents exist.

Do not duplicate global token definitions inside the module.

Where exact equivalents do not exist, create clearly scoped aliases under the module root, for example:

```css
.pattern-inspector-v4 {
  --pi-selection-surface: ...;
  --pi-panel-inline-size: ...;
}
```

Document each component-scoped alias and why it cannot currently map to a shared token.

Explicitly review:

- Soft pink selection surface
- Secondary text
- Typography scale
- Spacing scale
- Layout dimensions
- Existing purple CTA link

Do not add or modify global tokens unless that is already an accepted repository practice. Otherwise, document recommendations for Pass 4.

---

## 6. Create Semantic Architectural Layers

Establish three independent structural layers.

### Workspace Chrome

Includes:

- Status bar
- Left-panel region
- Panel controls
- View-mode region
- Right inspector region

### Pattern Viewer

Includes:

- Viewer header or toolbar
- Pattern title and metadata
- Component canvas
- Annotation layer
- Pattern navigation

### Rendered Component

Includes only:

- Live component markup
- Component-specific state
- Component-specific annotation anchors

The rendered component must not own workspace navigation, panel toggles, or inspector tabs.

The workspace coordinates regions but does not contain component-specific implementation details.

---

## 7. Establish the Three-Region Grid

Create the semantic foundation for:

```text
Left Navigation | Center Viewer | Right Inspector
```

Use CSS Grid for major workspace layout where appropriate.

In this pass:

- Render all three regions
- Preserve Version 3 visual language
- Ensure the center region can conceptually grow
- Add no complete collapse animation yet
- Add no responsive drawer behavior yet
- Avoid fixed assumptions that block later panel states

Use module-scoped classes.

Avoid selectors dependent on portfolio ancestors or demo-page wrappers.

---

## 8. Create the Standalone Demo Shell

Create:

```text
/portfolio-srvd/modules/pattern-inspector-v4/demo.html
```

The demo must:

- Load the shared global token stylesheet
- Load the module stylesheet
- Load native JavaScript
- Render the semantic three-region shell
- Include representative static or provisional Version 3 content
- Run without external dependencies
- Avoid relying on the portfolio page layout
- Provide a clear development target for Pass 2 and Pass 3

The demo may use provisional content in this pass.

Do not complete final renderer logic yet.

---

## 9. Establish Native JavaScript Boundaries

Create initial responsibility boundaries for:

```text
Workspace initialization
Workspace state
Panel controls
Pattern data
Pattern rendering
Inspector tabs
Annotation synchronization
Viewer rendering
```

Only implement what is required for the Pass 1 shell.

Avoid a monolithic initialization function.

Avoid global mutable state where instance-scoped state is practical.

Prepare for more than one viewer or inspector instance without implementing that feature yet.

---

## 10. Dependency Constraint

Do not add:

- JavaScript frameworks
- UI libraries
- CSS frameworks
- External icon libraries
- CDN resources
- Third-party state packages
- Module-specific build tooling

Use:

- Semantic HTML
- Native CSS
- Native JavaScript
- Inline SVG or existing project assets
- Shared global tokens

---

## Validation

Before stopping, verify:

- The branch is correct.
- The new module directory is tracked by Git.
- The live module is unchanged.
- `demo.html` loads within the local repository environment.
- No external dependency was added.
- Shared global tokens load correctly.
- Global token definitions are not duplicated locally.
- Module aliases are clearly scoped and documented.
- The workspace, viewer, and rendered component layers are structurally separate.
- CSS is module-scoped.
- JavaScript architecture does not require singleton global IDs.
- Version 3 remains visually recognizable at a foundational level.

---

## Required Pass Report

Report:

- Active branch
- Current-module inspection findings
- Files created
- Files modified
- Files removed
- Shared tokens reused
- Component aliases introduced
- Architectural boundaries established
- Known limitations
- Risks discovered
- Recommendations for Pass 2

Categorize every recommendation as:

- Weave into Pass 2
- Defer
- Remove from scope

---

# STOP AND ALIGN

Stop after completing this pass.

Do not begin Pass 2.

Wait for human review of:

- The inspection findings
- Module shape
- Token strategy
- Workspace structure
- New risks
- Recommendations that should be woven into, deferred from, or removed from Pass 2
