
#!/usr/bin/env sh
set -e
# 发布脚本

npm run build
nrm use npm

# 添加git
git add .
npx cz
git push
# 发布
npm publish --access=public
# 将源设置回来
nrm use taobao
