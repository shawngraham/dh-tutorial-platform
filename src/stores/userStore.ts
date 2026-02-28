import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { UserProfile, Pathway } from '../types/index.ts';

interface UserState {
  profile: UserProfile | null;
  createProfile: (data: Partial<UserProfile>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  setPathway: (pathway: Pathway) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,

      createProfile: (data) =>
        set({
          profile: {
            id: uuidv4(),
            createdAt: new Date(),
            background: {
              discipline: '',
              role: '',
              programmingExperience: 'none',
              researchInterests: [],
            },
            preferences: {
              preferredLanguage: 'python',
              lessonDuration: 30,
              dailyGoalMinutes: 30,
            },
            currentPathway: {
              pathwayId: '',
              modules: [],
              customizations: [],
            },
            learningGoals: [],
            onboardingCompleted: false,
            ...data,
          } as UserProfile,
        }),

      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      setPathway: (pathway) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                currentPathway: {
                  pathwayId: pathway.id,
                  modules: pathway.modules,
                  customizations: [],
                },
                preferences: {
                  ...state.profile.preferences,
                  preferredLanguage: pathway.recommendedLanguage,
                },
              }
            : null,
        })),

      completeOnboarding: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, onboardingCompleted: true }
            : null,
        })),

      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'dh-tutorial-user',
    }
  )
);
