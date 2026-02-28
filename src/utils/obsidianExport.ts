import JSZip from 'jszip';
import type {
  Note,
  LessonDefinition,
  ModuleDefinition,
  LessonProgress,
  ExportSettings,
} from '../types/index.ts';

const DEFAULT_SETTINGS: ExportSettings = {
  includeLessonContent: true,
  includeUserNotes: true,
  includeCodeSnippets: true,
  includeProgressData: false,
  linkFormat: 'wikilink',
  flattenStructure: false,
  includeMedia: true,
  codeFileExtension: '.py',
};

function makeLink(text: string, format: 'wikilink' | 'markdown'): string {
  const slug = text.replace(/\s+/g, '-');
  return format === 'wikilink' ? `[[${text}]]` : `[${text}](${slug}.md)`;
}

function generateFrontmatter(data: Record<string, unknown>): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${item}`);
      }
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

export function generateLessonMarkdown(
  lesson: LessonDefinition,
  moduleDef: ModuleDefinition | undefined,
  progress: LessonProgress | undefined,
  settings: ExportSettings
): string {
  const frontmatter = generateFrontmatter({
    title: lesson.title,
    date: new Date().toISOString().split('T')[0],
    module: moduleDef?.title || lesson.moduleId,
    lesson_number: lesson.id,
    tags: lesson.keywords,
    status: progress?.status || 'not_started',
  });

  const lines = [frontmatter, '', `# ${lesson.title}`, ''];

  lines.push('## Learning Objectives');
  for (const obj of lesson.learningObjectives) {
    lines.push(`- ${makeLink(obj, settings.linkFormat)}`);
  }
  lines.push('');

  if (settings.includeLessonContent) {
    lines.push(lesson.content);
    lines.push('');
  }

  if (settings.includeCodeSnippets && lesson.challenges.length > 0) {
    lines.push('## Code Challenges');
    for (const challenge of lesson.challenges) {
      lines.push(`### ${challenge.title}`);
      lines.push(`\`\`\`${challenge.language}`);
      lines.push(challenge.solution);
      lines.push('```');
      lines.push('');
    }
  }

  if (moduleDef) {
    lines.push('## Related');
    lines.push(`- Module: ${makeLink(moduleDef.title, settings.linkFormat)}`);
  }

  return lines.join('\n');
}

export function generateNoteMarkdown(note: Note, settings: ExportSettings): string {
  const frontmatter = generateFrontmatter({
    title: note.title,
    date: new Date(note.createdAt).toISOString().split('T')[0],
    type: note.type,
    tags: note.tags,
  });

  const lines = [frontmatter, '', `# ${note.title}`, '', note.content];

  if (note.codeSnippet && settings.includeCodeSnippets) {
    lines.push('', '## Code Snippet');
    lines.push(`\`\`\`${note.codeSnippet.language}`);
    lines.push(note.codeSnippet.code);
    lines.push('```');
    if (note.codeSnippet.description) {
      lines.push('', note.codeSnippet.description);
    }
  }

  if (note.linkedLessons.length > 0) {
    lines.push('', '## Related Lessons');
    for (const lessonId of note.linkedLessons) {
      lines.push(`- ${makeLink(lessonId, settings.linkFormat)}`);
    }
  }

  return lines.join('\n');
}

export function generateIndexMarkdown(
  modules: ModuleDefinition[],
  settings: ExportSettings
): string {
  const lines = [
    '# DHPrimer: Tutorial Lab - Export Index',
    '',
    `Exported on: ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Modules',
  ];

  for (const mod of modules) {
    lines.push(`- ${makeLink(mod.title, settings.linkFormat)}: ${mod.description}`);
  }

  lines.push('', '## Quick Links');
  lines.push(`- ${makeLink('Notes', settings.linkFormat)}`);
  lines.push(`- ${makeLink('Code Snippets', settings.linkFormat)}`);

  return lines.join('\n');
}

export async function exportToZip(
  modules: ModuleDefinition[],
  lessons: LessonDefinition[],
  notes: Note[],
  progress: Record<string, LessonProgress>,
  settings: Partial<ExportSettings> = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_SETTINGS, ...settings };
  const zip = new JSZip();

  // Create index
  zip.file('00-Index.md', generateIndexMarkdown(modules, opts));

  // Create module files
  const modulesFolder = zip.folder('01-Modules');
  if (modulesFolder) {
    for (const mod of modules) {
      const slug = mod.title.replace(/\s+/g, '-');
      const content = [
        generateFrontmatter({
          title: mod.title,
          estimated_hours: mod.estimatedHours,
          track: mod.track,
          tags: mod.keywords,
        }),
        '',
        `# ${mod.title}`,
        '',
        mod.description,
        '',
        '## Lessons',
        ...mod.lessons.map((lessonId) => {
          const lesson = lessons.find((l) => l.id === lessonId);
          return `- ${lesson ? makeLink(lesson.title, opts.linkFormat) : lessonId}`;
        }),
      ].join('\n');
      modulesFolder.file(`${slug}.md`, content);
    }
  }

  // Create lesson files
  if (opts.includeLessonContent) {
    const lessonsFolder = zip.folder('02-Lessons');
    if (lessonsFolder) {
      for (const lesson of lessons) {
        const mod = modules.find((m) => m.id === lesson.moduleId);
        const moduleSlug = mod ? mod.title.replace(/\s+/g, '-') : 'Other';
        const lessonSlug = lesson.title.replace(/\s+/g, '-');
        const content = generateLessonMarkdown(
          lesson,
          mod,
          progress[lesson.id],
          opts
        );
        lessonsFolder.file(`${moduleSlug}/${lessonSlug}.md`, content);
      }
    }
  }

  // Create note files
  if (opts.includeUserNotes) {
    const notesFolder = zip.folder('03-Notes');
    if (notesFolder) {
      for (const note of notes) {
        const slug = note.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        notesFolder.file(`${slug}.md`, generateNoteMarkdown(note, opts));
      }
    }
  }

  // Create code snippet files
  if (opts.includeCodeSnippets) {
    const snippetsFolder = zip.folder('04-Code-Snippets');
    if (snippetsFolder) {
      for (const note of notes) {
        if (note.codeSnippet) {
          const slug = note.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
          snippetsFolder.file(
            `${slug}${opts.codeFileExtension}`,
            `# ${note.title}\n# ${note.codeSnippet.description}\n\n${note.codeSnippet.code}`
          );
        }
      }
    }
  }

  // Create templates
  const templatesFolder = zip.folder('06-Templates');
  if (templatesFolder) {
    templatesFolder.file(
      'lesson-note-template.md',
      [
        '---',
        'title: ""',
        'date: {{date}}',
        'module: ""',
        'tags: []',
        '---',
        '',
        '# {{title}}',
        '',
        '## Key Concepts',
        '',
        '## My Notes',
        '',
        '## Questions',
        '',
        '## Code Examples',
        '',
      ].join('\n')
    );
    templatesFolder.file(
      'code-snippet-template.md',
      [
        '---',
        'title: ""',
        'language: python',
        'tags: []',
        '---',
        '',
        '# {{title}}',
        '',
        '## Description',
        '',
        '## Code',
        '```python',
        '',
        '```',
        '',
        '## Notes',
        '',
      ].join('\n')
    );
  }

  return zip.generateAsync({ type: 'blob' });
}
