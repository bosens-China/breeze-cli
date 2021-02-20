/* eslint-disable implicit-arrow-linebreak */
import fs from 'fs-extra';
import path from 'path';

export const isExistence = (p: string) =>
  fs
    // eslint-disable-next-line no-bitwise
    .access(p, fs.constants.R_OK | fs.constants.W_OK)
    .then(() => true)
    .catch(() => false);

export const getAbsolutePath = (p: string, cwd = process.cwd()) => (path.isAbsolute(p) ? p : path.join(cwd, p));

export const getLinuxPath = (p: string) => p.replace(/\\/g, '/');

export const getFileName = (file: string, suffix = true) => {
  const name = getLinuxPath(file).split('/').pop();
  if (!suffix) {
    return name?.split('.').shift();
  }
  return name;
};
