/**
 * Stable implementation records for the Pass 1 shell.
 *
 * Pass 3 will introduce validated DOM renderers and the complete pattern
 * inventory. Keeping data outside the controller now prevents the workspace
 * shell from becoming the component registry.
 */
export const patternInspectorRecords = [
  {
    familyId: "marketing-actions",
    patternId: "cta-banner",
    versionId: "v4-foundation",
    name: "CTA Banner",
    status: "Foundation",
    summary: "A focused message with one primary and one secondary action.",
    annotations: [
      {
        annotationId: "background",
        label: "Background Color",
        details: {
          token: "--theme-surface",
          state: "Default surface",
          a11y: "Contrast preserves legibility",
          className: ".pi-v4-cta-banner",
        },
      },
    ],
  },
];

export const defaultPatternIdentity = Object.freeze({
  familyId: patternInspectorRecords[0].familyId,
  patternId: patternInspectorRecords[0].patternId,
  versionId: patternInspectorRecords[0].versionId,
});
