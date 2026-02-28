import { useState } from 'react';
import type { ExportSettings } from '../../types/index.ts';
import { exportToZip } from '../../utils/obsidianExport.ts';
import { modules } from '../../data/modules.ts';
import { lessons } from '../../data/lessons.ts';
import { useNoteStore } from '../../stores/noteStore.ts';
import { useProgressStore } from '../../stores/progressStore.ts';

export function ExportPanel() {
  const { getAllNotes } = useNoteStore();
  const { lessonProgress } = useProgressStore();
  const [isExporting, setIsExporting] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    includeLessonContent: true,
    includeUserNotes: true,
    includeCodeSnippets: true,
    includeProgressData: false,
    linkFormat: 'wikilink',
    flattenStructure: false,
    includeMedia: true,
    codeFileExtension: '.py',
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const notes = getAllNotes();
      const blob = await exportToZip(modules, lessons, notes, lessonProgress, settings);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dh-tutorial-export-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const toggle = (key: keyof ExportSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Export to Obsidian</h1>
      <p className="text-gray-600 mb-8">
        Export your lessons, notes, and code snippets as an Obsidian-compatible vault.
      </p>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800">Export Settings</h2>

        {[
          { key: 'includeLessonContent' as const, label: 'Include lesson content' },
          { key: 'includeUserNotes' as const, label: 'Include your notes' },
          { key: 'includeCodeSnippets' as const, label: 'Include code snippets' },
          { key: 'includeProgressData' as const, label: 'Include progress data' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings[key] as boolean}
              onChange={() => toggle(key)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Link format:</label>
          <select
            value={settings.linkFormat}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                linkFormat: e.target.value as 'wikilink' | 'markdown',
              }))
            }
            className="text-sm border border-gray-200 rounded px-2 py-1"
          >
            <option value="wikilink">Wikilink [[...]]</option>
            <option value="markdown">Markdown [...](...)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Code file extension:</label>
          <select
            value={settings.codeFileExtension}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                codeFileExtension: e.target.value as '.py' | '.R',
              }))
            }
            className="text-sm border border-gray-200 rounded px-2 py-1"
          >
            <option value=".py">Python (.py)</option>
            <option value=".R">R (.R)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isExporting ? 'Exporting...' : 'Download Export (ZIP)'}
      </button>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-sm text-gray-700 mb-2">After downloading:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Unzip the file to a folder</li>
          <li>Open Obsidian and choose "Open folder as vault"</li>
          <li>Select the unzipped folder</li>
          <li>Recommended plugins: Dataview, Templater</li>
        </ol>
      </div>
    </div>
  );
}
