<template>
  <codemirror
    ref="cm"
    class="code-editor-fit"
    :model-value="value"
    :extensions="extensions"
    @ready="onCmReady"
    @change="onCmCodeChange" />
</template>

<style lang="stylus">
.code-editor-fit
  position relative
  width 100%
  height calc(100vh - var(--f7-navbar-height) - var(--f7-tabbar-height, 48px))
  display flex !important

  .cm-editor
    height 100%
    width 100%

    .cm-completionIcon
      border-radius 50%
      padding 0
      width 16px
      height 16px
      line-height 16px
      background #999
      color #fff
      font-size 12px
      font-weight 700
      opacity 0.95
      margin 1px 6px

    .cm-completionIcon::before
      line-height 16px !important

    .cm-completionIcon-boolean::before
      content "B"
    .cm-completionIcon-number::before
      content "N"
    .cm-completionIcon-string::before
      content "S"
    .cm-completionIcon-unknown::before
      content "?"
    .cm-completionIcon-unknown
      background #4bb
</style>

<script>
import { useUIOptionsStore } from '@/js/stores/useUIOptionsStore'
import { mapStores } from 'pinia'

import { Codemirror } from 'vue-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, EditorSelection } from '@codemirror/state'
import { defaultKeymap, historyKeymap, insertTab, indentLess, indentMore } from '@codemirror/commands'
import { StreamLanguage, getIndentUnit, codeFolding } from '@codemirror/language'
import { autocompletion, completeFromList, closeBrackets } from '@codemirror/autocomplete'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'

// languages
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { groovy } from '@codemirror/legacy-modes/mode/groovy'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { java } from '@codemirror/lang-java'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { jinja2 } from '@codemirror/legacy-modes/mode/jinja2'
import { properties } from '@codemirror/legacy-modes/mode/properties'
import { shell } from '@codemirror/legacy-modes/mode/shell'

import { gruvboxDark } from '@uiw/codemirror-theme-gruvbox-dark'

// for autocomplete
//TODO-V3 import 'codemirror/addon/hint/show-hint.js';
//TODO-V3 import 'codemirror/addon/hint/show-hint.css';
//TODO-V3 import 'codemirror/addon/hint/anyword-hint.js';
//TODO-V3 import 'codemirror/addon/dialog/dialog.js';
//TODO-V3 import 'codemirror/addon/dialog/dialog.css';
//TODO-V3 import 'codemirror/addon/tern/tern.js';
//TODO-V3 import 'codemirror/addon/tern/tern.css';

// for linting
//TODO-V3 import 'codemirror/addon/lint/lint.js';
//TODO-V3 import 'codemirror/addon/lint/lint.css';
import YAML from 'yaml'

// import tern from 'tern'
// import infer from 'tern/lib/infer'

// import 'tern/lib/signal.js'
// import * as Tern from 'tern/lib/tern.js'
// import 'tern/lib/def.js'
// import 'tern/lib/comment.js'
// import 'tern/lib/infer.js'
// import 'tern/plugin/doc_comment.js'

// import EcmascriptDefs from 'tern/defs/ecmascript.json'
// import NashornDefs from '@/assets/nashorn-tern-defs.json'
// import OpenhabJsDefs from '@/assets/openhab-js-tern-defs.json'

import componentsHint from '../editor/hint-components';
// import itemsHint from '../editor/hint-items';
// import rulesHint from '../editor/hint-rules';
// import thingsHint from '../editor/hint-things';
// import pythonHint from '../editor/hint-python';

const KEYMAP = [
  {
    // The default indentWithTab will indent the line regardless of the cursor position.
    // This overrides this behavior so when you're at the beginning of the line, it would indent the line
    // but when in the middle or end of line, it inserts spaces
    key: 'Tab',
    run: ({ state, dispatch }) => {
      const { from, to } = state.selection.main
      const line = state.doc.lineAt(from)
      const col = from - line.from
      const beforeCursor = line.text.slice(0, col)

      // If at the beginning of the line (ignoring whitespace), indent the line
      if (/^\s*$/.test(beforeCursor)) {
        return indentMore({ state, dispatch })
      }

      // Otherwise, insert spaces to reach the next multiple of indent size
      const indentLength = getIndentUnit(state)
      const nextTabStop = Math.ceil((col + 1) / indentLength) * indentLength
      const spacesToInsert = nextTabStop - col
      const spaces = ' '.repeat(spacesToInsert)

      dispatch(
        state.update({
          changes: { from, to, insert: spaces },
          selection: EditorSelection.cursor(from + spaces.length),
          scrollIntoView: true
        })
      )
      return true
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
  data () {
    return {
      code: this.value,
      autocompletion: null,
      itemsCache: []
    }
  },
  beforeUnmount () {
    if (this.codemirror && this.codemirror.closeHint) {
      this.codemirror.closeHint()
    }
  },
  methods: {
    languageExtension (mode) {
      if(mode.includes('yaml')) {
        return yaml()
      }

      if(mode.startsWith('application/javascript')) {
        return javascript()
      }

      if(mode.startsWith('application/x-python')) {
        return python()
      }

      switch(mode) {
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
        case 'text/x-properties':
          return StreamLanguage.define(properties)
        case 'exec':
          return StreamLanguage.define(shell)
        case 'jinja':
          return StreamLanguage.define(jinja2)
        case 'xslt':
          return xml()
        default:
          console.log('Unsupported codemirror mode:', mode)
          return null
      }
    },
    autocompletionExtension (mode) {
      if (!mode) {
        return null
      }

      const acOpts = {
        activateOnCompletion: () => true
      }

      if (mode.startsWith('application/javascript')) {
        return autocompletion(acOpts)
        // TODO-V3 add items autocompletion
      }

      if (mode.startsWith('application/vnd.openhab.uicomponent')) {
        return autocompletion({ ...acOpts, override: [ componentsHint ] })
      }

      // TODO-V3
      // switch (mode) {
      //   case 'application/vnd.openhab.rule+yaml':
      //     return autocompletion({ ...acOpts, override: [ rulesHint ] })
      //   case 'application/python':
      //     return autocompletion({ ...acOpts, override: [ pythonHint ] })
      //   case 'application/vnd.openhab.thing+yaml':
      //     return autocompletion({ ...acOpts, override: [ thingsHint ] })
      //   case 'application/vnd.openhab.item+yaml':
      //     return autocompletion({ ...acOpts, override: [ itemsHint ] })
      //   default:
      //     return autocompletion(acOpts)
      // }

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
    },
    onCmReady (cm) {
      cm.view.$oh = this.$oh
      cm.view.originalMode = this.mode
      if (this.hintContext) cm.view.hintContext = Object.assign({}, this.hintContext)
    },
    onCmCodeChange (newCode) {
      this.$emit('input', newCode)
    }
  },
  computed: {
    extensions () {
      const extensions = [
        ...STANDARD_EXTENSIONS,
        EditorState.readOnly.of(this.readOnly),
        this.languageExtension(this.mode),
        this.autocompletionExtension(this.mode),
        useUIOptionsStore().getDarkMode() === 'dark' ? gruvboxDark : null
      ].filter((ext) => ext)

      return extensions
    },
    codemirror () {
      return this.$refs.cm.codemirror
    },
    ...mapStores(useUIOptionsStore)
  }
}
</script>
