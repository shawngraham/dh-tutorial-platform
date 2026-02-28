# Content Authoring Guide

How to add, modify, and maintain pedagogical content in the DHPrimer: Tutorial Lab.

---

## Architecture Overview

All curriculum content lives in these locations:

| Location | Contains | Consumed by |
|---|---|---|
| `src/data/lessons/*.md` | One markdown file per lesson (content + challenges) | Loaded by Vite at build time via `lessons-loader.ts` |
| `src/data/modules.ts` | Module definitions (groupings of lessons) | Pathway generator, dashboard, export |
| `src/data/lessons.ts` | Thin re-export shim — **do not edit directly** | All existing app code (unchanged API) |

These are **static data** — they ship with the app and are not editable by learners. User-generated data (notes, progress, code snapshots) lives in Zustand stores backed by localStorage.

### How content flows through the system

```
src/data/lessons/*.md   ← source of truth for all lesson content
        │
        │  (Vite's lessonMarkdownPlugin transforms each .md file
        │   into a typed LessonDefinition at build/dev time)
        │
src/data/lessons-loader.ts   ← import.meta.glob aggregates all .md files
        │
src/data/lessons.ts          ← re-exports from lessons-loader (stable public API)
        │
        ├─► pathwayGenerator.ts   ← uses module IDs to build personalized pathways
        ├─► LessonViewer          ← renders lesson.content as Markdown
        ├─► CodeSandbox           ← loads challenge starterCode, validates against expectedOutput
        ├─► progressStore.ts      ← tracks completion by lesson/challenge ID
        ├─► obsidianExport.ts     ← generates Markdown files from lesson + module data
        └─► data.test.ts          ← validates structural integrity
```

**Key implication:** IDs are the glue. If you rename a lesson ID, you must update it everywhere: the parent module's `lessons` array, any other lesson's `prerequisites` array, and the pathway generator maps.

---

## Type Definitions

All types live in `src/types/index.ts`. Here are the two you need:

### ModuleDefinition

```typescript
interface ModuleDefinition {
  id: string;                  // kebab-case, unique (e.g. 'text-analysis-fundamentals')
  title: string;               // Human-readable (e.g. 'Text Analysis Fundamentals')
  description: string;         // 1-2 sentences shown on dashboard and export
  estimatedHours: number;      // Total for all lessons in the module
  prerequisites: string[];     // Module IDs that should be completed first
  lessons: string[];           // Ordered array of lesson IDs
  track: 'digital-literacy' | 'coding-fundamentals' | 'dh-methods' | 'discipline-specific';
  disciplines: string[];       // Which disciplines benefit (e.g. ['literature', 'history'])
  keywords: string[];          // For search and tagging
}
```

### LessonDefinition

```typescript
interface LessonDefinition {
  id: string;                  // kebab-case, unique (e.g. 'text-analysis-01')
  title: string;               // Human-readable
  moduleId: string;            // Must match a module's id field
  prerequisites: string[];     // Lesson IDs (not module IDs)
  estimatedTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];// 2-5 measurable outcomes
  keywords: string[];          // For search, tagging, and Obsidian export
  content: string;             // Markdown lesson body (see Content Format below)
  challenges: ChallengeDefinition[];
}
```

### ChallengeDefinition

```typescript
interface ChallengeDefinition {
  id: string;                  // Convention: '{lesson-id}-c{n}' (e.g. 'text-analysis-01-c1')
  title: string;               // Short imperative (e.g. 'Count words in a text')
  language: 'python' | 'r';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starterCode: string;         // Pre-filled in the code editor
  expectedOutput: string;      // Exact string the sandbox checks against stdout
  hints: string[];             // Revealed progressively; aim for 2-3
  solution: string;            // Complete working code shown on request
}
```

---

## Adding a New Lesson

Each lesson is a single Markdown file in `src/data/lessons/`. Vite picks it up automatically — there is no compile step.

### Step 1: Create the lesson file

Create `src/data/lessons/<lesson-id>.md`. The filename must match the `id` in the frontmatter. Copy an existing lesson as a starting point, or use the structure below.

**Full example — `src/data/lessons/text-analysis-05.md`:**

````markdown
---
id: text-analysis-05
title: Basic NLP with NLTK
moduleId: text-analysis-fundamentals
prerequisites:
  - text-analysis-04
estimatedTimeMinutes: 40
difficulty: intermediate
learningObjectives:
  - Tokenize text using NLTK
  - Perform part-of-speech tagging
  - Extract named entities from a passage
keywords:
  - nltk
  - tokenization
  - pos tagging
  - named entities
  - nlp
---

# Basic NLP with NLTK

