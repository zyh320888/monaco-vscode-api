const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

// 转义正则表达式中的双引号
const updatedPackageJson = packageJson.replace(/\"(@codingame\/.*?)\"?: \"file:.*?\"/g, `"$1": "^16.0.3"`);

fs.writeFileSync(packageJsonPath, updatedPackageJson, 'utf8');

console.log('依赖项已成功更新');