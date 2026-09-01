# CareerCompass AU — Team Coding Standards

## HTML
- HTML5 doctype on every page.
- `lang="en"` on `<html>`.
- UTF-8 charset.
- viewport meta tag.
- semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- one `<main>` and one main `<h1>` per page.
- lowercase file names and class names.
- descriptive `id` values; IDs must be unique.

## CSS
- Shared styling belongs in the common stylesheet.
- Reuse CSS variables from `:root`.
- Prefer reusable classes over inline styles.
- Use Grid/Flexbox for layout.
- Avoid tables for visual layout.
- Avoid `!important` unless there is a strong documented reason.
- Keep focus states visible.

## JavaScript
- Keep JavaScript simple and readable.
- Use descriptive variable/function names.
- Prefer `textContent` when writing plain text into the page.
- Check that a DOM element exists before using it.
- Keep page-specific behaviour separated where practical.
- Do not add frameworks unless agreed by the team.

## Forms
- Every form control needs an associated label.
- Use suitable HTML5 input types.
- Use `required`, `minlength`, `maxlength`, `min`, `max` or `pattern` where appropriate.
- Do not claim that prototype feedback is stored if no backend is implemented.

## Tables
- Tables are for tabular data only.
- Include `<caption>`, `<thead>` and `<tbody>` where appropriate.
- Use `<th scope="col">` for column headings.

## Testing
Before a page is ready for integration:
- check all links
- test keyboard navigation
- test desktop/tablet/mobile
- check browser console for JavaScript errors
- validate HTML
- review accessibility labels and alt text
