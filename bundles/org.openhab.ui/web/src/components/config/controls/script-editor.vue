<template>
  <codemirror
    ref="cm"
    class="code-editor-fit"
    :model-value="value"
    :extensions="extensions"
    @ready="onCmReady"
    @change="onCmCodeChange"
    />
</template>

<style lang="stylus">
.code-editor-fit
  position absolute
  left 0
  top var(--f7-navbar-height)
  height calc(100% - var(--f7-navbar-height))
  width 100%
  display flex
  background white
  align-items center
  justify-content center
  .CodeMirror
    height 100%
    width 100%

    .CodeMirror-line
      line-height 1.3

    .cm-lkcampbell-indent-guides:not(.CodeMirror-lint-mark-error)
      margin-top -5px
      background-repeat repeat-y
      background-image url("data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='1px' height='2px'><rect width='1' height='1' style='fill:%2377777777' /></svg>")
      position relative

.CodeMirror-hints
  z-index 999999
.CodeMirror-Tern-tooltip
  z-index 999998
  opacity 1 !important
  position absolute
.CodeMirror-lint-tooltip
  z-index 999998
  opacity 1 !important
  position absolute
</style>

<script>
import openhab from '@/js/openhab'
import { useThemeOptionsStore } from '@/js/stores/theme-options'
import { mapStores } from 'pinia'

import { Codemirror } from 'vue-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, EditorSelection } from "@codemirror/state"
import { defaultKeymap, historyKeymap, insertTab, indentLess, indentMore } from '@codemirror/commands'
import { StreamLanguage, getIndentUnit } from '@codemirror/language'
import { autocompletion, completeFromList, closeBrackets } from '@codemirror/autocomplete'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'

// require styles
//TODO-V3 import 'codemirror/lib/codemirror.css';

// languages
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { groovy } from '@codemirror/legacy-modes/mode/groovy'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { java } from '@codemirror/lang-java'

import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { jinja2 } from '@codemirror/legacy-modes/mode/jinja2'
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { shell } from '@codemirror/legacy-modes/mode/shell';

import { gruvboxDark } from '@uiw/codemirror-theme-gruvbox-dark'

// for autocomplete
//TODO-V3 import 'codemirror/addon/hint/show-hint.js';
//TODO-V3 import 'codemirror/addon/hint/show-hint.css';
//TODO-V3 import 'codemirror/addon/hint/anyword-hint.js';
//TODO-V3 import 'codemirror/addon/dialog/dialog.js';
//TODO-V3 import 'codemirror/addon/dialog/dialog.css';
//TODO-V3 import 'codemirror/addon/tern/tern.js';
//TODO-V3 import 'codemirror/addon/tern/tern.css';

// for folding
import { codeFolding } from '@codemirror/language'

// for linting
//TODO-V3 import 'codemirror/addon/lint/lint.js';
//TODO-V3 import 'codemirror/addon/lint/lint.css';
import YAML from 'yaml'

import tern from 'tern'
import infer from 'tern/lib/infer'

// import 'tern/lib/signal.js'
// import * as Tern from 'tern/lib/tern.js'
// import 'tern/lib/def.js'
// import 'tern/lib/comment.js'
// import 'tern/lib/infer.js'
// import 'tern/plugin/doc_comment.js'

import EcmascriptDefs from 'tern/defs/ecmascript.json'
import NashornDefs from '@/assets/nashorn-tern-defs.json'
import OpenhabJsDefs from '@/assets/openhab-js-tern-defs.json'

//TODO-V3 import componentsHint from '../editor/hint-components';
//TODO-V3 import itemsHint from '../editor/hint-items';
//TODO-V3 import rulesHint from '../editor/hint-rules';
//TODO-V3 import thingsHint from '../editor/hint-things';
//TODO-V3 import pythonHint from '../editor/hint-python';

