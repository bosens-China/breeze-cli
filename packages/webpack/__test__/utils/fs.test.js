import { isExistence } from '../../utils/fs';
import path from 'path';

test('isExistence', () => {
  const value = path.join(__dirname, './fs.test.js');
  expect(isExistence(value)).toBeTruthy();
});
