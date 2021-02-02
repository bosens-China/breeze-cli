import fs from 'fs-extra';

// 测试文件或者目录是否存在
export const isExistence = (p: string) => {
  return fs
    .access(p, fs.constants.R_OK | fs.constants.W_OK)
    .then(() => true)
    .catch(() => false);
};
