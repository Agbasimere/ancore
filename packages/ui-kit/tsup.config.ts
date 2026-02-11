import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Skip DTS generation due to path resolution issues
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});

