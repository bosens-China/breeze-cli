import { Iconfig } from '../typings';
import common from './common';
import webpack from 'webpack';
import { getAbsolutePath } from './utils';

const babelConfig = {
  presets: [['@babel/preset-env', { modules: false, useBuiltIns: 'usage', corejs: 3 }]],
};

const dev = async (config: Iconfig) => {
  const webpackConfig = await common(config, true);
  webpackConfig.mode('development');
  webpackConfig.devtool('source-map');
  webpackConfig.plugin('hot').use(webpack.NamedModulesPlugin).use(webpack.HotModuleReplacementPlugin);
  webpackConfig.devServer.hot(true);
  // 添加babel
  webpackConfig.module
    .rule('js')
    .test(/\.(js|ts)$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(getAbsolutePath('src'))
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelConfig)
    .end()
    .when(config.lintOnSave, (c) => {
      c.use('eslint-loader').loader(require.resolve('eslint-loader')).options({ catch: true }).end();
    });

  return webpackConfig;
};

export default dev;
