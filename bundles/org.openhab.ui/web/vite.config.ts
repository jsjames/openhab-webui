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
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['field', 'block', 'category', 'xml', 'mutation', 'value', 'sep', 'shadow'].includes(tag) // blockly custom elements
        }
      }
    }),
    {
      name: 'html-injector',
      apply: 'build',
      transformIndexHtml() {
        return [
          {
            tag: 'meta',
            injectTo: 'head-prepend',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; img-src * data:; media-src * data: blob: media:; frame-src *; connect-src 'self' *.openhab.org raw.githubusercontent.com api.iconify.design api.unisvg.com api.simplesvg.com *; worker-src 'self' blob:;"
            }
          }
        ]
      }
    },
    vueDevtools(), visualizer({ open: true }), vitePluginTopLevelAwait()],
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
    target: ['chrome107', 'edge107', 'firefox104', 'safari11.1'],
    rollupOptions: {
      output: {
        // Customize the output directory for entry chunks (e.g., main.js)
        entryFileNames: `assets/js/[name]-[hash].js`,
        // Customize the output directory for code-split chunks (e.g., components)
        chunkFileNames: `assets/js/[name]-[hash].js`,
        // Optionally, you can also set assetFileNames for other assets like CSS
        assetFileNames: `assets/[ext]/[name]-[hash].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
      '@node_modules': resolve(projectRootDir, 'node_modules')
    }
  }
})