## Analogy
If string methods are like reading with a magnifying glass...

## Key Concepts

:::definition
**Tokenization**: Splitting text into individual words or sentences.
:::

:::try-it
Run the tokenizer on a sentence of your own.
:::

:::challenge
Extract all proper nouns from a paragraph.
:::

---challenges---

### Challenge: Tokenize a sentence

- id: text-analysis-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import nltk
nltk.download('punkt_tab', quiet=True)

text = "Mary Shelley wrote Frankenstein in 1818."

# Tokenize into words
# Your code here
```

#### Expected Output

```
['Mary', 'Shelley', 'wrote', 'Frankenstein', 'in', '1818', '.']
```

#### Hints

1. Import word_tokenize from nltk.tokenize
2. Call word_tokenize(text) and print the result

#### Solution

```python
import nltk
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import word_tokenize

text = "Mary Shelley wrote Frankenstein in 1818."
print(word_tokenize(text))
```
````

**Frontmatter field reference:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | kebab-case, unique across all lessons |
| `title` | string | yes | Human-readable; quote in YAML if it contains a colon (e.g. `title: 'Data: A Primer'`) |
| `moduleId` | string | yes | Must match an existing module's `id` |
| `prerequisites` | list | no | Lesson IDs; use `[]` if none |
| `estimatedTimeMinutes` | number | no | Defaults to `30` if omitted |
| `difficulty` | string | yes | `beginner`, `intermediate`, or `advanced` |
| `learningObjectives` | list | yes | 2–5 measurable outcomes |
| `keywords` | list | no | For search and Obsidian export |

**Challenges section format** (`---challenges---` separator, then one block per challenge):

````markdown
---challenges---

### Challenge: <Title>

- id: <lesson-id>-c1
- language: python   # or: r
- difficulty: beginner

#### Starter Code

```python
# starter code here
```

#### Expected Output

```
exact stdout here
```

#### Hints

1. First hint
2. Second hint

#### Solution

```python
# full solution here
```
````

### Step 2: Register the lesson in `modules.ts`

Add the lesson ID to the parent module's `lessons` array **in the order you want it taught**:

```typescript
{
  id: 'text-analysis-fundamentals',
  // ...
  lessons: [
    'text-analysis-01',
    'text-analysis-02',
    'text-analysis-03',
    'text-analysis-04',
    'text-analysis-05',  // ← add here
  ],
  // ...
}
```

Update `estimatedHours` if the new lesson significantly changes the total.

### Step 3: Wire up prerequisites

If this lesson should follow another, set `prerequisites` on the new lesson. If a later lesson should follow this one, update that lesson's `prerequisites` too.

### Step 4: Update tests

In `src/__tests__/data.test.ts`, update the module count assertion if you added a module, or verify the existing tests still pass (they validate referential integrity automatically).

### Step 5: Update pathway generator (if applicable)

If the new lesson belongs to a **new module**, you may need to update `src/utils/pathwayGenerator.ts`:

- `DISCIPLINE_MODULE_MAP` — which disciplines map to this module
- `INTEREST_MODULE_MAP` — which user interests map to this module
- The default-module fallback logic

If the lesson belongs to an existing module, no pathway changes are needed.

---

## Adding a New Module

### Step 1: Define the module in `modules.ts`

Add a new object to the `modules` array:

```typescript
{
  id: 'network-analysis',
  title: 'Network Analysis for DH',
  description: 'Model relationships between people, places, and texts as networks. Use NetworkX to build, visualize, and analyze graphs.',
  estimatedHours: 6,
  prerequisites: ['python-basics'],
  lessons: ['network-01', 'network-02', 'network-03'],
  track: 'dh-methods',
  disciplines: ['history', 'literature'],
  keywords: ['network', 'graph', 'centrality', 'networkx'],
}
```

### Step 2: Create all lessons for the module

Create one `.md` file per lesson in `src/data/lessons/` following the format above. Each lesson ID listed in the module's `lessons` array must have a corresponding `.md` file.

### Step 3: Register in pathway generator

Edit `src/utils/pathwayGenerator.ts`:

```typescript
// In DISCIPLINE_MODULE_MAP, add the module where relevant:
history: ['structured-data', 'data-visualization', 'web-data-collection', 'network-analysis'],

// In INTEREST_MODULE_MAP:
'network analysis': ['network-analysis'],
'social networks': ['network-analysis'],
```

### Step 4: Update tests

Update the module-count assertion in `data.test.ts`:

```typescript
it('has 7 modules', () => {   // was 6
  expect(modules).toHaveLength(7);
});
```

The referential-integrity tests (`all module lesson references point to valid lessons`, etc.) will automatically cover the new content.

---

## Content Format: Writing lesson.content

Lesson content is a **Markdown string** rendered by `react-markdown` with `remark-gfm`. It also supports three custom directive blocks:

### Custom directives

```markdown
::: definition
**Term**: Explanation of the term.
:::

