#!/usr/bin/env node

import { program } from 'commander';
import { getVersion, yarnIsExistence, getConfigFile } from './utils';
import _ from 'lodash';
import { getAbsolutePath, isFileExists, mkdtemp } from '../utils/fs';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { template, initTemplateKey, downloadGie } from './config';
import ora from 'ora';
import shell from './shell';
import shelljs from 'shelljs';
import colors from 'colors';
import path from 'path';
import App from '../build';

(async () => {
  program.version(getVersion(), '-v, --version', '输出当前版本号');
  program
    .command('created <name>')
    .description('创建指定项目')
    .action((dir) => {
      return created(dir).catch((e) => {
        exit(e);
      });
    });
  program
    .command('serve')
    .description('启动服务器')
    .action(() => {
      return build(true);
    });
  program
    .command('build')
    .description('构建当前项目')
    .action(() => {
      return build(false);
    });

  await program.parseAsync(process.argv);
})();

// 根据一般规范，退出的时候需要返回1，成功返回0
function exit(message?: string) {
  if (message) {
    console.log(colors.red(message));
  }
  process.exit(1);
}

async function created(source: string) {
  // 校验名称
  const reg = new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$');
  if (!reg.exec(source)) {
    exit(`${source} 不符合命名规则`);
    return;
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
      process.exit(0);
      return;
    }
    if (resultAll.dir === '删除') {
      await fs.emptyDir(dir);
    }
    cover = resultAll.dir === '覆盖';
  }
  await fs.ensureDir(dir);
  await pullTemplate(dir, cover);
  // 更改一下名称为创建的名称
  const jsonFile = await fs.readJson(path.join(dir, './package.json'));
  await fs.writeJson(path.join(dir, './package.json'), { ...jsonFile, name: source });

  await fs.remove(path.join(dir, yarnIsExistence() ? 'package-lock.json' : 'yarn.lock'));
}

async function pullTemplate(dir: string, cover: boolean) {
  const resultAll = await inquirer.prompt([
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
  // 拉取完成之后进入dir目录，之后执行shell脚本
  if (!shell(dir, yarnIsExistence())) {
    exit('安装依赖失败，请手动执行');
    return;
  }
  shelljs.exec('clear');
  const exec = yarnIsExistence() ? 'yarn' : 'npm';
  console.log(
    `安装依赖完成:
  CD: ${colors.blue(`${path.parse(dir).base}`)}
  运行: ${colors.blue(`${exec} run serve`)} 启动服务
  运行: ${colors.blue(`${exec} run build`)} 构建项目`,
  );
}

// 构建应用
async function build(isDev: boolean) {
  const config = await getConfigFile();
  App(config, isDev).catch((e) => {
    exit(e);
  });
}
