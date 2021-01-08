#!/usr/bin/env node

import build from '../build';
import { getAbsolutePath } from '../build/utils';
import { isFileExists } from '../utils/fs';
const name = process.argv[2];
const isDev = name === 'serve';

// 读取用户配置文件
const getConfigFile = async () => {
  const configPath = getAbsolutePath('breeze.config.js');
  if (await isFileExists(configPath)) {
    return import(configPath).then(({ default: obj }) => obj);
  }
};

async function App() {
  const config = await getConfigFile();
  await build(config, isDev);
}

App();
