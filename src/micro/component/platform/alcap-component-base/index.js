import Vue from "vue";
import baseConfig from "./base-config/index.vue";
import baseComponent from "./base-component/index.vue";
import baseStyle from "./base-style/index.vue";
import baseDrag from "./base-drag/index.vue";
import typeCustom from "./type-custom/index.js";

Vue.component(baseConfig.name, baseConfig);
Vue.component(baseComponent.name, baseComponent);
Vue.component(baseStyle.name, baseStyle);
Vue.component(baseDrag.name, baseDrag);

for (const key in typeCustom) {
  Vue.component(typeCustom[key].name, typeCustom[key]);
}
