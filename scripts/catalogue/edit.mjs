/**
 * Text surgery for the generated artefacts.
 *
 * The copy tables live inside large hand-written files — `public/app.js` is
 * half a megabyte of runtime and copy in one file. Regenerating those files
 * whole would drown the change in reformatting, so the generator edits the
 * one member it owns and leaves every other byte alone.
 *
 * These helpers find a member's exact span in the source text. They do not
 * evaluate the file: they read it as text, which keeps the edit honest and
 * the diff small.
 */

/** Given the index of an opening brace or bracket, return the index just past its match. */
export function matchEnd(source, open) {
  const openChar = source[open];
  const closeChar = openChar === '{' ? '}' : openChar === '[' ? ']' : ')';
  let depth = 0;
  let i = open;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      i++;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++;
        i++;
      }
    } else if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++;
    } else if (ch === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i);
      i = end === -1 ? source.length : end + 1;
    } else if (ch === '{' || ch === '[' || ch === '(') {
      depth++;
    } else if (ch === '}' || ch === ']' || ch === ')') {
      depth--;
      if (depth === 0) return i + 1;
    }
    i++;
  }
  throw new Error(`unbalanced ${openChar} at ${open}`);
}

/**
 * The members of an object, at its own depth.
 * `source[start]` is the object's opening brace; `end` is just past its close.
 * Each member is {name, keyStart, valueStart, valueEnd}.
 *
 * Keys may be bare identifiers (`panels: {`, `p01: {`) or quoted strings
 * (`"panels": {`) — the copy tables use both, so both are read.
 */
export function members(source, start, end) {
  const found = [];
  let depth = 0;
  let i = start;
  const isIdentifierStart = (ch) => /[A-Za-z_$]/.test(ch);
  const isIdentifierPart = (ch) => /[A-Za-z0-9_$]/.test(ch);

  while (i < end) {
    const ch = source[i];

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      const textStart = i;
      i++;
      let text = '';
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') { text += source[i] + source[i + 1]; i += 2; continue; }
        text += source[i];
        i++;
      }
      i++;
      if (depth === 1) {
        let j = i;
        while (j < end && /\s/.test(source[j])) j++;
        if (source[j] === ':') {
          const valueStart = skipSpace(source, j + 1);
          const valueEnd = valueEndOf(source, valueStart, end);
          found.push({ name: text, keyStart: textStart, valueStart, valueEnd });
          i = valueEnd;
          continue;
        }
      }
      continue;
    }

    if (isIdentifierStart(ch)) {
      const textStart = i;
      let text = '';
      while (i < source.length && isIdentifierPart(source[i])) { text += source[i]; i++; }
      if (depth === 1) {
        let j = i;
        while (j < end && /\s/.test(source[j])) j++;
        if (source[j] === ':') {
          const valueStart = skipSpace(source, j + 1);
          const valueEnd = valueEndOf(source, valueStart, end);
          found.push({ name: text, keyStart: textStart, valueStart, valueEnd });
          i = valueEnd;
          continue;
        }
      }
      continue;
    }

    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && source[i + 1] === '*') {
      const close = source.indexOf('*/', i);
      i = close === -1 ? source.length : close + 1;
      continue;
    }
    if (ch === '{' || ch === '[' || ch === '(') { depth++; i++; continue; }
    if (ch === '}' || ch === ']' || ch === ')') { depth--; i++; continue; }
    i++;
  }
  return found;
}

/** The index of the next non-space character at or after `from`. */
function skipSpace(source, from) {
  let i = from;
  while (i < source.length && /\s/.test(source[i])) i++;
  return i;
}

/** The span of the value that starts at `valueStart` — object, array, string or literal. */
function valueEndOf(source, valueStart, limit) {
  let i = valueStart;
  while (i < limit && /\s/.test(source[i])) i++;
  const ch = source[i];
  if (ch === '{' || ch === '[') return matchEnd(source, i);
  if (ch === '"' || ch === "'" || ch === '`') {
    const quote = ch;
    i++;
    while (i < source.length && source[i] !== quote) {
      if (source[i] === '\\') i++;
      i++;
    }
    return i + 1;
  }
  // A bare literal: up to the next comma or newline at this level.
  while (i < limit && source[i] !== ',' && source[i] !== '\n') i++;
  return i;
}

/** The span of `const NAME = { … }` — the object's braces. */
export function literalSpan(source, declaration) {
  const at = source.indexOf(declaration);
  if (at < 0) throw new Error(`not found: ${declaration}`);
  const open = source.indexOf('{', at);
  return { start: open, end: matchEnd(source, open), at };
}

/**
 * The span of an HTML element: given the index of its opening tag, return
 * where its content ends and where its closing tag ends.
 */
export function elementEnd(source, openIndex) {
  const head = source.slice(openIndex, source.indexOf('>', openIndex) + 1);
  const tag = head.match(/^<([a-zA-Z][\w-]*)/)?.[1];
  if (!tag) throw new Error(`not an element at ${openIndex}`);
  const pattern = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
  pattern.lastIndex = openIndex;
  let depth = 0;
  let match;
  while ((match = pattern.exec(source))) {
    if (match[1] === '/') {
      depth--;
      if (depth === 0) return { contentEnd: match.index, closeEnd: pattern.lastIndex };
    } else {
      depth++;
    }
  }
  throw new Error(`unclosed <${tag}> at ${openIndex}`);
}

/** Replace a span with new text. */
export function splice(source, start, end, text) {
  return source.slice(0, start) + text + source.slice(end);
}

/**
 * Find a member by path inside an object literal, e.g. `['en', 'panels']`.
 * Returns the span of the member's value.
 */
export function memberPath(source, declaration, path) {
  let { start, end } = literalSpan(source, declaration);
  if (!path.length) {
    return { name: null, keyStart: start, valueStart: start, valueEnd: end };
  }
  let found = null;
  for (const name of path) {
    const list = members(source, start, end);
    const member = list.find((m) => m.name === name);
    if (!member) throw new Error(`no member "${name}" in ${declaration} ${path.join('.')}`);
    found = member;
    start = member.valueStart;
    end = member.valueEnd;
  }
  return found;
}

/**
 * A JavaScript string literal, in the house style: single quotes where they
 * are safe, double quotes where the text contains an apostrophe-heavy run.
 */
export function jsString(value) {
  const text = String(value);
  if (text.includes("'") && !text.includes('"')) return JSON.stringify(text);
  if (text.includes("'")) {
    // Prefer single quotes with escapes, matching the file's existing style.
    return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
  }
  return `'${text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')}'`;
}

/** A JavaScript object key: bare when it can be, quoted when it cannot. */
export function jsKey(key) {
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return key;
  return `'${String(key).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** HTML-escape for text that falls inside markup. */
export function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
