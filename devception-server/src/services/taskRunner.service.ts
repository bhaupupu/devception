import * as vm from 'vm';

export interface TestCase {
  input: string;       // e.g. "[1,2,3,4,5]" or '"racecar"'
  expectedOutput: string; // e.g. "15" or "true" or "[1,2,3,4]"
}

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

export function runTestCases(language: string, code: string, testCases: TestCase[]): RunResult {
  if (!testCases || testCases.length === 0) {
    return { supported: true, allPassed: false, verdicts: [], note: 'Task has no test cases.' };
  }
  if (language === 'javascript') return runJavaScriptTestCases(code, testCases);

  // Python and C++ are not sandboxed in this build. Report unsupported so the UI
  // can show a clear message rather than silently failing.
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
