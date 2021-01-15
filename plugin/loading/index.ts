import { Compiler } from 'webpack';
import ora from 'ora';

class Loading {
  // 暴露插件的入口
  spinner!: ora.Ora;
  apply(compiler: Compiler) {
    compiler.hooks.environment.tap('loading-environment', async () => {
      const spinner = ora('正在编译中，请稍后...').start();
      this.spinner = spinner;
    });
    compiler.hooks.done.tap('done-html', async () => {
      this.spinner.stop();
    });
    compiler.hooks.failed.tap('failed-html', async () => {
      this.spinner.stop();
    });
  }
}

export default Loading;
