/**
 * VSCode视图模式设置文件
 * 主要功能：
 * - 初始化Monaco编辑器服务
 * - 配置工作区布局和视图组件
 * - 提供UI交互功能
 * - 管理扩展注册和存储服务
 */
import {
  IStorageService,
  IWorkbenchLayoutService,
  getService,
  initialize as initializeMonacoService
} from '@codingame/monaco-vscode-api'
import getQuickAccessServiceOverride from '@codingame/monaco-vscode-quickaccess-service-override'
import { BrowserStorageService } from '@codingame/monaco-vscode-storage-service-override'
import { ExtensionHostKind } from '@codingame/monaco-vscode-extensions-service-override'
import { registerExtension } from '@codingame/monaco-vscode-api/extensions'
import getViewsServiceOverride, {
  isEditorPartVisible,
  Parts,
  onPartVisibilityChange,
  isPartVisibile,
  attachPart,
  getSideBarPosition,
  onDidChangeSideBarPosition,
  Position
} from '@codingame/monaco-vscode-views-service-override'
import { setUnexpectedErrorHandler } from '@codingame/monaco-vscode-api/monaco'
import { openNewCodeEditor } from './features/editor'
import './features/customView.views'
import {
  commonServices,
  constructOptions,
  envOptions,
  remoteAuthority,
  userDataProvider
} from './setup.common'

// 创建主容器元素并设置工作区HTML结构
const container = document.createElement('div')
container.id = 'app'
// container.innerHTML = `
// <div id="workbench-container">
// <div id="titleBar"></div>
// <div id="banner"></div>
// <div id="workbench-top">
//   <div style="display: flex; flex: none; border: 1px solid var(--vscode-editorWidget-border)">
//     <div id="activityBar"></div>
//     <div id="sidebar" style="width: 400px"></div>
//     <div id="auxiliaryBar-left" style="max-width: 300px"></div>
//   </div>
//   <div style="flex: 1; min-width: 0">
//     <h1>Editor</h1>
//     <div id="editors"></div>

//     <button id="toggleHTMLFileSystemProvider">Toggle HTML filesystem provider</button>
//     <button id="customEditorPanel">Open custom editor panel</button>
//     <button id="clearStorage">Clear user data</button>
//     <button id="resetLayout">Reset layout</button>
//     <button id="toggleFullWorkbench">Switch to full workbench mode</button>
//     <br />
//     <button id="togglePanel">Toggle Panel</button>
//     <button id="toggleAuxiliary">Toggle Secondary Panel</button>
//   </div>
//   <div style="display: flex; flex: none; border: 1px solid var(--vscode-editorWidget-border);">
//     <div id="sidebar-right" style="max-width: 500px"></div>
//     <div id="activityBar-right"></div>
//     <div id="auxiliaryBar" style="max-width: 300px"></div>
//   </div>
// </div>

// <div id="panel"></div>

// <div id="statusBar"></div>
// </div>

// <h1>Settings<span id="settings-dirty">●</span></h1>
// <button id="settingsui">Open settings UI</button>
// <button id="resetsettings">Reset settings</button>
// <div id="settings-editor" class="standalone-editor"></div>
// <h1>Keybindings<span id="keybindings-dirty">●</span></h1>
// <button id="keybindingsui">Open keybindings UI</button>
// <button id="resetkeybindings">Reset keybindings</button>
// <div id="keybindings-editor" class="standalone-editor"></div>`

container.innerHTML = `
<div id="workbench-container">
  <div id="workbench-top">
    <div style="display: flex; flex: none; border: 1px solid var(--vscode-editorWidget-border)">
      <div id="activityBar"></div>
      <div id="sidebar" style="width: 400px"></div>
      <div id="auxiliaryBar-left" style="max-width: 300px"></div>
    </div>
    <div style="flex: 1; min-width: 0">
      <h1>Editor</h1>
      <div id="editors"></div>

      <button id="toggleHTMLFileSystemProvider">Toggle HTML filesystem provider</button>
      <button id="customEditorPanel">Open custom editor panel</button>
      <button id="clearStorage">Clear user data</button>
      <button id="resetLayout">Reset layout</button>
      <button id="toggleFullWorkbench">Switch to full workbench mode</button>
      <br />
      <button id="togglePanel">Toggle Panel</button>
      <button id="toggleAuxiliary">Toggle Secondary Panel</button>
    </div>
    <div style="display: flex; flex: none; border: 1px solid var(--vscode-editorWidget-border);">
      <div id="sidebar-right" style="max-width: 500px"></div>
      <div id="activityBar-right"></div>
      <div id="auxiliaryBar" style="max-width: 300px"></div>
    </div>
  </div>
</div>


`

