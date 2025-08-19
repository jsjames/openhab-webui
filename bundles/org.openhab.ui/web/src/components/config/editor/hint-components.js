import { lineIndent, findParent, isConfig, isComponent, isSlots, findComponentType, findWordStart } from './yaml-utils'
import { cls, getCompletionType } from './hint-utils'

import * as f7vue from 'framework7-vue'
import { app } from '@/main'

import * as SystemWidgets from '@/components/widgets/system'
import * as StandardWidgets from '@/components/widgets/standard'
import * as StandardListWidgets from '@/components/widgets/standard/list'
import * as StandardCellWidgets from '@/components/widgets/standard/cell'
import * as LayoutWidgets from '@/components/widgets/layout'
import * as PlanWidgets from '@/components/widgets/plan'
import * as MapWidgets from '@/components/widgets/map'
import { OhChartPageDefinition } from '@/assets/definitions/widgets/chart/page'
import ChartWidgetsDefinitions from '@/assets/definitions/widgets/chart/index'
import {
  OhLocationCardParameters,
  OhEquipmentCardParameters,
  OhPropertyCardParameters
} from '@/assets/definitions/widgets/home'
import { BlockLibrariesComponentDefinitions } from '@/assets/definitions/blockly/libraries-components'

let itemsCache = null

let ohComponents = null
let f7Components = null

function getOhComponents () {
  ohComponents ??= Object
    .values({
      ...SystemWidgets,
      ...LayoutWidgets,
      ...StandardWidgets,
      ...StandardListWidgets,
      ...StandardCellWidgets
    })
    .filter((w) => w.widget && typeof w.widget === 'function')
    .map((c) => c.widget())
    .sort((c1, c2) => c1.name.localeCompare(c2.name))
  return ohComponents
}

function getF7Components () {
  f7Components ??= Object.values(f7vue).filter((m) => m.name && m.name.startsWith('f7-')).sort((c1, c2) => c1.name.localeCompare(c2.name))
  return f7Components
}

function getWidgetDefinitions (context) {
  const mode = context.view.originalMode
  const componentType = mode.includes(';type=') ? mode.split('=')[1] : undefined
  switch (componentType) {
    case 'chart':
      return [
        OhChartPageDefinition(),
        ...Object.keys(ChartWidgetsDefinitions).map((name) => {
          return Object.assign({}, ChartWidgetsDefinitions[name], { name })
        })
      ]
    case 'plan':
      return Object.values(PlanWidgets).map((c) => c.widget()).sort((c1, c2) => c1.name.localeCompare(c2.name))
    case 'map':
      return Object.values(MapWidgets).map((c) => c.widget()).sort((c1, c2) => c1.name.localeCompare(c2.name))
    case 'blocks':
      return Object.values(BlockLibrariesComponentDefinitions).map((c) => c()).sort((c1, c2) => c1.name.localeCompare(c2.name))
    default:
      return [
        ...(componentType === 'home'
          ? [OhLocationCardParameters(), OhEquipmentCardParameters(), OhPropertyCardParameters()]
          : []),
        ...getOhComponents(),
        ...getF7Components(),
        ...Object.keys(ChartWidgetsDefinitions).map((name) => {
          return Object.assign({}, ChartWidgetsDefinitions[name], { name })
        })
      ]
  }
}

function hintItems (context, line, replaceAfterColon, addStatePropertySuffix, addQuotes) {
  const promise = itemsCache
    ? Promise.resolve(itemsCache)
    : context.view.$oh.api.get('/rest/items?staticDataOnly=true')
  return promise.then((data) => {
    if (!itemsCache) itemsCache = data

    const apply = (view, completion, _from, _to) => {
      let from, to
      const currentLine = view.state.doc.lineAt(context.pos)
      if (replaceAfterColon) {
        const colonPos = currentLine.text.indexOf(':')
        from = currentLine.from + colonPos + 2
        to = currentLine.to
      } else  {
        const wordAtCursor = view.state.wordAt(context.pos)
        if (wordAtCursor) {
          // if the user typed a word, replace it
          from = wordAtCursor.from
          to = wordAtCursor.to
        } else {
          from = to = context.pos
        }
      }

      const insert =
        (addQuotes ? '\'' : '') +
        completion.label +
        (addStatePropertySuffix ? '.state' : '') +
        (addQuotes ? '\'' : '')
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + insert.length }
      })
    }

    // Works for @, @@, #, and items., just start after the symbol
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

