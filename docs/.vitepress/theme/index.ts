import DevUI from '../../../packages/devui-vue/devui/vue-devui';
import Locale from '../../../packages/devui-vue/devui/locale'
import Theme from '../devui-theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { registerComponents } from './register-components.js'
import { insertBaiduScript } from './insert-baidu-script'

export default {
  ...Theme,
  enhanceApp({ app }) {
    // app.use(Locale).use(DevUI)
    app.use(DevUI)
    registerComponents(app)
    insertBaiduScript()
  }
}
