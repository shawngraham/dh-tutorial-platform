export interface UserProfile {
  id: string;
  createdAt: Date;

  background: {
    discipline: string;
    role: string;
    programmingExperience: 'none' | 'beginner' | 'intermediate';
    researchInterests: string[];
  };

  preferences: {
    preferredLanguage: 'python' | 'r';
    lessonDuration: 5 | 5 | 5;
    dailyGoalMinutes: number;
  };

  currentPathway: {
    pathwayId: string;
    modules: string[];
    customizations: string[];
  };

  learningGoals: string[];
  onboardingCompleted: boolean;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  prerequisites: string[];
  lessons: string[];
  track: 'foundations' | 'textual-scholarship' | 'creative-critical' | 'data-issues' | 'spatial-relational' | 'orientation';
  disciplines: string[];
  keywords: string[];
}

export interface LessonDefinition {
  id: string;
  title: string;
  moduleId: string;
  prerequisites: string[];
  estimatedTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];
  keywords: string[];
  content: string;
  challenges: ChallengeDefinition[];
}

export interface ChallengeDefinition {
  id: string;
  title: string;
  language: 'python' | 'r';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  solution: string;
}

export interface LessonProgress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  timeSpentMinutes: number;
  challenges: ChallengeProgress[];
  codeSnapshots: CodeSnapshot[];
}

export interface ChallengeProgress {
  challengeId: string;
  attempts: number;
  solved: boolean;
  hintsUsed: number;
}

export interface CodeSnapshot {
  timestamp: Date;
  code: string;
  language: string;
}

export interface Note {
  id: string;
  type: 'lesson_note' | 'personal_note' | 'code_snippet' | 'reflection';
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  linkedLessons: string[];
  lessonId?: string;
  moduleId?: string;
  codeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
}

export interface ExportSettings {
  includeLessonContent: boolean;
  includeUserNotes: boolean;
  includeCodeSnippets: boolean;
  includeProgressData: boolean;
  linkFormat: 'wikilink' | 'markdown';
  flattenStructure: boolean;
  includeMedia: boolean;
  codeFileExtension: '.py' | '.R';
}

export interface Pathway {
  id: string;
  modules: string[];
  estimatedHours: number;
  recommendedLanguage: 'python' | 'r';
}
