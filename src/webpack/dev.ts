import Config from 'webpack-chain';
import { TransformationConfig } from '../../typings/config';
import { getAbsolutePath } from '../utils/fs';

export default async (config: Config, userConfig: TransformationConfig) => {
  config.mode('development');
  config.devtool('source-map');
  config.devServer
    .host('0.0.0.0')
    .hot(true)
    .useLocalIp(true)
    .progress(true)
    .contentBase(getAbsolutePath(userConfig.outputDir));

  // 确保热更新正确
  config.optimization.runtimeChunk('single');

  return config;
};
