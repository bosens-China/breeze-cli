/*
  初始化项目的信息，删除多余文件，初始化git信息
*/

import fs from 'fs-extra';
import path from 'path';
import shelljs from 'shelljs';
import { yarnIsExistence } from './utils';
import _ from 'lodash';
import { IresultAll } from './type';

interface Iinitpar {
  dir: string;
  resultAll: IresultAll;
  name: string;
}

export default async (args: Iinitpar) => {
  const { dir, resultAll, name } = args;
  const arr: Array<Promise<any>> = [];
  arr.push(fs.remove(path.join(dir, resultAll.type === 'js模板' ? 'tsconfig.json' : 'jsconfig.json')));
  arr.push(
    fs.readJson(path.join(dir, './package.json')).then((jsonFile) => {
      return fs.writeJson(path.join(dir, './package.json'), { ...jsonFile, name }, { spaces: 2 });
    }),
  );
  arr.push(fs.remove(path.join(dir, yarnIsExistence() ? 'package-lock.json' : 'yarn.lock')));
  await Promise.all(arr);
  shelljs.cd(name);
  // 柯力化
  const silence = _.partial(shelljs.exec, _ as any, { silent: true } as any);
  silence('git init');
  silence('git add .');
  silence('git commit -m "init"');
  // shelljs.exec('git init', { silent: false });
  // shelljs.exec('git add .', { silent: false });
  // shelljs.exec('git commit -m "init"', { silent: false });
};
