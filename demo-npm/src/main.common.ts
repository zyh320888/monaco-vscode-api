/**
 * VSCode扩展演示主入口文件
 * 功能：
 * - 注册VSCode扩展
 * - 配置各种语言支持
 * - 提供UI交互功能
 */
// import './style.css'
// import * as monaco from 'monaco-editor'
// import { ExtensionHostKind, registerExtension } from '@codingame/monaco-vscode-api/extensions'
// import { useHtmlFileSystemProvider } from './setup.common'
// import './features/output'
// import './features/debugger'
// import './features/search'
// import './features/intellisense'
// import './features/notifications'
// import './features/terminal'
// import './features/scm'
// import './features/testing'
// import './features/ai'
// import '@codingame/monaco-vscode-clojure-default-extension'
// import '@codingame/monaco-vscode-coffeescript-default-extension'
// import '@codingame/monaco-vscode-cpp-default-extension'
// import '@codingame/monaco-vscode-csharp-default-extension'
import '@codingame/monaco-vscode-css-default-extension'
import '@codingame/monaco-vscode-diff-default-extension'
// import '@codingame/monaco-vscode-fsharp-default-extension'
// import '@codingame/monaco-vscode-go-default-extension'
// import '@codingame/monaco-vscode-groovy-default-extension'
import '@codingame/monaco-vscode-html-default-extension'
// import '@codingame/monaco-vscode-java-default-extension'
import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-json-default-extension'
// import '@codingame/monaco-vscode-julia-default-extension'
// import '@codingame/monaco-vscode-lua-default-extension'
import '@codingame/monaco-vscode-markdown-basics-default-extension'
// import '@codingame/monaco-vscode-objective-c-default-extension'
// import '@codingame/monaco-vscode-perl-default-extension'
// import '@codingame/monaco-vscode-php-default-extension'
// import '@codingame/monaco-vscode-powershell-default-extension'
// import '@codingame/monaco-vscode-python-default-extension'
// import '@codingame/monaco-vscode-r-default-extension'
// import '@codingame/monaco-vscode-ruby-default-extension'
// import '@codingame/monaco-vscode-rust-default-extension'
// import '@codingame/monaco-vscode-scss-default-extension'
import '@codingame/monaco-vscode-shellscript-default-extension'
import '@codingame/monaco-vscode-sql-default-extension'
// import '@codingame/monaco-vscode-swift-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
// import '@codingame/monaco-vscode-vb-default-extension'
import '@codingame/monaco-vscode-xml-default-extension'
import '@codingame/monaco-vscode-yaml-default-extension'
import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-theme-seti-default-extension'
import '@codingame/monaco-vscode-references-view-default-extension'
import '@codingame/monaco-vscode-search-result-default-extension'
import '@codingame/monaco-vscode-configuration-editing-default-extension'
import '@codingame/monaco-vscode-markdown-math-default-extension'
import '@codingame/monaco-vscode-npm-default-extension'
import '@codingame/monaco-vscode-media-preview-default-extension'
// import '@codingame/monaco-vscode-ipynb-default-extension'

// // 注册演示扩展，使用本地进程作为扩展宿主
// const { getApi } = registerExtension(
//   {
//     name: 'demo-main',
//     publisher: 'codingame',
//     version: '1.0.0',
//     engines: {
//       vscode: '*'
//     }
//   },
//   ExtensionHostKind.LocalProcess
// )

// // 获取VSCode API并初始化演示功能
// void getApi().then(async (vscode) => {
//   if (!useHtmlFileSystemProvider) {
//     const mainModelUri = vscode.Uri.file('/workspace/test.js')
//     await Promise.all([
//       vscode.workspace.openTextDocument(mainModelUri),
//       vscode.workspace.openTextDocument(monaco.Uri.file('/workspace/test_readonly.js')) // open the file so vscode sees it's locked
//     ])

//     // 创建演示用的诊断信息集合
//     const diagnostics = vscode.languages.createDiagnosticCollection('demo')
//     diagnostics.set(mainModelUri, [
//       {
//         range: new vscode.Range(2, 9, 2, 12),
//         severity: vscode.DiagnosticSeverity.Error,
//         message: "This is not a real error, just a demo, don't worry",
//         source: 'Demo',
//         code: 42
//       }
//     ])
//   }

//   // 切换完整工作台模式的按钮事件处理
//   document.querySelector('#toggleFullWorkbench')!.addEventListener('click', async () => {
//     const url = new URL(window.location.href)
//     if (url.searchParams.get('mode') === 'full-workbench') {
//       url.searchParams.delete('mode')
//     } else {
//       url.searchParams.set('mode', 'full-workbench')
//     }
//     window.location.href = url.toString()
//   })

//   // 重置布局的按钮事件处理
//   document.querySelector('#resetLayout')!.addEventListener('click', async () => {
//     const url = new URL(window.location.href)
//     url.searchParams.set('resetLayout', 'true')
//     window.location.href = url.toString()
//   })

//   // 切换HTML文件系统提供者的按钮事件处理
//   document.querySelector('#toggleHTMLFileSystemProvider')!.addEventListener('click', async () => {
//     const url = new URL(window.location.href)
//     if (url.searchParams.has('htmlFileSystemProvider')) {
//       url.searchParams.delete('htmlFileSystemProvider')
//     } else {
//       url.searchParams.set('htmlFileSystemProvider', 'true')
//     }
//     window.location.href = url.toString()
//   })
// })
