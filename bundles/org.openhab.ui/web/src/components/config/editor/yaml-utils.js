export function lineIndent (line) {
  const match = line.text.match(/^ +/)
  if (match && match.length === 1) return match[0].length
  return 0
}

export function findParent (context, line) {
  // If the line is all blank, assume the current indent is at the cursor
  const currentIndent = line.text.match(/^\s*$/) ? context.pos - line.from : lineIndent(line)
  for (let l = line.number - 1; l >= 1; l--) {
    line = context.state.doc.line(l)
    if (line.text.match(/^\s*$/)) continue // skip empty lines
    if (lineIndent(line) < currentIndent) return line
  }
}

export function findParentRoot (cm, linenr) {
  for (let l = linenr; l >= 0; l--) {
    if (lineIndent(cm, l) === 0) return l
  }
}

/**
 * Finds the start of the word at the cursor position.
 *
 * If the cursor is inside or at the end of a "word", find the start of that word
 * otherwise just return the cursor position.
 *
 * See also CodeMirror's EditorState.wordAt, which uses /\w/ to search.
 *
 * @param context completion context
 * @param line CodeMirror Line object where context.pos is located
 * @param wordChar a regex that matches characters that are part of a word, defaults to non-space characters
 * @returns the column position relative to the given line
 */
export function findWordStart (context, line, wordChar = /\S/) {
  let column = context.pos - line.from
  while (column > 0 && wordChar.test(line.text[column - 1])) {
    column--
  }
  return column
}

export function findComponentType (context, line) {
  const currentIndent = lineIndent(line)
  for (let l = line.number - 1; l >= 1; l--) {
    line = context.state.doc.line(l)
    const indent = lineIndent(line)
    if (indent === 0 || indent < currentIndent) {
      const match = line.text.match(/component: (.*)$/)
      if (match && match.length === 2) return match[1]
    }
  }
}

export function isConfig (line) {
  if (!line) return false
  return line.text.match(/^ *config(uration)?:/)
}

export function isSlots (line) {
  if (!line) return false
  return line.text.match(/^ *slots:/)
}

export function isComponent (line) {
  if (!line) return false
  return line.text.match(/^ *-? ?component:/)
}

export function isRuleSection (line) {
  if (!line) return false
  return line.text.match(/^(triggers|conditions|actions|items):/)
}

export function isChannelsSection (line) {
  if (!line) return false
  return line.text.match(/^channels:/)
}
