"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __importDefault(require("./common"));
const webpack_1 = __importDefault(require("webpack"));
const utils_1 = require("./utils");
const babelConfig = {
    presets: [['@babel/preset-env', { modules: false, useBuiltIns: 'usage', corejs: 3 }]],
};
const dev = async (config) => {
    const webpackConfig = await common_1.default(config, true);
    webpackConfig.mode('development');
    webpackConfig.devtool('source-map');
    webpackConfig.plugin('hot').use(webpack_1.default.NamedModulesPlugin).use(webpack_1.default.HotModuleReplacementPlugin);
    webpackConfig.devServer.hot(true);
    // 添加babel
    webpackConfig.module
        .rule('js')
        .test(/\.(js|ts)$/)
        .exclude.add(/node_modules/)
        .end()
        .include.add(utils_1.getAbsolutePath('src'))
        .end()
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options(babelConfig)
        .end()
        .when(config.lintOnSave, (c) => {
        c.use('eslint-loader').loader(require.resolve('eslint-loader')).options({ catch: true }).end();
    });
    return webpackConfig;
};
exports.default = dev;
//# sourceMappingURL=dev.js.map