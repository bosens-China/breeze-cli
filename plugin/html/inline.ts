// 处理内联的style和JavaScript的代码
import { Iconfig } from '../../typings';
import cheerio from 'cheerio';
type root = typeof cheerio;

export default ($: root, config: Iconfig, isDev: boolean) => {
  // 获取所有符合的style和js
  const styleAll = $('style[data-autoprefixer]');
  const jsAll = $('script[data-polyfill]');
  styleAll.each();
};
