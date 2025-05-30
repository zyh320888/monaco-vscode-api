/**
 * VSCode视图模式设置文件
 * 主要功能：
 * - 初始化Monaco编辑器服务
 * - 配置工作区布局和视图组件
 * - 提供UI交互功能
 * - 管理扩展注册和存储服务
 */
import {
  // IStorageService,
  IWorkbenchLayoutService,
  getService,
  initialize as initializeMonacoService
} from '@codingame/monaco-vscode-api'
import getQuickAccessServiceOverride from '@codingame/monaco-vscode-quickaccess-service-override'
// import { BrowserStorageService } from '@codingame/monaco-vscode-storage-service-override'
// import { ExtensionHostKind } from '@codingame/monaco-vscode-extensions-service-override'
// import { registerExtension } from '@codingame/monaco-vscode-api/extensions'
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
import * as monaco from 'monaco-editor'
// import { openNewCodeEditor } from './features/editor'
// import './features/customView.views.auxiliary'
import {
  commonServices,
  constructOptions,
  envOptions,
  // remoteAuthority,
  // userDataProvider
} from './setup.common'
// import { editor } from 'monaco-editor'
import { EditorMode } from './types'



const init = async () => {

  const container = document.getElementById('d8d-ai-editor')

  // document.body.append(container)
  if (container) {
    container.style.position = 'relative'

    if(window.d8dAiEditor.containerHtml)
      container.innerHTML = window.d8dAiEditor.containerHtml

    // 初始化Monaco服务并覆盖默认服务
    await initializeMonacoService(
      {
        ...commonServices,
        // ...getViewsServiceOverride(openNewCodeEditor, undefined),
        ...getViewsServiceOverride(),
        ...getQuickAccessServiceOverride({
          isKeybindingConfigurationVisible: isEditorPartVisible,
          shouldUseGlobalPicker: (_editor, isStandalone) => !isStandalone && isEditorPartVisible()
        })
      },
      container,
      {
        ...constructOptions,
        secretStorageProvider: window.d8dAiEditor.secretStorageProvider,
        // 远程授权信息，用于远程连接场景
        remoteAuthority: window.d8dAiEditor.remoteAuthority,
        // 连接令牌，用于安全验证
        connectionToken: window.d8dAiEditor.connectionToken,
        // 工作区提供者配置
        workspaceProvider: {
          trusted: true, // 工作区是否被信任
          // 打开工作区的方法
          async open() {
            window.open(window.location.href)
            return true
          },
          // 工作区URI配置
          workspace:
            // remotePath == null
            //   ? {
            //       // 本地工作区URI配置
            //       workspaceUri: workspaceFile
            //     }
            //   : 
              {
                  // 远程工作区文件夹URI配置
                  folderUri: monaco.Uri.from({
                    scheme: 'vscode-remote', // 协议方案
                    path: window.d8dAiEditor.remotePath,       // 远程路径
                    authority: window.d8dAiEditor.remoteAuthority // 远程授权
                  })
                }
        },
      },
      envOptions
    )

    
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
      { part: Parts.PANEL_PART, element: '#panel' },
      // 编辑器区域配置 - 固定位置
      { part: Parts.EDITOR_PART, element: '#editors' },
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

    // 设置默认预览模式
    document.getElementById('workbench-container')?.classList.add('preview-mode')
  }


}

const appendTestModeControls = () => {
  // 添加模式切换按钮
  const modeControls = document.createElement('div')
  modeControls.style.position = 'absolute'
  modeControls.style.top = '10px'
  modeControls.style.right = '320px'
  modeControls.style.zIndex = '1000'
  modeControls.innerHTML = `
    <button id="previewModeBtn">预览</button>
    <button id="codeModeBtn">代码</button>
    <button id="splitModeBtn">并列</button>
    <button id="toggleAuxiliary">切换辅助栏</button>
    <button id="togglePanel">切换面板</button>
  `
  // document.body.append(modeControls)
  document.getElementById('workbench-container')?.append(modeControls)


}

