### 解决扩展webview iframe 无法显示的问题
主要因为 service-worker 的作用域问题

将
demo-npm/node_modules/@codingame/monaco-vscode-view-common-service-override/assets/webview
中的 index.html , index-no-csp.html 文件复制到
demo-npm/node_modules/@codingame/monaco-vscode-view-common-service-override/vscode/src/vs/workbench/contrib/webview/browser/pre
中


修改
demo-npm/node_modules/@codingame/monaco-vscode-view-common-service-override/index.js

start: 72
SEARCH
==========
registerAssets({
    'vs/workbench/contrib/webview/browser/pre/service-worker.js': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/service-worker.js', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/index.html': () => changeUrlDomain(new URL('./assets/webview/index.html', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/index-no-csp.html': () => changeUrlDomain(new URL('./assets/webview/index-no-csp.html', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/fake.html': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/fake.html', import.meta.url).href, webviewIframeAlternateDomains)
});
==========
registerAssets({
    'vs/workbench/contrib/webview/browser/pre/service-worker.js': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/service-worker.js', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/index.html': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/index.html', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/index-no-csp.html': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/index-no-csp.html', import.meta.url).href, webviewIframeAlternateDomains),
    'vs/workbench/contrib/webview/browser/pre/fake.html': () => changeUrlDomain(new URL('./vscode/src/vs/workbench/contrib/webview/browser/pre/fake.html', import.meta.url).href, webviewIframeAlternateDomains)
});

修改后需要将 demo-npm/node_modules/.vite 删除
然后重新 npm run start


### 解决跨域问题

修改
demo-npm/vite.config.ts

添加
```
server: {
    proxy: {
      '^/stable-': {
        target: 'ws://localhost:23964',
        ws: true,
        changeOrigin: true
      },
    },
}
```


### 去掉deno 扩展的欢迎页面

修改
demo-npm/src/features/extensions/denoland.vscode-deno-3.43.6-universal/client/dist/main.js

SEARCH
==========
showWelcomePageIfFirstUse(context, extensionContext2);
==========
// showWelcomePageIfFirstUse(context, extensionContext2);


### 增加vsad支持
demo-npm/node_modules 复制入 vsad

底部加入 define 来支持 amd
demo-npm/node_modules/vsda/rust/web/vsda.js

```js
// AMD loader support
if (typeof define === 'function' && define.amd) {
  define(function() {
    return vsda_web;
  });
}
```

demo-npm/node_modules/@codingame/monaco-vscode-api/vscode/src/vs/amdX.js
底部增加
```js

export const canASAR = false; // TODO@esm: ASAR disabled in ESM
export function resolveAmdNodeModulePath(nodeModuleName, pathInsideNodeModule) {
    const product = globalThis._VSCODE_PRODUCT_JSON;
    const isBuilt = Boolean((product ?? globalThis.vscode?.context?.configuration()?.product)?.commit);
    const useASAR = (canASAR && isBuilt && !platform.isWeb);
    const nodeModulePath = `${nodeModuleName}/${pathInsideNodeModule}`;
    const actualNodeModulesPath = (useASAR ? nodeModulesAsarPath : nodeModulesPath);
    const resourcePath = `${actualNodeModulesPath}/${nodeModulePath}`;
    return FileAccess.asBrowserUri(resourcePath).toString(true);
}
```

修改
demo-npm/node_modules/@codingame/monaco-vscode-api/missing-services.js

将SignService 类改成引入

```js
import { SignService } from './vscode/src/vs/platform/sign/browser/signService';
registerSingleton(ISignService, SignService, InstantiationType.Delayed);
```
从 vscode复制过来
demo-npm/node_modules/@codingame/monaco-vscode-api/vscode/src/vs/platform/sign/browser 