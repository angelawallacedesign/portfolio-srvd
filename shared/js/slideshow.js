const DEFAULT_ROOT_SELECTOR = '.slideshow--controlled, .slide-show, [data-slideshow]';
const DEFAULT_TRACK_SELECTOR = '.slideshow__track, .slide-show__track, .slideshow-track';
const DEFAULT_PREVIOUS_SELECTOR = '[data-slideshow-prev], [data-prev]';
const DEFAULT_NEXT_SELECTOR = '[data-slideshow-next], [data-next]';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const instances = new WeakMap();

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return value === true || value === 'true';
}

function toInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSlideOffset(track, slide) {
  return slide.offsetLeft - track.offsetLeft;
}

function shouldIgnoreKeyboardEvent(event) {
  const target = event.target;
  if (!target || !target.tagName) return false;

  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
}

export class Slideshow {
  constructor(root, options = {}) {
    this.root = root;
    this.options = options;
    this.trackSelector = options.trackSelector || DEFAULT_TRACK_SELECTOR;
    this.previousSelector = options.previousSelector || DEFAULT_PREVIOUS_SELECTOR;
    this.nextSelector = options.nextSelector || DEFAULT_NEXT_SELECTOR;
    this.track = root.querySelector(this.trackSelector);
    this.previousControl = root.querySelector(this.previousSelector);
    this.nextControl = root.querySelector(this.nextSelector);
    this.loop = options.loop ?? toBoolean(root.dataset.slideshowLoop, false);
    this.currentIndex = 0;
    this.resizeObserver = null;

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  get slides() {
    return this.track ? [...this.track.children] : [];
  }

  get maxIndex() {
    return Math.max(this.slides.length - 1, 0);
  }

  init() {
    if (!this.track || this.slides.length === 0) return this;

    const startIndex = this.options.startIndex ?? this.root.dataset.slideshowStart;
    this.currentIndex = clamp(toInteger(startIndex, 0), 0, this.maxIndex);

    this.root.dataset.slideshowEnhanced = 'true';
    this.root.classList.add('is-enhanced');
    this.root.setAttribute('role', this.root.getAttribute('role') || 'region');
    this.root.setAttribute('aria-roledescription', 'carousel');

    this.configureControls();
    this.root.addEventListener('click', this.handleClick);
    this.root.addEventListener('keydown', this.handleKeydown);

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.root);
      this.slides.forEach((slide) => this.resizeObserver.observe(slide));
    } else {
      window.addEventListener('resize', this.handleResize);
    }

    this.goTo(this.currentIndex, { force: true });
    return this;
  }

  configureControls() {
    [
      [this.previousControl, 'Previous slide'],
      [this.nextControl, 'Next slide']
    ].forEach(([control, label]) => {
      if (!control) return;
      if (control.tagName === 'BUTTON' && !control.getAttribute('type')) {
        control.setAttribute('type', 'button');
      }
      if (!control.getAttribute('aria-label')) {
        control.setAttribute('aria-label', label);
      }
    });
  }

  normalizeIndex(index) {
    if (this.loop && this.slides.length > 0) {
      return (index + this.slides.length) % this.slides.length;
    }

    return clamp(index, 0, this.maxIndex);
  }

  goTo(index, { force = false } = {}) {
    if (!this.track || this.slides.length === 0) return;

    const nextIndex = this.normalizeIndex(index);
    if (!force && nextIndex === this.currentIndex) {
      this.update();
      return;
    }

    this.currentIndex = nextIndex;
    this.update();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  previous() {
    this.goTo(this.currentIndex - 1);
  }

  update() {
    const slides = this.slides;
    const activeSlide = slides[this.currentIndex];
    if (!activeSlide) return;

    this.track.style.transform = `translate3d(-${getSlideOffset(this.track, activeSlide)}px, 0, 0)`;

    slides.forEach((slide, index) => {
      const isActive = index === this.currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));

      slide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((focusable) => {
        focusable.tabIndex = isActive ? 0 : -1;
      });
    });

    this.updateControlState();
  }

  updateControlState() {
    if (this.loop) {
      this.previousControl?.setAttribute('aria-disabled', 'false');
      this.nextControl?.setAttribute('aria-disabled', 'false');
      return;
    }

    this.previousControl?.setAttribute('aria-disabled', String(this.currentIndex === 0));
    this.nextControl?.setAttribute('aria-disabled', String(this.currentIndex === this.maxIndex));
  }

  handleClick(event) {
    const target = event.target.closest ? event.target : event.target.parentElement;
    const previous = target?.closest(this.previousSelector);
    const next = target?.closest(this.nextSelector);

    if (previous && this.root.contains(previous)) {
      event.preventDefault();
      this.previous();
    }

    if (next && this.root.contains(next)) {
      event.preventDefault();
      this.next();
    }
  }

  handleKeydown(event) {
    if (shouldIgnoreKeyboardEvent(event)) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }
  }

  handleResize() {
    this.update();
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
    this.root.removeEventListener('keydown', this.handleKeydown);
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleResize);
    if (this.track) {
      this.track.style.transform = '';
    }
    this.root.dataset.slideshowEnhanced = 'false';
    this.root.classList.remove('is-enhanced');
    instances.delete(this.root);
  }
}

export function initSlideshow(root, options = {}) {
  if (!root || typeof root.querySelector !== 'function') return null;

  const existing = instances.get(root);
  if (existing) return existing;

  const instance = new Slideshow(root, options);
  if (!instance.track || instance.slides.length === 0) return null;

  instance.init();
  instances.set(root, instance);
  return instance;
}

export const initSlideShow = initSlideshow;

export function initSlideshows(root = document, options = {}) {
  if (!root || typeof root.querySelectorAll !== 'function') return [];

  return [...root.querySelectorAll(options.selector || DEFAULT_ROOT_SELECTOR)]
    .map((slideshow) => initSlideshow(slideshow, options))
    .filter(Boolean);
}

if (typeof window !== 'undefined') {
  window.Slideshow = window.Slideshow || Slideshow;
  window.initSlideshow = window.initSlideshow || initSlideshow;
  window.initSlideShow = window.initSlideShow || initSlideShow;
  window.initSlideshows = window.initSlideshows || initSlideshows;
}
