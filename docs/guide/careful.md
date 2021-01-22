# Q&A

## 尽量不要修改 wbpack 配置

默认情况下对 `webpack` 的入口和资源进行了一些定制，如果直接使用可能会出现问题，更好的做法是修改配置文件暴露的一些选项

- [配置介绍](/config/)

## 查询不到构建信息

```js
// breeze.config.js
module.exports = {
  configureWebpack: {
    stats: 'verbose',
  },
};
```

可以修改[stats](https://webpack.docschina.org/configuration/stats/)对象，将所有输出都打开，最后对比输出信息是否有报错，这个是排查 webpack 配置的一个简单方法

## 入口文件不要包含 import 等导入语法

开发环境会通过 webpack 的依赖收集资源可以正常加载，但是生产环境下会使用 typescript 的编译所以不会处理这些资源

## 多页面如何访问

默认访问`index.html`的文件不需要显示添加`index.html`；
例如服务在`http://localhost:8080/`启动，完整的路径应该是`http://localhost:8080/index.html`，但是因为`index.html`所以直接`http://localhost:8080/`也是可以访问的，但是如果存在多页面
，你应该根据`breeze.config.js`下的`pages`的`filename`属性来进行访问，例如：

breeze.config.js

```js
module.exports = {
  pages: {
    App: {
      entry: ['src/app'],
      entryView: 'src/app.njk',
      entryHot: 'src/hot-app',
      template: 'public/app.html',
      filename: 'app.html',
    },
  },
};
```

访问的路径就是`http://localhost:8080/app.html`
