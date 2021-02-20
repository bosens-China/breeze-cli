#!/usr/bin/env node

import { Command } from 'commander';
import build from './cli/build';
import serve from './cli/serve';
import { version } from '../package.json';
import temporary from './utils/temporary';

const program = new Command();
program.version(version);

// 添加命令
program
  .command('serve')
  .description('启动服务')
  .action(() => {
    process.env.NODE_ENV = 'development';
    serve();
  });
program
  .command('build')
  .description('构建应用')
  .action(() => {
    process.env.NODE_ENV = 'production';
    build();
  });

program.parse(process.argv);

// 额外监听一下错误，如果监听到清除目录
['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, () => {
    temporary.clearAll();
  });
});

process.on('unhandledRejection', (err) => {
  temporary.clearAll();
  console.error(err);
});