function hintOptions (context, line, parameter, colonPos) {
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

function hintExpression (context, line) {
  const cursor = context.pos - line.from

  const lastOp = line.text.substring(0, cursor).replace(/([@#.])[A-Za-z0-9_-]*$/, '$1')
  if (lastOp.endsWith('@') || lastOp.endsWith('#')) {
    return hintItems(context, line, false, false, true)
  } else if (lastOp.endsWith('items.')) {
    return hintItems(context, line, false, true)
  }

  const wordStart = findWordStart(context, line, /[^\s=.]/)
  if (line.text[wordStart - 1] !== ' ' && line.text[wordStart - 1] !== '=') return

  let boost = 0
  return {
    from: line.from + wordStart,
    validFor: /[^\s=.]+/,
    options: [
      {
        label: 'items',
        apply: 'items.',
        info: 'Access to item states'
      },
      {
        label: 'props',
        apply: 'props.',
        info: 'Access to the props of the parent root component'
      },
      {
        label: 'config',
        apply: 'config.',
        info: 'Access to the configuration of the current component'
      },
      {
        label: 'vars',
        apply: 'vars.',
        info: 'Access to context vars'
      },
      {
        label: 'fn',
        apply: 'fn.',
        info: 'Access to oh-context functions'
      },
      {
        label: 'const',
        apply: 'const.',
        info: 'Access to oh-context constants'
      },
      {
        label: 'loop',
        apply: 'loop.',
        info: 'Access to oh-repeater loop variables'
      },
      {
        label: 'JSON',
        apply: 'JSON.',
        info: 'Access to the JSON object functions'
      },
      {
        label: 'Math',
        apply: 'Math.',
        info: 'Access to the Math object functions'
      },
      {
        label: 'Number',
        apply: 'Number.',
        info: 'Access to the Number object functions'
      },
      {
        label: 'theme',
        info: 'The current theme: aurora, ios, or md'
      },
      {
        label: 'themeOptions',
        info: 'Object with current theme options'
      },
      {
        label: 'device',
        info: 'Object with information about the current device & browser'
      },
      {
        label: 'user',
        info: 'Access the username and roles of the logged in user'
      },
      {
        label: 'screen',
        info: 'Object with information about the screen and available view area'
      },
      {
        label: 'dayjs',
        info: 'Access to the Day.js object for date manipulation & formatting'
      }
    ].map((option) => {
      // Enforce insertion order by applying boost to override CodeMirror's automatic sorting
      return { ...option, boost: boost-- }
    })
  }
}

function f7ComponentParameters (componentName) {
  console.debug(f7vue)
  const f7vueComponent = Object.values(f7vue).find((c) => c.name === componentName)
  console.debug(f7vueComponent)
  if (!f7vueComponent) return []

  const defaultProps = {}
  if (typeof f7vueComponent.props === 'object') {
    for (const [name, props] of Object.entries(f7vueComponent.props)) {
      if (props && typeof props === 'object' && 'default' in props) defaultProps[name] = props.default
    }
  }

  const resolvePropTypeName = (p) => {
    if (!p) return null
    const extract = (t) => {
      if (!t) return null
      if (typeof t === 'function') return t.name || 'Object'
      if (Array.isArray(t)) return t.map(extract).join(' | ')
      if (typeof t === 'string') return t
      return null
    }
    if (p.type !== undefined) return extract(p.type)
    return extract(p)
  }

  const PARAM_TYPES = {
    String: 'TEXT',
    Number: 'INTEGER',
    Boolean: 'BOOLEAN'
  }

  const params = Object.entries(f7vueComponent.props).map(([propName, prop]) => {
    const propType = resolvePropTypeName(prop)
    const defaultValue = defaultProps[propName] !== undefined ? 'Default value: ' + JSON.stringify(defaultProps[propName]) : ''
    return {
      name: propName,
      description: `${propType}\n${defaultValue}\n\nSee ${componentName} docs`,
      type: PARAM_TYPES[propType] ?? 'UNKNOWN'
    }
  })

  return params
}

function hintBooleanValue (context, line, column, colonPos) {
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

function hintConfig (context, line, parentLine) {
  const componentType = findComponentType(context, parentLine)
  console.debug('hinting config for component type:', componentType)
  if (!componentType) return
  const currentIndent = lineIndent(line)
  const indent = lineIndent(parentLine)
  const colonPos = line.text.indexOf(':')
  const column = context.pos - line.from
  const afterColon = colonPos > 0 && column > colonPos
  const widgetDefinition = getWidgetDefinitions(context).find((d) => d.name === componentType)
  const parameters =
    componentType.startsWith('f7-')
      ? f7ComponentParameters(componentType)
      : widgetDefinition && widgetDefinition.props
        ? widgetDefinition.props.parameters
        : []
  if (componentType.startsWith('oh-')) {
    // try our luck and find a matching underlying f7-vue component...
    const f7parameters = f7ComponentParameters(
      componentType.replace('oh-', 'f7-').replace('-card', '')
    )
    if (f7parameters.length) {
      parameters.push(...f7parameters.filter((p) => !parameters.find((p2) => p2.name === p.name)))
    }
  }
  if (afterColon) {
    if (line.text.includes('=')) {
      return hintExpression(context, line)
    }
    const parameterName = line.text.substring(0, colonPos).trim()
    const parameter = parameters.find((p) => p.name === parameterName)
    if (parameter) {
      if (parameter.type === 'BOOLEAN') {
        return hintBooleanValue(context, line, column, colonPos)
      } else if (parameter.context === 'item') {
        return hintItems(context, line, true)
      } else if (parameter.options) {
        return hintOptions(context, line, parameter, colonPos)
      }
    }
  } else {
    console.debug(widgetDefinition)

    const prepends = ' '.repeat(indent + 2 - currentIndent)
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
}

function hintComponents (context, line) {
  const colonPos = line.text.indexOf(':')
  const column = context.pos - line.from
  if (column < colonPos + 2) return

  const apply = (view, completion, _from, _to) => {
    const from = line.from + colonPos + 2
    const to = view.state.doc.lineAt(context.pos).to
    const insert = completion.label
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length }
    })
  }

  const components = getWidgetDefinitions(context)
  let boost = 0
  return {
    from: line.from + findWordStart(context, line),
    validFor: /[\w-]+/,
    options: components.map((c) => {
      return {
        label: c.name,
        info: c.description || 'A component of type ' + c.name,
        apply,
        boost: boost-- // preserve order
      }
    })
  }
}

function hintComponentStructure (context, line, parentLine) {
  const indent = parentLine ? lineIndent(parentLine) : -2
  const apply = (view, completion, _from, _to) => {
    const from = line.from
    const to = view.state.doc.lineAt(context.pos).to
    const insert = completion.code
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length }
    })
  }

  return {
    from: line.from + findWordStart(context, line),
    validFor: /\w+/,
    options: [
      {
        label: 'config',
        apply,
        code: ' '.repeat(indent + 2) + 'config:\n' + ' '.repeat(indent + 4)
      },
      {
        label: 'slots',
        apply,
        code: ' '.repeat(indent + 2) + 'slots:\n' + ' '.repeat(indent + 4)
      },
      {
        label: 'default slot',
        apply,
        code: ' '.repeat(indent + 2) +
          'slots:\n' +
          ' '.repeat(indent + 4) +
          'default:\n' +
          ' '.repeat(indent + 6) +
          '- component: '
      }
    ]
  }
}

