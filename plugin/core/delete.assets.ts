// 删除多余的assets文件
import _ from 'lodash';
import { compilation } from 'webpack';
import { isCssFile, isHotFile } from './utils';

export default (compilation: compilation.Compilation, isDev: boolean) => {
  if (isDev) {
    return;
  }

  const keys = _.keys(_.get(compilation, 'assets'));
  keys.forEach((item) => {
    if (isCssFile(item) || isHotFile(item)) {
      _.unset(compilation.assets, item);
    }
  });
};
