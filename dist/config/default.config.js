"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.config = void 0;
const lodash_1 = __importDefault(require("lodash"));
const config = (isDev = false) => {
    return {
        publicPath: isDev ? '/' : '',
        outputDir: 'dist',
        pages: {
            index: {
                entry: ['src/main.js'],
                entryView: 'src/App.njk',
                entryHot: 'src/hot.js',
                entryCss: ['src/assets/css/style.scss'],
                template: 'public/index.html',
                filename: 'index.html',
            },
        },
        css: {
            postcss: {},
            scss: {},
            css: {},
        },
        devServer: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        env: {
            all: {
                NODE_ENV: isDev ? 'development' : 'production',
            },
            development: {},
            production: {},
        },
        var: {
            BASE_URL: isDev ? '/' : '',
        },
        build: {
            minifyCss: false,
            minifyImg: false,
            minifyHtml: false,
            minifyjs: false,
            formatJs: true,
            formatCss: false,
            formatHtml: true,
        },
        configureWebpack: {},
        lintOnSave: true,
    };
};
exports.config = config;
/**
 * 除了pages，其他选项进行深拷贝
 *
 * @param {Partial<Iconfig>} [c]
 * @return {*}  {Iconfig}
 */
const merge = (c, isDev = false) => {
    const defaultConfig = config(isDev);
    const { pages, ...args1 } = c || {};
    const { pages: p, ...args2 } = defaultConfig;
    return Object.assign(lodash_1.default.defaultsDeep({}, args1, args2), {
        pages: pages || p,
    });
};
exports.merge = merge;
//# sourceMappingURL=default.config.js.map