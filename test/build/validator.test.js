import check from '../../build/validator';

test('check规则验证', async () => {
  await expect(check()).resolves.toBeUndefined();
  await expect(check({})).resolves.toBeUndefined();
  await expect(check({ publicPath: 1 })).rejects.toThrow();
  await expect(check({ outputDir: 1 })).rejects.toThrow();
  await expect(check({ rename: 1 })).rejects.toThrow();
  await expect(check({ pages: 1 })).rejects.toThrow();
  await expect(check({ css: 1 })).rejects.toThrow();
  await expect(check({ devServer: 1 })).rejects.toThrow();
  await expect(check({ env: 1 })).rejects.toThrow();
  await expect(check({ var: 1 })).rejects.toThrow();
  await expect(check({ build: 1 })).rejects.toThrow();
  await expect(check({ configureWebpack: 1 })).rejects.toThrow();
  await expect(check({ lintOnSave: 1 })).rejects.toThrow();
  await expect(check({ assets: 1 })).rejects.toThrow();
  await expect(check({ pages: { index: {} } })).rejects.toThrow();
  await expect(check({ pages: { index: { entryView: 1 } } })).rejects.toThrow();
  await expect(check({ pages: { index: { entryView: 1, entry: 1 } } })).rejects.toThrow();
  await expect(check({ pages: { index: { entryView: 1, entry: 1, entryCss: 1 } } })).rejects.toThrow();
  await expect(check({ pages: { index: { entryView: 1, entry: 1, entryCss: 1, entryHot: 1 } } })).rejects.toThrow();
  await expect(
    check({ pages: { index: { entryView: 1, entry: 1, entryCss: 1, entryHot: 1, template: 1 } } }),
  ).rejects.toThrow();
  await expect(
    check({
      pages: { index: { entryView: '1', entry: '1', entryCss: '1', entryHot: '1', template: '1', filename: '1' } },
    }),
  ).resolves.toBeUndefined();
});