const KEYMAP = [
  {
    // The default indentWithTab will indent the line regardless of the cursor position.
    // This overrides this behavior so when you're at the beginning of the line, it would indent the line
    // but when in the middle or end of line, it inserts spaces
    key: 'Tab',
    run: ({ state, dispatch }) => {
      const { from, to } = state.selection.main;
      const line = state.doc.lineAt(from);
      const col = from - line.from;
      const beforeCursor = line.text.slice(0, col);

      // If at the beginning of the line (ignoring whitespace), indent the line
      if (/^\s*$/.test(beforeCursor)) {
        return indentMore({ state, dispatch });
      }

      // Otherwise, insert spaces to reach the next multiple of indent size
      const indentLength = getIndentUnit(state);
      const nextTabStop = Math.ceil((col + 1) / indentLength) * indentLength;
      const spacesToInsert = nextTabStop - col;
      const spaces = " ".repeat(spacesToInsert);

      dispatch(
        state.update({
          changes: { from, to, insert: spaces },
          selection: EditorSelection.cursor(from + spaces.length),
          scrollIntoView: true
        })
      );
      return true;
    }
  }
]

const STANDARD_EXTENSIONS = [
  keymap.of([...defaultKeymap, ...historyKeymap, ...KEYMAP]),
  closeBrackets(),
  codeFolding(),
  indentationMarkers({
    hideFirstIndent: true,
    activeThickness: 2
  })
]

