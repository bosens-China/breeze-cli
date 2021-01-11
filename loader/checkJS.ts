// 生产环境下校验
import loaderUtils from 'loader-utils';
import { Iconfig } from '../typings';
import _ from 'lodash';
import { getAbsolutePath } from '../build/utils';
import { pathIsSame } from '../utils/fs';
import colors from 'colors';

export default async function checkJS(this: any, content: string) {
  const options = (loaderUtils.getOptions(this) as unknown) as Iconfig;
  const { resourcePath } = this;
  const keys = _.values(options.pages)
    .map((f) => f.entry)
    .flat(2)
    .map((f) => getAbsolutePath(f));
  if (!keys.find((f) => pathIsSame(f, resourcePath))) {
    return content;
  }

  if (/import|require|module|module\.exports|export/.exec(content)) {
    const error = new Error(
      `${colors.yellow(resourcePath)} 文件内包含错误语法，入口文件禁止包含${colors.red(
        ' import|require|module|module.exports|export ',
      )}关键词`,
    );
    this.emitError(error);
  }

  return content;
}
