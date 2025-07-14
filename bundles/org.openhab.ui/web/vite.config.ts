import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import bundleStatsMetrics from 'vite-bundle-stats-metrics';

const projectRootDir = resolve(__dirname);

const apiBaseUrl = process.env.OH_APIBASE || 'http://localhost:8080';
console.log(`Using openHAB API base URL: ${apiBaseUrl}`);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    bundleStatsMetrics({
      outputFile: 'dist/bundle-stats.json',
      format: 'txt',
      logToConsole: 'summary',
      warnThreshold: 500,
    }) as PluginOption,
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3,
          },
        },
      },
    }),
  ],
  server: {
    port: 8080,
    proxy: {
      '/rest': {
        target: apiBaseUrl,
        secure: false,
      },
      '/auth': {
        target: apiBaseUrl,
        secure: false,
      },
      '/chart': {
        target: apiBaseUrl,
        secure: false,
      },
      '/proxy': {
        target: apiBaseUrl,
        secure: false,
      },
      '/icon': {
        target: apiBaseUrl,
        secure: false,
      },
      '/static': {
        target: apiBaseUrl,
        secure: false,
      },
      '/changePassword': {
        target: apiBaseUrl,
        secure: false,
      },
      '/createApiToken': {
        target: apiBaseUrl,
        secure: false,
      },
      '/audio': {
        target: apiBaseUrl,
        secure: false,
      },
      '/ws/logs': {
        target: apiBaseUrl,
        ws: true,
      },
      '/ws/events': {
        target: apiBaseUrl,
        ws: true,
      },
    },
  },
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
      vue: '@vue/compat',
    },
  },
});
