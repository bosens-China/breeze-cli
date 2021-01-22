#!/usr/bin/env node

import { program } from 'commander';
import created from './created';
import { getConfigFile, exit } from './utils';
import { App, getConfig } from '../build';
import { Iobj } from '../typings';

// 构建应用
async function build(isDev: boolean) {
  const config = await getConfigFile(isDev);
  App(config, isDev);
}

(async () => {
  // 通过变量方式跳过检查
  // import { version } from '../package.json';
  const jsonPath = '../../package.json';
  const { version } = await import(jsonPath);
  program.version(version, '-v, --version', '输出当前版本号');
  program
    .command('created <name>')
    .description('创建指定项目')
    .action((dir) => {
      return created(dir)
        .then(() => {
          process.exit(0);
        })
        .catch((e) => {
          exit(e);
        });
    });

  program
    .command('inspect [modu]')
    .description('根据modu模式审查webpack的最终配置，可选模式为development、production，默认为development')
    .action(async (mode) => {
      const m: string = mode || 'development';
      const obj: Iobj = {
        development: true,
        production: false,
      };
      if (!(m in obj)) {
        exit('modue不存在，可选模式为development、production');
        return;
      }
      const isDev = obj[m];
      try {
        const config = await getConfigFile(isDev);
        const c = await getConfig(config, isDev);
        console.log(c);
        process.exit(0);
      } catch (e) {
        return exit(e);
      }
    });
  program
    .command('serve')
    .description('启动服务器')
    .action(() => {
      return build(true).catch((e) => {
        exit(e);
      });
    });
  program
    .command('build')
    .description('构建当前项目')
    .action(() => {
      return build(false).catch((e) => {
        exit(e);
      });
    });
  await program.parseAsync(process.argv);
})();

export { App, getConfig };
