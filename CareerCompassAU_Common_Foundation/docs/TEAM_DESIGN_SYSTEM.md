# CareerCompass AU — Shared Design System

This document defines the common visual and structural standards used across CareerCompass AU so that pages created by different team members remain consistent.

## 1. Visual identity

### Colour palette
- Navy 950: `#07182b` — primary dark background and strong headings
- Navy 900: `#0b213b` — navigation, buttons and table headings
- Navy 800: `#12385d` — secondary dark accent
- Teal 700: `#006b72` — primary accent and links
- Teal 600: `#087e86` — interactive accent
- Teal 100: `#d9f3f2` — light accent background
- Gold 500: `#f5b841` — call-to-action and focus accent
- Ink: `#182536` — body text
- Muted: `#5a6878` — secondary text
- Line: `#d9e2ec` — borders
- Surface: `#ffffff` — main background
- Surface 2: `#f5f8fb` — alternate section background

### Typography
Use a simple web-safe stack:
`Arial, Helvetica, sans-serif`

### Shape and spacing
- Small radius: `0.65rem`
- Medium radius: `1rem`
- Large radius: `1.5rem`
- Main content width: `1180px`
- Section spacing should normally use `3rem–4.5rem`
- Use `rem`, `%`, `min()`, `max()`, `clamp()` and CSS Grid/Flexbox instead of fixed layouts where practical.

## 2. Shared page structure

Every page should use the same semantic shell:

1. Skip link
2. `<header>` containing the CareerCompass AU brand and navigation
3. `<main>` used once
4. Page hero or homepage hero
5. Main content organised into `<section>` elements
6. Shared `<footer>`

Each page should contain one primary `<h1>` and logical heading hierarchy below it.

## 3. Shared components

All members should reuse these component patterns where relevant:
- `.container`
- `.section`
- `.section-heading`
- `.button`
- `.button-primary`
- `.button-dark`
- `.feature-card`
- `.info-card`
- `.notice`
- `.table-wrap`
- `.form-field`
- `.page-hero`
- `.page-badge`

Do not create a new colour system or unrelated button/card style for an individual page.

## 4. Responsive approach

CareerCompass AU uses a mobile-first/responsive approach:
- Desktop: multi-column Grid/Flexbox layouts
- Tablet: reduce columns and spacing
- Mobile: single-column content, stacked controls, responsive navigation and horizontally safe tables

All pages must be checked at desktop, tablet and mobile widths.

## 5. Accessibility rules

Common requirements:
- descriptive page titles
- semantic HTML5
- visible keyboard focus
- meaningful link and button text
- form `<label>` elements
- table `<caption>` and `<th scope="col">`
- meaningful `alt` text for informative images
- no colour-only communication
- adequate contrast
- keyboard-operable controls

## 6. Shared interaction principle

JavaScript should remain lightweight. Prefer HTML and CSS when they can solve the task clearly. JavaScript is reserved mainly for:
- loading career data
- search/filter/sort
- comparison
- dynamic summaries
- simple form behaviour

The project does not require a JavaScript framework.
