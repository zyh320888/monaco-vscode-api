declare module '*?url' {
  const url: string
  export default url
}

declare module '*?worker' {
  interface WorkerConstructor {
    new (): Worker
  }

  const Worker: WorkerConstructor
  export default Worker
}

declare module '*?raw' {
  const content: string
  export default content
}


interface EditorMode {
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
