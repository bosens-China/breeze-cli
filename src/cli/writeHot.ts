// 写入hot文件

import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { TransformationConfigPagesValue } from '../../typings/config';
import defaultHot from '../string/defaultHot.txt';
import { getAbsolutePath, getLinuxPath, isExistence } from '../utils/fs';
import temporary from '../utils/temporary';

export default async (value: TransformationConfigPagesValue) => {
  const packagePath = getAbsolutePath('package.json');
  if (!(await isExistence(packagePath))) {
    return;
  }
  // 检查参数是否存在
  const json = await fs.readJson(packagePath);
  const { devDependencies, dependencies } = json;
  const russet = _.keys(devDependencies).concat(_.keys(dependencies)).includes('morphdom');
  if (!russet) {
    return;
  }
  // 确保环境变量都存在之后，执行写入操作，首先对比路径确保相对导入的路径是正确的
  const filePath = temporary.getTemporaryName('.js');
  const pathstr = getLinuxPath(path.relative(path.dirname(filePath), value.entryView));
  const hotContent = (defaultHot as string).replace(/\.\/App\.njk/g, pathstr).replace('#app', value.render);

  await temporary.write(filePath, hotContent);
  value.entry.push(filePath);
};
