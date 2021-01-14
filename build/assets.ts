import Config from 'webpack-chain';

import { Iconfig } from '../typings';
import CopyPlugin from 'copy-webpack-plugin';
import { getAbsolutePath, equalPaths } from './utils';

const genAssetSubPath = (dir: string) => {
  return `${dir}/[name].[ext]`;
};
const genUrlLoaderOptions = (dir: string, inlineLimit: number | boolean) => {
  return {
    limit: inlineLimit,
    // use explicit fallback to avoid regression in url-loader>=1.1.0
    fallback: {
      loader: require.resolve('file-loader'),
      options: {
        name: genAssetSubPath(dir),
      },
    },
  };
};

// https://github.com/vuejs/vue-cli/blob/2dbe0be8406e5c432dacc559a54b270a5670d652/packages/%40vue/cli-service/lib/config/assets.js
// 参考vueCLI
export default (webpackConfig: Config, configure: Iconfig, isDev: boolean) => {
  webpackConfig.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .include.add(getAbsolutePath('src'))
    .end()
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('img', configure.assets.inlineLimit))
    .end()
    .when(!isDev && configure.build.minifyImg, (c) => {
      c.use('image-webpack-loader').loader(require.resolve('image-webpack-loader')).end();
    })
    .end();

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  webpackConfig.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .include.add(getAbsolutePath('src'))
    .end()
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: genAssetSubPath('img'),
    })
    .end()
    .use('image-webpack-loader')
    .loader(require.resolve('image-webpack-loader'))
    .options({
      // 开发环境下禁用
      disable: isDev,
    })
    .end();

  webpackConfig.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .include.add(getAbsolutePath('src'))
    .end()
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('media', configure.assets.inlineLimit));

  webpackConfig.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .include.add(getAbsolutePath('src'))
    .end()
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options(genUrlLoaderOptions('fonts', configure.assets.inlineLimit));

  // 复制静态资源
  const publicDir = getAbsolutePath('public');
  const outputDir = isDev ? '' : getAbsolutePath(configure.outputDir);
  const entry = Object.values(configure.pages).map((f) => getAbsolutePath(f.template));
  webpackConfig.plugin('copy').use(CopyPlugin, [
    {
      patterns: [
        {
          from: publicDir,
          to: outputDir,
          toType: 'dir',
          // 过滤所有的入口html文件
          filter: (file: string) => {
            return !entry.find((f) => equalPaths(f, file));
          },
        },
      ],
    },
  ]);
};