document.body.append(container)

// 初始化Monaco服务并覆盖默认服务
await initializeMonacoService(
  {
    ...commonServices,
    ...getViewsServiceOverride(openNewCodeEditor, undefined),

    ...getQuickAccessServiceOverride({
      isKeybindingConfigurationVisible: isEditorPartVisible,
      shouldUseGlobalPicker: (_editor, isStandalone) => !isStandalone && isEditorPartVisible()
    })
  },
  document.body,
  constructOptions,
  envOptions
)

// 设置未捕获异常处理器
setUnexpectedErrorHandler((e) => {
  console.info('Unexpected error', e)
})

/**
 * 配置工作区各部分的显示和布局
 * 遍历所有工作区组件配置，进行以下操作：
 * 1. 将组件绑定到对应的DOM元素
 * 2. 设置元素位置变化监听器
 * 3. 根据初始可见性设置显示/隐藏
 * 4. 设置可见性变化监听器
 */
for (const config of [
  // 标题栏配置 - 固定位置
  // { part: Parts.TITLEBAR_PART, element: '#titleBar' },
  // 横幅区域配置 - 固定位置
  // { part: Parts.BANNER_PART, element: '#banner' },
  {
    // 侧边栏配置 - 动态位置(左/右)
    part: Parts.SIDEBAR_PART,
    get element() {
      // 根据侧边栏位置动态返回对应的DOM元素选择器
      return getSideBarPosition() === Position.LEFT ? '#sidebar' : '#sidebar-right'
    },
    // 当侧边栏位置变化时重新绑定
    onDidElementChange: onDidChangeSideBarPosition
  },
  {
    // 活动栏配置 - 动态位置(跟随侧边栏)
    part: Parts.ACTIVITYBAR_PART,
    get element() {
      return getSideBarPosition() === Position.LEFT ? '#activityBar' : '#activityBar-right'
    },
    onDidElementChange: onDidChangeSideBarPosition
  },
  // 面板区域配置 - 固定位置
  // { part: Parts.PANEL_PART, element: '#panel' },
  // 编辑器区域配置 - 固定位置
  // { part: Parts.EDITOR_PART, element: '#editors' },
  // 状态栏配置 - 固定位置
  // { part: Parts.STATUSBAR_PART, element: '#statusBar' },
  {
    // 辅助栏配置 - 动态位置(与侧边栏相反)
    part: Parts.AUXILIARYBAR_PART,
    get element() {
      return getSideBarPosition() === Position.LEFT ? '#auxiliaryBar' : '#auxiliaryBar-left'
    },
    onDidElementChange: onDidChangeSideBarPosition
  }
]) {
  // 初始绑定组件到DOM元素
  attachPart(config.part, document.querySelector<HTMLDivElement>(config.element)!)

  // 如果配置了元素变化监听器，设置回调
  config.onDidElementChange?.(() => {
    // 当元素位置变化时重新绑定
    attachPart(config.part, document.querySelector<HTMLDivElement>(config.element)!)
  })

  // 初始可见性检查
  if (!isPartVisibile(config.part)) {
    // 如果组件不可见，隐藏对应DOM元素
    document.querySelector<HTMLDivElement>(config.element)!.style.display = 'none'
  }

  // 设置组件可见性变化监听器
  onPartVisibilityChange(config.part, (visible) => {
    // 根据可见性参数显示/隐藏DOM元素
    document.querySelector<HTMLDivElement>(config.element)!.style.display = visible
      ? 'block'
      : 'none'
  })
}

// 获取布局服务并设置面板切换事件
const layoutService = await getService(IWorkbenchLayoutService)
document.querySelector('#togglePanel')!.addEventListener('click', async () => {
  layoutService.setPartHidden(layoutService.isVisible(Parts.PANEL_PART, window), Parts.PANEL_PART)
})

document.querySelector('#toggleAuxiliary')!.addEventListener('click', async () => {
  layoutService.setPartHidden(
    layoutService.isVisible(Parts.AUXILIARYBAR_PART, window),
    Parts.AUXILIARYBAR_PART
  )
})

/**
 * 清除存储数据
 * 重置用户数据和本地存储
 */
export async function clearStorage(): Promise<void> {
  await userDataProvider.reset()
  await ((await getService(IStorageService)) as BrowserStorageService).clear()
}

// 注册演示扩展并设置为默认API
await registerExtension(
  {
    name: 'demo',
    publisher: 'codingame',
    version: '1.0.0',
    engines: {
      vscode: '*'
    }
  },
  ExtensionHostKind.LocalProcess
).setAsDefaultApi()

export { remoteAuthority }
