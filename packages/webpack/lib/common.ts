// // const path = require('path');
// // const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');

// // module.exports = {
// //   entry: {
// //     app: './src/index.js',
// //   },
// //   plugins: [
// //     // 对于 CleanWebpackPlugin 的 v2 versions 以下版本，使用 new CleanWebpackPlugin(['dist/*'])
// //     new CleanWebpackPlugin(),
// //     new HtmlWebpackPlugin({
// //       title: 'Production',
// //     }),
// //   ],
// //   output: {
// //     filename: '[name].bundle.js',
// //     path: path.resolve(__dirname, 'dist'),
// //   },
// // };

// // / 导入 webpack-chain 模块，该模块导出了一个用于创建一个webpack配置API的单一构造函数。

// // // 用链式API改变配置
// // // 每个API的调用都会跟踪对存储配置的更改。

// // config
// //   // 修改 entry 配置
// //   .entry('index')
// //     .add('src/index.js')
// //     .end()
// //   // 修改 output 配置
// //   .output
// //     .path('dist')
// //     .filename('[name].bundle.js');

// // // 创建一个具名规则，以后用来修改规则
// // config.module
// //   .rule('lint')
// //     .test(/\.js$/)
// //     .pre()
// //     .include
// //       .add('src')
// //       .end()
// //     // 还可以创建具名use (loaders)
// //     .use('eslint')
// //       .loader('eslint-loader')
// //       .options({
// //         rules: {
// //           semi: 'off'
// //         }
// //       });

// // config.module
// //   .rule('compile')
// //     .test(/\.js$/)
// //     .include
// //       .add('src')
// //       .add('test')
// //       .end()
// //     .use('babel')
// //       .loader('babel-loader')
// //       .options({
// //         presets: [
// //           ['@babel/preset-env', { modules: false }]
// //         ]
// //       });

// // // 也可以创建一个具名的插件!
// // config
// //   .plugin('clean')
// //     .use(CleanPlugin, [['dist'], { root: '/dir' }]);

// // // 导出这个修改完成的要被webpack使用的配置对象
// // module.exports = config.toConfig();

// webpack支持的省略后缀名
import Config from 'webpack-chain';

const config = new Config();

export default config;
export const suffix = ['.js', '.ts', '.json'];
