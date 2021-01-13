import { getAbsolutePath } from '../build/utils';
import { isFileExists } from '../utils/fs';
import { Iconfig } from '../typings';
import fs from 'fs-extra';
import shell from 'shelljs';
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
  if (!shell.which('yarn')) {
    return false;
  }
  return true;
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
