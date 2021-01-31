// config的配置文件

export interface Iobj<T = any> {
  [k: string]: T;
}
export interface Iscript {
  src: string;
  mode: 'all' | 'production' | 'development';
}

export interface IpagesObj {
  template: string;
  view: string;
  render: string;
  filename?: string;
  title?: string;
  css?: Array<string> | string;
  javascript?: Array<string> | string | Array<Iscript>;
  options?: Iobj;
}

export type Ipages = string | IpagesObj;

export interface Icss {
  extract: boolean;
  sourceMap: boolean;
  loaderOptions: {
    css: Iobj;
    postcss: Iobj;
    less: Iobj;
    scss: Iobj;
  };
}
export interface Iimage {
  limit: number | boolean;
  minimize: boolean;
}
export type Iminimize =
  | boolean
  | {
      html: boolean;
      css: boolean;
      javascript: boolean;
    };

export interface Iformat {
  html: {
    disable: boolean;
    options: Iobj;
  };
  css: {
    disable: boolean;
    options: Iobj;
  };
  javascript: {
    disable: boolean;
    options: Iobj;
  };
}

export interface Inunjucks {
  filters: Iobj;
  var: Iobj;
}

export interface Iconfig {
  publicPath: string;
  outputDir: string;
  assetsDir: string;
  indexPath: string;
  filenameHashing: boolean;
  pages: Iobj<Ipages>;
  lintOnSave: boolean | 'warning' | 'default' | 'error';
  transpileDependencies: Array<string | RegExp>;
  productionSourceMap: boolean;
  configureWebpack?: Function | Iobj;
  chainWebpack?: Function;
  css: Icss;
  devServer: Iobj;
  parallel: boolean;
  image: Iimage;
  minimize: Iminimize;
  format: Iformat;
  nunjucks: {
    filters: {};
    var: {};
  };
  mode: 'tradition' | 'spa';
}