::: try-it
Instructions for an informal, ungraded exercise.
:::

::: challenge
Description of the graded challenge that follows.
:::
```

These are rendered as styled callout boxes in the lesson viewer.

### ADEPT framework

The spec recommends structuring each lesson using the ADEPT framework:

| Section | Purpose | Approximate time |
|---|---|---|
| **A — Analogy** | Connect to a familiar concept; use a humanities-relevant metaphor | 2 min |
| **D — Diagram** | Visual representation; describe a flowchart or concept map in text | 2 min |
| **E — Example** | Concrete case from DH research with real, working code | 5 min |
| **P — Practice** | Guided coding exercise (the `::: try-it` block) | 10 min |
| **T — Transfer** | Connect to a new situation or the learner's own research | 5 min |

Not every lesson needs every section rigidly, but aim for at least Analogy + Example + Practice.

### Code blocks in content

Use fenced code blocks with a language tag. These are syntax-highlighted in the viewer:

````markdown
```python
from collections import Counter
words = text.lower().split()
freq = Counter(words)
```
````

### Recommended content length

- Aim for **300-800 words** of prose per lesson (excluding code).
- Use headings (`##`, `###`) to structure sections.
- Keep code examples short (5-15 lines). The sandbox is for longer exercises.

---

## Writing Challenges

Challenges are the core interactive element. Each lesson should have **2-3 challenges** that progress in difficulty.

### Challenge design principles

1. **Starter code should compile/run.** Give learners a scaffold that produces *something* when they hit Run, even if the output is wrong. Avoid starting with code that throws an error.

2. **expectedOutput must be exact.** The sandbox compares `stdout` against `expectedOutput` as a string. Include newlines (`\n`) where needed. Trailing whitespace matters.

3. **Hints are progressive.** The first hint should nudge toward the right approach. The last hint should be nearly a spoiler. Aim for 2-3 hints.

4. **Solutions must produce expectedOutput.** Always test your solution code manually. If `print()` adds a trailing newline, your expectedOutput should not include it (the sandbox trims trailing newlines).

5. **Use humanities data.** Instead of `['a', 'b', 'c']`, use `['Austen', 'Shelley', 'Bront\u00eb']`. Instead of generic numbers, use publication years or word counts.

### expectedOutput gotchas

| Scenario | What to do |
|---|---|
| Python `print([1, 2, 3])` | expectedOutput: `"[1, 2, 3]"` — no trailing newline |
| Multi-line output | Use `\n` between lines: `"line1\nline2"` |
| Floating point | Be specific: `"2.0"` not `"2"` if the code produces a float |
| Dictionary output | Python dicts have insertion-ordered keys since 3.7, but be explicit in starter code to control order |

### Starter code conventions

```typescript
starterCode: `# Clear comment explaining the goal
# Specific instruction line 1
# Specific instruction line 2

some_given_data = "provided value"

# Your code here
`,
```

- Start with a comment stating the goal.
- Provide any data the learner needs.
- End with `# Your code here` as a prompt.
- Use `\n` for newlines inside the template literal.

---

## Modifying Existing Content

### Changing lesson content (safe)

Open `src/data/lessons/<lesson-id>.md` and edit directly. Updating `content`, `learningObjectives`, `keywords`, `estimatedTimeMinutes`, or `difficulty` is safe and requires no changes elsewhere. Vite hot-reloads the change automatically during `npm run dev`.

### Changing a lesson ID (breaking)

A lesson ID appears in up to 5 places:

1. `src/data/lessons/<old-id>.md` — rename the file to `<new-id>.md` and update the `id` field in the frontmatter
2. `modules.ts` — the parent module's `lessons` array
3. Other `.md` files' `prerequisites` frontmatter fields
4. `data.test.ts` — any test that references the ID by name
5. `pathwayGenerator.test.ts` — if tested explicitly

Use your editor's find-all to update every occurrence.

### Changing a module ID (breaking)

A module ID appears in:

1. `modules.ts` — the module object's `id` field
2. `modules.ts` — other modules' `prerequisites` arrays
3. Every child lesson's `.md` file — the `moduleId` frontmatter field
4. `pathwayGenerator.ts` — `DISCIPLINE_MODULE_MAP` and `INTEREST_MODULE_MAP`
5. `pathwayGenerator.ts` — default-module fallback list
6. `pathwayGenerator.test.ts` and `data.test.ts`

