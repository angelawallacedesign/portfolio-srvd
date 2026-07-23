(function () {
  var columnMessages = {
    app: "App name maps to the semantic identity column: the reusable row pattern must support recognizable third-party app names before any action is considered.",
    timestamp:
      "Last update maps to implementation timing: asynchronous data delays need visible timestamps so stale or delayed status is not mistaken for a UI defect.",
    status:
      "Status maps to the badge/state class: stopped, active, expired, and inactive labels must remain readable without relying on color alone.",
    action:
      "Action maps to permissible controls: links only appear when the system can support the member's next step within compliance rules.",
  };

  function revealTable(tableComponent) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        tableComponent.classList.add("is-visible");
      });
    });
  }

  function initStateTables(root) {
    var scope = root || document;
    var components = scope.querySelectorAll("[data-state-table]");

    document.documentElement.classList.add("js");

    components.forEach(function (component) {
      var table = component.querySelector("[data-column-inspection-table]");
      var caption = component.querySelector("[data-column-inspection-caption]");

      if (!table || !caption) {
        return;
      }

      var defaultCaption = table.dataset.defaultCaption || caption.textContent || "";
      var headers = table.querySelectorAll("th[data-column-key]");
      var cells = table.querySelectorAll("th[data-column-key], td");

      var setColumn = function (key) {
        if (!key) {
          table.removeAttribute("data-active-column");
          caption.textContent = defaultCaption;
          return;
        }

        table.dataset.activeColumn = key;
        caption.textContent = columnMessages[key] || defaultCaption;
      };

      headers.forEach(function (header) {
        header.addEventListener("mouseenter", function () {
          setColumn(header.dataset.columnKey);
        });
        header.addEventListener("focus", function () {
          setColumn(header.dataset.columnKey);
        });
        header.addEventListener("click", function () {
          setColumn(header.dataset.columnKey);
        });
      });

      cells.forEach(function (cell) {
        cell.addEventListener("mouseenter", function () {
          var header = headers[cell.cellIndex];
          setColumn(header && header.dataset.columnKey);
        });
        cell.addEventListener("click", function () {
          var header = headers[cell.cellIndex];
          setColumn(header && header.dataset.columnKey);
        });
      });

      table.addEventListener("mouseleave", function () {
        setColumn();
      });
      table.addEventListener("focusout", function (event) {
        if (!table.contains(event.relatedTarget)) {
          setColumn();
        }
      });

      if (!("IntersectionObserver" in window)) {
        component.classList.add("is-visible");
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            revealTable(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.08,
        }
      );

      observer.observe(component);
    });
  }

  window.StateInspectionTableV1 = {
    init: initStateTables,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initStateTables(document);
    });
  } else {
    initStateTables(document);
  }
})();
