/**
 * VSCode API 通用设置文件
 *
 * 此文件负责配置和初始化monaco-vscode-api的核心功能，包括：
 * - 导入所有VSCode服务覆盖模块
 * - 设置工作区文件系统
 * - 配置Worker加载器
 * - 定义工作台构造选项
 * - 组合所有服务覆盖
 */
// 导入配置服务覆盖模块
import getConfigurationServiceOverride, {
  // IStoredWorkspace,
  initUserConfiguration
} from '@codingame/monaco-vscode-configuration-service-override'
import getKeybindingsServiceOverride, {
  initUserKeybindings
} from '@codingame/monaco-vscode-keybindings-service-override'
// import {
//   RegisteredFileSystemProvider,
//   RegisteredMemoryFile,
//   RegisteredReadOnlyFile,
//   createIndexedDBProviders,
//   registerHTMLFileSystemProvider,
//   registerFileSystemOverlay,
//   initFile
// } from '@codingame/monaco-vscode-files-service-override'
// 导入monaco编辑器核心模块
import * as monaco from 'monaco-editor'
import {
  IWorkbenchConstructionOptions,
  LogLevel,
  IEditorOverrideServices
} from '@codingame/monaco-vscode-api'
// 导入VSCode API模块
import * as vscode from 'vscode'
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override'
import getNotificationServiceOverride from '@codingame/monaco-vscode-notifications-service-override'
import getDialogsServiceOverride from '@codingame/monaco-vscode-dialogs-service-override'
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override'
import getSecretStorageServiceOverride from '@codingame/monaco-vscode-secret-storage-service-override'
import getAuthenticationServiceOverride from '@codingame/monaco-vscode-authentication-service-override'
import getScmServiceOverride from '@codingame/monaco-vscode-scm-service-override'
import getExtensionGalleryServiceOverride from '@codingame/monaco-vscode-extension-gallery-service-override'
import getBannerServiceOverride from '@codingame/monaco-vscode-view-banner-service-override'
import getStatusBarServiceOverride from '@codingame/monaco-vscode-view-status-bar-service-override'
import getTitleBarServiceOverride from '@codingame/monaco-vscode-view-title-bar-service-override'
import getDebugServiceOverride from '@codingame/monaco-vscode-debug-service-override'
import getPreferencesServiceOverride from '@codingame/monaco-vscode-preferences-service-override'
import getSnippetServiceOverride from '@codingame/monaco-vscode-snippets-service-override'
import getOutputServiceOverride from '@codingame/monaco-vscode-output-service-override'
import getTerminalServiceOverride from '@codingame/monaco-vscode-terminal-service-override'
import getSearchServiceOverride from '@codingame/monaco-vscode-search-service-override'
import getMarkersServiceOverride from '@codingame/monaco-vscode-markers-service-override'
import getAccessibilityServiceOverride from '@codingame/monaco-vscode-accessibility-service-override'
import getLanguageDetectionWorkerServiceOverride from '@codingame/monaco-vscode-language-detection-worker-service-override'
import getStorageServiceOverride from '@codingame/monaco-vscode-storage-service-override'
import getExtensionServiceOverride from '@codingame/monaco-vscode-extensions-service-override'
import getRemoteAgentServiceOverride from '@codingame/monaco-vscode-remote-agent-service-override'
import getEnvironmentServiceOverride from '@codingame/monaco-vscode-environment-service-override'
import getLifecycleServiceOverride from '@codingame/monaco-vscode-lifecycle-service-override'
import getWorkspaceTrustOverride from '@codingame/monaco-vscode-workspace-trust-service-override'
import getLogServiceOverride from '@codingame/monaco-vscode-log-service-override'
import getWorkingCopyServiceOverride from '@codingame/monaco-vscode-working-copy-service-override'
import getTestingServiceOverride from '@codingame/monaco-vscode-testing-service-override'
import getChatServiceOverride from '@codingame/monaco-vscode-chat-service-override'
import getNotebookServiceOverride from '@codingame/monaco-vscode-notebook-service-override'
import getWelcomeServiceOverride from '@codingame/monaco-vscode-welcome-service-override'
import getWalkThroughServiceOverride from '@codingame/monaco-vscode-walkthrough-service-override'
import getUserDataSyncServiceOverride from '@codingame/monaco-vscode-user-data-sync-service-override'
import getUserDataProfileServiceOverride from '@codingame/monaco-vscode-user-data-profile-service-override'
import getAiServiceOverride from '@codingame/monaco-vscode-ai-service-override'
import getTaskServiceOverride from '@codingame/monaco-vscode-task-service-override'
import getOutlineServiceOverride from '@codingame/monaco-vscode-outline-service-override'
import getTimelineServiceOverride from '@codingame/monaco-vscode-timeline-service-override'
import getCommentsServiceOverride from '@codingame/monaco-vscode-comments-service-override'
import getEditSessionsServiceOverride from '@codingame/monaco-vscode-edit-sessions-service-override'
import getEmmetServiceOverride from '@codingame/monaco-vscode-emmet-service-override'
import getInteractiveServiceOverride from '@codingame/monaco-vscode-interactive-service-override'
import getIssueServiceOverride from '@codingame/monaco-vscode-issue-service-override'
import getMultiDiffEditorServiceOverride from '@codingame/monaco-vscode-multi-diff-editor-service-override'
import getPerformanceServiceOverride from '@codingame/monaco-vscode-performance-service-override'
import getRelauncherServiceOverride from '@codingame/monaco-vscode-relauncher-service-override'
import getShareServiceOverride from '@codingame/monaco-vscode-share-service-override'
import getSpeechServiceOverride from '@codingame/monaco-vscode-speech-service-override'
import getSurveyServiceOverride from '@codingame/monaco-vscode-survey-service-override'
import getUpdateServiceOverride from '@codingame/monaco-vscode-update-service-override'
import getExplorerServiceOverride from '@codingame/monaco-vscode-explorer-service-override'
import getLocalizationServiceOverride from '@codingame/monaco-vscode-localization-service-override'
import getTreeSitterServiceOverride from '@codingame/monaco-vscode-treesitter-service-override'
import getTelemetryServiceOverride from '@codingame/monaco-vscode-telemetry-service-override'
import getMcpServiceOverride from '@codingame/monaco-vscode-mcp-service-override'
import { EnvironmentOverride } from '@codingame/monaco-vscode-api/workbench'
import { Worker } from './tools/crossOriginWorker'
import defaultKeybindings from './user/keybindings.json?raw'
import defaultConfiguration from './user/configuration.json?raw'
import { TerminalBackend } from './features/terminal'
import { workerConfig } from './tools/extHostWorker'
import 'vscode/localExtensionHost'

