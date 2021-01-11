import { compilation } from 'webpack';
import Core from './index';
import _ from 'lodash';
import UglifyJS from 'uglify-js';

export default (compilation: compilation.Compilation, then: Core) => {
  const { config, jsMap, isDev } = then;
  if (isDev) {
    return;
  }
  if (config.build.formatJs || !config.build.minifyjs) {
    return;
  }
  for (const [name, value] of jsMap) {
    const { code } = UglifyJS.minify(value);
    _.set(compilation.assets, name, {
      source: () => {
        return code;
      },
      // 返回文件大小
      size: () => {
        return code.length;
      },
    });
  }
};
