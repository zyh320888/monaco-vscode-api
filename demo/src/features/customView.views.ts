/**
 * 导入必要的模块和类型
 * - IDialogService: 对话框服务接口
 * - EditorInput: 编辑器输入基类
 * - createInstance: 创建实例的工具函数
 * - IInstantiationService: 实例化服务接口
 * - IEditorGroup: 编辑器组接口
 */
import {
  IDialogService,
  EditorInput,
  createInstance,
  IInstantiationService,
  IEditorGroup
} from '@codingame/monaco-vscode-api'
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
  IEditorCloseHandler,
  IEditorSerializer,
  registerCustomView,
  registerEditorPane,
  registerEditor,
  registerEditorSerializer,
  ViewContainerLocation,
  SimpleEditorPane,
  SimpleEditorInput,
  RegisteredEditorPriority,
  ConfirmResult
} from '@codingame/monaco-vscode-views-service-override'
// 导入monaco编辑器核心模块
import * as monaco from 'monaco-editor'

/**
 * 注册自定义视图
 * @param {Object} config 视图配置对象
 *   - id: 视图唯一标识符
 *   - name: 视图显示名称
 *   - order: 视图排序位置
 *   - renderBody: 渲染视图内容的函数
 *   - location: 视图位置(面板)
 *   - icon: 视图图标URL
 *   - actions: 视图关联的操作按钮数组
 */
registerCustomView({
  id: 'custom-view', // 视图唯一ID
  name: 'Custom demo view', // 视图显示名称
  order: 0, // 在面板中的排序位置
  /**
   * 渲染视图主体内容
   * @param {HTMLElement} container 视图容器元素
   * @returns {monaco.IDisposable} 可销毁对象
   */
  renderBody: function (container: HTMLElement): monaco.IDisposable {
    // 设置容器样式为flex布局
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'
    container.style.height = '100%'
    // 设置容器HTML内容
    container.innerHTML = 'This is a custom view<br />You can render anything you want here'

    // 返回disposable对象用于清理
    return {
      dispose() {} // 空实现，无资源需要清理
    }
  },
  location: ViewContainerLocation.Panel, // 视图位置为面板
  icon: new URL('../Visual_Studio_Code_1.35_icon.svg', import.meta.url).toString(), // 视图图标
  actions: [ // 视图操作按钮数组
    {
      id: 'custom-action', // 操作ID
      title: 'Custom action', // 操作标题
      /**
       * 渲染操作按钮
       * @param {HTMLElement} element 按钮容器元素
       */
      render(element) {
        const button = document.createElement('button')
        button.innerText = 'Ugly button'
        button.style.height = '30px'
        // 绑定点击事件
        button.onclick = () => {
          alert('What did you expect?')
        }
        element.append(button)
      }
    },
    {
      id: 'custom-action2', // 操作ID
      title: 'Custom action2', // 操作标题
      icon: 'dialogInfo', // 操作图标
      /**
       * 执行操作
       * @param {Object} accessor 服务访问器
       */
      async run(accessor) {
        // 显示信息对话框
        void accessor.get(IDialogService).info('This is a custom view action button')
      }
    }
  ]
})

/**
 * 自定义编辑器面板类，继承自SimpleEditorPane
 * 用于创建自定义的编辑器界面
 */
class CustomEditorPane extends SimpleEditorPane {
  static readonly ID = 'workbench.editors.customEditor' // 编辑器类型唯一标识符

  /**
   * 构造函数
   * @param {IEditorGroup} group 编辑器所属的组
   */
  constructor(group: IEditorGroup) {
    super(CustomEditorPane.ID, group) // 调用父类构造函数
  }

  /**
   * 初始化编辑器面板
   * @returns {HTMLElement} 初始化后的容器元素
   */
  initialize(): HTMLElement {
    const container = document.createElement('div')
    // 设置容器样式
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'
    // 设置默认内容
    container.innerHTML = 'This is a custom editor pane<br />You can render anything you want here'
    return container
  }

  /**
   * 渲染编辑器输入内容
   * @param {EditorInput} input 编辑器输入对象
   * @returns {Promise<monaco.IDisposable>} 可销毁对象
   */
  async renderInput(input: EditorInput): Promise<monaco.IDisposable> {
    if (input.resource != null) {
      // 如果有关联的资源URI，显示文件路径
      this.container.innerHTML = 'Opened file: ' + input.resource.path
    } else {
      // 否则显示默认内容
      this.container.innerHTML =
        'This is a custom editor pane<br />You can render anything you want here'
    }

    // 返回disposable对象
    return {
      dispose() {} // 空实现，无资源需要清理
    }
  }
}
/**
 * 自定义编辑器输入类，继承自SimpleEditorInput并实现IEditorCloseHandler接口
 * 处理编辑器关闭确认逻辑
 */
