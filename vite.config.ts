/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import matter from 'gray-matter'
import type { Plugin } from 'vite'

// ---------------------------------------------------------------------------
// Helpers (ported from scripts/compile-lessons.mjs)
// ---------------------------------------------------------------------------

function ensureArray(val: unknown): string[] {
  if (Array.isArray(val)) return (val as unknown[]).map(String)
  if (val == null || val === '') return []
  return [String(val)]
}

function extractMeta(block: string, key: string): string | null {
  const match = block.match(new RegExp(`^-\\s*${key}:\\s*(.+)`, 'm'))
  return match ? match[1].trim() : null
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractCodeBlock(text: string, section: string): string | null {
  const pat = new RegExp(
    `####\\s*${escapeRe(section)}[^\\n]*\\n[\\s\\S]*?\`\`\`[\\w]*\\n([\\s\\S]*?)\`\`\``
  )
  const m = text.match(pat)
  return m ? m[1] : null
}

function extractTextBlock(text: string, section: string): string | null {
  const pat = new RegExp(
    `####\\s*${escapeRe(section)}[^\\n]*\\n([\\s\\S]*?)(?=####|$)`
  )
  const m = text.match(pat)
  if (!m) return null
  const body = m[1].trim()
  const code = body.match(/```\w*\n([\s\S]*?)```/)
  return code ? code[1].trimEnd() : body
}

function extractNumberedList(text: string, section: string): string[] {
  const pat = new RegExp(
    `####\\s*${escapeRe(section)}[^\\n]*\\n([\\s\\S]*?)(?=####|$)`
  )
  const m = text.match(pat)
  if (!m) return []
  const items: string[] = []
  for (const line of m[1].split('\n')) {
    const num = line.match(/^\s*\d+\.\s+(.+)/)
    if (num) { items.push(num[1].trim()); continue }
    const bul = line.match(/^\s*-\s+(.+)/)
    if (bul) items.push(bul[1].trim())
  }
  return items
}

function parseChallenges(raw: string) {
  const blocks = raw.split(/(?=^### Challenge:)/m).filter(b => b.trim())
  return blocks.map(block => {
    const titleMatch = block.match(/^### Challenge:\s*(.+)/m)
    if (!titleMatch) throw new Error('Challenge block missing ### Challenge: header')
    const title = titleMatch[1].trim()
    const id = extractMeta(block, 'id')
    if (!id) throw new Error(`Challenge "${title}" missing id`)
    return {
      id,
      title,
      language: extractMeta(block, 'language') ?? 'python',
      difficulty: extractMeta(block, 'difficulty') ?? 'beginner',
      starterCode: extractCodeBlock(block, 'Starter Code') ?? '',
      expectedOutput: extractTextBlock(block, 'Expected Output') ?? '',
      hints: extractNumberedList(block, 'Hints'),
      solution: extractCodeBlock(block, 'Solution') ?? '',
    }
  })
}

// ---------------------------------------------------------------------------
// Vite plugin: transforms .md lesson files into JS modules
// ---------------------------------------------------------------------------

function lessonMarkdownPlugin(): Plugin {
  return {
    name: 'lesson-markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return null

      const sepIdx = code.indexOf('---challenges---')
      let mdContent: string
      let challengesRaw: string
      if (sepIdx !== -1) {
        mdContent = code.slice(0, sepIdx).trim()
        challengesRaw = code.slice(sepIdx + '---challenges---'.length).trim()
      } else {
        mdContent = code.trim()
        challengesRaw = ''
      }

      const { data: fm, content } = matter(mdContent)
      const challenges = challengesRaw ? parseChallenges(challengesRaw) : []

      const lesson = {
        id: fm.id,
        title: fm.title,
        moduleId: fm.moduleId,
        prerequisites: ensureArray(fm.prerequisites),
        estimatedTimeMinutes: fm.estimatedTimeMinutes ?? 30,
        difficulty: fm.difficulty,
        learningObjectives: ensureArray(fm.learningObjectives),
        keywords: ensureArray(fm.keywords),
        content: content.trim(),
        challenges,
      }

      return { code: `export default ${JSON.stringify(lesson)};`, map: null }
    },
  }
}

export default defineConfig({
  plugins: [lessonMarkdownPlugin(), react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
  },
})
