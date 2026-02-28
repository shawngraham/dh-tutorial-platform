import { useState, useMemo, useEffect } from 'react';
import { useNoteStore } from '../../stores/noteStore.ts';
import { NoteEditor } from './NoteEditor.tsx';
import type { Note } from '../../types/index.ts';

interface NotePanelProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  moduleId?: string;
  lessonTitle?: string;
}

export function NotePanel({ isOpen, onClose, lessonId, moduleId, lessonTitle }: NotePanelProps) {
  const { getAllNotes, getNotesByLesson, deleteNote, notes: notesMap } = useNoteStore();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | undefined>();
  const [filter, setFilter] = useState<'lesson' | 'all'>('lesson');

  // Reset to list view when panel opens
  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditingId(undefined);
    }
  }, [isOpen]);

  const notes = useMemo(() => {
    if (filter === 'lesson' && lessonId) {
      return getNotesByLesson(lessonId);
    }
    return getAllNotes();
  }, [filter, lessonId, getNotesByLesson, getAllNotes, notesMap]);

  const typeLabels: Record<Note['type'], string> = {
    personal_note: 'Personal',
    lesson_note: 'Lesson',
    code_snippet: 'Code',
    reflection: 'Reflection',
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Notes</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notes panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {view === 'list' ? (
          <>
            {/* Filter tabs & new note button */}
            <div className="px-4 py-3 border-b border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {lessonId && (
                    <button
                      onClick={() => setFilter('lesson')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        filter === 'lesson'
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      This Lesson
                    </button>
                  )}
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === 'all'
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Notes
                  </button>
                </div>
                <button
                  onClick={() => {
                    setEditingId(undefined);
                    setView('edit');
                  }}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs hover:bg-indigo-700 transition-colors"
                >
                  New Note
                </button>
              </div>
              {filter === 'lesson' && lessonTitle && (
                <p className="text-xs text-gray-500 truncate">
                  Showing notes for: <span className="font-medium text-gray-700">{lessonTitle}</span>
                </p>
              )}
            </div>

            {/* Note list */}
            <div className="flex-1 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">
                    {filter === 'lesson'
                      ? 'No notes for this lesson yet.'
                      : 'No notes yet.'}
                  </p>
                  <button
                    onClick={() => {
                      setEditingId(undefined);
                      setView('edit');
                    }}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Create your first note
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setEditingId(note.id);
                        setView('edit');
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{note.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {note.content.slice(0, 120)}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                              {typeLabels[note.type]}
                            </span>
                            {note.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-indigo-600">#{tag}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="text-gray-400 hover:text-red-500 text-xs flex-shrink-0"
                          aria-label={`Delete note ${note.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Back to list button */}
            <div className="px-4 py-2 border-b border-gray-200">
              <button
                onClick={() => {
                  setView('list');
                  setEditingId(undefined);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to notes
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0 flex flex-col">
              <NoteEditor
                noteId={editingId}
                lessonId={lessonId}
                moduleId={moduleId}
                onSave={() => {
                  setView('list');
                  setEditingId(undefined);
                }}
                onCancel={() => {
                  setView('list');
                  setEditingId(undefined);
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
