#1 - Chart is not part of this implementation.  No recommendations or fixes needed.  It is functioning as expected.

#4
a. All projects should now point to its related work html file, but should be converted into include shape to display within layer 3. The existing Designing with AI project is currently an include.  The Work projects should follow this same pattern. (See 12.i.)
b. Designing with AI's 2 versions: SRVD has the correct layer 3 implementation, but CLEAN has the latest copy. 
c. CLEAN is the authoritative source of truth for project thumbnails
d. CLEAN is the authoritative source for metadata.
e. SRVD project pages should be converted to includes, and its url updated in data.json

#5 Do not use CLEAN's interface-projects.js.  Use the existing SRVD implementation and wire the Work projects into the existing include architecture in Layer-3 

#6
a. Use CLEAN's Lightbox
b. CSS dependencies - Do not carry over CLEAN's font tokens.  Use SRVD's existing tokens. CLEAN duplicated tokens and caused design drift from SRVD in the Work projects.  Add CLEAN's motion tokens if a reasonable existing SRVD token does not exist.

#7 Remove all Work project page breadcrumbs.  They will be retired in SRVD.

#9 
a. Work.html is the authoritative source.  There will be no active category index pages at this time.  Leave work category index pages as-is for a future refactor.
b. AMResorts Download App url should point to a past press-release confirming proof that the app actually shipped on native app stores.

#10 
a. Migrated headers should use existing heading pattern and --type-xl token.

# 12
a. Whether Flamingo Gardens should appear in the authoritative project list and its metrics/order - YES
b. Final ordering of the four added records - KEEP THE SAME
c. Whether SRVD or Clean copy wins for the nine shared records - CLEAN
d. Whether florida-blue-data-sharing should open a case studY - YES
e. Whether Designing With AI should open Layer 3 or its standalone page - KEEP SRVD EXISTING LAYER 3 VERSION. ONLY COPY IS NEEDED FROM CLEAN INTO EXISTING SRVD VERSION
f. Which AMResorts thumbnail to use and whether its obsolete app CTA should be removed - CLEAN THUMBNAIL. KEEP CTA
g. The correct Exposed brochure destination - /assets/work/acch/exposed-booklet.pdf
h. Whether category index pages remain as compatibility URLs or are retired - RETIRED
i. What should replace the now-invalid Services/About navigation items (see below)
j. Whether gallery images should use SRVD’s existing image-zoom lightbox - YES

I. ADDITIONAL CONTEXT
All work projects will now display in Layer 3 with the full viewport height variant. Global navigation should be removed from all project pages. Project breadcrumbs will be retired.