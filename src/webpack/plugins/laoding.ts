/* eslint-disable class-methods-use-this */
import webpack from 'webpack';
// import ora from 'ora';
import colors from 'colors';
import { isPublicPath } from '../../utils/env';

class Loading {
  publicPath: boolean;

  // spinner: ora.Ora;

  constructor() {
    // 是否为开发环境
    this.publicPath = isPublicPath();
    // const spinner = ora('正在构建...');
    // this.spinner = spinner;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.environment.tap('Loading', () => {
      if (this.publicPath) {
        // this.spinner.start();
        return;
      }
      console.log(`${colors.bgBlue(' INFO ')} 服务器正在启动...`);
    });
    // compiler.hooks.failed.tap('LoadingStop', () => {
    //   if (!this.publicPath) {
    //     return;
    //   }
    //   this.spinner.stop();
    // });
    // compiler.hooks.done.tap('LoadingStop', () => {
    //   if (!this.publicPath) {
    //     return;
    //   }
    //   this.spinner.stop();
    // });
  }
}

export default Loading;
