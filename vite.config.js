import swc from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [swc()],
  build: {
    lib: {
      entry: 'src/index-browser.ts',
      name: 'poweredup',
      fileName: 'poweredup.js'
    }
  },
  rollupOptions: {
    external: ['noble', 'noble-mac'],
    output: {
      filename: 'poweredup.js',
      path: './dist/browser'
    }
  }
})
