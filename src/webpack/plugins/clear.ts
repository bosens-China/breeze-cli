/* eslint-disable class-methods-use-this */
import webpack from 'webpack';
import _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import temporary from '../../utils/temporary';

// 清除掉临时文件和css等信息

class Clear {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('clearTemporary', (compilation, callback) => {
      const { assets } = compilation;
      _.keys(assets).forEach((item) => {
        if (temporary.isTemporary(item)) {
          _.unset(assets, item);
        }
      });
      callback();
    });
    // html插件
    compiler.hooks.compilation.tap('clearChunks', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('clearChunks', (data, cb) => {
        data.assets.js.forEach((item, index) => {
          if (temporary.isTemporary(item)) {
            data.assets.js.splice(index, 1);
          }
        });
        cb(null, data);
      });
    });
  }
}

export default Clear;