// 输出当前VSCode API客户端版本信息
console.log(vscode.version);

// 解析当前页面URL参数
const url = new URL(document.location.href)
const params = url.searchParams
export const remoteAuthority = params.get('remoteAuthority') ?? undefined
export const connectionToken = params.get('connectionToken') ?? undefined
export const remotePath =
  remoteAuthority != null ? (params.get('remotePath') ?? undefined) : undefined
export const resetLayout = params.has('resetLayout')
export const useHtmlFileSystemProvider = params.has('htmlFileSystemProvider')
params.delete('resetLayout')

window.history.replaceState({}, document.title, url.href)

// 默认工作区文件路径
// export let workspaceFile = monaco.Uri.file('/workspace.code-workspace')

// 创建IndexedDB存储提供者
// export const userDataProvider = await createIndexedDBProviders()

// if (useHtmlFileSystemProvider) {
//   workspaceFile = monaco.Uri.from({ scheme: 'tmp', path: '/test.code-workspace' })
//   await initFile(
//     workspaceFile,
//     JSON.stringify(
//       <IStoredWorkspace>{
//         folders: []
//       },
//       null,
//       2
//     )
//   )

//   registerHTMLFileSystemProvider()
// } else {
//   // 创建注册文件系统提供者(非只读模式)
//   const fileSystemProvider = new RegisteredFileSystemProvider(false)

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/test.js'),
//       `// import anotherfile
// let variable = 1
// function inc () {
//   variable++
// }

