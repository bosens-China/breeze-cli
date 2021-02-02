import { isProduction, getLinuxPath, getFileNmae, getDirName, isSuffix, getAbsolutePath } from '../../utils/base';

const value = 'c:\\test\\1.txt';

test('测试 isProduction', () => {
  process.env.NODE_ENV = 'production';
  expect(isProduction()).toBeTruthy();
});

test('getLinuxPath', () => {
  expect(getLinuxPath(value)).toBe('c:/test/1.txt');
});

test('getFileNmae', () => {
  expect(getFileNmae(value)).toBe('1.txt');
  expect(getFileNmae(value, true)).toBe('1');
  expect(getFileNmae('c:\\test\\1', true)).toBe('1');
});

test('getDirName', () => {
  expect(getDirName(value)).toBe('test');
});

test('isSuffix', () => {
  expect(isSuffix(value)).toBeTruthy();
});

test('isSuffix', () => {
  expect(getAbsolutePath(value).length).toBe(value.length);
  expect(getAbsolutePath('1.txt')).not.toBe('1.txt');
});
