# Approved Implementation Direction — Portfolio SRVD Work Migration

Proceed with implementation based on the audit findings and the decisions below.

## 1. Chart

The chart is **not part of this implementation**.

It is functioning as expected.

Do not make recommendations, fixes, or changes to the chart in this pass.

## 2. Authoritative Work architecture

All Work projects will display in **Layer 3** using the existing **full viewport height variant**.

The existing `designing-with-ai` project in SRVD is the reference implementation for this architecture.

For migrated Work projects:

- Convert the existing project-page content into the same include structure used by Designing with AI.
- Load those includes inside the existing SRVD Layer 3 architecture.
- Update the associated records in `/portfolio-srvd/js/data.json` so their destinations point to the appropriate Layer 3 include.
- Do not introduce a second project-page routing system.
- Do not use standalone project pages as the final SRVD presentation model.

The existing migrated HTML files may be used as the source content for conversion into includes.

## 3. Project source-of-truth decisions

### Shared project records

For the nine records that exist in both Clean and SRVD:

**Portfolio Clean wins for project copy and metadata.**

Use Clean as the authoritative source for:

- project thumbnails
- titles
- descriptions/copy
- project metadata
- metrics
- related project data

### Designing With AI exception

Designing With AI has two valid implementations:

- SRVD contains the correct Layer 3 implementation.
- Clean contains the latest project copy.

Keep the existing **SRVD Layer 3 implementation**.

Only reconcile the newer copy/metadata from Clean into the existing SRVD version.

Do not replace it with Clean's standalone project-page implementation.

## 4. Data reconciliation

`/portfolio-srvd/js/data.json` remains the authoritative runtime data source.

Add the four missing Clean records while preserving their existing order:

- `AMResorts-multi-platform-app`
- `interactive-tv-interface`
- `norwegian-iconcierge`
- `outside-in-art-exhibition-campaign`

Also add **Flamingo Gardens** to the authoritative project list.

Keep the current intended ordering.

Use Clean metadata and thumbnails when reconciling shared records.

Update migrated Work records so their project destination uses the appropriate SRVD Layer 3 include.

### Florida Blue Data Sharing

`florida-blue-data-sharing` **should open its case study**.

Preserve that behavior when reconciling its record.

## 5. Work project-list implementation

Do **not** use or migrate Clean's `interface-projects.js`.

Use the existing SRVD project-list implementation and existing Layer 3/include architecture.

Wire the migrated Work records into that implementation.

The goal is one authoritative project-rendering architecture, not separate legacy and SRVD renderers.

## 6. Project page conversion

The existing SRVD Work project pages should be converted into **Layer 3 includes**.

Use Designing With AI as the structural reference.

For the converted Work projects:

- remove global navigation from the project content
- remove project breadcrumbs
- preserve project-specific content and media
- preserve the full viewport height Layer 3 presentation
- use the existing SRVD design system and component architecture

Do not recreate the Clean page shell inside Layer 3.

Only migrate the actual project content needed by the include.

## 7. Breadcrumbs

All Work project-page breadcrumbs are being retired.

Remove them from the converted project content.

Do not repair, restyle, or preserve the breadcrumb implementation.

Because breadcrumbs are being removed, no breadcrumb underline-specific fix is required beyond removing the retired breadcrumb markup/styles where appropriate.

Category index pages are not part of this refactor and may retain their existing implementation for now.

## 8. Global navigation

Global navigation should not appear inside Work project Layer 3 content.

Remove the migrated page-level global navigation as part of the include conversion.

The containing SRVD application shell remains responsible for global navigation.

## 9. Category pages

`work.html` is the authoritative Work index.

There will be **no active category index pages at this time**.

The existing category index files may remain in the repository unchanged for a future refactor, but they should not be part of the active navigation or current implementation.

Do not spend this pass rebuilding or wiring category index pages.

## 10. Lightbox

Use SRVD's existing image zoom/lightbox implementation:

- existing SRVD lightbox CSS
- existing SRVD lightbox JavaScript
- existing SRVD interaction pattern

