import Config from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import _ from 'lodash';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Iobj, TransformationConfig } from '../../typings/config';
import { getFilename, getEnv } from './utils';
import { getAbsolutePath } from '../utils/fs';
import laoding from './plugins/laoding';
import temporary from '../utils/temporary';
import assetsDialect from './assets/dialect';
import assetsHtml from './assets/html';
import assetsCopy from './assets/copy';
import assetsCss from './assets/css';
import assetsOther from './assets/other';

export default async (config: TransformationConfig) => {
  // 添加入口文件
  const c = new Config();
  for (const [name, value] of Object.entries(config.pages)) {
    const chunks: Array<string> = [];
    [...value.entry, ...value.entryStyle].forEach((item) => {
      const key = temporary.isTemporary(item) ? `temporary-${name}` : name;
      chunks.push(key);
      c.entry(key).add(item);
    });
    c.plugin(`html-${name}`).use(HtmlWebpackPlugin, [
      {
        ...value.options,
        template: value.template,
        filename: value.filename,
        chunks,
      },
    ]);
  }
  c.output.path(config.outputDir).filename(`js/${getFilename(config, '[name].js', '[name].[contenthash:8].js')}`);

  // 设置别名
  for (const [name, value] of Object.entries(config.alias)) {
    c.resolve.alias.set(name, getAbsolutePath(value));
  }
  c.resolve.alias.set('@', getAbsolutePath('src'));
  if (config.mode === 'default') {
    // 设置变量信息
    const obj = _.entries(getEnv(config)).reduce((x: Iobj, y) => {
      const current = x;
      const [name, value] = y;
      current[name] = JSON.stringify(value);
      return current;
    }, {});
    c.plugin('env').use(webpack.DefinePlugin, [obj]);
  }

  assetsDialect(c, config);
  assetsHtml(c, config);
  assetsCopy(c, config);
  assetsCss(c, config);
  assetsOther(c, config);
  c.plugin('laoding').use(laoding);
  c.when(!!config.lintOnSave, (webpackCOnfig) => {
    webpackCOnfig.plugin('eslint').use(ESLintPlugin, [
      {
        extensions: ['js', 'ts'],
        exclude: ['node_modules', '.temporary'],
      },
    ]);
  });
  return c;
};
