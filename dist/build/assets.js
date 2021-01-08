"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inlineLimit = 4096;
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const utils_1 = require("./utils");
const genAssetSubPath = (dir) => {
    return `${dir}/[name].[ext]`;
};
const genUrlLoaderOptions = (dir) => {
    return {
        limit: inlineLimit,
        // use explicit fallback to avoid regression in url-loader>=1.1.0
        fallback: {
            loader: require.resolve('file-loader'),
            options: {
                name: genAssetSubPath(dir),
            },
        },
    };
};
// https://github.com/vuejs/vue-cli/blob/2dbe0be8406e5c432dacc559a54b270a5670d652/packages/%40vue/cli-service/lib/config/assets.js
// 参考vueCLI
exports.default = (webpackConfig, configure, isDev) => {
    webpackConfig.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .include.add(utils_1.getAbsolutePath('src'))
        .end()
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('img'))
        .end()
        .when(!isDev && configure.build.minifyImg, (c) => {
        c.use('image-webpack-loader').loader(require.resolve('image-webpack-loader')).end();
    })
        .end();
    // do not base64-inline SVGs.
    // https://github.com/facebookincubator/create-react-app/pull/1180
    webpackConfig.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .include.add(utils_1.getAbsolutePath('src'))
        .end()
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
        name: genAssetSubPath('img'),
    })
        .end()
        .use('image-webpack-loader')
        .loader(require.resolve('image-webpack-loader'))
        .options({
        // 开发环境下禁用
        disable: isDev,
    })
        .end();
    webpackConfig.module
        .rule('media')
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .include.add(utils_1.getAbsolutePath('src'))
        .end()
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('media'));
    webpackConfig.module
        .rule('fonts')
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .include.add(utils_1.getAbsolutePath('src'))
        .end()
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('fonts'));
    // 复制静态资源
    const publicDir = utils_1.getAbsolutePath('public');
    const outputDir = isDev ? '' : utils_1.getAbsolutePath(configure.outputDir);
    const entry = Object.values(configure.pages).map((f) => utils_1.getAbsolutePath(f.template));
    webpackConfig.plugin('copy').use(copy_webpack_plugin_1.default, [
        {
            patterns: [
                {
                    from: publicDir,
                    to: outputDir,
                    toType: 'dir',
                    // 过滤所有的入口html文件
                    filter: (file) => {
                        return !entry.find((f) => utils_1.equalPaths(f, file));
                    },
                },
            ],
        },
    ]);
};
//# sourceMappingURL=assets.js.map