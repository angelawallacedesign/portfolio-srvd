const projectList = document.getElementById("project-list");
const fadeClasses = ["fade-top", "fade-bottom", "fade-both"];
const scrollTolerance = 2;

if (projectList) {
  function clearFades() {
    projectList.classList.remove(...fadeClasses);
  }

  function updateProjectListFades() {
    const maxScroll = projectList.scrollHeight - projectList.clientHeight;

    if (maxScroll <= scrollTolerance) {
      clearFades();
      return;
    }

    const isAtTop = projectList.scrollTop <= scrollTolerance;
    const isAtBottom =
      projectList.scrollTop >= maxScroll - scrollTolerance;

    if (isAtTop) {
      projectList.classList.remove("fade-top", "fade-both");
      projectList.classList.add("fade-bottom");
    } else if (isAtBottom) {
      projectList.classList.remove("fade-bottom", "fade-both");
      projectList.classList.add("fade-top");
    } else {
      projectList.classList.remove("fade-top", "fade-bottom");
      projectList.classList.add("fade-both");
    }
  }

  projectList.addEventListener("scroll", updateProjectListFades);
  window.addEventListener("resize", updateProjectListFades);
  window.addEventListener("load", updateProjectListFades);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateProjectListFades);
    resizeObserver.observe(projectList);
  }

  if ("MutationObserver" in window) {
    const mutationObserver = new MutationObserver(updateProjectListFades);
    mutationObserver.observe(projectList, {
      childList: true,
      subtree: true,
    });
  }

  updateProjectListFades();
}
