import prettier from 'prettier';

export const js = (content: string) => {
  const code = prettier.format(content, { parser: 'babel' });
  return code;
};
export const css = (content: string) => {
  const code = prettier.format(content, { parser: 'css' });
  return code;
};
export const html = (content: string) => {
  const code = prettier.format(content, { parser: 'html' });
  return code;
};
