"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
exports.default = (config, configure, isDev) => {
    config.plugin('MiniCssExtractPlugin').use(mini_css_extract_plugin_1.default, [
        {
            filename: (file) => {
                const { chunk: { name }, } = file;
                const reg = /__css_([\s\S]+?)\./;
                return `css/${name.match(reg)?.[1]}.css`;
            },
            chunkFilename: 'css/[id].css',
        },
    ]);
    const { css: { scss, css, postcss }, } = configure;
    config.module
        .rule('scss')
        .test(/\.s?css$/)
        .exclude.add(/node_modules/)
        .end()
        .when(isDev, (c) => {
        c.use('style-loader').loader(require.resolve('style-loader')).end();
    }, (c) => {
        c.use('MiniCssExtractPlugin-loader')
            .loader(mini_css_extract_plugin_1.default.loader)
            .options({
            publicPath: '../',
        })
            .end();
    })
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options({
        ...css,
        sourceMap: false,
    })
        .end()
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'))
        .options({
        ...postcss,
        sourceMap: false,
    })
        .end()
        // 格式化css，直接通过入口引入css有问题
        .use('format')
        .loader(path_1.default.resolve(__dirname, '../loader/format.css'))
        .end()
        .use('sass-loader')
        .loader(require.resolve('sass-loader'))
        .options({
        ...scss,
        sourceMap: false,
    })
        .end();
};
//# sourceMappingURL=css.js.map