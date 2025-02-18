import { defineConfig } from 'vite';
import ghPages from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/model-loader/',
  plugins: [ghPages()]
});
