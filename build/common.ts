import Config from 'webpack-chain';
import { Iconfig, Iobj } from '../typings';
import { getFileName, getAbsolutePath } from './utils';
import _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import setTemplate from './template';
import setAssets from './assets';
import setCss from './css';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import temporary from '../utils/temporary';
import path from 'path';
import { stats } from './index';

/**
 * 处理资源文件入口和html文件的入口
 *
 * @param {Config} config
 * @param {Iconfig} configure
 */
const setEntry = (config: Config, configure: Iconfig, isDev: boolean) => {
  const { pages } = configure;
  for (const [name, pageValue] of Object.entries(pages)) {
    const { entry, entryCss, entryHot, template, filename, entryView } = pageValue;
    const entryArr = _.isArray(entry) ? entry : [entry];
    const entryCssArr = _.isArray(entryCss) ? entryCss : [entryCss];
    const chunkEntry: Iobj<string> = {};
    const chunkEntryCss: Iobj<string> = {};
    // css和hot的文件需要单独命名，正常的entry不需要，因为css和hot会在插件删除，起命名是为了区分
    [...entryArr, ...entryCssArr].forEach((item, index) => {
      const p = getAbsolutePath(item);
      const n = index > entryArr.length - 1 ? `__css_${getFileName(p)}` : `${getFileName(p)}`;
      if (index > entryArr.length - 1) {
        config.entry(n).add(p).end();
        chunkEntryCss[n] = p;
      } else {
        if (isDev) {
          config.entry(n).add(p).end();
        }
        chunkEntry[n] = p;
      }
    });
    // hot文件单独处理下
    const hotPath = getAbsolutePath(entryHot);
    const hotName = `__hot_${getFileName(hotPath)}`;
    const __option = {
      hotName: hotName,
      hotFile: hotPath,
      entry: chunkEntry,
      entryCss: chunkEntryCss,
      config: configure,
      entryView,
    };
    config.entry(hotName).add(hotPath).end();
    config.plugin(name).use(HtmlWebpackPlugin, [
      {
        minify: false,
        template: getAbsolutePath(template),
        filename,
        chunks: [hotName, ...Object.keys(chunkEntry), ...Object.keys(chunkEntryCss)],
        // 写入一些私有属性，留作插件使用
        __option,
      },
    ]);
  }
};

// 处理入口模板，替换内容
async function setTemporaryTemplate(configure: Iconfig, entryTemplate: string, entryView: string) {
  // 读取源文件内容
  const content = await fs.readFile(entryTemplate, 'utf-8');
  // 替换
  const { var: varAll } = configure;
  const compiled = _.template(content);
  const c = compiled(varAll);
  // 加载view内容
  const con = await fs.readFile(entryView, 'utf-8');
  const contentView = nunjucks.renderString(con, varAll);
  const $ = cheerio.load(c, { decodeEntities: false });
  $('#app').html(contentView);
  const p = await temporary.write(entryView, $.html());
  return p;
}

async function setEntryView(configure: Iconfig) {
  const all = [];
  for (const [name, value] of Object.entries(configure.pages)) {
    all.push(
      setTemporaryTemplate(configure, value.template, value.entryView).then((p) => {
        _.set(configure.pages, `${name}.template`, p);
      }),
    );
  }
  await Promise.all(all);
}

const common = async (configure: Iconfig, isDev: boolean) => {
  // 开发环境下不能这样做，node_modules文件的变更不会被检测到，会导致热更新失败
  if (!isDev) {
    await setEntryView(configure);
  }
  const config = new Config();
  config.output
    .path(getAbsolutePath(configure.outputDir))
    .filename('js/[name].js')
    .publicPath(configure.publicPath)
    .end();
  setEntry(config, configure, isDev);

  await setCss(config, configure, isDev);
  await setTemplate(config, configure, isDev);
  await setAssets(config, configure, isDev);
  // 设置别名
  config.resolve.alias.set('@', getAbsolutePath('src')).end();
  config.resolve.extensions.clear().add('.js').add('.json').add('.ts');

  // 添加校验
  config.module
    .rule('lint')
    .test(/\.(js|ts)$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(getAbsolutePath('src'))
    .end()
    .use('check')
    .loader(require.resolve(path.resolve(__dirname, '../loader/checkJS')))
    .options(configure)
    .end();

  if (!isDev) {
    config.stats(stats);
  }
  return config;
};

export default common;