### Removing a lesson

1. Delete `src/data/lessons/<lesson-id>.md`.
2. Remove the ID from the parent module's `lessons` array in `modules.ts`.
3. Remove it from any other lesson's `prerequisites` frontmatter.
4. Check that no test references it by name.

### Reordering lessons within a module

Change the order in the module's `lessons` array. The UI presents them in array order. Make sure `prerequisites` still make sense after reordering.

---

## Testing

### Running tests

```bash
npm test
```

To validate lesson markdown files without running the full test suite (useful during content authoring):

```bash
npm run validate-lessons
```

This checks all `.md` files in `src/data/lessons/` for required fields, valid `difficulty` values, and duplicate IDs. It does not require a build step.

### What the tests validate (`src/__tests__/data.test.ts`)

| Test | What it checks |
|---|---|
| `has N modules` | Module count matches expectation — **update when adding modules** |
| `all modules have required fields` | Every module has id, title, description, estimatedHours > 0, at least 1 lesson, and a track |
| `getModuleById finds existing module` | Lookup helper works |
| `getModulesByTrack returns correct modules` | Track filter works |
| `has lessons defined` | At least one lesson exists |
| `all lessons have required fields` | Every lesson has id, title, moduleId, estimatedTimeMinutes > 0, difficulty, at least 1 learning objective, and content |
| `all lessons reference valid modules` | Every lesson's `moduleId` exists in `modules` |
| `all module lesson references point to valid lessons` | Every ID in a module's `lessons` array exists in `lessons` |
| `getLessonById finds existing lesson` | Lookup helper works |
| `getLessonsByModule returns lessons for a module` | Module filter works |
| `all challenges have required fields` | Every challenge has id, title, language, starterCode, expectedOutput, and solution |

### What the tests do NOT validate

- Whether `expectedOutput` actually matches the `solution` code's output (you must test this manually or in the browser sandbox).
- Whether `prerequisites` form a valid DAG (no cycles). Use common sense.
- Whether the lesson content Markdown is well-formed. Preview it in the app.
- Whether the pathway generator covers the new module. Check `pathwayGenerator.test.ts`.

---

## Conventions and ID Naming

### Lesson IDs

Pattern: `{module-prefix}-{nn}`

| Module | Prefix | Example |
|---|---|---|
| Digital Literacy Foundations | `digital-literacy-` | `digital-literacy-01` |
| Python Basics for Humanists | `python-basics-` | `python-basics-03` |
| Text Analysis Fundamentals | `text-analysis-` | `text-analysis-02` |
| Working with Structured Data | `structured-data-` | `structured-data-04` |
| Data Visualization for DH | `data-viz-` | `data-viz-01` |
| Web Data Collection | `web-data-` | `web-data-03` |

### Challenge IDs

Pattern: `{lesson-id}-c{n}` — e.g., `text-analysis-02-c1`, `text-analysis-02-c2`.

### Tracks

Use one of the four defined tracks:

- `digital-literacy` — foundational computer skills
- `coding-fundamentals` — language-specific programming basics
- `dh-methods` — applied computational methods for humanities
- `discipline-specific` — reserved for future discipline-focused modules

---

## Checklist: Adding a Lesson

- [ ] File created at `src/data/lessons/<lesson-id>.md`
- [ ] Filename matches the `id` field in the frontmatter
- [ ] `id` is unique — run `npm run validate-lessons` to check
- [ ] `moduleId` matches an existing module in `modules.ts`
- [ ] `prerequisites` reference existing lesson IDs (or is `[]`)
- [ ] `learningObjectives` has 2–5 items
- [ ] Lesson body uses Markdown with ADEPT sections
- [ ] `---challenges---` section has 2–3 challenges, each with starter code, expected output, 2–3 hints, and a solution
- [ ] Lesson ID added to parent module's `lessons` array in `src/data/modules.ts` (in teaching order)
- [ ] Module's `estimatedHours` updated if needed
- [ ] `npm run validate-lessons` passes
- [ ] `npm test` passes
- [ ] Previewed in browser (`npm run dev`) to verify Markdown rendering and challenge validation

## Checklist: Adding a Module

- [ ] All items from the lesson checklist, for every lesson in the module
- [ ] Module object added to `modules` array in `src/data/modules.ts`
- [ ] `id` is unique and kebab-case
- [ ] `prerequisites` reference existing module IDs (or is `[]`)
- [ ] Module count in `data.test.ts` updated
- [ ] `pathwayGenerator.ts` updated: discipline map, interest map, defaults
- [ ] `pathwayGenerator.test.ts` updated if new mappings were added
- [ ] `npm test` passes
