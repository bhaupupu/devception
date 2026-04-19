import * as vm from 'vm';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

export interface TestCase {
  input: string;       // e.g. "[1,2,3,4,5]" or '"racecar"'
  expectedOutput: string; // e.g. "15" or "true" or "[1,2,3,4]"
}

// Detect an available Python interpreter at boot. We try python3 first
// (Linux / macOS / most CI), then python (Windows).
function detectPython(): string | null {
  for (const bin of ['python3', 'python']) {
    try {
      const r = spawnSync(bin, ['-c', 'import sys;print(sys.version_info[0])'], { timeout: 2000 });
      if (r.status === 0 && (r.stdout?.toString().trim().startsWith('3'))) return bin;
    } catch { /* not installed */ }
  }
  return null;
}
const PYTHON_BIN: string | null = detectPython();
if (PYTHON_BIN) {
  // eslint-disable-next-line no-console
  console.log(`[taskRunner] Python sandbox enabled via ${PYTHON_BIN}`);
} else {
  // eslint-disable-next-line no-console
  console.warn('[taskRunner] Python not found on PATH; Python test execution disabled.');
}

function detectCpp(): string | null {
  for (const bin of ['g++', 'c++', 'clang++']) {
    try {
      const r = spawnSync(bin, ['--version'], { timeout: 2000 });
      if (r.status === 0) return bin;
    } catch { /* not installed */ }
  }
  return null;
}
const CPP_BIN: string | null = detectCpp();
if (CPP_BIN) {
  // eslint-disable-next-line no-console
  console.log(`[taskRunner] C++ sandbox enabled via ${CPP_BIN}`);
} else {
  // eslint-disable-next-line no-console
  console.warn('[taskRunner] C++ compiler not found on PATH; C++ test execution disabled.');
}

const COMPILE_TIMEOUT_MS = 5000;

export interface TestVerdict {
  index: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface RunResult {
  supported: boolean;
  allPassed: boolean;
  verdicts: TestVerdict[];
  note?: string;
}

const EXEC_TIMEOUT_MS = 2000;

// Normalize a value for comparison. Handles JSON, numbers, booleans, strings.
function canonical(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NaN';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function canonicalExpected(expected: string): string {
  const trimmed = expected.trim();
  if (trimmed === 'true' || trimmed === 'false' || trimmed === 'null' || trimmed === 'undefined') return trimmed;
  if (!isNaN(Number(trimmed)) && trimmed !== '') return String(Number(trimmed));
  try {
    const parsed = JSON.parse(trimmed);
    return canonical(parsed);
  } catch {
    // Plain string (strip surrounding quotes if user supplied them).
    return trimmed.replace(/^"(.*)"$/s, '$1');
  }
}

function parseInput(input: string): unknown {
  const trimmed = input.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.replace(/^"(.*)"$/s, '$1');
  }
}

// Extract the single exported function to call. Users can write e.g.
//   function sumArray(arr) { ... }
// or  const isPalindrome = (s) => { ... }
// We match the first top-level declaration name.
function extractEntryName(code: string): string | null {
  const fn = /function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(code);
  if (fn) return fn[1];
  const constFn = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.exec(code);
  if (constFn) return constFn[1];
  return null;
}

