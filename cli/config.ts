import download from 'download-git-repo';

export enum template {
  ts模板 = 'https://github.com:bosens-China/breeze-template#typescript',
  js模板 = 'https://github.com:bosens-China/breeze-template#main',
}
export const initTemplateKey = 'ts模板';

/**
 * 下载git仓库代码
 *
 * @param {string} git
 * @param {string} dir
 * @return {*}
 */
export const downloadGie = (git: string, dir: string) => {
  return new Promise((resolve, reject) => {
    download(git, dir, { clone: true }, (err: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve(undefined);
    });
  });
};
