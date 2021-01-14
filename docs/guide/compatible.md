# 浏览器兼容性

## browserslist

你会发现有 `package.json` 文件里的 browserslist 字段 (或一个单独的 .browserslistrc 文件)，指定了项目的目标浏览器的范围。这个值会被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer) 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

现在查阅[这里](https://github.com/ai/browserslist)了解如何指定浏览器范围

::: tip
注意，只有开发环境下会使用`babel`，生产环境下使用的是`typescript`内置编译器，会将代码转化为`ES3`的环境下，所以说`browserslist`完整作用的只有 Autoprefixer，只有在开发环境下两个才会都作用
:::

## Polyfill

默认情况下`babel.config.js`只添加了`@babel/plugin-proposal-class-properties`插件，如果在使用`ts`的时候遇到提示的错误，那么你可能需要新增一些插件来完成这个转换。

而上面说了开发环境下使用的是`typescript`的编译器完成的转换，那么有一些`api`是无法完成转换的，因为默认情况下只转换语法，例如

```js
const a = null;
console.log(a ?? '1');
```

这个`??`是新增的语法就可以完成转换，而如果是`Array,from`就不会转换，具体列表可以查阅[列表](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/runtime-corejs3-definitions.js)。
