// 默认配置文件
import { Iconfig } from '../typings';
import _ from 'lodash';

const config = (isDev = false): Iconfig => {
  return {
    publicPath: isDev ? '/' : '',
    outputDir: 'dist',
    pages: {
      index: {
        entry: ['src/main'],
        entryView: 'src/App.njk',
        entryHot: 'src/hot',
        entryCss: ['src/assets/css/style.scss'],
        template: 'public/index.html',
        filename: 'index.html',
      },
    },
    css: {
      postcss: {},
      scss: {},
      css: {},
    },
    devServer: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    env: {
      all: {
        NODE_ENV: isDev ? 'development' : 'production',
      },
      development: {},
      production: {},
    },
    var: {
      BASE_URL: isDev ? '/' : '',
    },
    rename: false,
    build: {
      minifyCss: false,
      minifyImg: false,
      minifyHtml: false,
      minifyjs: false,
      formatJs: true,
      formatCss: false,
      formatHtml: true,
    },
    configureWebpack: {},
    lintOnSave: true,
    assets: {
      inlineLimit: 3 * 1024,
    },
  };
};

/**
 * 除了pages，其他选项进行深拷贝
 *
 * @param {Partial<Iconfig>} [c]
 * @return {*}  {Iconfig}
 */
const merge = (c?: Partial<Iconfig>, isDev = false): Iconfig => {
  const defaultConfig = config(isDev);
  const { pages, ...args1 } = c || {};
  const { pages: p, ...args2 } = defaultConfig;
  return Object.assign(_.defaultsDeep({}, args1, args2), {
    pages: pages || p,
  });
};

export { config, merge };