class CustomEditorInput extends SimpleEditorInput implements IEditorCloseHandler {
  /**
   * 构造函数
   * @param {monaco.Uri | undefined} resource 关联的资源URI
   * @param {IDialogService} dialogService 对话框服务(通过依赖注入)
   */
  constructor(
    resource: monaco.Uri | undefined,
    @IDialogService private dialogService: IDialogService
  ) {
    super(resource) // 调用父类构造函数

    this.closeHandler = this // 设置自身为关闭处理器
    this.setName('Custom editor pane input') // 设置编辑器名称
  }

  /**
   * 确认关闭操作
   * @returns {Promise<number>} 返回确认结果
   */
  async confirm(): Promise<number> {
    const { confirmed } = await this.dialogService.confirm({
      message: 'Are you sure you want to close this INCREDIBLE editor pane?'
    })
    // 根据用户选择返回不同结果
    return confirmed ? ConfirmResult.DONT_SAVE : ConfirmResult.CANCEL
  }

  /**
   * 是否显示关闭确认对话框
   * @returns {boolean} 总是返回true表示需要确认
   */
  showConfirm(): boolean {
    return true
  }

  /**
   * 获取编辑器类型ID
   * @returns {string} 返回编辑器类型ID
   */
  get typeId(): string {
    return CustomEditorPane.ID
  }
}

/**
 * 注册自定义编辑器面板
 * @param {string} id 面板ID
 * @param {string} name 面板显示名称
 * @param {typeof CustomEditorPane} ctor 编辑器面板类
 * @param {Array} inputs 支持的编辑器输入类数组
 */
registerEditorPane('custom-editor-pane', 'Custom editor pane', CustomEditorPane, [
  CustomEditorInput
])

/**
 * 注册自定义编辑器
 * @param {string} globPattern 关联的文件模式(*.customeditor)
 * @param {Object} editorDescriptor 编辑器描述符
 *   - id: 编辑器ID
 *   - label: 编辑器标签
 *   - priority: 编辑器优先级
 * @param {Object} options 编辑器选项
 *   - singlePerResource: 每个资源是否只允许一个编辑器实例
 * @param {Object} editorInputFactory 编辑器输入工厂
 *   - createEditorInput: 创建编辑器输入的方法
 */
registerEditor(
  '*.customeditor', // 关联的文件扩展名模式
  {
    id: CustomEditorPane.ID, // 使用自定义面板的ID
    label: 'Custom editor pane input', // 编辑器显示名称
    priority: RegisteredEditorPriority.default // 默认优先级
  },
  {
    singlePerResource: true // 每个资源只允许一个编辑器实例
  },
  {
    /**
     * 创建编辑器输入
     * @param {EditorInput} editorInput 基础编辑器输入
     * @returns {Object} 包含自定义编辑器输入的对象
     */
    async createEditorInput(editorInput) {
      return {
        editor: await createInstance(CustomEditorInput, editorInput.resource)
      }
    }
  }
)

/**
 * 自定义编辑器输入的序列化接口
 */
interface ISerializedCustomEditorInput {
  resourceJSON?: monaco.UriComponents // 资源URI的JSON表示
}

/**
 * 注册编辑器序列化器
 * @param {string} editorId 编辑器ID
 * @param {IEditorSerializer} serializer 序列化器实现类
 */
registerEditorSerializer(
  CustomEditorPane.ID, // 关联的编辑器ID
  class implements IEditorSerializer {
    /**
     * 检查是否可以序列化
     * @returns {boolean} 总是返回true表示可序列化
     */
    canSerialize(): boolean {
      return true
    }

    /**
     * 序列化编辑器输入
     * @param {CustomEditorInput} editor 编辑器输入实例
     * @returns {string|undefined} 序列化后的JSON字符串
     */
    serialize(editor: CustomEditorInput): string | undefined {
      const serializedFileEditorInput: ISerializedCustomEditorInput = {
        resourceJSON: editor.resource?.toJSON() // 转换URI为JSON
      }
      return JSON.stringify(serializedFileEditorInput)
    }

    /**
     * 反序列化编辑器输入
     * @param {IInstantiationService} instantiationService 实例化服务
     * @param {string} serializedEditor 序列化的编辑器数据
     * @returns {EditorInput|undefined} 反序列化后的编辑器输入
     */
    deserialize(
      instantiationService: IInstantiationService,
      serializedEditor: string
    ): EditorInput | undefined {
      const serializedFileEditorInput: ISerializedCustomEditorInput = JSON.parse(serializedEditor)
      return instantiationService.createInstance(
        CustomEditorInput,
        monaco.Uri.revive(serializedFileEditorInput.resourceJSON) // 从JSON恢复URI
      )
    }
  }
)


// 辅助栏视图注册示例
registerCustomView({
  id: 'custom-auxiliary-view',
  name: 'Custom Auxiliary View',
  location: ViewContainerLocation.AuxiliaryBar, // 关键区别：指定为辅助栏
  renderBody(container) {
    container.innerHTML = 'This is a custom auxiliary bar view';
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

export { CustomEditorInput }
