import loaderUtils from 'loader-utils';
import render from '../../utils/render';

export default function njkLoader(this: any, content: string) {
  const options = loaderUtils.getOptions(this) as any;
  try {
    const code = render({
      ...options,
      html: content,
    });
    return code;
  } catch (err) {
    return this.callback(
      // 当无法转换原内容时，给 Webpack 返回一个 Error
      err,
      content
    );
  }
}
