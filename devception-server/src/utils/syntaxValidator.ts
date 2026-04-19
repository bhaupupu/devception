// Cheap "is the user done typing?" gate for auto-running the main test suite.
// This is a heuristic, not a correctness check — we only want to avoid firing
// tests against obviously mid-edit code (dangling parens, open strings, etc.).

import * as vm from 'vm';

function isBalanced(code: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];
  let i = 0;
  while (i < code.length) {
    const ch = code[i];

    // Skip single-line comments (works for // and #)
    if (ch === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (ch === '#') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    // Skip block comments
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // Skip strings (both " and ', triple quotes handled below)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      // Triple-quoted Python string
      if (code[i + 1] === quote && code[i + 2] === quote) {
        i += 3;
        while (i < code.length - 2 && !(code[i] === quote && code[i + 1] === quote && code[i + 2] === quote)) i++;
        if (i >= code.length - 2) return false; // unterminated
        i += 3;
        continue;
      }
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i += 2;
        else if (code[i] === '\n') return false; // unterminated string
        else i++;
      }
      if (i >= code.length) return false;
      i++;
      continue;
    }

    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.pop() !== pairs[ch]) return false;
    }
    i++;
  }
  return stack.length === 0;
}

function lastNonEmptyLine(code: string): string {
  const lines = code.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const t = lines[i].trim();
    if (t.length > 0) return t;
  }
  return '';
}

// Language-agnostic heuristics: brackets balanced, last line doesn't dangle.
function looksComplete(code: string): boolean {
  if (code.trim().length === 0) return false;
  if (!isBalanced(code)) return false;
  const last = lastNonEmptyLine(code);
  // Dangling operators/punctuation that strongly suggest mid-typing.
  if (/[,+\-*/=&|<>]$/.test(last)) return false;
  // Trailing backslash continuation
  if (last.endsWith('\\')) return false;
  return true;
}

export function isSyntacticallyComplete(language: string, code: string): boolean {
  if (!looksComplete(code)) return false;

  if (language === 'javascript') {
    try {
      // vm.Script only performs a parse; does not execute.
      new vm.Script(code, { filename: 'syntax-check.js' });
      return true;
    } catch {
      return false;
    }
  }

  // Python / C++ — rely on the heuristic. Python has an additional rule:
  // a trailing ':' means a pending block body.
  if (language === 'python') {
    const last = lastNonEmptyLine(code);
    if (last.endsWith(':')) return false;
  }

  return true;
}
