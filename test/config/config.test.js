import { merge } from '../../config/default.config';

test('测试config合并', () => {
  const c = {
    var: {
      MODE: 'dev',
    },
    pages: {
      app: {},
    },
  };
  const config = merge(c, true);
  expect(config.var).toEqual({
    BASE_URL: '/',
    MODE: 'dev',
  });
  expect(config.pages).toEqual({ app: {} });
});
