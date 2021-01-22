import { getAbsolutePath } from '../build/utils';
import { isFileExists } from '../utils/fs';
import { Iconfig } from '../typings';
import { spawn, SpawnOptions } from 'child_process';
import colors from 'colors';
// import fs from 'fs-extra';
// import path from 'path';
import shell from 'shelljs';
import _ from 'lodash';

// 返回用户的配置文件，如果没有返回{}
export const getConfigFile = async (isDev: boolean): Promise<Iconfig> => {
  const configPath = getAbsolutePath('breeze.config.js');
  if (await isFileExists(configPath)) {
    return import(configPath).then(({ default: obj }) => {
      if (_.isFunction(obj)) {
        return obj(isDev);
      }
      return obj || {};
    });
  }
  return {} as Iconfig;
};

/**
 * 判断yarn是否存在，如果不存在，使用npm安装
 *
 * @return {*}
 */
export const yarnIsExistence = () => {
  if (!shell.which('yarn')) {
    return false;
  }
  return true;
};

// 执行npm或者yarn的安装
export function install(shellStr: string, options?: SpawnOptions) {
  return new Promise((resolve, reject) => {
    const args = shellStr.split(' ');
    const name = args.shift() || '';
    // 关键 { stdio: 'inherit' }
    const git = spawn(name, args, { ...options, shell: true, stdio: 'inherit' });

    git.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`code状态码为${code}`));
      }
      return resolve(code);
    });
    git.on('error', (err) => {
      return reject(err);
    });
  });
}

// 根据一般规范，退出的时候需要返回1，成功返回0
export function exit(message?: string | Error) {
  if (message) {
    console.log(colors.red(message instanceof Error ? message.message : message));
  }
  process.exit(1);
}
