# status: not yet implemented

# Accessibility Improvement Plan

## Audit Summary

This document presents the findings of an accessibility audit of the DHPrimer: Tutorial Lab application and a prioritized plan to address the issues found. The audit covers all components: onboarding flow, dashboard, lesson viewer, code sandbox, notes panel, progress tracker, library, and export panel.

**Standard referenced:** WCAG 2.1 AA

---

## Issues Found

### Critical (P0) — Blocks screen-reader or keyboard-only users entirely

| # | Issue | Where | WCAG Criterion |
|---|-------|-------|----------------|
| 1 | **No skip-navigation link.** Keyboard users must tab through the entire navigation bar on every page before reaching content. | `Layout.tsx` | 2.4.1 Bypass Blocks |
| 2 | **Focus not trapped in modals.** The plot-output modal (`CodeSandbox.tsx`) and the notes slide-over panel (`NotePanel.tsx`) do not trap focus. A keyboard user can tab behind the modal into obscured page content. | `CodeSandbox.tsx:225–278`, `NotePanel.tsx:42–217` | 2.4.3 Focus Order, 2.1.2 No Keyboard Trap |
| 3 | **Modals lack `role="dialog"` and `aria-modal="true"`.** Screen readers do not announce the plot modal or notes panel as dialogs. | `CodeSandbox.tsx:226`, `NotePanel.tsx:53` | 4.1.2 Name, Role, Value |
| 4 | **Clickable `<div>` elements used as buttons without keyboard access.** Dashboard module cards (`Dashboard.tsx:93–115`) and note list items (`NotePanel.tsx:140–175`, `NoteList.tsx:76–108`) use `onClick` on `<div>` elements but have no `role="button"`, `tabIndex`, or `onKeyDown` handler. Keyboard users cannot activate them. | `Dashboard.tsx`, `NotePanel.tsx`, `NoteList.tsx` | 2.1.1 Keyboard, 4.1.2 Name, Role, Value |
| 5 | **`focus:outline-none` used without replacement focus indicator.** Nearly every interactive element (inputs, textareas, buttons) sets `focus:outline-none` without providing a visible alternative focus ring. Keyboard users cannot see which element is focused. | All components | 2.4.7 Focus Visible |
| 6 | **Dynamic content changes not announced.** Code execution output, challenge pass/fail results, runtime loading status, and hint reveals are injected into the DOM without `aria-live` regions. Screen-reader users receive no notification that content has changed. | `CodeSandbox.tsx` (output area, status banner, hints) | 4.1.3 Status Messages |
| 7 | **`alert()` used for feedback.** `handleSaveToNotes` and `handleDownloadPlot` use `window.alert()` for success/error feedback. This is disorienting for screen-reader users and provides no programmatic association with the triggering action. | `CodeSandbox.tsx:181,184,187` | 4.1.3 Status Messages |

### High (P1) — Significant barriers for assistive-technology users

| # | Issue | Where | WCAG Criterion |
|---|-------|-------|----------------|
| 8 | **Form inputs missing labels.** The note title `<input>` (`NoteEditor.tsx:57–63`), tags `<input>` (`NoteEditor.tsx:75–81`), custom goal `<input>` (`GoalSetting.tsx:69–76`), and search `<input>` (`NoteList.tsx:42–48`) rely on `placeholder` alone — not announced as a label by most screen readers. | `NoteEditor.tsx`, `GoalSetting.tsx`, `NoteList.tsx` | 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions |
| 9 | **Challenge tabs do not use ARIA tabs pattern.** The challenge selector buttons (`CodeSandbox.tsx:293–308`) behave as a tablist but lack `role="tablist"`, `role="tab"`, `aria-selected`, and `role="tabpanel"` on the associated content. | `CodeSandbox.tsx` | 4.1.2 Name, Role, Value |
| 10 | **No page-title updates on route change.** `document.title` is never set when navigating between pages, so screen-reader users are not informed which page they are on. | `App.tsx`, all page components | 2.4.2 Page Titled |
| 11 | **Color used as sole indicator of status.** Progress dots in `ProgressTracker.tsx:58–65` use green, yellow, and gray circles with no text or icon alternative. Color-blind users cannot distinguish lesson status. | `ProgressTracker.tsx` | 1.4.1 Use of Color |
| 12 | **Progress bars have no accessible values.** Module progress bars (`Dashboard.tsx:108–113`, `ProgressTracker.tsx:45–52`) use CSS `width` but have no `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax`. | `Dashboard.tsx`, `ProgressTracker.tsx` | 4.1.2 Name, Role, Value |
| 13 | **Toggle/selection buttons lack `aria-pressed` state.** Onboarding selection buttons for discipline, role, interests, goals, and note filter tabs visually change on selection but provide no programmatic selected state. | `BackgroundAssessment.tsx`, `InterestMapping.tsx`, `GoalSetting.tsx`, `NotePanel.tsx` | 4.1.2 Name, Role, Value |
| 14 | **Decorative SVG icons lack `aria-hidden="true"`.** All inline SVG icons (close buttons, navigation, download, notes) are read aloud as empty images by screen readers. | All components with inline `<svg>` | 1.1.1 Non-text Content |

