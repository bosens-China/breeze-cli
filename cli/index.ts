#!/usr/bin/env node

// import build from '../build';
// import { getAbsolutePath } from '../build/utils';
// import { isFileExists } from '../utils/fs';
// const name = process.argv[2];
// const isDev = name === 'serve';

// // 读取用户配置文件
// const getConfigFile = async () => {
//   const configPath = getAbsolutePath('breeze.config.js');
//   if (await isFileExists(configPath)) {
//     return import(configPath).then(({ default: obj }) => obj);
//   }
// };

// async function App() {
//   const config = await getConfigFile();
//   await build(config, isDev);
// }

// App();

import yargs from 'yargs';
import { getVersion } from './utils';
import _ from 'lodash';

const argv = yargs
  .version(getVersion())
  .option('version', {
    type: 'number',
    describe: '显示版本号',
    alias: 'v',
  })
  .command('created', 'reated [name] 创建指定项目')
  .command('serve', '启动服务器')
  .command('build', '构建项目')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2021').argv;

console.log(argv);