// while (variable < 5000) {
//   inc()
//   console.log('Hello world', variable);
// }`
//     )
//   )

//   const content = new TextEncoder().encode('This is a readonly static file')
//   fileSystemProvider.registerFile(
//     new RegisteredReadOnlyFile(
//       vscode.Uri.file('/workspace/test_readonly.js'),
//       async () => content,
//       content.length
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/jsconfig.json'),
//       `{
//   "compilerOptions": {
//     "target": "es2020",
//     "module": "esnext",
//     "lib": [
//       "es2021",
//       "DOM"
//     ]
//   }
// }`
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/index.html'),
//       `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <title>monaco-vscode-api demo</title>
//     <link rel="stylesheet" href="test.css">
//   </head>
//   <body>
//     <style type="text/css">
//       h1 {
//         color: DeepSkyBlue;
//       }
//     </style>

//     <h1>Hello, world!</h1>
//   </body>
// </html>`
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/test.md'),
//       `
// ***Hello World***

// Math block:
// $$
// \\displaystyle
// \\left( \\sum_{k=1}^n a_k b_k \\right)^2
// \\leq
// \\left( \\sum_{k=1}^n a_k^2 \\right)
// \\left( \\sum_{k=1}^n b_k^2 \\right)
// $$

// # Easy Math

// 2 + 2 = 4 // this test will pass
// 2 + 2 = 5 // this test will fail

// # Harder Math

// 230230 + 5819123 = 6049353
// `
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/test.customeditor'),
//       `
// Custom Editor!`
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       vscode.Uri.file('/workspace/test.css'),
//       `
// h1 {
//   color: DeepSkyBlue;
// }`
//     )
//   )

//   // Use a workspace file to be able to add another folder later (for the "Attach filesystem" button)
//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       workspaceFile,
//       JSON.stringify(
//         <IStoredWorkspace>{
//           folders: [
//             {
//               path: '/workspace'
//             }
//           ]
//         },
//         null,
//         2
//       )
//     )
//   )

//   fileSystemProvider.registerFile(
//     new RegisteredMemoryFile(
//       monaco.Uri.file('/workspace/.vscode/extensions.json'),
//       JSON.stringify(
//         {
//           recommendations: ['vscodevim.vim']
//         },
//         null,
//         2
//       )
//     )
//   )

//   registerFileSystemOverlay(1, fileSystemProvider)
// }

/**
 * Worker加载器配置
 * 定义不同类型Worker的加载方式
 */
