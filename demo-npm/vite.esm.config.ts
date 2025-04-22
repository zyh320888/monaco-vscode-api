import { defineConfig } from 'vite'
import * as fs from 'fs'
import path from 'path'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url).pathname).toString()
)

const localDependencies = Object.entries(pkg.dependencies as Record<string, string>)
  .filter(([, version]) => version.startsWith('file:../'))
  .map(([name]) => name)

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: pkg.name,
      fileName: () => `${pkg.name}.esm.js`,
      formats: ['es']
    },
    target: 'esnext',
    minify: true,
    sourcemap: true
  },
  optimizeDeps: {
    include: [
      ...localDependencies,
      '@codingame/monaco-vscode-api/extensions',
      '@codingame/monaco-vscode-api',
      '@codingame/monaco-vscode-api/monaco',
      'vscode/localExtensionHost',
      'vscode-textmate',
      'vscode-oniguruma',
      '@vscode/vscode-languagedetection',
      'marked'
    ],
    esbuildOptions: {
      tsconfig: './tsconfig.json'
    }
  },
  resolve: {
    dedupe: ['vscode', ...localDependencies]
  },
  define: {
    rootDirectory: JSON.stringify(__dirname)
  }
})