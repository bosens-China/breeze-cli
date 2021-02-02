import { Iconfig, ItrTransformConfig, TtransformPages, Iscript } from '../typings/config';
import _ from 'lodash';
import { getAbsolutePath, getLinuxPath } from '../utils/base';

// 转换public下的html文件名称，根据名称，返回对应的view,javascript文件
export const transformationPublic = (file: string) => {
  const str = getAbsolutePath(file);

  const reg = /([\s\S]*)public[\\\/]([\w\W]+)\.html/;
  const value = str.match(reg);
  if (!value) {
    throw new Error(
      `${file} 不符合 string 输入规则\n合法的例子如: public/subpage.html\n如果坚持使用请改用 object 输入`,
    );
  }
  const [, dir, name] = value;

  return {
    template: str,
    view: getAbsolutePath(`src/${name}/App.njk`, dir),
    filename: `${name}.html`,
    css: [getAbsolutePath(`src/assets/${name}/css/style`, dir)],
    javascript: [
      { src: getAbsolutePath(`src/${name}/main`, dir), mode: 'all' },
      { src: getAbsolutePath(`src/${name}/hot`, dir), mode: 'development' },
    ],
  };
};

// 讲接受到的config文件格式化成需要的格式，方便进一步处理
export default (config: Iconfig): ItrTransformConfig => {
  const con = _.cloneDeep(config) as ItrTransformConfig;
  // 对pages进行转换
  for (const [name, value] of Object.entries(config.pages)) {
    const page = (_.isString(value) ? {} : value) as TtransformPages;
    // 赋值
    con.pages[name] = page;
    // 如果字符串模式下，解析返回路径
    if (_.isString(value)) {
      Object.assign(page, transformationPublic(value));
    } else {
      value.css = _.isArray(value.css) ? value.css : value.css ? [value.css] : [];
      if (_.isString(value.javascript)) {
        value.javascript = [{ src: value.javascript, mode: 'all' }];
      } else if (_.isArray(value.javascript)) {
        value.javascript = (value.javascript as Array<string | Iscript>).map(
          (item): Iscript => {
            return _.isString(item) ? { src: item, mode: 'all' } : item;
          },
        );
      } else {
        value.javascript = [];
      }
    }
    page.template = getLinuxPath(getAbsolutePath(page.template));
    // 对js和css文件路径转换下
    page.view = getLinuxPath(getAbsolutePath(page.view));
    page.css = _.isArray(page.css) ? page.css : page.css ? [page.css] : [];
    page.css = page.css.map((f) => getLinuxPath(getAbsolutePath(f)));
    page.javascript = page.javascript.map((item) => {
      return {
        ...item,
        src: getLinuxPath(getAbsolutePath(item.src)),
      };
    });

    // 对文件可能不存在的情况进行处理
    page.render = page.render ?? '#app';
    page.filename = page.filename ?? config.indexPath;
    page.title = page.title ?? 'hello breeze';
    page.options = page.options ?? {};
  }

  // 处理其他的一些选项
  if (con.image.limit === true) {
    con.image.limit = 3 * 1024;
  }
  if (_.isBoolean(config.minimize)) {
    con.minimize = {
      html: config.minimize,
      css: config.minimize,
      javascript: config.minimize,
    };
  }
  if (_.isBoolean(config.format)) {
    con.format = {
      html: {
        disable: config.format,
        options: {},
      },
      css: {
        disable: config.format,
        options: {},
      },
      javascript: {
        disable: config.format,
        options: {},
      },
    };
  }
  return con;
};
