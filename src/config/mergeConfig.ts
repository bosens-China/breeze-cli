import _ from 'lodash';
import defaultConfig from './defaultConfig';
import { Iconfig } from '../../typings/config';

type PartialConfig = Partial<Iconfig>;

export default (config: PartialConfig) => {
  const { pages: configPages, ...argsConfig } = config;
  const { pages: defaultConfigPages, ...argsDefaultConfig } = defaultConfig;
  // 默认的配置都可以进行深合并，但是pages比较特别，所以要进行浅合并
  return _.assign(
    {
      pages: {
        ...defaultConfigPages,
        ...configPages,
      },
    },
    _.defaultsDeep(argsConfig, argsDefaultConfig)
  ) as Iconfig;
};
