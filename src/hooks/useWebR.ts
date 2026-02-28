import { useState, useRef, useCallback, useEffect } from 'react';

// WebR types (subset of the public API we use)
interface WebRInterface {
  init: () => Promise<void>;
  evalRString: (code: string) => Promise<string>;
  evalRRaw: (code: string) => Promise<unknown>;
  writeConsole: (text: string) => void;
  close: () => void;
}

interface Shelter {
  captureR: (code: string) => Promise<{ output: { type: string; data: string }[]; result: { toJs: () => Promise<unknown> } }>;
  purge: () => void;
}

interface WebRWithShelter extends WebRInterface {
  Shelter: new () => Promise<Shelter>;
}

type WebRStatus = 'idle' | 'loading' | 'ready' | 'error';

const WEBR_CDN = 'https://webr.r-wasm.org/v0.4.4/webr.mjs';
const EXECUTION_TIMEOUT_MS = 30_000;

let webrInstance: WebRWithShelter | null = null;
let webrLoadPromise: Promise<WebRWithShelter> | null = null;

async function initWebR(): Promise<WebRWithShelter> {
  if (webrInstance) return webrInstance;
  if (webrLoadPromise) return webrLoadPromise;

  webrLoadPromise = (async () => {
    // Dynamic import from CDN – WebR ships as an ES module
    const { WebR } = await import(/* @vite-ignore */ WEBR_CDN) as { WebR: new () => WebRWithShelter };
    const instance = new WebR();
    await instance.init();
    webrInstance = instance;
    return instance;
  })();

  return webrLoadPromise;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  error: string | null;
}

export function useWebR() {
  const [status, setStatus] = useState<WebRStatus>(webrInstance ? 'ready' : 'idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const instanceRef = useRef<WebRWithShelter | null>(webrInstance);

  useEffect(() => {
    if (instanceRef.current) {
      setStatus('ready');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    initWebR()
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

  const runR = useCallback(async (code: string): Promise<RunResult> => {
    const instance = instanceRef.current;
    if (!instance) {
      return { stdout: '', stderr: '', error: 'WebR is not loaded yet.' };
    }

    try {
      const shelter = await new instance.Shelter();

      const result = await Promise.race([
        shelter.captureR(code),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out (30s limit)')), EXECUTION_TIMEOUT_MS)
        ),
      ]);

      const stdout = result.output
        .filter((o: { type: string }) => o.type === 'stdout')
        .map((o: { data: string }) => o.data)
        .join('\n');

      const stderr = result.output
        .filter((o: { type: string }) => o.type === 'stderr')
        .map((o: { data: string }) => o.data)
        .join('\n');

      shelter.purge();
      return { stdout, stderr, error: null };
    } catch (err) {
      return {
        stdout: '',
        stderr: '',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, []);

  return { status, loadError, runR };
}
