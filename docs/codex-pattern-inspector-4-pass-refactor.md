# Codex Task — Refactor Pattern Inspector into a JSON-Driven Module

## Role

You are refactoring the existing `pattern-inspector` module inside `/portfolio-srvd`.

This is an **architecture refactor**, not a visual redesign. Preserve the current Pattern Inspector appearance, interactions, accessibility behavior, and four existing mock components while moving the component definitions into a reusable JSON data model.

The long-term product direction is to let the live component, annotation inspector, and developer specification share one component source of truth. This branch should establish that foundation without prematurely building a full component registry.

---

# Create a New Branch

Create and work in this branch:

```bash
git checkout -b refactor/pattern-inspector-json-dev-spec
```

Do not commit directly to the production branch.

Use one commit per pass so each architectural change can be reviewed or reverted independently.

---

# Context and Required Inspection

Before modifying code, inspect the existing architecture in:

```text
/portfolio-srvd/modules/pattern-inspector
/portfolio-srvd/work.html
/portfolio-srvd/js
/portfolio-srvd/js/components.js
/portfolio-srvd/js/data.json
/portfolio-srvd/includes
```

## Inspect the Existing Pattern Inspector

Identify and document:

- The inline `patterns` array
- The four current pattern components:
  - CTA Banner
  - Status Card
  - Button Group
  - Form States
- Component IDs and names
- Component markup
- Annotation IDs, labels, placements, and anchors
- Token, state, accessibility, and class detail values
- Pattern selection state
- Annotation selection state
- Inspector category state
- Previous and Next behavior
- Disabled Previous and Next states
- Tab click and keyboard behavior
- ARIA attributes
- Initialization guards
- Existing module boundaries and imports

## Inspect the Existing Work Project Architecture

Review `/portfolio-srvd/js/data.json` and identify how one project object supports multiple views such as:

- Project list
- Chart view
- Overlay panel
- Layer 3 project or case-study view

Pay particular attention to fields such as:

```text
id
heading
hasCaseStudy
htmlInclude
layer3Variant
meta
```

Review `/portfolio-srvd/js/components.js` and related scripts to understand:

- How project data is passed into rendering functions
- How conditional actions are rendered from booleans such as `hasCaseStudy`
- How a project ID is attached to the action
- How the selected project is resolved
- How Layer 3 is opened
- How the existing Layer 3 close behavior works
- Whether focus is managed when Layer 3 opens or closes
- How the selected project data reaches the Layer 3 view

Review `/portfolio-srvd/work.html` to identify:

- The Layer 3 container
- The Layer 3 mount point
- Host-page event listeners
- Open and close controls
- Any reusable overlay or modal utilities

Review `/portfolio-srvd/includes` only to understand:

- The semantic HTML structure used for project and case-study content
- The hierarchy of headings, sections, figures, lists, metadata, code, and supporting content
- Reusable structural patterns that may be appropriate for a developer specification

## Important Dev Spec Constraint

The Pattern Inspector developer specification must **not** load an HTML include.

The implementation will use:

```text
dev-spec.js
```

to render the selected component's developer specification from JSON.

A reusable semantic HTML shell may live in `pattern-inspector.html`, but its content must be populated from the selected JSON object. Do not create one include or one hardcoded HTML page per component.

---

# Global Constraints

- Preserve the current Pattern Inspector visual design.
- Preserve all four current components.
- Preserve the current component markup output.
- Preserve annotation marker placement.
- Preserve annotation list behavior.
- Preserve Token, State, Accessibility, and Class behavior.
- Preserve tab keyboard interaction.
- Preserve ARIA attributes and accessible state communication.
- Preserve Previous and Next navigation.
- Preserve disabled navigation states.
- Do not add React, Vue, or another framework.
- Do not build a full production component registry in this branch.
- Do not create one directory or JSON file per component yet.
- Do not duplicate component definitions in JavaScript and JSON.
- Do not use HTML includes for developer specifications.
- Keep the Pattern Inspector module standalone.
- Prefer small rendering functions with clear responsibilities.
- Avoid unrelated cleanup outside the required architecture.
- Existing project list, chart, overlay, and case-study behavior must continue working.

