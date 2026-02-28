import { render, screen, fireEvent } from '@testing-library/react';
import { NoteEditor } from '../../components/notes/NoteEditor.tsx';
import { NoteList } from '../../components/notes/NoteList.tsx';
import { useNoteStore } from '../../stores/noteStore.ts';

describe('NoteEditor', () => {
  beforeEach(() => {
    const notes = useNoteStore.getState().notes;
    for (const id of Object.keys(notes)) {
      useNoteStore.getState().deleteNote(id);
    }
  });

  it('renders empty form for new note', () => {
    render(<NoteEditor />);
    expect(screen.getByPlaceholderText('Note title...')).toHaveValue('');
    expect(screen.getByLabelText('Note content')).toHaveValue('');
  });

  it('renders save button', () => {
    render(<NoteEditor />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders update button when editing existing note', () => {
    const id = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Existing Note',
      content: 'Content here',
      tags: ['test'],
      linkedLessons: [],
    });
    render(<NoteEditor noteId={id} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('populates fields when editing existing note', () => {
    const id = useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'My Note',
      content: 'Some content',
      tags: ['tag1', 'tag2'],
      linkedLessons: [],
    });
    render(<NoteEditor noteId={id} />);
    expect(screen.getByPlaceholderText('Note title...')).toHaveValue('My Note');
    expect(screen.getByLabelText('Note content')).toHaveValue('Some content');
  });

  it('saves new note on click', () => {
    const onSave = vi.fn();
    render(<NoteEditor onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('Note title...'), {
      target: { value: 'New Note' },
    });
    fireEvent.change(screen.getByLabelText('Note content'), {
      target: { value: 'New content' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalled();
    const notes = useNoteStore.getState().getAllNotes();
    expect(notes.some((n) => n.title === 'New Note')).toBe(true);
  });

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn();
    render(<NoteEditor onCancel={onCancel} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('disables save button when title is empty', () => {
    render(<NoteEditor />);
    expect(screen.getByText('Save')).toBeDisabled();
  });
});

describe('NoteList', () => {
  beforeEach(() => {
    const notes = useNoteStore.getState().notes;
    for (const id of Object.keys(notes)) {
      useNoteStore.getState().deleteNote(id);
    }
  });

  it('shows empty state when no notes', () => {
    const onSelect = vi.fn();
    const onCreateNew = vi.fn();
    render(<NoteList onSelect={onSelect} onCreateNew={onCreateNew} />);
    expect(screen.getByText(/No notes yet/)).toBeInTheDocument();
  });

  it('renders new note button', () => {
    const onSelect = vi.fn();
    const onCreateNew = vi.fn();
    render(<NoteList onSelect={onSelect} onCreateNew={onCreateNew} />);
    fireEvent.click(screen.getByText('New Note'));
    expect(onCreateNew).toHaveBeenCalled();
  });

  it('lists created notes', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Listed Note',
      content: 'Content',
      tags: [],
      linkedLessons: [],
    });
    const onSelect = vi.fn();
    const onCreateNew = vi.fn();
    render(<NoteList onSelect={onSelect} onCreateNew={onCreateNew} />);
    expect(screen.getByText('Listed Note')).toBeInTheDocument();
  });

  it('searches notes', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Python Note',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Java Note',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    const onSelect = vi.fn();
    const onCreateNew = vi.fn();
    render(<NoteList onSelect={onSelect} onCreateNew={onCreateNew} />);
    fireEvent.change(screen.getByPlaceholderText('Search notes...'), {
      target: { value: 'Python' },
    });
    expect(screen.getByText('Python Note')).toBeInTheDocument();
    expect(screen.queryByText('Java Note')).not.toBeInTheDocument();
  });

  it('deletes a note', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'To Delete',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    const onSelect = vi.fn();
    const onCreateNew = vi.fn();
    render(<NoteList onSelect={onSelect} onCreateNew={onCreateNew} />);
    // Find the delete button by its text content
    const deleteBtn = screen.getByRole('button', { name: /Delete note To Delete/ });
    fireEvent.click(deleteBtn);
    expect(screen.queryByText('To Delete')).not.toBeInTheDocument();
  });
});
