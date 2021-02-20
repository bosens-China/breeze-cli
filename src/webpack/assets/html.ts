import Config from 'webpack-chain';
import _ from 'lodash';
import path from 'path';
import { TransformationConfig } from '../../../typings/config';
import { getAbsolutePath, getLinuxPath } from '../../utils/fs';
import { Ipar } from '../../utils/render';
import { getEnv } from '../utils';

// 思路如下，html文件可以分为两部分，第一部分是静态部分也就是public下的，第二部分njk部分，对于njk部分，html应该始终返回true，而对于静态部分，则始终返回false
export default (c: Config, config: TransformationConfig) => {
  // 对需要njk的选项进行整合
  const obj: Ipar = {
    view: _.isString(config.nunjucks.view) ? [config.nunjucks.view] : config.nunjucks.view,
    varAll: config.nunjucks.varAll,
    filterAll: config.nunjucks.filterAll,
  };

  const htmlOption = {
    preprocessor(content: string, loaderContext: any) {
      const HtmlPlugin = _.get(loaderContext, '_compiler.options.plugins') as Array<any>;
      const arr = HtmlPlugin.find((item) => {
        const value = _.get(item, '__pluginConstructorName');
        const options = _.get(item, 'options', {});

        return (
          value === 'HtmlWebpackPlugin' && getLinuxPath(options.template) === getLinuxPath(loaderContext.resourcePath)
        );
      });
      try {
        const env = getEnv(config);
        const compiled = _.template(content);
        return compiled({
          htmlWebpackPlugin: arr,
          ...env,
        });
      } catch (err) {
        return loaderContext.emitError(err);
      }
    },
  };

  c.module
    .rule('html')
    .test(/\.(html)$/)
    .include.add(getAbsolutePath('public'))
    .add(getAbsolutePath('.temporary'))
    .add(getAbsolutePath('src'))
    .end()
    .use('html-loader')
    .loader(require.resolve('html-loader'))
    .options({
      ...htmlOption,
      sources: {
        // 始终返回false
        urlFilter() {
          return false;
        },
      },
    })
    .end();
  c.module
    .rule('njk')
    .test(/\.(njk)$/)
    .include.add(getAbsolutePath('src'))
    .end()
    .use('html-loader')
    .loader(require.resolve('html-loader'))
    .options({
      ...htmlOption,
      sources: {
        // 始终返回true
        urlFilter() {
          return true;
        },
      },
    })
    .end()
    .use('njk-loader')
    .loader(path.resolve(__dirname, 'njk-loader.js'))
    .options(obj)
    .end();
};
