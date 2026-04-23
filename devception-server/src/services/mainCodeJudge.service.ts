// Main-code judge.
//
// Previous design: each main test carried a regex and we called `pattern.test(code)`.
// That failed in two ways:
//   (a) different-but-correct approaches don't match the exact regex → false negatives;
//   (b) regex matches stale substrings — a user who deletes code can leave a fragment
//       like `this.hp -=` sitting in an unrelated spot, which flips a test to "passed"
//       by accident (the reported backspace-produces-pass bug).
//
// New design:
//   1. Structural integrity: if the template declared (for example) functions A, B, C,
//      every one of those declarations must still be present. If even one has been
//      deleted, we short-circuit and mark every main test false. This is the primary
//      fix for the backspace false-positive — deleted code ≠ leftover fragments
//      accidentally matching regex.
//   2. Regex matching runs against a stripped version of the code: comments and string
//      literals are removed first so a pattern can't match inside a docstring or
//      inside a quoted example. This tightens the match surface considerably.
//   3. Empty / blank code always fails.
//   4. The verdict array is recomputed from scratch every call — there is no hidden
//      pass-cache that can outlive a change to the code.
//
// The interface also accepts `ExecutableTest` entries (per-template hidden test cases
// that run the user's real code in a sandbox). None of the 18 templates have been
// migrated to that shape yet — the hook is here so future work can replace the regex
// tests one template at a time, without re-touching the judge.

export interface LegacyRegexTest {
  id: string;
  description: string;
  pattern: RegExp;
}

export interface ExecutableTestContext {
  // Raw source, still useful for tests that want to sniff for a specific idiom.
  code: string;
  // JavaScript-only: a snapshot of the user's top-level bindings after the code
  // was evaluated in an isolated vm sandbox. Properties include every `function`,
  // `class`, `const/let/var` declared at the top level. `undefined` for non-JS
  // languages or when the code failed to load (in which case the executable
  // test is auto-failed; the test function is never invoked).
  module?: Record<string, unknown>;
}

export interface ExecutableTest {
  id: string;
  description: string;
  check: (ctx: ExecutableTestContext) => boolean;
}

export type MainTestSpec = LegacyRegexTest | ExecutableTest;

export interface JudgeInput {
  language: string;
  code: string;
  // Names that were declared at the top level of the original template. Each must
  // still be present in the user's code; if any is missing, no test can pass.
  requiredIdentifiers: string[];
  // Minimum length floor. Typically ~30% of the initial template length. Code shorter
  // than this cannot pass any test (select-all-delete guard).
  minContentLength: number;
  tests: MainTestSpec[];
}

export interface JudgeVerdict {
  id: string;
  description: string;
  passed: boolean;
  // Internal diagnostic string — never sent to clients.
  reason?: string;
}

export interface JudgeResult {
  verdicts: JudgeVerdict[];
  allPassed: boolean;
  // Server-side notes, for logs only.
  diagnostics: string[];
}

const JS_LOAD_TIMEOUT_MS = 2000;