export default {
  components: {
    Codemirror
  },
  props: {
    value: String,
    mode: String,
    hintContext: Object,
    ternAutocompletionHook: Boolean,
    readOnly: Boolean
  },
  emits: ['input'],
  data() {
    return {
      code: this.value,
      itemsCache: []
    }
  },
  beforeUnmount() {
    if (this.codemirror && this.codemirror.closeHint) {
      this.codemirror.closeHint()
    }
  },
  methods: {
    languageExtension() {
      if(this.mode.includes('yaml')) {
        return yaml()
      }

      if(this.mode.startsWith('application/javascript')) {
        return javascript()
      }

      if(this.mode.startsWith('application/x-python')) {
        return python()
      }

      switch(this.mode) {
        case 'dsl':
        case 'application/vnd.openhab.dsl.rule':
          return java()
        case 'js':
          return javascript()
        case 'py':
        case 'py2':
        case 'py3':
          return python()
        case 'rb':
        case 'application/x-ruby':
          return StreamLanguage.define(ruby)
        case 'groovy':
        case 'application/x-groovy':
          return StreamLanguage.define(groovy)
        case 'map':
        case 'scale':
          return StreamLanguage.define(properties)
        case 'exec':
          return StreamLanguage.define(shell)
        case 'jinja':
          return StreamLanguage.define(jinja2)
        case 'xslt':
          return xml()
        default:
          console.log('Unsupported codemirror mode:', this.mode)
          return null;
      }
    },
    ternComplete(file, query) {
      let pos = tern.resolvePos(file, query.end)
      let lit = infer.findExpressionAround(file.ast, null, pos, file.scope, 'Literal')
      if (!lit || !lit.node) return
      let call = infer.findExpressionAround(file.ast, null, lit.node.start - 2, file.scope)
      if (!call || !call.node) return
      if (call.node.type !== 'MemberExpression' || (!call.node.object && !call.node.property))
        return
      if (
        (call.node.object.name === 'events' && call.node.property.name === 'postUpdate') ||
        (call.node.object.name === 'events' && call.node.property.name === 'sendCommand') ||
        (call.node.object.name === 'itemRegistry' && call.node.property.name === 'getItem') ||
        (call.node.object.name === 'ir' && call.node.property.name === 'getItem') ||
        (call.node.object.name === 'items' && call.node.property.name === 'getItem')
      ) {
        console.debug('Completing item names!')

        let before = lit.node.value.slice(0, pos - lit.node.start - 1)
        let matches = []
        this.itemsCache
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(item => {
            if (
              item.name.length > before.length &&
              item.name.toLowerCase().indexOf(before.toLowerCase()) >= 0
            ) {
              if (query.types || query.docs || query.urls || query.origins) {
                let rec = {
                  name: JSON.stringify(item.name),
                  displayName: item.name,
                  doc: (item.label ? item.label + ' ' : '') + '[' + item.type + ']'
                }
                matches.push(rec)
                if (query.types) rec.type = 'string'
                if (query.origins) rec.origin = item.name
              }
            }
          })

        return {
          start: tern.outputPos(query, file, lit.node.start),
          end: tern.outputPos(
            query,
            file,
            pos + (file.text.charAt(pos) === file.text.charAt(lit.node.start) ? 1 : 0)
          ),
          isProperty: false,
          completions: matches
        }
      }
    },
    onCmReady(cm) {
      const self = this
      let extraKeys = {}
      if (this.mode && this.mode.indexOf('application/javascript') === 0) {
        window.tern = tern
        if (this.ternAutocompletionHook) {
          tern.registerPlugin('openhab-tern-hook', (server, options) => {
            server.mod.completeStrings = {
              maxLen: (options && options.maxLength) || 15,
              seen: Object.create(null)
            }
            server.on('completion', this.ternComplete)
          })
          openhab.api.get('/rest/items?staticDataOnly=true').then(data => {
            this.itemsCache = data
          })
        }
        /* TODO-V3
        const server = new _CodeMirror.TernServer({
          defs:
            this.mode.indexOf('version=ECMAScript-5.1') > 0
              ? [EcmascriptDefs, NashornDefs]
              : [EcmascriptDefs, OpenhabJsDefs],
          plugins: this.ternAutocompletionHook ? { 'openhab-tern-hook': {} } : undefined,
          ecmaVersion: this.mode.indexOf('version=ECMAScript-5.1') > 0 ? 5 : 6,
        });
        extraKeys = {
          'Ctrl-Space': function (cm) {
            server.complete(cm);
          },
          'Ctrl-Q': function (cm) {
            server.showDocs(cm);
          },
          "'.'": function (cm) {
            setTimeout(function () {
              server.complete(cm);
            }, 100);
            return _CodeMirror.Pass; // tell CodeMirror we didn't handle the key
          },
        };
        */
        /*
        cm.on('cursorActivity', function (cm) {
          server.updateArgHints(cm)
        })
        */
      } else {
        const autocomplete = function (cm) {
          setTimeout(function () {
            _CodeMirror.commands.autocomplete(cm)
          }, 250)
          return _CodeMirror.Pass // tell CodeMirror we didn't handle the key
        }
        extraKeys = {
          'Ctrl-Space': 'autocomplete',
          '\'.\'': autocomplete,
          '\'=\'': autocomplete,
          Space: autocomplete,
          '\'@\'': autocomplete
        }
        cm.state.$oh = this.$oh
        cm.state.originalMode = this.mode
        if (this.hintContext) cm.state.hintContext = Object.assign({}, this.hintContext)
        /* TODO-V3
        cm.setOption('hintOptions', {
          closeOnUnfocus: false,
          completeSingle: self.mode && self.mode.indexOf('yaml') > 0,
          hint(cm, option) {
            if (self.mode && self.mode.indexOf('application/vnd.openhab.uicomponent') === 0) {
              return componentsHint(cm, option, self.mode);
            } else if (self.mode === 'application/vnd.openhab.item+yaml') {
              return itemsHint(cm, option, self.mode);
            } else if (self.mode === 'application/vnd.openhab.rule+yaml') {
              return rulesHint(cm, option, self.mode);
            } else if (self.mode === 'application/vnd.openhab.thing+yaml') {
              return thingsHint(cm, option, self.mode);
            } else if (self.mode === 'application/python') {
              return pythonHint(cm, option, self.mode);
            } else {
              return _CodeMirror.hint.anyword(cm, option, self.mode);
            }
          },
        });
        */

        /* TODO-V3
        _CodeMirror.registerHelper('lint', 'yaml', function (text) {
          const found = [];
          const parsed = YAML.parseDocument(text);
          if (parsed.errors.length > 0) {
            parsed.errors.forEach(e => {
              const message = e.message;
              found.push({
                message,
                from: e.linePos[0]
                  ? { line: e.linePos[0].line - 1, ch: e.linePos[0].col - 1 }
                  : undefined,
                to: e.linePos[1]
                  ? { line: e.linePos[1].line - 1, ch: e.linePos[1].col - 1 }
                  : undefined,
              });
            });
          }

          return found;
        });
        */

        // this.cmOptions.lint = true
      }
      // TODO-V3 cm.setOption('extraKeys', extraKeys);
      // TODO-V3 cm.refresh();
    },
    onCmCodeChange(newCode) {
      this.$emit('input', newCode)
    }
  },
  computed: {
    extensions() {
      const extensions = [
        ...STANDARD_EXTENSIONS,
        EditorState.readOnly.of(this.readOnly),
        this.languageExtension(),
        useThemeOptionsStore().getDarkMode() === 'dark' ? gruvboxDark : null
      ].filter(ext => ext)

      return extensions
    },
    codemirror() {
      return this.$refs.cm.codemirror
    },
    ...mapStores(useThemeOptionsStore)
  }
}
</script>
