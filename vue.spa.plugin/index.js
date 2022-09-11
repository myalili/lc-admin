


import * as comApi from "./store/comApi"

import mixins, { _import, _require } from './mixin'
import components from './components'
import axiosUtil from './util/axiosUtil';
import _preview from './util/preview'

const install = function (Vue, opts = {}) {


  axiosUtil(Vue);

  for (let i in components) {
    Vue.component(components[i].name, components[i])
  }
  if (opts.mixin) {
    Vue.mixin(opts.mixin);
  }


};
export { mixins, _import, _require, _preview };
// window.V8.mixins = mixins;
// window.V8._import = _import;
// window.V8._require = _require;
// window.V8._preview = _preview;

if (window.Vue) {
  for (let i in components) {
    window.Vue.component(components[i].name, components[i])
  }
}
const t = {
  install,
  ...components,
  mixins,
  _import,
  _preview,
  _require,
  ...comApi,
  ...window.V8
};
window.V8 = {...t,...comApi,...window.V8}
export default t;

