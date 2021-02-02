// 合并配置文件
import _ from 'lodash';
import { Iconfig } from '../typings/config';
import defaultConfig from './defaultConfig';

export default (config: Partial<Iconfig>): Iconfig => {
  const v = _.merge({}, defaultConfig, config);
  // 单独处理下pages的情况，它不应该被递归合并
  v.pages = config.pages ?? defaultConfig.pages;
  return v;
};
