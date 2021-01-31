import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import clean from 'rollup-plugin-delete';
const dir = 'dist';

export default {
  input: 'src/main.ts',
  output: {
    file: `${dir}/main.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [typescript(), terser(), clean({ targets: `${dir}/*` })],
};