export function runJavaScriptTestCases(code: string, testCases: TestCase[]): RunResult {
  const entry = extractEntryName(code);
  if (!entry) {
    return {
      supported: true,
      allPassed: false,
      verdicts: testCases.map((tc, i) => ({
        index: i,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: '',
        passed: false,
        error: 'Could not find a top-level function to run.',
      })),
    };
  }

  const verdicts: TestVerdict[] = [];
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const expected = canonicalExpected(tc.expectedOutput);
    try {
      const context = vm.createContext({ console: { log() {}, warn() {}, error() {} } });
      // Sandboxed script: define the user's code, then invoke the entry function with the parsed input.
      const script = new vm.Script(
        `${code}\n;__RESULT__ = (${entry})(__INPUT__);`,
        { filename: 'user-task.js' }
      );

      (context as any).__INPUT__ = parseInput(tc.input);
      (context as any).__RESULT__ = undefined;

      script.runInContext(context, { timeout: EXEC_TIMEOUT_MS, displayErrors: false });

      const result = (context as any).__RESULT__;
      const actual = canonical(result);
      verdicts.push({
        index: i,
        input: tc.input,
        expected,
        actual,
        passed: actual === expected,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTimeout = /timed? ?out|script execution timed out/i.test(msg);
      verdicts.push({
        index: i,
        input: tc.input,
        expected,
        actual: '',
        passed: expected === 'throws',
        error: isTimeout ? 'Execution timed out (>2s).' : msg,
      });
    }
  }

  return {
    supported: true,
    allPassed: verdicts.length > 0 && verdicts.every((v) => v.passed),
    verdicts,
  };
}

// Python entry extraction: first top-level `def name(` declaration.
function extractPythonEntry(code: string): string | null {
  const m = /^\s*def\s+([A-Za-z_][\w]*)\s*\(/m.exec(code);
  return m ? m[1] : null;
}

export function runPythonTestCases(code: string, testCases: TestCase[]): RunResult {
  if (!PYTHON_BIN) {
    return {
      supported: false,
      allPassed: false,
      verdicts: testCases.map((tc, i) => ({
        index: i, input: tc.input, expected: tc.expectedOutput, actual: '',
        passed: false, error: 'Python interpreter not available on server.',
      })),
      note: 'Python interpreter not available on server. Install python3 and restart.',
    };
  }

  const entry = extractPythonEntry(code);
  if (!entry) {
    return {
      supported: true, allPassed: false,
      verdicts: testCases.map((tc, i) => ({
        index: i, input: tc.input, expected: tc.expectedOutput, actual: '',
        passed: false, error: 'Could not find a top-level `def` function to run.',
      })),
    };
  }

  // Wrapper: parses JSON stdin as [input], calls the user's entry function,
  // prints canonical JSON output. Runs in isolated mode (-I) to block user
  // site-packages, env vars (PYTHONPATH) and implicit cwd imports. -B disables
  // .pyc writes. -S disables site.py. Stdin carries the test input only — user
  // code cannot read it (we consume it in the wrapper before invoking).
  const wrapper = `
import sys, json, io, builtins
__src__ = ${JSON.stringify(code)}
__entry__ = ${JSON.stringify(entry)}
__raw__ = sys.stdin.read()
try:
    __arg__ = json.loads(__raw__) if __raw__.strip() else None
except Exception:
    __arg__ = __raw__.strip()
# Block obvious escape hatches. Not a true jail — process isolation + timeout
# are the real guards.
builtins.open = lambda *a, **kw: (_ for _ in ()).throw(PermissionError('file io disabled'))
__ns__ = {'__name__': '__user__'}
exec(compile(__src__, '<user>', 'exec'), __ns__)
__fn__ = __ns__.get(__entry__)
if not callable(__fn__):
    raise RuntimeError('entry function not defined: ' + __entry__)
__result__ = __fn__(__arg__)
sys.stdout.write(json.dumps(__result__, default=str))
`;

  const verdicts: TestVerdict[] = [];
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const expected = canonicalExpected(tc.expectedOutput);
    try {
      const proc = spawnSync(
        PYTHON_BIN,
        ['-I', '-B', '-S', '-c', wrapper],
        {
          input: tc.input,
          timeout: EXEC_TIMEOUT_MS,
          maxBuffer: 256 * 1024,
          env: {}, // strip env; -I already ignores PYTHONPATH but be explicit
          encoding: 'utf-8',
        }
      );
      if (proc.error && (proc.error as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
        verdicts.push({ index: i, input: tc.input, expected, actual: '', passed: false, error: 'Execution timed out (>2s).' });
        continue;
      }
      if (proc.status !== 0) {
        const stderr = proc.stderr?.toString() ?? '';
        const firstLine = stderr.split('\n').filter(l => l.trim()).pop() ?? 'Runtime error.';
        const passed = expected === 'throws';
        verdicts.push({ index: i, input: tc.input, expected, actual: '', passed, error: firstLine.slice(0, 200) });
        continue;
      }
      const raw = proc.stdout?.toString() ?? '';
      let actual: string;
      try { actual = canonical(JSON.parse(raw)); }
      catch { actual = raw.trim(); }
      verdicts.push({ index: i, input: tc.input, expected, actual, passed: actual === expected });
    } catch (err) {
      verdicts.push({
        index: i, input: tc.input, expected, actual: '', passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    supported: true,
    allPassed: verdicts.length > 0 && verdicts.every(v => v.passed),
    verdicts,
  };
}

export function isPythonSandboxEnabled(): boolean {
  return PYTHON_BIN !== null;
}

// C++ runner — classic stdin/stdout model. User writes their own main().
// Per submission we compile once, then run the binary per test case with the
// test input piped to stdin and compare trimmed stdout against the expected.
export function runCppTestCases(code: string, testCases: TestCase[]): RunResult {
  if (!CPP_BIN) {
    return {
      supported: false,
      allPassed: false,
      verdicts: testCases.map((tc, i) => ({
        index: i, input: tc.input, expected: tc.expectedOutput, actual: '',
        passed: false, error: 'C++ compiler not available on server.',
      })),
      note: 'C++ compiler not available on server. Install g++ and restart.',
    };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-run-'));
  const srcPath = path.join(tmpDir, 'main.cpp');
  const binPath = path.join(tmpDir, process.platform === 'win32' ? 'a.exe' : 'a.out');

  try {
    fs.writeFileSync(srcPath, code, 'utf-8');

    const compile = spawnSync(
      CPP_BIN,
      ['-O1', '-std=c++17', '-o', binPath, srcPath],
      { timeout: COMPILE_TIMEOUT_MS, encoding: 'utf-8', env: {} }
    );

    if (compile.error || compile.status !== 0) {
      const stderr = (compile.stderr ?? '').toString();
      const firstErr = stderr.split('\n').filter(l => l.trim()).slice(0, 3).join(' | ').slice(0, 300)
        || (compile.error instanceof Error ? compile.error.message : 'Compilation failed.');
      return {
        supported: true,
        allPassed: false,
        verdicts: testCases.map((tc, i) => ({
          index: i, input: tc.input, expected: canonicalExpected(tc.expectedOutput),
          actual: '', passed: false, error: `Compile error: ${firstErr}`,
        })),
      };
    }

    const verdicts: TestVerdict[] = [];
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const expected = canonicalExpected(tc.expectedOutput);
      try {
        const proc = spawnSync(binPath, [], {
          input: tc.input,
          timeout: EXEC_TIMEOUT_MS,
          maxBuffer: 256 * 1024,
          encoding: 'utf-8',
          env: {},
        });
        if (proc.error && (proc.error as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
          verdicts.push({ index: i, input: tc.input, expected, actual: '', passed: false, error: 'Execution timed out (>2s).' });
          continue;
        }
        if (proc.status !== 0) {
          const stderr = (proc.stderr ?? '').toString();
          const firstLine = stderr.split('\n').filter(l => l.trim()).pop() ?? `Exited with code ${proc.status}`;
          // Runtime errors (non-zero exit or signal) count as a pass when the
          // test expects the program to throw, matching the JS runner's rule.
          const passed = expected === 'throws';
          verdicts.push({ index: i, input: tc.input, expected, actual: '', passed, error: firstLine.slice(0, 200) });
          continue;
        }
        const raw = (proc.stdout ?? '').toString().trim();
        // Best-effort canonicalization: try JSON parse first, else compare as plain text.
        let actual: string;
        try { actual = canonical(JSON.parse(raw)); }
        catch { actual = raw; }
        verdicts.push({ index: i, input: tc.input, expected, actual, passed: actual === expected });
      } catch (err) {
        verdicts.push({
          index: i, input: tc.input, expected, actual: '', passed: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return {
      supported: true,
      allPassed: verdicts.length > 0 && verdicts.every(v => v.passed),
      verdicts,
    };
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* best-effort */ }
  }
}

export function isCppSandboxEnabled(): boolean {
  return CPP_BIN !== null;
}

export function runTestCases(language: string, code: string, testCases: TestCase[]): RunResult {
  if (!testCases || testCases.length === 0) {
    return { supported: true, allPassed: false, verdicts: [], note: 'Task has no test cases.' };
  }
  if (language === 'javascript') return runJavaScriptTestCases(code, testCases);
  if (language === 'python') return runPythonTestCases(code, testCases);
  if (language === 'cpp' || language === 'c++') return runCppTestCases(code, testCases);

  return {
    supported: false,
    allPassed: false,
    verdicts: testCases.map((tc, i) => ({
      index: i,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: '',
      passed: false,
      error: `Sandboxed execution for ${language} is not enabled on this server.`,
    })),
    note: `Sandboxed ${language} execution is not enabled on this server.`,
  };
}
