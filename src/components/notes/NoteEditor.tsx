import { useState, useEffect } from 'react';
import { useNoteStore } from '../../stores/noteStore.ts';
import type { Note } from '../../types/index.ts';

interface NoteEditorProps {
  noteId?: string;
  lessonId?: string;
  moduleId?: string;
  onSave?: (id: string) => void;
  onCancel?: () => void;
}

export function NoteEditor({ noteId, lessonId, moduleId, onSave, onCancel }: NoteEditorProps) {
  const { getNoteById, createNote, updateNote } = useNoteStore();
  const existingNote = noteId ? getNoteById(noteId) : undefined;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [type, setType] = useState<Note['type']>(existingNote?.type || 'personal_note');
  const [tags, setTags] = useState(existingNote?.tags.join(', ') || '');

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setType(existingNote.type);
      setTags(existingNote.tags.join(', '));
    }
  }, [existingNote]);

  const handleSave = () => {
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (noteId && existingNote) {
      updateNote(noteId, { title, content, type, tags: parsedTags });
      onSave?.(noteId);
    } else {
      const id = createNote({
        type,
        title,
        content,
        tags: parsedTags,
        linkedLessons: lessonId ? [lessonId] : [],
        lessonId,
        moduleId,
      });
      onSave?.(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-lg font-medium focus:outline-none text-gray-900 placeholder-gray-400"
        />
        <div className="flex gap-2 items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Note['type'])}
            className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-400"
          >
            <option value="personal_note">Personal Note</option>
            <option value="lesson_note">Lesson Note</option>
            <option value="code_snippet">Code Snippet</option>
            <option value="reflection">Reflection</option>
          </select>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)..."
            className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      <div className="flex-1 min-h-[50vh]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes in Markdown..."
          className="w-full h-full p-4 text-sm font-mono resize-none focus:outline-none text-gray-700"
          aria-label="Note content"
        />
      </div>

      <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {noteId ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
}
