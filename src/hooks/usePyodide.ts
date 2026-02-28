import { useState, useRef, useCallback, useEffect } from 'react';

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: { get: (name: string) => unknown };
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
  FS: {
    writeFile: (path: string, data: string) => void;
    readFile: (path: string, options: { encoding: string }) => string;
    mkdir: (path: string) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (options?: { stdout?: (text: string) => void; stderr?: (text: string) => void }) => Promise<PyodideInterface>;
  }
}

type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
const EXECUTION_TIMEOUT_MS = 30_000;

// Module-level singleton so Pyodide is only loaded once across all components
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoadPromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function initPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoadPromise = (async () => {
    await loadScript(PYODIDE_CDN);

    if (!window.loadPyodide) {
      throw new Error('loadPyodide not available after script load');
    }

    const instance = await window.loadPyodide();
    pyodideInstance = instance;
    return instance;
  })();

  return pyodideLoadPromise;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  error: string | null;
}

export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>(pyodideInstance ? 'ready' : 'idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const instanceRef = useRef<PyodideInterface | null>(pyodideInstance);

  // Begin loading Pyodide on first mount
  useEffect(() => {
    if (instanceRef.current) {
      setStatus('ready');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    initPyodide()
      .then((instance) => {
        if (cancelled) return;
        instanceRef.current = instance;
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const runPython = useCallback(async (code: string): Promise<RunResult> => {
    const instance = instanceRef.current;
    if (!instance) {
      return { stdout: '', stderr: '', error: 'Pyodide is not loaded yet.' };
    }

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    // Redirect stdout and stderr
    instance.setStdout({ batched: (text: string) => stdoutChunks.push(text) });
    instance.setStderr({ batched: (text: string) => stderrChunks.push(text) });

    try {
      // Auto-load any imported packages
      await instance.loadPackagesFromImports(code);

      // Run with timeout
      const result = await Promise.race([
        instance.runPythonAsync(code),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out (30s limit)')), EXECUTION_TIMEOUT_MS)
        ),
      ]);

      // If runPythonAsync returns a non-None value and nothing was printed,
      // treat the return value as output (mimics REPL behaviour)
      let stdout = stdoutChunks.join('\n');
      if (!stdout && result !== undefined && result !== null) {
        const repr = String(result);
        if (repr !== 'undefined') stdout = repr;
      }

      return { stdout, stderr: stderrChunks.join('\n'), error: null };
    } catch (err) {
      return {
        stdout: stdoutChunks.join('\n'),
        stderr: stderrChunks.join('\n'),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, []);

  return { status, loadError, runPython };
}
