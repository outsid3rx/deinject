import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  external: ['h3', 'tslib'],
  plugins: [
    nodeResolve({ extensions: ['.ts'] }),
    typescript(),
    babel({
      babelHelpers: 'inline',
      extensions: ['.ts'],
    }),
  ],
}
