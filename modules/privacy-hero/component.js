(function () {
  function revealDiagram(diagram) {
    diagram.classList.remove("is-animating");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        diagram.classList.add("is-animating");
      });
    });
  }

  function initPrivacyHero(root) {
    var scope = root || document;
    var diagrams = scope.querySelectorAll("[data-privacy-hero]");

    document.documentElement.classList.add("js");

    if (!diagrams.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      diagrams.forEach(function (diagram) {
        diagram.classList.add("is-animating");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealDiagram(entry.target);
          } else {
            entry.target.classList.remove("is-animating");
          }
        });
      },
      {
        rootMargin: "-12% 0px -12% 0px",
        threshold: 0.35,
      }
    );

    diagrams.forEach(function (diagram) {
      observer.observe(diagram);
    });
  }

  window.PrivacyHeroDiagramV1 = {
    init: initPrivacyHero,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initPrivacyHero(document);
    });
  } else {
    initPrivacyHero(document);
  }
})();
