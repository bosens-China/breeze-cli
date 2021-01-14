import { Iconfig } from '../typings';
import common from './common';
import webpack from 'webpack';

const dev = async (config: Iconfig) => {
  const webpackConfig = await common(config, true);
  webpackConfig.mode('development');
  webpackConfig.devtool('source-map');
  webpackConfig.plugin('hot').use(webpack.NamedModulesPlugin).use(webpack.HotModuleReplacementPlugin);
  webpackConfig.devServer.hot(true);

  return webpackConfig;
};

export default dev;
