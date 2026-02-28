import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonById } from '../../data/lessons.ts';
import { getModuleById } from '../../data/modules.ts';
import { useProgressStore } from '../../stores/progressStore.ts';
import { LessonContent } from './LessonContent.tsx';
import { CodeSandbox } from '../sandbox/CodeSandbox.tsx';
import { NotePanel } from '../notes/NotePanel.tsx';

export function LessonViewer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { startLesson, completeLesson, getLessonProgress } = useProgressStore();
  const [notePanelOpen, setNotePanelOpen] = useState(false);

  const lesson = useMemo(() => (lessonId ? getLessonById(lessonId) : undefined), [lessonId]);
  const module_ = useMemo(
    () => (lesson ? getModuleById(lesson.moduleId) : undefined),
    [lesson]
  );
  const progress = lessonId ? getLessonProgress(lessonId) : undefined;

  useEffect(() => {
    if (lessonId && lesson) {
      startLesson(lessonId);
    }
  }, [lessonId, lesson, startLesson]);

  if (!lesson || !lessonId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Lesson not found.</p>
        <button onClick={() => navigate('/library')} className="mt-4 text-indigo-600 hover:text-indigo-800">
          Browse Library
        </button>
      </div>
    );
  }

  const handleComplete = () => {
    completeLesson(lessonId);
    // Navigate to next lesson if available
    if (module_) {
      const currentIndex = module_.lessons.indexOf(lessonId);
      if (currentIndex < module_.lessons.length - 1) {
        navigate(`/lesson/${module_.lessons[currentIndex + 1]}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-4rem)]">
        <div className="lg:w-2/5 overflow-y-auto p-6 border-r border-gray-200">
          <div className="mb-4">
            {module_ && (
              <p className="text-sm text-indigo-600 font-medium">{module_.title}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{lesson.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>~{lesson.estimatedTimeMinutes} min</span>
              <span className="capitalize">{lesson.difficulty}</span>
              {progress?.status === 'completed' && (
                <span className="text-green-600 font-medium">Completed</span>
              )}
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives</h3>
            <ul className="space-y-1">
              {lesson.learningObjectives.map((obj, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <LessonContent content={lesson.content} />

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {progress?.status === 'completed' ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>

        <div className="lg:w-3/5 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col">
          {lesson.challenges.length > 0 ? (
            <CodeSandbox
              challenges={lesson.challenges}
              lessonId={lessonId}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No code challenges for this lesson.
            </div>
          )}
        </div>
      </div>

      {/* Floating notes button */}
      <button
        onClick={() => setNotePanelOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 z-30"
        aria-label="Open notes"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="text-sm font-medium">Notes</span>
      </button>

      {/* Slide-over note panel */}
      <NotePanel
        isOpen={notePanelOpen}
        onClose={() => setNotePanelOpen(false)}
        lessonId={lessonId}
        moduleId={lesson.moduleId}
        lessonTitle={lesson.title}
      />
    </>
  );
}
