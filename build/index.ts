import { Iconfig } from '../typings';
import { merge } from '../config/default.config';
import _ from 'lodash';
import dev from './dev';
import prod from './prod';
import webpackMerge from 'webpack-merge';

import webpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import ip from 'ip';
import { getSequentialPort } from '../utils/serve';

/**
 * 设置环境变量，虽然本身插件不适用，但是为了方便拓展一些其他场景
 *
 * @param {boolean} isDev
 */
const setModeVar = (isDev: boolean) => {
  _.set(process.env, 'NODE_ENV', isDev ? 'development' : 'production');
};

/**
 * 设置环境变量，之后根据模式启动
 *
 * @param {Partial<Iconfig>} [config]
 * @param {boolean} [isDev=false]
 */
const App = async (config?: Partial<Iconfig>, isDev = true) => {
  setModeVar(isDev);
  const userConfig = merge(config, isDev);
  const webpackConfig = isDev ? await dev(userConfig) : await prod(userConfig);
  const { devServer } = userConfig;
  // 根据配置文件，修改webpack实例
  const wc = webpackMerge(
    webpackConfig.toConfig(),
    { devServer },
    _.isObjectLike(userConfig.configureWebpack) ? userConfig.configureWebpack : {},
  );
  if (_.isFunction(userConfig.configureWebpack)) {
    userConfig.configureWebpack(wc);
  }
  if (isDev) {
    await server(wc);
    return;
  }
  await build(wc);
};

async function server(config: webpack.Configuration) {
  const devServer: webpackDevServer.Configuration = config.devServer || {};
  devServer.host = devServer.host || '0.0.0.0';
  devServer.port = devServer.port || (await getSequentialPort());
  const ipStr = devServer.host === '0.0.0.0' ? 'localhost' : ip.address();
  webpackDevServer.addDevServerEntrypoints(config, devServer);
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, devServer);
  server.listen(devServer.port, devServer.host, () => {
    console.log(`运行在: http${devServer.https ? 's' : ''}://${ipStr}:${devServer.port} 上`);
  });
}
async function build(config: webpack.Configuration) {
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(
      stats.toString({
        chunks: false, // 使构建过程更静默无输出
        colors: true, // 在控制台展示颜色
      }),
    );
  });
}

export default App;
