import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore.ts';
import { useProgressStore } from '../stores/progressStore.ts';
import { modules } from '../data/modules.ts';
import { getLessonsByModule } from '../data/lessons.ts';

export function PathwayPage() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const { lessonProgress } = useProgressStore();

  const pathwayModules = useMemo(() => {
    if (!profile?.currentPathway.modules.length) return modules;
    return profile.currentPathway.modules
      .map((id) => modules.find((m) => m.id === id))
      .filter(Boolean);
  }, [profile]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Pathway</h1>
      <p className="text-gray-600 mb-8">Your personalized learning journey.</p>

      <div className="space-y-6">
        {pathwayModules.map((mod, index) => {
          if (!mod) return null;
          const modLessons = getLessonsByModule(mod.id);
          const completed = modLessons.filter(
            (l) => lessonProgress[l.id]?.status === 'completed'
          ).length;
          const isComplete = completed === modLessons.length && modLessons.length > 0;

          return (
            <div key={mod.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className={`p-4 ${isComplete ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isComplete
                        ? 'bg-green-600 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mod.title}</h3>
                    <p className="text-sm text-gray-500">
                      {completed}/{modLessons.length} lessons - ~{mod.estimatedHours}h
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {modLessons.map((lesson) => {
                  const prog = lessonProgress[lesson.id];
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="w-full flex items-center gap-3 p-3 pl-8 hover:bg-gray-50 text-left transition-colors"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          prog?.status === 'completed'
                            ? 'bg-green-500'
                            : prog?.status === 'in_progress'
                            ? 'bg-yellow-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-sm text-gray-700">{lesson.title}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        ~{lesson.estimatedTimeMinutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
