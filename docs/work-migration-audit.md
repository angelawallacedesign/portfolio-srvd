# Portfolio SRVD — Work Migration Audit

## 1. Executive summary

The HTML migration is complete by file count: Portfolio SRVD contains the same 12 Work HTML files as Portfolio Clean—eight project pages, three category indexes, and one archive index.

The migrated pages are not fully functional because:

- Eight project pages reference missing `js/work-lightbox.js`.
- Two category pages reference missing `js/interface-projects.js`.
- The Clean versions of those scripts are not drop-in compatible with SRVD.
- `work-gallery.css` depends on seven typography/motion tokens absent from SRVD.
- Clean’s lightbox and heading-variant styles were formerly supplied by `components.css`, but SRVD’s version no longer contains them.
- Four migrated projects are absent from SRVD’s authoritative `js/data.json`.
- The current renderer ignores migrated `projectUrl`, category, archive-image, and featured fields.
- The chart is not initially rendered because `renderProjectChart(processedData)` is never called after loading.
- Project-page breadcrumbs are largely corrected, but global Work navigation still points to the duplicate `/work/` archive rather than `work.html`.
- All Services/About links under `/work/` now target nonexistent root-page fragments.

Positive findings:

- All 79 local image references resolve.
- The 77 unique image targets exist.
- `assets/work/2019` is byte-identical to Portfolio Clean.
- All referenced CSS files exist.
- No migrated HTML contains a `/portfolio-clean` reference.
- Every existing SRVD JSON image/include path resolves.
- No duplicate project IDs exist.

## 2. Projects present in both data files

Nine IDs exist in both `portfolio-srvd/js/data.json` and `portfolio-clean/js/data.json`:

- `designing-with-ai`
- `florida-blue-payments-experience`
- `florida-blue-data-sharing`
- `allin-social-media-feature`
- `allin-interactive-material-design-skin`
- `exposed-exhibition-campaign`
- `citrix-systems`
- `RCCL`
- `Kaplan`

There are no SRVD-only IDs and no duplicate IDs in either file.

## 3. Projects missing from `/portfolio-srvd/js/data.json`

Four Clean records are absent from SRVD:

| Missing ID | Migrated page |
|---|---|
| `AMResorts-multi-platform-app` | `work/interface-design/am-resorts.html` |
| `interactive-tv-interface` | `work/interface-design/interactive-tv.html` |
| `norwegian-iconcierge` | `work/interface-design/norwegian.html` |
| `outside-in-art-exhibition-campaign` | `work/graphic-design/outside-in.html` |

Additionally, `work/branding/flamingo-gardens.html` exists as a migrated project but has no record in either JSON file. It requires a new record if it should appear in the authoritative SRVD project list.

## 4. Project-data conflicts or schema concerns

The SRVD JSON structure can accept the migrated records without a structural migration. Optional fields such as `projectUrl`, `category`, `featured`, `layout`, `archiveImageUrl`, and `featuredUrl` can coexist with the current fields.

The renderer—not JSON—is the compatibility problem.

Notable conflicts:

- Clean uses `projectUrl` for standalone migrated pages. SRVD’s renderer ignores it.
- Several migrated records use `hasCaseStudy: false`; SRVD therefore renders no action at all, even when `projectUrl` exists.
- Clean’s AMResorts `meta.imageUrl` points to missing `assets/work/allin/zoetry-thumb-wide.jpg`. Its existing `archiveImageUrl` and hero image do exist in SRVD.
- AMResorts also has an `htmlInclude` pointing to nonexistent `includes/case-studies/layer3-test.html`.
- `florida-blue-data-sharing` conflicts on `hasCaseStudy`: `false` in SRVD versus `true` in Clean.
- Designing With AI uses two different destinations: SRVD’s Layer 3 include versus Clean’s standalone `projects/designing-with-ai/`.
- Payments, data-sharing, and social-feature records use different thumbnails between repos.
- All nine common records contain some copy or metadata differences. Existing SRVD values should remain authoritative unless individually approved.

The current components also incorrectly use `data.title`; both datasets place the title at `data.heading.title`. This produces `"undefined"` image alt text and chart tooltip/ARIA labels.

## 5. Work project-list wiring findings

The root list is rendered by `js/data.js`:

