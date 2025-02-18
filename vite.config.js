import { defineConfig } from 'vite';
import ghPages from 'vite-plugin-gh-pages/lib';

export default defineConfig({
  base: '/model-loader/',
  plugins: [ghPages()]
});
