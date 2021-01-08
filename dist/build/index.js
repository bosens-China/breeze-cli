"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_config_1 = require("../config/default.config");
const lodash_1 = __importDefault(require("lodash"));
const dev_1 = __importDefault(require("./dev"));
const prod_1 = __importDefault(require("./prod"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_1 = __importDefault(require("webpack"));
const ip_1 = __importDefault(require("ip"));
const serve_1 = require("../utils/serve");
/**
 * 设置环境变量，虽然本身插件不适用，但是为了方便拓展一些其他场景
 *
 * @param {boolean} isDev
 */
const setModeVar = (isDev) => {
    lodash_1.default.set(process.env, 'NODE_ENV', isDev ? 'development' : 'production');
};
/**
 * 设置环境变量，之后根据模式启动
 *
 * @param {Partial<Iconfig>} [config]
 * @param {boolean} [isDev=false]
 */
const App = async (config, isDev = true) => {
    setModeVar(isDev);
    const userConfig = default_config_1.merge(config, isDev);
    const webpackConfig = isDev ? await dev_1.default(userConfig) : await prod_1.default(userConfig);
    const { devServer } = userConfig;
    // 根据配置文件，修改webpack实例
    const wc = webpack_merge_1.default(webpackConfig.toConfig(), { devServer }, lodash_1.default.isObjectLike(userConfig.configureWebpack) ? userConfig.configureWebpack : {});
    if (lodash_1.default.isFunction(userConfig.configureWebpack)) {
        userConfig.configureWebpack(wc);
    }
    if (isDev) {
        await server(wc);
        return;
    }
    await build(wc);
};
async function server(config) {
    const devServer = config.devServer || {};
    devServer.host = devServer.host || '0.0.0.0';
    devServer.port = devServer.port || (await serve_1.getSequentialPort());
    const ipStr = devServer.host === '0.0.0.0' ? 'localhost' : ip_1.default.address();
    webpack_dev_server_1.default.addDevServerEntrypoints(config, devServer);
    const compiler = webpack_1.default(config);
    const server = new webpack_dev_server_1.default(compiler, devServer);
    server.listen(devServer.port, devServer.host, () => {
        console.log(`运行在: http${devServer.https ? 's' : ''}://${ipStr}:${devServer.port} 上`);
    });
}
async function build(config) {
    webpack_1.default(config, (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stats.toString({
            chunks: false,
            colors: true,
        }));
    });
}
exports.default = App;
//# sourceMappingURL=index.js.map