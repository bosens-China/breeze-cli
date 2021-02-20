import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import Config from 'webpack-chain';
import { TransformationConfig } from '../../typings/config';
import clear from './plugins/clear';

export default async (config: Config, userConfig: TransformationConfig) => {
  config.mode('production');
  config.plugin('clear').use(CleanWebpackPlugin);
  config.plugin('clearTemporary').use(clear);
  if (userConfig.productionSourceMap) {
    config.devtool('source-map');
  }
  return config;
};
