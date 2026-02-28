import { render, screen, fireEvent } from '@testing-library/react';
import { CodeSandbox } from '../../components/sandbox/CodeSandbox.tsx';
import { useProgressStore } from '../../stores/progressStore.ts';
import type { ChallengeDefinition } from '../../types/index.ts';

// Mock the runtime hooks so tests don't try to load Pyodide/WebR from CDN
const mockRunPython = vi.fn().mockResolvedValue({ stdout: '', stderr: '', error: null });
const mockRunR = vi.fn().mockResolvedValue({ stdout: '', stderr: '', error: null });

vi.mock('../../hooks/usePyodide.ts', () => ({
  usePyodide: () => ({ status: 'ready', loadError: null, runPython: mockRunPython }),
}));
vi.mock('../../hooks/useWebR.ts', () => ({
  useWebR: () => ({ status: 'ready', loadError: null, runR: mockRunR }),
}));

const mockChallenges: ChallengeDefinition[] = [
  {
    id: 'test-c1',
    title: 'Test Challenge',
    language: 'python',
    difficulty: 'beginner',
    starterCode: 'print("hello")',
    expectedOutput: 'hello',
    hints: ['Hint 1', 'Hint 2'],
    solution: 'print("hello")',
  },
  {
    id: 'test-c2',
    title: 'Second Challenge',
    language: 'python',
    difficulty: 'beginner',
    starterCode: 'print("world")',
    expectedOutput: 'world',
    hints: ['Hint A'],
    solution: 'print("world")',
  },
];

describe('CodeSandbox', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
    mockRunPython.mockReset().mockResolvedValue({ stdout: '', stderr: '', error: null });
    mockRunR.mockReset().mockResolvedValue({ stdout: '', stderr: '', error: null });
  });

  it('renders challenge title', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    // Title appears in both tab and header; verify at least one exists
    expect(screen.getAllByText('Test Challenge').length).toBeGreaterThanOrEqual(1);
  });

  it('renders challenge tabs for multiple challenges', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    expect(screen.getByText('Second Challenge')).toBeInTheDocument();
  });

  it('shows expected output', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('renders code editor with starter code', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    const editor = screen.getByLabelText('Code editor');
    expect(editor).toHaveValue('print("hello")');
  });

  it('renders action buttons', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    expect(screen.getByText('Run Code')).toBeInTheDocument();
    expect(screen.getByText('Check')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
  });

  it('shows hints when clicking hint button', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    const hintBtn = screen.getByText(/Show Hint/);
    fireEvent.click(hintBtn);
    expect(screen.getByText(/Hint 1/)).toBeInTheDocument();
  });

  it('resets code to starter code', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    const editor = screen.getByLabelText('Code editor');
    fireEvent.change(editor, { target: { value: 'modified code' } });
    expect(editor).toHaveValue('modified code');
    fireEvent.click(screen.getByText('Reset'));
    expect(editor).toHaveValue('print("hello")');
  });

  it('shows solution when clicking show solution', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    fireEvent.click(screen.getByText('Show Solution'));
    const editor = screen.getByLabelText('Code editor');
    expect(editor).toHaveValue('print("hello")');
  });

  it('switches between challenges', () => {
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    fireEvent.click(screen.getByText('Second Challenge'));
    const editor = screen.getByLabelText('Code editor');
    expect(editor).toHaveValue('print("world")');
  });

  it('runs code via Pyodide and shows output', async () => {
    mockRunPython.mockResolvedValue({ stdout: 'hello', stderr: '', error: null });
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    fireEvent.click(screen.getByText('Run Code'));
    expect(await screen.findByText('hello')).toBeInTheDocument();
    expect(mockRunPython).toHaveBeenCalledWith('print("hello")');
  });

  it('shows error output from Pyodide', async () => {
    mockRunPython.mockResolvedValue({ stdout: '', stderr: '', error: 'NameError: x is not defined' });
    render(<CodeSandbox challenges={mockChallenges} lessonId="test-lesson" />);
    fireEvent.click(screen.getByText('Run Code'));
    expect(await screen.findByText(/NameError/)).toBeInTheDocument();
  });
});
