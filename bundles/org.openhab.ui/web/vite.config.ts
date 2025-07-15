import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

const projectRootDir = resolve(__dirname)

const apiBaseUrl = process.env.OH_APIBASE || 'http://localhost:8080'
console.log(`Using openHAB API base URL: ${apiBaseUrl}`)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    }),
    vueDevtools()
  ],
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
  optimizeDeps: {
    entries: []
  },
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src')
    }
  }
})
