import { Iconfig } from '../../typings';
import { Idata } from './type';
import { get$ } from './utils';
import _ from 'lodash';

const identification = '__replate__';
const envStr = `window.process = {env: ${identification}}`;

export default (data: Idata, config: Iconfig, isDev: boolean) => {
  if (_.isBoolean(config.env)) {
    if (config.env === false) {
      return;
    }
    config.env = {
      all: {
        NODE_ENV: isDev ? 'development' : 'production',
      },
      development: {},
      production: {},
    };
  }
  const $ = get$(data);
  const env = {
    ...config.env.all,
    ...(isDev ? config.env.development : config.env.production),
  };
  const v = `<script>${envStr.replace(identification, JSON.stringify(env))}</script>`.replace(/\n/g, '');
  $.root().find('head').append($(v));
  data.html = $.html();
};
