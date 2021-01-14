import prettier from 'prettier';

export const js = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...options, parser: 'babel' });
  return code;
};
export const css = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...options, parser: 'css' });
  return code;
};
export const html = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...options, parser: 'html' });
  return code;
};
