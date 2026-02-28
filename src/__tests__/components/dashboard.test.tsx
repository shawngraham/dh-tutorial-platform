import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../../components/dashboard/Dashboard.tsx';
import { useUserStore } from '../../stores/userStore.ts';
import { useProgressStore } from '../../stores/progressStore.ts';
import { useNoteStore } from '../../stores/noteStore.ts';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Dashboard', () => {
  beforeEach(() => {
    useUserStore.getState().resetProfile();
    useProgressStore.getState().resetProgress();
    const notes = useNoteStore.getState().notes;
    for (const id of Object.keys(notes)) {
      useNoteStore.getState().deleteNote(id);
    }
  });

  it('renders research dashboard heading', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Research Dashboard')).toBeInTheDocument();
  });

  it('shows stats cards', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Lessons Completed')).toBeInTheDocument();
    expect(screen.getByText('Toolbox Mastery')).toBeInTheDocument();
    expect(screen.getByText('Your Notes & Observations')).toBeInTheDocument();
    expect(screen.getByText('Modules Active')).toBeInTheDocument();
  });

  it('shows 0 completed lessons initially', () => {
    renderWithRouter(<Dashboard />);
    const stats = screen.getAllByText(/^0/);
    expect(stats.length).toBeGreaterThan(0);
  });

  it('shows up next section when lessons are available', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Up Next')).toBeInTheDocument();
  });

  it('shows development pathway section', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Development Pathway')).toBeInTheDocument();
  });

  it('reflects completed lesson count', () => {
    useProgressStore.getState().startLesson('python-basics-01');
    useProgressStore.getState().completeLesson('python-basics-01');
    renderWithRouter(<Dashboard />);
    // Should show at least 1 completed somewhere in the page
    expect(screen.getAllByText(/1\//).length).toBeGreaterThan(0);
  });

  it('reflects notes count', () => {
    useNoteStore.getState().createNote({
      type: 'personal_note',
      title: 'Test',
      content: '',
      tags: [],
      linkedLessons: [],
    });
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows Apprentice identity when no lessons are completed', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Apprentice')).toBeInTheDocument();
  });

  it('shows Explorer identity after completing a small portion of lessons', () => {
    // Completing 1 lesson out of the full curriculum (99 lessons) gives ~1% → Explorer
    useProgressStore.getState().startLesson('python-basics-01');
    useProgressStore.getState().completeLesson('python-basics-01');
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('identity milestone is based on lesson completion, not challenge pass rate', () => {
    // Even with no challenges solved, completing lessons advances the identity
    useProgressStore.getState().startLesson('python-basics-01');
    useProgressStore.getState().completeLesson('python-basics-01');
    // getSuccessRate() would still return 0 (no challenges), but milestone should not be Apprentice
    renderWithRouter(<Dashboard />);
    expect(screen.queryByText('Apprentice')).not.toBeInTheDocument();
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });
});
