/* eslint-disable no-await-in-loop */
import glob from 'glob';
import _ from 'lodash';

import { isExistence, getAbsolutePath, getFileName } from '../utils/fs';
import mergeConfig from '../config/mergeConfig';
import { PartialConfig } from '../../typings/config';
import transformationConfig from '../config/transformationConfig';
import temporary from '../utils/temporary';

import { isPublicPath } from '../utils/env';
import writeHot from './writeHot';
import setTemplate from './setTemplate';

const filePath = getAbsolutePath('breeze.config.js');

const getView = (): Promise<Array<string>> =>
  new Promise((resolve) => {
    glob('src/*.njk', {}, (error, files) => {
      if (error) {
        return resolve([]);
      }
      return resolve(files.map((f) => getAbsolutePath(f)));
    });
  });

const getSuffixFile = async (file: string, suffix: Array<string>) => {
  const arr = ['', ...suffix].map((f) => {
    const name = `${file}${f}`;
    return isExistence(name).then((res) => {
      if (res) {
        return name;
      }
      return undefined;
    });
  });
  const v = await Promise.all(arr);
  const value = v.filter((f) => f);
  if (value.length) {
    return value[0];
  }
  return undefined;
};

const replaceSuffix = async (value: Array<string>, suffix: Array<string>) => {
  for (let i = 0, leg = value.length; i < leg; i += 1) {
    const str = value[i]!;
    const complete = await getSuffixFile(str, suffix);

    if (complete) {
      value.splice(i, 1, complete);
    } else {
      value.splice(i, 1);
    }
  }
};

export default async () => {
  let userConfig: PartialConfig = {};
  if (await isExistence(filePath)) {
    // 可能为函数
    const content = (await import(filePath)).default;
    if (_.isFunction(content)) {
      userConfig = await content(isPublicPath());
    } else {
      userConfig = content;
    }
  }
  const config = mergeConfig(userConfig);
  // 对配置文件进行处理
  const {
    pages: { autoImport, ...args },
  } = config;
  if (autoImport) {
    // 寻找符合条件的njk文件，且键名不冲突
    const file = await getView();
    const keys = Object.keys(args).map((f) => getFileName(f, false));
    file.forEach((item) => {
      const name = getFileName(item, false);
      if (!keys.includes(name) && name) {
        config.pages[name] = item;
      }
    });
  }

  // 获取到需要的配置文件，同时继续对pages进行一层文件是否存在的校验
  const c = transformationConfig(config);
  for (const value of Object.values(c.pages)) {
    // 对js和css文件的可能后缀进行筛选，如果不存在的话，将数组清空
    await replaceSuffix(value.entry, ['.js', '.ts']);
    await replaceSuffix(value.entryStyle, ['.css', '.less', '.scss']);
    await setTemplate(value, config);
    // 开发环境下，如果满足条件，写入hot文件
    if (!isPublicPath()) {
      await writeHot(value);
    }
    // 检查一下css + js的文件个数,如果为空默认写入一个文件，之后删除
    if (![...value.entry, ...value.entryStyle].length) {
      const src = await temporary.write(temporary.getTemporaryName('.js'), '');
      value.entry = [src];
    }
  }
  return c;
};
