import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '../types/index.ts';

interface NoteState {
  notes: Record<string, Note>;
  createNote: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesByLesson: (lessonId: string) => Note[];
  getNotesByModule: (moduleId: string) => Note[];
  getNotesByType: (type: Note['type']) => Note[];
  getNotesByTag: (tag: string) => Note[];
  getAllNotes: () => Note[];
  searchNotes: (query: string) => Note[];
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: {},

      createNote: (data) => {
        const id = uuidv4();
        const now = new Date();
        set((state) => ({
          notes: {
            ...state.notes,
            [id]: {
              ...data,
              id,
              createdAt: now,
              updatedAt: now,
            },
          },
        }));
        return id;
      },

      updateNote: (id, data) =>
        set((state) => {
          const existing = state.notes[id];
          if (!existing) return state;
          return {
            notes: {
              ...state.notes,
              [id]: { ...existing, ...data, updatedAt: new Date() },
            },
          };
        }),

      deleteNote: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.notes;
          return { notes: rest };
        }),

      getNoteById: (id) => get().notes[id],

      getNotesByLesson: (lessonId) =>
        Object.values(get().notes).filter((n) => n.lessonId === lessonId),

      getNotesByModule: (moduleId) =>
        Object.values(get().notes).filter((n) => n.moduleId === moduleId),

      getNotesByType: (type) =>
        Object.values(get().notes).filter((n) => n.type === type),

      getNotesByTag: (tag) =>
        Object.values(get().notes).filter((n) => n.tags.includes(tag)),

      getAllNotes: () =>
        Object.values(get().notes).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),

      searchNotes: (query) => {
        const lower = query.toLowerCase();
        return Object.values(get().notes).filter(
          (n) =>
            n.title.toLowerCase().includes(lower) ||
            n.content.toLowerCase().includes(lower) ||
            n.tags.some((t) => t.toLowerCase().includes(lower))
        );
      },
    }),
    {
      name: 'dh-tutorial-notes',
    }
  )
);
