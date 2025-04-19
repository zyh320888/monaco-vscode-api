# 如何使用monaco-vscode-api安装和运行VSCode服务器

## 安装VSCode服务器

通过运行以下命令获取正确VSCode版本的commit_sha：
```bash
curl https://raw.githubusercontent.com/CodinGame/monaco-vscode-api/v<monaco_vscode_api_version>/package.json | jq -r '.["config"]["vscode"]["commit"]'
```
(将`<monaco_vscode_api_version>`替换为monaco-vscode-api的版本号，从`3.2.3`开始)

然后下载服务器：

### 对于VSCode服务器

下载 `https://update.code.visualstudio.com/commit:${commit_sha}/server-<platform>-<arch>/stable`

替换：
- `<platform>` 为 `win32`、`linux` 或 `darwin`
- `<arch>` 为 `arm64`、`x64` 或 `armhf`

例如：<https://update.code.visualstudio.com/commit:863d2581ecda6849923a2118d93a088b0745d9d6/server-linux-x64/stable>

### 对于VSCodium服务器

从<https://github.com/VSCodium/vscodium/releases>获取`reh`版本

例如：`vscodium-reh-linux-x64-1.87.2.24072.tar.gz`

## 安装

在安装目录解压存档文件：
```bash
mkdir -p <安装目录> && tar --no-same-owner -xzv --strip-components=1 -C <安装目录> -f <存档文件>
```

也可以在下载时直接解压：
```bash
curl -L --max-redirs 5 https://update.code.visualstudio.com/commit:863d2581ecda6849923a2118d93a088b0745d9d6/server-linux-x64/stable | tar -xz -C . --strip-components=1
```

## 配置

在安装目录中，编辑`product.json`文件并确保：
- `commit`字段与之前找到的`commit_sha`一致（特别是对于VSCodium）
- `webEndpointUrlTemplate`包含将使用monaco-vscode-api的应用程序URL（例如：`https://my.domain.com/`）（如果不存在则创建该字段）

示例：
```bash
cat <<< "$(jq ".webEndpointUrlTemplate = \"https://my.domain.com/\"" product.json)" > product.json
cat <<< "$(jq ".commit = \"863d2581ecda6849923a2118d93a088b0745d9d6\"" product.json)" > product.json
```

### 高级配置

`commit`应与客户端配置一致，默认情况下是用于构建库的VSCode提交，但可以通过向服务初始化函数提供`configuration.productConfiguration.commit`来覆盖。

## 运行服务器

从安装目录运行：
```bash
./bin/code-server --port 8080 --without-connection-token --accept-server-license-terms --host 0.0.0.0
```
(或对于VSCodium使用`./bin/codium-server`)

注意：为了简化使用，它在所有接口上启动服务且没有安全令牌，但不要在生产环境中这样使用

## 使用服务器

- 添加`remoteAgent`服务覆盖(`@codingame/monaco-vscode-remote-agent-service-override`)
- 通过向服务初始化函数配置提供`remoteAuthority`来配置远程服务器的URL。它应仅包含授权信息（域名/IP和端口，例如：`localhost:8080`）。如果服务器配置需要，也可以提供`connectionToken`。
- 现在可以使用`vscode-remote`方案将远程目录作为工作区。例如：`vscode-remote://localhost:8080/my/project/directory`

## 在演示中测试

运行演示，然后访问<http://localhost:5173/?remoteAuthority=localhost:8080>

也可以访问<http://localhost:5173/?remoteAuthority=localhost:8080&remotePath=/any/path/on/your/machine>来打开机器上的目录作为当前工作区

## 生产环境注意事项

客户端和服务器上的提交和产品质量应该相同才能连接它们。如果您在集群上部署了服务器，并且客户端逐步升级：服务器需要同时暴露旧版本和新版本。

这是可以实现的，因为所有对服务器的调用都以`<quality>-<commit>`为前缀。因此可以在不同端口上启动两个服务器，并在它们前面使用反向代理根据路径前缀重定向调用。