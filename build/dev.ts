import { Iconfig } from '../typings';
import common from './common';
import webpack from 'webpack';
import { getAbsolutePath } from './utils';
import path from 'path';

const dev = async (config: Iconfig) => {
  const webpackConfig = await common(config, true);
  webpackConfig.mode('development');
  webpackConfig.devtool('source-map');
  webpackConfig.plugin('hot').use(webpack.NamedModulesPlugin).use(webpack.HotModuleReplacementPlugin);
  webpackConfig.devServer.hot(true);

  // 添加校验
  webpackConfig.module
    .rule('lint')
    .test(/\.(js|ts)$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(getAbsolutePath('src'))
    .end()
    .use('check')
    .loader(require.resolve(path.resolve(__dirname, '../loader/checkJS')))
    .options(config)
    .end();
  return webpackConfig;
};

export default dev;
