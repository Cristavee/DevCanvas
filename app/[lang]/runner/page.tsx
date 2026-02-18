"use client";
import { useState } from "react";
import { Play, Square, Copy, Check, RotateCcw, ChevronDown, Terminal, Clock, Zap } from "lucide-react";

const PRESETS = [
  {
    id: 'ts-fetch',
    label: 'TypeScript — Fetch + Types',
    language: 'TypeScript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

const user = await fetchUser(1);
console.log(\`Hello, \${user.name}! (\${user.email})\`);`,
  },
  {
    id: 'py-algo',
    label: 'Python — Binary Search',
    language: 'Python',
    code: `def binary_search(arr: list, target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [1, 3, 5, 7, 9, 11, 13, 17, 19, 23]
idx = binary_search(arr, 11)
print(f"Found 11 at index {idx}")`,
  },
  {
    id: 'js-closure',
    label: 'JavaScript — Closures',
    language: 'JavaScript',
    code: `function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => { count = start; }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.value());     // 11`,
  },
];

const MOCK_OUTPUTS: Record<string, string> = {
  'ts-fetch': `[Running TypeScript via Deno...]
✓ Compiled in 120ms

Hello, Leanne Graham! (Sincere@april.biz)

Process exited with code 0 · 341ms`,
  'py-algo': `[Running Python 3.12...]

Found 11 at index 5

Process exited with code 0 · 89ms`,
  'js-closure': `[Running JavaScript (Node 20)...]

11
12
11
11

Process exited with code 0 · 67ms`,
};

export default function RunnerPage() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [language, setLanguage] = useState('TypeScript');
  const [activePreset, setActivePreset] = useState('ts-fetch');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const run = () => {
    setRunning(true);
    setOutput('');
    const start = Date.now();
    setTimeout(() => {
      setOutput(MOCK_OUTPUTS[activePreset] ?? `[Output]\nCode ran successfully.`);
      setElapsed(Date.now() - start);
      setRunning(false);
    }, 1200);
  };

  const selectPreset = (p: typeof PRESETS[0]) => {
    setActivePreset(p.id);
    setCode(p.code);
    setLanguage(p.language);
    setOutput('');
    setElapsed(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Code Runner</h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">Execute snippets in-browser — TypeScript, Python, JavaScript, Go</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => selectPreset(p)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${activePreset === p.id ? 'border-[var(--neon-green)] text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'border-border text-muted-foreground hover:border-border hover:text-foreground'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border" style={{ background: '#161b22' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
              </div>
              <span className="text-xs font-mono" style={{ color: '#6e7681' }}>editor.{language === 'TypeScript' ? 'ts' : language === 'Python' ? 'py' : 'js'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setCopied(true); navigator.clipboard.writeText(code); setTimeout(() => setCopied(false), 2000); }}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={() => { setCode(PRESETS.find(p => p.id === activePreset)?.code ?? ''); setOutput(''); setElapsed(null); }}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <RotateCcw size={11} />
                Reset
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="w-full p-4 text-xs font-mono leading-relaxed resize-none outline-none"
            style={{ minHeight: '380px', background: '#0d1117', color: '#e6edf3', caretColor: 'var(--neon-green)' }}
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border" style={{ background: '#161b22' }}>
            <div className="flex items-center gap-2">
              <Terminal size={13} style={{ color: 'var(--neon-green)' }} />
              <span className="text-xs font-mono" style={{ color: '#6e7681' }}>output</span>
              {elapsed !== null && !running && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Clock size={10} />
                  {elapsed}ms
                </span>
              )}
            </div>
            <button
              onClick={run}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all disabled:opacity-60"
              style={{ background: 'var(--neon-green)', color: 'hsl(var(--background))' }}>
              {running ? <><Square size={11} />Running...</> : <><Play size={11} />Run</>}
              <span className="text-[10px] opacity-70 ml-0.5">⌘↵</span>
            </button>
          </div>
          <div className="flex-1 p-4" style={{ background: '#0d1117', minHeight: '380px' }}>
            {running ? (
              <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--neon-green)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: 'var(--neon-green)' }} />
                Executing...
              </div>
            ) : output ? (
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap" style={{ color: '#e6edf3' }}>{output}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Zap size={24} />
                <span className="text-xs font-mono">Press Run to execute</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card">
        <p className="text-xs text-muted-foreground font-mono">
          <span style={{ color: 'var(--electric-blue)' }}>ℹ</span>{' '}
          Code Runner is a mock preview in v3. Full sandboxed execution via WebAssembly coming in v3.1.
          Supported runtimes: <span className="text-foreground">TypeScript (Deno)</span> · <span className="text-foreground">Python 3.12</span> · <span className="text-foreground">JavaScript (Node 20)</span> · <span className="text-foreground">Go 1.22</span>
        </p>
      </div>
    </div>
  );
}