### Medium (P2) — Reduces usability but has workarounds

| # | Issue | Where | WCAG Criterion |
|---|-------|-------|----------------|
| 15 | **CSS `::before` pseudo-elements contain emoji + text.** The directive blocks (`.try-it::before`, `.challenge::before`, etc.) use `content: "icon Text"`. Screen readers may read the emoji as its Unicode name (e.g., "light bulb Try It"), creating a confusing experience. | `index.css:13–50` | 1.1.1 Non-text Content |
| 16 | **Lesson content list items rendered with visual dashes instead of semantic list markers.** `LessonContent.tsx:79` and `LessonViewer.tsx:76` render `<li>` elements with a decorative `<span>-</span>` that screen readers will read aloud as "dash." The native list semantics are overridden. | `LessonContent.tsx`, `LessonViewer.tsx` | 1.3.1 Info and Relationships |
| 17 | **Code blocks do not identify the programming language.** The `<pre>/<code>` blocks in `LessonContent.tsx:62–66` strip the `language-*` class and do not set a `data-language` or announce the language to assistive technology. | `LessonContent.tsx` | 1.3.1 Info and Relationships |
| 18 | **No escape-key handler for modals.** Neither the plot modal nor the notes panel closes on `Escape` keypress. | `CodeSandbox.tsx`, `NotePanel.tsx` | 2.1.1 Keyboard |
| 19 | **Delete actions have no confirmation.** Clicking "Delete" on a note immediately removes it with no undo or confirmation, which is especially problematic for keyboard and switch-access users who may accidentally activate the button. | `NotePanel.tsx:164–172`, `NoteList.tsx:96–105` | 3.3.4 Error Prevention |
| 20 | **Heading hierarchy inconsistencies.** Some pages jump from `<h1>` to `<h3>` (e.g., `Dashboard.tsx` skips `<h2>` for "Continue Learning" then uses `<h3>`). Screen-reader heading navigation becomes unreliable. | `Dashboard.tsx`, `LessonViewer.tsx` | 1.3.1 Info and Relationships |

### Low (P3) — Best practice / enhancement

| # | Issue | Where | WCAG Criterion |
|---|-------|-------|----------------|
| 21 | **No landmark roles beyond `<header>` and `<main>`.** Lesson content, sandbox, notes panel, and sidebar areas lack `<aside>`, `<section>`, `<article>`, or `<nav>` landmarks. Screen-reader users cannot navigate by region. | All page components | 1.3.1 Info and Relationships |
| 22 | **Link in `Welcome.tsx` has no visible focus style and is embedded mid-paragraph.** The "Carleton University XLab" link inherits no clear focus ring. | `Welcome.tsx:17` | 2.4.7 Focus Visible |
| 23 | **No `prefers-reduced-motion` media query.** Animations (`transition-colors`, `animate-spin`, `animate-in`, slide-over transition) are not suppressed for users who prefer reduced motion. | `CodeSandbox.tsx`, `NotePanel.tsx`, `index.css` | 2.3.3 Animation from Interactions (AAA, but good practice) |
| 24 | **Textarea code editor does not support standard code-editing keyboard shortcuts.** Tab inserts focus change rather than indentation; no line-number gutter for reference. | `CodeSandbox.tsx:320–326` | Best practice |

---

## Remediation Plan

### Phase 1: Critical keyboard and screen-reader access

These fixes should be done first as they remove the most serious barriers.

