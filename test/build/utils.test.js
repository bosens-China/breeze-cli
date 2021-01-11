import { getAbsolutePath, getFileName, equalPaths, identicalName } from '../../build/utils';
import path from 'path';

test('路径测试', () => {
  expect(path.isAbsolute(getAbsolutePath('abc'))).toBeTruthy();
});

test('获取文件路径', () => {
  expect(getFileName('c:/test/name.txt')).toBe('name.txt');
});

test('路径对比', () => {
  const a = 'c:/1.txt';
  const b = 'c:\\1.txt';
  expect(equalPaths(a, b)).toBeTruthy();
  expect(equalPaths('./1.txt', 'b/1.txt')).toBeFalsy();
});

test('文件名判断', () => {
  const a = ['c:/1.txt'];
  expect(identicalName(a, '1.txt')).toBeTruthy();
});
