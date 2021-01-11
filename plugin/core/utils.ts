import * as format from '../../utils/format';
import cheerio from 'cheerio';
import { root, Idata } from './type';
import UglifyJS from 'uglify-js';
import postcss from 'postcss';
import cssnano from 'cssnano';

export const isCssFile = (file: string) => {
  return file.includes('__css_') && /\.js$/.test(file);
};
export const isHotFile = (file: string) => {
  return file.includes('__hot_') && /\.js$/.test(file);
};
export const formatCss = (code: string) => {
  return format.css(code);
};
export const formatJs = (code: string) => {
  return format.js(code);
};
export const formatHtml = (code: string) => {
  return format.html(code);
};

const catchMap: WeakMap<Idata, root> = new WeakMap();

export const get$ = (data: Idata): root => {
  if (!catchMap.has(data)) {
    const j = cheerio.load(data?.html, { decodeEntities: false });
    catchMap.set(data, j as any);
  }

  return catchMap.get(data) as root;
};

export const minifyJs = (value: string) => {
  const { code } = UglifyJS.minify(value);
  return code;
};

export const minifyCss = (css: string) => {
  const plugins = [
    cssnano({
      preset: ['default', { discardComments: { removeAll: true } }],
    }),
  ];
  return postcss(plugins as any)
    .process(css, { from: 'src/app.css', to: 'dest/app.css' })
    .then((result) => {
      return result.css;
    });
};
