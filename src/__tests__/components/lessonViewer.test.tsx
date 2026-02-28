import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LessonViewer } from '../../components/lesson/LessonViewer.tsx';
import { LessonContent } from '../../components/lesson/LessonContent.tsx';
import { useProgressStore } from '../../stores/progressStore.ts';

// 1. Import your actual data and helpers
import { lessons, getLessonById } from '../../data/lessons.ts'; 

vi.mock('../../hooks/usePyodide.ts', () => ({
  usePyodide: () => ({ status: 'ready', loadError: null, runPython: vi.fn() }),
}));
vi.mock('../../hooks/useWebR.ts', () => ({
  useWebR: () => ({ status: 'ready', loadError: null, runR: vi.fn() }),
}));

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('LessonContent', () => {
  it('renders markdown content', () => {
    const testContent = "# Test Title\nSome body text.";
    renderWithRouter(<LessonContent content={testContent} />);
    expect(screen.getByRole('heading', { name: /Test Title/i })).toBeInTheDocument();
  });

  it('renders headings accurately', () => {
    // Using regex and accessible roles is safer for Markdown rendering
    renderWithRouter(<LessonContent content="## Section Title" />);
    expect(screen.getByRole('heading', { level: 2, name: /Section Title/i })).toBeInTheDocument();
  });
});

describe('LessonViewer', () => {
  // 2. Define a target lesson from your real data to test against
  const TEST_LESSON_ID = 'text-analysis-01';
  const sampleLesson = getLessonById(TEST_LESSON_ID);

  if (!sampleLesson) {
    throw new Error(`Critical Test Failure: ${TEST_LESSON_ID} not found in lessons.ts`);
  }

  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('shows not found for invalid lesson', () => {
    render(
      <MemoryRouter initialEntries={['/lesson/nonexistent']}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Lesson not found/i)).toBeInTheDocument();
  });

  it('renders the correct title from data source', () => {
    render(
      <MemoryRouter initialEntries={[`/lesson/${TEST_LESSON_ID}`]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // 3. Use the dynamic title from your imported lesson object.
    // getByRole scopes to the <h1> heading, avoiding the duplicate in NotePanel.
    expect(screen.getByRole('heading', { level: 1, name: sampleLesson.title })).toBeInTheDocument();
  });

  it('shows all learning objectives from data source', () => {
    render(
      <MemoryRouter initialEntries={[`/lesson/${TEST_LESSON_ID}`]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Test that every objective in the data is actually rendered
    sampleLesson.learningObjectives.forEach((objective) => {
      expect(screen.getByText(objective)).toBeInTheDocument();
    });
  });

  it('starts lesson progress with the correct ID', () => {
    render(
      <MemoryRouter initialEntries={[`/lesson/${TEST_LESSON_ID}`]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
        </Routes>
      </MemoryRouter>
    );
    
    const progress = useProgressStore.getState().lessonProgress[TEST_LESSON_ID];
    expect(progress).toBeDefined();
    expect(progress.status).toBe('in_progress');
  });
});