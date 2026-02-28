// Lessons are now individual markdown files in src/data/lessons/*.md
// The lessonMarkdownPlugin in vite.config.ts transforms them at build time.
// Add or edit lessons by creating/modifying .md files in that directory.
export { lessons, getLessonById, getLessonsByModule } from './lessons-loader';
