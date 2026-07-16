# Shared Component Architecture

## Purpose

The `/shared` directory contains reusable building blocks that can be used across multiple products. Components in this directory should remain generic, configurable, and independent of any single application.

The goal is to create a consistent design system foundation while allowing each product to define its own visual identity.

---

## Design Principles

### Generalized by Default

Shared components should implement common interaction patterns and foundational visual behavior rather than product-specific styling.

Examples include:

- Design tokens
- Icons
- Utilities
- Modal
- Lightbox
- Slideshow
- Shared interaction patterns

---

### Product Ownership

Individual products own their visual identity.

Product stylesheets may override shared component presentation without modifying the shared component itself.

Common overrides include:

- Colors
- Typography
- Border radius
- Spacing
- Icon size
- Icon stroke width
- Shadows
- Animation timing
- Layout variations

Whenever possible, shared components should expose customization points rather than requiring component duplication.

---

### Shared Components Define Behavior

A shared component should provide the expected behavior and interaction model.

Products determine how that behavior is visually expressed.

Examples:

- A slideshow should manage navigation, transitions, autoplay, accessibility, and state.
- A modal should manage focus, overlays, and keyboard interaction.
- A lightbox should manage media presentation and navigation.

Products may override the appearance while preserving the underlying behavior.

---

### Reuse First

Before promoting a component into `/shared`, ask:

- Can this solve the same problem across multiple products?
- Is the behavior generic?
- Can product-specific differences be handled through styling or configuration?

If the answer is yes, the component belongs in `/shared`.

If the implementation depends heavily on a single product's workflows or business rules, it should remain within that product.

---

### Initialization

Shared components are reusable, but they are **not necessarily globally initialized**.

Each product is responsible for importing and initializing only the components it uses.

Example:

```javascript
import { initSlideshows } from "/shared/js/slideshow.js";

initSlideshows();
```

Global initialization should be reserved only for behavior required across the entire application.

---

## Component Philosophy

The `/shared` directory represents the foundation of the design system.

Products should extend that foundation through configuration, design tokens, CSS custom properties, and product-specific overrides instead of modifying shared components directly.

The objective is to maximize reuse while preserving flexibility for each product.

---

## Guiding Principle

> **Shared components define behavior. Products define appearance.**

This principle helps determine whether a component belongs in `/shared` or within an individual product.

When in doubt:

- Share the interaction.
- Customize the presentation.
- Keep business logic inside the product.