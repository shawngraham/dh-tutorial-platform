import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChallengeDefinition } from '../../types/index.ts';
import { useProgressStore } from '../../stores/progressStore.ts';
import { useNoteStore } from '../../stores/noteStore.ts';
import { usePyodide } from '../../hooks/usePyodide.ts';
import { useWebR } from '../../hooks/useWebR.ts';
import { dedent } from '../../utils/dedent.ts';

interface CodeSandboxProps {
  challenges: ChallengeDefinition[];
  lessonId: string;
}

export function CodeSandbox({ challenges, lessonId }: CodeSandboxProps) {
  const [activeChallenge, setActiveChallenge] = useState(0);
  const [code, setCode] = useState(dedent(challenges[0]?.starterCode || ''));
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  // --- Plotting / Visuals State ---
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const capturedPlotsRef = useRef<HTMLElement[]>([]);
  const plotContainerRef = useRef<HTMLDivElement>(null);

  const { updateChallengeProgress, addCodeSnapshot } = useProgressStore();
  const { createNote } = useNoteStore(); // <--- Hook into Note Store

  const challenge = challenges[activeChallenge];
  const isPython = challenge.language === 'python';

  const { status: pyStatus, loadError: pyError, runPython } = usePyodide();
  const { status: rStatus, loadError: rError, runR } = useWebR();

  const runtimeStatus = isPython ? pyStatus : rStatus;
  const runtimeError = isPython ? pyError : rError;

  const handleChallengeChange = (index: number) => {
    setActiveChallenge(index);
    setCode(dedent(challenges[index].starterCode));
    setOutput('');
    setHintsShown(0);
    setIsPlotModalOpen(false);
    capturedPlotsRef.current = [];
  };

  const runCode = useCallback(async () => {
    if (runtimeStatus !== 'ready') return;
    setIsRunning(true);
    setOutput('');
    
    capturedPlotsRef.current = [];
    setIsPlotModalOpen(false);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const isMatplotlib = node.id.startsWith('matplotlib');
            const hasCanvas = node.querySelector('canvas') !== null;
            const isSvg = node.tagName.toLowerCase() === 'svg';
            
            if ((isMatplotlib || hasCanvas || isSvg) && node.parentNode === document.body) {
              if (node.parentNode) node.parentNode.removeChild(node);
              capturedPlotsRef.current.push(node);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true });

    try {
      const result = isPython ? await runPython(code) : await runR(code);
      await new Promise((resolve) => setTimeout(resolve, 100));

      let combined = result.stdout;
      if (result.stderr) combined += (combined ? '\n' : '') + result.stderr;
      if (result.error) combined += (combined ? '\n' : '') + 'Error: ' + result.error;
      setOutput(combined || '(no output)');
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      observer.disconnect();
      setIsRunning(false);
      addCodeSnapshot(lessonId, code, challenge.language);

      if (capturedPlotsRef.current.length > 0) {
        setIsPlotModalOpen(true);
      }
    }
  }, [code, challenge, lessonId, addCodeSnapshot, isPython, runPython, runR, runtimeStatus]);

  useEffect(() => {
    if (isPlotModalOpen && plotContainerRef.current && capturedPlotsRef.current.length > 0) {
      const container = plotContainerRef.current;
      container.innerHTML = '';
      
      capturedPlotsRef.current.forEach((node) => {
        node.style.display = 'block';
        node.style.margin = '0 auto';
        container.appendChild(node);
      });
    }
  }, [isPlotModalOpen]);