**1. Add a skip-navigation link**
- In `Layout.tsx`, add a visually-hidden-but-focusable anchor `<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>` as the first child of the page.
- Add `id="main-content"` to the `<main>` element.

**2. Fix focus management and ARIA roles on modals**
- Plot modal (`CodeSandbox.tsx`):
  - Add `role="dialog"`, `aria-modal="true"`, `aria-label="Visual output"` to the modal container.
  - On open, move focus to the modal (e.g., the close button).
  - Trap focus within the modal while it is open (use a focus-trap library or manual implementation).
  - Close the modal on `Escape` key.
  - On close, return focus to the trigger button ("View Plot").
- Notes slide-over (`NotePanel.tsx`):
  - Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the "Notes" heading.
  - Trap focus within the panel.
  - Close on `Escape` key.
  - On close, return focus to the "Notes" floating button.

**3. Replace clickable `<div>` elements with `<button>` or add `role`/keyboard support**
- `Dashboard.tsx` module cards: Wrap the clickable area in a `<button>` or add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler that activates on Enter/Space.
- `NotePanel.tsx` and `NoteList.tsx` note items: Same treatment — make each note item keyboard-accessible.

**4. Add visible focus indicators**
- Replace all instances of `focus:outline-none` with `focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` (or a similar visible indicator). This can be done globally via a Tailwind base-layer rule for interactive elements.
- For the code editor `<textarea>`, keep `focus:outline-none` but add a visible border change like `focus:border-indigo-500`.

**5. Add `aria-live` regions for dynamic content**
- Code sandbox output area: Wrap the `<pre>` output in a `<div aria-live="polite" aria-atomic="true">`.
- Runtime status banner: Add `aria-live="assertive"` to the loading/error status element.
- Challenge result ("Challenge passed!" / "Expected: ..."): Already part of output — the `aria-live` on the output container will cover this.
- Hint reveals: Add `aria-live="polite"` to the hints list container.

**6. Replace `alert()` calls with accessible in-page notifications**
- Create a lightweight toast/notification component or an `aria-live="polite"` status region.
- Replace `alert('Plot saved...')`, `alert('Failed...')`, and `alert('No saveable...')` with messages injected into this region.

### Phase 2: Labeling and semantics

**7. Add labels to all form inputs**
- `NoteEditor.tsx`: Add `aria-label="Note title"` to the title input, `aria-label="Tags, comma separated"` to the tags input. Alternatively, use visible `<label>` elements.
- `GoalSetting.tsx`: Add `aria-label="Add a custom goal"` to the custom goal input.
- `NoteList.tsx`: Add `aria-label="Search notes"` to the search input.

**8. Implement ARIA tabs pattern for challenge tabs**
- On the container: `role="tablist"`.
- On each tab button: `role="tab"`, `aria-selected="true|false"`, `aria-controls="tabpanel-{id}"`.
- On the sandbox content below: `role="tabpanel"`, `id="tabpanel-{id}"`, `aria-labelledby="tab-{id}"`.

**9. Set `document.title` on route changes**
- Use a React Router `useEffect` or a small component that updates `document.title` based on the current route and lesson/page name. For example:
  - Dashboard: "Dashboard | DHPrimer"
  - Lesson: "{lesson.title} | DHPrimer"
  - Library: "Library | DHPrimer"
  - etc.

**10. Add text alternatives for color-only status indicators**
- `ProgressTracker.tsx`: Add visually-hidden text like `<span class="sr-only">Completed</span>`, `<span class="sr-only">In progress</span>`, `<span class="sr-only">Not started</span>` next to the status dots. Alternatively, add a small icon (checkmark, clock, circle) alongside the color dot.

**11. Make progress bars accessible**
- Add `role="progressbar"`, `aria-valuenow={pct}`, `aria-valuemin={0}`, `aria-valuemax={100}`, and `aria-label="Module progress: {name}"` to the progress-bar containers in `Dashboard.tsx` and `ProgressTracker.tsx`.

**12. Add `aria-pressed` to selection/toggle buttons**
- In `BackgroundAssessment.tsx`, `InterestMapping.tsx`, `GoalSetting.tsx`: Add `aria-pressed={isSelected}` to each selection button.
- In `NotePanel.tsx` filter tabs: Add `aria-pressed={isActive}` or use `aria-current` as appropriate.

