import { defineConfig } from 'vite'
import * as fs from 'fs'
import path from 'path'
// import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin'
// import importMetaUrlPlugin from './esbuild-import-meta-url-plugin'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url).pathname).toString()
)

const localDependencies = Object.entries(pkg.dependencies as Record<string, string>)
  .filter(([, version]) => version.startsWith('file:../'))
  .map(([name]) => name)

export default defineConfig({
  // assetsInclude: ['**/*.wasm', '**/*.html'],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/loader.ts'),
      name: pkg.name,
      fileName: () => `${pkg.name}.esm.js`,
      formats: ['es']
    },
    target: 'esnext',
    minify: true,
    sourcemap: true,
    // rollupOptions: {
    //   // external(source, importer, isResolved) {
    //   //   console.log('source', source)
    //   //   console.log('importer', importer)
    //   //   console.log('isResolved', isResolved)
    //   //   return false
    //   // },
    //   // plugins: [
    //   //   {
    //   //     name: 'vsda-web-resolver',
    //   //     resolveId(source) {
    //   //       console.log('source', source)
    //   //       if (source === 'vsda') {
    //   //         return path.resolve(__dirname, 'node_modules/vsda/rust/web/vsda.js')
    //   //       }
    //   //       return null
    //   //     }
    //   //   }
    //   // ]
    // },
    // assetsInlineLimit: 0
  },
  worker: {
    format: 'es'
  },
  esbuild: {
    minifySyntax: false
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
      tsconfig: './tsconfig.json',
      // plugins: [importMetaUrlPlugin]
    }
  },
  resolve: {
    dedupe: ['vscode', ...localDependencies]
  },
  define: {
    rootDirectory: JSON.stringify(__dirname)
  }
})