useEffect(() => {
  // Reset all state when the lesson changes
  setActiveChallenge(0);
  setCode(dedent(challenges[0]?.starterCode || ''));
  setOutput('');
  setHintsShown(0);
  setIsPlotModalOpen(false);
  capturedPlotsRef.current = [];
}, [lessonId, challenges]);

  const handleDownloadPlot = () => {
    if (!plotContainerRef.current) return;
    const visuals = plotContainerRef.current.querySelectorAll('canvas, svg');
    
    if (visuals.length === 0) {
      alert('No saveable image data found.');
      return;
    }

    visuals.forEach((visual) => {
      let downloadUrl = '';
      let extension = '';

      if (visual instanceof HTMLCanvasElement) {
        if (visual.id.includes('rubberband')) return;
        downloadUrl = visual.toDataURL('image/png');
        extension = 'png';
      } else if (visual instanceof SVGElement) {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(visual);
        downloadUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
        extension = 'svg';
      }

      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `lesson-${lessonId}-challenge-${activeChallenge + 1}-plot.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleSaveToNotes = () => {
    if (!plotContainerRef.current) return;
    
    // Find the canvas (ignoring the interactive rubberband layer)
    const canvas = plotContainerRef.current.querySelector('canvas:not([id*="rubberband"])') as HTMLCanvasElement;
    
    // Note: If you ever support SVG-only backends, you'd add SVG serialization here too.
    
    if (canvas) {
      // 1. Convert plot to Base64 Image
      const dataUrl = canvas.toDataURL('image/png');
      
      // 2. Create the note payload
      // We embed the image directly into Markdown
      const noteTitle = `Visual: ${challenge.title}`;
      const noteContent = `Generated plot for challenge: **${challenge.title}**\n\n![Generated Plot](${dataUrl})\n\n*Captured on ${new Date().toLocaleDateString()}*`;
      
      try {
        createNote({
          type: 'code_snippet',
          title: noteTitle,
          content: noteContent,
          tags: ['visualization', 'plot', 'auto-generated'],
          linkedLessons: [lessonId],
          lessonId: lessonId,
          // moduleId passed if available in props, otherwise undefined is fine
        });
        
        // Simple feedback
        alert('Plot saved to your Notes successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to save note.');
      }
    } else {
      alert('No valid plot found to save to notes.');
    }
  };

  const checkSolution = useCallback(() => {
    const isCorrect = output.trim() === challenge.expectedOutput.trim();
    updateChallengeProgress(lessonId, {
      challengeId: challenge.id,
      attempts: 1,
      solved: isCorrect,
      hintsUsed: hintsShown,
    });
    if (isCorrect) {
      setOutput((prev) => prev + '\n\n--- Challenge passed! ---');
    } else {
      setOutput((prev) => prev + `\n\n--- Expected: ${challenge.expectedOutput} ---`);
    }
  }, [output, challenge, lessonId, hintsShown, updateChallengeProgress]);

  const showSolution = () => setCode(dedent(challenge.solution));
  const resetCode = () => {
    setCode(dedent(challenge.starterCode));
    setOutput('');
    setHintsShown(0);
    setIsPlotModalOpen(false);
    capturedPlotsRef.current = [];
  };

  const statusLabel =
    runtimeStatus === 'loading'
      ? `Loading ${isPython ? 'Python (Pyodide)' : 'R (WebR)'}...`
      : runtimeStatus === 'error'
      ? `Failed to load: ${runtimeError}`
      : null;

  return (
    
    <div className="flex flex-col h-full relative">
    
      {/* Plot Modal */}
      {isPlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Visual Output</h3>
              <button 
                onClick={() => setIsPlotModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div 
              ref={plotContainerRef}
              className="flex-1 p-6 overflow-auto bg-white flex flex-col items-center justify-center min-h-[300px]"
            >
              {/* Plots injected here */}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex gap-2">
                 <button
                  onClick={handleDownloadPlot}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
                <button
                  onClick={handleSaveToNotes}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Save to Notes
                </button>
              </div>

              <button
                onClick={() => setIsPlotModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                Close Visual
              </button>
            </div>
          </div>
        </div>
      )}

      {statusLabel && (
        <div
          className={`px-3 py-2 text-xs ${
            runtimeStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-50 text-amber-800'
          }`}
        >
          {runtimeStatus === 'loading' && (
            <span className="inline-block w-3 h-3 mr-2 border-2 border-amber-600 border-t-transparent rounded-full animate-spin align-middle" />
          )}
          {statusLabel}
        </div>
      )}

      {challenges.length > 1 && (
        <div className="flex gap-1 p-2 bg-gray-100 border-b border-gray-200">
          {challenges.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleChallengeChange(i)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                i === activeChallenge
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-sm text-gray-900">{challenge.title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Expected output: <code className="bg-gray-200 px-1 rounded">{challenge.expectedOutput}</code>
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 basis-1/2 min-h-[200px]">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
            spellCheck={false}
            aria-label="Code editor"
          />
        </div>

        <div className="flex items-center gap-2 p-2 bg-gray-100 border-y border-gray-200 flex-shrink-0">
          <button
            onClick={runCode}
            disabled={isRunning || runtimeStatus !== 'ready'}
            className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isRunning ? 'Running...' : runtimeStatus === 'loading' ? 'Loading...' : 'Run Code'}
          </button>

          {capturedPlotsRef.current.length > 0 && !isPlotModalOpen && (
             <button
              onClick={() => setIsPlotModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-1.5 rounded text-sm hover:bg-purple-700 transition-colors"
            >
              View Plot
            </button>
          )}

          <button
            onClick={checkSolution}
            disabled={!output}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Check
          </button>
          <button
            onClick={resetCode}
            className="text-gray-600 px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={showSolution}
            className="text-gray-600 px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition-colors ml-auto"
          >
            Show Solution
          </button>
        </div>

        <div className="flex-1 basis-1/2 min-h-[200px] overflow-y-auto bg-gray-900 p-4">
          <pre className="font-mono text-sm text-gray-100 whitespace-pre-wrap">
            {output || 'Output will appear here...'}
          </pre>
        </div>
      </div>

      {challenge.hints.length > 0 && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-200">
          <button
            onClick={() => setHintsShown((h) => Math.min(h + 1, challenge.hints.length))}
            className="text-sm text-yellow-700 hover:text-yellow-800"
            disabled={hintsShown >= challenge.hints.length}
          >
            {hintsShown < challenge.hints.length
              ? `Show Hint (${hintsShown}/${challenge.hints.length})`
              : 'All hints shown'}
          </button>
          {hintsShown > 0 && (
            <ul className="mt-2 space-y-1">
              {challenge.hints.slice(0, hintsShown).map((hint, i) => (
                <li key={i} className="text-sm text-yellow-800">
                  {i + 1}. {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}