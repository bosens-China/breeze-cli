# HTML 和静态资源

## HTML

### Index 文件

`public/index.html` 文件是一个会被 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 处理的模板。在构建过程中，资源链接会被自动注入。

## 插值

因为 index 文件被用作模板，所以你可以使用 [lodash template](https://lodash.com/docs/4.17.10#template) 语法插入内容：

- <%= VALUE %> 用来做不转义插值；
- <%- VALUE %> 用来做 HTML 转义插值；
- <% expression %> 用来描述 JavaScript 流程控制。

所有定义配置文件`var`的变量都可以使用

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico" />
```

更多内容可以查阅:

- [var](/config/#var)

## Nunjucks

`App.njk`的文件会使用 Nunjucks 语法，变量文件跟插值共用`var`

更多内容可以查阅:

- [var](/config/#var)
- [Nunjucks](https://nunjucks.bootcss.com/templating.html)

## 构建多页面

构建多页面只需要在[pages](/config/#pages)添加多个对象即可

::: danger
需要特别注意不要重名，因为生产环境下并不会使用`[hash]`来作为生成文件的标识
:::

## 处理静态资源

放置在 `public` 目录下的这类资源将会直接被拷贝，而不会经过 `webpack` 的处理

不过`public`文件夹存放资源并不推荐，因为使用`webpack`构建会使资源文件的排列更加规则而且还可以对资源进行特定的处理

### 何时使用 public 文件夹

- 你需要在构建输出中指定一个文件的名字。
- 你有上千个图片，需要动态引用它们的路径。
- 有些库可能和 webpack 不兼容，这时你除了将其用一个独立的 `<script>` 标签引入没有别的选择。
