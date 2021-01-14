
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
npm run docs:build
# 进入生成的文件夹
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:bosens-China/breeze-cli.git master:gh-pages

cd -
