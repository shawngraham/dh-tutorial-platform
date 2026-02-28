/**
 * Strip common leading whitespace from template literal code strings.
 *
 * Template literals in lessons.ts are indented to match the surrounding
 * TypeScript structure, which adds unwanted leading spaces to the Python
 * code. This function finds the minimum indentation across non-empty
 * continuation lines (lines after the first) and strips that many spaces
 * from every continuation line.
 */
export function dedent(str: string): string {
  const lines = str.split('\n');
  if (lines.length <= 1) return str;

  // Find minimum indentation of non-empty continuation lines
  let minIndent = Infinity;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;
    minIndent = Math.min(minIndent, indent);
  }

  if (minIndent === Infinity || minIndent === 0) return str;

  return [
    lines[0],
    ...lines.slice(1).map((line) =>
      line.length >= minIndent ? line.slice(minIndent) : line
    ),
  ].join('\n');
}
