import cheerio from 'cheerio';

export type root = typeof cheerio;

export interface Idata {
  html: string;
  [k: string]: any;
}
