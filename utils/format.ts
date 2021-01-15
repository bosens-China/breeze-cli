import prettier from 'prettier';

const defaultConfig: prettier.Options = {
  printWidth: 120,
  semi: true,
  trailingComma: 'none',
};

export const js = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...defaultConfig, ...options, parser: 'babel' });
  return code;
};
export const css = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...defaultConfig, ...options, parser: 'css' });
  return code;
};
export const html = (content: string, options?: prettier.Options) => {
  const code = prettier.format(content, { ...defaultConfig, ...options, parser: 'html' });
  return code;
};
