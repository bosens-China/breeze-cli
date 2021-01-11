import { Iconfig } from '../../typings';
import cheerio from 'cheerio';

const identification = '__replate__';
const envStr = `window.process = {env: ${identification}}`;

type root = typeof cheerio;

export default ($: root, config: Iconfig, isDev: boolean) => {
  const env = {
    ...config.env.all,
    ...(isDev ? config.env.development : config.env.production),
  };
  const v = `<script>${envStr.replace(identification, JSON.stringify(env))}</script>`.replace(/\n/g, '');
  $.root().find('head').append($(v));
};
