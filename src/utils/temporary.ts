/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import glob from 'glob';
import { getAbsolutePath, getLinuxPath } from './fs';

class Temporary {
  dir: string;

  list: Array<string> = [];

  constructor(dir = '.temporary') {
    this.dir = dir;
  }

  // 是否为临时文件
  isTemporary(file: string) {
    return file.includes('temporary');
  }

  // 获取临时文件名称
  getTemporaryName(suffix: string, dir = this.dir) {
    return getLinuxPath(getAbsolutePath(`${dir ? `${dir}/` : ''}temporary${uuidv4()}${suffix}`));
  }

  async write(file: string, content: string) {
    await fs.outputFile(file, content);
    this.list.push(file);
    return file;
  }

  // 思路如下，对于文件全部删除，删除完成之后再读取一遍当前dir文件夹内是否还有文件，不存在删除目录
  clearAll() {
    for (const item of this.list) {
      fs.removeSync(getAbsolutePath(item));
    }
    const dir = getAbsolutePath(this.dir);
    const list = glob.sync('**/*', { cwd: dir });
    if (!list.length) {
      fs.removeSync(dir);
    }
  }
}

export default new Temporary();
