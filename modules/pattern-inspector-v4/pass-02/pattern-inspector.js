import { defaultPatternIdentity, patternInspectorRecords } from "./pattern-inspector-data.js";

const CATEGORY_LABELS = Object.freeze({
  token: "Token",
  state: "State",
  a11y: "Accessibility",
  className: "Class",
});

const RESPONSIVE_MEDIA_QUERY = "(max-width: 68rem)";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function createInstanceId(requestedId) {
  if (requestedId) {
    return String(requestedId).replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  if (globalThis.crypto?.randomUUID) {
    return `pi-v4-${globalThis.crypto.randomUUID()}`;
  }

  return `pi-v4-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function findPattern(identity, records) {
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
    annotationId: pattern.annotations[0]?.annotationId || null,
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
  root.querySelectorAll("[data-pi-id]").forEach((element) => {
    const localId = element.dataset.piId;
    const id = `${instanceId}-${localId}`;
    idMap.set(localId, id);
    element.id = id;
  });

  root.querySelectorAll("[data-pi-controls]").forEach((element) => {
    element.setAttribute("aria-controls", idMap.get(element.dataset.piControls));
  });

  const component = root.querySelector("[data-pi-rendered-component]");
  const navigation = root.querySelector("[data-pi-left-panel]");
  const inspector = root.querySelector("[data-pi-right-panel]");
  const tabPanel = root.querySelector("[data-pi-tabpanel]");
  const demoLink = root.querySelector("[data-pi-demo-link]");
  component?.setAttribute("aria-labelledby", idMap.get("component-title"));
  navigation?.setAttribute("aria-labelledby", idMap.get("navigation-title"));
  inspector?.setAttribute("aria-labelledby", idMap.get("inspector-title"));
  tabPanel?.setAttribute("aria-labelledby", idMap.get("tab-token"));
  demoLink?.setAttribute("href", `#${idMap.get("component-title")}`);
}

function renderViewerShell(root, pattern) {
  root.querySelector("[data-pi-pattern-name]").textContent = pattern.name;
  root.querySelector("[data-pi-family-id]").textContent = pattern.familyId;
  root.querySelector("[data-pi-version-id]").textContent = pattern.versionId;
}

function initializeInspectorTabs(root, pattern, state) {
  const tabs = Array.from(root.querySelectorAll("[data-pi-tab]"));
  const tabPanel = root.querySelector("[data-pi-tabpanel]");
  const detailLabel = root.querySelector("[data-pi-detail-label]");
  const detailValue = root.querySelector("[data-pi-detail-value]");

  function selectTab(tab, moveFocus = false) {
    const annotation = pattern.annotations.find((item) => item.annotationId === state.annotationId);
    state.activeInspectorTab = tab.dataset.piTab;

    tabs.forEach((candidate) => {
      const isActive = candidate === tab;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-selected", String(isActive));
      candidate.tabIndex = isActive ? 0 : -1;
    });

    tabPanel.setAttribute("aria-labelledby", tab.id);
    detailLabel.textContent = CATEGORY_LABELS[state.activeInspectorTab];
    detailValue.textContent = annotation?.details[state.activeInspectorTab] || "Not yet documented";

    if (moveFocus) tab.focus();
  }

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

function initializeNavigation(root) {
  const toggle = root.querySelector("[data-pi-family-toggle]");
  const list = root.querySelector("[data-pi-family-list]");
  const indicator = root.querySelector("[data-pi-family-indicator]");

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    list.hidden = expanded;
    indicator.textContent = expanded ? "+" : "−";
  });
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

  function panelIsOpen(side) {
    return side === "left" ? state.leftPanelOpen : state.rightPanelOpen;
  }

  function setPanelOpen(side, open) {
    if (side === "left") state.leftPanelOpen = open;
    else state.rightPanelOpen = open;
  }

  function focusableElements(panel) {
    return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) =>
      !element.disabled && !element.closest("[hidden]")
    );
  }

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

  Object.entries(controls).forEach(([side, control]) => {
    control.addEventListener("click", () => togglePanel(side));
  });

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

  function handleBreakpointChange(event) {
    const hadOpenDrawer = Boolean(state.activeResponsiveDrawer);
    state.isResponsive = event.matches;

    if (hadOpenDrawer) closeDrawer({ restoreFocus: true });
    else {
      state.activeResponsiveDrawer = null;
      renderWorkspaceState();
    }
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleBreakpointChange);
  } else {
    mediaQuery.addListener(handleBreakpointChange);
  }

  renderWorkspaceState();

  return Object.freeze({
    closeDrawer,
    render: renderWorkspaceState,
    togglePanel,
  });
}

function initializeAnnotationSynchronization(root) {
  // Pass 3 replaces this explicit boundary with instance-safe synchronization.
  return root.querySelectorAll("[data-pi-annotation-id]");
}

function initializeWorkspace(root, options = {}) {
  if (root.dataset.piInitialized === "true") return root;

  const records = options.records || patternInspectorRecords;
  const pattern = findPattern(options.patternIdentity || defaultPatternIdentity, records);
  const instanceId = createInstanceId(options.instanceId);
  const mediaQuery = root.ownerDocument.defaultView.matchMedia(RESPONSIVE_MEDIA_QUERY);
  const state = createWorkspaceState(pattern, mediaQuery.matches);

  instantiateRelationships(root, instanceId);
  renderViewerShell(root, pattern);
  initializeNavigation(root);
  initializeInspectorTabs(root, pattern, state);
  initializeAnnotationSynchronization(root);
  const workspaceController = initializePanelControls(root, state, mediaQuery);

  root.dataset.piInitialized = "true";
  root.patternInspectorV4 = { instanceId, state, workspaceController };
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
    const roots = template.content.querySelectorAll("[data-pattern-inspector-v4]");
    if (roots.length !== 1) throw new Error("Template must contain exactly one Pattern Inspector V4 root");

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

export { initializeWorkspace };
