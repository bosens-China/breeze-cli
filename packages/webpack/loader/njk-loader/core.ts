import nunjucks from 'nunjucks';
import _ from 'lodash';
import { Inunjucks } from '../../typings/config';
import { getAbsolutePath } from '../../utils/base';

export default (content: string, option: Inunjucks) => {
  const view = (_.isArray(option.view) ? option.view : [option.view]).filter((item) => item);
  const absoluteView = view.map((item) => getAbsolutePath(item));
  // 提取过滤器和变量
  const varAll = option.var ?? {};
  const filters = option.filters ?? {};

  const env = new nunjucks.Environment(absoluteView.map((item) => new nunjucks.FileSystemLoader(item)));
  for (const [name, value] of Object.entries(filters)) {
    if (_.isFunction(value)) {
      env.addFilter(name, value);
    }
  }
  const str = env.renderString(content, varAll);
  return str;
};
