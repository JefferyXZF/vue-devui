
import Button from './button/index'
import Alert from './alert/index';

const components = [
  Button,
  Alert
]

const install = function (Vue, opt = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

}

export default {
  install,
  Button,
  Alert
}