function hintSlots (context, line, parentLine) {
  const apply = (view, completion, _from, _to) => {
    const indent = lineIndent(parentLine)
    const insert =
          ' '.repeat(indent + 2) +
          `- component: ${completion.label}\n` +
          // ' '.repeat(indent + 4) + 'config:\n' +
          ' '.repeat(indent + 4)
    const from = line.from
    const to = view.state.doc.lineAt(context.pos).to
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length }
    })
  }

  const definitions = getWidgetDefinitions(context)
  let boost = 0
  return {
    from: line.from + findWordStart(context, line),
    validFor: /[\w-]+/,
    options: definitions.map((c) => {
      return {
        label: c.name,
        info: c.description || 'A component of type ' + c.name,
        apply,
        boost: boost--
      }
    })
  }
}

export default function hint (context) {
  const currentLine = context.state.doc.lineAt(context.pos)
  const parentLine = findParent(context, currentLine)
  console.debug('parent line', parentLine)

  if (isConfig(parentLine)) {
    return hintConfig(context, currentLine, parentLine)
  } else if (isComponent(parentLine) || lineIndent(currentLine) === 0) {
    return hintComponentStructure(context, currentLine, parentLine)
  } else if (isComponent(currentLine)) {
    return hintComponents(context, currentLine)
  } else {
    if (parentLine) {
      const grandparentLine = findParent(context, parentLine)
      if (isSlots(grandparentLine)) {
        return hintSlots(context, currentLine, parentLine)
      }
    }
  }
}
