import inject from '@rollup/plugin-inject'
import path from 'path'
import { defineConfig } from 'vite'

console.log('TEST')

export default defineConfig({
  server: {
    open: '/examples/web_bluetooth.html',
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist/browser',
    lib: {
      entry: {
        index: path.resolve(__dirname, './src/index-browser.ts')
      },
      name: 'poweredup',
      fileName: 'poweredup',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })]
    }
  }
})
