import Config from 'webpack-chain';
import { Iconfig } from '../typings';
import { getAbsolutePath, equalPaths, proGlob, identicalName } from './utils';
import _ from 'lodash';
import Html from '../plugin/html';

export default async (config: Config, configure: Iconfig, isDev: boolean) => {
  // 搜寻目标public文件
  const allFile = await proGlob();
  const entry = Object.values(configure.pages).map((f) => getAbsolutePath(f.template));
  const entryview = Object.values(configure.pages).map((f) => getAbsolutePath(f.entryView));
  const htmlOption = {
    minimize: !isDev && configure.build.minifyHtml && !configure.build.formatHtml,
    preprocessor(content: string) {
      const { var: varAll } = configure;
      const compiled = _.template(content);
      const c = compiled(varAll);
      return c;
    },
    attributes: {
      urlFilter: (_attribute: string, value: string) => {
        return !identicalName(allFile, value);
      },
    },
  };
  config.module
    .rule('html')
    .test(/\.html/)
    // 只导入public下的html文件
    .include.add(((file: string) => {
      return !!entry.find((f) => equalPaths(f, file));
    }) as any)
    .end()
    .use('html-loader')
    .loader(require.resolve('html-loader'))
    .options(htmlOption)
    .end();
  config.module
    .rule('njk')
    .test(/\.(njk|nunjucks)$/)
    // 导入入口view文件
    .include.add(((file: string) => {
      return entryview.find((f) => equalPaths(f, file));
    }) as any)
    .end()
    .use('html-loader')
    .loader(require.resolve('html-loader'))
    .options({
      ...htmlOption,
      minimize: false,
    })
    .end()
    .use('njk-html-loader')
    .loader(require.resolve('njk-html-loader'))
    .options({
      data: configure.var,
    })
    .end();

  config.plugin('html').use(Html, [configure, isDev]);
};
