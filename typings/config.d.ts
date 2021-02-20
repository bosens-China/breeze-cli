// config配置文件

export interface Iobj<T = any> {
  [k: string]: T;
}
export interface IpagesValue {
  entry: string | Array<string>;
  entryView: string;
  entryStyle: string | Array<string>;
  template: string;
  filename: string;
  render: string;
  options: Iobj;
}

export interface Ipages {
  autoImport: boolean;
  [k: string]: boolean | string | Iobj<IpagesValue>;
}

export interface Icss extends Iobj {
  sourceMap: boolean;
  less: Iobj;
  scss: Iobj;
  css: Iobj;
  postcss: Iobj;
}

export interface Inunjucks {
  view?: string | Array<string>;
  varAll?: Iobj;
  filterAll?: Iobj<Function>;
}

export interface Iimage {
  // base64
  limit: boolean | number;
  minimum: boolean;
}

export interface Iconfig {
  publicPath: string;
  outputDir: string;
  assetsDir: string;
  indexPath: string;
  filenameHashing: boolean;
  pages: Ipages;
  lintOnSave: boolean;
  productionSourceMap: boolean;
  configureWebpack: Iobj | Function;
  chainWebpack: Function;
  css: Partial<Icss>;
  devServer: Iobj;
  parallel: boolean;
  // 别名
  alias: Iobj<string>;
  // 环境变量
  env: Iobj;
  mode: 'default' | 'jsp';
  nunjucks: Inunjucks;
  image: Iimage;
}
export type PartialConfig = Partial<Iconfig>;

export interface TransformationConfigPagesValue extends IpagesValue {
  entry: Array<string>;
  entryStyle: Array<string>;
}

export interface TransformationConfig extends Iconfig {
  pages: Iobj<TransformationConfigPagesValue>;
  nunjucks: Required<Inunjucks>;
}
