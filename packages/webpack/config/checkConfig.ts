// 校验输入值

import { Iconfig, TtransformPages } from '../typings/config';
import Schema, { Rules } from 'async-validator';
import _ from 'lodash';

export const check = async <T>(data: T, rule: Rules) => {
  const validator = new Schema(rule);
  await validator.validate(data, { first: true }).catch(({ errors }) => {
    throw new Error(_.get(errors, '[0].message'));
  });
};

export default async (config: Partial<Iconfig>) => {
  await check(config, {
    publicPath: { type: 'string', message: 'publicPath 类型为 string' },
    outputDir: { type: 'string', message: 'outputDir 类型为 string' },
    assetsDir: { type: 'string', message: 'assetsDir 类型为 string' },
    indexPath: { type: 'string', message: 'indexPath 类型为 string' },
    filenameHashing: { type: 'boolean', message: 'filenameHashing 类型为 boolean' },
    pages: {
      type: 'object',
      message: 'pages 类型为 object',
      async asyncValidator(_rule, value) {
        if (_.isUndefined(value)) {
          return;
        }
        if (!_.isObjectLike(value)) {
          throw new Error('pages 类型为 object');
        }

        const v = (_.values(value) as unknown) as Array<TtransformPages | string>;
        for (const item of v) {
          if (!_.isObjectLike(item) && !_.isString(item)) {
            throw new Error('pages 类型为的子项目必须为 string|object');
          }
          if (_.isString(item)) {
            continue;
          }
          await check(item, {
            template: { type: 'string', message: 'page.template 类型为 string' },
            view: { type: 'string', message: 'page.view 类型为 string' },
            render: { type: 'string', message: 'page.render 类型为 string' },
            filename: { type: 'string', message: 'page.filename 类型为 string' },
            title: { type: 'string', message: 'page.title 类型为 string' },
            css: {
              message: 'page.css 类型为 Array<string> | string>',

              validator(_rule, value: Array<string>) {
                if (_.isUndefined(value)) {
                  return true;
                }
                return _.isString(value) || _.isArray(value);
              },
            },
            javascript: {
              type: 'array',

              message: `page.javascript 类型为 Array<string> | string>`,
              validator(_rule, value: Array<string>) {
                if (_.isUndefined(value)) {
                  return true;
                }
                return _.isString(value) || _.isArray(value);
              },
            },
            options: {
              type: 'object',

              message: `page.options 类型为 object`,
            },
          });
        }
      },
    },
    lintOnSave: {
      message: `lintOnSave 类型为 boolean | 'warning' | 'default' | 'error'`,
      validator(_rule, value) {
        if (_.isUndefined(value)) {
          return true;
        }
        return _.isBoolean(value) ? true : ['warning', 'default', 'error'].includes(value);
      },
    },
    transpileDependencies: {
      type: 'array',

      message: `transpileDependencies 的类型为 Array<string | RegExp>`,
      validator(_rule, value: Array<any>) {
        if (_.isUndefined(value)) {
          return true;
        }
        return !!value.find((f) => !_.isString(f) && !_.isRegExp(f));
      },
    },
    productionSourceMap: {
      type: 'boolean',
      message: `productionSourceMap 的类型为 boolean`,
    },
    configureWebpack: {
      message: `configureWebpack 类型为 Function | object`,
      validator(_rule, value) {
        if (_.isUndefined(value)) {
          return true;
        }
        return _.isFunction(value) || _.isObjectLike(value);
      },
    },
    chainWebpack: {
      message: 'chainWebpack 类型为 Function',
      validator(_rule, value) {
        if (_.isUndefined(value)) {
          return true;
        }
        return _.isFunction(value);
      },
    },
    css: {
      type: 'object',

      message: 'css 类型为 object',
      fields: {
        extract: { type: 'boolean', message: 'css.extract 类型为 boolean' },
      },
    },
    devServer: {
      type: 'object',

      message: 'devServer 类型为 object',
    },
    parallel: {
      type: 'boolean',

      message: 'parallel 类型为 boolean',
    },
    image: {
      type: 'object',

      message: 'image 类型为 object',
      fields: {
        limit: {
          message: 'image.limit 类型为 number | boolean',
          validator(_rule, value) {
            if (_.isUndefined(value)) {
              return true;
            }
            return _.isBoolean(value) || _.isNumber(value);
          },
        },
        minimize: {
          message: 'image.minimize 类型为 boolean',
          type: 'boolean',
        },
      },
    },
    minimize: {
      message: `minimize 类型为 object | boolean`,
      validator(_rule, value) {
        if (_.isUndefined(value)) {
          return true;
        }
        return _.isBoolean(value) || _.isObjectLike(value);
      },
    },
    format: {
      message: `format 类型为 object | boolean`,
      validator(_rule, value) {
        if (_.isUndefined(value)) {
          return true;
        }
        return _.isBoolean(value) || _.isObjectLike(value);
      },
    },
    nunjucks: {
      type: 'object',

      message: 'nunjucks 类型为 object',
      fields: {
        filters: {
          type: 'object',

          message: 'nunjucks.filters 类型为 object',
        },
        var: {
          type: 'object',

          message: 'nunjucks.var 类型为 object',
        },
      },
    },
    mode: {
      type: 'enum',
      enum: ['tradition', 'spa'],
      message: 'mode 类型为 tradition | spa',
    },
  });
};