Do not migrate Clean's:

- `work-lightbox.js`
- `lightbox.js`
- old lightbox CSS stack

Gallery images in the migrated Work projects should use the existing SRVD image-zoom lightbox.

## 11. CSS and tokens

Do not carry over Clean's font tokens.

The audit confirmed that Clean introduced typography token dependencies that do not exist in SRVD and contributed to design drift.

Use SRVD's existing typography tokens.

### Migrated project headings

Migrated project headers should use the existing SRVD heading pattern and:

`--type-xl`

Do not restore Clean's:

- `--type-hero`
- `--type-hero-accent`
- `--type-body`
- `--type-body-lg`
- `--type-small`

Map migrated styles to the closest existing SRVD tokens instead.

### Motion

If migrated functionality requires a Clean motion token:

1. first determine whether an equivalent SRVD motion token already exists
2. reuse the SRVD token if it does
3. only add the Clean motion token if there is no reasonable existing SRVD equivalent

Avoid duplicate semantic tokens.

## 12. Specific project decisions

### Flamingo Gardens

Yes, Flamingo Gardens should appear in the authoritative Work project list.

Add its project record and preserve the intended project ordering.

### AMResorts

Use the **Clean thumbnail**.

Keep the existing CTA.

The CTA should point to a **past press release or other authoritative historical source confirming that the AMResorts app shipped on native app stores**.

Do not point the CTA to a dead app-store listing.

### Exposed

The brochure destination is:

`/assets/work/acch/exposed-booklet.pdf`

Update the project CTA accordingly.

### Norwegian iConcierge

Use Clean's authoritative metadata/thumbnail while converting the project content into the SRVD Layer 3 include architecture.

### Designing With AI

Keep the existing SRVD Layer 3 implementation.

Only update its project copy/metadata from Clean.

### Florida Blue Data Sharing

It should continue opening its case study.

## 13. Navigation items inside migrated pages

The invalid Services/About navigation identified in the audit does **not** need replacement destinations.

Those navigation elements should disappear as part of converting project pages into Layer 3 includes.

Do not invent replacement links.

## 14. Implementation principles

Preserve SRVD as the runtime and design-system authority.

Use Clean only as the authoritative source for migrated Work:

- project copy
- metadata
- thumbnails
- source project content where needed

Do not replace SRVD architecture with Clean architecture.

Prefer:

**Clean content → SRVD components → SRVD tokens → SRVD Layer 3 behavior**

rather than migrating Clean's page infrastructure.

## 15. Scope exclusions

Do not:

- modify the chart
- use Clean's `interface-projects.js`
- restore Clean's lightbox implementation
- restore Clean typography tokens
- rebuild category index pages
- introduce standalone project routing as the primary SRVD behavior
- add replacement Services/About links
- redesign unrelated SRVD sections
- replace SRVD CSS/JS files wholesale with Clean versions

## 16. Verification after implementation

Verify:

1. Every intended Work project appears in the authoritative SRVD project data.
2. Flamingo Gardens appears in the project list.
3. The four missing Clean records have been reconciled.
4. Shared project records use Clean's latest approved copy, metadata, and thumbnails.
5. Designing With AI still uses its existing SRVD Layer 3 implementation.
6. Florida Blue Data Sharing still opens its case study.
7. Migrated Work projects open in Layer 3 using the full viewport height variant.
8. Work project includes contain no global navigation.
9. Work project includes contain no breadcrumbs.
10. Gallery images use SRVD's existing image-zoom lightbox.
11. Migrated headings use the existing SRVD heading pattern with `--type-xl`.
12. No Clean font-token dependencies remain.
13. `work.html` is the active authoritative Work index.
14. Category indexes remain untouched and are not part of active Work navigation.
15. Exposed points to `/assets/work/acch/exposed-booklet.pdf`.
16. AMResorts retains its CTA with an appropriate historical proof-of-shipment destination.
17. Existing SRVD functionality outside the Work migration remains unchanged.