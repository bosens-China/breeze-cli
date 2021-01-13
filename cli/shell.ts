import shell from 'shelljs';
// import path from 'path';

export default (dir: string, yarn: boolean) => {
  // shell.cd(d);
  process.chdir(dir);
  const tem = yarn ? 'yarn' : 'npm i';
  // // 设置淘宝源
  // if (shell.exec(`${yarn ? 'yarn' : 'npm'} config set registry https://registry.npm.taobao.org`).code !== 0) {
  //   return false;
  // }
  if (shell.exec(tem).code !== 0) {
    return false;
  }
  return true;
};
