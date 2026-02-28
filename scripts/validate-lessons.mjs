#!/usr/bin/env node

/**
 * validate-lessons.mjs
 *
 * Validates all lesson markdown files in src/data/lessons/.
 * Reports missing required fields, invalid values, and duplicate IDs.
 *
 * Usage:
 *   npm run validate-lessons
 *   node scripts/validate-lessons.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LESSONS_DIR = join(__dirname, '..', 'src', 'data', 'lessons');
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const REQUIRED_FIELDS = ['id', 'title', 'moduleId', 'difficulty'];

function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (val == null || val === '') return [];
  return [val];
}

const files = readdirSync(LESSONS_DIR)
  .filter(f => f.endsWith('.md') && !f.startsWith('_'))
  .sort();

console.log(`Validating ${files.length} lesson file(s) in src/data/lessons/\n`);

const errors = [];
const seenIds = new Set();

for (const file of files) {
  const raw = readFileSync(join(LESSONS_DIR, file), 'utf-8');
  const sepIdx = raw.indexOf('---challenges---');
  const mdPart = sepIdx !== -1 ? raw.slice(0, sepIdx) : raw;

  let fm;
  try {
    ({ data: fm } = matter(mdPart));
  } catch (e) {
    errors.push(`${file}: YAML parse error — ${e.message}`);
    continue;
  }

  const fileErrors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) fileErrors.push(`missing required field '${field}'`);
  }

  if (fm.difficulty && !VALID_DIFFICULTIES.includes(fm.difficulty)) {
    fileErrors.push(`invalid difficulty '${fm.difficulty}'`);
  }

  if (fm.id) {
    if (seenIds.has(fm.id)) {
      fileErrors.push(`duplicate id '${fm.id}'`);
    }
    seenIds.add(fm.id);
  }

  if (ensureArray(fm.learningObjectives).length === 0) {
    fileErrors.push(`no learningObjectives defined`);
  }

  if (fileErrors.length > 0) {
    fileErrors.forEach(e => errors.push(`${file}: ${e}`));
    console.error(`  [ERR]  ${file}`);
    fileErrors.forEach(e => console.error(`         ${e}`));
  } else {
    console.log(`  [ok]   ${file}  (id: ${fm.id})`);
  }
}

console.log('');

if (errors.length > 0) {
  console.error(`${errors.length} error(s) found. Fix them before committing.`);
  process.exit(1);
} else {
  console.log(`All ${files.length} lesson file(s) are valid.`);
}
