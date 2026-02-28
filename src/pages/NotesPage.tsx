import { useState } from 'react';
import { NoteList } from '../components/notes/NoteList.tsx';
import { NoteEditor } from '../components/notes/NoteEditor.tsx';

export function NotesPage() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | undefined>();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white border border-gray-200 rounded-lg min-h-[80vh] flex flex-col">
        {view === 'list' ? (
          <NoteList
            onSelect={(id) => {
              setEditingId(id);
              setView('edit');
            }}
            onCreateNew={() => {
              setEditingId(undefined);
              setView('edit');
            }}
          />
        ) : (
          <NoteEditor
            noteId={editingId}
            onSave={() => setView('list')}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
}
