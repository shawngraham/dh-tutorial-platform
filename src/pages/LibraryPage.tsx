import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modules } from '../data/modules.ts';
import { getLessonsByModule } from '../data/lessons.ts';
import { useProgressStore } from '../stores/progressStore.ts';

// Define the logical order for the tracks to appear
const trackOrder = [
  'foundations',
  'textual-scholarship',
  'data-issues',
  'spatial-relational',
  'creative-critical',
] as const;

// Helper to turn IDs into display titles
const trackLabels: Record<string, string> = {
  'foundations': 'Foundations & Digital Literacy',
  'textual-scholarship': 'Computational Textual Scholarship',
  'data-science': 'Data Science & Visualization',
  'spatial-relational': 'Spatial & Relational Analysis',
  'creative-critical': 'Creative Coding & Critical DH',
};

export function LibraryPage() {
  const navigate = useNavigate();
  const { lessonProgress } = useProgressStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Library</h1>
      <p className="text-gray-600 mb-8">Browse modules organized by research track.</p>

      <div className="space-y-12">
        {trackOrder.map((trackId) => {
          const trackModules = modules.filter((m) => m.track === trackId);
          
          if (trackModules.length === 0) return null;

          return (
            <section key={trackId} className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-lg font-bold text-indigo-700 uppercase tracking-wider">
                  {trackLabels[trackId] || trackId}
                </h2>
              </div>

              <div className="space-y-4">
                {trackModules.map((mod) => {
                  const modLessons = getLessonsByModule(mod.id);
                  const isExpanded = expanded.has(mod.id);

                  return (
                    <div key={mod.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{mod.description}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="text-xs font-medium text-gray-400">
                              {modLessons.length} Lessons
                            </span>
                            <span className="text-xs text-gray-400">~{mod.estimatedHours}h total</span>
                          </div>
                        </div>
                        <div className="ml-4 mt-1">
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 divide-y divide-gray-100 bg-gray-50">
                          {modLessons.map((lesson) => {
                            const prog = lessonProgress[lesson.id];
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => navigate(`/lesson/${lesson.id}`)}
                                className="w-full flex items-center gap-3 p-4 hover:bg-white text-left transition-colors"
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
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                                  <div className="flex gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-tight">
                                      {lesson.difficulty}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">{lesson.estimatedTimeMinutes}m</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}