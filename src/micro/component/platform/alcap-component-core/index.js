
import Vue from 'vue';

const requireComponents = require.context('./', true, /\.vue/);
const exportComponents = {};
requireComponents.keys().map(key => {
  if (key.endsWith('index.vue')) {
    let comp = requireComponents(key).default
    exportComponents[comp.name] = requireComponents(key).default
  }

});
console.log('需要注册的组件', exportComponents);
for (const key in exportComponents) {
  Vue.component(exportComponents[key].name, exportComponents[key]);
}






