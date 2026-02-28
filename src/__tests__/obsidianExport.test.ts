import {
  generateLessonMarkdown,
  generateNoteMarkdown,
  generateIndexMarkdown,
  exportToZip,
} from '../utils/obsidianExport.ts';
import type {
  LessonDefinition,
  ModuleDefinition,
  Note,
  ExportSettings,
} from '../types/index.ts';
import JSZip from 'jszip';

const mockModule: ModuleDefinition = {
  id: 'test-module',
  title: 'Test Module',
  description: 'A test module',
  estimatedHours: 1,
  prerequisites: [],
  lessons: ['test-lesson-1'],
  track: 'dh-methods',
  disciplines: [],
  keywords: ['test'],
};

const mockLesson: LessonDefinition = {
  id: 'test-lesson-1',
  title: 'Test Lesson',
  moduleId: 'test-module',
  prerequisites: [],
  estimatedTimeMinutes: 10,
  difficulty: 'beginner',
  learningObjectives: ['Learn testing', 'Write tests'],
  keywords: ['testing', 'jest'],
  content: '# Test Content\n\nThis is test content.',
  challenges: [
    {
      id: 'challenge-1',
      title: 'Test Challenge',
      language: 'python',
      difficulty: 'beginner',
      starterCode: 'print("hello")',
      expectedOutput: 'hello',
      hints: ['Try print()'],
      solution: 'print("hello")',
    },
  ],
};

const mockNote: Note = {
  id: 'note-1',
  type: 'lesson_note',
  title: 'My Test Note',
  content: 'Some notes about testing.',
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-16'),
  tags: ['testing', 'notes'],
  linkedLessons: ['test-lesson-1'],
  lessonId: 'test-lesson-1',
  codeSnippet: {
    language: 'python',
    code: 'print("test")',
    description: 'A test snippet',
  },
};

const defaultSettings: ExportSettings = {
  includeLessonContent: true,
  includeUserNotes: true,
  includeCodeSnippets: true,
  includeProgressData: false,
  linkFormat: 'wikilink',
  flattenStructure: false,
  includeMedia: true,
  codeFileExtension: '.py',
};

describe('generateLessonMarkdown', () => {
  it('includes frontmatter with lesson metadata', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('---');
    expect(md).toContain('title: "Test Lesson"');
    expect(md).toContain('module: "Test Module"');
  });

  it('includes learning objectives', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('## Learning Objectives');
    expect(md).toContain('Learn testing');
    expect(md).toContain('Write tests');
  });

  it('includes lesson content when setting is enabled', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('# Test Content');
    expect(md).toContain('This is test content.');
  });

  it('excludes lesson content when setting is disabled', () => {
    const settings = { ...defaultSettings, includeLessonContent: false };
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, settings);
    expect(md).not.toContain('This is test content.');
  });

  it('includes code challenges when enabled', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('## Code Challenges');
    expect(md).toContain('print("hello")');
  });

  it('uses wikilink format', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('[[');
  });

  it('uses markdown link format', () => {
    const settings = { ...defaultSettings, linkFormat: 'markdown' as const };
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, settings);
    expect(md).toContain('](');
  });

  it('includes related module link', () => {
    const md = generateLessonMarkdown(mockLesson, mockModule, undefined, defaultSettings);
    expect(md).toContain('Test Module');
  });
});

describe('generateNoteMarkdown', () => {
  it('includes note frontmatter', () => {
    const md = generateNoteMarkdown(mockNote, defaultSettings);
    expect(md).toContain('title: "My Test Note"');
    expect(md).toContain('type: "lesson_note"');
  });

  it('includes note content', () => {
    const md = generateNoteMarkdown(mockNote, defaultSettings);
    expect(md).toContain('Some notes about testing.');
  });

  it('includes code snippet when present', () => {
    const md = generateNoteMarkdown(mockNote, defaultSettings);
    expect(md).toContain('## Code Snippet');
    expect(md).toContain('print("test")');
  });

  it('includes related lessons', () => {
    const md = generateNoteMarkdown(mockNote, defaultSettings);
    expect(md).toContain('## Related Lessons');
    expect(md).toContain('test-lesson-1');
  });

  it('omits code snippet when setting disabled', () => {
    const settings = { ...defaultSettings, includeCodeSnippets: false };
    const md = generateNoteMarkdown(mockNote, settings);
    expect(md).not.toContain('## Code Snippet');
  });
});

describe('generateIndexMarkdown', () => {
  it('includes title', () => {
    const md = generateIndexMarkdown([mockModule], defaultSettings);
    expect(md).toContain('# DHPrimer: Tutorial Lab - Export Index');
  });

  it('lists modules', () => {
    const md = generateIndexMarkdown([mockModule], defaultSettings);
    expect(md).toContain('Test Module');
    expect(md).toContain('A test module');
  });
});

describe('exportToZip', () => {
  it('creates a valid zip blob', async () => {
    const blob = await exportToZip(
      [mockModule],
      [mockLesson],
      [mockNote],
      {},
      defaultSettings
    );
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('contains expected folders and files', async () => {
    const blob = await exportToZip(
      [mockModule],
      [mockLesson],
      [mockNote],
      {},
      defaultSettings
    );
    const zip = await JSZip.loadAsync(blob);
    const files = Object.keys(zip.files);

    expect(files.some((f) => f.startsWith('00-Index.md'))).toBe(true);
    expect(files.some((f) => f.startsWith('01-Modules/'))).toBe(true);
    expect(files.some((f) => f.startsWith('02-Lessons/'))).toBe(true);
    expect(files.some((f) => f.startsWith('03-Notes/'))).toBe(true);
    expect(files.some((f) => f.startsWith('04-Code-Snippets/'))).toBe(true);
    expect(files.some((f) => f.startsWith('06-Templates/'))).toBe(true);
  });

  it('excludes notes when setting disabled', async () => {
    const blob = await exportToZip(
      [mockModule],
      [mockLesson],
      [mockNote],
      {},
      { ...defaultSettings, includeUserNotes: false }
    );
    const zip = await JSZip.loadAsync(blob);
    const files = Object.keys(zip.files);
    const noteFiles = files.filter((f) => f.startsWith('03-Notes/') && !f.endsWith('/'));
    expect(noteFiles).toHaveLength(0);
  });

  it('includes code snippet files', async () => {
    const blob = await exportToZip(
      [mockModule],
      [mockLesson],
      [mockNote],
      {},
      defaultSettings
    );
    const zip = await JSZip.loadAsync(blob);
    const files = Object.keys(zip.files);
    const snippetFiles = files.filter(
      (f) => f.startsWith('04-Code-Snippets/') && f.endsWith('.py')
    );
    expect(snippetFiles.length).toBeGreaterThan(0);
  });
});
