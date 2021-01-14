import cheerio from 'cheerio';
import { root, Idata } from './type';
import UglifyJS from 'uglify-js';
import postcss from 'postcss';
import cssnano from 'cssnano';
import path from 'path';
import { isFileExists } from '../../utils/fs';
export { js as formatJs, css as formatCss, html as formatHtml } from '../../utils/format';

export const isCssFile = (file: string) => {
  return file.includes('__css_');
};
export const isHotFile = (file: string) => {
  return file.includes('__hot_');
};

// import * as format from '../../utils/format';
// export const formatCss = (code: string) => {
//   return format.css(code);
// };
// export const formatJs = (code: string) => {
//   return format.js(code);
// };
// export const formatHtml = (code: string) => {
//   return format.html(code);
// };

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

// 确认文件是否存在，通过对比后缀来判断
export const getCompleteDocument = async (file: string, arr: Array<string>) => {
  const name = path.basename(file);
  if (name.includes('.')) {
    return file;
  }
  for (const item of arr) {
    const suffix = item.startsWith('.') ? item : `.${item}`;
    const p = file + suffix;
    const result = await isFileExists(p);
    if (result === true) {
      return p;
    }
  }
  throw new Error(`${file}文件不存在`);
};
