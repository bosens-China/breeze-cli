import path from 'path';
import glob from 'glob';

export /**
 * 返回一个绝对路径
 *
 * @param {string} p
 * @param {*} [root=process.cwd()]
 */
const getAbsolutePath = (p: string, root = process.cwd()) => {
  return path.isAbsolute(p) ? p : path.join(root, p);
};

/**
 * 根据路径返回一个文件名称，包含后缀
 *
 * @param {string} file
 */
export const getFileName = (file: string) => {
  return path.parse(file).base;
};

/**
 * 判断路径是否相同
 *
 * @param {string} p1
 * @param {string} p2
 * @return {*}
 */
export const equalPaths = (p1: string, p2: string) => {
  return p1.replace(/\\/g, '/') === p2.replace(/\\/g, '/');
};

// 返回public下的所有文件
let publicFile: Array<string> = [];
export const proGlob = (): Promise<Array<string>> => {
  return new Promise((resolve) => {
    if (publicFile.length) {
      return resolve(publicFile);
    }
    glob('public/**/*', (er, files) => {
      if (er) {
        return resolve([]);
      }
      const arr = (files || []).map((f) => path.join(process.cwd(), f));
      publicFile = arr;
      return resolve(arr);
    });
  });
};

// 对比文件名是否相同
export const identicalName = (strArr: Array<string>, file: string) => {
  const str = file.replace(/\\/g, '/').split('/').pop();
  return !!strArr.find((f) => str && f.includes(str));
};
