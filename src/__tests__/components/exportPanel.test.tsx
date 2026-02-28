import { render, screen, fireEvent } from '@testing-library/react';
import { ExportPanel } from '../../components/export/ExportPanel.tsx';

describe('ExportPanel', () => {
  it('renders export heading', () => {
    render(<ExportPanel />);
    expect(screen.getByText('Export to Obsidian')).toBeInTheDocument();
  });

  it('renders export settings checkboxes', () => {
    render(<ExportPanel />);
    expect(screen.getByText('Include lesson content')).toBeInTheDocument();
    expect(screen.getByText('Include your notes')).toBeInTheDocument();
    expect(screen.getByText('Include code snippets')).toBeInTheDocument();
    expect(screen.getByText('Include progress data')).toBeInTheDocument();
  });

  it('renders link format selector', () => {
    render(<ExportPanel />);
    expect(screen.getByText('Link format:')).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(<ExportPanel />);
    expect(screen.getByText('Download Export (ZIP)')).toBeInTheDocument();
  });

  it('renders post-download instructions', () => {
    render(<ExportPanel />);
    expect(screen.getByText(/Open Obsidian/)).toBeInTheDocument();
  });

  it('toggles checkbox settings', () => {
    render(<ExportPanel />);
    const progressCheckbox = screen.getByText('Include progress data')
      .closest('label')!
      .querySelector('input')!;
    expect(progressCheckbox.checked).toBe(false);
    fireEvent.click(progressCheckbox);
    expect(progressCheckbox.checked).toBe(true);
  });
});
