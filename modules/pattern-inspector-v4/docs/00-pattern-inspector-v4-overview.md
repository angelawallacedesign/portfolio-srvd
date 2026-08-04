# Pattern Inspector Version 4
## Codex Implementation Overview

## Purpose

Refactor the current Pattern Inspector into a scalable, standalone module while preserving the established Version 3 visual language and interaction baseline.

The Pattern Inspector is an implementation workspace where the live UI kit also serves as the developer specification. Designers, developers, reviewers, stakeholders, and future AI agents should inspect the same canonical implementation record rather than rely on disconnected design and development artifacts.

Version 4 prioritizes architectural integrity over visual expansion.

> Favor architectural decisions over visual refinements. If a conflict arises between improving the appearance of Version 4 and improving its long-term scalability, prioritize the architecture while preserving the established Version 3 visual language.

---

## Repository and Branch

Work inside:

```text
/portfolio-srvd
```

Create a new branch named:

```text
pattern-inspector-v4
```

Create the new module at:

```text
/portfolio-srvd/modules/pattern-inspector-v4
```

Before implementation, inspect the current live module at:

```text
/portfolio-srvd/modules/pattern-inspector
```

Mirror the useful shape and conventions of the live module, but do not overwrite it during this implementation.

---

## Product Principle

The UI kit is the developer specification.

The live component, implementation rules, tokens, states, accessibility guidance, classes, responsive behavior, review information, and future version history should be different views of the same implementation record.

A component should have one canonical representation.

---

## Baseline to Preserve

Version 3 established the baseline for:

- Visual language
- Annotation identifiers
- Annotation and inspector synchronization
- Inspector tabs
- Active and selected states
- Accessibility semantics
- Reduced-motion support
- Responsive behavior currently present
- Native HTML, CSS, and JavaScript
- No external runtime dependencies

Do not perform an unrelated redesign.

---

## Key Architectural Decisions

### Workspace

Use a three-region workspace:

```text
Left Navigation | Center Viewer | Right Inspector
```

Both side panels must collapse independently.

When both panels are hidden, the center viewer becomes presentation mode.

At responsive widths, the side panels become mutually exclusive drawers.

### Data and Rendering

Separate pattern data from future DOM renderers.

Prepare stable fields such as:

```text
familyId
patternId
versionId
```

These fields should support future comparison mode and version relationships.

Use instance-prefixed DOM IDs or equivalent instance-safe selectors so multiple viewers can eventually exist on the same page.

Do not rely on global singleton IDs for viewer, annotation, tab, or panel behavior.

### Global Tokens

Consume shared global design tokens from:

```text
/portfolio-srvd/shared/css/global-tokens.css
```

Do not duplicate global token definitions.

Where exact shared equivalents do not exist, use clearly named component-scoped aliases and document the gap.

Known likely gaps include:

- Soft pink selection surface
- Secondary text
- Typography scale
- Spacing scale
- Layout dimensions

The existing hard-coded purple CTA link requires an approved semantic token or a clearly documented temporary component alias.

### Dependencies

The module must have no external runtime dependencies.

Do not add:

- Frameworks
- UI libraries
- CSS frameworks
- External icon packages
- CDN resources
- Third-party state-management packages
- A module-specific build requirement

Use semantic HTML, native CSS, native JavaScript, existing repository assets, inline SVG, and shared repository tokens.

---

## Risks and Concerns

### Repository Scope

`/design-inspector_v1` is not a Git repository and must not be used for this Version 4 implementation.

All new files must live under:

```text
/portfolio-srvd/modules/pattern-inspector-v4
```

so they are tracked by the `pattern-inspector-v4` branch.

### Token Coverage

The shared token file may not contain exact equivalents for every Version 3 value.

Do not silently duplicate shared global values.

Instead:

1. Inspect the shared token file.
2. Reuse an equivalent token when available.
3. Add a module-scoped alias only when necessary.
4. Document recommended global-token additions.

### Responsive Drawers

