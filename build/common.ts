import Config from 'webpack-chain';
import { Iconfig, Iobj } from '../typings';
import { getFileName, getAbsolutePath, equalPaths } from './utils';
import _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import setTemplate from './template';
import setAssets from './assets';
import setCss from './css';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import temporary from '../utils/temporary';
import { stats } from './index';
import path from 'path';

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

    // 这里hot是必须添加的，生产环境下入口通过插件添加
    config.entry(hotName).add(hotPath).end();
    config.plugin(name).use(HtmlWebpackPlugin, [
      {
        minify: false,
        template: getAbsolutePath(template),
        filename,
        chunks: [hotName, ...(isDev ? Object.keys(chunkEntry) : []), ...Object.keys(chunkEntryCss)],
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

  if (!isDev) {
    config.stats(stats);
  }

  config.module
    .rule('js')
    .test(/\.(js|ts)$/)
    .exclude.add(/node_modules/)
    .end()
    .when(
      isDev,
      (c) => {
        c.include.add(getAbsolutePath('src')).end().use('babel-loader').loader(require.resolve('babel-loader')).end();
      },
      (c) => {
        // 获取所有hot文件
        const all = Object.values(configure.pages).map((f) => {
          return getAbsolutePath(f.entryHot);
        });
        c.include.add(((file: string) => {
          return !all.find((f) => equalPaths(f, file));
        }) as any);
      },
    )
    .when(configure.lintOnSave && isDev, (c) => {
      c.use('eslint-loader').loader(require.resolve('eslint-loader')).options({ catch: true }).end();
    })
    .when(!isDev, (c) => {
      c.use('empty')
        .loader(require.resolve(path.resolve(__dirname, '../loader/empty')))
        .options(config)
        .end();
    });

  return config;
};

export default common;
