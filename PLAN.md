# status: accomplished

# Plan: Refactor lessons.ts Using import.meta.glob

## Assessment

**Yes, this is the right long-term strategy.** `src/data/lessons.ts` is currently 545 KB / 13,412 lines — a single monolithic TypeScript file embedding all lesson markdown as template literals. The `import.meta.glob` approach solves the core maintenance problem: adding or editing a lesson currently requires either hand-editing a massive file or running a manual compile script.

The migration is non-trivial but well-defined.

---

## Current Architecture

```
lessons-in-development/   ← source .md files (only 3 present)
    data-viz-07.md
    data-viz-08.md
    data-viz-09.md
scripts/compile-lessons.mjs  ← Node.js script: .md → TypeScript
src/data/lessons.ts          ← 545 KB compiled output (11 lessons)
```

The compile script parses YAML frontmatter + markdown body + a custom
`---challenges---` separator section. It outputs TypeScript template literals
appended to `lessons.ts`. The markdown is stored as raw strings that
`react-markdown` then parses at runtime anyway.

**The problem**: 8 of the 11 lessons in `lessons.ts` no longer have source
markdown files — they were compiled in and the originals lost (or never moved
to `lessons-in-development/`).

---

## Proposed Architecture

```
src/data/lessons/        ← one .md file per lesson (source of truth)
    digital-literacy-01.md
    python-basics-01.md
    ... (11 total)
src/data/lessons-loader.ts  ← import.meta.glob aggregator
src/data/lessons.ts         ← re-exports from lessons-loader (API unchanged)
vite.config.ts              ← custom inline plugin for .md → JS transform
```

No compile step. No `lessons-in-development/` workflow. Editing a lesson means
editing its `.md` file directly. Adding a lesson means dropping a `.md` file
into `src/data/lessons/` — Vite picks it up automatically at build time.

---

## What the Custom Vite Plugin Does

Vite's `import.meta.glob` needs `.md` files to be valid JS modules. A custom
inline plugin in `vite.config.ts` handles the transform:

1. Intercepts any `*.md` file import
2. Splits on the `\n---challenges---\n` separator (preserving current format)
3. Parses frontmatter + body using `gray-matter`
4. Parses the challenges YAML block using `js-yaml`
5. Exports a default JS object matching `LessonDefinition`

This requires two new dev dependencies: `gray-matter` and `js-yaml`.

---

## Phase-by-Phase Plan

### Phase 0: Install dependencies
```bash
npm install --save-dev gray-matter js-yaml @types/js-yaml
```

### Phase 1: Write the Vite plugin
Add an inline plugin to `vite.config.ts` that transforms `.md` files.
Add a TypeScript ambient declaration so `import foo from './foo.md'` is typed.

### Phase 2: Extract lessons back to markdown
Write a one-off Node.js script (`scripts/extract-lessons.mjs`) that reads
`src/data/lessons.ts` and writes each lesson back out as a `.md` file in
`src/data/lessons/`. This reverses what `compile-lessons.mjs` did.

The 3 existing source files in `lessons-in-development/` are used directly
(they are the authoritative versions); the other 8 are extracted from the
compiled TypeScript.

### Phase 3: Create lessons-loader.ts
```typescript
// src/data/lessons-loader.ts
import type { LessonDefinition } from '../types';

const modules = import.meta.glob<{ default: LessonDefinition }>(
  './lessons/*.md',
  { eager: true }
);

export const lessons: LessonDefinition[] = Object.values(modules)
  .map(m => m.default)
  .sort((a, b) => {
    // preserve current ordering (moduleId then by lesson id)
    if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
    return a.id.localeCompare(b.id);
  });

export function getLessonById(id: string) {
  return lessons.find(l => l.id === id);
}

export function getLessonsByModule(moduleId: string) {
  return lessons.filter(l => l.moduleId === moduleId);
}
```

### Phase 4: Replace lessons.ts
Replace the 545 KB file with a thin re-export:
```typescript
// src/data/lessons.ts
export { lessons, getLessonById, getLessonsByModule } from './lessons-loader';
```
All 11 existing consumers keep working with zero changes.

### Phase 5: Update tests
`src/__tests__/data.test.ts` and `src/__tests__/components/lessonViewer.test.tsx`
import from `lessons.ts`. Vitest supports `import.meta.glob` natively, but the
glob pattern resolves at build time — tests may need a small mock or the glob
results inlined. Inspect and adjust.

### Phase 6: Cleanup
- Remove `scripts/compile-lessons.mjs` (or archive it)
- Remove `lessons-in-development/` (or keep as a drafts area outside `src/`)
- Remove the `compile-lessons` and `compile-lessons:write` npm scripts
- Update `CONTENT-GUIDE.md` to describe the new workflow

---

## Trade-offs

| | Current (compiled TS) | Proposed (import.meta.glob) |
|---|---|---|
| Lesson authoring | Edit markdown, run compile script | Edit markdown file directly |
| Adding a lesson | Compile + commit .ts blob | Drop .md file, done |
| Git diffs | Changes buried in 13K-line file | Clean per-file diffs |
| Type safety | Fully typed after compile | Typed at module boundary via plugin |
| Build complexity | Manual compile step required | Handled by Vite automatically |
| Test mocking | Simple (static array) | Vitest handles glob natively |
| Dependencies added | None | `gray-matter`, `js-yaml` |
| Challenges format | `---challenges---` separator (custom) | Same format preserved in plugin |

---

## Risks and Mitigations

**Risk**: The 8 lessons extracted from `lessons.ts` may have subtleties (escaped
backticks, special characters) that don't round-trip perfectly.
**Mitigation**: Run the existing test suite after extraction; do a visual spot-check.

**Risk**: `import.meta.glob` ordering is filesystem-dependent, not guaranteed
stable across platforms.
**Mitigation**: The loader sorts explicitly by `moduleId` + `id`, matching the
current logical order.

**Risk**: Vitest may not resolve `.md` imports in the test environment.
**Mitigation**: Vitest's `import.meta.glob` support is documented; worst case
add a `moduleNameMapper` or `resolve.alias` in `vitest.config`.

---

## Files Changed

| File | Action |
|---|---|
| `vite.config.ts` | Add inline `.md` transform plugin |
| `src/vite-env.d.ts` | Add `*.md` ambient module declaration |
| `src/data/lessons-loader.ts` | New file |
| `src/data/lessons.ts` | Replace 545 KB with 3-line re-export |
| `src/data/lessons/*.md` | New directory — 11 lesson files |
| `src/__tests__/data.test.ts` | Possibly adjust for glob |
| `scripts/compile-lessons.mjs` | Delete or archive |
| `scripts/extract-lessons.mjs` | New one-off extraction script |
| `package.json` | Remove compile scripts, possibly add types |
| `CONTENT-GUIDE.md` | Update workflow docs |
