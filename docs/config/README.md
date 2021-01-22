---
sidebar: auto
---

# 配置介绍

## 浏览器兼容

请查阅指南的浏览器兼容性章节

## breeze.config.js

`breeze.config.js`是一个可选的配置文件，有两种使用形式

- 返回一个对象

```js
module.exports = {};
```

- 返回一个函数

  函数会接收一个 `isDev` 的参数，表示是否为开发环境

```js
module.exports = (isDev) => {
  return {};
};
```

### publicPath

- Type：`string`
- Default：`isDev ? '/' : ''`

部署应用包时的基本 URL。

用法和 webpack 本身的 `output.publicPath` 一致，但是为了避免出现问题，请始终使用 `publicPath` 而不要直接修改 webpack 的 `output.publicPath`。

### outputDir

- Type: `string`
- Default: `'dist'`

当运行 `beeeze build` 时生成的生产环境构建文件的目录，注意目标目录在构建之前会被清除

::: tip
请始终使用 `outputDir` 而不要修改 webpack 的` output.path`。
:::

### rename

- Type: `boolean`
- Default: `false`

是否启用缓存命名，简而言之就是因为不提供`[hash]`的这种命名模式，在项目迭代可能会导致资源缓存，为了呈现最新的版本我们可以通过查询参数来改变，当你开启这个选项，假设输出资源初始为

```html
<script src="js/main.js"></script>
```

开启后

```html
<script src="js/main.js?edition=582929"></script>
```

`edition=582929`默认只截取当前时间的后六位，只对`link`标签和`script[src]`标签生效

### pages

- Type: `string`
- Default:

```js
module.exports = {
  pages: {
    index: {
      entry: ['src/main'],
      entryView: 'src/App.njk',
      entryHot: 'src/hot',
      entryCss: ['src/assets/css/style.scss'],
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
};
```

用于配置 breeze 的入口信息，除了`entry`、`entryCss`其他选项是必填的

#### entry

type：`Array<string> | string`

入口文件的信息，可以省略 js 或者 ts 的后缀，不过为了性能请始终填写完整后缀

#### entryView

type：`string`

`view`入口文件，注意不可省略

#### entryHot

type：`string`

热重载文件文件，开发环境下会通过此文件来完成热重载，生产环境下会被清除，如果你想修改请参考模板文件的写法

#### entryCss

type：`Array<string> | string`

配置 css 文件的路径，注意不可以通过`import`来引用 css，而是始终使用此配置项来引用 css

#### template

type：`string`

入口模板文件

#### filename

type：`string`

输出模板文件的名称

#### options

type: `object`

详细内容请参考[html-webpack-plugin]选项(https://github.com/jantimon/html-webpack-plugin)

### css

- Type: `Object`
- Default: `{}`

用于配置 css 相关 loader 的信息，例如

```js
module.exports = {
  css: {
    css: {
      // 这里的选项会传递给 css-loader
    },
    postcss: {
      // 这里的选项会传递给 postcss-loader
    },
  },
};
```

支持的 loader 有：

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [scss-loader](https://github.com/webpack-contrib/sass-loader)

### devServer

- Type: `Object`

  所有 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 的选项都支持。

### env

- Type: `Object | boolean`
- Default: `false`

环境变量，如果为`false`则不启用，在开发或者生产环境下，可以通过环境变量进行条件的切换，例如常见的接口请求在开发环境下会通过`proxy`代理，而在生产环境下不存在跨域所以可以直接配置服务器地址。

如果为`true`，则默认为

```js
module.exports = {
  env: {
    // 生产和开发环境下都会存在
    all: {
      NODE_ENV: isDev ? 'development' : 'production',
    },
    // 只有生产环境生效
    development: {},
    // 只有开发环境生效
    production: {},
  },
};
```

### var

- Type: `Object`
- Default:

```js
module.exports = {
  var: {
    BASE_URL: isDev ? '/' : '',
  },
};
```

变量信息，会在`Nunjuck`模板中和入口模板文件(`index.html`)中使用

### build

- Type: `Object`
- Default:

```js
module.exports = {
  build: {
    // 最小化css
    minifyCss: false,
    // 最小化图片
    minifyImg: false,
    // 最小化html
    minifyHtml: false,
    // 最小化js
    minifyjs: false,
    // 格式化js
    formatJs: true,
    // 格式化css
    formatCss: false,
    // 格式化html
    formatHtml: true,
    // 格式化选项
    formatOptions: {},
  },
};
```

定义构建项目的一些额外配置，你可以通过这些选项，选择构建项目的不同风格，**只有在生产环境下才会使用**。

::: tip
最小化必须在`format`为`false`的情况才会生效
:::

### configureWebpack

- Type: `Object | Function`

如果这个值是一个对象，则会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并到最终的配置中。

如果这个值是一个函数，则会接收被解析的配置作为参数。可以通过修改实例来完成添加修改 webpack 配置

### lintOnSave

- Type: `boolean`
- Default: `true`

开发环境下是否开启`eslint`校验。

默认情况下只有警告情况下会在浏览器显示错误，你可以通过此选项，让警告也展示出来

```js
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
```

### assets.inlineLimit

- Type: `number`
- Default: `3072`

该选项会被[url-loader](https://github.com/webpack-contrib/url-loader)所采用，当资源小于 inlineLimit 的值时，会被转化为 base64 的形式，设置为 false 时禁用
