import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      exclude: ['src/**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'composables/index': resolve(__dirname, 'src/composables/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@edoxen/edoxen'],
    },
  },
})
