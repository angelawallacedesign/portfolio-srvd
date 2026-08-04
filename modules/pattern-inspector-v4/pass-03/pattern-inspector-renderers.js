const CATEGORY_LABELS = Object.freeze({
  token: "Token",
  state: "State",
  accessibility: "Accessibility",
  className: "Class",
});

function element(document, tagName, { className, text, attributes = {} } = {}) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;

  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== null && value !== undefined) node.setAttribute(name, String(value));
  });

  return node;
}

function annotationTarget(document, targetKey, className = "") {
  return element(document, "div", {
    className: `pi-v4-annotation-target ${className}`.trim(),
    attributes: { "data-pi-target-key": targetKey },
  });
}

function renderCtaBanner(context, pattern) {
  const { document, idFor } = context;
  const props = pattern.component.props;
  const article = element(document, "article", {
    className: "pi-v4-component pi-v4-cta-banner pi-v4-annotation-target",
    attributes: {
      id: idFor("component"),
      "data-pi-rendered-component": "",
      "data-pi-target-key": "background",
      "data-family-id": pattern.familyId,
      "data-pattern-id": pattern.patternId,
      "data-version-id": pattern.versionId,
      "aria-labelledby": idFor("component-title"),
    },
  });

  const eyebrowTarget = annotationTarget(document, "eyebrow");
  eyebrowTarget.append(element(document, "p", { className: "pi-v4-cta-banner__eyebrow", text: props.eyebrow }));

  const headlineTarget = annotationTarget(document, "headline", "pi-v4-annotation-target--wide");
  const heading = element(document, "h2", {
    className: "pi-v4-cta-banner__title",
    attributes: { id: idFor("component-title") },
  });
  props.headlineLines.forEach((line, index) => {
    if (index) heading.append(document.createElement("br"));
    heading.append(document.createTextNode(line));
  });
  headlineTarget.append(heading);

  const descriptionTarget = annotationTarget(document, "description");
  descriptionTarget.append(element(document, "p", { className: "pi-v4-cta-banner__description", text: props.description }));

  const actions = element(document, "div", { className: "pi-v4-cta-banner__actions" });
  const buttonTarget = annotationTarget(document, "button", "pi-v4-cta-banner__action-target");
  buttonTarget.append(element(document, "button", { className: "pi-v4-cta-banner__button", text: props.primaryAction, attributes: { type: "button" } }));
  const linkTarget = annotationTarget(document, "link", "pi-v4-cta-banner__action-target");
  linkTarget.append(element(document, "a", { className: "pi-v4-cta-banner__link pi-v4-text-link", text: props.secondaryAction, attributes: { href: `#${idFor("component-title")}` } }));
  actions.append(buttonTarget, linkTarget);

  article.append(eyebrowTarget, headlineTarget, descriptionTarget, actions);
  return article;
}

function renderStatusCard(context, pattern) {
  const { document, idFor } = context;
  const props = pattern.component.props;
  const article = element(document, "article", {
    className: "pi-v4-component pi-v4-status-card",
    attributes: {
      id: idFor("component"),
      "data-pi-rendered-component": "",
      "data-family-id": pattern.familyId,
      "data-pattern-id": pattern.patternId,
      "data-version-id": pattern.versionId,
      "aria-labelledby": idFor("component-title"),
    },
  });
  const status = annotationTarget(document, "status");
  status.append(element(document, "p", { className: "pi-v4-status-card__eyebrow", text: props.eyebrow }));
  const title = annotationTarget(document, "title");
  title.append(element(document, "h2", { className: "pi-v4-status-card__title", text: props.title, attributes: { id: idFor("component-title") } }));
  const metadata = annotationTarget(document, "metadata");
  metadata.append(element(document, "p", { className: "pi-v4-status-card__meta", text: props.metadata }));
  const action = annotationTarget(document, "action");
  action.append(element(document, "button", { className: "pi-v4-status-card__button", text: props.action, attributes: { type: "button" } }));
  article.append(status, title, metadata, action);
  return article;
}

function renderButtonGroup(context, pattern) {
  const { document, idFor } = context;
  const props = pattern.component.props;
  const article = element(document, "article", {
    className: "pi-v4-component pi-v4-button-group",
    attributes: {
      id: idFor("component"),
      "data-pi-rendered-component": "",
      "data-family-id": pattern.familyId,
      "data-pattern-id": pattern.patternId,
      "data-version-id": pattern.versionId,
      "aria-label": pattern.name,
    },
  });
  const actions = element(document, "div", { className: "pi-v4-button-group__actions" });
  const primary = annotationTarget(document, "primary");
  primary.append(element(document, "button", { className: "pi-v4-pattern-button pi-v4-pattern-button--primary", text: props.primaryAction, attributes: { type: "button" } }));
  const secondary = annotationTarget(document, "secondary");
  secondary.append(element(document, "button", { className: "pi-v4-pattern-button pi-v4-pattern-button--quiet", text: props.secondaryAction, attributes: { type: "button" } }));
  actions.append(primary, secondary);
  const copy = annotationTarget(document, "copy");
  copy.append(element(document, "p", { className: "pi-v4-button-group__copy", text: props.copy }));
  article.append(actions, copy);
  return article;
}

