import type { LessonDefinition } from '../types/index.ts';

// Vite resolves this glob at build time. Each .md file is transformed by the
// lessonMarkdownPlugin in vite.config.ts, which parses frontmatter, content,
// and the ---challenges--- section into a typed LessonDefinition object.
const modules = import.meta.glob<{ default: LessonDefinition }>(
  './lessons/*.md',
  { eager: true }
);

export const lessons: LessonDefinition[] = Object.values(modules)
  .map(m => m.default)
  .sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
    return a.id.localeCompare(b.id);
  });

export function getLessonById(id: string): LessonDefinition | undefined {
  return lessons.find(l => l.id === id);
}

export function getLessonsByModule(moduleId: string): LessonDefinition[] {
  return lessons.filter(l => l.moduleId === moduleId);
}
