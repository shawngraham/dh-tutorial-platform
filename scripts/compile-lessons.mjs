#!/usr/bin/env node

/**
 * compile-lessons.mjs
 *
 * Reads individual lesson markdown files from /lessons-in-development
 * and compiles them into TypeScript lesson definitions that can be
 * appended to src/data/lessons.ts.
 *
 * Markdown format:
 *   - YAML frontmatter for lesson metadata (id, title, moduleId, etc.)
 *   - Markdown body becomes the `content` field
 *   - Challenges section after a `---challenges---` separator
 *
 * See lessons-in-development/_template.md for the full format reference.
 *
 * Usage:
 *   node scripts/compile-lessons.mjs                  # Preview generated TypeScript
 *   node scripts/compile-lessons.mjs --write          # Append to src/data/lessons.ts
 *   node scripts/compile-lessons.mjs --out file.ts    # Write to a separate file
 *   node scripts/compile-lessons.mjs --validate       # Validate files only (no output)
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const LESSONS_DIR = join(ROOT, 'lessons-in-development');
const LESSONS_TS = join(ROOT, 'src', 'data', 'lessons.ts');

// ---------------------------------------------------------------------------
// YAML Frontmatter Parser (handles the subset needed: strings, numbers, arrays)
// ---------------------------------------------------------------------------

function parseFrontmatter(raw) {
  const lines = raw.split('\n');
  const result = {};
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    // Array item (indented "- value")
    if (/^\s+-\s+/.test(line) && currentKey) {
      const value = trimmed.replace(/^\s*-\s*/, '');
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      result[currentKey].push(unquoteYaml(value));
      continue;
    }

    // Key-value pair
    const match = trimmed.match(/^([\w][\w-]*)\s*:\s*(.*)/);
    if (match) {
      const [, key, rawValue] = match;
      const value = rawValue.trim();

      if (value === '' || value === '[]') {
        result[key] = value === '[]' ? [] : '';
        currentKey = key;
      } else {
        result[key] = parseYamlValue(unquoteYaml(value));
        currentKey = key;
      }
    }
  }

  return result;
}

function unquoteYaml(s) {
  s = s.trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseYamlValue(s) {
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (/^\d+\.\d+$/.test(s)) return parseFloat(s);
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map(item => unquoteYaml(item.trim()));
  }
  return s;
}

// ---------------------------------------------------------------------------
// Markdown Lesson File Parser
// ---------------------------------------------------------------------------

function parseLessonFile(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const fileName = basename(filePath);

  // Extract frontmatter between --- delimiters
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error(`Missing YAML frontmatter (--- delimiters)`);
  }

  const frontmatter = parseFrontmatter(fmMatch[1]);
  const rest = fmMatch[2];

  // Split content from challenges on the ---challenges--- separator
  let content, challengesRaw;
  const challengeSepIndex = rest.indexOf('---challenges---');
  if (challengeSepIndex !== -1) {
    content = rest.slice(0, challengeSepIndex).trim();
    challengesRaw = rest.slice(challengeSepIndex + '---challenges---'.length).trim();
  } else {
    content = rest.trim();
    challengesRaw = '';
  }

  // Parse challenges
  const challenges = challengesRaw
    ? parseChallenges(challengesRaw, fileName)
    : [];

  // Validate required fields
  const required = ['id', 'title', 'moduleId', 'difficulty'];
  for (const field of required) {
    if (!frontmatter[field]) {
      throw new Error(`Missing required frontmatter field '${field}'`);
    }
  }

  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (!validDifficulties.includes(frontmatter.difficulty)) {
    throw new Error(`Invalid difficulty '${frontmatter.difficulty}' (must be ${validDifficulties.join(', ')})`);
  }

  if (!content) {
    throw new Error(`Lesson content body is empty`);
  }

  const objectives = ensureArray(frontmatter.learningObjectives);
  if (objectives.length === 0) {
    console.warn(`  ! ${fileName}: Warning - no learningObjectives defined`);
  }

  return {
    id: frontmatter.id,
    title: frontmatter.title,
    moduleId: frontmatter.moduleId,
    prerequisites: ensureArray(frontmatter.prerequisites),
    estimatedTimeMinutes: frontmatter.estimatedTimeMinutes || 30,
    difficulty: frontmatter.difficulty,
    learningObjectives: objectives,
    keywords: ensureArray(frontmatter.keywords),
    content,
    challenges,
  };
}

