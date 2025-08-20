import { findWordStart } from "./yaml-utils"

export function remove (node) {
  let p = node && node.parentNode
  if (p) p.removeChild(node)
}

// TODO-V3 No longer needed in CM6
export function filterPartialCompletions (cm, line, completions, property = 'text', remover) {
  const cursor = cm.getCursor()
  let lineBeforeCursor = line.substring(0, cursor.ch)
  if (remover) lineBeforeCursor = lineBeforeCursor.replace(remover, '')
  const completionBeginPos = Math.max(
    lineBeforeCursor.lastIndexOf(' '),
    lineBeforeCursor.lastIndexOf('.'),
    lineBeforeCursor.lastIndexOf('@')
  )
  const partialCompletion = lineBeforeCursor.substring(completionBeginPos + 1)
  return completions.filter(
    (c) => c[property] && c[property].toLowerCase().indexOf(partialCompletion.toLowerCase()) >= 0
  )
}

export function addTooltipHandlers (cm, ret, retriggerHint) {
  let tooltip = null
  const cursor = cm.getCursor()

  if (!ret) return
  if (ret.tooltip) return
  if (!ret.from) ret.from = cursor
  if (!ret.to) ret.to = cursor
  ret.tooltip = true

  CodeMirror.on(ret, 'close', function () {
    remove(tooltip)
  })
  CodeMirror.on(ret, 'update', function () {
    remove(tooltip)
  })
  CodeMirror.on(ret, 'pick', function () {
    setTimeout(() => {
      cm.scrollIntoView(cm.getCursor())
      if (retriggerHint) CodeMirror.commands.autocomplete(cm)
    }, 100)
  })
  CodeMirror.on(ret, 'select', function (cur, node) {
    remove(tooltip)
    let content = cur.description
    if (content) {
      tooltip = makeTooltip(
        node.parentNode.getBoundingClientRect().right + window.pageXOffset,
        node.getBoundingClientRect().top + window.pageYOffset,
        content,
        cm
      )
      tooltip.className += ' ' + cls + 'hint-doc'
    }
  })
}

/**
 * Converts a Parameter Type to CodeMirror's completion type
 *
 * Icons are styled with a CSS class created by appending the type name to "cm-completionIcon-".
 * You can define or restyle icons by defining these selectors.
 *
 * script-editor.vue also supports:
 * - string
 * - number
 * - boolean
 * - unknown
 *
 * The base library defines simple icons for:
 * - class
 * - constant
 * - enum
 * - function
 * - interface
 * - keyword
 * - method
 * - namespace
 * - property
 * - text
 * - type
 * - variable
 */
export function getCompletionType (parameterType) {
  switch (parameterType) {
    case 'TEXT': return 'string'
    case 'INTEGER': return 'number'
    case 'BOOLEAN': return 'boolean'
    default: return 'unknown'
  }
}

/**
 * Returns a CodeMirror CompletionResult object for boolean values after a colon
 *
 * @param {CompletionContext} context CodeMirror CompletionContext
 * @param {Line} line The current line
 * @param {number} colonPos The position of the colon
 * @returns {CompletionResult}
 */
export function hintBooleanValue (context, line, colonPos) {
  const trimmedLine = line.text.trimEnd()
  if (trimmedLine.endsWith('true') || trimmedLine.endsWith('false')) return

  const apply = (view, completion, _from, _to) => {
    const from = line.from + colonPos + 2
    const to = view.state.doc.lineAt(context.pos).to
    const insert = completion.label
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length }
    })
  }

  return {
    from: line.from + findWordStart(context, line),
    validFor: /\w+/,
    options: [{ label: 'true', apply, boost: 1 }, { label: 'false', apply }]
  }
}

let itemsCache = null

/**
 * Returns a CodeMirror CompletionResult object for item names
 *
 * The returned Promise resolves to a CompletionResult suitable for use with
 * CodeMirror's autocomplete. The function will fetch items (cached) and
 * construct CompletionResult that inserts the selected item into the editor.
 *
 * @param {import("@codemirror/autocomplete").CompletionContext} context CodeMirror CompletionContext
 * @param {Object} [options] - Optional modifiers.
 * @param {boolean} [options.replaceAfterColon=false] - If true, replace the text after the first colon on the current line.
 * @param {number|null} [options.indent=null] - If set, replace the entire current line and prepend this many spaces to the insertion.
 * @param {string} [options.prefix=''] - Prefix to add before the item name when inserting.
 * @param {string} [options.suffix=''] - Suffix to add after the item name when inserting.
 * @returns {Promise<import("@codemirror/autocomplete").CompletionResult>} Promise that resolves to a CompletionResult.
 */
