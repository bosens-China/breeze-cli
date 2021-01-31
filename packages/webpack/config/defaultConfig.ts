import { isProduction } from '../utils/base';
import os from 'os';
import { Iconfig } from '../typings/config';

const config: Iconfig = {
  publicPath: isProduction() ? '' : '/',
  outputDir: 'dist',
  assetsDir: '',
  indexPath: 'index.html',
  filenameHashing: true,
  pages: {
    index: {
      template: 'public/index.html',
      filename: 'index.html',
      render: '#app',
      view: 'src/App.njk',
    },
  },
  lintOnSave: 'default',
  transpileDependencies: [],
  productionSourceMap: true,
  configureWebpack: undefined,
  chainWebpack: undefined,
  css: {
    extract: isProduction(),
    sourceMap: false,
    loaderOptions: {
      css: {},
      postcss: {},
      less: {},
      scss: {},
    },
  },
  devServer: {},
  parallel: os.cpus().length > 1,
  image: {
    limit: 3 * 1024,
    minimize: isProduction(),
  },
  minimize: {
    html: false,
    css: true,
    javascript: true,
  },
  format: {
    html: {
      disable: true,
      options: {},
    },
    css: {
      disable: false,
      options: {},
    },
    javascript: {
      disable: false,
      options: {},
    },
  },
  nunjucks: {
    filters: {},
    var: {},
  },
  mode: 'tradition',
};

export default config;
