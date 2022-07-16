import Vue from 'vue'
// import DouluoUI from '@douluo-ui/components'

import DouluoUI from '../dist/douluo-ui.es'
import App from './App.vue'



Vue.use(DouluoUI)

const app = new Vue({ render: h => h(App) })
app.$mount('#play')
