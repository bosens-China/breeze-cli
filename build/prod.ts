import { Iconfig } from '../typings';
import common from './common';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';
import Loading from '../plugin/loading';

const build = async (config: Iconfig) => {
  const webpackConfig = await common(config, false);
  webpackConfig.mode('production');
  webpackConfig.plugin('clean').use(CleanWebpackPlugin);
  // 关闭压缩代码
  webpackConfig.optimization.minimize(false);
  // 压缩css
  if (config.build.minifyCss && !config.build.formatCss) {
    webpackConfig.plugin('minifyCss').use(OptimizeCssAssetsPlugin, [
      {
        assetNameRegExp: /\.css$/,
        cssProcessor: cssnano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: false,
      },
    ]);
  }
  webpackConfig.plugin('loading').use(Loading);
  return webpackConfig;
};

export default build;
