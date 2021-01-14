# 快速上手

下面使用`npm`作为模块安装工具，使用`yarn`也是完全没问题的

## 安装

```sh
npm i -g @boses/breeze-cli
```

## CLI服务

### 创建项目

```sh
breeze created [name]
```

`[name]`应当符合`package.json`name 的命名规则，具体来说就是符合下面正则`^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$`

### 启动服务

```sh
npm run serve
```

### 构建项目

```sh
npm run build
```

### 审查 webpack 配置

```sh
inspect [modu]
```

`modu`默认为`development`，可用的选项为

- production
- development
