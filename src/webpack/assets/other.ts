/* eslint-disable implicit-arrow-linebreak */
// 处理静态资源部分，Public文件夹除了pages相关的文件，其他文件全部默认都复制
import Config from 'webpack-chain';
import { TransformationConfig } from '../../../typings/config';
import { getFilename } from '../utils';

export default (webpackConfig: Config, config: TransformationConfig) => {
  const genAssetSubPath = (dir: string) => `${dir}/${getFilename(config, '[name].[ext]', '[name].[hash:8].[ext]')}`;

  // 以下loader借鉴vuecli写法
  // https://github.com/vuejs/vue-cli/blob/2dbe0be84
  // 06e5c432dacc559a54b270a5670d652/packages/%40vue/cli-service/lib/config/assets.js

  const genUrlLoaderOptions = (dir: string) => ({
    limit: config.image.limit,
    fallback: {
      loader: require.resolve('file-loader'),
      options: {
        name: genAssetSubPath(dir),
      },
    },
  });

  webpackConfig.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('img'))
    .end()
    .when(config.image.minimum, (c) => {
      c.use('image-webpack-loader').loader(require.resolve('image-webpack-loader')).end();
    });

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: genAssetSubPath('img'),
    })
    .end()
    .when(config.image.minimum, (c) => {
      c.use('image-webpack-loader').loader(require.resolve('image-webpack-loader')).end();
    });

  webpackConfig.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('media'));

  webpackConfig.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('fonts'));
};
