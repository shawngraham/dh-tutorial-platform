#!/usr/bin/env node

/**
 * extract-lessons.mjs
 *
 * One-off migration script: reads the compiled src/data/lessons.ts and writes
 * each lesson back out as an individual markdown file in src/data/lessons/.
 *
 * This reverses what compile-lessons.mjs did, producing the source files that
 * the new import.meta.glob loader will pick up directly.
 *
 * Usage:
 *   node scripts/extract-lessons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const LESSONS_TS = join(ROOT, 'src', 'data', 'lessons.ts');
const OUT_DIR = join(ROOT, 'src', 'data', 'lessons');

// ---------------------------------------------------------------------------
// Convert TypeScript source to plain JavaScript for vm evaluation
// ---------------------------------------------------------------------------

const tsSource = readFileSync(LESSONS_TS, 'utf-8');

const jsSource = tsSource
  // Remove TypeScript import type declaration
  .replace(/^import type[^\n]+\n/m, '')
  // Remove type annotation on the lessons array declaration
  .replace(/export const lessons: LessonDefinition\[\]/, 'const lessons')
  // Remove TypeScript signatures from the utility functions
  .replace(
    /export function getLessonById\(id: string\): LessonDefinition \| undefined/,
    'function getLessonById(id)'
  )
  .replace(
    /export function getLessonsByModule\(moduleId: string\): LessonDefinition\[\]/,
    'function getLessonsByModule(moduleId)'
  );

// Evaluate in a sandboxed VM context
const context = vm.createContext({});
vm.runInContext(jsSource + '\nthis._lessons = lessons;', context);

/** @type {Array<import('../src/types/index.ts').LessonDefinition>} */
const lessons = context._lessons;
console.log(`Loaded ${lessons.length} lessons from lessons.ts\n`);

// ---------------------------------------------------------------------------
// Output directory
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Writing to ${OUT_DIR}/\n`);

// ---------------------------------------------------------------------------
// Markdown generators
// ---------------------------------------------------------------------------

function generateFrontmatter(lesson) {
  const fm = {
    id: lesson.id,
    title: lesson.title,
    moduleId: lesson.moduleId,
    prerequisites: lesson.prerequisites,
    estimatedTimeMinutes: lesson.estimatedTimeMinutes,
    difficulty: lesson.difficulty,
    learningObjectives: lesson.learningObjectives,
    keywords: lesson.keywords,
  };
  // js-yaml.dump() will quote any strings that contain YAML-special characters
  return `---\n${yaml.dump(fm, { lineWidth: -1 })}---\n`;
}

function generateChallengeMarkdown(challenge) {
  let md = `### Challenge: ${challenge.title}\n\n`;
  md += `- id: ${challenge.id}\n`;
  md += `- language: ${challenge.language}\n`;
  md += `- difficulty: ${challenge.difficulty}\n`;
  md += '\n';

  md += `#### Starter Code\n\n`;
  md += `\`\`\`${challenge.language}\n`;
  md += challenge.starterCode;
  if (!challenge.starterCode.endsWith('\n')) md += '\n';
  md += `\`\`\`\n\n`;

  md += `#### Expected Output\n\n`;
  md += `\`\`\`\n`;
  md += challenge.expectedOutput;
  if (!challenge.expectedOutput.endsWith('\n')) md += '\n';
  md += `\`\`\`\n\n`;

  md += `#### Hints\n\n`;
  challenge.hints.forEach((hint, i) => {
    md += `${i + 1}. ${hint}\n`;
  });
  md += '\n';

  md += `#### Solution\n\n`;
  md += `\`\`\`${challenge.language}\n`;
  md += challenge.solution;
  if (!challenge.solution.endsWith('\n')) md += '\n';
  md += `\`\`\`\n\n`;

  return md;
}

function generateMarkdown(lesson) {
  let md = generateFrontmatter(lesson);
  md += '\n';
  md += lesson.content;
  if (!lesson.content.endsWith('\n')) md += '\n';

  if (lesson.challenges.length > 0) {
    md += '\n---challenges---\n\n';
    for (const challenge of lesson.challenges) {
      md += generateChallengeMarkdown(challenge);
    }
  }

  return md;
}

// ---------------------------------------------------------------------------
// Write each lesson
// ---------------------------------------------------------------------------

let written = 0;
let errors = 0;

for (const lesson of lessons) {
  try {
    const md = generateMarkdown(lesson);
    const outPath = join(OUT_DIR, `${lesson.id}.md`);
    writeFileSync(outPath, md, 'utf-8');
    console.log(`  [ok]  ${lesson.id}.md  (${lesson.challenges.length} challenge(s))`);
    written++;
  } catch (err) {
    console.error(`  [ERR] ${lesson.id}: ${err.message}`);
    errors++;
  }
}

console.log(`\nDone. ${written} file(s) written, ${errors} error(s).`);
if (errors > 0) process.exit(1);