// Strip JS/C++ line comments, block comments, template/string literals, Python `#`
// comments, and triple-quoted Python/JS strings. Defensive — errs toward removing
// more, not less. The returned string is used only for regex matching.
export function stripCodeForRegex(code: string): string {
  let out = '';
  let i = 0;
  while (i < code.length) {
    const ch = code[i];

    if (ch === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (ch === '#') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      if (code[i + 1] === quote && code[i + 2] === quote) {
        i += 3;
        while (i < code.length - 2 && !(code[i] === quote && code[i + 1] === quote && code[i + 2] === quote)) i++;
        i += 3;
        continue;
      }
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') { i += 2; continue; }
        if (code[i] === '\n') break;
        i++;
      }
      i++;
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}

// Cheap static extraction of top-level named declarations. Used both to record
// the template's baseline identifiers and to verify the user's code still carries
// them all.
export function extractTopLevelIdentifiers(language: string, code: string): string[] {
  const names = new Set<string>();
  const src = stripCodeForRegex(code);

  if (language === 'javascript') {
    for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) names.add(m[1]);
    for (const m of src.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
    for (const m of src.matchAll(/^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm)) names.add(m[1]);
  } else if (language === 'python') {
    for (const m of src.matchAll(/^\s*def\s+([A-Za-z_][\w]*)\s*\(/gm)) names.add(m[1]);
    for (const m of src.matchAll(/^\s*class\s+([A-Za-z_][\w]*)\b/gm)) names.add(m[1]);
  } else if (language === 'cpp' || language === 'c++') {
    for (const m of src.matchAll(/\b(?:class|struct)\s+([A-Za-z_][\w]*)/g)) names.add(m[1]);
  }

  return [...names];
}

function missingIdentifiers(language: string, code: string, required: string[]): string[] {
  if (required.length === 0) return [];
  const present = new Set(extractTopLevelIdentifiers(language, code));
  return required.filter((n) => !present.has(n));
}

// Load the user's JavaScript into an isolated sandbox and harvest every top-level
// binding. Returns `{ ok: true, module }` on success. `module` exposes each
// top-level `function`, `class`, `const`, `let`, and `var` the user declared.
//
// The trick: Node's `vm` package only reflects `var`/`function` declarations onto
// the context object when the script is run at the top level. `const`/`let`/`class`
// are block-scoped per ECMAScript, so we wrap the user's code in a harness that
// explicitly exports each discovered identifier into a `__module__` object. The
// list of identifiers comes from our static extractor so we never touch names the
// user didn't declare.
export function loadJavaScriptModule(code: string): { ok: true; module: Record<string, unknown> }
                                                   | { ok: false; reason: string } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const vm = require('vm') as typeof import('vm');
  const identifiers = extractTopLevelIdentifiers('javascript', code);

  const exportAssignments = identifiers
    .map((name) => `try { __module__[${JSON.stringify(name)}] = ${name}; } catch (_e) {}`)
    .join('\n');

  const wrapped = `
    (function () {
      ${code}
      ${exportAssignments}
    })();
  `;

  const module: Record<string, unknown> = {};
  const context = vm.createContext({
    __module__: module,
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    // A minimal timer polyfill so user code that references setTimeout/clearTimeout
    // (e.g. the debounce exercise) loads rather than throwing ReferenceError. The
    // test harness never actually fires a timer — these are no-ops.
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
  }, { codeGeneration: { strings: false, wasm: false } });

  try {
    const script = new vm.Script(wrapped, { filename: 'main-code.js' });
    script.runInContext(context, { timeout: JS_LOAD_TIMEOUT_MS, displayErrors: false });
    return { ok: true, module };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: /timed? ?out/i.test(msg) ? 'load-timeout' : msg.slice(0, 200) };
  }
}

export function judgeMainCode(input: JudgeInput): JudgeResult {
  const { language, code, requiredIdentifiers, minContentLength, tests } = input;
  const diagnostics: string[] = [];

  const failAll = (reason: string): JudgeResult => ({
    verdicts: tests.map((t) => ({ id: t.id, description: t.description, passed: false, reason })),
    allPassed: false,
    diagnostics: [reason],
  });

  if (!code || code.trim().length === 0) return failAll('empty-code');
  if (code.length < minContentLength) {
    diagnostics.push(`code-too-short (${code.length} < ${minContentLength})`);
    return failAll('code-too-short');
  }

  const missing = missingIdentifiers(language, code, requiredIdentifiers);
  if (missing.length > 0) {
    diagnostics.push(`missing-identifiers: ${missing.slice(0, 5).join(', ')}`);
    return failAll(`missing:${missing[0]}`);
  }

  const stripped = stripCodeForRegex(code);

  // Lazily load the JS module only if at least one executable test exists and
  // the language is JS. Non-JS languages currently skip module loading — any
  // executable test for them will auto-fail with `module-unavailable`.
  let jsModule: Record<string, unknown> | undefined;
  let jsLoadError: string | undefined;
  const needsJsLoad = language === 'javascript' && tests.some((t) => 'check' in t && typeof t.check === 'function');
  if (needsJsLoad) {
    const loaded = loadJavaScriptModule(code);
    if (loaded.ok) {
      jsModule = loaded.module;
    } else {
      jsLoadError = loaded.reason;
      diagnostics.push(`js-load-failed: ${loaded.reason}`);
    }
  }

  const verdicts: JudgeVerdict[] = tests.map((test) => {
    try {
      if ('check' in test && typeof test.check === 'function') {
        if (jsLoadError) {
          return { id: test.id, description: test.description, passed: false, reason: `load-failed:${jsLoadError.slice(0, 60)}` };
        }
        if (language !== 'javascript' && !jsModule) {
          return { id: test.id, description: test.description, passed: false, reason: 'module-unavailable' };
        }
        return {
          id: test.id,
          description: test.description,
          passed: Boolean(test.check({ code, module: jsModule })),
        };
      }
      if ('pattern' in test) {
        return { id: test.id, description: test.description, passed: test.pattern.test(stripped) };
      }
      return { id: test.id, description: test.description, passed: false, reason: 'no-check-defined' };
    } catch (err) {
      return {
        id: test.id,
        description: test.description,
        passed: false,
        reason: err instanceof Error ? err.message.slice(0, 120) : String(err).slice(0, 120),
      };
    }
  });

  return {
    verdicts,
    allPassed: verdicts.length > 0 && verdicts.every((v) => v.passed),
    diagnostics,
  };
}
