import { Iconfig } from '../typings';
import Config from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

export default (config: Config, configure: Iconfig, isDev: boolean) => {
  config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
    {
      filename: (file) => {
        const {
          chunk: { name },
        } = file;
        const reg = /__css_([\s\S]+?)\./;
        return `css/${name.match(reg)?.[1]}.css`;
      },
      chunkFilename: 'css/[id].css',
    },
  ]);
  const {
    css: { scss, css, postcss },
  } = configure;

  config.module
    .rule('scss')
    .test(/\.s?css$/)
    .exclude.add(/node_modules/)
    .end()
    .when(
      isDev,
      (c) => {
        c.use('style-loader').loader(require.resolve('style-loader')).end();
      },
      (c) => {
        c.use('MiniCssExtractPlugin-loader')
          .loader(MiniCssExtractPlugin.loader)
          .options({
            publicPath: '../',
          })
          .end();
      },
    )
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({
      ...css,
      sourceMap: false,
    })
    .end()
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      ...postcss,
      sourceMap: false,
    })
    .end()
    // 格式化css，直接通过入口引入css有问题
    .use('format')
    .loader(path.resolve(__dirname, '../loader/format.css'))
    .end()
    .use('sass-loader')
    .loader(require.resolve('sass-loader'))
    .options({
      ...scss,
      sourceMap: false,
    })
    .end();
};
