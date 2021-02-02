import webpackConfig from '../webpack';

// 监听可能出现的错误事件，当发生的时候，直接清除生成的临时目录
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`, 'unhandledRejection'].forEach(() => {
  webpackConfig.removeSync();
});