1. It fetches `./js/data.json`.
2. It caches the records.
3. It calls `renderProjectCard()` from `js/components.js`.
4. It injects the result into `#project-list` in `work.html`.

Therefore, the migrated projects do not load into the root list because they are absent from SRVD’s JSON.

Further wiring issues:

- `renderProjectCard()` only understands the Layer 3 query-link behavior.
- It ignores `projectUrl`, `archiveImageUrl`, `featured`, `layout`, and `category`.
- `hasCaseStudy: false` suppresses all navigation.
- `js/chart.js` processes the data but never calls `renderProjectChart(processedData)` initially. The chart remains blank until a resize event.
- Both `data.js` and `chart.js` lack `response.ok` checks and `.catch()` handling.
- Category lists rely on missing `interface-projects.js`. Clean’s version cannot simply be copied because it calls `renderProjectCard(project, options)`, while SRVD’s renderer does not implement those options.

The existing SRVD architecture is reusable, but it needs a small routing-aware enhancement rather than replacement.

## 6. Missing/broken project assets or dependencies

### Confirmed missing dependencies

- `js/work-lightbox.js` is referenced by all eight project pages.
- `js/interface-projects.js` is referenced by:

  - `work/interface-design/index.html`
  - `work/graphic-design/index.html`

Copying the Clean lightbox scripts alone would remain incomplete:

- Clean’s `work-lightbox.js` imports another missing file, `js/lightbox.js`.
- Required `.lightbox*` CSS formerly lived in Clean’s `components.css`; those selectors do not exist in SRVD.
- SRVD already has a better isolated lightbox implementation under `utilities/image-zoom-lightbox/`, which should be reused.

### CSS dependency conflicts

`css/work-gallery.css` is identical to Clean but references undefined SRVD tokens:

- `--type-hero`
- `--type-hero-accent`
- `--type-body`
- `--type-body-lg`
- `--type-small`
- `--motion-fast`
- `--ease-standard`

`--color-border` is also undefined, but its use has a fallback.

Missing typography tokens invalidate several font-size declarations, so headings, breadcrumbs, notes, and mobile project copy may inherit unintended sizes.

### Asset results

- Missing HTML-referenced images: **0**
- Missing HTML-referenced CSS files: **0**
- Unique local image targets checked: **77**
- Stale `/portfolio-clean` references: **0**
- Existing SRVD JSON paths missing: **0**

## 7. Breadcrumb audit findings

The eight project breadcrumbs have been changed to the intended two-level structure:

`Work → Project`

Their Work links correctly resolve to `../../work.html`.

Remaining inconsistencies:

- The global Work navigation on project/category pages still uses `../`, resolving to `/work/`, not root `work.html`.
- `/work/index.html` links Work to itself using `./`.
- Category indexes still retain `Work → Category` breadcrumbs. That is reasonable if those pages remain compatibility/archive pages, but conflicts with fully retiring the category level.
- HOME links resolve correctly to root `index.html`.
- Services and About links are now broken because root `index.html` no longer contains `#services` or `#about`: 24 broken fragment references across 12 pages.
- Project breadcrumb labels are not always aligned with project titles—for example “Style Guide” versus “Flamingo Gardens” and “Allin Demo Skin” versus “Material Interface Design.” This is a content-consistency question rather than a routing failure.

## 8. Underline artifact cause

The likely source is `css/work-gallery.css`:

```css
.work-breadcrumb a {
  color: inherit;
}

.work-breadcrumb a::after {
  content: "/";
}
```

The breadcrumb anchor retains the browser’s default underline because no scoped `text-decoration` is set. The generated slash is inside the anchor and participates in the link’s text decoration, producing an apparent extra underline beneath or alongside the separator.

The category-link removal exposed this more clearly because the single remaining Work anchor still owns the separator pseudo-element.

## 9. Other migration risks

