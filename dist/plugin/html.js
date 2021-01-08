"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const cheerio_1 = __importDefault(require("cheerio"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const build_1 = require("../utils/build");
const uglify_js_1 = __importDefault(require("uglify-js"));
const temporary_1 = __importDefault(require("../utils/temporary"));
const format = __importStar(require("../utils/format"));
const identification = '__replate__';
const envStr = `window.process = {env: ${identification}}`;
const isCssFile = (file) => {
    return file.includes('__css_') && /\.js$/.test(file);
};
const isHotFile = (file) => {
    return file.includes('__hot_') && /\.js$/.test(file);
};
class Html {
    constructor(config, isDev) {
        this.jsMap = new Map();
        this.config = config;
        this.isDev = isDev;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            html_webpack_plugin_1.default.getHooks(compilation).beforeEmit.tapAsync('MyPlugin', async (data, cb) => {
                const env = {
                    ...this.config.env.all,
                    ...(this.isDev ? this.config.env.development : this.config.env.production),
                };
                const $ = cheerio_1.default.load(data.html, { decodeEntities: false });
                const v = `<script>${envStr.replace(identification, JSON.stringify(env))}</script>`.replace(/\n/g, '');
                $.root().find('head').append($(v));
                lodash_1.default.set(data, 'html', $.html());
                cb(null, data);
            });
        });
        if (!this.isDev) {
            // 添加entry的js文件，同时还需要添加到webpack的资源之中，删除多余的css文件
            compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
                html_webpack_plugin_1.default.getHooks(compilation).alterAssetTagGroups.tapAsync('MyPlugin', async (data, cb) => {
                    const { bodyTags, headTags, plugin } = data;
                    const { config: { publicPath }, } = this;
                    const entryObj = lodash_1.default.get(plugin, 'options.__option.entry');
                    const entry = lodash_1.default.values(entryObj).map((f) => `${publicPath}js/${path_1.default.basename(f)}`);
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
                    const addAll = lodash_1.default.keys(entryObj).map((f) => {
                        const value = entryObj[f];
                        return fs_extra_1.default.readFile(value, 'utf-8').then((content) => {
                            return build_1.build(content).then((code) => {
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
                    const deleteJs = (arr) => {
                        for (let i = 0, leg = arr.length; i < leg; i++) {
                            const src = lodash_1.default.get(arr[i], 'attributes.src', '');
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
            compiler.plugin('emit', async (compilation, callback) => {
                const keys = lodash_1.default.keys(lodash_1.default.get(compilation, 'assets'));
                keys.forEach((item) => {
                    if (isCssFile(item) || isHotFile(item)) {
                        lodash_1.default.unset(compilation.assets, item);
                    }
                });
                await this.minify(compilation);
                await this.format(compilation);
                callback();
            });
            // 完成和失败的情况下，都要删除生成的临时html文件
            compiler.plugin('done', async () => {
                await temporary_1.default.delete();
            });
            compiler.plugin('failed', async () => {
                await temporary_1.default.delete();
            });
        }
    }
    // 压缩js代码
    minify(compilation) {
        if (this.config.build.formatJs || !this.config.build.minifyjs) {
            return;
        }
        for (const [name, value] of this.jsMap) {
            const { code } = uglify_js_1.default.minify(value);
            lodash_1.default.set(compilation.assets, name, {
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
    format(compilation) {
        const keys = lodash_1.default.keys(lodash_1.default.get(compilation, 'assets'));
        const { build } = this.config;
        if (build.formatJs) {
            for (const [name, value] of this.jsMap) {
                const code = this.formatJs(value);
                lodash_1.default.set(compilation.assets, name, {
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
        const update = (arr, html) => {
            arr.forEach((item) => {
                const value = html
                    ? this.formatHtml(compilation.assets[item].source())
                    : this.formatCss(compilation.assets[item].source());
                lodash_1.default.set(compilation.assets, item, {
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
    formatCss(code) {
        return format.css(code);
    }
    formatJs(code) {
        return format.js(code);
    }
    formatHtml(code) {
        return format.html(code);
    }
}
exports.default = Html;
//# sourceMappingURL=html.js.map