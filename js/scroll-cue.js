(() => {
  const cue = document.querySelector("[data-scroll-cue]");

  if (!cue) {
    return;
  }

  const link = cue.querySelector("a");
  const targetId = cue.dataset.scrollCueTarget || "gap";
  const target = document.getElementById(targetId);

  if (!link || !target) {
    return;
  }

  const TIMING = {
    initialDelayMs: 2000,
    fadeMs: 600,
    promptDurationMs: 300,
    promptIterations: 2,
    repeatDelayMs: 6000,
    maxSequences: 3,
    scrollTolerancePx: 2
  };

  const MOTION = {
    travelPx: 8,
    easing: "cubic-bezier(0.33, 0, 0.2, 1)"
  };

  const state = {
    hidden: false,
    completed: false,
    sequenceCount: 0,
    timers: new Set()
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function configureCue() {
    cue.style.setProperty("--scroll-cue-fade-duration", `${TIMING.fadeMs}ms`);
    cue.style.setProperty(
      "--scroll-cue-prompt-duration",
      `${TIMING.promptDurationMs}ms`
    );
    cue.style.setProperty(
      "--scroll-cue-prompt-iterations",
      TIMING.promptIterations
    );
    cue.style.setProperty("--scroll-cue-travel", `${MOTION.travelPx}px`);
    cue.style.setProperty("--scroll-cue-easing", MOTION.easing);
  }

  function setTimer(callback, delayMs) {
    const timer = window.setTimeout(() => {
      state.timers.delete(timer);
      callback();
    }, delayMs);

    state.timers.add(timer);
    return timer;
  }

  function clearTimers() {
    state.timers.forEach((timer) => {
      window.clearTimeout(timer);
    });

    state.timers.clear();
  }

  function enableFadeTransitions() {
    window.requestAnimationFrame(() => {
      cue.classList.add("is-ready");
    });
  }

  function getScrollHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  function getScrollTop() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function canScrollDown() {
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return (
      getScrollTop() + viewportHeight <
      getScrollHeight() - TIMING.scrollTolerancePx
    );
  }

  function setCueAccessibility(isVisible) {
    cue.setAttribute("aria-hidden", String(!isVisible));

    if (isVisible) {
      link.removeAttribute("tabindex");
      return;
    }

    link.setAttribute("tabindex", "-1");
  }

  function showCue() {
    cue.classList.add("is-visible");
    setCueAccessibility(true);
  }

  function hideCue() {
    cue.classList.remove("is-visible");
    setCueAccessibility(false);
  }

  function removeScrollListeners() {
    window.removeEventListener("scroll", handleScrollActivity);
    window.removeEventListener("resize", handleResizeActivity);
    link.removeEventListener("click", handleCueClick);
  }

  function hidePermanently() {
    if (state.hidden) {
      return;
    }

    state.hidden = true;
    clearTimers();
    cue.classList.remove("is-prompting");
    hideCue();
    removeScrollListeners();
  }

  function hideIfCannotScrollDown() {
    if (canScrollDown()) {
      return false;
    }

    hidePermanently();
    return true;
  }

  function scrollToTarget() {
    target.scrollIntoView({ block: "start" });
  }

  function handleCueClick(event) {
    event.preventDefault();
    scrollToTarget();
  }

  function handleScrollActivity() {
    hideIfCannotScrollDown();
  }

  function handleResizeActivity() {
    hideIfCannotScrollDown();
  }

  function runSequence() {
    if (state.hidden || state.completed || hideIfCannotScrollDown()) {
      return;
    }

    state.sequenceCount += 1;
    cue.classList.add("is-prompting");

    setTimer(() => {
      if (state.hidden) {
        return;
      }

      cue.classList.remove("is-prompting");

      if (state.sequenceCount >= TIMING.maxSequences) {
        state.completed = true;
        return;
      }

      setTimer(runSequence, TIMING.repeatDelayMs);
    }, TIMING.promptDurationMs * TIMING.promptIterations);
  }

  function bindScrollListeners() {
    window.addEventListener("scroll", handleScrollActivity, { passive: true });
    window.addEventListener("resize", handleResizeActivity, { passive: true });
    link.addEventListener("click", handleCueClick);
  }

  function startCue() {
    if (state.hidden || hideIfCannotScrollDown()) {
      return;
    }

    showCue();
    enableFadeTransitions();

    if (reducedMotion.matches) {
      return;
    }

    setTimer(runSequence, TIMING.initialDelayMs);
  }

  function initializeCue() {
    configureCue();
    hideCue();
    bindScrollListeners();

    if (document.readyState === "complete") {
      startCue();
      return;
    }

    window.addEventListener("load", startCue, { once: true });
  }

  initializeCue();
})();
