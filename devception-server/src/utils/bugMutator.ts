// Server-side sabotage mutator. The imposter's "Inject Bug" and "Variable Shadow"
// abilities both work by scanning the live shared code, finding a believable
// edit site, and emitting a Monaco-style replace op. Two design rules:
//
//   1. The mutation must be *plausible* — never inject syntactically-broken
//      code (`throw new Error("Sabotaged!")`-style placeholders). Imposters who
//      give themselves away on the first sabotage have no game.
//   2. The mutation must respect protected regions. We only edit text that
//      lies fully outside any protected range (the caller passes those in).

import { extractProtectedRanges } from './protectedCode';

export type Language = 'python' | 'javascript' | 'cpp' | 'c++';

export interface BugMutation {
  rangeOffset: number;
  rangeLength: number;
  text: string;
  description: string; // server log only — never sent to clients
  affectedLine: number; // 0-indexed
}

interface Pattern {
  // Match against the live code. Group 1 is the slice that gets replaced; if
  // the regex has no capture, the whole match is replaced.
  regex: RegExp;
  // Replacement text for group 1 (or the whole match).
  replace: (m: RegExpExecArray) => string;
  // Short label for diagnostics.
  label: string;
}

// Bugs are listed by category so the chooser can mix categories instead of
// picking the same comparator-flip every time. Each category has a few realistic
// variations.
const PY_BUGS: Pattern[] = [
  // Comparator flips
  { regex: /([^=!<>])(<)(?!=)/, replace: () => '<=', label: 'py-lt-to-lte' },
  { regex: /([^=!<>])(>)(?!=)/, replace: () => '>=', label: 'py-gt-to-gte' },
  { regex: /([^=!<>])(<=)/, replace: () => '<', label: 'py-lte-to-lt' },
  { regex: /([^=!<>])(>=)/, replace: () => '>', label: 'py-gte-to-gt' },
  { regex: /([^=!<>])(==)(?!=)/, replace: () => '!=', label: 'py-eq-to-neq' },
  // Off-by-one
  { regex: /\brange\(\s*([A-Za-z_][\w]*)\s*\)/, replace: (m) => `range(${m[1]} - 1)`, label: 'py-range-shrink' },
  { regex: /\brange\(\s*(\d+)\s*\)/, replace: (m) => `range(${Math.max(0, Number(m[1]) - 1)})`, label: 'py-range-shrink-lit' },
  { regex: /\+=\s*1\b/, replace: () => '+= 2', label: 'py-incr-skip' },
  { regex: /-=\s*1\b/, replace: () => '-= 2', label: 'py-decr-skip' },
  // Boolean / logic flips
  { regex: /\band\b/, replace: () => 'or', label: 'py-and-to-or' },
  { regex: /\bor\b/, replace: () => 'and', label: 'py-or-to-and' },
  { regex: /\bnot\s+/, replace: () => '', label: 'py-drop-not' },
  // Wrong return — turn `return X` into `return None` only when X is a simple ident
  { regex: /\breturn\s+([A-Za-z_][\w]*)\s*$/m, replace: () => 'return None', label: 'py-return-none' },
];

