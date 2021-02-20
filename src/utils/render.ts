// 渲染njk模板，这里提供build模式和loader所用的核心
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import _ from 'lodash';
import { Iobj } from '../../typings/config';

export interface Ipar {
  view?: Array<string> | string;
  varAll?: Iobj;
  // template: string;
  njkTemplate?: string;
  filterAll?: Iobj<Function>;
  // render: string;
  html?: string;
}

export default (obj: Ipar) => {
  if (!obj.html && !obj.njkTemplate) {
    throw new Error('html和njkTemplate必须存在一个');
  }
  const view: Array<string> = [];
  if (_.isArray(obj.view)) {
    view.push(...obj.view);
  }
  if (_.isString(obj.view)) {
    view.push(obj.view);
  }
  const envView = view.map((f) => new nunjucks.FileSystemLoader(f));
  const env = new nunjucks.Environment(envView);
  // 读取
  // const content = fs.readFileSync(obj.template, 'utf-8');
  const njkContent = obj.html ? obj.html : fs.readFileSync(obj.njkTemplate!, 'utf-8');
  // 添加过滤器
  for (const [name, value] of Object.entries(obj.filterAll || {})) {
    if (_.isFunction(value)) {
      env.addFilter(name, value);
    }
  }
  return env.renderString(njkContent, obj.varAll || {});
};
