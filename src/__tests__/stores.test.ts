import { useUserStore } from '../stores/userStore.ts';
import { useProgressStore } from '../stores/progressStore.ts';
import { useNoteStore } from '../stores/noteStore.ts';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.getState().resetProfile();
  });

  it('starts with null profile', () => {
    expect(useUserStore.getState().profile).toBeNull();
  });

  it('creates a profile with defaults', () => {
    useUserStore.getState().createProfile({});
    const profile = useUserStore.getState().profile;
    expect(profile).not.toBeNull();
    expect(profile!.id).toBeTruthy();
    expect(profile!.background.programmingExperience).toBe('none');
    expect(profile!.preferences.preferredLanguage).toBe('python');
    expect(profile!.onboardingCompleted).toBe(false);
  });

  it('creates a profile with custom data', () => {
    useUserStore.getState().createProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'beginner',
        researchInterests: ['text analysis'],
      },
    });
    const profile = useUserStore.getState().profile;
    expect(profile!.background.discipline).toBe('history');
    expect(profile!.background.programmingExperience).toBe('beginner');
  });

  it('updates profile fields', () => {
    useUserStore.getState().createProfile({});
    useUserStore.getState().updateProfile({
      learningGoals: ['Goal 1', 'Goal 2'],
    });
    expect(useUserStore.getState().profile!.learningGoals).toEqual(['Goal 1', 'Goal 2']);
  });

  it('sets pathway', () => {
    useUserStore.getState().createProfile({});
    useUserStore.getState().setPathway({
      id: 'pathway-1',
      modules: ['mod-1', 'mod-2'],
      estimatedHours: 10,
      recommendedLanguage: 'r',
    });
    const profile = useUserStore.getState().profile!;
    expect(profile.currentPathway.pathwayId).toBe('pathway-1');
    expect(profile.currentPathway.modules).toEqual(['mod-1', 'mod-2']);
    expect(profile.preferences.preferredLanguage).toBe('r');
  });

  it('completes onboarding', () => {
    useUserStore.getState().createProfile({});
    useUserStore.getState().completeOnboarding();
    expect(useUserStore.getState().profile!.onboardingCompleted).toBe(true);
  });

  it('resets profile', () => {
    useUserStore.getState().createProfile({});
    useUserStore.getState().resetProfile();
    expect(useUserStore.getState().profile).toBeNull();
  });
});

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('starts with empty progress', () => {
    expect(useProgressStore.getState().lessonProgress).toEqual({});
  });

  it('starts a lesson', () => {
    useProgressStore.getState().startLesson('lesson-1');
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress).toBeDefined();
    expect(progress.status).toBe('in_progress');
    expect(progress.startedAt).toBeDefined();
  });

  it('completes a lesson', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().completeLesson('lesson-1');
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress.status).toBe('completed');
    expect(progress.completedAt).toBeDefined();
  });

  it('tracks challenge progress', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().updateChallengeProgress('lesson-1', {
      challengeId: 'c1',
      attempts: 2,
      solved: true,
      hintsUsed: 1,
    });
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress.challenges).toHaveLength(1);
    expect(progress.challenges[0].solved).toBe(true);
    expect(progress.challenges[0].attempts).toBe(2);
  });

  it('replaces existing challenge progress', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().updateChallengeProgress('lesson-1', {
      challengeId: 'c1',
      attempts: 1,
      solved: false,
      hintsUsed: 0,
    });
    useProgressStore.getState().updateChallengeProgress('lesson-1', {
      challengeId: 'c1',
      attempts: 2,
      solved: true,
      hintsUsed: 1,
    });
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress.challenges).toHaveLength(1);
    expect(progress.challenges[0].solved).toBe(true);
  });

  it('adds code snapshots', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().addCodeSnapshot('lesson-1', 'print("hi")', 'python');
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress.codeSnapshots).toHaveLength(1);
    expect(progress.codeSnapshots[0].code).toBe('print("hi")');
  });

  it('adds time spent', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().addTimeSpent('lesson-1', 5);
    useProgressStore.getState().addTimeSpent('lesson-1', 10);
    const progress = useProgressStore.getState().lessonProgress['lesson-1'];
    expect(progress.timeSpentMinutes).toBe(15);
  });

  it('gets completed lessons', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().completeLesson('lesson-1');
    useProgressStore.getState().startLesson('lesson-2');
    const completed = useProgressStore.getState().getCompletedLessons();
    expect(completed).toContain('lesson-1');
    expect(completed).not.toContain('lesson-2');
  });

  it('calculates success rate', () => {
    useProgressStore.getState().startLesson('lesson-1');
    useProgressStore.getState().updateChallengeProgress('lesson-1', {
      challengeId: 'c1', attempts: 1, solved: true, hintsUsed: 0,
    });
    useProgressStore.getState().updateChallengeProgress('lesson-1', {
      challengeId: 'c2', attempts: 1, solved: false, hintsUsed: 0,
    });
    expect(useProgressStore.getState().getSuccessRate()).toBe(50);
  });

  it('returns 0 success rate when no challenges', () => {
    expect(useProgressStore.getState().getSuccessRate()).toBe(0);
  });
});