const JS_BUGS: Pattern[] = [
  // Comparator flips
  { regex: /([^=!<>])(<)(?!=)/, replace: () => '<=', label: 'js-lt-to-lte' },
  { regex: /([^=!<>])(>)(?!=)/, replace: () => '>=', label: 'js-gt-to-gte' },
  { regex: /([^=!<>])(<=)/, replace: () => '<', label: 'js-lte-to-lt' },
  { regex: /([^=!<>])(>=)/, replace: () => '>', label: 'js-gte-to-gt' },
  // Equality looseness
  { regex: /(===)/, replace: () => '==', label: 'js-strict-to-loose' },
  { regex: /(!==)/, replace: () => '!=', label: 'js-strict-neq-to-loose' },
  // Off-by-one
  { regex: /(\.length)\b(?!\s*[-+])/, replace: () => '.length - 1', label: 'js-length-minus-1' },
  { regex: /\+\+/, replace: () => '--', label: 'js-incr-to-decr' },
  { regex: /(?:^|\s)--/, replace: () => '++', label: 'js-decr-to-incr' },
  // Async timing — drop a stray await
  { regex: /\bawait\s+/, replace: () => '', label: 'js-drop-await' },
  // Wrong return — turn simple `return X;` into `return null;`
  { regex: /\breturn\s+([A-Za-z_$][\w$]*)\s*;/, replace: () => 'return null;', label: 'js-return-null' },
  // Boolean flips
  { regex: /\btrue\b/, replace: () => 'false', label: 'js-true-to-false' },
  { regex: /\bfalse\b/, replace: () => 'true', label: 'js-false-to-true' },
  // Logic flips
  { regex: /(&&)/, replace: () => '||', label: 'js-and-to-or' },
  { regex: /(\|\|)/, replace: () => '&&', label: 'js-or-to-and' },
];

const CPP_BUGS: Pattern[] = [
  { regex: /([^=!<>])(<)(?!=)/, replace: () => '<=', label: 'cpp-lt-to-lte' },
  { regex: /([^=!<>])(>)(?!=)/, replace: () => '>=', label: 'cpp-gt-to-gte' },
  { regex: /([^=!<>])(==)(?!=)/, replace: () => '!=', label: 'cpp-eq-to-neq' },
  { regex: /\+\+/, replace: () => '--', label: 'cpp-incr-to-decr' },
  { regex: /\.size\(\)/, replace: () => '.size() - 1', label: 'cpp-size-minus-1' },
  { regex: /(&&)/, replace: () => '||', label: 'cpp-and-to-or' },
  { regex: /(\|\|)/, replace: () => '&&', label: 'cpp-or-to-and' },
];

function patternsFor(language: string): Pattern[] {
  if (language === 'python') return PY_BUGS;
  if (language === 'javascript') return JS_BUGS;
  if (language === 'cpp' || language === 'c++') return CPP_BUGS;
  return [];
}

// Returns the byte offsets of every protected character so the mutator can
// avoid touching any of them. Built from the same protectedCode parser used
// by the editor handler so the rules stay in sync.
function protectedOffsets(code: string): Array<[number, number]> {
  const ranges = extractProtectedRanges(code);
  const lines = code.split('\n');
  // Pre-compute line start offsets.
  const lineStart: number[] = [0];
  for (let i = 0; i < lines.length; i++) lineStart.push(lineStart[i] + lines[i].length + 1);

  return ranges.map((r) => {
    // ProtectedRange line numbers are 1-based; convert to 0-based array index.
    const startIdx = Math.max(0, r.startLine - 1);
    const endIdx = Math.min(r.endLine - 1, lines.length - 1);
    const startOffset = lineStart[startIdx] ?? 0;
    const endOffset = (lineStart[endIdx] ?? 0) + (lines[endIdx]?.length ?? 0);
    return [startOffset, endOffset] as [number, number];
  });
}

function offsetIsProtected(offset: number, length: number, ranges: Array<[number, number]>): boolean {
  const end = offset + length;
  for (const [s, e] of ranges) {
    if (offset < e && end > s) return true;
  }
  return false;
}

function offsetToLine(code: string, offset: number): number {
  let line = 0;
  for (let i = 0; i < offset && i < code.length; i++) if (code[i] === '\n') line++;
  return line;
}

