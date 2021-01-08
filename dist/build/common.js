"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const utils_1 = require("./utils");
const lodash_1 = __importDefault(require("lodash"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const template_1 = __importDefault(require("./template"));
const assets_1 = __importDefault(require("./assets"));
const css_1 = __importDefault(require("./css"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const cheerio_1 = __importDefault(require("cheerio"));
const temporary_1 = __importDefault(require("../utils/temporary"));
/**
 * 处理资源文件入口和html文件的入口
 *
 * @param {Config} config
 * @param {Iconfig} configure
 */
const setEntry = (config, configure, isDev) => {
    const { pages } = configure;
    for (const [name, pageValue] of Object.entries(pages)) {
        const { entry, entryCss, entryHot, template, filename, entryView } = pageValue;
        const entryArr = lodash_1.default.isArray(entry) ? entry : [entry];
        const entryCssArr = lodash_1.default.isArray(entryCss) ? entryCss : [entryCss];
        const chunkEntry = {};
        const chunkEntryCss = {};
        // css和hot的文件需要单独命名，正常的entry不需要，因为css和hot会在插件删除，起命名是为了区分
        [...entryArr, ...entryCssArr].forEach((item, index) => {
            const p = utils_1.getAbsolutePath(item);
            const n = index > entryArr.length - 1 ? `__css_${utils_1.getFileName(p)}` : `${utils_1.getFileName(p)}`;
            if (index > entryArr.length - 1) {
                config.entry(n).add(p).end();
                chunkEntryCss[n] = p;
            }
            else {
                if (isDev) {
                    config.entry(n).add(p).end();
                }
                chunkEntry[n] = p;
            }
        });
        // hot文件单独处理下
        const hotPath = utils_1.getAbsolutePath(entryHot);
        const hotName = `__hot_${utils_1.getFileName(hotPath)}`;
        const __option = {
            hotName: hotName,
            hotFile: hotPath,
            entry: chunkEntry,
            entryCss: chunkEntryCss,
            config: configure,
            entryView,
        };
        config.entry(hotName).add(hotPath).end();
        config.plugin(name).use(html_webpack_plugin_1.default, [
            {
                minify: false,
                template: utils_1.getAbsolutePath(template),
                filename,
                chunks: [hotName, ...Object.keys(chunkEntry), ...Object.keys(chunkEntryCss)],
                // 写入一些私有属性，留作插件使用
                __option,
            },
        ]);
    }
};
// 处理入口模板，替换内容
async function setTemporaryTemplate(configure, entryTemplate, entryView) {
    // 读取源文件内容
    const content = await fs_extra_1.default.readFile(entryTemplate, 'utf-8');
    // 替换
    const { var: varAll } = configure;
    const compiled = lodash_1.default.template(content);
    const c = compiled(varAll);
    // 加载view内容
    const con = await fs_extra_1.default.readFile(entryView, 'utf-8');
    const contentView = nunjucks_1.default.renderString(con, varAll);
    const $ = cheerio_1.default.load(c, { decodeEntities: false });
    $('#app').html(contentView);
    const p = await temporary_1.default.write(entryView, $.html());
    return p;
}
async function setEntryView(configure) {
    const all = [];
    for (const [name, value] of Object.entries(configure.pages)) {
        all.push(setTemporaryTemplate(configure, value.template, value.entryView).then((p) => {
            lodash_1.default.set(configure.pages, `${name}.template`, p);
        }));
    }
    await Promise.all(all);
}
const common = async (configure, isDev) => {
    // 开发环境下不能这样做，node_modules文件的变更不会被检测到，会导致热更新失败
    if (!isDev) {
        await setEntryView(configure);
    }
    const config = new webpack_chain_1.default();
    config.output
        .path(utils_1.getAbsolutePath(configure.outputDir))
        .filename('js/[name].js')
        .publicPath(configure.publicPath)
        .end();
    setEntry(config, configure, isDev);
    await css_1.default(config, configure, isDev);
    await template_1.default(config, configure, isDev);
    await assets_1.default(config, configure, isDev);
    // 设置别名
    config.resolve.alias.set('@', utils_1.getAbsolutePath('src')).end();
    config.resolve.extensions.clear().add('.js').add('.json').add('.ts');
    return config;
};
exports.default = common;
//# sourceMappingURL=common.js.map