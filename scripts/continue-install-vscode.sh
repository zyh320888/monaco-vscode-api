#!/bin/bash
set -e

build_directory="/tmp/tmp.Izhhk2g02T"

# 检查临时目录是否存在
if [ ! -d "$build_directory" ]; then
    echo "Error: Temporary directory $build_directory not found"
    exit 1
fi

# 设置目标目录
package_json="`pwd`/package.json"
output_directory="`pwd`/vscode"
loc_output_directory="`pwd`/vscode-loc"
extension_output_directory="$build_directory/vscode-default-extensions"
version_info=$output_directory/version.info


# cd $build_directory

# echo "Patching vscode..."
# find "$patch_directory" -type f -name '*.patch' -print0 | sort -z | xargs -t -0 -n 1 patch -p1 -i

# echo "Installing vscode dependencies..."
# npm ci

# echo "Installing build dependencies"
# cd build
# npm ci
# cd ..

# echo "Extracting service identifiers"
# node build/lib/extractServices.js

# echo "Applying transformConstEnums"
# node build/lib/transformConstEnums.js

# ## Change shake level from ClassMembers to Files to speed up build
# sed -i'' -e 's/shakeLevel: 2/shakeLevel: 0/g' build/gulpfile.editor.js
# ## build editor editor.api.d.ts
# npx gulp editor-distro-resources

# # build and copy default extensions
# BUILD_SOURCEVERSION=$vscodeRef NODE_OPTIONS=--max-old-space-size=8192 npx gulp compile-web-extensions-build
# rm -rf $extension_output_directory
# cp -R .build/web/extensions "$extension_output_directory"

# Remove useless files
# cd src
# rm -rf `find . -name '*.test.ts' -o -name 'test' -o -name 'electron-browser'`
# rm -f bootstrap*.ts *main.ts *cli.ts
# rm -rf vs/code

# # generate vscode.proposed.d.ts
# cd vscode-dts
# echo "" > vscode.proposed.d.ts

# for file in vscode.proposed.*.d.ts; do
# 	echo "import \"./$file\"" >> vscode.proposed.d.ts
# done
# cd ..

# mkdir -p $output_directory

# echo "Building vscode..."
# NODE_OPTIONS=--max-old-space-size=8192 npx tsc --declaration --importHelpers --outDir "$output_directory/src" --rootDir .
# # Copy files that are already built and assets
# find ./ \( -name '*.js' -o -name '*.d.ts' -o -name '*.ttf' -o -name '*.css' -o -name '*.mp3' -o -name '*.scm' -o -name '*.svg' -o -name '*.png' -o -name '*.html' -o -name '*.sh' -o -name '*.zsh' -o -name '*.ps1' \) -exec rsync -R \{\} "$output_directory/src" \;

# cd ..
# cp package.json $output_directory
# # Copy editor types
# cp out-monaco-editor-core/esm/vs/editor/editor.api.d.ts $output_directory/src/vs/editor/editor.api.d.ts



# # 下载vscode-loc
# echo "Downloading vscode-loc..."
# rm -rf $loc_output_directory
# mkdir -p $loc_output_directory
# curl -L --max-redirs 5 https://github.com/microsoft/vscode-loc/archive/refs/heads/main.tar.gz | tar -xz -C $loc_output_directory --strip-components=2 vscode-loc-main/i18n

# 更新版本信息
vscodeRef=$(cat $package_json | jq -r '.config.vscode.ref')
echo $vscodeRef > $version_info

# 清理临时目录
echo "Cleaning up..."
rm -rf $build_directory

echo "Installation completed successfully"