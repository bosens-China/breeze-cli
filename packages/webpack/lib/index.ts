// 返回一个最终的webpack配置文件，供cli调用使用，报错信息在cli统一处理
import defaultConfig, { FileProfill } from '../config';
import { Iconfig } from '../typings/config';
import { isProduction } from '../utils/base';
import dev from './dev';
import prod from './prod';
import _ from 'lodash';
import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import temporary from '../utils/temporary';

export default async (config?: Partial<Iconfig>): Promise<Configuration> => {
  // 结合config获取最终的配置文件，之后对配置文件进行文件检查，如果不存在的文件直接报错
  const system = await defaultConfig(config);
  // 对不存在的文件进行校验
  try {
    await FileProfill(system);
    const fn = isProduction() ? prod : dev;
    const c = await fn(system);
    // 加载一下配置文件关于webpakc的调用
    if (_.isFunction(system.chainWebpack)) {
      await system.chainWebpack(c);
    }
    // 调用完成之后返回webpack的配置，在configureWebpack调用
    const webpackConfig = c.toConfig();
    if (_.isFunction(system.configureWebpack)) {
      await system.configureWebpack(webpackConfig);
    }
    // 这个判断会忽略函数...
    if (_.isObjectLike(system.configureWebpack)) {
      return merge(webpackConfig, system.configureWebpack);
    } else {
      return webpackConfig;
    }
  } catch (e) {
    // 发生错误，直接删除temporary文件，继续抛出错误
    temporary.removeSync();
    throw e;
  }
};
