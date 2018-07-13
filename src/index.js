import Alert from '../packages/alert/index.js';
import Aside from '../packages/aside/index.js';

const components = [
  Alert,
  Aside
];

const install = function (Vue, opts = {}) {
  components.map((component) => {
    Vue.component(component.name, component);
    return true;
  });

  Vue.prototype.$PANG = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000,
  };
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  version: '0.1.0',
  install,
  Alert,
  Aside
};

module.exports.default = module.exports;
