import { registerRemoteExtension } from '@codingame/monaco-vscode-api/extensions'

declare global {
  interface Window {
    rootDirectory?: string
  }
}

if (window.rootDirectory != null) {
  // 注册示例扩展
  const exampleExtension = await registerRemoteExtension(`${window.rootDirectory}/src/features/remoteExtensionExample/`)
  exampleExtension.whenReady()
    .then(() => console.log('示例扩展加载成功'))
    .catch(err => console.error('示例扩展加载失败:', err))
  
  // 注册Roo-Code扩展
  const rooExtension = await registerRemoteExtension(`${window.rootDirectory}/src/features/rooveterinaryinc.roo-cline-3.12.3/`)
  rooExtension.whenReady()
    .then(() => console.log('Roo-Code远程扩展加载成功'))
    .catch(err => console.error('Roo-Code远程扩展加载失败:', err))
}