export type WorkerLoader = () => Worker
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  TextEditorWorker: () =>
    new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
      type: 'module'
    }),
  TextMateWorker: () =>
    new Worker(
      new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url),
      { type: 'module' }
    ),
  OutputLinkDetectionWorker: () =>
    new Worker(
      new URL('@codingame/monaco-vscode-output-service-override/worker', import.meta.url),
      { type: 'module' }
    ),
  LanguageDetectionWorker: () =>
    new Worker(
      new URL(
        '@codingame/monaco-vscode-language-detection-worker-service-override/worker',
        import.meta.url
      ),
      { type: 'module' }
    ),
  NotebookEditorWorker: () =>
    new Worker(
      new URL('@codingame/monaco-vscode-notebook-service-override/worker', import.meta.url),
      { type: 'module' }
    ),
  LocalFileSearchWorker: () =>
    new Worker(
      new URL('@codingame/monaco-vscode-search-service-override/worker', import.meta.url),
      { type: 'module' }
    )
}
window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label]
    if (workerFactory != null) {
      return workerFactory()
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`)
  }
}

// 在初始化服务前设置配置，确保直接可用(特别是主题设置，防止闪烁)
await Promise.all([
  initUserConfiguration(defaultConfiguration),
  initUserKeybindings(defaultKeybindings)
])

/**
 * 工作台构造选项
 * 配置VSCode工作台的核心参数
 */
// 工作台构造选项配置
/**
 * 工作台构造选项配置
 * 定义VSCode工作台的核心参数和行为
 */
export const constructOptions: IWorkbenchConstructionOptions = {
  // 远程授权信息，用于远程连接场景
  remoteAuthority,
  // 启用工作区信任功能 (true=启用)
  // enableWorkspaceTrust: true,
  // 连接令牌，用于安全验证
  connectionToken,
  // 窗口指示器配置 (显示在窗口标题栏)
  windowIndicator: {
    label: 'monaco-vscode-api2232323', // 显示标签文本
    tooltip: '',                // 悬停提示文本
    command: ''                 // 点击执行的命令
  },
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
              path: remotePath,       // 远程路径
              authority: remoteAuthority // 远程授权
            })
          }
  },
  // 开发选项配置
  developmentOptions: {
    logLevel: LogLevel.Info // 日志级别 (默认Info级别)
  },
  // 默认配置项
  configurationDefaults: {
    // 窗口标题格式 (支持变量: ${separator}=分隔符, ${dirty}=修改标记, ${activeEditorShort}=当前编辑器名称)
    'window.title': 'Monaco-Vscode-Api34535${separator}${dirty}${activeEditorShort}'
  },
  // 默认布局配置
  defaultLayout: {
    // 默认打开的编辑器配置
    // editors: useHtmlFileSystemProvider
    //   ? undefined
    //   : [
    //       {
    //         uri: monaco.Uri.file('/workspace/test.js'), // 测试JS文件URI
    //         viewColumn: 1                              // 显示在第一视图列
    //       },
    //       {
    //         uri: monaco.Uri.file('/workspace/test.md'), // 测试Markdown文件URI
    //         viewColumn: 2                               // 显示在第二视图列
    //       }
    //     ],
    // 布局结构定义
    layout: useHtmlFileSystemProvider
      ? undefined
      : {
          editors: {
            orientation: 0, // 编辑器方向 (0=水平排列，1=垂直排列)
            groups: [{ size: 1 }, { size: 1 }] // 编辑器组大小比例
          }
        },
    // 侧边栏视图配置
    views: [
      {
        id: 'custom-view' // 自定义视图ID
      }
    ],
    force: resetLayout // 是否强制重置布局 (true=重置)
  },
  // // 欢迎横幅配置
  // welcomeBanner: {
  //   message: 'Welcome in monaco-vscode-api demo' // 欢迎消息文本
  // },
  // 产品配置信息
  productConfiguration: {
    nameShort: 'monaco-vscode-api223', // 产品简称
    nameLong: 'monaco-vscode-api433445353',  // 产品全称
    // 扩展市场配置
    extensionsGallery: {
      serviceUrl: 'https://open-vsx.org/vscode/gallery', // 扩展市场服务URL
      resourceUrlTemplate: 'https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}', // 资源URL模板
      extensionUrlTemplate: 'https://open-vsx.org/vscode/gallery/{publisher}/{name}/latest', // 扩展详情URL模板
      controlUrl: '', // 控制URL (保留字段)
      nlsBaseUrl: ''  // 本地化基础URL (保留字段)
    },
    // version: '1.99.2', // 产品版本号 (注释状态)
    // commit: '4949701c880d4bdb949e3c0e6b400288da7f474b', // 提交哈希 (注释状态)
  }
}

/**
 * 环境覆盖选项
 * 用于自定义VSCode环境设置
 */
export const envOptions: EnvironmentOverride = {
  // Otherwise, VSCode detect it as the first open workspace folder
  // which make the search result extension fail as it's not able to know what was detected by VSCode
  // userHome: vscode.Uri.file('/')
}

/**
 * 通用服务覆盖
 * 组合所有VSCode服务的覆盖实现
 */
export const commonServices: IEditorOverrideServices = {
  // 认证服务覆盖 - 处理用户认证相关功能
  ...getAuthenticationServiceOverride(), // 认证服务覆盖 - 处理用户认证相关功能
  ...getLogServiceOverride(), // 日志服务覆盖 - 提供日志记录功能
  ...getExtensionServiceOverride(workerConfig), // 扩展服务覆盖 - 管理VSCode扩展
  ...getExtensionGalleryServiceOverride({ webOnly: false }), // 扩展市场服务覆盖 - 处理扩展市场相关功能
  ...getModelServiceOverride(), // 模型服务覆盖 - 管理编辑器文本模型
  ...getNotificationServiceOverride(), // 通知服务覆盖 - 处理系统通知
  ...getDialogsServiceOverride(), // 对话框服务覆盖 - 管理系统对话框
  ...getConfigurationServiceOverride(), // 配置服务覆盖 - 管理系统配置
  ...getKeybindingsServiceOverride(), // 快捷键服务覆盖 - 管理键盘快捷键
  ...getTextmateServiceOverride(), // Textmate语法服务覆盖 - 提供语法高亮
  ...getTreeSitterServiceOverride(), // Tree-sitter语法分析服务覆盖
  ...getThemeServiceOverride(), // 主题服务覆盖 - 管理编辑器主题
  ...getLanguagesServiceOverride(), // 语言服务覆盖 - 提供语言支持
  ...getDebugServiceOverride(), // 调试服务覆盖 - 提供调试功能
  ...getPreferencesServiceOverride(), // 首选项服务覆盖 - 管理用户首选项
  ...getOutlineServiceOverride(), // 大纲视图服务覆盖 - 提供代码大纲功能
  ...getTimelineServiceOverride(), // 时间线服务覆盖 - 提供文件历史时间线
  ...getBannerServiceOverride(), // 横幅服务覆盖 - 管理顶部横幅
  ...getStatusBarServiceOverride(), // 状态栏服务覆盖 - 管理底部状态栏
  ...getTitleBarServiceOverride(), // 标题栏服务覆盖 - 管理窗口标题栏
  ...getSnippetServiceOverride(), // 代码片段服务覆盖 - 管理代码片段
  ...getOutputServiceOverride(), // 输出面板服务覆盖 - 管理输出面板
  ...getTerminalServiceOverride(new TerminalBackend()), // 终端服务覆盖 - 管理集成终端
  ...getSearchServiceOverride(), // 搜索服务覆盖 - 提供全局搜索功能
  ...getMarkersServiceOverride(), // 标记服务覆盖 - 管理问题和警告标记
  ...getAccessibilityServiceOverride(), // 无障碍服务覆盖 - 提供无障碍支持
  ...getLanguageDetectionWorkerServiceOverride(), // 语言检测服务覆盖 - 自动检测文件语言
  ...getStorageServiceOverride({ // 存储服务覆盖 - 管理本地存储
    fallbackOverride: {
      'workbench.activity.showAccounts': false
    }
  }),
  ...getRemoteAgentServiceOverride({ scanRemoteExtensions: true }), // 远程代理服务覆盖 - 处理远程连接
  ...getLifecycleServiceOverride(), // 生命周期服务覆盖 - 管理应用生命周期
  ...getEnvironmentServiceOverride(), // 环境服务覆盖 - 提供环境信息
  ...getWorkspaceTrustOverride(), // 工作区信任服务覆盖 - 管理工作区信任状态
  ...getWorkingCopyServiceOverride(), // 工作副本服务覆盖 - 管理未保存的更改
  ...getScmServiceOverride(), // 源代码管理服务覆盖 - 提供版本控制功能
  ...getTestingServiceOverride(), // 测试服务覆盖 - 提供测试功能
  ...getChatServiceOverride(), // 聊天服务覆盖 - 提供聊天功能
  ...getNotebookServiceOverride(), // 笔记本服务覆盖 - 管理笔记本文档
  ...getWelcomeServiceOverride(), // 欢迎页面服务覆盖 - 管理欢迎页面
  ...getWalkThroughServiceOverride(), // 引导服务覆盖 - 提供产品引导
  ...getUserDataProfileServiceOverride(), // 用户数据配置服务覆盖 - 管理用户配置
  ...getUserDataSyncServiceOverride(), // 用户数据同步服务覆盖 - 同步用户设置
  ...getAiServiceOverride(), // AI服务覆盖 - 提供AI辅助功能
  ...getTaskServiceOverride(), // 任务服务覆盖 - 管理任务运行
  ...getCommentsServiceOverride(), // 评论服务覆盖 - 管理代码评论
  ...getEditSessionsServiceOverride(), // 编辑会话服务覆盖 - 管理编辑会话
  ...getEmmetServiceOverride(), // Emmet服务覆盖 - 提供Emmet缩写扩展
  ...getInteractiveServiceOverride(), // 交互式服务覆盖 - 管理交互式会话
  ...getIssueServiceOverride(), // 问题报告服务覆盖 - 管理问题报告
  ...getMultiDiffEditorServiceOverride(), // 多差异编辑器服务覆盖 - 管理差异比较
  ...getPerformanceServiceOverride(), // 性能服务覆盖 - 监控性能指标
  ...getRelauncherServiceOverride(), // 重启服务覆盖 - 处理应用重启
  ...getShareServiceOverride(), // 分享服务覆盖 - 管理内容分享
  ...getSpeechServiceOverride(), // 语音服务覆盖 - 提供语音功能
  ...getSurveyServiceOverride(), // 调查服务覆盖 - 管理用户调查
  ...getUpdateServiceOverride(), // 更新服务覆盖 - 处理应用更新
  ...getExplorerServiceOverride(), // 资源管理器服务覆盖 - 管理文件资源
  ...getLocalizationServiceOverride({ // 本地化服务覆盖 - 提供多语言支持
    async clearLocale() {
      const url = new URL(window.location.href)
      url.searchParams.delete('locale')
      window.history.pushState(null, '', url.toString())
    },
    async setLocale(id) {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', id)
      window.history.pushState(null, '', url.toString())
    },
    availableLanguages: [
      {
        locale: 'en',
        languageName: 'English'
      },
      {
        locale: 'cs',
        languageName: 'Czech'
      },
      {
        locale: 'de',
        languageName: 'German'
      },
      {
        locale: 'es',
        languageName: 'Spanish'
      },
      {
        locale: 'fr',
        languageName: 'French'
      },
      {
        locale: 'it',
        languageName: 'Italian'
      },
      {
        locale: 'ja',
        languageName: 'Japanese'
      },
      {
        locale: 'ko',
        languageName: 'Korean'
      },
      {
        locale: 'pl',
        languageName: 'Polish'
      },
      {
        locale: 'pt-br',
        languageName: 'Portuguese (Brazil)'
      },
      {
        locale: 'qps-ploc',
        languageName: 'Pseudo Language'
      },
      {
        locale: 'ru',
        languageName: 'Russian'
      },
      {
        locale: 'tr',
        languageName: 'Turkish'
      },
      {
        locale: 'zh-hans',
        languageName: 'Chinese (Simplified)'
      },
      {
        locale: 'zh-hant',
        languageName: 'Chinese (Traditional)'
      },
      {
        locale: 'en',
        languageName: 'English'
      }
    ]
  }),
  ...getSecretStorageServiceOverride(), // 密钥存储服务覆盖 - 安全存储敏感信息
  ...getTelemetryServiceOverride(), // 遥测服务覆盖 - 收集使用数据
  ...getMcpServiceOverride() // MCP服务覆盖 - 管理模型控制协议
}
