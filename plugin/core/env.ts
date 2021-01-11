import { Iconfig } from '../../typings';

const identification = '__replate__';
const envStr = `window.process = {env: ${identification}}`;

import { Idata } from './type';
import { get$ } from './utils';

export default (data: Idata, config: Iconfig, isDev: boolean) => {
  const $ = get$(data);
  const env = {
    ...config.env.all,
    ...(isDev ? config.env.development : config.env.production),
  };
  const v = `<script>${envStr.replace(identification, JSON.stringify(env))}</script>`.replace(/\n/g, '');
  $.root().find('head').append($(v));
  data.html = $.html();
};
