import _ from 'lodash';
import path from 'path';
import { Iconfig, TransformationConfig, IpagesValue } from '../../typings/config';
import { isPublicPath } from '../utils/env';
import { getAbsolutePath, getFileName } from '../utils/fs';

export default (config: Iconfig) => {
  // 转换pages部分
  const c = (config as unknown) as TransformationConfig;
  const pages = _.omit(config.pages, ['autoImport']);
  // 默认的view
  const defaultView: Array<string> = [];
  for (const [name, value] of Object.entries(pages)) {
    // 如果类型为string转化为对象的形式处理，默认只会给一个view例如 ./app.njk
    if (_.isString(value)) {
      const view = getAbsolutePath(value);
      const viewNmae = getFileName(view, false);
      c.pages[name] = {
        entry: [`./src/${viewNmae}`],
        entryView: view,
        entryStyle: [`./src/assets/css/${viewNmae}`],
        template: `public/${viewNmae}.html`,
        filename: Object.keys(pages).length === 1 ? config.indexPath : `${view}.html`,
        options: {},
        render: '#app',
      };
    }
    const obj = c.pages[name] as IpagesValue;
    // 转为绝对路径
    obj.entryView = getAbsolutePath(obj.entryView);
    obj.entry = _.isString(obj.entry) ? [obj.entry] : obj.entry;
    if (_.isArray(obj.entry)) {
      obj.entry = obj.entry.map((f) => getAbsolutePath(f));
    }
    obj.entryStyle = _.isString(obj.entryStyle) ? [obj.entryStyle] : obj.entryStyle;
    if (_.isArray(obj.entryStyle)) {
      obj.entryStyle = obj.entryStyle.map((f) => getAbsolutePath(f));
    }
    obj.template = getAbsolutePath(obj.template);
    if (!obj.filename) {
      obj.filename = Object.keys(pages).length === 1 ? config.indexPath : `${getFileName(obj.entryView, false)}.html`;
    }
    obj.render = obj.render || '#app';
    obj.options = obj.options || {};
    obj.options = {
      title: 'hello breeze',
      ...obj.options,
    };
    defaultView.push(path.dirname(obj.entryView));
  }
  _.unset(c.pages, 'autoImport');
  // 给一些初始值
  c.alias = c.alias || {};
  c.env = c.env || {};
  c.outputDir = getAbsolutePath(c.outputDir);
  c.nunjucks.view = c.nunjucks.view || defaultView;
  c.publicPath = isPublicPath() ? '' : '/';
  c.image = {
    ...{
      limit: false,
      minimum: isPublicPath(),
    },
    ...c.image,
  };
  return c;
};
