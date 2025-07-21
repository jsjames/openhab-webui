import { globalIgnores } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import js from '@eslint/js'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'

// import standard from "@vue/eslint-config-standard";
// import ts from "@typescript-eslint/parser"

// const _import = require("eslint-plugin-import");
// const cypress = require("eslint-plugin-cypress");
// const es = require("eslint-plugin-es");

import { fixupPluginRules } from '@eslint/compat'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  ...vue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  ...vueI18n.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.vue', '**.ts', '**/*.tsx', '**/*.json'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        ga: true,
        __statics: true,
        process: true
      }
    },
    // 'js.configs.recommended',
    // "plugin:cypress/recommended",
    // "plugin:@typescript-eslint/recommended",
    rules: {
      'arrow-parens': 'off',
      'comma-dangle': 'error',
      'comma-spacing': 'error',
      'dot-notation': 'off',
      'eol-last': 'error',
      'generator-star-spacing': 'off',
      // "import/default": "error",
      // "import/export": "error",
      // "import/extensions": "off",
      // "import/first": "off",
      // "import/named": "error",
      // "import/namespace": "error",
      // "import/no-extraneous-dependencies": "off",
      // "import/no-unresolved": "off",

      indent: [
        'error',
        2,
        {
          SwitchCase: 1
        }
      ],

      'jsx-quotes': 'error',
      'linebreak-style': 'off',
      'multiline-ternary': 'off',
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      // "es/no-regexp-lookbehind-assertions": "error",
      'no-trailing-spaces': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-whitespace-before-property': 'error',
      'one-var': 'off',
      'prefer-promise-reject-errors': 'off',
      'quote-props': 'off',
      quotes: ['error', 'single'],
      'space-in-parens': 'error',
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': 'off',
      'vue/component-definition-name-casing': 'off',
      'vue/first-attribute-linebreak': 'off',

      // 'vue/html-closing-bracket-spacing': 'off',
      // 'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': 'error',
      'vue/html-quotes': 'error',
      'vue/html-self-closing': 'error',
      'vue/max-attributes-per-line': 'off',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/block-order': 'off',
      'vue/no-v-html': 'off',
      'vue/singleline-html-element-content-newline': 'error',
      'vue/v-on-style': 'error',
      'vue/v-slot-style': 'error',
      camelcase: 'off',
      'vue/no-deprecated-slot-attribute': 'off',

      'no-empty': [
        'off',
        {
          allowEmptyCatch: true
        }
      ],

      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'prefer-const': 'off',

      'vue/component-tags-order': [
        'off',
        {
          order: ['template', 'script', 'style']
        }
      ],

      'vue/no-mutating-props': 'off',
      'vue/no-parsing-error': 'off',
      'vue/no-template-shadow': 'off',
      'vue/order-in-components': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/this-in-template': 'off',
      'vue/valid-v-slot': 'off',

      '@intlify/vue-i18n/no-raw-text': 'off',
      '@intlify/vue-i18n/no-html-messages': 'off'
    },
    settings: {
      'vue-i18n': {
        localeDir: './src/assets/i18n/**/*.json',
        messageSyntaxVersion: '^11.0.0'
      }
    }
  },
  eslintConfigPrettier, // This is the Prettier config that disables all ESLint rules that conflict with Prettier
  globalIgnores(['dist', 'build', 'public'])
]
