// 处理内联的style和JavaScript的代码，对其polyfill
import { Idata } from './type';

import { get$ } from './utils';
import Core from './index';
import _ from 'lodash';

export default async (data: Idata, then: Core) => {
  const { config } = then;
  if (!config.rename) {
    return;
  }
  const $ = get$(data);
  const link = $('link[rel="stylesheet"]');
  const script = $('script[src]');
  const edition = String(new Date().valueOf()).substr(-6);
  link.each((_index, dom) => {
    const href = $(dom).attr('href');
    $(dom).attr('href', `${href}?edition=${edition}`);
  });
  script.each((_index, dom) => {
    const src = $(dom).attr('src');
    $(dom).attr('src', `${src}?edition=${edition}`);
  });
  _.set(data, 'html', $.root().html());
};
