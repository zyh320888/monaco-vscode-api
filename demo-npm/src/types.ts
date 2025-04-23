import type { ISecretStorageProvider } from "@codingame/monaco-vscode-secret-storage-service-override/vscode/vs/platform/secrets/common/secrets";

export interface EditorMode {
    /**
     * 初始化
     */
    init: () => void
    /**
     * 添加测试模式切换按钮
     */
    appendTestModeControls: () => void
    /**
     * 切换辅助栏
     */
    toggleAuxiliary:  () => Promise<void>
    /**
     * 切换预览模式
     */
    togglePreviewMode: () => void
    /**
     * 切换代码模式
     */
    toggleCodeMode: () => void
    /**
     * 切换并列模式
     */
    toggleSplitMode: () => void
}
  

export interface D8dAiEditor {
    /**
     * 初始化
     */
    init: (obj: EditorMode) => void,
    secretStorageProvider: ISecretStorageProvider
}
  declare global {
    interface Window {
      d8dAiEditor: D8dAiEditor
    }
  }