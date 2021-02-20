// 用户的默认配置文件，这里不适合使用isdev来进行文件处理

import os from 'os';
import { Iconfig } from '../../typings/config';

type PartialConfig = Partial<Iconfig>;

const config: PartialConfig = {
  outputDir: 'dist',
  assetsDir: '',
  indexPath: 'index.html',
  filenameHashing: false,
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    autoImport: true,
  },
  css: {
    sourceMap: false,
  },
  devServer: {},
  parallel: os.cpus().length > 1,
  nunjucks: {
    varAll: {},
    filterAll: {},
  },
};

export default config;
