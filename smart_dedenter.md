# Smart Dedenter Algorithm for Omni->Python Compilation

When compiling Omni (a brace-based language) to Python (an indentation-based language), handling blocks and nesting correctly is challenging, especially when the intermediate representation or the compiler's emission logic is imperfect.

The `omic` compiler sometimes emits code where indentation levels increase without a strict underlying reason (e.g. inside `native` blocks or after certain constructs), leading to `IndentationError` in Python.

To solve this, we implemented a **Smart Dedenter** post-processor in `omni.js`.

## Algorithm Logic

1.  **Iterate line by line** through the generated Python code.
2.  Maintain a `fixedLines` array of processed lines.
3.  **Look Back Mechanism**:
    - Find the last "meaningful" line (non-empty, non-comment).
4.  **Suspicious Indent Check**:
    - Compare the current line's indentation with the previous meaningful line.
    - If `currentIndent > prevIndent`:
      - Check if the previous line _should_ start a block (ends with `:`) or continues a statement (ends with `\`, `(`, `[`, `{`, `,`).
      - If the previous line **does not** signal an indent increase (no `:`, no line continuation), then the current indent is likely an artifact.
5.  **Correction**:
    - Force the current line's indentation to match the previous line (`line = prevIndent + currentTrimmed`).

## Code Snippet (JavaScript)

```javascript
// Check previous meaningful line
if (!prevContent.endsWith(":")) {
  const prevIndent = lastContentLine.match(/^(\s*)/)[1];
  const currIndent = line.match(/^(\s*)/)[1];

  // Naive check: if we are deeper than previous line but previous line didn't ask for it
  if (currIndent.length > prevIndent.length) {
    const escapes =
      prevContent.endsWith("\\") ||
      prevContent.endsWith("(") ||
      prevContent.endsWith("[") ||
      prevContent.endsWith("{") ||
      prevContent.endsWith(",");
    if (!escapes) {
      // Fix it!
      line = prevIndent + currTrimmed;
    }
  }
}
```

## Impact

This fixer successfully resolves `IndentationError` in mixed `native` blocks, allowing seamless compilation of Omni code to functional Python/Tkinter applications.
