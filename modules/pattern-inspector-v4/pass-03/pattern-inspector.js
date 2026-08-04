import { defaultPatternIdentity, patternInspectorRecords } from "./pattern-inspector-data.js";
import {
  renderInspector,
  renderInspectorDetail,
  renderInspectorTabs,
  renderInteractionState,
  renderNavigation,
  renderPattern,
  renderViewer,
  renderWorkspace,
  supportedRendererNames,
} from "./pattern-inspector-renderers.js";

const RESPONSIVE_MEDIA_QUERY = "(max-width: 68rem)";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const REQUIRED_PATTERN_FIELDS = [
  "familyId", "familyName", "patternId", "versionId", "name", "description",
  "category", "status", "owner", "reviewState", "component", "annotations",
  "previousVersionId", "nextVersionId", "relatedPatternIds", "tokens", "states",
  "accessibility", "classes", "responsiveRules",
];
const NULLABLE_PATTERN_FIELDS = new Set(["previousVersionId", "nextVersionId"]);
const REQUIRED_ANNOTATION_FIELDS = [
  "annotationId", "displayLabel", "category", "targetKey", "title", "description",
  "token", "state", "accessibility", "className", "anchor",
];

function createInstanceId(requestedId) {
  if (requestedId) return String(requestedId).replace(/[^a-zA-Z0-9_-]/g, "-");
  if (globalThis.crypto?.randomUUID) return `pi-v4-${globalThis.crypto.randomUUID()}`;
  return `pi-v4-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function patternKey(pattern) {
  return `${pattern.familyId}:${pattern.patternId}:${pattern.versionId}`;
}

function validatePatternRecords(records) {
  if (!Array.isArray(records) || !records.length) throw new Error("Pattern records must be a non-empty array");
  const identities = new Set();

  records.forEach((record, patternIndex) => {
    REQUIRED_PATTERN_FIELDS.forEach((field) => {
      const isMissing = !(field in record) || record[field] === undefined;
      const isEmpty = !NULLABLE_PATTERN_FIELDS.has(field) && (record[field] === null || record[field] === "");
      if (isMissing || isEmpty) {
        throw new Error(`Pattern ${patternIndex + 1} is missing ${field}`);
      }
    });
    if (!supportedRendererNames.includes(record.component.renderer)) {
      throw new Error(`Pattern ${record.patternId} uses unsupported renderer ${record.component.renderer}`);
    }
    const identity = patternKey(record);
    if (identities.has(identity)) throw new Error(`Duplicate pattern identity ${identity}`);
    identities.add(identity);

    if (!Array.isArray(record.annotations) || !record.annotations.length) {
      throw new Error(`Pattern ${identity} must contain annotations`);
    }
    const annotationIds = new Set();
    const targetKeys = new Set();
    record.annotations.forEach((annotation, annotationIndex) => {
      REQUIRED_ANNOTATION_FIELDS.forEach((field) => {
        if (annotation[field] === undefined || annotation[field] === null || annotation[field] === "") {
          throw new Error(`Annotation ${annotationIndex + 1} in ${identity} is missing ${field}`);
        }
      });
      if (annotationIds.has(annotation.annotationId)) throw new Error(`Duplicate annotation ${annotation.annotationId} in ${identity}`);
      if (targetKeys.has(annotation.targetKey)) throw new Error(`Duplicate annotation target ${annotation.targetKey} in ${identity}`);
      annotationIds.add(annotation.annotationId);
      targetKeys.add(annotation.targetKey);
    });
  });
  return records;
}

function findPattern(records, identity) {
  return records.find((record) =>
    record.familyId === identity.familyId &&
    record.patternId === identity.patternId &&
    record.versionId === identity.versionId
  ) || records[0];
}

function createWorkspaceState(pattern, isResponsive) {
  const state = {
    familyId: pattern.familyId,
    patternId: pattern.patternId,
    versionId: pattern.versionId,
    activeInspectorTab: "token",
    annotationId: pattern.annotations[0].annotationId,
    hoveredAnnotationId: null,
    focusedAnnotationId: null,
    leftPanelOpen: true,
    rightPanelOpen: true,
    activeResponsiveDrawer: null,
    isResponsive,
  };
  Object.defineProperty(state, "presentationMode", {
    enumerable: true,
    get() {
      return !state.isResponsive && !state.leftPanelOpen && !state.rightPanelOpen;
    },
  });
  return state;
}

function instantiateRelationships(root, instanceId) {
  const idMap = new Map();
  root.dataset.piInstanceId = instanceId;
  root.querySelectorAll("[data-pi-id]").forEach((node) => {
    const id = `${instanceId}-${node.dataset.piId}`;
    idMap.set(node.dataset.piId, id);
    node.id = id;
  });
  root.querySelectorAll("[data-pi-controls]").forEach((node) => {
    node.setAttribute("aria-controls", idMap.get(node.dataset.piControls));
  });
  root.querySelector("[data-pi-left-panel]").setAttribute("aria-labelledby", idMap.get("navigation-title"));
  root.querySelector("[data-pi-right-panel]").setAttribute("aria-labelledby", idMap.get("inspector-title"));
  root.querySelector("[data-pi-viewer]").setAttribute("aria-labelledby", idMap.get("viewer-title"));
  root.querySelector("[data-pi-tabpanel]").setAttribute("aria-labelledby", idMap.get("tab-token"));
  return idMap;
}

function initializePanelControls(root, state, mediaQuery) {
  const controls = {
    left: root.querySelector('[data-pi-panel-control="left"]'),
    right: root.querySelector('[data-pi-panel-control="right"]'),
  };
  const panels = {
    left: root.querySelector("[data-pi-left-panel]"),
    right: root.querySelector("[data-pi-right-panel]"),
  };
  const status = root.querySelector(".pi-v4-status");
  const statusMessage = root.querySelector("[data-pi-status-message]");
  const viewMode = root.querySelector("[data-pi-view-mode]");
  const viewer = root.querySelector("[data-pi-viewer]");
  const backdrop = root.querySelector("[data-pi-drawer-backdrop]");
  let drawerOpener = null;

  const panelIsOpen = (side) => side === "left" ? state.leftPanelOpen : state.rightPanelOpen;
  const setPanelOpen = (side, open) => {
    if (side === "left") state.leftPanelOpen = open;
    else state.rightPanelOpen = open;
  };
  const focusableElements = (panel) => Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter((node) =>
    !node.disabled && !node.closest("[hidden]")
  );

  function renderWorkspaceState() {
    const activeDrawer = state.isResponsive ? state.activeResponsiveDrawer : null;
    root.dataset.piResponsive = String(state.isResponsive);
    root.dataset.piLeftState = state.leftPanelOpen ? "open" : "closed";
    root.dataset.piRightState = state.rightPanelOpen ? "open" : "closed";
    root.dataset.piActiveDrawer = activeDrawer || "none";
    root.dataset.piPresentation = String(state.presentationMode);

    Object.entries(panels).forEach(([side, panel]) => {
      const visible = state.isResponsive ? activeDrawer === side : panelIsOpen(side);
      panel.hidden = !state.isResponsive && !visible;
      panel.inert = state.isResponsive ? !visible : false;
      panel.setAttribute("aria-hidden", String(!visible));
      if (state.isResponsive && visible) {
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.tabIndex = -1;
      } else {
        panel.removeAttribute("role");
        panel.removeAttribute("aria-modal");
        panel.removeAttribute("tabindex");
      }
      const expanded = state.isResponsive ? visible : panelIsOpen(side);
      const action = state.isResponsive ? (visible ? "Close" : "Open") : (expanded ? "Hide" : "Show");
      const noun = side === "left" ? "navigation" : "inspector";
      controls[side].setAttribute("aria-expanded", String(expanded));
      controls[side].querySelector("[data-pi-control-label]").textContent = `${action} ${noun}`;
    });

    const drawerOpen = Boolean(activeDrawer);
    status.inert = drawerOpen;
    viewer.inert = drawerOpen;
    backdrop.hidden = !drawerOpen;
    backdrop.inert = !drawerOpen;
    if (state.isResponsive) {
      viewMode.textContent = activeDrawer ? `${activeDrawer === "left" ? "Navigation" : "Inspector"} drawer` : "Responsive";
      statusMessage.textContent = activeDrawer ? `${activeDrawer === "left" ? "Navigation" : "Inspector"} panel open` : "Responsive workspace";
    } else if (state.presentationMode) {
      viewMode.textContent = "Presentation";
      statusMessage.textContent = "Presentation mode";
    } else {
      viewMode.textContent = "Workspace";
      statusMessage.textContent = "Workspace mode";
    }
  }

  function focusDrawer(side) {
    const panel = panels[side];
    const selectedTab = side === "right" ? panel.querySelector('[role="tab"][aria-selected="true"]') : null;
    const target = selectedTab || focusableElements(panel)[0] || panel;
    root.ownerDocument.defaultView.requestAnimationFrame(() => target.focus());
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    if (!state.activeResponsiveDrawer) return;
    state.activeResponsiveDrawer = null;
    renderWorkspaceState();
    if (restoreFocus && drawerOpener?.isConnected) drawerOpener.focus();
    drawerOpener = null;
  }

  function openDrawer(side, opener) {
    state.activeResponsiveDrawer = side;
    drawerOpener = opener;
    renderWorkspaceState();
    focusDrawer(side);
  }

  function togglePanel(side) {
    if (state.isResponsive) {
      if (state.activeResponsiveDrawer === side) closeDrawer();
      else openDrawer(side, controls[side]);
      return;
    }
    setPanelOpen(side, !panelIsOpen(side));
    renderWorkspaceState();
  }

  Object.entries(controls).forEach(([side, control]) => control.addEventListener("click", () => togglePanel(side)));
  backdrop.addEventListener("click", () => closeDrawer());
  root.addEventListener("keydown", (event) => {
    const side = state.activeResponsiveDrawer;
    if (!state.isResponsive || !side) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = focusableElements(panels[side]);
    if (!focusable.length) {
      event.preventDefault();
      panels[side].focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && root.ownerDocument.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && root.ownerDocument.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const handleBreakpointChange = (event) => {
    const hadOpenDrawer = Boolean(state.activeResponsiveDrawer);
    state.isResponsive = event.matches;
    if (hadOpenDrawer) closeDrawer({ restoreFocus: true });
    else {
      state.activeResponsiveDrawer = null;
      renderWorkspaceState();
    }
  };
  if (typeof mediaQuery.addEventListener === "function") mediaQuery.addEventListener("change", handleBreakpointChange);
  else mediaQuery.addListener(handleBreakpointChange);
  renderWorkspaceState();
  return Object.freeze({ closeDrawer, render: renderWorkspaceState, togglePanel });
}

function initializeInspectorTabs(context) {
  const { root, state } = context;
  const tabs = Array.from(root.querySelectorAll("[data-pi-tab]"));
  const selectTab = (tab, moveFocus = false) => {
    state.activeInspectorTab = tab.dataset.piTab;
    renderInspectorTabs(context);
    renderInspectorDetail(context);
    if (moveFocus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });
}

function renderPatternSelection(context, { focusNavigation = false } = {}) {
  renderNavigation(context);
  renderViewer(context);
  renderPattern(context);
  renderInspectorTabs(context);
  renderInspector(context);
  renderInteractionState(context);
  if (focusNavigation) {
    const currentKey = patternKey(context.currentPattern());
    context.root.querySelector(`[data-pi-pattern-key="${currentKey}"]`)?.focus();
  }
}

function initializePatternNavigation(context) {
  const { root, records, state, expandedFamilies } = context;
  const selectPattern = (record, options = {}) => {
    if (!record) return;
    state.familyId = record.familyId;
    state.patternId = record.patternId;
    state.versionId = record.versionId;
    state.annotationId = record.annotations[0].annotationId;
    state.activeInspectorTab = "token";
    state.hoveredAnnotationId = null;
    state.focusedAnnotationId = null;
    renderPatternSelection(context, options);
  };

  root.querySelector("[data-pi-navigation-tree]").addEventListener("click", (event) => {
    const familyToggle = event.target.closest("[data-pi-family-toggle]");
    if (familyToggle) {
      const familyId = familyToggle.dataset.piFamilyToggle;
      const expanded = expandedFamilies.has(familyId);
      if (expanded) expandedFamilies.delete(familyId);
      else expandedFamilies.add(familyId);
      familyToggle.setAttribute("aria-expanded", String(!expanded));
      familyToggle.querySelector("[data-pi-family-indicator]").textContent = expanded ? "+" : "−";
      root.querySelector(`[data-pi-family-list="${familyId}"]`).hidden = expanded;
      return;
    }
    const patternButton = event.target.closest("[data-pi-pattern-key]");
    if (!patternButton) return;
    selectPattern(records.find((record) => patternKey(record) === patternButton.dataset.piPatternKey), { focusNavigation: true });
  });

  const selectAdjacent = (offset) => {
    const currentIndex = records.findIndex((record) => patternKey(record) === patternKey(context.currentPattern()));
    selectPattern(records[currentIndex + offset]);
  };
  root.querySelector("[data-pi-pattern-previous]").addEventListener("click", () => selectAdjacent(-1));
  root.querySelector("[data-pi-pattern-next]").addEventListener("click", () => selectAdjacent(1));
}

function initializeAnnotationSynchronization(context) {
  const { root, state, currentPattern } = context;
  const annotationControl = (target) => target.closest("[data-pi-select-annotation]");
  const validAnnotationId = (id) => currentPattern().annotations.some((annotation) => annotation.annotationId === id);

  root.addEventListener("click", (event) => {
    const control = annotationControl(event.target);
    if (!control || !validAnnotationId(control.dataset.piSelectAnnotation)) return;
    state.annotationId = control.dataset.piSelectAnnotation;
    renderInspectorDetail(context);
    renderInteractionState(context);
  });

  root.addEventListener("pointerover", (event) => {
    const control = annotationControl(event.target);
    if (!control) return;
    state.hoveredAnnotationId = control.dataset.piSelectAnnotation;
    renderInteractionState(context);
  });
  root.addEventListener("pointerout", (event) => {
    const control = annotationControl(event.target);
    if (!control || control.contains(event.relatedTarget)) return;
    if (state.hoveredAnnotationId === control.dataset.piSelectAnnotation) state.hoveredAnnotationId = null;
    renderInteractionState(context);
  });
  root.addEventListener("focusin", (event) => {
    const control = annotationControl(event.target);
    if (!control) return;
    state.focusedAnnotationId = control.dataset.piSelectAnnotation;
    renderInteractionState(context);
  });
  root.addEventListener("focusout", (event) => {
    const control = annotationControl(event.target);
    if (!control || control.contains(event.relatedTarget)) return;
    if (state.focusedAnnotationId === control.dataset.piSelectAnnotation) state.focusedAnnotationId = null;
    renderInteractionState(context);
  });
  root.addEventListener("submit", (event) => event.preventDefault());
}

export function initializeWorkspace(root, options = {}) {
  if (!root || !root.matches("[data-pattern-inspector-v4]")) return null;
  if (root.dataset.piInitialized === "true") return root;

  const records = validatePatternRecords(options.records || patternInspectorRecords);
  const initialPattern = findPattern(records, options.patternIdentity || defaultPatternIdentity);
  const instanceId = createInstanceId(options.instanceId);
  const idMap = instantiateRelationships(root, instanceId);
  const mediaQuery = root.ownerDocument.defaultView.matchMedia(RESPONSIVE_MEDIA_QUERY);
  const state = createWorkspaceState(initialPattern, mediaQuery.matches);
  const context = {
    document: root.ownerDocument,
    root,
    records,
    state,
    instanceId,
    idFor: (localId) => idMap.get(localId) || `${instanceId}-${localId}`,
    patternKey,
    expandedFamilies: new Set(records.map((record) => record.familyId)),
    currentPattern: () => findPattern(records, state),
    currentAnnotation: () => findPattern(records, state).annotations.find((annotation) => annotation.annotationId === state.annotationId),
  };

  renderWorkspace(context);
  initializeInspectorTabs(context);
  initializePatternNavigation(context);
  initializeAnnotationSynchronization(context);
  const workspaceController = initializePanelControls(root, state, mediaQuery);

  root.dataset.piInitialized = "true";
  root.patternInspectorV4 = Object.freeze({ instanceId, state, workspaceController });
  return root;
}

export async function mountPatternInspectorV4(options = {}) {
  const slot = options.slot;
  if (!slot || typeof slot.replaceChildren !== "function") return null;
  const templateUrl = new URL(options.templateUrl || "./pattern-inspector.html", import.meta.url);
  let fallback;
  try {
    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error(`Template request failed with ${response.status}`);
    const template = document.createElement("template");
    template.innerHTML = (await response.text()).trim();
    if (template.content.querySelectorAll("[data-pattern-inspector-v4]").length !== 1) {
      throw new Error("Template must contain exactly one Pattern Inspector V4 root");
    }
    fallback = document.createDocumentFragment();
    fallback.append(...slot.childNodes);
    slot.replaceChildren(template.content.cloneNode(true));
    return initializeWorkspace(slot.querySelector("[data-pattern-inspector-v4]"), options);
  } catch (error) {
    if (fallback) slot.replaceChildren(fallback);
    slot.dataset.moduleError = "pattern-inspector-v4";
    console.warn("Pattern Inspector Version 4 was not mounted.", error);
    return null;
  }
}

export { validatePatternRecords };
