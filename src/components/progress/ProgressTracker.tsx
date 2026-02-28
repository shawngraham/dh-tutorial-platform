import { useProgressStore } from '../../stores/progressStore.ts';
import { modules } from '../../data/modules.ts';
import { getLessonsByModule } from '../../data/lessons.ts';

export function ProgressTracker() {
  const { lessonProgress, getCompletedLessons, getSuccessRate } = useProgressStore();
  const completedLessons = getCompletedLessons();
  const successRate = getSuccessRate();

  const totalTime = Object.values(lessonProgress).reduce(
    (acc, p) => acc + p.timeSpentMinutes,
    0
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Progress</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{completedLessons.length}</p>
          <p className="text-sm text-gray-500 mt-1">Lessons Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{Math.round(successRate)}%</p>
          <p className="text-sm text-gray-500 mt-1">% Integration (your code checked)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{totalTime}</p>
          <p className="text-sm text-gray-500 mt-1">Minutes Spent</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Module Progress</h2>
      <div className="space-y-4">
        {modules.map((mod) => {
          const modLessons = getLessonsByModule(mod.id);
          const completed = modLessons.filter(
            (l) => lessonProgress[l.id]?.status === 'completed'
          ).length;

          return (
            <div key={mod.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{mod.title}</h3>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{
                    width: `${modLessons.length > 0 ? (completed / modLessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="mt-3 space-y-1">
                {modLessons.map((lesson) => {
                  const prog = lessonProgress[lesson.id];
                  return (
                    <div key={lesson.id} className="flex items-center gap-2 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          prog?.status === 'completed'
                            ? 'bg-green-500'
                            : prog?.status === 'in_progress'
                            ? 'bg-yellow-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className={prog?.status === 'completed' ? 'text-gray-500' : 'text-gray-700'}>
                        {lesson.title}
                      </span>
                    </div>
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
