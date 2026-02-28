import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore.ts';
import { useProgressStore } from '../../stores/progressStore.ts';
import { useNoteStore } from '../../stores/noteStore.ts';
import { modules } from '../../data/modules.ts';
import { getLessonsByModule } from '../../data/lessons.ts';

export function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const { lessonProgress, getCompletedLessons } = useProgressStore();
  const { getAllNotes } = useNoteStore();

  const completedLessons = getCompletedLessons();
  const notesCount = getAllNotes().length;

  const pathwayModules = useMemo(() => {
    if (!profile?.currentPathway.modules.length) return modules;
    return profile.currentPathway.modules
      .map((id) => modules.find((m) => m.id === id))
      .filter(Boolean);
  }, [profile]);

  const totalLessons = pathwayModules.reduce(
    (acc, m) => acc + (m?.lessons.length || 0),
    0
  );

  // Lesson completion rate (0–100%) drives the DH identity milestone.
  // Using lesson completion rather than challenge pass rate ensures the
  // identity progression reflects actual curriculum progress.
  const lessonCompletionRate = totalLessons > 0
    ? (completedLessons.length / totalLessons) * 100
    : 0;

  // Milestone logic: map lesson completion % to DH identities
  const milestone = useMemo(() => {
    const rate = Math.round(lessonCompletionRate);
    if (completedLessons.length === 0) return { label: 'Apprentice', color: 'text-gray-500', bg: 'bg-gray-50' };
    if (rate < 25) return { label: 'Explorer', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (rate < 50) return { label: 'Collaborator', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    if (rate < 75) return { label: 'Maker', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (rate < 100) return { label: 'Practitioner', color: 'text-pink-600', bg: 'bg-pink-50' };
    return { label: 'Digital Humanist', color: 'text-orange-600', bg: 'bg-orange-50' };
  }, [lessonCompletionRate, completedLessons]);

  const nextLesson = useMemo(() => {
    for (const mod of pathwayModules) {
      if (!mod) continue;
      const modLessons = getLessonsByModule(mod.id);
      for (const lesson of modLessons) {
        const progress = lessonProgress[lesson.id];
        if (!progress || progress.status !== 'completed') {
          return { lesson, module: mod };
        }
      }
    }
    return null;
  }, [pathwayModules, lessonProgress]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Research Dashboard</h1>
        <p className="text-gray-600">Tracking your journey through the Digital Humanities.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Lessons Completed</p>
          <p className="text-2xl font-bold text-gray-900">{completedLessons.length}/{totalLessons}</p>
        </div>
        
        {/* REPLACED: Success Rate -> Toolbox Mastery */}
        <div className={`border border-gray-200 rounded-lg p-4 transition-colors ${milestone.bg}`}>
          <p className="text-sm text-gray-500">Toolbox Mastery</p>
          <p className={`text-xl font-bold truncate ${milestone.color}`}>
            {milestone.label}
          </p>
          <p className="text-xs text-gray-400 mt-1">{Math.round(lessonCompletionRate)}% Integration</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Your Notes & Observations</p>
          <p className="text-2xl font-bold text-gray-900">{notesCount}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Modules Active</p>
          <p className="text-2xl font-bold text-gray-900">{pathwayModules.length}</p>
        </div>
      </div>

      {nextLesson && (
        <div className="bg-indigo-600 rounded-lg p-6 mb-8 text-white shadow-md">
          <h2 className="text-sm font-medium opacity-90 text-indigo-100 uppercase tracking-wider">Up Next</h2>
          <h3 className="text-xl font-bold mt-1">{nextLesson.lesson.title}</h3>
          <p className="text-sm opacity-80 mt-1">Part of: {nextLesson.module.title}</p>
          <button
            onClick={() => navigate(`/lesson/${nextLesson.lesson.id}`)}
            className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Resume Research
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4 italic">Development Pathway</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pathwayModules.map((mod) => {
          if (!mod) return null;
          const modLessons = getLessonsByModule(mod.id);
          const completedCount = modLessons.filter(
            (l) => lessonProgress[l.id]?.status === 'completed'
          ).length;
          const pct = modLessons.length > 0 ? (completedCount / modLessons.length) * 100 : 0;

          return (
            <div
              key={mod.id}
              className="group border border-gray-200 bg-white rounded-lg p-4 cursor-pointer hover:border-indigo-400 hover:shadow-sm transition-all"
              onClick={() => {
                const firstLesson = modLessons[0];
                if (firstLesson) navigate(`/lesson/${firstLesson.id}`);
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="pr-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight">
                    {completedCount} / {modLessons.length} Tasks Finished
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}