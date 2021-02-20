import typescript from '@rollup/plugin-typescript';
// 压缩
// import { terser } from 'rollup-plugin-terser';
// 删除
import clean from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';

import commonjs from '@rollup/plugin-commonjs';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import { string } from 'rollup-plugin-string';
import { dependencies, devDependencies } from './package.json';

const DIR = 'dist';
const arr = [
  { src: 'src/main.ts', dest: `${DIR}/main.js` },
  { src: 'src/webpack/loader/njk-loader.ts', dest: `${DIR}/njk-loader.js` },
];

const App = (obj) => {
  const external = [...Object.keys(dependencies), ...Object.keys(devDependencies), 'path', 'os'];
  const base = {
    plugins: [
      json(),
      commonjs(),
      // 必须转为cjs的格式
      typescript({
        target: 'es5',
        module: 'ESNext',
      }),
      // terser(),
      string({
        include: './src/string/*',
      }),
      preserveShebangs(),
    ],
    // 告诉rollup不要讲第三方模板打包进来
    external,
  };
  return obj.map((item, index) => {
    const value = {
      ...base,
      input: item.src,
      output: {
        file: item.dest,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
    };
    if (index === 0) {
      value.plugins.push(clean({ targets: `${DIR}/*` }));
    } else {
      value.plugins.pop();
    }
    return value;
  });
};
export default App(arr);
