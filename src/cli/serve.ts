import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import portfinder from 'portfinder';
import webpackConfig from '../webpack';
import getConfig from './getConfig';

export default async () => {
  const userConfig = await getConfig();
  const config = await webpackConfig(userConfig, true);
  const devServer: Required<WebpackDevServer.Configuration> = {
    ...(config as any).devServer,
    ...userConfig.devServer,
    quiet: false,
  };
  // 如果不存在就从8080开始取端口
  if (!devServer.port) {
    devServer.port = await portfinder.getPortPromise({
      port: 8080,
    });
  }
  WebpackDevServer.addDevServerEntrypoints(config, devServer);
  const compiler = webpack(config);

  const server = new WebpackDevServer(compiler, devServer);
  server.listen(devServer.port, devServer.host, () => {});
};
