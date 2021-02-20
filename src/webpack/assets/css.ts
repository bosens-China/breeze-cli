/* eslint-disable implicit-arrow-linebreak */
// css相关loader，暂时只定义两个loader，less和scss
import Config from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TransformationConfig } from '../../../typings/config';
import { isPublicPath } from '../../utils/env';
import { getAbsolutePath, getLinuxPath } from '../../utils/fs';
import { getFilename } from '../utils';

export default (config: Config, userCOnfig: TransformationConfig) => {
  interface IcssPar {
    name: string;
    loaderName: string;
  }
  const filename = getLinuxPath(`css/${getFilename(userCOnfig, '[name].css', '[name].[contenthash:8].css')}`);
  // 需要对css/[name].css这样的路径进行一个分割，如果假定目录是root/css/[name.css]那么，应该为../../
  const publicPath = '../'.repeat(filename.split('/').length - 1);

  const addCssModule = (obj: IcssPar) => {
    config.module
      .rule(obj.name)
      .test(new RegExp(`\\.${obj.name}$`))
      .include.add(getAbsolutePath('src'))
      .end()
      .when(
        isPublicPath(),
        (c) => {
          c.use('MiniCssExtractPlugin').loader(MiniCssExtractPlugin.loader).options({
            // 指定公共路径
            publicPath,
          });
        },
        (c) => {
          c.use('style-loader').loader(require.resolve('style-loader'));
        }
      )
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options({
        sourceMap: userCOnfig.css.sourceMap,
        ...userCOnfig.css.css,
      })
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({
        sourceMap: userCOnfig.css.sourceMap,
        ...userCOnfig.css.postcss,
      })
      .end()
      .when(obj.name !== 'css', (c) => {
        c.use(`${obj.name}-loader`)
          .loader(require.resolve(obj.loaderName))
          .options({
            sourceMap: userCOnfig.css.sourceMap,
            ...userCOnfig.css[obj.name],
          })
          .end();
      });
  };

  addCssModule({ name: 'css', loaderName: 'css-loader' });
  addCssModule({ name: 'less', loaderName: 'less-loader' });
  addCssModule({ name: 'scss', loaderName: 'sass-loader' });

  // 提取
  if (isPublicPath()) {
    config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        filename,
        chunkFilename: `css/${getFilename(userCOnfig, '[id].css', '[id].[contenthash:8].css')}`,
      },
    ]);
  }
};