---

# Pass 1 — Extract the Four Pattern Components into JSON

## Goal

Move the four component definitions out of the inline JavaScript array and into one JSON file without changing the current UI or behavior.

## Create

```text
/portfolio-srvd/modules/pattern-inspector/pattern-inspector.json
```

## Required Data Shape

Create one JSON array containing the four current pattern objects.

Each component must preserve:

```text
id
name
markup
annotations
```

Each annotation must preserve:

```text
id
label
placement
details.token
details.state
details.a11y
details.class
```

Add these top-level fields to every component so later passes can use the same contract:

```json
{
  "hasDevSpec": false,
  "devSpec": null
}
```

Do not add speculative registry data in this pass.

## Refactor `pattern-inspector.js`

Update the module so it loads and renders the JSON data as the only source for the four component definitions.

After the JSON implementation works:

- Remove the inline `patterns` array.
- Remove the `annotation()` helper if it is no longer needed.
- Keep existing rendering and interaction behavior intact.
- Do not redesign or restyle the interface.

Use the repository's current module-loading approach. If JSON module imports are not supported by the current environment, use a small asynchronous loader that resolves the JSON file relative to the module.

Handle loading before initialization so the inspector does not attempt to access component data before it is available.

## Pass 1 Acceptance Criteria

- The Pattern Inspector looks identical before and after the refactor.
- CTA Banner renders.
- Status Card renders.
- Button Group renders.
- Form States renders.
- Annotation markers appear in the same locations.
- Clicking a preview annotation updates the inspector.
- Clicking an annotation list item updates the stage and details.
- Token, State, Accessibility, and Class tabs still work.
- Arrow Left, Arrow Right, Home, and End still work for tabs.
- Previous and Next still change patterns.
- Previous is disabled on the first pattern.
- Next is disabled on the fourth pattern.
- The initialization guard still prevents duplicate setup.
- No component data remains duplicated in `pattern-inspector.js`.
- No console errors occur.

## Pass 1 Commit

```bash
git add .
git commit -m "refactor pattern inspector data into JSON"
```

---

# Pass 2 — Establish the Component Data and Rendering Contract

## Goal

Make it explicit that one selected component object drives the live component, annotations, inspector list, navigation label, and details.

This pass should improve architecture and readability without changing the interface.

## Normalize the Component Contract

Every component must follow this top-level shape:

```json
{
  "id": "string",
  "name": "string",
  "markup": "string",
  "annotations": [],
  "hasDevSpec": false,
  "devSpec": null
}
```

Every annotation must follow this shape:

```json
{
  "id": "string",
  "label": "string",
  "placement": "string",
  "details": {
    "token": "string",
    "state": "string",
    "a11y": "string",
    "class": "string"
  }
}
```

## Separate Rendering Responsibilities

Refactor into small functions with clear responsibilities. Exact names may vary, but the architecture should distinguish:

```text
load component data
validate component data
resolve current component
resolve current annotation
render component markup
render preview annotation markers
render inspector annotation list
render selected annotation state
render selected category detail
render pattern position
render Previous and Next disabled states
select a pattern
select an annotation
select a category
```

Avoid one large function that owns all rendering and state transitions.

## Add Lightweight Validation

Add safe guards and useful console warnings for:

- JSON loading failure
- Empty component array
- Missing component ID
- Missing component name
- Missing markup
- Missing or empty annotations
- Duplicate component IDs
- Duplicate annotation IDs within one component
- Missing annotation anchors in rendered markup
- Invalid pattern index
- Invalid annotation ID
- Missing detail category
- Missing required DOM mount points

A malformed component should not break the entire page. Skip invalid data where practical and report the issue clearly.

## Document the Contract

Add concise developer comments that explain:

