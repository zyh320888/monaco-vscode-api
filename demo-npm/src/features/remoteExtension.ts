import { registerRemoteExtension } from '@codingame/monaco-vscode-api/extensions'


declare global {
  interface Window {
    rootDirectory?: string
  }
}

if (window.rootDirectory != null) {
  // 注册示例扩展
  // const exampleExtension = await registerRemoteExtension(`${window.rootDirectory}/src/features/remoteExtensionExample/`)
  // exampleExtension.whenReady()
  //   .then(() => console.log('示例扩展加载成功'))
  //   .catch(err => console.error('示例扩展加载失败:', err))
  
  // 注册Roo-Code扩展
  const rooExtension = await registerRemoteExtension(`${window.rootDirectory}/src/features/extensions/roo-cline/`)
  rooExtension.whenReady()
    .then(() => {
      console.log('Roo-Code远程扩展加载成功')
    })
    .catch(err => console.error('Roo-Code远程扩展加载失败:', err))

  rooExtension.isEnabled().then((enabled) => {
    if (enabled) {
      // 找到 auxiliaryBar
      const auxiliaryBar = document.querySelector<HTMLDivElement>('#auxiliaryBar')
      if (auxiliaryBar) {
        // 找到 ul class=actions-container 的元素
        const actionsContainer = auxiliaryBar.querySelector<HTMLUListElement>('.actions-container')
        if (actionsContainer) {
          // 找到 actions-container 的 子元素 li
          const li = actionsContainer.querySelector<HTMLLIElement>('li')
          // 找到 li 点击一下
          li?.click()
        }
      }
    }
  })


  // 注册Deno扩展
  const denoExtension = await registerRemoteExtension(`${window.rootDirectory}/src/features/extensions/denoland.vscode-deno-3.43.6-universal/`)
  denoExtension.whenReady()
    .then(() => console.log('Deno远程扩展加载成功'))
    .catch(err => console.error('Deno远程扩展加载失败:', err))
}
