import * as monaco from 'monaco-editor'
import './style.css'

// 创建基础编辑器容器
const container = document.createElement('div')
container.id = 'editor'
container.style.height = '100vh'
document.body.append(container)

// 创建最简单的编辑器实例
monaco.editor.create(container, {
  value: '// 最小化配置示例\nconsole.log("Hello from minimal config")',
  language: 'javascript',
  automaticLayout: true
})