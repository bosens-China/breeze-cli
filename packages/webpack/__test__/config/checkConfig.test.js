import { check } from '../../config/checkConfig';

test('check 函数校验', async () => {
  await expect(
    check({ name: 1 }, { name: { type: 'string', message: 'name类型为string', required: true } }),
  ).rejects.toThrow('name类型为string');
});