function renderFormStates(context, pattern) {
  const { document, idFor } = context;
  const form = element(document, "form", {
    className: "pi-v4-component pi-v4-form-states",
    attributes: {
      id: idFor("component"),
      "data-pi-rendered-component": "",
      "data-family-id": pattern.familyId,
      "data-pattern-id": pattern.patternId,
      "data-version-id": pattern.versionId,
      "aria-label": pattern.name,
    },
  });

  pattern.component.props.fields.forEach((field) => {
    const target = annotationTarget(document, field.key);
    const label = element(document, "label", { className: `pi-v4-form-field pi-v4-form-field--${field.state}` });
    const inputId = idFor(`field-${field.key}`);
    label.append(element(document, "span", { text: field.label }));
    const input = element(document, "input", {
      attributes: { id: inputId, type: "text", placeholder: field.placeholder },
    });
    input.value = field.value;
    if (field.state === "error") input.setAttribute("aria-invalid", "true");
    if (field.state === "inactive") input.disabled = true;
    label.append(input);
    target.append(label);
    form.append(target);
  });
  return form;
}

const COMPONENT_RENDERERS = Object.freeze({
  ctaBanner: renderCtaBanner,
  statusCard: renderStatusCard,
  buttonGroup: renderButtonGroup,
  formStates: renderFormStates,
});

export const supportedRendererNames = Object.freeze(Object.keys(COMPONENT_RENDERERS));

export function renderNavigation(context) {
  const { document, records, root, state, idFor, patternKey, expandedFamilies } = context;
  const container = root.querySelector("[data-pi-navigation-tree]");
  const families = new Map();

  records.forEach((record) => {
    if (!families.has(record.familyId)) families.set(record.familyId, { name: record.familyName, patterns: [] });
    families.get(record.familyId).patterns.push(record);
  });

  const fragment = document.createDocumentFragment();
  families.forEach((family, familyId) => {
    const familySection = element(document, "section", { className: "pi-v4-family" });
    const listId = idFor(`family-${familyId}`);
    const expanded = expandedFamilies.has(familyId);
    const toggle = element(document, "button", {
      className: "pi-v4-family-toggle",
      attributes: { type: "button", "aria-expanded": expanded, "aria-controls": listId, "data-pi-family-toggle": familyId },
    });
    toggle.append(
      element(document, "span", { text: family.name }),
      element(document, "span", { text: expanded ? "−" : "+", attributes: { "aria-hidden": "true", "data-pi-family-indicator": "" } }),
    );
    const list = element(document, "ul", { className: "pi-v4-pattern-list", attributes: { id: listId, "data-pi-family-list": familyId } });
    list.hidden = !expanded;

    family.patterns.forEach((pattern) => {
      const current = pattern.patternId === state.patternId && pattern.versionId === state.versionId && pattern.familyId === state.familyId;
      const item = document.createElement("li");
      const button = element(document, "button", {
        className: `pi-v4-pattern-link${current ? " is-active" : ""}`,
        attributes: { type: "button", "data-pi-pattern-key": patternKey(pattern), "aria-current": current ? "page" : null },
      });
      button.append(
        element(document, "span", { text: pattern.name }),
        element(document, "span", { className: "pi-v4-pattern-link__version", text: pattern.versionId.toUpperCase() }),
      );
      item.append(button);
      list.append(item);
    });
    familySection.append(toggle, list);
    fragment.append(familySection);
  });

  container.replaceChildren(fragment);
}

export function renderViewer(context) {
  const { root, currentPattern } = context;
  const pattern = currentPattern();
  root.querySelector("[data-pi-pattern-name]").textContent = pattern.name;
  root.querySelector("[data-pi-pattern-description]").textContent = pattern.description;
  root.querySelector("[data-pi-family-id]").textContent = pattern.familyName;
  root.querySelector("[data-pi-version-id]").textContent = pattern.versionId;
  root.querySelector("[data-pi-pattern-status]").textContent = pattern.status;
  root.querySelector("[data-pi-review-state]").textContent = pattern.reviewState;
}

export function renderPattern(context) {
  const { root, currentPattern } = context;
  const pattern = currentPattern();
  const renderer = COMPONENT_RENDERERS[pattern.component.renderer];
  const component = renderer(context, pattern);
  root.querySelector("[data-pi-pattern-stage]").replaceChildren(component);
  renderAnnotations(context);
  renderPatternNavigation(context);
}

