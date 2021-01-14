import webpack from 'webpack';

export interface Iobj<T = any> {
  [k: string]: T;
}
export interface Ipages {
  [k: string]: {
    entry: string | Array<string>;
    entryHot: string;
    entryCss: string | Array<string>;
    template: string;
    filename: string;
    entryView: string;
  };
}

export interface Ienv {
  all: Iobj;
  production: Iobj;
  development: Iobj;
}

export interface Ibuild {
  minifyCss: boolean;
  minifyImg: boolean;
  minifyjs: boolean;
  minifyHtml: boolean;
  formatJs: boolean;
  formatCss: boolean;
  formatHtml: boolean;
  formatOptions?: Iobj;
}

export interface Iassets {
  inlineLimit: number | boolean;
}
export interface Iconfig {
  publicPath: string;
  outputDir: string;
  rename: boolean;
  pages: Ipages;
  css: Iobj;
  devServer: Iobj;
  env: Ienv;
  var: Iobj;
  build: Ibuild;
  configureWebpack: Iobj | ((config: webpack.Configuration) => void);
  lintOnSave: boolean;
  assets: Iassets;
}
