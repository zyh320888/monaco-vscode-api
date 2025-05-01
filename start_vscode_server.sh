#!/bin/bash

# VSCode Server启动脚本
set -e

# 默认参数
SERVER_DIR=${1:-"./vscode-server"}  # server安装目录
PORT=${2:-23964}                     # 服务端口
HOST=${3:-"0.0.0.0"}                # 监听地址
# HOST=${3:-"localhost"}                # 监听地址
TOKEN=${4:-"your-token"}              # 连接令牌
SERVER_DATA_DIR=${5:-"./vscode-server-data"}              # 服务器数据目录
# 检查端口是否可用
check_port() {
    if command -v nc &> /dev/null && nc -z $HOST $PORT &>/dev/null; then
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

# 启动服务
start_server() {
    cd "$SERVER_DIR"
    
    if [ ! -f "./bin/code-server" ]; then
        echo "错误: code-server可执行文件不存在"
        exit 1
    fi
    
    check_port
    
    echo "启动VSCode server (端口: $PORT)..."
    # ./bin/code-server --port $PORT --without-connection-token --accept-server-license-terms --host $HOST
    ./bin/code-server --port $PORT --connection-token "$TOKEN" --accept-server-license-terms --host $HOST --server-data-dir "$SERVER_DATA_DIR"
}

start_server