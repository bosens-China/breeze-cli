// 对pages下的模板进行处理

import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import { isExistence } from '../utils/fs';
import temporary from '../utils/temporary';
import defaultTemplate from '../string/defaultTemplate.html';
import { isPublicPath } from '../utils/env';
import render from '../utils/render';
import { Iconfig, TransformationConfig, TransformationConfigPagesValue } from '../../typings/config';
import { getEnv } from '../webpack/utils';

export default async (v: TransformationConfigPagesValue, config: Iconfig) => {
  const value = v;
  if (!(await isExistence(value.template))) {
    value.template = await temporary.write(temporary.getTemporaryName('.html'), defaultTemplate);
  }
  // 生产环境下，需要对template模板内容进行替换，将文件写入到与view同一文件夹内
  if (isPublicPath()) {
    const content = await fs.readFile(value.template, 'utf-8');
    // 先对html文件进行一次转码，之后再交给cheerio处理，否则可能出现转义情况
    const compiled = _.template(content);
    const htmlWebpackPlugin = {
      options: value.options,
    };
    const env = getEnv((config as unknown) as TransformationConfig);
    const html = compiled({
      htmlWebpackPlugin,
      ...env,
    });
    // 读取view的内容
    const viewContent = render({
      view: config.nunjucks.view,
      varAll: config.nunjucks.varAll,
      filterAll: config.nunjucks.filterAll,
      njkTemplate: value.entryView,
    });
    const $ = cheerio.load(html, { decodeEntities: false });
    if (!$(value.render).length) {
      throw new Error('render节点不存在');
    }
    $(value.render).append(viewContent);
    const code = $.html();
    // 写入到同一层级
    value.template = await temporary.write(temporary.getTemporaryName('.html', path.dirname(value.entryView)), code);
  }
};
