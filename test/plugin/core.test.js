import { isCssFile, isHotFile, formatCss, formatJs, formatHtml, minifyCss, minifyJs } from '../../plugin/core/utils';

test('iscss', () => {
  expect(isCssFile('__css_.style.css.js')).toBeTruthy();
});

test('ishot', () => {
  expect(isHotFile('__hot_.style.js')).toBeTruthy();
});

test('格式化css', () => {
  const value = '.a{color:red}';
  expect(formatCss(value)).not.toBe(value);
});
test('格式化js', () => {
  const value = 'var a=5';
  expect(formatJs(value)).not.toBe(value);
});

test('格式化html', () => {
  const value = '<h1>\n\n\n\nabc</h1>';
  expect(formatHtml(value)).not.toBe(value);
});

test('缩小css', async () => {
  const value = '.a  {color: \n red}';
  const min = await minifyCss(value);
  expect(min).not.toBe(value);
});
test('缩小js', () => {
  const value = 'var a =     5;';
  expect(minifyJs(value)).not.toBe(value);
});
