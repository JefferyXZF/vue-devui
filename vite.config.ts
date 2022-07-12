import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2';
// import ScriptSetup from 'unplugin-vue2-script-setup/vite';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@devui', replacement: path.resolve(__dirname, './packages/devui-vue') }],
  },
  plugins: [
    Vue2({
      // jsx: true
    }),
    // ScriptSetup({
    //   // reactivityTransform: true
    // })
  ]
});
