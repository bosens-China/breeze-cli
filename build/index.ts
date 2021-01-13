import { Iconfig } from '../typings';
import { merge } from '../config/default.config';
import _ from 'lodash';
import dev from './dev';
import prod from './prod';
import webpackMerge from 'webpack-merge';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import webpackDevServer from 'webpack-dev-server';
import webpack, { Stats } from 'webpack';
import colors from 'colors';
import temporary from '../utils/temporary';
import ip from 'ip';
import { getSequentialPort } from '../utils/serve';

const stats: Stats.ToStringOptionsObject = {
  warnings: false,
  colors: true,
  version: false,
  usedExports: false,
  timings: true,
  publicPath: true,
  reasons: false,
  source: false,
  providedExports: false,
  performance: false,
  modules: false,
  chunks: false,
  assets: true,
  builtAt: true,
  cached: true,
  cachedAssets: true,
  children: false,
  chunkModules: false,
  chunkOrigins: false,
  depth: false,
  hash: false,
  entrypoints: false,
};

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
  // 必须的
  devServer.quiet = true;
  devServer.noInfo = true;
  (devServer as any).progress = true;
  const ipStr = devServer.host === '0.0.0.0' ? 'localhost' : ip.address();
  // 添加dev输出插件，让界面输出信息更友好
  const localhost = colors.blue(`  http${devServer.https ? 's' : ''}://${ipStr}:${devServer.port}`);
  const ipv4str = colors.blue(`  http${devServer.https ? 's' : ''}://${ip.address()}:${devServer.port}`);
  const messages = `程序运行在:\n\n${localhost}\n${ipv4str}`;

  config.plugins?.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [messages],
        notes: [`运行: ${colors.green('npm run build')} 构建应用\n`],
      },
    }),
  );

  webpackDevServer.addDevServerEntrypoints(config, devServer);
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, devServer);
  // 屏蔽console
  const c = Object.keys(console).map((f) => {
    const value = (console as any)[f];
    (console as any)[f] = () => {
      //
    };
    return { name: f, value };
  });
  server.listen(devServer.port, devServer.host, () => {
    // 运行成功后解除屏蔽
    c.forEach((item) => {
      (console as any)[item.name] = item.value;
    });
  });
}
async function build(config: webpack.Configuration) {
  webpack(config, async (err, s) => {
    if (err) {
      console.error(err);
      await temporary.delete();
      return;
    }

    console.log(s.toString(stats));
  });
}

export { stats };
export default App;
