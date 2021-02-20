import _ from 'lodash';
import { Iobj, TransformationConfig } from '../../typings/config';
import { isPublicPath } from '../utils/env';

export const getFilename = (config: TransformationConfig, devNmae: string, prodName: string) => {
  const { filenameHashing, mode, assetsDir } = config;
  let str = assetsDir || '';
  if (str.startsWith('/')) {
    str = str.slice(1);
  }
  if (str.endsWith('/')) {
    str = str.slice(0, -1);
  }
  if (!filenameHashing || mode === 'jsp' || !isPublicPath()) {
    return `${str ? `${str}/` : ''}${devNmae}`;
  }
  return `${str ? `${str}/` : ''}/${prodName}`;
};

// 默认的env变量
export const getEnv = (config: TransformationConfig) => {
  const obj = _.entries(config.env).reduce((current: Iobj, item) => {
    const o = current;
    const [name, value] = item;
    o[`process.env.${name}`] = value;
    o[name] = value;
    return current;
  }, {});
  return {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: config.publicPath,
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.BASE_URL': config.publicPath,
    ...obj,
  };
};
