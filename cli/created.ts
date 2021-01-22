import { getAbsolutePath, isFileExists, mkdtemp } from '../utils/fs';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import _ from 'lodash';
import { yarnIsExistence, install } from './utils';
import { template, initTemplateKey, downloadGie } from './config';
import path from 'path';
import ora from 'ora';
import colors from 'colors';
import shelljs from 'shelljs';
import init from './project-initialization';

import { IresultAll } from './type';

async function created(source: string) {
  // 校验名称
  const reg = new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$');
  if (!reg.exec(source)) {
    throw `${source} 不符合命名规则`;
  }
  // 检测目录文件是否存在，如果存在提示覆盖还是删除
  const dir = getAbsolutePath(source);
  let cover = false;
  if (await isFileExists(dir)) {
    const resultAll = await inquirer.prompt([
      {
        type: 'list',
        message: '当前目录已经存在，是否覆盖:',
        name: 'dir',
        choices: ['删除', '覆盖', '退出'],
        default: '覆盖',
      },
    ]);
    if (resultAll.dir === '退出') {
      return;
    }
    if (resultAll.dir === '删除') {
      await fs.emptyDir(dir);
    }
    cover = resultAll.dir === '覆盖';
  }
  await fs.ensureDir(dir);
  await pullTemplate(dir, cover);
}

// 拉取模板到dir
async function pullTemplate(dir: string, cover: boolean) {
  const resultAll: IresultAll = await inquirer.prompt([
    {
      type: 'list',
      message: '请选择拉取模板类型',
      name: 'type',
      default: initTemplateKey,
      choices: _.keys(template),
    },
  ]);
  const link = template[resultAll.type];
  // 给下载动画
  const spinner = ora('正在拉取模板中...').start();
  // 如果是覆盖，生成临时目录，然后拉取到临时文件夹
  if (cover) {
    const temp = await mkdtemp();
    await downloadGie(link, temp);
    // 移动目标文件到原目录，然后删除临时目录
    await fs.copy(temp, dir, { overwrite: true });
    await fs.remove(temp);
  } else {
    await downloadGie(link, dir);
  }
  spinner.stop();
  console.log('\n拉取代码成功，正在安装依赖\n');
  const cdDir = path.parse(dir).base;
  // 执行依赖安装
  try {
    await install(yarnIsExistence() ? 'yarn install' : 'npm i', { cwd: dir });
  } catch (e) {
    throw '安装依赖失败，请手动执行';
  }

  shelljs.exec('clear');
  const exec = yarnIsExistence() ? 'yarn' : 'npm';
  console.log(
    `安装依赖完成:
  CD: ${colors.blue(`${cdDir}`)}
  运行: ${colors.blue(`${exec} run serve`)} 启动服务
  运行: ${colors.blue(`${exec} run build`)} 构建项目`,
  );
  await init({
    dir,
    resultAll,
    name: cdDir,
  });
}

export default created;