- Required component fields
- Required annotation fields
- How `annotation.id` connects to `data-annotation-anchor`
- How `details.token`, `details.state`, `details.a11y`, and `details.class` map to inspector tabs
- How the selected component object drives all views
- How a fifth component will eventually be added

Do not create the full final setup guide yet.

## Pass 2 Acceptance Criteria

- All Pass 1 behavior still works.
- One selected JSON object drives the complete inspector.
- Rendering responsibilities are separated and readable.
- Invalid data fails safely.
- Useful warnings identify malformed data.
- No visual changes are introduced.
- The module remains framework-free.

## Pass 2 Commit

```bash
git add .
git commit -m "define pattern inspector data and rendering contract"
```

---

# Pass 3 — Add Conditional View Dev Spec Support

## Goal

Create the Pattern Inspector equivalent of the existing project `hasCaseStudy` pattern.

A component with `hasDevSpec: true` should display a **View Dev Spec** action. That action should identify the currently selected component and open the existing Layer 3 architecture without loading an include.

## Update the JSON

Set `hasDevSpec` to `true` for the four current mock components.

Add a minimal `devSpec` object to each component.

Use a consistent prototype shape:

```json
{
  "hasDevSpec": true,
  "devSpec": {
    "status": "Prototype",
    "summary": "Short component-specific summary.",
    "usage": [],
    "behavior": [],
    "do": [],
    "dont": [],
    "code": {
      "language": "html",
      "snippet": ""
    }
  }
}
```

Use small component-specific mock values based on the current component behavior.

Do not duplicate annotation details inside `devSpec`. Token, state, accessibility, and class information already exists in `annotations` and should be derived from that source in Pass 4.

## Add the Conditional Action

Add a button labeled:

```text
View Dev Spec
```

Place it in the component viewing area immediately above the existing Previous / Pattern X of 4 / Next navigation.

Render the action only when:

```js
component.hasDevSpec === true
```

Attach the selected component ID:

```html
<button
  type="button"
  data-open-dev-spec="true"
  data-component-id="cta-banner"
>
  View Dev Spec
</button>
```

Use an existing button style where appropriate. Do not redesign the surrounding layout.

## Connect to Layer 3

Reuse the existing Layer 3 interaction architecture where practical:

1. Read the current `data-component-id`.
2. Resolve the selected component from `pattern-inspector.json`.
3. Pass that component object to the developer-spec renderer.
4. Open Layer 3.
5. Preserve existing close behavior.
6. Preserve existing focus behavior when practical.
7. Do not fetch an HTML include.

The Pattern Inspector should remain as standalone as possible.

Prefer a decoupled custom event if directly importing portfolio-specific Layer 3 code would tightly couple the module to `work.html`.

Example event:

```js
root.dispatchEvent(
  new CustomEvent("pattern-inspector:open-dev-spec", {
    bubbles: true,
    detail: {
      componentId: component.id,
      component
    }
  })
);
```

The host page may listen for that event and use the existing Layer 3 utility.

After inspecting the repository, choose the least invasive implementation that:

- Reuses the existing Layer 3 behavior
- Keeps the Pattern Inspector reusable
- Avoids duplicating modal logic
- Does not break project case studies

## Pass 3 Acceptance Criteria

- View Dev Spec appears only when `hasDevSpec` is true.
- The action reflects the currently selected component.
- The action exposes the selected component ID.
- Clicking the action opens Layer 3.
- The correct component object reaches the dev-spec renderer.
- No HTML include is requested.
- Existing project Layer 3 behavior still works.
- Existing Pattern Inspector behavior still works.
- There are not four hardcoded developer-spec pages.
- Closing Layer 3 returns the user to the inspector.

## Pass 3 Commit

```bash
git add .
git commit -m "add conditional pattern dev spec action"
```

---

# Pass 4 — Render a JSON-Driven Developer Specification

## Goal

Create one reusable developer-spec renderer that uses the selected component's JSON object to populate Layer 3.

## Create

