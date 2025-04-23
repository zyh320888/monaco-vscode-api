// 导入VSCode API服务和monaco编辑器
// import {
//   IDialogService,
//   IEditorService,
//   IPreferencesService,
//   StandaloneServices,
//   createInstance,
//   getService
// } from '@codingame/monaco-vscode-api'
// import * as monaco from 'monaco-editor'

// // 导入配置服务和快捷键服务
// import {
//   defaultUserConfigurationFile,
//   updateUserConfiguration
// } from '@codingame/monaco-vscode-configuration-service-override'
// import {
//   defaultUserKeybindindsFile,
//   updateUserKeybindings
// } from '@codingame/monaco-vscode-keybindings-service-override'

// 导入本地工具和自定义组件
import { remoteAuthority } from './setup.views'
// import { CustomEditorInput } from './features/customView.views'

// // 导入默认配置和快捷键
// import defaultConfiguration from './user/configuration.json?raw'
// import defaultKeybindings from './user/keybindings.json?raw'

// 导入公共主模块
import './main.common'

// 如果存在远程授权，则加载远程扩展功能
if (remoteAuthority != null) {
  void import('./features/remoteExtension')
}

// // 自定义编辑器面板点击事件
// document.querySelector('#customEditorPanel')!.addEventListener('click', async () => {
//   // 创建自定义编辑器输入实例
//   const input = await createInstance(CustomEditorInput, undefined)
//   let toggle = false
  
//   // 设置定时器切换编辑器标题
//   const interval = window.setInterval(() => {
//     const title = toggle ? 'Awesome editor pane' : 'Incredible editor pane'
//     input.setTitle(title)
//     input.setName(title)
//     input.setDescription(title)
//     toggle = !toggle
//   }, 1000)
  
//   // 清理定时器
//   input.onWillDispose(() => {
//     window.clearInterval(interval)
//   })

//   // 打开编辑器
//   await StandaloneServices.get(IEditorService).openEditor(input, {
//     pinned: true
//   })
// })

// // 清除存储按钮点击事件
// document.querySelector('#clearStorage')!.addEventListener('click', async () => {
//   await clearStorage()
// })

// // 初始化设置编辑器
// const settingsEditorEl = document.getElementById('settings-editor')!
// // 创建设置模型引用
// const settingsModelReference = await monaco.editor.createModelReference(
//   defaultUserConfigurationFile
// )

// // 更新设置脏标记状态
// function updateSettingsDirty() {
//   document.getElementById('settings-dirty')!.style.display = settingsModelReference.object.isDirty()
//     ? 'inline'
//     : 'none'
// }
// updateSettingsDirty()
// settingsModelReference.object.onDidChangeDirty(updateSettingsDirty)

// // 创建设置编辑器实例
// const settingEditor = monaco.editor.create(settingsEditorEl, {
//   model: settingsModelReference.object.textEditorModel,
//   automaticLayout: true
// })

// // 添加自定义编辑器动作
// settingEditor.addAction({
//   id: 'custom-action',
//   async run() {
//     void (await getService(IDialogService)).info('Custom action executed!')
//   },
//   label: 'Custom action visible in the command palette',
//   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
//   contextMenuGroupId: 'custom'
// })

// // 初始化快捷键绑定编辑器
// const keybindingsEditorEl = document.getElementById('keybindings-editor')!
// // 创建快捷键绑定模型引用
// const keybindingsModelReference = await monaco.editor.createModelReference(
//   defaultUserKeybindindsFile
// )

// // 更新快捷键绑定脏标记状态
// function updateKeydinbingsDirty() {
//   document.getElementById('keybindings-dirty')!.style.display =
//     keybindingsModelReference.object.isDirty() ? 'inline' : 'none'
// }
// updateKeydinbingsDirty()
// keybindingsModelReference.object.onDidChangeDirty(updateKeydinbingsDirty)

// // 创建快捷键绑定编辑器实例
// monaco.editor.create(keybindingsEditorEl, {
//   model: keybindingsModelReference.object.textEditorModel,
//   automaticLayout: true
// })

// // 设置UI按钮点击事件 - 打开用户设置
// document.querySelector('#settingsui')?.addEventListener('click', async () => {
//   await StandaloneServices.get(IPreferencesService).openUserSettings()
//   window.scrollTo({ top: 0, behavior: 'smooth' })
// })

// // 重置设置按钮点击事件 - 恢复默认配置
// document.querySelector('#resetsettings')?.addEventListener('click', async () => {
//   await updateUserConfiguration(defaultConfiguration)
// })

// // 重置快捷键按钮点击事件 - 恢复默认快捷键
// document.querySelector('#resetkeybindings')?.addEventListener('click', async () => {
//   await updateUserKeybindings(defaultKeybindings)
// })

// // 快捷键UI按钮点击事件 - 打开全局快捷键设置
// document.querySelector('#keybindingsui')?.addEventListener('click', async () => {
//   await StandaloneServices.get(IPreferencesService).openGlobalKeybindingSettings(false)
//   window.scrollTo({ top: 0, behavior: 'smooth' })
// })

// 找到 id 为 activityBar 的 div 元素
