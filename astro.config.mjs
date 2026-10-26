// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bouldercircuscenter.net',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
