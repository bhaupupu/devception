// Protected-region detection for the shared editor.
// Supports `// @protected:<name>` (JS/C++) and `# @protected:<name>` (Python) markers.
// Each marker line is itself protected. If a start/end pair is found for the same <name>,
// all lines between them (inclusive) are protected. Bare markers protect only their line.

export interface ProtectedRange {
  name: string;
  startLine: number; // 1-based
  endLine: number;   // 1-based, inclusive
  signature: string; // trimmed text of the start line — used as a content-preservation guard
}

const MARKER_RE = /(?:\/\/|#)\s*@protected(?::([\w-]+))?(?::(start|end))?/i;

export function extractProtectedRanges(code: string): ProtectedRange[] {
  const lines = code.split('\n');
  const ranges: ProtectedRange[] = [];
  const openByName = new Map<string, { startLine: number; signature: string }>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = MARKER_RE.exec(line);
    if (!match) continue;

    const name = (match[1] || 'default').trim();
    const boundary = (match[2] || '').toLowerCase();
    const lineNumber = i + 1;
    const signature = line.trim();

    if (boundary === 'start') {
      openByName.set(name, { startLine: lineNumber, signature });
    } else if (boundary === 'end') {
      const open = openByName.get(name);
      if (open) {
        ranges.push({ name, startLine: open.startLine, endLine: lineNumber, signature: open.signature });
        openByName.delete(name);
      } else {
        // Orphan end marker → protect just this line
        ranges.push({ name: `${name}:end`, startLine: lineNumber, endLine: lineNumber, signature });
      }
    } else {
      ranges.push({ name, startLine: lineNumber, endLine: lineNumber, signature });
    }
  }

  // Unclosed starts → protect the start line only
  openByName.forEach((open, name) => {
    ranges.push({ name: `${name}:start`, startLine: open.startLine, endLine: open.startLine, signature: open.signature });
  });

  return ranges;
}

// Returns the list of signature strings that MUST remain present (verbatim, trimmed)
// in any accepted future edit. This is the content-based guard the server enforces.
export function getProtectedSignatures(ranges: ProtectedRange[]): string[] {
  return ranges.map((r) => r.signature).filter((s) => s.length > 0);
}

// Ratio of original content that must remain. 0.3 means the shared code can never
// shrink below 30% of its starting length — protects against "select-all + delete".
export const MIN_CONTENT_RATIO = 0.3;
export const ABSOLUTE_MIN_CONTENT_LENGTH = 80;

export function computeMinContentLength(initialLength: number): number {
  return Math.max(ABSOLUTE_MIN_CONTENT_LENGTH, Math.floor(initialLength * MIN_CONTENT_RATIO));
}
