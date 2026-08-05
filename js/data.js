console.log("data.js loaded");

import { closeCaseStudy, openCaseStudy } from "./modal.js";
import { renderProjectCard } from "./components.js";

const PROJECT_QUERY_PARAM = "project";
let projectsCache = [];

function getProjectIdFromUrl() {
  return new URL(window.location.href).searchParams.get(PROJECT_QUERY_PARAM);
}

function updateProjectUrl(id, mode = "push") {
  const url = new URL(window.location.href);

  if (id) {
    url.searchParams.set(PROJECT_QUERY_PARAM, id);
  } else {
    url.searchParams.delete(PROJECT_QUERY_PARAM);
  }

  const state = id ? { layer3Project: id } : null;
  window.history[`${mode}State`](state, "", url);
}

function openProjectById(id) {
  const project = projectsCache.find((candidate) => candidate.id === id);

  if (!project) {
    console.warn("Project not found for id:", id);
    return false;
  }

  openCaseStudy(project);
  return true;
}

function syncCaseStudyToUrl() {
  const id = getProjectIdFromUrl();

  if (id) {
    openProjectById(id);
    return;
  }

  closeCaseStudy({ notify: false });
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-open-case-study]");
  if (!trigger) return;

  if (
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  ) {
    return;
  }

  e.preventDefault();

  const id = trigger.dataset.projectId;
  if (openProjectById(id)) {
    updateProjectUrl(id);
  }
});

document.addEventListener("layer3:closed", (e) => {
  const id = e.detail?.projectId;
  if (getProjectIdFromUrl() !== id) return;

  if (window.history.state?.layer3Project === id) {
    window.history.back();
  } else {
    updateProjectUrl(null, "replace");
  }
});

window.addEventListener("popstate", syncCaseStudyToUrl);

fetch("./js/data.json")
  .then((res) => res.json())
  .then((projects) => {
    projectsCache = projects;

    const listRoot = document.getElementById("project-list");
    listRoot.innerHTML = projects.map(renderProjectCard).join("");

    syncCaseStudyToUrl();
  });
