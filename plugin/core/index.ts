import { Compiler } from 'webpack';
import { Iconfig } from '../../typings';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import temporary from '../../utils/temporary';

import setEnv from './env';
import setEntry from './entry';
import deleteAssets from './delete.assets';
import minifyJs from './minify';
import format from './format';
import inline from './inline';

class Core {
  public config: Iconfig;
  public isDev: boolean;
  public jsMap: Map<string, string> = new Map();
  public extensions: Array<string> = [];
  // 接收参数
  constructor(config: Iconfig, isDev: boolean) {
    this.config = config;
    this.isDev = isDev;
  }
  // 暴露插件的入口
  apply(compiler: Compiler) {
    // 把文件后缀添加进来，等待验证时候使用
    const extensions = compiler.options.resolve?.extensions || [];
    this.extensions = extensions;
    compiler.hooks.compilation.tap('core-compilation', (compilation) => {
      // debugger;
      // html插件，在emit之前触发，当前有chunk块的js资源
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'core-alterAssetTagGroups',
        async (data, cb) => {
          /*
          生产环境下处理入口资源，添加入口资源，polyfill处理、删除hot文件和css文件
          还有将this.jsMap跟入口文件绑定，用于后续的压缩和格式化
          */
          try {
            await setEntry(compilation, data, this);
          } catch (e) {
            compilation.errors.push(e);
          }
          cb(null, data);
        },
      );
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('core-beforeEmit', async (data, cb) => {
        try {
          // 添加环境变量
          await setEnv(data, this.config, this.isDev);
          await inline(data);
        } catch (e) {
          compilation.errors.push(e);
        }
        cb(null, data);
      });
    });

    compiler.hooks.emit.tapAsync('emit-html', async (compilation, callback) => {
      try {
        // 删除hot和css这样的文件
        await deleteAssets(compilation, this.isDev);
        // 压缩js代码，css和图片之类的已经在webpack中配置了
        await minifyJs(compilation, this);
        // 格式化css、js和html文件
        await format(compilation, this);
      } catch (e) {
        compilation.errors.push(e);
      }
      callback();
    });
    compiler.hooks.done.tap('done-html', async () => {
      await temporary.delete();
    });
    compiler.hooks.failed.tap('failed-html', async () => {
      await temporary.delete();
    });
  }
}

export default Core;
