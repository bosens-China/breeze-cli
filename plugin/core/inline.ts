// 处理内联的style和JavaScript的代码，对其polyfill
import { Idata } from './type';
import autoprefixer from 'autoprefixer';
import { get$, minifyCss, minifyJs } from './utils';
import postcss from 'postcss';
import _ from 'lodash';
import { build } from '../../utils/build';

const fixer = (css: string) => {
  return postcss([autoprefixer])
    .process(css, { from: 'src/app.css', to: 'dest/app.css' })
    .then((result) => {
      return result.css;
    });
};
export default async (data: Idata) => {
  const $ = get$(data);
  const all: Array<Promise<any>> = [];
  $('style[data-autoprefixer]').each((_index, element) => {
    const value = $(element).html() || '';
    const attr = $(element).attr('minify');
    all.push(
      fixer(value).then((code) => {
        if (attr) {
          return minifyCss(code).then((c) => {
            $(element).html(c);
          });
        }
        $(element).html(code);
        return;
      }),
    );
  });
  // 处理ts和转义内联元素
  const jsAll = $('script[data-polyfill]');
  jsAll
    .filter(function f(this: Element) {
      return !$(this).attr('src');
    })
    .each((_index, el) => {
      const code = $(el).html() || '';
      const attr = $(el).attr('minify');
      all.push(
        build(code).then((c) => {
          if (attr) {
            c = minifyJs(code);
          }
          $(el).html(c);
        }),
      );
    });
  await Promise.all(all);
  _.set(data, 'html', $.root().html());
};
