import fs from 'fs-extra';
import path from 'path';
/**
 * 判断文件是否存在
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
