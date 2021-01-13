import _ from 'lodash';
import { compilation } from 'webpack';
import path from 'path';
import fs from 'fs-extra';
import { build } from '../../utils/build';
import { isHotFile, isCssFile, getCompleteDocument } from './utils';
import Core from './index';

export default async (compilation: compilation.Compilation, data: any, then: Core) => {
  const { isDev, config, jsMap } = then;
  if (isDev) {
    return;
  }
  // 添加entry的js文件，同时将入口的文件，进行tsc转化
  const { bodyTags, headTags, plugin } = data;
  const { publicPath } = config;
  // 添加后缀
  const entryObj = _.get(plugin, 'options.__option.entry');
  const entry = _.values(entryObj).map((f) => {
    const name = `${publicPath}js/${path.parse(f).name}.js`;
    return name;
  });
  entry.forEach((item) => {
    bodyTags.push({
      tagName: 'script',
      voidTag: false,
      attributes: {
        defer: false,
        src: item,
      },
    });
  });

  const addAll = _.keys(entryObj).map((f) => {
    const value = entryObj[f];
    return getCompleteDocument(value, then.extensions).then((p) => {
      return fs.readFile(p, 'utf-8').then((content) => {
        return build(content).then((code) => {
          const name = `js/${path.parse(p).name}.js`;
          jsMap.set(name, code);
          compilation.assets[name] = {
            source: () => {
              return code;
            },
            size: () => {
              return code.length;
            },
          };
        });
      });
    });
  });

  // 删除多余css文件和hot文件
  const deleteJs = (arr: Array<any>) => {
    for (let i = 0, leg = arr.length; i < leg; i++) {
      const src: string = _.get(arr[i], 'attributes.src', '');
      if (isCssFile(src) || isHotFile(src)) {
        arr.splice(i, 1);
        i -= 1;
      }
    }
  };
  deleteJs(headTags);
  deleteJs(bodyTags);
  await Promise.all(addAll);
};
