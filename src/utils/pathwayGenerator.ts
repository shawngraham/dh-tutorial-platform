import type { UserProfile, Pathway } from '../types/index.ts';
import { modules } from '../data/modules.ts';
import { v4 as uuidv4 } from 'uuid';

const MAX_DISCIPLINE_MODULES = 5;

// Keys match the IDs sent by InterestMapping.tsx
const INTEREST_MODULE_MAP: Record<string, string[]> = {
  'text-analysis':    ['text-analysis-fundamentals'],
  'visualization':    ['data-visualization'],
  'timelines':        ['data-visualization'],
  'mapping':          ['geospatial-analysis', 'data-visualization'],
  'web-scraping':     ['web-data-collection'],
  'regex':            ['text-analysis-fundamentals'],
  'sentiment':        ['sentiment-analysis'],
  'networks':         ['network-analysis'],
  'topic-modeling':   ['topic-modeling'],
  'data-cleaning':    ['structured-data'],
  'metadata':         ['structured-data'],
  'archives':         ['web-data-collection', 'structured-data'],
  'network-analysis': ['network-analysis', 'relational-models'],
  'orientation': ['orientation'],
};

/**
 * Return all module IDs whose disciplines[] include the given discipline.
 */
export function modulesForDiscipline(discipline: string): string[] {
  return modules
    .filter((m) => m.disciplines.includes(discipline.toLowerCase()))
    .map((m) => m.id);
}

/**
 * Return the top N discipline modules, ranked by keyword overlap with the
 * user's interests (higher is better) then by prerequisite count (lower is
 * better). Ties preserve the curated order from modules.ts.
 */
function topModulesForDiscipline(discipline: string, interests: string[]): string[] {
  const matches = modulesForDiscipline(discipline);

  const scored = matches.map((id) => {
    const mod = modules.find((m) => m.id === id)!;
    const keywordHits = mod.keywords.filter((k) =>
      interests.some((i) => i.includes(k) || k.includes(i))
    ).length;
    const prereqCount = mod.prerequisites.length;
    return { id, score: keywordHits * 10 - prereqCount };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_DISCIPLINE_MODULES).map((s) => s.id);
}

export function generatePathway(profile: UserProfile): Pathway {
  const selectedModules: string[] = ['orientation'];

  // Determine recommended language
  const textHeavyInterests = ['text-analysis', 'regex', 'topic-modeling'];
  const statisticalInterests = ['statistics', 'statistical analysis'];

  const interests = profile.background.researchInterests.map((i) => i.toLowerCase());

  let recommendedLanguage: 'python' | 'r' = 'python';
  if (interests.some((i) => statisticalInterests.some((s) => i.includes(s)))) {
    recommendedLanguage = 'r';
  } else if (interests.some((i) => textHeavyInterests.some((t) => i.includes(t)))) {
    recommendedLanguage = 'python';
  }

  // Add foundational modules for beginners
  if (profile.background.programmingExperience === 'none') {
    selectedModules.push('digital-literacy-foundations');
    selectedModules.push('python-basics');
  } else if (profile.background.programmingExperience === 'beginner') {
    selectedModules.push('python-basics');
  }

  // Add discipline-specific modules (dynamic lookup, capped and scored)
  const discipline = profile.background.discipline.toLowerCase();
  const disciplineModules = topModulesForDiscipline(discipline, interests);
  for (const modId of disciplineModules) {
    if (!selectedModules.includes(modId)) {
      selectedModules.push(modId);
    }
  }

  // Add interest-based modules
  for (const interest of interests) {
    const interestModules = INTEREST_MODULE_MAP[interest] || [];
    for (const modId of interestModules) {
      if (!selectedModules.includes(modId)) {
        selectedModules.push(modId);
      }
    }
  }

  // If no specific modules added, add defaults (and orientation already in there)
  if (selectedModules.length <= 3) {
    for (const mod of ['text-analysis-fundamentals', 'data-visualization']) {
      if (!selectedModules.includes(mod)) {
        selectedModules.push(mod);
      }
    }
  }

  // Calculate total estimated hours
  const estimatedHours = selectedModules.reduce((total, modId) => {
    const mod = modules.find((m) => m.id === modId);
    return total + (mod?.estimatedHours || 0);
  }, 0);

  return {
    id: uuidv4(),
    modules: selectedModules,
    estimatedHours,
    recommendedLanguage,
  };
}

export function matchDisciplineModules(discipline: string): string[] {
  return modulesForDiscipline(discipline);
}

export function getMethodModules(interest: string): string[] {
  return INTEREST_MODULE_MAP[interest.toLowerCase()] || [];
}
