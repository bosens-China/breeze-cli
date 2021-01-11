import { compilation, Compiler } from 'webpack';
import { Iconfig } from '../../typings';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import cheerio from 'cheerio';
import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import { build } from '../../utils/build';
import UglifyJS from 'uglify-js';

import temporary from '../../utils/temporary';
import * as format from '../../utils/format';

import setEnv from './env';

const isCssFile = (file: string) => {
  return file.includes('__css_') && /\.js$/.test(file);
};
const isHotFile = (file: string) => {
  return file.includes('__hot_') && /\.js$/.test(file);
};

class Html {
  public config: Iconfig;
  public isDev: boolean;
  public jsMap: Map<string, string> = new Map();
  constructor(config: Iconfig, isDev: boolean) {
    this.config = config;
    this.isDev = isDev;
  }
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('MyPlugin', async (data, cb) => {
        // 稍微改写下，因为$没有暴露命空间
        const $ = cheerio.load(data.html, { decodeEntities: false }) as typeof cheerio;

        _.set(data, 'html', setEnv($, this.config, this.isDev));
        cb(null, data);
      });
    });
    if (!this.isDev) {
      // 添加entry的js文件，同时还需要添加到webpack的资源之中，删除多余的css文件
      compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('MyPlugin', async (data, cb) => {
          const { bodyTags, headTags, plugin } = data;
          const {
            config: { publicPath },
          } = this;
          const entryObj = _.get(plugin, 'options.__option.entry');
          const entry = _.values(entryObj).map((f) => `${publicPath}js/${path.basename(f)}`);
          entry.forEach((item) => {
            bodyTags.push({
              tagName: 'script',
              voidTag: false,
              attributes: {
                defer: false,
                src: item,
              },
            });
          });
          const addAll = _.keys(entryObj).map((f) => {
            const value = entryObj[f];
            return fs.readFile(value, 'utf-8').then((content) => {
              return build(content).then((code) => {
                const p = `js/${f}`;
                this.jsMap.set(p, code);
                compilation.assets[p] = {
                  source: () => {
                    return code;
                  },
                  // 返回文件大小
                  size: () => {
                    return code.length;
                  },
                };
              });
            });
          });
          await Promise.all(addAll);
          // 删除多余css文件和hot文件

          const deleteJs = (arr: Array<any>) => {
            for (let i = 0, leg = arr.length; i < leg; i++) {
              const src: string = _.get(arr[i], 'attributes.src', '');
              if (isCssFile(src) || isHotFile(src)) {
                arr.splice(i, 1);
                i -= 1;
              }
            }
          };
          deleteJs(headTags);
          deleteJs(bodyTags);
          cb(null, data);
        });
      });

      compiler.hooks.emit.tapAsync('emit-html', async (compilation, callback) => {
        const keys = _.keys(_.get(compilation, 'assets'));
        keys.forEach((item) => {
          if (isCssFile(item) || isHotFile(item)) {
            _.unset(compilation.assets, item);
          }
        });
        await this.minify(compilation);
        await this.format(compilation);
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

  // 压缩js代码
  minify(compilation: compilation.Compilation) {
    if (this.config.build.formatJs || !this.config.build.minifyjs) {
      return;
    }
    for (const [name, value] of this.jsMap) {
      const { code } = UglifyJS.minify(value);
      _.set(compilation.assets, name, {
        source: () => {
          return code;
        },
        // 返回文件大小
        size: () => {
          return code.length;
        },
      });
    }
  }
  // 格式化html、css、js代码
  format(compilation: compilation.Compilation) {
    const keys = _.keys(_.get(compilation, 'assets'));
    const { build } = this.config;
    if (build.formatJs) {
      for (const [name, value] of this.jsMap) {
        const code = this.formatJs(value);
        _.set(compilation.assets, name, {
          source: () => {
            return code;
          },
          // 返回文件大小
          size: () => {
            return code.length;
          },
        });
      }
    }
    const update = (arr: Array<string>, html: boolean) => {
      arr.forEach((item) => {
        const value = html
          ? this.formatHtml(compilation.assets[item].source())
          : this.formatCss(compilation.assets[item].source());
        _.set(compilation.assets, item, {
          source: () => {
            return value;
          },
          // 返回文件大小
          size: () => {
            return value.length;
          },
        });
      });
    };
    if (build.formatCss) {
      const arr = keys.filter((f) => /\.css$/.test(f));
      update(arr, false);
    }
    if (build.formatHtml) {
      const arr = keys.filter((f) => /\.html$/.test(f));
      update(arr, true);
    }
  }

  formatCss(code: string) {
    return format.css(code);
  }
  formatJs(code: string) {
    return format.js(code);
  }
  formatHtml(code: string) {
    return format.html(code);
  }
}

export default Html;
