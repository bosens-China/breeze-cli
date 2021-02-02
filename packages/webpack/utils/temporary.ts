import { getAbsolutePath } from './base';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';

// 返回临时文件名称
const temporaryName = (suffix = '') => {
  return `b${uuidv4()}${suffix}`;
};

// 返回js的写入目录，这个目录不会被webpack忽略
export const jsTemporaryDir = getAbsolutePath('node_modules/.breeze');

// 返回view的临时目录
const getViewTemporary = (p: string) => {
  const dir = path.dirname(p);
  return path.join(dir, temporaryName('.html'));
};

class Temporary {
  public fileArr: Array<string> = [];

  // 根据type的类型不同，写入不同的文件
  public async add(type: 'js' | 'view', p?: string) {
    let str = '';
    if (type === 'js') {
      str = path.join(jsTemporaryDir, temporaryName('.js'));
    } else {
      str = getViewTemporary(p!);
    }
    this.fileArr.push(str);
    await fs.outputFile(str, '');
    return str;
  }


  public removeSync() {
    this.fileArr.forEach((item) => {
      fs.removeSync(item);
    });
  }
}

export default new Temporary();
