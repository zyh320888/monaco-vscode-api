#!/bin/bash

# VSCode Server安装脚本
set -e

# 参数设置
MONACO_VSCODE_API_VERSION=${1:-"16.0.2"}  # 可修改为需要的版本
INSTALL_DIR=${2:-"./vscode-server"}      # 安装目录
PLATFORM=${3:-"linux"}                   # 平台: win32/linux/darwin
ARCH=${4:-"x64"}                         # 架构: arm64/x64/armhf
PORT=${5:-8080}                          # 服务端口
HOST=${6:-"0.0.0.0"}                     # 监听地址
WEB_ENDPOINT=${7:-"https://my.domain.com/"} # web端点URL

# 检查依赖
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo "错误: curl未安装"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo "错误: jq未安装，请先安装: sudo apt-get install jq"
        exit 1
    fi
    
    if ! command -v tar &> /dev/null; then
        echo "错误: tar未安装"
        exit 1
    fi
}

# 获取VSCode commit_sha
get_commit_sha() {
    echo "获取VSCode commit_sha..."
    COMMIT_SHA=$(curl -s https://raw.githubusercontent.com/CodinGame/monaco-vscode-api/v$MONACO_VSCODE_API_VERSION/package.json | jq -r '.["config"]["vscode"]["commit"]')
    
    if [ -z "$COMMIT_SHA" ]; then
        echo "错误: 无法获取commit_sha，请检查MONACO_VSCODE_API_VERSION是否正确"
        exit 1
    fi
    
    echo "获取到commit_sha: $COMMIT_SHA"
}

# 下载VSCode server
download_server() {
    echo "下载VSCode server..."
    SERVER_URL="https://update.code.visualstudio.com/commit:$COMMIT_SHA/server-$PLATFORM-$ARCH/stable"
    echo "下载URL: $SERVER_URL"

    mkdir -p $INSTALL_DIR
    if ! curl -L --max-redirs 5 $SERVER_URL | tar -xz -C $INSTALL_DIR --strip-components=1; then
        echo "错误: 下载或解压失败"
        exit 1
    fi
}

# 配置product.json
configure_product() {
    echo "配置product.json..."
    cd $INSTALL_DIR
    
    if [ ! -f "product.json" ]; then
        echo "错误: product.json文件不存在"
        exit 1
    fi
    
    jq ".webEndpointUrlTemplate = \"$WEB_ENDPOINT\"" product.json > product.json.tmp
    jq ".commit = \"$COMMIT_SHA\"" product.json.tmp > product.json
    rm product.json.tmp
}

# 检查端口是否可用
check_port() {
    if nc -z $HOST $PORT &>/dev/null; then
        echo "错误: 端口 $PORT 已被占用"
        read -p "是否尝试自动查找可用端口? (y/n): " choice
        if [[ $choice =~ ^[Yy]$ ]]; then
            for ((i=$PORT+1; i<=$((PORT+10)); i++)); do
                if ! nc -z $HOST $i &>/dev/null; then
                    PORT=$i
                    echo "使用可用端口: $PORT"
                    return
                fi
            done
            echo "错误: 未找到可用端口"
            exit 1
        else
            exit 1
        fi
    fi
}

# 启动server
start_server() {
    echo "启动VSCode server..."
    if [ ! -f "./bin/code-server" ]; then
        echo "错误: code-server可执行文件不存在"
        exit 1
    fi
    
    check_port
    echo "使用端口: $PORT"
    ./bin/code-server --port $PORT --without-connection-token --accept-server-license-terms --host $HOST
}

# 主流程
main() {
    check_dependencies
    get_commit_sha
    download_server
    configure_product
    # start_server
    
    # echo "VSCode server已启动，访问地址: http://$HOST:$PORT"
}

main