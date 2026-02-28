import { useState, useMemo } from 'react';
import { useNoteStore } from '../../stores/noteStore.ts';
import type { Note } from '../../types/index.ts';

interface NoteListProps {
  onSelect: (noteId: string) => void;
  onCreateNew: () => void;
}

export function NoteList({ onSelect, onCreateNew }: NoteListProps) {
  const { getAllNotes, deleteNote, searchNotes, notes: notesMap } = useNoteStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Note['type'] | 'all'>('all');

  const notes = useMemo(() => {
    let result = search ? searchNotes(search) : getAllNotes();
    if (filter !== 'all') {
      result = result.filter((n) => n.type === filter);
    }
    return result;
  }, [search, filter, getAllNotes, searchNotes, notesMap]);

  const typeLabels: Record<Note['type'], string> = {
    personal_note: 'Personal',
    lesson_note: 'Lesson',
    code_snippet: 'Code',
    reflection: 'Reflection',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Notes</h2>
          <button
            onClick={onCreateNew}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 transition-colors"
          >
            New Note
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
        />
        <div className="flex gap-1">
          {(['all', 'personal_note', 'lesson_note', 'code_snippet', 'reflection'] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  filter === t
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'all' ? 'All' : typeLabels[t]}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {search ? 'No notes match your search.' : 'No notes yet. Create one!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelect(note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">{note.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {note.content.slice(0, 100)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
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
                    className="text-gray-400 hover:text-red-500 text-xs ml-2"
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
    </div>
  );
}
