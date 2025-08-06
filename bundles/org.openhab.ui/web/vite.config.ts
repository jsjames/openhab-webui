import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import vitePluginTopLevelAwait from 'vite-plugin-top-level-await'
import { resolve } from 'path'

const projectRootDir = resolve(__dirname)

const apiBaseUrl = process.env.OH_APIBASE || 'http://localhost:8080'
console.log(`Using openHAB API base URL: ${apiBaseUrl}`)
const maven = process.env.MAVEN || false
const outPath = maven ? '../target/classes/app' : 'www'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['field', 'block', 'category', 'xml', 'mutation', 'value', 'sep', 'shadow'].includes(tag) // blockly custom elements
      }
    }
  }), vueDevtools(), visualizer({ open: true }), vitePluginTopLevelAwait()],
  server: {
    port: 8080,
    proxy: {
      '/rest': {
        target: apiBaseUrl,
        secure: false
      },
      '/auth': {
        target: apiBaseUrl,
        secure: false
      },
      '/chart': {
        target: apiBaseUrl,
        secure: false
      },
      '/proxy': {
        target: apiBaseUrl,
        secure: false
      },
      '/icon': {
        target: apiBaseUrl,
        secure: false
      },
      '/static': {
        target: apiBaseUrl,
        secure: false
      },
      '/changePassword': {
        target: apiBaseUrl,
        secure: false
      },
      '/createApiToken': {
        target: apiBaseUrl,
        secure: false
      },
      '/audio': {
        target: apiBaseUrl,
        secure: false
      },
      '/ws/logs': {
        target: apiBaseUrl,
        ws: true
      },
      '/ws/events': {
        target: apiBaseUrl,
        ws: true
      }
    }
  },
  build: {
    outDir: resolve(outPath),
    emptyOutDir: true,
    target: ['chrome107', 'edge107', 'firefox104', 'safari11.1']
  },
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
      '@node_modules': resolve(projectRootDir, 'node_modules')
    }
  }
})