Responsive drawers require:

- Focus containment
- Escape handling
- Focus restoration
- Background inertness
- Mutually exclusive drawer state
- Reduced-motion support
- Correct `aria-expanded` and related semantics

### Rendering Strategy

Keeping markup strings may be simpler initially, but separate DOM renderers are recommended for:

- Validation
- Security
- Reuse
- Comparison readiness
- Multiple viewer instances
- Cleaner test boundaries

Do not force the renderer refactor into an earlier pass if it jeopardizes the workspace foundation. Complete it in Pass 3.

---

## Pass Sequence

### Pass 1 — Foundation and Architecture

Accomplishes:

- Creates the branch and new module
- Inspects and documents the current live implementation
- Mirrors useful module structure
- Connects shared global tokens
- Establishes semantic workspace regions
- Separates workspace chrome, viewer, and component concerns
- Establishes module-scoped CSS and JavaScript foundations
- Creates an initial standalone demo shell
- Leaves advanced renderer and annotation work for later passes

### Pass 2 — Workspace and Responsive Panels

Accomplishes:

- Implements left navigation and right inspector panels
- Adds independent desktop collapse behavior
- Adds center-viewer expansion
- Derives presentation mode when both panels are hidden
- Converts panels into mutually exclusive responsive drawers
- Implements focus containment, Escape handling, focus restoration, inert background behavior, and reduced motion
- Preserves Version 3 inspector tabs and semantic baseline
- Does not yet complete the pattern renderer or annotation synchronization refactor

### Pass 3 — Pattern Data, Rendering, and Inspection

Accomplishes:

- Separates structured pattern data from DOM renderers
- Introduces stable family, pattern, version, viewer, and annotation identities
- Supports instance-safe rendering
- Refactors responsive annotation anchoring
- Restores and strengthens annotation-to-inspector synchronization
- Preserves tabs, active states, focus behavior, and accessibility semantics
- Prepares the architecture for two future viewer instances without implementing full comparison mode

### Pass 4 — Validation and Documentation

Accomplishes:

- Performs final validation
- Resolves or documents remaining token and accessibility gaps
- Creates one complete `README.md`
- Creates one brief `GITHUB_SUMMARY.md`
- Creates one concise Version 4 GitHub description
- Produces the final implementation report
- Does not add new product features

---

## Required Alignment Protocol

Every pass must end with an explicit stop.

At the end of each pass, Codex must:

1. Stop implementation.
2. Summarize what was completed.
3. List all files created, modified, or removed.
4. Identify architectural findings, risks, regressions, and unresolved questions.
5. Make recommendations for the next pass.
6. Categorize each recommendation as:
   - Weave into the next pass
   - Defer to a later pass
   - Remove from scope
7. Wait for human alignment before continuing.

Codex must not automatically begin the next pass.

---

## Out of Scope for Version 4

Do not implement:

- Full comparison mode
- Automated visual diffing
- Real-time comments
- Approval workflows
- Authentication
- Backend persistence
- Multi-user collaboration
- AI-generated annotations
- Production version-control integration
- Complete version-history UI
- Advanced search
- Drag-to-resize panels
- Review queues

Prepare the architecture without prematurely building these features.

---

## Overall Success Criteria

Version 4 is successful when:

1. The new module is tracked in the `pattern-inspector-v4` branch.
2. The existing live module remains intact during development.
3. The module runs independently through its demo page.
4. The module has no external runtime dependencies.
5. Shared global tokens are consumed without duplicating global definitions.
6. The left and right panels operate independently on desktop.
7. Responsive panels behave as mutually exclusive accessible drawers.
8. The center viewer expands correctly.
9. Both panels hidden produce presentation mode.
10. Pattern data is separated from renderers.
11. Viewer and annotation identities are instance-safe.
12. Annotation relationships remain reliable across responsive widths.
13. The architecture can later support two related versions side by side.
14. Version 3 remains visually recognizable.
15. Documentation explains how to extend and maintain the module.
