import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import parserTS from '@typescript-eslint/parser'
import pluginTS from '@typescript-eslint/eslint-plugin'
import pluginJsonc from 'eslint-plugin-jsonc'
import pluginVue from 'eslint-plugin-vue'
import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n'
import pluginImport from 'eslint-plugin-import'

// import standard from "@vue/eslint-config-standard";
// import ts from "@typescript-eslint/parser"

// const _import = require("eslint-plugin-import");
// const es = require("eslint-plugin-es");

import { fixupPluginRules } from '@eslint/compat'
import { glob } from 'fs'

// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...pluginVue.configs['flat/recommended'],
  // eslintPluginPrettierRecommended,
  ...pluginVueI18n.configs.recommended,
  pluginImport.flatConfigs.recommended,
  js.configs.recommended,
  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    files: ['**/*.js', '**/*.mjs', '**/*.vue', '**/*.json'],
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
    // "plugin:@typescript-eslint/recommended",
    rules: {
      'arrow-parens': 'off',
      'comma-dangle': 'error',
      'comma-spacing': 'error',
      'dot-notation': 'off',
      'eol-last': 'error',
      'generator-star-spacing': 'off',
      'semi': ['error', 'never'],
      'import/default': 'error',
      'import/export': 'error',
      'import/extensions': 'off',
      'import/first': 'off',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'jsx-quotes': 'error',
      'linebreak-style': 'off',
      'multiline-ternary': 'off',
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-irregular-whitespace': 'off',
      // 'es/no-regexp-lookbehind-assertions': 'error', // Supported in Safari  >= 16.4, which breaks iOS 15.x.
      'no-trailing-spaces': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-whitespace-before-property': 'error',
      'one-var': 'off',
      'prefer-promise-reject-errors': 'off',
      'quote-props': 'off',
      'quotes': ['error', 'single'],
      'space-in-parens': 'error',
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': 'off',
      'vue/component-definition-name-casing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': ['error', { 'singleline': 'never', 'multiline': 'never' }],
      'vue/html-closing-bracket-spacing': 'error',
      'vue/html-indent': 'error',
      'vue/html-quotes': 'error',
      'vue/html-self-closing': 'error',
      'vue/max-attributes-per-line': ['error', {
        'singleline': 3,
        'multiline' : 1
      }],
      'vue/multiline-html-element-content-newline': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/no-v-html': 'off',
      'vue/singleline-html-element-content-newline': 'error',
      'vue/v-on-style': 'error',
      'vue/v-slot-style': 'error',

      // The following rules should be activated successively. Due to the large amount
      // of required changes, the activations should be clustered in several pull requests.
      'camelcase': 'off',
      'no-empty': ['off', { 'allowEmptyCatch': true }],
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'prefer-const': 'off',
      'vue/block-order': ['error', { 'order': [ [ 'template', 'style' ], 'script' ] } ],
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
  {
    files: ['**/*.ts', '**/*.tsx'], // Apply this configuration to TypeScript files
    languageOptions: {
      parser: parserTS, // Use the TypeScript parser
      parserOptions: {
        // Optional: configure parser options for TypeScript
        // For example, to enable typed linting:
        project: './tsconfig.json', // Path to your tsconfig.json
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      '@typescript-eslint': pluginTS // Include the TypeScript ESLint plugin
    },
    rules: {
      // Apply recommended TypeScript ESLint rules
      ...pluginTS.configs.recommended.rules,
      // Add or override specific TypeScript rules as needed
      '@typescript-eslint/no-explicit-any': 'off',
      // Add or override import rules here
      'import/no-unresolved': 'error',
      'import/named': 'error'
      // ... other import rules as needed
    }
  },
  globalIgnores(['dist', 'build', 'public', '**/*.nearley.js'])

  // eslintConfigPrettier, // This is the Prettier config that disables all ESLint rules that conflict with Prettier
])