const hideActivityBarButtons = () => {
  const activityBar = document.querySelector('#activityBar')

  // 找到 role 为 menubar 的元素
  const menubar = activityBar?.querySelector('div[role="menubar"]') as HTMLElement | null
  // 隐藏 menubar
  if (menubar) {
    menubar.style.display = 'none'
  }

  // 找到 class 中 composite-bar 的 div 元素
  const compositeBar = activityBar?.querySelector('div.composite-bar')


  // 找到 class中 monaco-action-bar 的元素 的 子元素 ul
  const monacoActionTabListBar = compositeBar?.querySelector('.monaco-action-bar')
  if (monacoActionTabListBar) {
    // 找到 ul 的 role=tablist 的元素
    const tablist = monacoActionTabListBar.querySelector('ul[role="tablist"]')

    // 隐藏 tablist 的 子元素 li, 第4，5个
    tablist?.querySelectorAll('li').forEach((li, index) => {
      if (index === 3 || index === 4) {
        li.style.display = 'none'
      }
    })

  }


  // 找到 ul 的 role=toolbar 的元素
  const toolbar = activityBar?.querySelector('ul[role="toolbar"]') as HTMLElement | null
  // 隐藏 toolbar 自己
  if (toolbar) {  
    toolbar.style.display = 'none'
  }
}

const editorMode: EditorMode = {
  init: () => {
    init()
  },
  toggleAuxiliary: async () => {
    console.log('toggleAuxiliary')
    // 获取布局服务并设置面板切换事件
    const layoutService = await getService(IWorkbenchLayoutService)
    layoutService.setPartHidden(
      layoutService.isVisible(Parts.AUXILIARYBAR_PART, window),
      Parts.AUXILIARYBAR_PART
    )
  },
  togglePanel: async () => {
    console.log('togglePanel')
    // 获取布局服务并设置面板切换事件
    const layoutService = await getService(IWorkbenchLayoutService)
    layoutService.setPartHidden(
      layoutService.isVisible(Parts.PANEL_PART, window),
      Parts.PANEL_PART
    )
  },
  togglePreviewMode: () => {
    console.log('togglePreviewMode')
    const container = document.getElementById('workbench-container')
    container?.classList.remove('code-mode', 'split-mode')
    container?.classList.add('preview-mode')
  },
  toggleCodeMode: () => {
    console.log('toggleCodeMode')
    const container = document.getElementById('workbench-container')
    container?.classList.remove('preview-mode', 'split-mode')
    container?.classList.add('code-mode')

    hideActivityBarButtons()
  },
  toggleSplitMode: () => {
    console.log('toggleSplitMode')
    const container = document.getElementById('workbench-container')
    container?.classList.remove('preview-mode', 'code-mode')
    container?.classList.add('split-mode')

    hideActivityBarButtons()
  },
  appendTestModeControls: () => {
    console.log('appendTestModeControls')
    appendTestModeControls()

    // 模式切换事件监听
    document.getElementById('previewModeBtn')?.addEventListener('click', () => {
      editorMode.togglePreviewMode()
    })

    document.getElementById('codeModeBtn')?.addEventListener('click', () => {
      editorMode.toggleCodeMode()
    })

    document.getElementById('splitModeBtn')?.addEventListener('click', () => {
      editorMode.toggleSplitMode()
    })
    document.querySelector('#toggleAuxiliary')!.addEventListener('click', async () => {
      editorMode.toggleAuxiliary()
    })
    document.querySelector('#togglePanel')!.addEventListener('click', async () => {
      editorMode.togglePanel()
    })
  },
}

window.d8dAiEditor.init(editorMode)

/**
 * 清除存储数据
 * 重置用户数据和本地存储
 */
export async function clearStorage(): Promise<void> {
  // await userDataProvider.reset()
  // await ((await getService(IStorageService)) as BrowserStorageService).clear()
}

setUnexpectedErrorHandler((e) => {
  console.info('Unexpected error', e)
})

// export { remoteAuthority }
