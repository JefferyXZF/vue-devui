import path from 'path';
import svgLoader from 'vite-svg-loader';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@devui', replacement: path.resolve(__dirname, '../packages/devui-vue/devui') }],
  },
  plugins: [
    vueJsx({}),
    svgLoader()
  ],
  server: {
    fs: {
      strict: false,
    },
  }
});
