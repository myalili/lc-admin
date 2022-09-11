const requireComponents = require.context('./', true, /\.vue/);
const exportComponents = {};
requireComponents.keys().map(key => {
  if (key.endsWith('index.vue')) {
    let comp = requireComponents(key).default
    exportComponents[comp.name] = requireComponents(key).default
  }

});
export default exportComponents