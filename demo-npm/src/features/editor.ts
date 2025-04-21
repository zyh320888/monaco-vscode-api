/**
 * 编辑器功能模块 - 提供代码编辑器创建和管理功能
 * 主要功能：
 * 1. 创建全屏模态代码编辑器
 * 2. 管理编辑器生命周期
 * 3. 处理编辑器事件
 */
import {
  IResolvedTextEditorModel,
  IReference,
  OpenEditor
} from '@codingame/monaco-vscode-views-service-override'
import * as monaco from 'monaco-editor'

/**
 * 当前活动的编辑器实例
 * 包含：
 * - modelRef: 对文本模型的引用
 * - editor: monaco编辑器实例
 * - dispose: 清理方法
 * 当值为null时表示没有活动的编辑器
 */
let currentEditor:
  | ({
      modelRef: IReference<IResolvedTextEditorModel>
      editor: monaco.editor.IStandaloneCodeEditor
    } & monaco.IDisposable)
  | null = null
/**
 * 打开一个新的代码编辑器
 * @param modelRef 文本模型引用
 * @returns 返回创建的编辑器实例
 *
 * 功能流程：
 * 1. 清理现有编辑器(如果存在)
 * 2. 创建编辑器容器和遮罩层
 * 3. 初始化monaco编辑器
 * 4. 设置编辑器事件监听
 */
export const openNewCodeEditor: OpenEditor = async (modelRef) => {
  if (currentEditor != null) {
    currentEditor.dispose()
    currentEditor = null
  }
  // 创建编辑器遮罩层容器
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)' // 半透明黑色背景
  container.style.top = container.style.bottom = container.style.left = container.style.right = '0' // 全屏覆盖
  container.style.cursor = 'pointer' // 点击可关闭

  // 创建编辑器实际容器
  const editorElem = document.createElement('div')
  editorElem.style.position = 'absolute'
  editorElem.style.top =
    editorElem.style.bottom =
    editorElem.style.left =
    editorElem.style.right =
      '0' // 居中定位
  editorElem.style.margin = 'auto' // 自动边距实现居中
  editorElem.style.width = '80%' // 宽度占80%
  editorElem.style.height = '80%' // 高度占80%

  container.appendChild(editorElem)

  document.body.appendChild(container)
  try {
    // 创建monaco编辑器实例
    const editor = monaco.editor.create(editorElem, {
      model: modelRef.object.textEditorModel, // 使用传入的文本模型
      readOnly: true, // 设置为只读模式
      automaticLayout: true // 启用自动布局调整
    })

    currentEditor = {
      dispose: () => {
        editor.dispose()
        modelRef.dispose()
        document.body.removeChild(container)
        currentEditor = null
      },
      modelRef,
      editor
    }

    // 编辑器失去焦点时关闭
    editor.onDidBlurEditorWidget(() => {
      currentEditor?.dispose()
    })
    
    // 点击遮罩层关闭编辑器
    container.addEventListener('mousedown', (event) => {
      if (event.target !== container) {
        return // 如果不是点击在遮罩层上则不处理
      }

      currentEditor?.dispose() // 清理编辑器
    })

    return editor
  } catch (error) {
    document.body.removeChild(container)
    currentEditor = null
    throw error
  }
}
