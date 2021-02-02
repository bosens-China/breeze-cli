// config的配置文件
import Config from 'webpack-chain';

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
  filename: string;
  title: string;
  css: Array<string> | string;
  javascript: Array<string> | string | Array<Iscript>;
  options: Iobj;
}

export interface TtransformPages extends IpagesObj {
  css: Array<string>;
  javascript: Array<Iscript>;
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

export interface Iminimize {
  html: boolean;
  css: boolean;
  javascript: boolean;
}
export interface IformatOption {
  disable: boolean;
  options: Iobj;
}
export interface Iformat {
  html: IformatOption;
  css: IformatOption;
  javascript: IformatOption;
}

export interface Inunjucks {
  filters: Iobj;
  var: Iobj;
  view: string | Array<string>;
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
  configureWebpack: Function | Iobj;
  chainWebpack: (config: Config) => void;
  css: Icss;
  devServer: Iobj;
  parallel: boolean;
  image: Iimage;
  minimize: boolean | Iminimize;
  format: boolean | Iformat;
  nunjucks: Inunjucks;
  mode: 'tradition' | 'spa';
}

export interface ItrTransformConfig extends Iconfig {
  pages: Iobj<TtransformPages>;
  format: Iformat;
  minimize: Iminimize;
}
