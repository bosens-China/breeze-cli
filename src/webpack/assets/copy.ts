// 处理静态资源部分，Public文件夹除了pages相关的文件，其他文件全部默认都复制
import Config from 'webpack-chain';
import CopyPlugin from 'copy-webpack-plugin';
import { TransformationConfig } from '../../../typings/config';
import { getAbsolutePath, getLinuxPath } from '../../utils/fs';
import { isPublicPath } from '../../utils/env';

export default (c: Config, config: TransformationConfig) => {
  // 复制静态资源
  const publicDir = getAbsolutePath('public');
  const outputDir = isPublicPath() ? getAbsolutePath(config.outputDir) : '';
  const entry = Object.values(config.pages).map((f) => getAbsolutePath(f.template));

  c.plugin('copy').use(CopyPlugin, [
    {
      patterns: [
        {
          from: publicDir,
          to: outputDir,
          toType: 'dir',
          // 过滤所有的入口html文件
          filter: (file: string) => !entry.find((f) => getLinuxPath(f) === getLinuxPath(file)),
        },
      ],
    },
  ]);
};