export async function hintItems (context, { replaceAfterColon = false, indent = null, prefix = '', suffix = '' } = {}) {
  const promise = itemsCache
    ? Promise.resolve(itemsCache)
    : context.view.$oh.api.get('/rest/items?staticDataOnly=true')

  return promise.then((data) => {
    if (!itemsCache) itemsCache = data

    const apply = (view, completion, _from, _to) => {
      let from, to
      const currentLine = view.state.doc.lineAt(context.pos)
      if (indent) {
        from = currentLine.from
        to = currentLine.to
        prefix = ' '.repeat(indent) + prefix
      } else if (replaceAfterColon) {
        const colonPos = currentLine.text.indexOf(':')
        from = currentLine.from + colonPos + 2
        to = currentLine.to
      } else {
        const wordAtCursor = view.state.wordAt(context.pos)
        if (wordAtCursor) {
          // if the user typed a word, replace it
          from = wordAtCursor.from
          to = wordAtCursor.to
        } else {
          from = to = context.pos
        }
      }

      const insert = prefix + completion.label + suffix
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + insert.length }
      })
    }

    const wordAtCursor = context.state.wordAt(context.pos)
    const from = wordAtCursor ? wordAtCursor.from : context.pos
    return {
      from,
      validFor: /\w+/,
      options: data
        .map((item) => {
          return {
            label: item.name,
            info: `${item.label ? item.label + ' ' : ''}(${item.type})\n${item.state}`,
            apply
          }
        })
    }
  })
}

/**
 * Provide completion entries for a parameter's allowed options.
 *
 * @param {import("@codemirror/autocomplete").CompletionContext} context - CodeMirror completion context.
 * @param {Object} line - Current line object (as returned by state.doc.lineAt).
 * @param {Object} parameter - Parameter descriptor containing an `options` array:
 *        { options: Array<{ value: string, label?: string }> }.
 * @param {number} colonPos - Zero-based index of the colon character on the line; insertion starts after `colonPos + 2`.
 * @returns {import("@codemirror/autocomplete").CompletionResult} CompletionResult.
 */
export function hintParameterOptions (context, line, parameter, colonPos) {
  const apply = (view, completion, _from, _to) => {
    const from = line.from + colonPos + 2
    const to = view.state.doc.lineAt(context.pos).to
    const insert = completion.label
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length }
    })
  }

  let boost = 0
  return {
    from: line.from + findWordStart(context, line),
    validFor: /\w+/,
    options: parameter.options.map((o) => {
      return {
        label: o.value,
        info: o.label || o.value,
        apply,
        boost: boost-- // preserve the original order, don't sort alphabetically
      }
    }).filter((o) => o.label) // discard empty options
  }
}

/**
 * Provide completion entries for a list of parameters.
 *
 * Creates a CompletionResult that inserts parameter names at the current
 * cursor position, prepending the requested indentation so the inserted
 * text aligns with the desired column.
 *
 * @param {import("@codemirror/autocomplete").CompletionContext} context - CodeMirror completion context.
 * @param {Object} line - Current line object (as returned by state.doc.lineAt).
 * @param {Array<{name: string, description?: string, type?: string}>} parameters - Array of parameter descriptors.
 *        Each descriptor should have a `name` and may include `description` and `type`.
 * @param {number} indent - Number of spaces to prepend so the inserted parameter lines match the target indent.
 * @returns {import("@codemirror/autocomplete").CompletionResult} A CompletionResult with `from`, `validFor` and `options`.
 */
export function hintParameters(context, line, parameters, indent) {
  const currentIndent = findWordStart(context, line)
  if (indent < currentIndent) return // we can't tell it to insert before "from" unless we use an apply function
  const prepends = ' '.repeat(indent - currentIndent)
  return {
    from: line.from + currentIndent,
    validFor: /\w+/,
    options: parameters.map((p) => {
      return {
        label: p.name,
        apply: prepends + p.name + ': ',
        info: p.description,
        type: getCompletionType(p.type)
      }
    })
  }
}
