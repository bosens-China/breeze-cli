"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const lodash_1 = __importDefault(require("lodash"));
const html_1 = __importDefault(require("../plugin/html"));
exports.default = async (config, configure, isDev) => {
    // 搜寻目标public文件
    const allFile = await utils_1.proGlob();
    const entry = Object.values(configure.pages).map((f) => utils_1.getAbsolutePath(f.template));
    const entryview = Object.values(configure.pages).map((f) => utils_1.getAbsolutePath(f.entryView));
    const htmlOption = {
        minimize: !isDev && configure.build.minifyHtml && !configure.build.formatHtml,
        preprocessor(content) {
            const { var: varAll } = configure;
            const compiled = lodash_1.default.template(content);
            const c = compiled(varAll);
            return c;
        },
        attributes: {
            urlFilter: (_attribute, value) => {
                return !utils_1.identicalName(allFile, value);
            },
        },
    };
    config.module
        .rule('html')
        .test(/\.html/)
        // 只导入public下的html文件
        .include.add(((file) => {
        return !!entry.find((f) => utils_1.equalPaths(f, file));
    }))
        .end()
        .use('html-loader')
        .loader(require.resolve('html-loader'))
        .options(htmlOption)
        .end();
    config.module
        .rule('njk')
        .test(/\.(njk|nunjucks)$/)
        // 导入入口view文件
        .include.add(((file) => {
        return entryview.find((f) => utils_1.equalPaths(f, file));
    }))
        .end()
        .use('html-loader')
        .loader(require.resolve('html-loader'))
        .options({
        ...htmlOption,
        minimize: false,
    })
        .end()
        .use('njk-html-loader')
        .loader(require.resolve('njk-html-loader'))
        .options({
        data: configure.var,
    })
        .end();
    config.plugin('html').use(html_1.default, [configure, isDev]);
};
//# sourceMappingURL=template.js.map