function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (val === undefined || val === null || val === '') return [];
  return [val];
}

// ---------------------------------------------------------------------------
// Challenge Section Parser
// ---------------------------------------------------------------------------

function parseChallenges(raw, fileName) {
  // Split on "### Challenge:" headers
  const challengeBlocks = raw.split(/(?=^### Challenge:)/m).filter(b => b.trim());

  return challengeBlocks.map((block, i) => {
    const titleMatch = block.match(/^### Challenge:\s*(.+)/m);
    if (!titleMatch) {
      throw new Error(`Challenge block ${i + 1} is missing a '### Challenge: <title>' header`);
    }
    const title = titleMatch[1].trim();

    // Extract metadata lines (- key: value)
    const id = extractMeta(block, 'id');
    const language = extractMeta(block, 'language') || 'python';
    const difficulty = extractMeta(block, 'difficulty') || 'beginner';

    // Extract structured sections
    const starterCode = extractCodeBlock(block, 'Starter Code');
    const expectedOutput = extractTextBlock(block, 'Expected Output');
    const hints = extractNumberedList(block, 'Hints');
    const solution = extractCodeBlock(block, 'Solution');

    if (!id) {
      throw new Error(`Challenge "${title}" is missing '- id: ...'`);
    }
    if (starterCode === null) {
      throw new Error(`Challenge "${title}" is missing a #### Starter Code section with a code block`);
    }
    if (expectedOutput === null) {
      throw new Error(`Challenge "${title}" is missing a #### Expected Output section`);
    }
    if (solution === null) {
      throw new Error(`Challenge "${title}" is missing a #### Solution section with a code block`);
    }

    const validLanguages = ['python', 'r'];
    if (!validLanguages.includes(language)) {
      throw new Error(`Challenge "${title}" has invalid language '${language}' (must be ${validLanguages.join(', ')})`);
    }

    return { id, title, language, difficulty, starterCode, expectedOutput, hints, solution };
  });
}

function extractMeta(block, key) {
  const match = block.match(new RegExp(`^-\\s*${key}:\\s*(.+)`, 'm'));
  return match ? match[1].trim() : null;
}

function extractCodeBlock(text, sectionName) {
  // Match #### <sectionName> then find the next fenced code block
  const pattern = new RegExp(
    `####\\s*${escapeRegex(sectionName)}[^\\n]*\\n[\\s\\S]*?\`\`\`[\\w]*\\n([\\s\\S]*?)\`\`\``
  );
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function extractTextBlock(text, sectionName) {
  // Match #### <sectionName> then capture everything until the next #### or end
  const pattern = new RegExp(
    `####\\s*${escapeRegex(sectionName)}[^\\n]*\\n([\\s\\S]*?)(?=####|$)`
  );
  const match = text.match(pattern);
  if (!match) return null;

  const content = match[1].trim();

  // If wrapped in a code block, extract inner content
  const codeMatch = content.match(/```\w*\n([\s\S]*?)```/);
  if (codeMatch) return codeMatch[1].trimEnd();

  // Otherwise return as plain text
  return content;
}

function extractNumberedList(text, sectionName) {
  const pattern = new RegExp(
    `####\\s*${escapeRegex(sectionName)}[^\\n]*\\n([\\s\\S]*?)(?=####|$)`
  );
  const match = text.match(pattern);
  if (!match) return [];

  const items = [];
  for (const line of match[1].split('\n')) {
    // Numbered list: "1. hint text"
    const numMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (numMatch) {
      items.push(numMatch[1].trim());
      continue;
    }
    // Bullet list: "- hint text"
    const bulletMatch = line.match(/^\s*-\s+(.+)/);
    if (bulletMatch) {
      items.push(bulletMatch[1].trim());
    }
  }
  return items;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// TypeScript Code Generator
// ---------------------------------------------------------------------------

function escapeTemplateLiteral(s) {
  // Escape backslashes, backticks, and ${ sequences for JS template literals
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function escapeStringLiteral(s) {
  // Escape for single-quoted JS strings (newlines become \n)
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function generateLessonTS(lesson) {
  const i = '  ';   // object indent (inside the array)
  const ii = '    '; // field indent
  const iii = '      '; // nested indent

  let ts = '';
  ts += `${i}{\n`;
  ts += `${ii}id: '${escapeStringLiteral(lesson.id)}',\n`;
  ts += `${ii}title: '${escapeStringLiteral(lesson.title)}',\n`;
  ts += `${ii}moduleId: '${escapeStringLiteral(lesson.moduleId)}',\n`;
  ts += `${ii}prerequisites: [${lesson.prerequisites.map(p => `'${escapeStringLiteral(p)}'`).join(', ')}],\n`;
  ts += `${ii}estimatedTimeMinutes: ${lesson.estimatedTimeMinutes},\n`;
  ts += `${ii}difficulty: '${lesson.difficulty}',\n`;

  // learningObjectives
  ts += `${ii}learningObjectives: [\n`;
  for (const obj of lesson.learningObjectives) {
    ts += `${iii}'${escapeStringLiteral(obj)}',\n`;
  }
  ts += `${ii}],\n`;

  // keywords
  ts += `${ii}keywords: [${lesson.keywords.map(k => `'${escapeStringLiteral(k)}'`).join(', ')}],\n`;

  // content (template literal for multi-line)
  ts += `${ii}content: \`${escapeTemplateLiteral(lesson.content)}\`,\n`;

  // challenges
  ts += `${ii}challenges: [\n`;
  for (const ch of lesson.challenges) {
    ts += `${iii}{\n`;
    ts += `${iii}  id: '${escapeStringLiteral(ch.id)}',\n`;
    ts += `${iii}  title: '${escapeStringLiteral(ch.title)}',\n`;
    ts += `${iii}  language: '${ch.language}',\n`;
    ts += `${iii}  difficulty: '${ch.difficulty}',\n`;
    ts += `${iii}  starterCode: \`${escapeTemplateLiteral(ch.starterCode)}\`,\n`;
    ts += `${iii}  expectedOutput: '${escapeStringLiteral(ch.expectedOutput)}',\n`;
    ts += `${iii}  hints: [\n`;
    for (const hint of ch.hints) {
      ts += `${iii}    '${escapeStringLiteral(hint)}',\n`;
    }
    ts += `${iii}  ],\n`;
    ts += `${iii}  solution: \`${escapeTemplateLiteral(ch.solution)}\`,\n`;
    ts += `${iii}},\n`;
  }
  ts += `${ii}],\n`;

  ts += `${i}},`;
  return ts;
}

// ---------------------------------------------------------------------------
// Existing lessons.ts Integration
// ---------------------------------------------------------------------------

function readExistingLessonIds() {
  if (!existsSync(LESSONS_TS)) return [];
  const content = readFileSync(LESSONS_TS, 'utf-8');
  return [...content.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(m => m[1]);
}

function appendToLessonsTS(generatedBlocks) {
  const existing = readFileSync(LESSONS_TS, 'utf-8');

  // Find the last ]; that closes the lessons array
  const insertPoint = existing.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error('Could not find closing ]; of the lessons array in lessons.ts');
  }

  const before = existing.slice(0, insertPoint);
  const after = existing.slice(insertPoint);
  const date = new Date().toISOString().split('T')[0];
  const separator = `  // --- Compiled from lessons-in-development (${date}) ---\n`;

  return before + separator + generatedBlocks.join('\n') + '\n' + after;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const writeMode = args.includes('--write');
  const validateOnly = args.includes('--validate');
  const outIndex = args.indexOf('--out');
  const outFile = outIndex !== -1 ? args[outIndex + 1] : null;

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
compile-lessons - Compile lesson markdown files into lessons.ts

Usage:
  node scripts/compile-lessons.mjs                  Preview generated TypeScript
  node scripts/compile-lessons.mjs --write          Append to src/data/lessons.ts
  node scripts/compile-lessons.mjs --out FILE       Write to a separate file
  node scripts/compile-lessons.mjs --validate       Validate files only (no output)

Options:
  --write       Append compiled lessons to src/data/lessons.ts
  --out FILE    Write compiled TypeScript to FILE instead of lessons.ts
  --validate    Parse and validate all files, report errors, produce no output
  --help, -h    Show this help message

Lesson files:
  Place .md files in lessons-in-development/
  See lessons-in-development/_template.md for the expected format.
`);
    process.exit(0);
  }

  if (!existsSync(LESSONS_DIR)) {
    console.error(`Error: ${LESSONS_DIR} does not exist.`);
    console.error('Create it and add lesson markdown files.');
    process.exit(1);
  }

  // Discover lesson files (skip _ prefixed files and README)
  const files = readdirSync(LESSONS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
    .sort();

  if (files.length === 0) {
    console.log('No lesson files found in lessons-in-development/');
    console.log('Create .md files following the template in _template.md');
    process.exit(0);
  }

  console.log(`Found ${files.length} lesson file(s):\n`);

  const parsedLessons = [];
  const errors = [];

  for (const file of files) {
    try {
      const lesson = parseLessonFile(join(LESSONS_DIR, file));
      parsedLessons.push(lesson);
      console.log(`  [ok]   ${file}  ->  ${lesson.id}  (${lesson.challenges.length} challenge(s))`);
    } catch (err) {
      errors.push({ file, message: err.message });
      console.error(`  [ERR]  ${file}:  ${err.message}`);
    }
  }

  console.log('');

  if (errors.length > 0) {
    console.error(`${errors.length} file(s) had errors. Fix them before compiling.`);
    process.exit(1);
  }

  // Check for duplicate IDs among the new lessons themselves
  const newIds = parsedLessons.map(l => l.id);
  const seen = new Set();
  const selfDupes = newIds.filter(id => {
    if (seen.has(id)) return true;
    seen.add(id);
    return false;
  });
  if (selfDupes.length > 0) {
    console.error('Duplicate IDs found among lesson files:');
    selfDupes.forEach(id => console.error(`  - ${id}`));
    process.exit(1);
  }

  // Check for duplicates against existing lessons.ts
  const existingIds = readExistingLessonIds();
  const conflictIds = newIds.filter(id => existingIds.includes(id));
  if (conflictIds.length > 0) {
    console.error('These lesson IDs already exist in lessons.ts:');
    conflictIds.forEach(id => console.error(`  - ${id}`));
    console.error('Remove duplicates or use different IDs.');
    process.exit(1);
  }

  if (validateOnly) {
    console.log(`All ${parsedLessons.length} lesson file(s) are valid.`);
    process.exit(0);
  }

  // Generate TypeScript
  const tsBlocks = parsedLessons.map(generateLessonTS);

  if (writeMode) {
    const updated = appendToLessonsTS(tsBlocks);
    writeFileSync(LESSONS_TS, updated, 'utf-8');
    console.log(`Appended ${parsedLessons.length} lesson(s) to src/data/lessons.ts`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Add lesson IDs to the parent module\'s lessons array in src/data/modules.ts');
    console.log('  2. Update module estimatedHours if needed');
    console.log('  3. Run: npm test');
    console.log('  4. Preview lessons in the browser');
  } else if (outFile) {
    const header = [
      `// Generated by compile-lessons on ${new Date().toISOString().split('T')[0]}`,
      '// Copy these entries into the lessons array in src/data/lessons.ts',
      '',
      '',
    ].join('\n');
    writeFileSync(outFile, header + tsBlocks.join('\n') + '\n', 'utf-8');
    console.log(`Wrote ${parsedLessons.length} lesson(s) to ${outFile}`);
  } else {
    console.log('--- Generated TypeScript (preview) ---\n');
    console.log(tsBlocks.join('\n'));
    console.log('\n--- End preview ---');
    console.log('');
    console.log('To append to lessons.ts:   node scripts/compile-lessons.mjs --write');
    console.log('To write to a file:        node scripts/compile-lessons.mjs --out compiled.ts');
  }
}

main();
