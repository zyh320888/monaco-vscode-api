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






