import Config from 'webpack-chain';
import { TransformationConfig } from '../../../typings/config';
import { getAbsolutePath } from '../../utils/fs';

export default (c: Config, config: TransformationConfig) => {
  c.module
    .rule('js')
    .test(/\.(js|ts)$/)
    .include.add(getAbsolutePath('src'))
    .add(getAbsolutePath('.temporary'))
    .end()
    .when(config.parallel, (con) => {
      con.use('thread-loader').loader(require.resolve('thread-loader'));
    })
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      // 开启缓存
      cacheDirectory: true,
    });
};