- There are now two Work landing surfaces: root `work.html` and `/work/index.html`. Navigation currently mixes them.
- SRVD’s `main.css`, `components.css`, and tokens differ substantially from Clean. Replacing them with Clean versions would regress current SRVD functionality.
- Clean’s `.section-heading.hero`, `.section-heading.small`, and lightbox definitions are absent from SRVD, although migrated pages still use those classes.
- The Exposed page’s “View Brochure” CTA incorrectly points to the Norwegian iConcierge press release. The target itself is live and describes Norwegian’s app, confirming it is unrelated to Exposed. [NCL press release](https://es.ncl.com/press-releases/norwegian-getaway-feature-innovative-norwegian-iconcierge-smart-phone-application)
- The AMResorts “Download app” URL uses obsolete HTTP and could not be opened directly. The former Unlimited Connectivity app was removed from Google Play in April 2024, so the CTA is likely no longer actionable. [App availability record](https://www.appbrain.com/app/unlimited-connectivity/digiMobile.Startup.AMRDreams)
- The Observable Plot CDN remains an external runtime dependency for the root chart.
- The repository already contains uncommitted and untracked migration work, including a modified `work.html`; future changes must preserve that state carefully.

## 10. Recommended implementation plan

| Issue | Affected files | Recommended fix/reuse | Risk | Existing SRVD impact |
|---|---|---|---|---|
| Four records missing | `js/data.json` | Add selectively reconciled records; retain SRVD as authority | Medium | Adds cards/chart points |
| Flamingo Gardens absent | `js/data.json` | Add only after metadata/order approval | Medium | Adds a new authoritative record |
| Standalone pages not navigable | `js/components.js` | Prefer `projectUrl` when present; retain query/Layer 3 behavior otherwise | Medium | Could affect existing card actions |
| Incorrect alt/chart titles | `js/components.js`, `js/chart.js` | Use `heading.title` | Low | Improves accessibility |
| Chart blank initially | `js/chart.js` | Call `renderProjectChart(processedData)` after processing | Low | Activates intended chart |
| Category loaders missing | Category indexes plus a small loader | Add an SRVD-compatible filtered loader using `js/data.json` and enhanced `renderProjectCard()` | Medium | Limited to archive pages |
| Legacy lightbox dependencies missing | Eight project pages | Reuse SRVD’s `utilities/image-zoom-lightbox` CSS/JS and its classes; do not restore Clean’s lightbox stack | Medium | Isolated to gallery pages |
| Missing tokens | `css/work-gallery.css` or `css/tokens.css` | Map Work-scoped values to current SRVD tokens; avoid restoring Clean token files wholesale | Medium | Scoped if kept under `.work-archive` |
| Missing heading variants | `css/work-gallery.css` | Define only the archive-specific hero/small behavior | Low | Work pages only |
| Breadcrumb underline | `css/work-gallery.css` | Remove anchor decoration or separate the slash from decorated link text | Low | Work breadcrumbs only |
| Mixed Work destinations | All migrated headers/breadcrumbs | Standardize Work to `../../work.html` or `../work.html` as appropriate | Low | Navigation only |
| Dead root fragments | All migrated headers | Remove Services/About or choose valid current destinations | Low | Navigation only |
| Incorrect external CTAs | `exposed.html`, `am-resorts.html` | Replace/remove after destination approval | Low | Those two CTAs only |
| Fragile fetch handling | `js/data.js`, `js/chart.js`, future archive loader | Add `response.ok` and error-state handling | Low | Better failure behavior |

## 11. Files that would be modified in the future implementation pass

Required or likely:

- `js/data.json`
- `js/components.js`
- `js/data.js`
- `js/chart.js`
- `css/work-gallery.css`
- `work/index.html`
- `work/branding/index.html`
- `work/graphic-design/index.html`
- `work/interface-design/index.html`
- All eight migrated project HTML files

Potential new file:

- A small SRVD-native archive/category list loader, unless the category pages are retired.

Existing reusable dependencies:

- `utilities/image-zoom-lightbox/image-zoom-lightbox.css`
- `utilities/image-zoom-lightbox/image-zoom-lightbox.js`

`work.html` may not require structural changes once the JSON and renderer are reconciled.

## 12. Items requiring human review or approval

- Whether Flamingo Gardens should appear in the authoritative project list and its metrics/order.
- Final ordering of the four added records.
- Whether SRVD or Clean copy wins for the nine shared records.
- Whether `florida-blue-data-sharing` should open a case study.
- Whether Designing With AI should open Layer 3 or its standalone page.
- Which AMResorts thumbnail to use and whether its obsolete app CTA should be removed.
- The correct Exposed brochure destination.
- Whether category index pages remain as compatibility URLs or are retired.
- What should replace the now-invalid Services/About navigation items.
- Whether gallery images should use SRVD’s existing image-zoom lightbox.

**No files were modified during this audit.**
