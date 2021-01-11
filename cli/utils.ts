import { getAbsolutePath } from '../build/utils';
import { isFileExists } from '../utils/fs';
import { Iconfig } from '../typings';
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// 返回用户的配置文件，如果没有返回{}
export const getConfigFile = async (): Promise<Iconfig> => {
  const configPath = getAbsolutePath('breeze.config.js');
  if (await isFileExists(configPath)) {
    return import(configPath).then(({ default: obj }) => obj);
  }
  return {} as Iconfig;
};

/**
 * 判断yarn是否存在，如果不存在，使用npm安装
 *
 * @return {*}
 */
export const yarnIsExistence = () => {
  return new Promise((resove) => {
    exec('yarn -v', (err) => {
      if (err) {
        return resove(false);
      }
      return resove(true);
    });
  });
};

/**
 * 返回版本号
 *
 * @return {*}
 */
export const getVersion = () => {
  const p = path.resolve(__dirname, '../../package.json');
  return fs.readJSONSync(p).version;
};
