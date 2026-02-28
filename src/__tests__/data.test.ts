import { modules, getModuleById, getModulesByTrack } from '../data/modules.ts';
import { lessons, getLessonById, getLessonsByModule } from '../data/lessons.ts';

describe('modules data', () => {
  it('has 19 modules', () => {
    expect(modules).toHaveLength(20);
  });

  it('all modules have required fields', () => {
    for (const mod of modules) {
      expect(mod.id).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.description).toBeTruthy();
      expect(mod.estimatedHours).toBeGreaterThan(0);
      expect(mod.lessons.length).toBeGreaterThan(0);
      expect(mod.track).toBeTruthy();
    }
  });

  it('getModuleById finds existing module', () => {
    const mod = getModuleById('python-basics');
    expect(mod).toBeDefined();
    expect(mod!.title).toBe('Python Basics for Humanists');
  });

  it('getModuleById returns undefined for missing module', () => {
    expect(getModuleById('nonexistent')).toBeUndefined();
  });

  it('getModulesByTrack returns correct modules', () => {
    const dhModules = getModulesByTrack('data-issues');
    expect(dhModules.length).toBeGreaterThan(0);
    expect(dhModules.every((m) => m.track === 'data-issues')).toBe(true);
  });
});

describe('lessons data', () => {
  it('has lessons defined', () => {
    expect(lessons.length).toBeGreaterThan(0);
  });

  it('all lessons have required fields', () => {
    for (const lesson of lessons) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.moduleId).toBeTruthy();
      expect(lesson.estimatedTimeMinutes).toBeGreaterThan(0);
      expect(lesson.difficulty).toBeTruthy();
      expect(lesson.learningObjectives.length).toBeGreaterThan(0);
      expect(lesson.content).toBeTruthy();
    }
  });

  it('all lessons reference valid modules', () => {
    for (const lesson of lessons) {
      const mod = getModuleById(lesson.moduleId);
      expect(mod).toBeDefined();
    }
  });

  it('all module lesson references point to valid lessons', () => {
    for (const mod of modules) {
      for (const lessonId of mod.lessons) {
        const lesson = getLessonById(lessonId);
        expect(lesson).toBeDefined();
      }
    }
  });

  it('getLessonById finds existing lesson', () => {
    const lesson = getLessonById('text-analysis-01');
    expect(lesson).toBeDefined();
    expect(lesson!.title).toBe('Introduction to String Operations');
  });

  it('getLessonById returns undefined for missing lesson', () => {
    expect(getLessonById('nonexistent')).toBeUndefined();
  });

  it('getLessonsByModule returns lessons for a module', () => {
    const modLessons = getLessonsByModule('python-basics');
    expect(modLessons.length).toBeGreaterThan(0);
    expect(modLessons.every((l) => l.moduleId === 'python-basics')).toBe(true);
  });

  it('all challenges have required fields', () => {
    for (const lesson of lessons) {
      for (const challenge of lesson.challenges) {
        expect(challenge.id).toBeTruthy();
        expect(challenge.title).toBeTruthy();
        expect(challenge.language).toBeTruthy();
        expect(challenge.starterCode).toBeTruthy();
        expect(challenge.expectedOutput).toBeTruthy();
        expect(challenge.solution).toBeTruthy();
      }
    }
  });
});