```text
/portfolio-srvd/modules/pattern-inspector/dev-spec.js
```

## Required Export

Export one primary rendering function:

```js
export function renderDevSpec(component) {
  return `...`;
}
```

The function must receive the selected component object.

It must not:

- Fetch an HTML include
- Contain one hardcoded page per component
- Duplicate the component data
- Execute strings as JavaScript
- Use `eval`

## Data Used by the Renderer

Use:

```text
component.id
component.name
component.markup
component.annotations
component.devSpec
```

## Required Dev Spec Sections

The reusable developer-spec view should include:

1. Component name
2. Component ID
3. Prototype status
4. Summary
5. Live component preview
6. Usage guidance
7. Behavior
8. Do
9. Don't
10. Annotation inventory
11. Design tokens
12. States
13. Accessibility requirements
14. CSS classes
15. HTML code snippet

## Derive Existing Inspection Data

Do not store the following twice.

Derive these sections from `component.annotations`:

```text
Design tokens        <- annotation.details.token
States               <- annotation.details.state
Accessibility        <- annotation.details.a11y
CSS classes          <- annotation.details.class
Annotation inventory <- annotation.id + annotation.label
```

The dev spec may transform or group the annotation data for presentation, but the annotations remain the source of truth.

## Semantic HTML Structure

Inspect `/portfolio-srvd/includes` for useful semantic structure, then create a component-appropriate specification structure.

Use semantic elements such as:

```text
article
header
section
h1
h2
p
ul
ol
dl
dt
dd
figure
figcaption
pre
code
```

Maintain a logical heading hierarchy.

The HTML may be:

- Fully returned by `dev-spec.js`, or
- Partially mounted in a reusable shell in `pattern-inspector.html`

In either case, selected component data must be injected from JSON by JavaScript. Do not add separate component includes.

## `pattern-inspector.html`

Modify `pattern-inspector.html` only as needed to support:

- The View Dev Spec action
- A reusable Layer 3 mount point or dev-spec shell
- Accessible labels
- Close controls or integration hooks
- A region where `dev-spec.js` can inject selected component data

Do not hardcode four component specifications into the HTML.

## Rendering Safety

Because `component.markup` is repository-controlled HTML:

- Treat only the known repository component markup as trusted.
- Escape all plain-text JSON fields before injecting them into HTML.
- Escape code snippets before placing them inside `<code>`.
- Isolate intentional live markup rendering from plain-text rendering.
- Do not execute JSON values as code.
- Do not accept arbitrary external HTML.

## Preserve Selection State

Opening and closing Layer 3 must not reset:

- Current component
- Current annotation
- Current category

When the user closes the developer specification, the inspector should return to the same review position.

## Pass 4 Acceptance Criteria

- One `dev-spec.js` renderer supports all four components.
- All four components use the same semantic template.
- Each specification displays the correct component name and ID.
- Each specification displays component-specific mock data.
- Tokens are derived from annotations.
- States are derived from annotations.
- Accessibility requirements are derived from annotations.
- CSS classes are derived from annotations.
- The live preview renders the selected component.
- The code snippet is safely displayed as code.
- No HTML include is loaded.
- Layer 3 closes using the existing interaction.
- Inspector selection state is preserved.
- Existing project Layer 3 functionality is not broken.
- No external framework is introduced.

## Pass 4 Commit

```bash
git add .
git commit -m "render JSON-driven pattern developer specs"
```

---

# Expected Module Direction

The completed module may resemble:

```text
/portfolio-srvd/modules/pattern-inspector
  pattern-inspector.html
  pattern-inspector.css
  pattern-inspector.js
  pattern-inspector.json
  dev-spec.js
```

Use the actual existing filenames and directory structure if they differ.

Do not create a full registry such as this in the current branch:

```text
/components
  /cta-banner
    component.json
  /status-card
    component.json
```

That may be evaluated as a future step after the shared data contract is proven.

---

# Testing Requirements

## Test Every Component

For CTA Banner, Status Card, Button Group, and Form States, verify:

