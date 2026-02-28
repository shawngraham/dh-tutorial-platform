import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress, ChallengeProgress } from '../types/index.ts';

interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  updateChallengeProgress: (lessonId: string, challenge: ChallengeProgress) => void;
  addCodeSnapshot: (lessonId: string, code: string, language: string) => void;
  addTimeSpent: (lessonId: string, minutes: number) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getCompletedLessons: () => string[];
  getSuccessRate: () => number;
  resetProgress: () => void;
}

function createDefaultProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    status: 'not_started',
    timeSpentMinutes: 0,
    challenges: [],
    codeSnapshots: [],
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},

      startLesson: (lessonId) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || createDefaultProgress(lessonId);
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...existing,
                status: 'in_progress',
                startedAt: existing.startedAt || new Date(),
              },
            },
          };
        }),

      completeLesson: (lessonId) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || createDefaultProgress(lessonId);
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...existing,
                status: 'completed',
                completedAt: new Date(),
              },
            },
          };
        }),

      updateChallengeProgress: (lessonId, challenge) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || createDefaultProgress(lessonId);
          const challenges = existing.challenges.filter(
            (c) => c.challengeId !== challenge.challengeId
          );
          challenges.push(challenge);
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: { ...existing, challenges },
            },
          };
        }),

      addCodeSnapshot: (lessonId, code, language) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || createDefaultProgress(lessonId);
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...existing,
                codeSnapshots: [
                  ...existing.codeSnapshots,
                  { timestamp: new Date(), code, language },
                ],
              },
            },
          };
        }),

      addTimeSpent: (lessonId, minutes) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || createDefaultProgress(lessonId);
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...existing,
                timeSpentMinutes: existing.timeSpentMinutes + minutes,
              },
            },
          };
        }),

      getLessonProgress: (lessonId) => get().lessonProgress[lessonId],

      getCompletedLessons: () =>
        Object.entries(get().lessonProgress)
          .filter(([_, p]) => p.status === 'completed')
          .map(([id]) => id),

      getSuccessRate: () => {
        const allChallenges = Object.values(get().lessonProgress).flatMap(
          (p) => p.challenges
        );
        if (allChallenges.length === 0) return 0;
        const solved = allChallenges.filter((c) => c.solved).length;
        return (solved / allChallenges.length) * 100;
      },

      resetProgress: () => set({ lessonProgress: {} }),
    }),
    {
      name: 'dh-tutorial-progress',
    }
  )
);
