import _default from "./src/index.vue";

_default.install = (Vue, options = {}) => {
  Vue.component('button', _default);
};

export default _default;