1. The component renders correctly.
2. The component matches its previous appearance.
3. Annotation markers appear in the correct locations.
4. Preview annotations are selectable.
5. Inspector list annotations are selectable.
6. Token details render.
7. State details render.
8. Accessibility details render.
9. Class details render.
10. Previous and Next states are correct.
11. View Dev Spec appears when enabled.
12. View Dev Spec opens the correct specification.
13. Layer 3 closes correctly.
14. Returning from Layer 3 preserves the selected component.
15. Returning from Layer 3 preserves the selected annotation.
16. Returning from Layer 3 preserves the selected category.

## Regression Test the Work Page

Verify:

- Project list view still renders.
- Chart view still renders.
- Project overlay still opens.
- `hasCaseStudy` still conditionally renders View Project.
- Project Layer 3 still opens.
- Project Layer 3 still loads existing project content.
- Existing Layer 3 close behavior still works.
- No duplicate Layer 3 listeners are created.
- No new console errors appear.

## Initialization and Failure Tests

Verify:

- The Pattern Inspector initializes once.
- Re-running initialization does not duplicate annotations.
- Re-running initialization does not duplicate event listeners.
- Missing JSON reports a useful warning or error state.
- One malformed component does not break valid components.
- One missing annotation anchor does not break the entire inspector.

---

# Final Deliverables

When all four passes are complete, return the following.

## 1. Branch Confirmation

Confirm the completed branch:

```text
refactor/pattern-inspector-json-dev-spec
```

## 2. Commit Summary

List the four commits and the purpose of each.

## 3. File Summary

List:

- Files created
- Files modified
- Files intentionally left unchanged
- Any files inspected but not changed

## 4. Architecture Summary

Explain:

- How component data moved from JavaScript into JSON
- How the selected component drives the live preview
- How the selected component drives annotations
- How the selected component drives inspector details
- How `hasDevSpec` controls the action
- How the selected component reaches Layer 3
- How `dev-spec.js` renders one reusable specification
- How the implementation avoids duplicated data
- How the Pattern Inspector remains decoupled from the portfolio host where practical

## 5. How to Add a New Component

Document the exact steps to add a fifth component.

Include:

- Required top-level JSON fields
- Required annotation fields
- Markup requirements
- `data-annotation-anchor` requirements
- Unique ID requirements
- `hasDevSpec`
- `devSpec`
- CSS requirements
- Testing steps
- Current limitations

Provide a minimal example JSON object.

## 6. Verification Report

Report:

- Tests performed
- Tests passed
- Any failed tests
- Known limitations
- Browser or environment assumptions
- Any product-design decisions that remain unresolved

## 7. Recommendations for Next Steps

Make recommendations only. Do not implement them in this branch.

Evaluate:

- Whether to create a lightweight component registry next
- Whether components should move into individual JSON files
- Whether JSON schema validation should be added
- Whether Guided Review Mode should be the next product pass
- Whether stakeholder-specific review modes should filter the same component data
- Whether approval, comment, and completion states belong in this data model
- Whether code snippets should be stored or generated
- Whether the UI kit and dev spec can remain two views of the same component source
- Whether the JSON layer should later be replaced by a database or content API
- Whether component versioning and deprecation metadata should be added
- Whether a migration path is needed for existing components

---

# Definition of Done

This task is complete only when:

- A new branch contains the refactor.
- The four components are loaded from JSON.
- The current Pattern Inspector still looks and behaves the same.
- The component and annotation contracts are documented.
- Rendering responsibilities are separated.
- Invalid data fails safely.
- `hasDevSpec` conditionally displays View Dev Spec.
- The selected component opens Layer 3.
- Layer 3 does not load a dev-spec include.
- One `dev-spec.js` template supports all four components.
- Annotation data powers token, state, accessibility, and class sections.
- Existing project list, chart, overlay, and case-study flows still work.
- The final report explains the refactor and how to add new components.
- Next-step recommendations are documented but not implemented.
