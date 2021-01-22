import { compilation } from 'webpack';
import Core from './index';
import _ from 'lodash';
import { formatCss, formatHtml, formatJs } from './utils';

export default (compilation: compilation.Compilation, then: Core) => {
  const keys = _.keys(_.get(compilation, 'assets'));
  const {
    config: { build },
    isDev,
    jsMap,
  } = then;
  if (isDev) {
    return;
  }
  if (build.formatJs) {
    for (const [name, value] of jsMap) {
      const code = formatJs(value, then.config.build.formatOptions);
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
  }
  const update = (arr: Array<string>, html: boolean) => {
    arr.forEach((item) => {
      let content = compilation.assets[item].source();
      content = _.isString(content) ? content : String(content);
      const value = html
        ? formatHtml(content, then.config.build.formatOptions)
        : formatCss(content, then.config.build.formatOptions);
      _.set(compilation.assets, item, {
        source: () => {
          return value;
        },
        // 返回文件大小
        size: () => {
          return value.length;
        },
      });
    });
  };
  if (build.formatCss) {
    const arr = keys.filter((f) => /\.css$/.test(f));
    update(arr, false);
  }
  if (build.formatHtml) {
    const arr = keys.filter((f) => /\.html$/.test(f));
    update(arr, true);
  }
};