describe('useNoteStore', () => {
  beforeEach(() => {
    // Clear all notes
    const notes = useNoteStore.getState().notes;
    for (const id of Object.keys(notes)) {
      useNoteStore.getState().deleteNote(id);
    }
  });

  it('creates a note and returns an id', () => {
    const id = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Test Note',
      content: 'Hello world',
      tags: ['test'],
      linkedLessons: [],
    });
    expect(id).toBeTruthy();
    const note = useNoteStore.getState().getNoteById(id);
    expect(note).toBeDefined();
    expect(note!.title).toBe('Test Note');
    expect(note!.content).toBe('Hello world');
  });

  it('updates a note', () => {
    const id = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Original',
      content: 'Original content',
      tags: [],
      linkedLessons: [],
    });
    useNoteStore.getState().updateNote(id, { title: 'Updated' });
    expect(useNoteStore.getState().getNoteById(id)!.title).toBe('Updated');
  });

  it('deletes a note', () => {
    const id = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'To Delete',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    useNoteStore.getState().deleteNote(id);
    expect(useNoteStore.getState().getNoteById(id)).toBeUndefined();
  });

  it('filters notes by type', () => {
    useNoteStore.getState().createNote({
      type: 'lesson_note',
      title: 'Lesson Note',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    useNoteStore.getState().createNote({
      type: 'reflection',
      title: 'Reflection',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    const lessonNotes = useNoteStore.getState().getNotesByType('lesson_note');
    expect(lessonNotes).toHaveLength(1);
    expect(lessonNotes[0].title).toBe('Lesson Note');
  });

  it('filters notes by tag', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Tagged Note',
      content: '',
      tags: ['python', 'regex'],
      linkedLessons: [],
    });
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Other Note',
      content: '',
      tags: ['javascript'],
      linkedLessons: [],
    });
    const results = useNoteStore.getState().getNotesByTag('python');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Tagged Note');
  });

  it('searches notes by content', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Regex Notes',
      content: 'Regular expressions are powerful',
      tags: [],
      linkedLessons: [],
    });
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Other',
      content: 'Something else',
      tags: [],
      linkedLessons: [],
    });
    const results = useNoteStore.getState().searchNotes('regular');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Regex Notes');
  });

  it('searches notes by title', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Python Basics',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    const results = useNoteStore.getState().searchNotes('Python');
    expect(results).toHaveLength(1);
  });

  it('gets notes by lesson', () => {
    useNoteStore.getState().createNote({
      type: 'lesson_note',
      title: 'Note for lesson',
      content: '',
      tags: [],
      linkedLessons: ['lesson-1'],
      lessonId: 'lesson-1',
    });
    useNoteStore.getState().createNote({
      type: 'lesson_note',
      title: 'Other lesson note',
      content: '',
      tags: [],
      linkedLessons: ['lesson-2'],
      lessonId: 'lesson-2',
    });
    const results = useNoteStore.getState().getNotesByLesson('lesson-1');
    expect(results).toHaveLength(1);
  });

  it('gets all notes sorted by updatedAt descending', () => {
    const id1 = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'First',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    const id2 = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Second',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    // Update first note to make it more recent
    useNoteStore.getState().updateNote(id1, { content: 'updated' });
    const all = useNoteStore.getState().getAllNotes();
    expect(all.length).toBeGreaterThanOrEqual(2);
    // First note should be first since it was updated more recently
    expect(all[0].title).toBe('First');
  });
});
