import webpack from 'webpack';
import getConfig from './getConfig';
import webpackConfig from '../webpack';
import temporary from '../utils/temporary';

export default async () => {
  const userConfig = await getConfig();
  const config = await webpackConfig(userConfig, false);
  // 启动webpack
  webpack(config, (err: any, stats: any) => {
    // 构建完成清除掉目录
    temporary.clearAll();
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    console.log(stats.toString(config.stats));
  });
};
