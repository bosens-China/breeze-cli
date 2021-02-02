import mergeConfig from '../../config/mergeConfig';
import getConfig, { transformationPublic } from '../../config/getConfig';
import { getAbsolutePath } from '../../utils/base';
import config from '../../config';

test('测试config合并', () => {
  const value = mergeConfig({});
  expect(value).not.toEqual({});
  expect(mergeConfig({ pages: 123 }).pages).toBe(123);
  expect(mergeConfig({ Iminimize: 123 }).Iminimize).toBe(123);
});

describe('getconfig测试', () => {
  test('字符串测试', () => {
    const value = mergeConfig({ pages: { index: 'c:\\test\\public\\test.html' }, format: false, minimize: false });
    const obj = getConfig(value);
    expect(obj.pages.index).toEqual({
      template: 'c:/test/public/test.html',
      view: 'c:/test/src/test/App.njk',
      render: '#app',
      filename: 'test.html',
      title: 'hello breeze',
      css: ['c:/test/src/assets/test/css/style'],
      javascript: [
        { src: 'c:/test/src/test/main', mode: 'all' },
        { src: 'c:/test/src/test/hot', mode: 'development' },
      ],
      options: {},
    });
    expect(obj.format).toEqual({
      html: { disable: false, options: {} },
      css: { disable: false, options: {} },
      javascript: { disable: false, options: {} },
    });
    expect(obj.minimize).toEqual({
      html: false,
      css: false,
      javascript: false,
    });
  });
  test('object测试', () => {
    const value = mergeConfig({
      pages: {
        test: {
          template: 'c:\\test\\public\\test.html',
          css: 'c:\\test\\src\\assets\\test\\css/style',
          javascript: [],
          view: 'c:\\test\\src/test\\App.njk',
        },
      },
    });
    expect(getConfig(value).pages).toEqual({
      test: {
        template: 'c:/test/public/test.html',
        view: 'c:/test/src/test/App.njk',
        render: '#app',
        filename: 'index.html',
        title: 'hello breeze',
        css: ['c:/test/src/assets/test/css/style'],
        javascript: [],
        options: {},
      },
    });
  });
});

test('transformationPublic', () => {
  const name = 'test';
  const file = `public\\${name}.html`;
  expect(transformationPublic(file)).toEqual({
    template: getAbsolutePath(file),
    view: getAbsolutePath(`src/${name}/App.njk`),
    filename: `${name}.html`,
    css: [getAbsolutePath(`src/assets/${name}/css/style`)],
    javascript: [
      { src: getAbsolutePath(`src/${name}/main`), mode: 'all' },
      { src: getAbsolutePath(`src/${name}/hot`), mode: 'development' },
    ],
  });
});

test('config index测试', async () => {
  await expect(config()).resolves.not.toBeUndefined();
});
