"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __importDefault(require("./common"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const cssnano_1 = __importDefault(require("cssnano"));
const build = async (config) => {
    const webpackConfig = await common_1.default(config, false);
    webpackConfig.mode('production');
    webpackConfig.plugin('clean').use(clean_webpack_plugin_1.CleanWebpackPlugin);
    // 关闭压缩代码
    webpackConfig.optimization.minimize(false);
    // 压缩css
    if (config.build.minifyCss && !config.build.formatCss) {
        webpackConfig.plugin('minifyCss').use(optimize_css_assets_webpack_plugin_1.default, [
            {
                assetNameRegExp: /\.css$/,
                cssProcessor: cssnano_1.default,
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: false,
            },
        ]);
    }
    return webpackConfig;
};
exports.default = build;
//# sourceMappingURL=prod.js.map