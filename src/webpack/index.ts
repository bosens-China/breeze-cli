import { merge } from 'webpack-merge';
import _ from 'lodash';
import common from './common';
import dev from './dev';
import prod from './prod';
import hook from './hook';

import { TransformationConfig } from '../../typings/config';

export default async (config: TransformationConfig, isDev: boolean) => {
  const c = await common(config);
  const fn = isDev ? dev : prod;
  const webpackConfig = await fn(c, config);
  const { configureWebpack, chainWebpack } = config;
  if (_.isFunction(chainWebpack)) {
    await chainWebpack(webpackConfig);
  }
  let con = webpackConfig.toConfig();

  if (_.isFunction(configureWebpack)) {
    configureWebpack(con);
  }
  con = merge([con, _.isObjectLike(configureWebpack) ? configureWebpack : {}, hook]);
  return con;
};
