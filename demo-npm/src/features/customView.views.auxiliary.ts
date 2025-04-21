
/**
 * 导入自定义视图和编辑器相关的服务和类
 * 型
 * - IEditorCloseHandler: 编辑器关闭处理器接口
 * - IEditorSerializer: 编辑器序列化器接口
 * - registerCustomView: 注册自定义视图的函数
 * - registerEditorPane: 注册编辑器面板的函数
 * - registerEditor: 注册编辑器的函数
 * - registerEditorSerializer: 注册编辑器序列化器的函数
 * - ViewContainerLocation: 视图容器位置枚举
 * - SimpleEditorPane: 简单编辑器面板基类
 * - SimpleEditorInput: 简单编辑器输入基类
 * - RegisteredEditorPriority: 编辑器优先级枚举
 * - ConfirmResult: 确认结果枚举
 */
import {
  registerCustomView,
  ViewContainerLocation,
} from '@codingame/monaco-vscode-views-service-override'


// 辅助栏视图注册示例
registerCustomView({
  id: 'custom-auxiliary-view',
  name: 'Custom Auxiliary View',
  location: ViewContainerLocation.AuxiliaryBar, // 关键区别：指定为辅助栏
  renderBody(container) {
    container.innerHTML = 'This is a custom auxiliary23424 bar view';
    return { dispose() {} };
  },
  icon: '$(debug)',
  actions: [{
    id: 'auxiliary-action',
    title: 'Auxiliary Action',
    run: async (accessor) => {
      console.log('Auxiliary action triggered');
    }
  }]
});

