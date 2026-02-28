/// <reference types="vite/client" />

declare module '*.md' {
  import type { LessonDefinition } from './types'
  const lesson: LessonDefinition
  export default lesson
}
