import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * 判断文件或者目录是否存在
 *
 * @param {string} file
 * @return {*}
 */
export const isFileExists = (file: string) => {
  return fs
    .access(file, fs.constants.R_OK | fs.constants.W_OK)
    .then(() => true)
    .catch(() => false);
};

/**
 * 对比fileName是否相同
 *
 * @param {string} path1
 * @param {string} path2
 * @return {*}
 */
export const isPathIdentical = (path1: string, path2: string): boolean => {
  return path.basename(path1) === path.basename(path2);
};

/**
 * 对比路径是否相同
 *
 * @param {string} file1
 * @param {string} file2
 * @return {*}
 */
export const pathIsSame = (file1: string, file2: string) => {
  return file1.length === file2.length && file1.replace(/\\/g, '/') === file2.replace(/\\/g, '/');
};

/**
 * 创建临时目录
 *
 */
export const mkdtemp = () => {
  const tmpDir = os.tmpdir();
  const p = `${tmpDir}${path.sep}`;
  return fs.mkdtemp(p);
};

export * from '../build/utils';
