/*
  校验用户输入的格式是否有误，只对pages做了严格的校验
*/

import Schema, { Rules } from 'async-validator';
import { Iconfig } from '../typings';
import _ from 'lodash';

const chechPages = (value: any) => {
  const validator = new Schema({
    entry: {
      required: true,
      message: 'entry类型为 string | Array<string>',
      validator(_rule, value) {
        return _.isString(value) || (_.isArray(value) && value.every((f) => _.isString(f)));
      },
    },
    entryHot: {
      message: 'entryHot类型为 string',
      type: 'string',
      required: true,
    },
    entryCss: {
      message: 'validator 类型为 object | Function',
      validator(_rule, value) {
        return value !== undefined
          ? _.isString(value) || (_.isArray(value) && value.every((f) => _.isString(f)))
          : true;
      },
    },
    template: {
      message: 'template 类型为 string',
      type: 'string',
      required: true,
    },
    filename: {
      message: 'filename 类型为 string',
      type: 'string',
      required: true,
    },
    entryView: {
      message: 'entryView 类型为 string',
      type: 'string',
      required: true,
    },
  });
  return validator.validate(value || {}).catch(({ errors }) => {
    throw new Error(_.get(errors, '[0].message'));
  });
};

const check = async (config?: Partial<Iconfig>) => {
  const descriptor: Rules = {
    publicPath: {
      message: 'publicPath 类型为 string',
      type: 'string',
    },
    outputDir: {
      message: 'outputDir 类型为 string',
      type: 'string',
    },
    rename: {
      message: 'rename 类型为 boolean',
      type: 'boolean',
    },
    pages: {
      type: 'object',
      async asyncValidator(_rule, value: Iconfig['pages']) {
        if (value && !_.keys(value).length) {
          return Promise.reject('pages is require');
        }
        await Promise.all(_.values(value).map((iterator) => chechPages(iterator)));
        return Promise.resolve();
      },
    },
    css: {
      message: 'css 类型为 object',
      type: 'object',
    },
    devServer: {
      message: 'devServer 类型为 object',
      type: 'object',
    },
    env: {
      message: 'env 类型为 object 或者为 boolean',
      validator(_rule, value) {
        return value !== undefined ? value === false || _.isObjectLike(value) : true;
      },
    },
    var: {
      message: 'var 类型为 object',
      type: 'object',
    },
    build: {
      message: 'build 类型为 object',
      type: 'object',
    },
    configureWebpack: {
      message: 'configureWebpack 类型为object | Function',
      validator(_rule, value) {
        return value !== undefined ? _.isFunction(value) || _.isObjectLike(value) : true;
      },
    },
    lintOnSave: {
      message: 'lintOnSave 类型为 boolean',
      type: 'boolean',
    },
    assets: {
      message: 'assets 类型为 object',
      type: 'object',
    },
  };
  const validator = new Schema(descriptor);
  await validator.validate(config || {}, { first: true }).catch(({ errors }) => {
    throw new Error(_.get(errors, '[0].message'));
  });
};

export default check;