// Find every regex match (with all-occurrences semantics) and pick one outside
// any protected range. We use Math.random() at the *match* level — uniform over
// non-protected hits — so the pattern itself isn't biased by occurrence count.
function pickMatch(code: string, pattern: Pattern, protectedRanges: Array<[number, number]>):
  | { offset: number; length: number; replacement: string }
  | null
{
  const flags = pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g';
  const re = new RegExp(pattern.regex.source, flags);
  const candidates: Array<{ offset: number; length: number; replacement: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    // The replaced span is the last capture group if present, else full match.
    let span: { offset: number; length: number };
    if (m.length > 1) {
      const groupIdx = m.length - 1;
      const groupStart = m.index + m[0].indexOf(m[groupIdx]);
      span = { offset: groupStart, length: m[groupIdx].length };
    } else {
      span = { offset: m.index, length: m[0].length };
    }
    if (!offsetIsProtected(span.offset, span.length, protectedRanges)) {
      candidates.push({ ...span, replacement: pattern.replace(m) });
    }
    // Avoid infinite loop on zero-width matches.
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Public API: pick a believable bug to inject into `code`. Returns null only
// when no eligible mutation exists (very short / mostly-protected code).
export function pickBugMutation(language: string, code: string): BugMutation | null {
  const patterns = patternsFor(language);
  if (patterns.length === 0 || !code) return null;
  const ranges = protectedOffsets(code);

  // Try patterns in random order so consecutive sabotages don't always hit the
  // same kind of operator.
  const shuffled = [...patterns].sort(() => Math.random() - 0.5);
  for (const p of shuffled) {
    const hit = pickMatch(code, p, ranges);
    if (hit) {
      return {
        rangeOffset: hit.offset,
        rangeLength: hit.length,
        text: hit.replacement,
        description: p.label,
        affectedLine: offsetToLine(code, hit.offset),
      };
    }
  }
  return null;
}

// Variable Shadow: pick an identifier that's been assigned at the top of a
// function body, then insert a redundant `name = None` (Python) or `name = null;`
// (JS) line that shadows the value. The user's logic still runs but the variable
// they relied on is wiped — a hidden, hard-to-locate failure mode.
//
// We only insert at line boundaries (never mid-token) and only when we can find
// an indented assignment to mimic. Failure to find a site → returns null and
// the caller falls back to a no-op or alternate sabotage.
export function pickShadowMutation(language: string, code: string): BugMutation | null {
  if (!code) return null;
  const ranges = protectedOffsets(code);
  const lines = code.split('\n');

  // Index line starts.
  const lineStart: number[] = [0];
  for (let i = 0; i < lines.length; i++) lineStart.push(lineStart[i] + lines[i].length + 1);

  // Pattern by language for the assignment line we'll mimic.
  let assignRe: RegExp;
  let blank: (name: string, indent: string) => string;
  if (language === 'python') {
    assignRe = /^(\s+)([A-Za-z_][\w]*)\s*=\s*[^=]/;
    blank = (name, indent) => `${indent}${name} = None\n`;
  } else if (language === 'javascript') {
    assignRe = /^(\s+)(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/;
    blank = (name, indent) => `${indent}${name} = null;\n`;
  } else if (language === 'cpp' || language === 'c++') {
    // C++ shadowing is too risky (type system catches it). Fall back to a small
    // boundary mutation by reusing the bug picker's c++ patterns.
    return pickBugMutation(language, code);
  } else {
    return null;
  }

  const candidates: Array<{ name: string; indent: string; insertOffset: number; line: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = assignRe.exec(lines[i]);
    if (!m) continue;
    const indent = m[1];
    const name = m[2];
    // We insert *after* this line so the shadow takes effect for any subsequent
    // read. Inserting before would just be overwritten by the assignment.
    const insertLine = i + 1;
    const insertOffset = lineStart[insertLine] ?? code.length;
    if (!offsetIsProtected(insertOffset, 0, ranges)) {
      candidates.push({ name, indent, insertOffset, line: insertLine });
    }
  }

  if (candidates.length === 0) {
    // No safe insertion site — fall back to a comparator-style mutation so the
    // ability never feels like a no-op.
    return pickBugMutation(language, code);
  }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    rangeOffset: pick.insertOffset,
    rangeLength: 0,
    text: blank(pick.name, pick.indent),
    description: `shadow:${pick.name}`,
    affectedLine: pick.line,
  };
}
