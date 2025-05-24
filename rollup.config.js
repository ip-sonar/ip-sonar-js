import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

// Read version from package.json
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    replace({
      '__SDK_VERSION__': JSON.stringify(pkg.version),
      preventAssignment: true,
    }),
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      rootDir: './src',
    }),
  ],
  external: [],
}; 