**13. Add `aria-hidden="true"` to decorative SVG icons**
- Audit every inline `<svg>` element. If the icon is decorative (i.e., adjacent text already conveys meaning), add `aria-hidden="true"`. If the icon is the only content of a button, ensure the button has an `aria-label`.

### Phase 3: Content and structure improvements

**14. Fix CSS `::before` emoji content**
- Option A: Remove emoji from CSS `content` property and render them in the HTML where they can be given `aria-hidden="true"` (requires changes to `remarkDirectiveTransformer`).
- Option B: Add `role="img"` and `aria-label` to the directive container `<div>` so that the entire block is described (e.g., `aria-label="Try It block"`), and keep the emoji decorative.
- Recommended: Option B, as it requires fewer structural changes.

**15. Fix list-item rendering in lesson content**
- `LessonContent.tsx:78–82`: Remove the custom `<span>-</span>` decoration from `<li>` elements and let CSS handle the list marker. Use `list-disc` or `list-item` Tailwind classes on `<ul>` and standard `<li>` rendering. This preserves native list semantics for screen readers.
- `LessonViewer.tsx:75–78`: Same fix for the learning-objectives list.

**16. Add language identification to code blocks**
- In `LessonContent.tsx`, when rendering block code, extract the language from the `language-*` class and add a visually-hidden label: `<span class="sr-only">Code block: {language}</span>` before the `<pre>`.

**17. Add Escape key handler to modals**
- Already covered in Phase 1 (#2), but also ensure the backdrop `<div>` click handler works alongside the keyboard handler.

**18. Add confirmation for destructive actions**
- Add a confirmation step (inline "Are you sure?" or a small dialog) before deleting notes in `NotePanel.tsx` and `NoteList.tsx`.

**19. Fix heading hierarchy**
- Ensure headings follow a logical order on each page (h1 > h2 > h3, no skipping).
- `Dashboard.tsx`: Change "Continue Learning" from `<h2>` to use proper level, and module cards' `<h3>` should follow.
- Review all pages for consistency.

### Phase 4: Enhancements (best practice)

**20. Add semantic landmarks**
- Wrap the lesson content area in `<article>`.
- Wrap the code sandbox in `<aside>` or `<section aria-label="Code sandbox">`.
- Wrap the notes panel content in `<section aria-label="Notes">`.
- Wrap the pathway listing in `<section>`.

**21. Add `prefers-reduced-motion` media query**
- In `index.css`, add:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

**22. Improve code-editor keyboard behavior**
- Intercept `Tab` key in the code editor `<textarea>` to insert indentation (2 or 4 spaces) instead of moving focus. Provide a documented `Escape` key to exit the textarea and resume normal tab navigation. Add a hint below the editor: "Press Escape to leave the editor, Tab to indent."

**23. Add visible focus style to Welcome page link**
- Add `focus:ring-2 focus:ring-indigo-500` or similar to the "Carleton University XLab" link.

---

## Testing Recommendations

After implementing these changes, validate with:

1. **Keyboard-only navigation** — Tab through every page and interactive element, verifying all are reachable and have visible focus.
2. **Screen reader testing** — Test with NVDA (Windows) or VoiceOver (macOS/iOS) on at least the lesson page, code sandbox, notes panel, and onboarding flow.
3. **Automated scanning** — Run axe-core or Lighthouse accessibility audit on every route.
4. **Color contrast** — Verify all text meets 4.5:1 contrast ratio (most Tailwind defaults do, but check custom colors like `text-gray-500` on white).
5. **Reduced motion** — Enable "prefers reduced motion" in OS settings and verify animations are suppressed.

---

## Priority Summary

| Phase | Scope | Impact |
|-------|-------|--------|
| Phase 1 (P0) | Skip link, focus traps, keyboard access, focus visibility, live regions, alerts | Removes complete blockers for keyboard and screen-reader users |
| Phase 2 (P1) | Labels, tabs pattern, page titles, color alternatives, ARIA states | Makes forms, navigation, and status information accessible |
| Phase 3 (P2) | Content semantics, heading hierarchy, confirmations | Improves comprehension and prevents errors |
| Phase 4 (P3) | Landmarks, reduced motion, editor UX | Polishes the experience for all assistive-technology users |
