import { Iconfig, ItrTransformConfig } from '../typings/config';
import _ from 'lodash';
import mergeConfig from './mergeConfig';
import checkConfig from './checkConfig';
import getConfig from './getConfig';
import { isExistence } from '../utils/fs';
import { isSuffix, isProduction, getFileNmae } from '../utils/base';
import temporary from '../utils/temporary';

// 返回可能的后缀
export const possibleSuffixes = (p: string, suffixesArr: Array<string>) => {
  const arr: typeof suffixesArr = [];
  const result = isSuffix(p);
  if (result) {
    arr.push(p);
  }
  suffixesArr.forEach((item) => {
    let str = p;
    if (result) {
      str = str.slice(0, str.lastIndexOf('.'));
    }
    str += item;
    arr.push(str);
  });
  return arr;
};

// 测试后缀文件是否存在
export const getSuffixFile = async (file: string, suffixesArr: Array<string>): Promise<string | undefined> => {
  const arr: Array<Promise<string | undefined>> = [];
  possibleSuffixes(file, suffixesArr).forEach((f) => {
    arr.push(
      isExistence(f).then((res) => {
        if (res) {
          return f;
        }
        return undefined;
      }),
    );
  });
  const fileAll = await Promise.all(arr);
  return fileAll.find((f) => f);
};

export const FileProfill = async (config: ItrTransformConfig) => {
  for (const item of _.values(config.pages)) {
    if (!(await isExistence(item.template))) {
      throw new Error(`${item.template} 文件不存在，请检查拼写是否错误!`);
    }
    if (!(await isExistence(item.view))) {
      throw new Error(`${item.view} 文件不存在，请检查拼写是否错误!`);
    }
    // 检查css和JavaScript文件，这两个不是必填的，如果文件不存在直接过滤掉，如果最终一个JavaScript文件都没有，直接用临时文件生成一个
    const scriptAll = await Promise.all(
      item.javascript.map((item) => {
        return getSuffixFile(item.src, ['.js', '.ts']).then((res) => {
          if (!res) {
            return null;
          }
          return {
            ...item,
            src: res,
          };
        });
      }),
    );
    item.javascript = scriptAll.filter((f) => f) as typeof item.javascript;
    const cssAll = await Promise.all(
      item.css.map((item) => {
        return getSuffixFile(item, ['.css', '.scss', '.less']).then((res) => {
          if (!res) {
            return null;
          }
          return res;
        });
      }),
    );
    item.css = cssAll.filter((f) => f) as Array<string>;
    // 判断一下css和JavaScript的length加在一起是否有文件
    if (!(item.javascript.length + item.css.length)) {
      const file = await temporary.add('js');
      item.javascript = [{ src: file, mode: 'all' }];
      return;
    }
    // 如果存在css和js文件，进行键名检查
    if (config.filenameHashing) {
      return;
    }
    const arr = [
      ...item.css,
      ...item.javascript
        .filter((item) => {
          return item.mode === 'all' || (isProduction() ? item.mode === 'production' : item.mode === 'development');
        })
        .map((item) => item.src),
    ];
    // 返回差异数组
    const firterArr = _.uniqBy(arr, (value) => {
      return getFileNmae(value);
    });
    const fileArr = _.difference(arr, firterArr);
    if (fileArr.length) {
      throw new Error(`${fileArr.join(',')} 这些文件键名存在冲突，请修改或者开启 filenameHashing`);
    }
  }
};

// 校验之后进行合并，之后转化为需要的格式，传递给webpack使用
export default async (config: Partial<Iconfig> = {}): Promise<ItrTransformConfig> => {
  await checkConfig(config);
  const mergeCon = mergeConfig(config);
  const c = getConfig(mergeCon);
  return c;
};
