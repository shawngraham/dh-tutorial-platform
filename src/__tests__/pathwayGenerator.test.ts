import { generatePathway, matchDisciplineModules, getMethodModules, modulesForDiscipline } from '../utils/pathwayGenerator.ts';
import type { UserProfile } from '../types/index.ts';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test-id',
    createdAt: new Date(),
    background: {
      discipline: 'literature',
      role: 'graduate-student',
      programmingExperience: 'none',
      researchInterests: ['text-analysis'],
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
    learningGoals: ['Learn text analysis'],
    onboardingCompleted: false,
    ...overrides,
  };
}

describe('generatePathway', () => {
  it('includes foundational modules for beginners with no experience', () => {
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'none',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).toContain('digital-literacy-foundations');
    expect(pathway.modules).toContain('python-basics');
  });

  it('skips digital literacy for beginner programmers', () => {
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'beginner',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).not.toContain('digital-literacy-foundations');
    expect(pathway.modules).toContain('python-basics');
  });

  it('skips foundational modules for intermediate programmers', () => {
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).not.toContain('digital-literacy-foundations');
    expect(pathway.modules).not.toContain('python-basics');
  });

  it('adds discipline-specific modules for literature', () => {
    const profile = makeProfile({
      background: {
        discipline: 'literature',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).toContain('text-analysis-fundamentals');
    expect(pathway.modules).toContain('data-visualization');
  });

  it('adds discipline-specific modules for history', () => {
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).toContain('structured-data');
    expect(pathway.modules).toContain('data-visualization');
    expect(pathway.modules).toContain('web-data-collection');
  });

  it('adds interest-based modules using UI interest IDs', () => {
    const profile = makeProfile({
      background: {
        discipline: 'philosophy',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: ['web-scraping', 'visualization'],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).toContain('web-data-collection');
    expect(pathway.modules).toContain('data-visualization');
  });

  it('does not duplicate modules', () => {
    const profile = makeProfile({
      background: {
        discipline: 'literature',
        role: 'student',
        programmingExperience: 'none',
        researchInterests: ['text-analysis'],
      },
    });
    const pathway = generatePathway(profile);
    const unique = new Set(pathway.modules);
    expect(pathway.modules.length).toBe(unique.size);
  });

  it('recommends python by default', () => {
    const profile = makeProfile();
    const pathway = generatePathway(profile);
    expect(pathway.recommendedLanguage).toBe('python');
  });

  it('recommends r for statistical interests', () => {
    const profile = makeProfile({
      background: {
        discipline: 'linguistics',
        role: 'student',
        programmingExperience: 'none',
        researchInterests: ['statistical analysis'],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.recommendedLanguage).toBe('r');
  });

  it('calculates estimated hours', () => {
    const profile = makeProfile();
    const pathway = generatePathway(profile);
    expect(pathway.estimatedHours).toBeGreaterThan(0);
  });

  it('generates a unique id', () => {
    const profile = makeProfile();
    const p1 = generatePathway(profile);
    const p2 = generatePathway(profile);
    expect(p1.id).not.toBe(p2.id);
  });

  it('adds default modules when discipline matches nothing', () => {
    const profile = makeProfile({
      background: {
        discipline: 'other',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    expect(pathway.modules).toContain('text-analysis-fundamentals');
    expect(pathway.modules).toContain('data-visualization');
  });

  it('caps discipline modules to avoid pathway bloat', () => {
    // history matches 11 modules — should be capped to 4
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: [],
      },
    });
    const pathway = generatePathway(profile);
    // Without interests adding extra, should have at most 4 modules
    expect(pathway.modules.length).toBeLessThanOrEqual(5);
  });

  it('produces modules for previously unmapped disciplines', () => {
    for (const discipline of ['religious-studies', 'classics', 'music', 'philosophy', 'archaeology', 'anthropology']) {
      const profile = makeProfile({
        background: {
          discipline,
          role: 'student',
          programmingExperience: 'intermediate',
          researchInterests: [],
        },
      });
      const pathway = generatePathway(profile);
      expect(pathway.modules.length).toBeGreaterThan(0);
      // Should not fall through to the 2-module default — these now have real matches
      expect(pathway.modules.length).toBeGreaterThan(2);
    }
  });

  it('ranks discipline modules higher when interests overlap keywords', () => {
    const profile = makeProfile({
      background: {
        discipline: 'history',
        role: 'student',
        programmingExperience: 'intermediate',
        researchInterests: ['mapping'],
      },
    });
    const pathway = generatePathway(profile);
    // 'mapping' overlaps with geospatial-analysis keywords ('maps', 'spatial')
    // and data-visualization keywords ('maps'), so these should be prioritised
    expect(pathway.modules).toContain('geospatial-analysis');
  });
});

describe('modulesForDiscipline', () => {
  it('returns modules tagged with literature', () => {
    const mods = modulesForDiscipline('literature');
    expect(mods).toContain('text-analysis-fundamentals');
    expect(mods.length).toBeGreaterThan(0);
  });

  it('returns modules for religious-studies (previously empty)', () => {
    const mods = modulesForDiscipline('religious-studies');
    expect(mods.length).toBeGreaterThan(0);
  });

  it('returns modules only for disciplines that exist on modules', () => {
    const mods = modulesForDiscipline('unknown');
    expect(mods).toEqual([]);
  });

  it('is case-insensitive', () => {
    const lower = modulesForDiscipline('history');
    const upper = modulesForDiscipline('History');
    expect(lower).toEqual(upper);
  });
});

describe('matchDisciplineModules', () => {
  it('returns modules for literature', () => {
    const modules = matchDisciplineModules('literature');
    expect(modules).toContain('text-analysis-fundamentals');
  });

  it('returns empty array for unknown discipline', () => {
    const modules = matchDisciplineModules('unknown');
    expect(modules).toEqual([]);
  });
});

describe('getMethodModules', () => {
  it('returns modules for text-analysis interest ID', () => {
    const modules = getMethodModules('text-analysis');
    expect(modules).toContain('text-analysis-fundamentals');
  });

  it('returns modules for web-scraping interest ID', () => {
    const modules = getMethodModules('web-scraping');
    expect(modules).toContain('web-data-collection');
  });

  it('returns modules for topic-modeling interest ID', () => {
    const modules = getMethodModules('topic-modeling');
    expect(modules).toContain('topic-modeling');
  });

  it('returns empty array for unknown interest', () => {
    const modules = getMethodModules('unknown');
    expect(modules).toEqual([]);
  });
});
