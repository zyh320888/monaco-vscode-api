import { defineConfig } from 'vite'
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin'
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
    target: 'esnext'
  },
  worker: {
    format: 'es'
  },
  plugins: [
    {
      // 为使用SharedArrayBuffer的*-language-features扩展配置响应头
      name: 'configure-response-headers',  // 插件名称
      apply: 'serve',  // 仅在开发服务器运行时应用此插件
      configureServer: (server) => {  // 配置开发服务器的回调函数
        server.middlewares.use((_req, res, next) => {  // 添加一个中间件
          // 设置跨源嵌入策略为credentialless，允许跨源嵌入但限制凭据访问
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless')
          
          // 设置跨源打开者策略为same-origin，防止跨源窗口操作
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          
          // 设置跨源资源策略为cross-origin，允许跨源加载资源
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
          
          next()  // 继续处理下一个中间件
        })
      }
    },
    {
      // 插件名称：强制阻止资源转换
      name: 'force-prevent-transform-assets',
      // 仅在开发服务器模式下应用此插件
      apply: 'serve',
      // 配置服务器中间件
      configureServer(server) {
        return () => {
          // 添加自定义中间件处理请求
          server.middlewares.use(async (req, res, next) => {
            // 检查请求URL是否存在
            if (req.originalUrl != null) {
              // 解析请求路径
              const pathname = new URL(req.originalUrl, import.meta.url).pathname
              // 如果是HTML文件请求
              if (pathname.endsWith('.html')) {
                // 设置响应头为HTML类型
                res.setHeader('Content-Type', 'text/html')
                // 返回200状态码
                res.writeHead(200)
                // 直接读取并返回原始HTML文件内容（不经过Vite转换）
                res.write(fs.readFileSync(path.join(__dirname, pathname)))
                res.end()
              }
            }

            // 继续处理下一个中间件
            next()
          })
        }
      }
    }
  ],
  esbuild: {
    minifySyntax: false
  },
  optimizeDeps: {
    // This is require because vite excludes local dependencies from being optimized
    // Monaco-vscode-api packages are local dependencies and the number of modules makes chrome hang
    include: [
      // add all local dependencies...
      ...localDependencies,
      // and their exports
      '@codingame/monaco-vscode-api/extensions',
      '@codingame/monaco-vscode-api',
      '@codingame/monaco-vscode-api/monaco',
      'vscode/localExtensionHost',

      // These 2 lines prevent vite from reloading the whole page when starting a worker (so 2 times in a row after cleaning the vite cache - for the editor then the textmate workers)
      // it's mainly empirical and probably not the best way, fix me if you find a better way
      'vscode-textmate',
      'vscode-oniguruma',
      '@vscode/vscode-languagedetection',
      'marked'
    ],
    exclude: [],
    esbuildOptions: {
      tsconfig: './tsconfig.json',
      plugins: [importMetaUrlPlugin]
    }
  },
  server: {
    port: 23965,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '^/stable-': {
        target: 'ws://localhost:23964',
        ws: true,
        changeOrigin: true
      },
    },
    fs: {
      allow: ['../'] // allow to load codicon.ttf from monaco-editor in the parent folder
    }
  },
  define: {
    rootDirectory: JSON.stringify(__dirname)
  },
  resolve: {
    dedupe: ['vscode', ...localDependencies]
  }
})