export function renderAnnotations(context) {
  const { document, root, currentPattern, idFor } = context;
  const pattern = currentPattern();
  pattern.annotations.forEach((annotation) => {
    const target = root.querySelector(`[data-pi-target-key="${annotation.targetKey}"]`);
    if (!target) return;
    const marker = element(document, "button", {
      className: "pi-v4-annotation",
      text: annotation.displayLabel,
      attributes: {
        id: idFor(`annotation-${pattern.patternId}-${annotation.annotationId}-marker`),
        type: "button",
        "aria-label": `Inspect ${annotation.title.toLowerCase()}`,
        "aria-pressed": "false",
        "aria-controls": idFor("inspector-detail"),
        "data-pi-select-annotation": annotation.annotationId,
        "data-pi-annotation-marker": annotation.annotationId,
        "data-pi-anchor": annotation.anchor,
      },
    });
    target.append(marker);
  });
}

export function renderInspector(context) {
  const { document, root, currentPattern, idFor } = context;
  const pattern = currentPattern();
  const list = root.querySelector("[data-pi-inspector-parts]");
  list.setAttribute("aria-label", `${pattern.name} annotations`);
  const fragment = document.createDocumentFragment();

  pattern.annotations.forEach((annotation) => {
    const item = document.createElement("li");
    const button = element(document, "button", {
      className: "pi-v4-part",
      attributes: {
        id: idFor(`annotation-${pattern.patternId}-${annotation.annotationId}-row`),
        type: "button",
        "aria-controls": idFor("inspector-detail"),
        "aria-pressed": "false",
        "data-pi-select-annotation": annotation.annotationId,
        "data-pi-inspector-row": annotation.annotationId,
      },
    });
    button.append(
      element(document, "span", { className: "pi-v4-marker", text: annotation.displayLabel, attributes: { "aria-hidden": "true" } }),
      element(document, "span", { text: annotation.title }),
    );
    item.append(button);
    fragment.append(item);
  });
  list.replaceChildren(fragment);
  renderInspectorDetail(context);
}

export function renderInspectorDetail(context) {
  const { root, state, currentAnnotation } = context;
  const annotation = currentAnnotation();
  const value = annotation?.[state.activeInspectorTab] || "Not documented";
  root.querySelector("[data-pi-detail-label]").textContent = CATEGORY_LABELS[state.activeInspectorTab];
  root.querySelector("[data-pi-detail-title]").textContent = annotation?.title || "No annotation selected";
  root.querySelector("[data-pi-detail-value]").textContent = value;
  root.querySelector("[data-pi-detail-description]").textContent = annotation?.description || "";
}

export function renderInspectorTabs(context) {
  const { root, state } = context;
  const tabs = root.querySelectorAll("[data-pi-tab]");
  const tabPanel = root.querySelector("[data-pi-tabpanel]");
  tabs.forEach((tab) => {
    const active = tab.dataset.piTab === state.activeInspectorTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active) tabPanel.setAttribute("aria-labelledby", tab.id);
  });
}

export function renderPatternNavigation(context) {
  const { root, records, state } = context;
  const index = records.findIndex((record) => record.familyId === state.familyId && record.patternId === state.patternId && record.versionId === state.versionId);
  root.querySelector("[data-pi-pattern-position]").textContent = `Pattern ${index + 1} of ${records.length}`;
  root.querySelector("[data-pi-pattern-previous]").disabled = index <= 0;
  root.querySelector("[data-pi-pattern-next]").disabled = index >= records.length - 1;
}

export function renderInteractionState(context) {
  const { root, state, currentPattern } = context;
  const update = (selector, idAttribute) => {
    root.querySelectorAll(selector).forEach((node) => {
      const annotationId = node.dataset[idAttribute];
      const selected = annotationId === state.annotationId;
      const hovered = annotationId === state.hoveredAnnotationId;
      const focused = annotationId === state.focusedAnnotationId;
      node.classList.toggle("is-selected", selected);
      node.classList.toggle("is-hovered", hovered);
      node.classList.toggle("is-focused", focused);
      if (node.matches("button")) node.setAttribute("aria-pressed", String(selected));
    });
  };
  update("[data-pi-annotation-marker]", "piAnnotationMarker");
  update("[data-pi-inspector-row]", "piInspectorRow");
  const annotationByTarget = new Map(currentPattern().annotations.map((annotation) => [annotation.targetKey, annotation.annotationId]));
  root.querySelectorAll("[data-pi-target-key]").forEach((node) => {
    const annotationId = annotationByTarget.get(node.dataset.piTargetKey);
    node.classList.toggle("is-selected", annotationId === state.annotationId);
    node.classList.toggle("is-hovered", annotationId === state.hoveredAnnotationId);
    node.classList.toggle("is-focused", annotationId === state.focusedAnnotationId);
  });
}

export function renderWorkspace(context) {
  renderNavigation(context);
  renderViewer(context);
  renderPattern(context);
  renderInspectorTabs(context);
  renderInspector(context);
  renderInteractionState(context);
}
