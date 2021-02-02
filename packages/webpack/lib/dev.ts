// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');

// module.exports = merge(common, {
//   mode: 'development',
//   devtool: 'inline-source-map',
//   devServer: {
//     contentBase: './dist',
//   },
// });

import common from './common';
import { ItrTransformConfig } from '../typings/config';

export default async (config: ItrTransformConfig) => {
  return common;
};
