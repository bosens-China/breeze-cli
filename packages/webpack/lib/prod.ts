// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');

// module.exports = merge(common, {
//   mode: 'production',
// });

import common from './common';
import { ItrTransformConfig } from '../typings/config';

export default async (config: ItrTransformConfig) => {
  return common;
};
