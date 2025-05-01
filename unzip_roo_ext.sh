# 创建临时目录
temp_dir=$(mktemp -d)
cd "$temp_dir"

cp /mnt/code/d8d-vscode-api/Roo-Code/bin/roo-cline-*.vsix roo.vsix
# 解压 .vsix 文件
unzip roo.vsix
# 删除原来 roo-cline 目录
rm -rf /mnt/code/d8d-vscode-api/demo-npm/src/features/extensions/roo-cline
# 复制解压后的文件到指定目录
cp -r extension /mnt/code/d8d-vscode-api/demo-npm/src/features/extensions/roo-cline
# 删除临时目录
rm -rf "$temp_dir"