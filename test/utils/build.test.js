import { build } from '../../utils/build';

test('build测试', async () => {
  const code = 'let a = 5; console.log(a)';
  const c = await build(code);
  expect(c).not.toMatch(/let/);
  expect(c).toMatch(/var/);
});
